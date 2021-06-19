/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/base/security/encodeXML','sap/ui/core/library'],function(e,c){"use strict";var T=c.TitleLevel;var P=function(){};P.render=function(r,C){var b=C.getId();var d=sap.ui.getCore().getConfiguration().getAccessibility();var h=a(C.getHeight());var w=a(C.getWidth());C.getScrollTop();C.getScrollLeft();r.write("<section");r.writeControlData(C);r.addClass("sapUiPanel");r.addStyle("width",C.getWidth());if(!C.getCollapsed()){r.addStyle("height",C.getHeight());}else{r.addClass("sapUiPanelColl");r.addStyle("height","auto");}if(h){r.addClass("sapUiPanelHeightSet");}if(w){r.addClass("sapUiPanelWidthSet");}if(C.getApplyContentPadding()){r.addClass("sapUiPanelWithPadding");}if(!C.getEnabled()){r.addClass("sapUiPanelDis");}if(C.getShowCollapseIcon()){r.addClass("sapUiPanelWithCollapseIcon");}r.addClass("sapUiPanelBorderDesign"+C.getBorderDesign());r.addClass("sapUiPanelAreaDesign"+C.getAreaDesign());r.writeClasses();r.writeStyles();if(d){r.writeAttribute("aria-labelledby",b+"-title ");r.writeAttribute("aria-describedby",b+"-acc");r.writeAttribute("role","region");if(C.getCollapsed()){r.writeAttribute("aria-expanded","false");}else{r.writeAttribute("aria-expanded","true");}r.writeAttribute("tabindex","0");}var t=C.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}r.write("><header id='"+b+"-hdr'");r.addClass("sapUiPanelHdr");var o=C.getTitle();var s;var l=T.H5;var E=true;if(o){s=o.getTooltip_AsString();if(s){r.writeAttributeEscaped("title",s);}if(o.getLevel()!=T.Auto){l=o.getLevel();E=o.getEmphasized();}}if(E){r.addClass("sapUiPanelHdrEmph");}r.writeClasses();r.write(">");if(C.getShowCollapseIcon()&&d){r.write("<span id=\""+b+"-acc\" style=\"display:none;\">");r.writeEscaped(C._rb.getText("PANEL_HEAD_ACC"));r.write("</span>");}var f=C._rb.getText(C.getCollapsed()?"PANEL_EXPAND":"PANEL_COLLAPSE");if(C.getShowCollapseIcon()){r.write("<a id='"+b+"-collArrow' class='sapUiPanelHdrItem sapUiPanelCollArrow' href='#' tabindex='0' title='"+f+"'");if(d){r.writeAttribute("role","button");}r.write(">&nbsp;</a>");}if(o&&o.getIcon()){var I=o.getIcon();var g=[];var A={};A["id"]=b+"-ico";A["title"]=null;g.push("sapUiPanelIco");g.push("sapUiPanelHdrItem");g.push("sapUiTv"+l);r.writeIcon(I,g,A);}var j=e(C.getText());if(!j){j="&nbsp;";}r.write("<"+l+" ");r.addClass("sapUiTv"+l);r.write(" id='"+b+"-title' ");r.addClass("sapUiPanelHdrItem");r.addClass("sapUiPanelTitle");r.writeClasses();if(d){r.writeAttribute("role","heading");}r.write(">");r.write(j);r.write("</"+l+">");var B=C.getButtons();if(B&&(B.length>0)){r.write("<div id='"+b+"-tb' class='sapUiPanelHdrItem sapUiPanelTb sapUiTbDesignFlat'>");for(var i=0;i<B.length;i++){r.renderControl(B[i]);}r.write("</div>");}if(C.getShowCollapseIcon()){r.write("<a id='"+b+"-collIco' class='sapUiPanelHdrRightItem sapUiPanelCollIco' href='#' tabindex='0' title='"+f+"'");if(d){r.writeAttribute("role","button");}r.write(">&nbsp;</a>");}r.write("</header>");if(!C.getCollapsed()){r.write("<div class='sapUiPanelCont' id='",b,"-cont'>");var k=C.getContent(),L=k.length;for(var i=0;i<L;i++){r.renderControl(k[i]);}r.write("</div>");}r.write("</section>");};function a(C){return C&&C!=="auto"&&C!=="inherit";}return P;},true);
