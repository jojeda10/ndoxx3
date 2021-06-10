/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/Dialog","sap/m/Text","sap/m/Button","sap/m/Input","sap/ui/fl/support/apps/contentbrowser/lrepConnector/LRepConnector","sap/ui/fl/support/apps/contentbrowser/utils/DataUtils","sap/m/library"],function(C,D,T,B,I,L,a,m){"use strict";var b=m.ButtonType;return C.extend("sap.ui.fl.support.apps.contentbrowser.controller.ContentDetails",{oSelectedContentModel:undefined,oDataUtils:a,onInit:function(){this._initAndBindSelectedContentModel();var r=sap.ui.core.UIComponent.getRouterFor(this);r.getRoute("ContentDetails").attachMatched(this._onRouteMatched,this);r.getRoute("ContentDetailsFlip").attachMatched(this._onRouteMatched,this);},_initAndBindSelectedContentModel:function(){this.oSelectedContentModel=new sap.ui.model.json.JSONModel();this.getView().setModel(this.oSelectedContentModel,"selectedContent");},_onRouteMatched:function(r){var t=this;var R=r.getParameter("arguments");var M={};M.layer=R.layer;M.namespace=decodeURIComponent(R.namespace);M.fileName=R.fileName;M.fileType=R.fileType;if(M.namespace[M.namespace.length-1]!=="/"){M.namespace+="/";}var c=M.namespace+M.fileName+"."+M.fileType;var p=t.getView().getContent()[0];p.setBusy(true);return L.getContent(M.layer,c,null,null,true).then(t._onContentReceived.bind(t,M,p,c),function(){p.setBusy(false);});},_onContentReceived:function(M,p,c,d){var t=this;M.data=a.formatData(d,M.fileType);if(M.fileType){return L.getContent(M.layer,c,true).then(t._onContentMetadataReceived.bind(t,M,p),function(){p.setBusy(false);});}return Promise.resolve();},_onContentMetadataReceived:function(M,p,o){M.metadata=o;this.oSelectedContentModel.setData(M);var c=sap.ui.getCore();var i=this.getView().createId("contentDetailsIconTabBar");var d=c.getElementById(i);if(d){var f=d.getItems()[0];if(d.getSelectedKey()!==f.getId()){d.setSelectedItem(f);}}p.setBusy(false);},onEditClicked:function(){var s=this.getView().getModel("selectedContent");var c=s.getData();var r=sap.ui.core.UIComponent.getRouterFor(this);r.navTo("ContentDetailsEdit",{layer:c.layer,namespace:encodeURIComponent(c.namespace),fileName:c.fileName,fileType:c.fileType});},onDeleteClicked:function(){var t=this;var d=new D({title:"{i18n>confirmDeletionTitle}",type:"Message",content:new T({text:"{i18n>questionFileDeletion}"}),beginButton:new B({text:"{i18n>confirm}",type:b.Reject,press:function(){d.close();t._selectTransportAndDeleteFile();}}),endButton:new B({text:"{i18n>cancel}",press:function(){d.close();}}),afterClose:function(){d.destroy();}});this.getView().addDependent(d);d.open();},_selectTransportAndDeleteFile:function(){var t=this;var s=this.getView().getModel("selectedContent");var c=s.getData();var S=c.layer;var d="";var f;var p;var g;c.metadata.some(function(M){if(M.name==="layer"){d=M.value;return true;}});c.metadata.some(function(M){if(M.name==="transportId"){f=M.value;return true;}});try{p=JSON.parse(c.data).packageName;}catch(e){}var n=c.namespace;var F=c.fileName;var h=c.fileType;if((d==="USER")||(d==="LOAD")||(d==="VENDOR_LOAD")||(!f&&(!p||p==="$TMP"))){g=undefined;t._deleteFile(d,n,F,h,g,S);}else if(f==="ATO_NOTIFICATION"){g=f;t._deleteFile(d,n,F,h,g,S);}else{var o=new I({placeholder:"Transport ID or ATO_NOTIFICATION"});var i=new D({title:"{i18n>transportInput}",type:"Message",content:[new T({text:"{i18n>transportInputDescription}"}),o],beginButton:new B({text:"{i18n>confirm}",type:b.Accept,press:function(){g=o.getValue();i.close();t._deleteFile(d,n,F,h,g,S);}}),endButton:new B({text:"{i18n>cancel}",press:function(){i.close();}}),afterClose:function(){i.destroy();}});this.getView().addDependent(i);i.open();}},_deleteFile:function(l,n,f,F,t,s){return L.deleteFile(l,n,f,F,t,s).then(function(){var r=sap.ui.core.UIComponent.getRouterFor(this);r.navTo("LayerContentMaster",{layer:s,namespace:encodeURIComponent(n)});}.bind(this));}});});