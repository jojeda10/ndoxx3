/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/f/library"],function(l){"use strict";var H=l.cards.HeaderPosition;var C={},r=sap.ui.getCore().getLibraryResourceBundle("sap.f");C.render=function(R,c){var h=c.getCardHeader(),s=c.getHeight(),b=h&&c.getCardHeaderPosition()===H.Bottom;R.write("<div");R.writeElementData(c);R.addClass("sapFCard");if(!c.getCardContent()){R.addClass("sapFCardNoContent");}if(b){R.addClass("sapFCardBottomHeader");}R.writeClasses();R.addStyle("width",c.getWidth());if(s&&s!=='auto'){R.addStyle("height",s);}R.writeAccessibilityState(c,{role:"region",labelledby:{value:c.getId()+"-ariaText",append:true}});R.writeStyles();R.write(">");if(h&&c.getCardHeaderPosition()==="Top"){R.renderControl(h);}C.renderContentSection(R,c);if(b){R.renderControl(h);}R.renderControl(c._ariaText);R.write("</div>");};C.renderContentSection=function(R,c){var o=c.getCardContent();if(o){R.write("<div");R.addClass("sapFCardContent");R.writeClasses();R.writeAccessibilityState(c,{role:"group",label:{value:r.getText("ARIA_LABEL_CARD_CONTENT"),append:true}});R.write(">");R.renderControl(o);R.write("</div>");}};return C;});
