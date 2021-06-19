/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','sap/ui/base/DataType','./ImageRenderer',"sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/base/security/encodeCSS"],function(l,C,D,I,K,q,e){"use strict";var a=l.ImageMode;var b=C.extend("sap.m.Image",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",designtime:"sap/m/designtime/Image.designtime",properties:{src:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},decorative:{type:"boolean",group:"Accessibility",defaultValue:true},alt:{type:"string",group:"Accessibility",defaultValue:null},useMap:{type:"string",group:"Misc",defaultValue:null},densityAware:{type:"boolean",group:"Misc",defaultValue:false},activeSrc:{type:"sap.ui.core.URI",group:"Data",defaultValue:""},mode:{type:"sap.m.ImageMode",group:"Misc",defaultValue:"Image"},backgroundSize:{type:"string",group:"Appearance",defaultValue:"cover"},backgroundPosition:{type:"string",group:"Appearance",defaultValue:"initial"},backgroundRepeat:{type:"string",group:"Appearance",defaultValue:"no-repeat"}},aggregations:{detailBox:{type:'sap.m.LightBox',multiple:false,bindable:"bindable"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{tap:{},press:{},load:{},error:{}},dnd:{draggable:true,droppable:false}}});b._currentDevicePixelRatio=(function(){var r=(window.devicePixelRatio===undefined?1:window.devicePixelRatio);if(r<=1){r=1;}else{r*=2;r=Math.round(r);r/=2;}if(r>2){r=2;}return r;}());b.prototype.onload=function(E){var w,h;if(!this._defaultEventTriggered){this._defaultEventTriggered=true;}this._bVersion2Tried=false;var d=this.$(),o=d[0];if(this.getMode()===a.Background){d.css("background-image","url(\""+e(this._oImage.src)+"\")");}if(!this._isWidthOrHeightSet()){if(this._iLoadImageDensity>1){w=Math.round(o.getBoundingClientRect().width);h=Math.round(o.getBoundingClientRect().height);if((w===o.naturalWidth)&&(h===o.naturalHeight)){d.width(w/this._iLoadImageDensity);}}}d.removeClass("sapMNoImg");this.fireLoad();};b.prototype.onerror=function(E){if(!this._defaultEventTriggered){this._defaultEventTriggered=true;}var $=this.$(),m=this.getMode(),s=(m===a.Image)?this._getDomImg().attr("src"):this._oImage.src,d=b._currentDevicePixelRatio,c=this._isActiveState?this.getActiveSrc():this.getSrc();$.addClass("sapMNoImg");if(!s||this._iLoadImageDensity===1){if(this.getAlt()&&!this.getDecorative()){$.removeClass("sapMNoImg");}this.fireError();return;}if(d===2||d<1){this._iLoadImageDensity=1;this._updateDomSrc(this._generateSrcByDensity(c,1));}else if(d===1.5){if(this._bVersion2Tried){setTimeout(q.proxy(function(){this._iLoadImageDensity=1;this._updateDomSrc(this._generateSrcByDensity(c,1));},this),0);}else{setTimeout(q.proxy(function(){this._iLoadImageDensity=2;this._updateDomSrc(this._generateSrcByDensity(c,2));this._bVersion2Tried=true;},this),0);}}};b.prototype.setDetailBox=function(L){var c=this.getDetailBox();if(L){if(L===c){return this;}if(c){this.detachPress(this._fnLightBoxOpen,c);}this._fnLightBoxOpen=L.open;this.attachPress(this._fnLightBoxOpen,L);}else if(this._fnLightBoxOpen){this.detachPress(this._fnLightBoxOpen,c);this._fnLightBoxOpen=null;}return this.setAggregation("detailBox",L);};b.prototype.clone=function(){var c=C.prototype.clone.apply(this,arguments),o=c.getDetailBox();if(o){c.detachPress(this._fnLightBoxOpen,this.getDetailBox());c._fnLightBoxOpen=o.open;c.attachPress(c._fnLightBoxOpen,o);}return c;};b.prototype.onBeforeRendering=function(){this._defaultEventTriggered=false;if(this.getMode()==a.Image){var d=this.getDetailBox()?this.$().find(".sapMImg"):this.$();d.off("load").off("error");}};b.prototype.onAfterRendering=function(){var d=this.getDetailBox()?this.$().find(".sapMImg"):this.$(),m=this.getMode(),o;if(m===a.Image){d.on("load",q.proxy(this.onload,this));d.on("error",q.proxy(this.onerror,this));o=d[0];}if(m===a.Background){o=this._oImage;}if(o&&o.complete&&!this._defaultEventTriggered){if(o.naturalWidth>0){this.onload({});}else{this.onerror({});}}};b.prototype.exit=function(){if(this._oImage){q(this._oImage).off("load",this.onload).off("error",this.onerror);this._oImage=null;}else{this.$().off("load",this.onload).off("error",this.onerror);}if(this._fnLightBoxOpen){this._fnLightBoxOpen=null;}};b.prototype.ontouchstart=function(E){if(E.srcControl.mEventRegistry["press"]||E.srcControl.mEventRegistry["tap"]){E.setMarked();}if(E.targetTouches.length===1&&this.getActiveSrc()){this._updateDomSrc(this._getDensityAwareActiveSrc());this._isActiveState=true;}};b.prototype.ontouchend=function(E){if(E.targetTouches.length===0&&this.getActiveSrc()){this._isActiveState=false;this._updateDomSrc(this._getDensityAwareSrc());this.$().removeClass("sapMNoImg");}};b.prototype.attachPress=function(){Array.prototype.unshift.apply(arguments,["press"]);C.prototype.attachEvent.apply(this,arguments);if(this.hasListeners("press")){this.$().attr("tabindex","0");this.$().attr("role","button");}return this;};b.prototype.detachPress=function(){Array.prototype.unshift.apply(arguments,["press"]);C.prototype.detachEvent.apply(this,arguments);if(!this.hasListeners("press")){this.$().removeAttr("tabindex");if(this.getDecorative()){this.$().attr("role","presentation");}else{this.$().removeAttr("role");}}return this;};b.prototype.ontap=function(E){this.fireTap({});this.firePress({});};b.prototype.onkeyup=function(E){if(E.which===K.SPACE||E.which===K.ENTER){this.firePress({});E.stopPropagation();}};b.prototype.onsapspace=function(E){E.preventDefault();};b.prototype._updateDomSrc=function(s){var d=this.$(),m=this.getMode();if(d.length){if(m===a.Image){this._getDomImg().attr("src",s);}else{d.addClass("sapMNoImg");q(this._oImage).attr("src",s);}}};b.prototype._getDomImg=function(){var d=this.$();return this.getDetailBox()?d.children("img"):d;};b.prototype._preLoadImage=function(s){if(this.getMode()!==a.Background){return;}var $=q(this._oImage);if(!this._oImage){this._oImage=new window.Image();$=q(this._oImage);$.on("load",q.proxy(this.onload,this)).on("error",q.proxy(this.onerror,this));}this._oImage.src=s;};b.prototype._isWidthOrHeightSet=function(){return(this.getWidth()&&this.getWidth()!=='')||(this.getHeight()&&this.getHeight()!=='');};b.prototype._getDensityAwareSrc=function(){var s=this.getSrc(),c=this.getDensityAware(),d=c?b._currentDevicePixelRatio:1;this._iLoadImageDensity=d;return this._generateSrcByDensity(s,d);};b.prototype._getDensityAwareActiveSrc=function(){var A=this.getActiveSrc(),c=this.getDensityAware(),d=c?b._currentDevicePixelRatio:1;this._iLoadImageDensity=d;return this._generateSrcByDensity(A,d);};b.prototype._generateSrcByDensity=function(s,d){if(!s){return"";}if(this._isDataUri(s)){this._iLoadImageDensity=1;return s;}if(d===1){return s;}var L=s.lastIndexOf("."),c=s.lastIndexOf("/"),n=s.substring(0,L),E=s.substring(L);if(L===-1||(c>L)){return s+"@"+d;}n=n+"@"+d;return n+E;};b.prototype._isDataUri=function(s){return s?s.indexOf("data:")===0:false;};b.prototype._isValidBackgroundSizeValue=function(v){var w=/\s+/g;v=q.trim(v).replace(w," ");return i(v.split(" "),["auto","cover","contain","initial"])||D.getType("sap.ui.core.CSSSizeShortHand").isValid(v);};b.prototype._isValidBackgroundPositionValue=function(v){var w=/\s+/g;v=q.trim(v).replace(w," ");return i(v.split(" "),["left","right","top","center","bottom","initial"])||D.getType("sap.ui.core.CSSSizeShortHand").isValid(v);};b.prototype.getAccessibilityInfo=function(){var h=this.hasListeners("press");if(this.getDecorative()&&!this.getUseMap()&&!h){return null;}return{role:h?"button":"img",type:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText(h?"ACC_CTR_TYPE_BUTTON":"ACC_CTR_TYPE_IMAGE"),description:this.getAlt()||this.getTooltip_AsString()||"",focusable:h};};b.prototype.getFocusDomRef=function(){return this.getDomRef("inner")||this.getDomRef();};b.prototype.getFormDoNotAdjustWidth=function(){return true;};function i(t,r){function c(T){return r.indexOf(T)<0;}return t&&r&&!t.some(c);}return b;});
