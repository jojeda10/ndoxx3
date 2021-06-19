/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Renderer","sap/ui/core/library","sap/base/Log","sap/ui/core/IconPool"],function(l,R,c,L,I){"use strict";var a=l.RenderMode;var T=c.TextDirection;var b={};b.render=function(r,C){var i=C.getColorScheme(),s=C.getRenderMode(),t=C.getText(),d=C.getTextDirection(),w=C.getWidth(),D=C.getDisplayOnly(),o=C.getIcon();if(i<1||i>10){i=7;L.warning("sap.tnt.InfoLabel: colorScheme value is set to the default value of 7. Provided value should be between 1 and 10");}r.write("<div");r.writeControlData(C);r.addClass("sapTntInfoLabel");if(s===a.Narrow){r.addClass("sapTntInfoLabelRenderModeNarrow");}if(D){r.addClass("sapTntInfoLabelDisplayOnly");}if(t===""){r.addClass("sapTntInfoLabelNoText");}if(w){r.addStyle("width",w);}if(o){r.addClass("sapTntInfoLabelWithIcon");}r.addClass("backgroundColor"+i);r.writeClasses();r.writeStyles();r.write(">");r.write("<span");r.addClass("sapTntInfoLabelInner");r.writeClasses();if(d!==T.Inherit){r.writeAttribute("dir",d.toLowerCase());}r.write(">");if(o){r.writeIcon(o);}r.write("<span");r.addClass("sapTntInfoLabelText");r.writeClasses();r.write(">");r.writeEscaped(t);r.write("</span>");r.write("</span>");if(b._sAriaText){r.write("<span class='sapUiPseudoInvisibleText'>");if(t!==""){r.writeEscaped(b._sAriaText);}else if(!o){r.writeEscaped(b._sAriaTextEmpty);}else{r.writeEscaped(I.getIconInfo(C.getIcon()).text+" "+b._sAriaText);}r.write("</span>");}r.write("</div>");};return b;},true);