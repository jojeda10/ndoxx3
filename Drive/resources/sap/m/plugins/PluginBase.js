/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element"],function(E){"use strict";var P=E.extend("sap.m.plugins.PluginBase",{metadata:{"abstract":true,library:"sap.m",properties:{enabled:{type:"boolean",defaultValue:true}}}});var p={};P.setConfig=function(c,v){var s=(typeof v=="function")?v.getMetadata().getName():P.getMetadata().getName();Object.assign(p[s]=p[s]||{},c);};P.prototype.getControl=function(){return this.getParent();};P.prototype.getControlPluginConfig=function(k,d){var c=this.getControl();if(!c){return d;}var s=this.getMetadata().getName();var C=c.getMetadata().getName();var m=p[s]||{};var a=m[C]||{};if(k in a){return a[k];}for(var b in m){if(c.isA(b)&&k in m[b]){return m[b][k];}}var e=P.getMetadata().getName();var g=p[e]||{};var G=g[C]||{};if(k in G){return G[k];}for(var b in g){if(c.isA(b)&&k in g[b]){return g[b][k];}}return d;};P.prototype.isApplicable=function(c){return c.isA("sap.ui.core.Control");};P.prototype.onActivate=function(c){};P.prototype.onDeactivate=function(c){};P.prototype.setParent=function(o){if(this.getEnabled()&&this.getControl()){this._deactivate();}E.prototype.setParent.apply(this,arguments);if(o&&this.getEnabled()){if(!this.isApplicable(o)){throw new Error(this+" is not an applicable plug-in for "+o);}else{this._activate();}}return this;};P.prototype.setEnabled=function(e){var o=this.getEnabled();this.setProperty("enabled",e,true);var n=this.getEnabled();if(n!=o&&this.getControl()){if(n){this._activate();}else{this._deactivate();}}return this;};P.prototype.setProperty=function(s,v,S){S=S||(this.getMetadata().getProperty(s).appData||{}).invalidate===false;return E.prototype.setProperty.call(this,s,v,S);};P.prototype._activate=function(){this.onActivate(this.getControl());};P.prototype._deactivate=function(){this.onDeactivate(this.getControl());};return P;});
