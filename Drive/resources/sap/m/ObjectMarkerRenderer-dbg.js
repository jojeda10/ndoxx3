/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([],
	function() {
		"use strict";


	/**
	 * <code>ObjectMarker</code> renderer.
	 * @namespace
	 */
	var ObjectMarkerRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ObjectMarkerRenderer.render = function(oRm, oControl) {

		// start control wrapper
		oRm.write("<span ");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMObjectMarker");
		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(oControl._getInnerControl());

		// end control wrapper
		oRm.write("</span>");
	};

	return ObjectMarkerRenderer;

}, /* bExport= */ true);