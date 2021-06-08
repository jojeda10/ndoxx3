/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/rta/command/BaseCommand","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/Utils"],function(B,J,f){"use strict";var C=B.extend("sap.ui.rta.command.ControlVariantDuplicate",{metadata:{library:"sap.ui.rta",properties:{sourceVariantReference:{type:"string"},newVariantReference:{type:"string"},newVariantTitle:{type:"string"}},associations:{},events:{}}});C.prototype.prepare=function(F){this.sLayer=F.layer;return true;};C.prototype.getPreparedChange=function(){if(!this._aPreparedChanges){return undefined;}return this._aPreparedChanges;};C.prototype.execute=function(){var v=this.getElement();var s=this.getSourceVariantReference();var n=this.getNewVariantReference();this.oAppComponent=f.getAppComponentForControl(v);if(!n){n=f.createDefaultFileName();this.setNewVariantReference(n);}this.sVariantManagementReference=J.getSelector(v,this.oAppComponent).id;this.oModel=this.oAppComponent.getModel(f.VARIANT_MODEL_NAME);var p={variantManagementReference:this.sVariantManagementReference,appComponent:this.oAppComponent,layer:this.sLayer,newVariantReference:n,sourceVariantReference:s,title:this.getNewVariantTitle()};return this.oModel.copyVariant(p).then(function(c){this._oVariantChange=c[0];this._aPreparedChanges=c;}.bind(this));};C.prototype.undo=function(){if(this._oVariantChange){var p={variant:this._oVariantChange,sourceVariantReference:this.getSourceVariantReference(),variantManagementReference:this.sVariantManagementReference,component:this.oAppComponent};return this.oModel.removeVariant(p).then(function(){this._oVariantChange=null;this._aPreparedChanges=null;}.bind(this));}return Promise.resolve();};return C;});
