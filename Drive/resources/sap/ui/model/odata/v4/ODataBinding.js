/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./lib/_Helper","sap/ui/base/SyncPromise","sap/ui/model/ChangeReason","sap/ui/model/odata/OperationMode","sap/ui/model/odata/v4/Context","sap/ui/thirdparty/jquery"],function(_,S,C,O,a,q){"use strict";var c=[C.Change,C.Refresh,C.Sort,C.Filter],s="sap.ui.model.odata.v4.ODataBinding",r=/\/\d|\(\$uid=/;function b(){this.mCacheByResourcePath=undefined;this.oCache=null;this.oCachePromise=S.resolve(null);this.mCacheQueryOptions=undefined;this.oFetchCacheCallToken=undefined;this.sReducedPath=undefined;this.sResumeChangeReason=C.Change;}b.prototype.checkBindingParameters=function(p,A){var t=this;Object.keys(p).forEach(function(k){var v=p[k];if(k.indexOf("$$")!==0){return;}if(A.indexOf(k)<0){throw new Error("Unsupported binding parameter: "+k);}switch(k){case"$$aggregation":break;case"$$groupId":case"$$updateGroupId":t.oModel.checkGroupId(v,false,"Unsupported value for binding parameter '"+k+"': ");break;case"$$inheritExpandSelect":if(v!==true&&v!==false){throw new Error("Unsupported value for binding parameter "+"'$$inheritExpandSelect': "+v);}if(!t.oOperation){throw new Error("Unsupported binding parameter $$inheritExpandSelect: "+"binding is not an operation binding");}if(p.$expand||p.$select){throw new Error("Must not set parameter $$inheritExpandSelect on a binding "+"which has a $expand or $select binding parameter");}break;case"$$operationMode":if(v!==O.Server){throw new Error("Unsupported operation mode: "+v);}break;case"$$canonicalPath":case"$$ownRequest":case"$$patchWithoutSideEffects":if(v!==true){throw new Error("Unsupported value for binding parameter '"+k+"': "+v);}break;default:throw new Error("Unknown binding-specific parameter: "+k);}});};b.prototype.checkSuspended=function(){var R=this.getRootBinding();if(R&&R.isSuspended()){throw new Error("Must not call method when the binding's root binding is suspended: "+this);}};b.prototype.checkUpdate=function(f){var t=this;if(arguments.length>1){throw new Error("Only the parameter bForceUpdate is supported");}this.checkUpdateInternal(f).catch(function(e){t.oModel.reportError("Failed to update "+t,s,e);});};b.prototype.destroy=function(){this.mCacheByResourcePath=undefined;this.oCachePromise.then(function(o){if(o){o.setActive(false);}},function(){});this.oCache=null;this.oCachePromise=S.resolve(null);this.mCacheQueryOptions=undefined;this.oContext=undefined;this.oFetchCacheCallToken=undefined;};b.prototype.doDeregisterChangeListener=function(p,l){this.oCache.deregisterChange(p,l);};b.prototype.fetchCache=function(o){var e,f={},p,t=this;if(!this.bRelative){o=undefined;}if(this.oCache){this.oCache.setActive(false);}this.oCache=undefined;p=[this.fetchQueryOptionsForOwnCache(o),this.oModel.oRequestor.ready()];this.mCacheQueryOptions=undefined;e=S.all(p).then(function(R){var Q=R[0].mQueryOptions;t.sReducedPath=R[0].sReducedPath;if(Q&&!(o&&o.iIndex===a.VIRTUAL)){return t.fetchResourcePath(o).then(function(g){var h,D,E,i;if(!e||t.oFetchCacheCallToken===f){t.mCacheQueryOptions=q.extend(true,{},t.oModel.mUriParameters,Q);if(t.bRelative){t.mCacheByResourcePath=t.mCacheByResourcePath||{};h=t.mCacheByResourcePath[g];i=o.getReturnValueContextId&&o.getReturnValueContextId();if(h&&h.$returnValueContextId===i){h.setActive(true);}else{D=_.buildPath(o.getPath(),t.sPath).slice(1);h=t.doCreateCache(g,t.mCacheQueryOptions,o,D);t.mCacheByResourcePath[g]=h;h.$deepResourcePath=D;h.$resourcePath=g;h.$returnValueContextId=i;}}else{h=t.doCreateCache(g,t.mCacheQueryOptions,o);}t.oCache=h;return h;}else{E=new Error("Cache discarded as a new cache has been created");E.canceled=true;throw E;}});}t.oCache=null;return null;});e.catch(function(E){t.oModel.reportError("Failed to create cache for binding "+t,s,E);});this.oCachePromise=e;this.oFetchCacheCallToken=f;};b.prototype.fetchQueryOptionsForOwnCache=function(o){var h,Q,R=this.oModel.resolve(this.sPath,o),t=this;function w(v,e){return S.resolve(v).then(function(m){return{mQueryOptions:m,sReducedPath:e||R};});}if(this.oOperation||this.bRelative&&!o||this.isMeta()){return w(undefined);}Q=this.doFetchQueryOptions(o);if(this.oModel.bAutoExpandSelect&&this.aChildCanUseCachePromises){Q=S.all([Q,Promise.resolve().then(function(){return S.all(t.aChildCanUseCachePromises);})]).then(function(e){t.aChildCanUseCachePromises=[];t.updateAggregatedQueryOptions(e[0]);return t.mAggregatedQueryOptions;});}if(!this.bRelative||!o.fetchValue){return w(Q);}if(this.oModel.bAutoExpandSelect){h=this.mParameters&&Object.keys(t.mParameters).some(function(k){return k[0]!=="$"||k[1]==="$";});if(h){return w(Q);}return o.getBinding().fetchIfChildCanUseCache(o,t.sPath,Q).then(function(e){return w(e?undefined:Q,e);});}if(this.mParameters&&Object.keys(this.mParameters).length){return w(Q);}return Q.then(function(m){return w(Object.keys(m).length?m:undefined);});};b.prototype.fetchResourcePath=function(o){var e,f,g,t=this;if(!this.bRelative){return S.resolve(this.sPath.slice(1));}o=o||this.oContext;if(!o){return S.resolve();}f=o.getPath();e=o.fetchCanonicalPath&&(this.mParameters&&this.mParameters["$$canonicalPath"]||r.test(f));g=e?o.fetchCanonicalPath():S.resolve(f);return g.then(function(h){return _.buildPath(h,t.sPath).slice(1);});};b.prototype.getGroupId=function(){return this.sGroupId||(this.bRelative&&this.oContext&&this.oContext.getGroupId&&this.oContext.getGroupId())||this.oModel.getGroupId();};b.prototype.getRelativePath=function(p){var R;if(p[0]==="/"){R=_.getRelativePath(p,this.oModel.resolve(this.sPath,this.oContext));if(R===undefined&&this.oReturnValueContext){R=_.getRelativePath(p,this.oReturnValueContext.getPath());}return R;}return p;};b.prototype.getRootBinding=function(){if(this.bRelative&&this.oContext&&this.oContext.getBinding){return this.oContext.getBinding().getRootBinding();}return this.bRelative&&!this.oContext?undefined:this;};b.prototype.getRootBindingResumePromise=function(){var R=this.getRootBinding();return R&&R.getResumePromise()||S.resolve();};b.prototype.getUpdateGroupId=function(){return this.sUpdateGroupId||(this.bRelative&&this.oContext&&this.oContext.getUpdateGroupId&&this.oContext.getUpdateGroupId())||this.oModel.getUpdateGroupId();};b.prototype.hasPendingChanges=function(){return this.hasPendingChangesForPath("")||this.hasPendingChangesInDependents();};b.prototype.hasPendingChangesForPath=function(p){return this.withCache(function(o,e){return o.hasPendingChangesForPath(e);},p,true).unwrap();};b.prototype.hasPendingChangesInCaches=function(R){var t=this;if(!this.mCacheByResourcePath){return false;}return Object.keys(this.mCacheByResourcePath).some(function(e){var o=t.mCacheByResourcePath[e];return o.$deepResourcePath.startsWith(R)&&o.hasPendingChangesForPath("");});};b.prototype.isInitial=function(){throw new Error("Unsupported operation: isInitial");};b.prototype.isRoot=function(){return!this.bRelative||this.oContext&&!this.oContext.getBinding;};b.prototype.isRootBindingSuspended=function(){var R=this.getRootBinding();return R&&R.isSuspended();};b.prototype.lockGroup=function(g,l,m,f){return this.oModel.lockGroup(g||this.getGroupId(),this,l,m,f);};b.prototype.refresh=function(g){if(!this.isRoot()){throw new Error("Refresh on this binding is not supported");}if(this.hasPendingChanges()){throw new Error("Cannot refresh due to pending changes");}this.oModel.checkGroupId(g);this.refreshInternal("",g,true).catch(function(){});};b.prototype.removeCachesAndMessages=function(R,e){var m=this.oModel,f,t=this;if(!e){f=m.resolve(this.sPath,this.oContext);if(f){m.reportBoundMessages(f.slice(1),{});}}if(this.mCacheByResourcePath){Object.keys(this.mCacheByResourcePath).forEach(function(g){var o=t.mCacheByResourcePath[g],D=t.mCacheByResourcePath[g].$deepResourcePath;if(R===""||D===R||D.startsWith(R+"/")||D.startsWith(R+"(")){if(!e){m.reportBoundMessages(o.$deepResourcePath,{});}delete t.mCacheByResourcePath[g];}});}};b.prototype.resetChanges=function(){var p=[];this.checkSuspended();this.resetChangesForPath("",p);this.resetChangesInDependents(p);this.resetInvalidDataState();return Promise.all(p).then(function(){});};b.prototype.resetChangesForPath=function(p,P){P.push(this.withCache(function(o,e){o.resetChangesForPath(e);},p).unwrap());};b.prototype.resetInvalidDataState=function(){};b.prototype.setResumeChangeReason=function(e){if(c.indexOf(e)>c.indexOf(this.sResumeChangeReason)){this.sResumeChangeReason=e;}};b.prototype.toString=function(){return this.getMetadata().getName()+": "+(this.bRelative?this.oContext+"|":"")+this.sPath;};b.prototype.withCache=function(p,P,e,w){var o=e?S.resolve(this.oCache):this.oCachePromise,R,t=this;P=P||"";return o.then(function(f){if(f){R=t.getRelativePath(P);if(R!==undefined){return p(f,R,t);}}else if(f===undefined){return undefined;}else if(t.oOperation){return w?p(null,t.getRelativePath(P),t):undefined;}if(t.isRelative()&&t.oContext&&t.oContext.withCache){return t.oContext.withCache(p,P[0]==="/"?P:_.buildPath(t.sPath,P),e,w);}return undefined;});};function d(p){if(this){b.apply(this,arguments);}else{q.extend(p,b.prototype);}}d.prototype.doDeregisterChangeListener=b.prototype.doDeregisterChangeListener;d.prototype.destroy=b.prototype.destroy;d.prototype.hasPendingChangesForPath=b.prototype.hasPendingChangesForPath;return d;},false);
