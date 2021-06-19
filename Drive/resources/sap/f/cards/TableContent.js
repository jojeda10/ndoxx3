/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/f/library","sap/ui/base/ManagedObject","sap/m/Table","sap/f/cards/BaseContent","sap/m/Column","sap/m/ColumnListItem","sap/m/Text","sap/m/Link","sap/m/ProgressIndicator","sap/m/ObjectIdentifier","sap/m/ObjectStatus","sap/f/Avatar","sap/ui/core/library","sap/m/library","sap/f/cards/BindingResolver","sap/f/cards/BindingHelper","sap/f/cards/IconFormatter"],function(l,M,R,B,C,a,T,L,P,O,b,A,c,m,d,e,I){"use strict";var f=l.AvatarSize;var V=c.VerticalAlign;var g=m.ListSeparators;var h=m.ListType;var i=l.cards.AreaType;var k=B.extend("sap.f.cards.TableContent",{renderer:{}});k.prototype.exit=function(){B.prototype.exit.apply(this,arguments);if(this._oItemTemplate){this._oItemTemplate.destroy();this._oItemTemplate=null;}};k.prototype._getTable=function(){if(this._bIsBeingDestroyed){return null;}var t=this.getAggregation("_content");if(!t){t=new R({id:this.getId()+"-Table",showSeparators:g.None});this.setAggregation("_content",t);}return t;};k.prototype.setConfiguration=function(o){B.prototype.setConfiguration.apply(this,arguments);if(!o){return this;}if(o.rows&&o.columns){this._setStaticColumns(o.rows,o.columns);return this;}if(o.row&&o.row.columns){this._setColumns(o.row);}return this;};k.prototype._setColumns=function(r){var j=[],t=this._getTable(),n=r.columns;n.forEach(function(p){t.addColumn(new C({header:new T({text:p.title}),width:p.width}));j.push(this._createCell(p));}.bind(this));this._oItemTemplate=new a({cells:j,vAlign:V.Middle});this._oActions.setAreaType(i.ContentItem);this._oActions.attach(r,this);var o={template:this._oItemTemplate};this._bindAggregation("items",t,o);};k.prototype._setStaticColumns=function(r,n){var t=this._getTable();n.forEach(function(o){t.addColumn(new C({header:new T({text:o.title}),width:o.width}));});r.forEach(function(o){var p=new a({vAlign:V.Middle});if(o.cells&&Array.isArray(o.cells)){for(var j=0;j<o.cells.length;j++){p.addCell(this._createCell(o.cells[j]));}}if(o.actions&&Array.isArray(o.actions)){var q=o.actions[0];if(q.type===h.Navigation){p.setType(h.Navigation);}if(q.url){p.attachPress(function(){window.open(q.url,q.target||"_blank");});}}t.addItem(p);}.bind(this));this.fireEvent("_actionContentReady");};k.prototype._createCell=function(o){if(o.url){return new L({text:o.value,href:o.url,target:o.target||"_blank"});}if(o.identifier){var t;if(o.identifier.url){t=e.formattedProperty(o.identifier.url,function(v){if(typeof v==="string"){return true;}return false;});}var j=new O({title:o.value,titleActive:t});if(o.identifier.url){j.attachTitlePress(function(E){var S=E.getSource(),n=S.getBindingContext(),p=S.getModel(),q,u,r;if(n){q=n.getPath();}u=d.resolveValue(o.identifier.url,p,q);r=d.resolveValue(o.identifier.target,p,q);if(u){window.open(u,r||"_blank");}});}return j;}if(o.state){return new b({text:o.value,state:o.state});}if(o.value){return new T({text:o.value});}if(o.icon){var s=e.formattedProperty(o.icon.src,function(v){return I.formatSrc(v,this._sAppId);}.bind(this));return new A({src:s,displayShape:o.icon.shape,displaySize:f.XS});}if(o.progressIndicator){return new P({percentValue:o.progressIndicator.percent,displayValue:o.progressIndicator.text,state:o.progressIndicator.state});}};k.prototype.getInnerList=function(){return this._getTable();};return k;});
