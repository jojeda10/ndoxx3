/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/Utils"
], function(
	Utils
) {
	"use strict";

	/**
	 * Restores the previous state of the control, removing the content of the fragment
	 * from the aggregation
	 *
	 * @param {object} oChange Change object with instructions to be applied on the control
	 * @param {object} oControl Control which has been determined by the selector id
	 * @param {object} mPropertyBag Property bag
	 * @param {object} mPropertyBag.modifier Modifier for the controls
	 * @param {object} mPropertyBag.appComponent App component
	 * @param {object} mPropertyBag.view Root view
	 * @return {boolean} Returns true if change has been reverted successfully
	 * @ui5-restricted sap.ui.fl
	 */
	return function(oChange, oControl, mPropertyBag) {
		var oModifier = mPropertyBag.modifier;
		var oChangeDefinition = oChange.getDefinition();
		var sAggregationName = oChangeDefinition.content.targetAggregation;
		var oView = mPropertyBag.view || Utils.getViewForControl(oControl);
		var oAppComponent = mPropertyBag.appComponent;
		var aRevertData = oChange.getRevertData() || [];
		var aControlsToRemove = aRevertData.map(function(sId) {
			// when we apply the change in XML and revert in JS, the saved ID is not yet concatinated with the view
			return oModifier.bySelector(sId, oAppComponent, oView) || oView && oView.createId && oModifier.bySelector(oView.createId(sId));
		});

		aControlsToRemove.forEach(function(oControlToRemove) {
			oModifier.removeAggregation(oControl, sAggregationName, oControlToRemove);
			if (oControlToRemove.destroy) {
				oControlToRemove.destroy();
			}
		});

		oChange.resetRevertData();
		return true;
	};
});
