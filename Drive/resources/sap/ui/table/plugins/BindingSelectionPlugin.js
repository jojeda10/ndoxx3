/*
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./SelectionPlugin',"../utils/TableUtils",'../library'],function(S,T,l){"use strict";var a=l.SelectionMode;var B=S.extend("sap.ui.table.plugins.BindingSelectionPlugin",{metadata:{library:"sap.ui.table",events:{selectionChange:{parameters:{indices:{type:"int[]"},selectAll:{type:"boolean"}}}}},constructor:function(t){this._oTable=t;S.call(this);}});B.prototype.exit=function(){S.prototype.exit.apply(this,arguments);var b=this._getBinding();if(b){b.detachChange(this._onBindingChange,this);}};B.prototype.getRenderConfig=function(){return{headerSelector:{type:"toggle",visible:T.hasSelectAll(this._oTable)}};};B.prototype.onHeaderSelectorPress=function(){if(this.getRenderConfig().headerSelector.visible){this._oTable._toggleSelectAll();}};B.prototype.onKeyboardShortcut=function(t){if(t==="toggle"){this._oTable._toggleSelectAll();}else if(t==="clear"){this.clearSelection();}};B.prototype.addSelectionInterval=function(i,I){if(this._getSelectionMode()===a.None){return;}var b=this._getBinding();if(b&&b.addSelectionInterval){if(this._getSelectionMode()===a.Single){i=I;b.setSelectionInterval(i,I);}b.addSelectionInterval(i,I);}};B.prototype.clearSelection=function(){var b=this._getBinding();if(b&&b.clearSelection){b.clearSelection();}};B.prototype.getSelectedIndex=function(){var b=this._getBinding();if(b&&b.findNode){return b.getSelectedIndex();}else{return-1;}};B.prototype.getSelectedIndices=function(){var b=this._getBinding();if(b&&b.findNode&&b.getSelectedIndices){return b.getSelectedIndices();}else{return[];}};B.prototype.getSelectableCount=function(){var b=this._getBinding();if(!b){return 0;}else if(b.getGrandTotalContextInfo){var r=b.getGrandTotalContextInfo();return r?r.totalNumberOfLeafs:0;}else{return b.getLength();}};B.prototype.getSelectedCount=function(){var b=this._getBinding();if(b&&b.getSelectedNodesCount){return b.getSelectedNodesCount();}else{return 0;}};B.prototype.isIndexSelectable=function(i){var b=this._getBinding();if(b){return b.isIndexSelectable(i);}else{return false;}};B.prototype.isIndexSelected=function(i){var b=this._getBinding();if(b&&b.isIndexSelected){return b.isIndexSelected(i);}else{return false;}};B.prototype.removeSelectionInterval=function(i,I){var b=this._getBinding();if(b&&b.findNode&&b.removeSelectionInterval){b.removeSelectionInterval(i,I);}};B.prototype.selectAll=function(){if(this._getSelectionMode()===a.None){return;}var b=this._getBinding();if(b&&b.selectAll){b.selectAll();}};B.prototype.setSelectedIndex=function(i){if(this._getSelectionMode()===a.None){return;}if(i===-1){this.clearSelection();}else{var b=this._getBinding();if(b&&b.setSelectedIndex){b.setSelectedIndex(i);}}};B.prototype.setSelectionInterval=function(i,I){if(this._getSelectionMode()===a.None){return;}var b=this._getBinding();if(b&&b.setSelectionInterval){if(this._getSelectionMode()===a.Single){i=I;}b.setSelectionInterval(i,I);}};B.prototype.setSelectionMode=function(s){var o=this._getSelectionMode();S.prototype._setSelectionMode.apply(this,arguments);if(this._getSelectionMode()!==o){this.clearSelection();}return this;};B.prototype._setBinding=function(b){var c=this._getBinding();S.prototype._setBinding.call(this,b);if(c!==b){if(b){b.attachChange(this._onBindingChange,this);b.attachSelectionChanged(this._onSelectionChange,this);}if(c){c.detachChange(this._onBindingChange,this);c.detachSelectionChanged(this._onSelectionChange,this);}}};B.prototype._onBindingChange=function(e){var r=typeof(e)==="object"?e.getParameter("reason"):e;if(r==="sort"||r==="filter"){this.clearSelection();}};B.prototype._onSelectionChange=function(e){var r=e.getParameter("rowIndices");var s=e.getParameter("selectAll");this.fireSelectionChange({rowIndices:r,selectAll:s});};return B;});
