/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/fl/Utils"],function(L,U){"use strict";var C=function(p){if(!p.name){L.error("sap.ui.fl.registry.ChangeType: Name required");}if(!p.changeHandler){L.error("sap.ui.fl.registry.ChangeType: ChangeHandler required");}this._name=p.name;this._changeHandler=p.changeHandler;this._layers=p.layers;if(p.labelKey){this._labelKey=p.labelKey;}if(p.tooltipKey){this._tooltipKey=p.tooltipKey;}if(p.iconKey){this._iconKey=p.iconKey;}if(p.sortIndex){this._sortIndex=p.sortIndex;}};C.prototype._name="";C.prototype._changeHandler="";C.prototype._layers=[];C.prototype._sortIndex=0;C.prototype._labelKey="";C.prototype._tooltipKey="";C.prototype._iconKey="";C.prototype.getName=function(){return this._name;};C.prototype.getChangeHandler=function(){var p=new U.FakePromise();if(typeof this._changeHandler==="string"){p=U.requireAsync(this._changeHandler.replace(/\./g,"/")).then(function(c){this._changeHandler=c;}.bind(this));}return p.then(function(){if(!this._changeHandler||typeof this._changeHandler.completeChangeContent!=="function"||typeof this._changeHandler.applyChange!=="function"||typeof this._changeHandler.revertChange!=="function"){return Promise.reject(new Error("The ChangeHandler is either not available or does not fulfill all needed requirements"));}return this._changeHandler;}.bind(this));};C.prototype.getLayers=function(){return this._layers;};C.prototype.getLabel=function(){return this._labelKey;};C.prototype.getTooltip=function(){return this._tooltipKey;};C.prototype.getIcon=function(){return this._iconKey;};C.prototype.getSortIndex=function(){return this._sortIndex;};return C;},true);
