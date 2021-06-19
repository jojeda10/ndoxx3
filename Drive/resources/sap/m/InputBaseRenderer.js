/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','sap/ui/core/library','sap/ui/core/LabelEnablement','sap/ui/Device'],function(R,c,L,D){"use strict";var T=c.TextDirection;var V=c.ValueState;var I={apiVersion:2};I.render=function(r,C){var v=C.getValueState(),t=C.getTextDirection(),s=R.getTextAlign(C.getTextAlign(),t),a=sap.ui.getCore().getConfiguration().getAccessibility(),b=C.getAggregation("_beginIcon")||[],e=C.getAggregation("_endIcon")||[],d,f;r.openStart("div",C);this.addOuterStyles(r,C);this.addControlWidth(r,C);r.class("sapMInputBase");this.addPaddingClass(r,C);this.addCursorClass(r,C);this.addOuterClasses(r,C);if(!C.getEnabled()){r.class("sapMInputBaseDisabled");}if(!C.getEditable()){r.class("sapMInputBaseReadonly");}if(v!==V.None){r.class("sapMInputBaseState");}if(b.length){d=b.filter(function(i){return i.getVisible();});d.length&&r.class("sapMInputBaseHasBeginIcons");}if(e.length){f=e.filter(function(i){return i.getVisible();});f.length&&r.class("sapMInputBaseHasEndIcons");}this.writeOuterAttributes(r,C);var g=C.getTooltip_AsString();if(g){r.attr("title",g);}r.openEnd();r.openStart("div",C.getId()+"-content");r.class("sapMInputBaseContentWrapper");if(!C.getEnabled()){r.class("sapMInputBaseDisabledWrapper");}else if(!C.getEditable()){r.class("sapMInputBaseReadonlyWrapper");}if(v!==V.None){this.addValueStateClasses(r,C);}this.writeAccAttributes(r,C);this.addWrapperStyles(r,C);r.openEnd();if(b.length){this.writeIcons(r,b);}this.prependInnerContent(r,C);this.openInputTag(r,C);if(C.getName()){r.attr("name",C.getName());}if(!C.bShowLabelAsPlaceholder&&C._getPlaceholder()){r.attr("placeholder",C._getPlaceholder());}if(C.getMaxLength&&C.getMaxLength()>0){r.attr("maxlength",C.getMaxLength());}if(!C.getEnabled()){r.attr("disabled","disabled");}else if(!C.getEditable()){r.attr("readonly","readonly");}if(L.isRequired(C)){r.attr("required","required");}if(t!=T.Inherit){r.attr("dir",t.toLowerCase());}this.writeInnerValue(r,C);if(a){this.writeAccessibilityState(r,C);}if(D.browser.mozilla){if(g){r.attr("x-moz-errormessage",g);}else{r.attr("x-moz-errormessage"," ");}}this.writeInnerAttributes(r,C);r.class("sapMInputBaseInner");this.addInnerClasses(r,C);r.style("text-align",s);this.addInnerStyles(r,C);this.endInputTag(r,C);this.writeInnerContent(r,C);this.closeInputTag(r,C);if(e.length){this.writeIcons(r,e);}r.close("div");this.writeDecorations(r,C);if(a){this.renderAriaLabelledBy(r,C);this.renderAriaDescribedBy(r,C);}r.close("div");};I.getAriaRole=function(C){return"textbox";};I.getAriaLabelledBy=function(C){if(this.getLabelledByAnnouncement(C)){return C.getId()+"-labelledby";}};I.getLabelledByAnnouncement=function(C){return"";};I.renderAriaLabelledBy=function(r,C){var a=this.getLabelledByAnnouncement(C);if(a){r.openStart("span",C.getId()+"-labelledby").attr("aria-hidden","true").class("sapUiInvisibleText").openEnd().text(a.trim()).close("span");}};I.getAriaDescribedBy=function(C){if(this.getDescribedByAnnouncement(C)){return C.getId()+"-describedby";}};I.getDescribedByAnnouncement=function(C){return"";};I.renderAriaDescribedBy=function(r,C){var a=this.getDescribedByAnnouncement(C);if(a){r.openStart("span",C.getId()+"-describedby").attr("aria-hidden","true").class("sapUiInvisibleText").openEnd().text(a.trim()).close("span");}};I.getAccessibilityState=function(C){var a=this.getAriaLabelledBy(C),A=this.getAriaDescribedBy(C),r=this.getAriaRole(C),m={};if(r){m.role=r;}if(C.getValueState()===V.Error){m.invalid=true;}if(a){m.labelledby={value:a.trim(),append:true};}if(A){m.describedby={value:A.trim(),append:true};}m.disabled=null;m.readonly=null;m.required=null;return m;};I.writeAccessibilityState=function(r,C){r.accessibilityState(C,this.getAccessibilityState(C));};I.openInputTag=function(r,C){r.voidStart("input",C.getId()+"-"+this.getInnerSuffix());};I.endInputTag=function(r,C){r.voidEnd();};I.writeInnerValue=function(r,C){r.attr("value",C.getValue());};I.addCursorClass=function(r,C){};I.addPaddingClass=function(r,C){r.class("sapMInputBaseHeightMargin");};I.addOuterStyles=function(r,C){};I.addControlWidth=function(r,C){if(!C.getProperty('width')){r.class("sapMInputBaseNoWidth");}r.style("width",C.getWidth());};I.addOuterClasses=function(r,C){};I.writeOuterAttributes=function(r,C){};I.writeAccAttributes=function(r,C){};I.addInnerStyles=function(r,C){};I.addWrapperStyles=function(r,C){r.style("width","100%");};I.addInnerClasses=function(r,C){};I.writeInnerAttributes=function(r,C){};I.prependInnerContent=function(r,C){};I.writeInnerContent=function(r,C){};I.writeIcons=function(r,i){r.openStart("div").attr("tabindex","-1").class("sapMInputBaseIconContainer").openEnd();i.forEach(r.renderControl,r);r.close("div");};I.writeDecorations=function(r,C){};I.closeInputTag=function(r,C){};I.addPlaceholderStyles=function(r,C){};I.addPlaceholderClasses=function(r,C){};I.addValueStateClasses=function(r,C){r.class("sapMInputBaseContentWrapperState");r.class("sapMInputBaseContentWrapper"+C.getValueState());};I.getInnerSuffix=function(){return"inner";};return I;},true);
