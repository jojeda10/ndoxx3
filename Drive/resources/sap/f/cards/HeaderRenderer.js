/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var H={};H.render=function(r,c){var s=c.getStatusText();r.write("<div");r.writeControlData(c);r.writeAttribute("tabindex","0");r.addClass("sapFCardHeader");r.writeAccessibilityState(c,{role:c._sAriaRole,labelledby:{value:c._getHeaderAccessibility(),append:true},roledescription:{value:c._sAriaRoleDescritoion,append:true},level:{value:c._sAriaHeadingLevel}});r.writeClasses();r.write(">");if(c.getIconSrc()||c.getIconInitials()){r.renderControl(c._getAvatar());}if(c.getTitle()){r.write("<div");r.addClass("sapFCardHeaderText");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapFCardHeaderTextFirstLine");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapFCardHeaderTitle");r.writeClasses();r.write(">");r.renderControl(c._getTitle());r.write("</div>");if(s){r.write("<span");r.addClass("sapFCardStatus");r.writeClasses();r.write(">");r.writeEscaped(s);r.write("</span>");}r.write("</div>");if(c.getSubtitle()){r.renderControl(c._getSubtitle());}r.write("</div>");}r.write("</div>");};return H;},true);
