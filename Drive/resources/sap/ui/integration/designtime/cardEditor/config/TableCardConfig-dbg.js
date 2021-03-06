/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 *
 * @private
 * @experimental
 */
sap.ui.define([
	"sap/ui/integration/designtime/cardEditor/config/generateActionConfig"
], function (
	generateActionConfig
) {
	"use strict";

	return {
		// Table Card
		"tableMaxItems": {
			"tags": ["content"],
			"label": "{i18n>CARD_EDITOR.TABLE.MAXITEMS}",
			"type": "number",
			"path": "content/maxItems",
			"visible": "{= ${context>type} === 'Table' }"
		},
		"tableRowColumns": {
			"tags": ["content", "tableRow"],
			"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMNS}",
			"type": "array",
			"path": "content/row/columns",
			"itemLabel": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN}",
			"template": {
				"title": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.TITLE}",
					"type": "string",
					"path": "title"
				},
				"width": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.WIDTH}",
					"type": "string",
					"path": "width"
				},
				"value": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.VALUE}",
					"type": "string",
					"path": "value"
				},
				"icon": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.ICON}",
					"type": "icon",
					"path": "icon/src"
				},
				"state": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.STATE}",
					"type": "enum",
					"enum": [
						"Success",
						"Error",
						"Warning",
						"None",
						"Information"
					],
					"default": "None",
					"path": "state"
				},
				"url": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.URL}",
					"type": "string",
					"path": "url"
				},
				"target": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.TARGET}",
					"type": "enum",
					"enum": [
						"_blank",
						"_self"
					],
					"default": "_blank",
					"path": "target"
				},
				"identifier": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.IDENTIFIER}",
					"type": "boolean",
					"default": false,
					"path": "identifier"
				},
				"progressIndicatorState": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.PROGRESSINDICATOR.STATE}",
					"type": "enum",
					"enum": [
						"Success",
						"Error",
						"Warning",
						"None",
						"Information"
					],
					"default": "None",
					"path": "progressIndicator/state"
				},
				"progressIndicatorPercent": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.PROGRESSINDICATOR.PERCENT}",
					"type": "number",
					"path": "progressIndicator/percent"
				},
				"progressIndicatorText": {
					"tags": ["content", "tableRowColumn"],
					"label": "{i18n>CARD_EDITOR.TABLE.ROW.COLUMN.PROGRESSINDICATOR.TEXT}",
					"type": "string",
					"path": "progressIndicator/text"
				}
			},
			"visible": "{= ${context>type} === 'Table' }"
		},
		"tableRowActions": generateActionConfig({
			"tags": ["content", "tableRow"],
			"path": "content/row/actions",
			"maxItems": 1,
			"visible": "{= ${context>type} === 'Table' }"
		})
	};
});
