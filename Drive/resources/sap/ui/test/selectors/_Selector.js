/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/ManagedObject","sap/ui/test/_OpaLogger"],function($,M,_){"use strict";var a=M.extend("sap.ui.test.selectors._Selector",{constructor:function(){this._oLogger=_.getLogger(this.getMetadata().getName());return M.prototype.constructor.apply(this,arguments);},generate:function(c){var r=this._generate.apply(this,arguments);if(r){if($.isArray(r)){return r.filter(function(s){return s&&(!$.isArray(s)||s.length);}).map(function(i){if($.isArray(i)){return i.map(function(I){return $.extend({},this._createSelectorBase(c,I),I);}.bind(this));}else{return $.extend({},this._createSelectorBase(c,i),i);}}.bind(this));}else{return $.extend(this._createSelectorBase(c,r),r);}}},_isAncestorRequired:function(){return false;},_getAncestor:function(){return null;},_isValidationRootRequired:function(){return false;},_getValidationRoot:function(){return null;},_createSelectorBase:function(c,s){if(s.skipBasic){delete s.skipBasic;return s;}else{var b={controlType:c.getMetadata()._sClassName};var v=this._getControlViewName(c);if(v){b.viewName=v;}return b;}},_getControlViewName:function(c){if(!c){return undefined;}if(c.getViewName){var v=c.getViewName();this._oLogger.debug("Control "+c+" has viewName "+v);return v;}else{return this._getControlViewName(c.getParent());}},_findAncestor:function(c,C,d){if(c){var p=c.getParent();if(p){if(C(p)){return p;}else if(!d){return this._findAncestor(p,C);}}}}});return a;});
