/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/ui/support/supportRules/Constants"],function(q,B,c){"use strict";var _=[];var a=function(i){var e=sap.ui.getCore().byId(i.context.id),d="";if(i.context.id==="WEBPAGE"){d="sap.ui.core";}else if(e){d=e.getMetadata().getName();}return{severity:i.severity,name:i.rule.title,description:i.rule.description,resolution:i.rule.resolution,resolutionUrls:i.rule.resolutionurls,audiences:i.rule.audiences,categories:i.rule.categories,details:i.details,ruleLibName:i.rule.libName,ruleId:i.rule.id,async:i.rule.async===true,minVersion:i.rule.minversion,context:{className:d,id:i.context.id}};};var I={addIssue:function(i){_.push(i);},walkIssues:function(C){_.forEach(C);},clearIssues:function(){_=[];},getIssues:function(){return _.slice();},getIssuesModel:function(){var v=[];this.walkIssues(function(i){v.push(a(i));});return v;},getRulesViewModel:function(r,s,i){var d={},e=0,g={},l={},f={},h=q.extend(true,{},r),j=q.extend(true,{},i);for(g in h){d[g]=q.extend(true,{},h[g].ruleset._mRules);l=d[g];Object.defineProperty(l,'selected',{enumerable:false,configurable:true,writable:true,value:false});Object.defineProperty(l,'issueCount',{enumerable:false,configurable:true,writable:true,value:0});for(f in h[g].ruleset._mRules){l[f]=q.extend(true,[],l[f]);Object.defineProperty(l[f],'selected',{enumerable:false,configurable:true,writable:true,value:false});Object.defineProperty(l[f],'issueCount',{enumerable:false,configurable:true,writable:true,value:0});if(s[f]){l[f].selected=true;l.selected=true;}if(j[g]&&j[g][f]){l[f].push.apply(l[f],j[g][f]);e=j[g][f].length;l[f].issueCount=e;l.issueCount+=e;}}}return d;},getTreeTableViewModel:function(r){var i=0,d=0,t={},e,f,g=[];e=this.getRulesViewModel(r,[],[]);for(var l in e){t[i]={name:l,id:l+" "+i,selected:true,type:"lib",nodes:g};for(var h in e[l]){f=e[l][h];g.push({name:f.title,description:f.description,id:f.id,audiences:f.audiences.toString(),categories:f.categories.toString(),minversion:f.minversion,resolution:f.resolution,title:f.title,libName:l,selected:true});d++;}g=[];i++;}return t;},getIssuesViewModel:function(i){var t={},d=0,e=0,f=0,s,h=0,m=0,l=0;for(var g in i){t[d]={name:g,showAudiences:false,showCategories:false,type:"lib"};for(var r in i[g]){s=this._sortSeverityIssuesByPriority(i[g][r]);t[d][e]={formattedName:this._getFormattedName({name:i[g][r][0].name,highCount:s.high,mediumCount:s.medium,lowCount:s.low,highName:'H',mediumName:'M',lowName:'L'}),name:i[g][r][0].name,showAudiences:true,showCategories:true,categories:i[g][r][0].categories.join(", "),audiences:i[g][r][0].audiences.join(", "),issueCount:i[g][r].length,description:i[g][r][0].description,resolution:i[g][r][0].resolution,type:"rule",ruleLibName:i[g][r][0].ruleLibName,ruleId:i[g][r][0].ruleId,selected:i[g][r][0].selected,details:i[g][r][0].details,severity:i[g][r][0].severity};f+=i[g][r].length;e++;h+=s.high;m+=s.medium;l+=s.low;}t[d].formattedName=this._getFormattedName({name:t[d].name,highCount:h,mediumCount:m,lowCount:l,highName:'High',mediumName:'Medium',lowName:'Low'});t[d].name+=" ("+f+" issues)";t[d].issueCount=f;f=0;e=0;d++;h=0;m=0;l=0;}return t;},_getFormattedName:function(v){var h="",m="",l="";if(v.highCount>0){h="color: "+c.SUPPORT_ASSISTANT_SEVERITY_HIGH_COLOR+";";}if(v.mediumCount>0){m="color: "+c.SUPPORT_ASSISTANT_SEVERITY_MEDIUM_COLOR+";";}if(v.lowCount>0){l="color: "+c.SUPPORT_ASSISTANT_SEVERITY_LOW_COLOR+";";}return v.name+" (<span style=\""+h+"\"> "+v.highCount+" "+v.highName+", </span> "+"<span style=\""+m+"\"> "+v.mediumCount+" "+v.mediumName+", </span> "+"<span style=\""+l+"\"> "+v.lowCount+" "+v.lowName+"</span> )";},_sortSeverityIssuesByPriority:function(i){var h=0,m=0,l=0;i.forEach(function(e){switch(e.severity){case c.SUPPORT_ASSISTANT_ISSUE_SEVERITY_LOW:l++;break;case c.SUPPORT_ASSISTANT_ISSUE_SEVERITY_MEDIUM:m++;break;case c.SUPPORT_ASSISTANT_ISSUE_SEVERITY_HIGH:h++;break;}});return{high:h,medium:m,low:l};},convertToViewModel:function(o){var v=[];for(var i=0;i<o.length;i++){v.push(a(o[i]));}return v;},groupIssues:function(o){var g={},d={};for(var i=0;i<o.length;i++){d=o[i];if(!g[d.ruleLibName]){g[d.ruleLibName]={};}if(!g[d.ruleLibName][d.ruleId]){g[d.ruleLibName][d.ruleId]=[];}g[d.ruleLibName][d.ruleId].push(d);}return g;},createIssueManagerFacade:function(r){return new b(r);}};var b=function(r){this.oRule=r;};b.prototype.addIssue=function(i){i.rule=this.oRule;if(!sap.ui.support.Severity[i.severity]){throw"The issue from rule "+this.oRule.title+" does not have proper severity defined. Allowed values can be found"+"in sap.ui.support.Severity";}if(!i.context||!i.context.id){throw"The issue from rule '"+this.oRule.title+"' should provide a context id.";}if(!i.details){throw"The issue from rule '"+this.oRule.title+"' should provide details for the generated issue.";}I.addIssue(i);};return I;},true);
