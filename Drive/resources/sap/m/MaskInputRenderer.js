/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','./InputBaseRenderer'],function(R,I){"use strict";var M=R.extend(I);M.getLabelledByAnnouncement=function(c){var m=c.getMask(),p=c.getPlaceholder()||"",r,s,a="";if(m&&m.length){r=sap.ui.getCore().getLibraryResourceBundle("sap.m");s=r.getText("MASKINPUT_SCREENREADER_TAG");if(p){p=" "+p+" ";}a=s+p;return a;}return I.getLabelledByAnnouncement.apply(this,arguments);};M.getDescribedByAnnouncement=function(c){var m=c.getMask(),s=c.getPlaceholderSymbol(),r,a="";if(m.length&&s){r=sap.ui.getCore().getLibraryResourceBundle("sap.m");a=r.getText("MASKINPUT_SCREENREADER_DESCRIPTION",[s,m]);return a.trim();}return I.getDescribedByAnnouncement.apply(this,arguments);};return M;},true);
