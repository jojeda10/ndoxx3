/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global FocusEvent, MouseEvent, document */
sap.ui.define([
	'sap/ui/base/ManagedObject',
	'sap/ui/qunit/QUnitUtils',
	'sap/ui/test/Opa5',
	'sap/ui/Device',
	"sap/ui/thirdparty/jquery",
	"sap/ui/test/_OpaLogger"
],
function (ManagedObject, QUnitUtils, Opa5, Device, jQueryDOM, _OpaLogger) {
	"use strict";

	/**
	 * @class Actions for Opa5 - needs to implement an executeOn function that should simulate a user interaction on a control
	 * @abstract
	 * @extends sap.ui.base.ManagedObject
	 * @public
	 * @name sap.ui.test.actions.Action
	 * @author SAP SE
	 * @since 1.34
	 */
	return ManagedObject.extend("sap.ui.test.actions.Action", {

		metadata : {
			properties: {
				/**
				 * Use this only if the target property or the default of the action does not work for your control.
				 * The id suffix of the DOM Element the press action will be executed on.
				 * For most of the controls you do not have to specify this, since the Control Adapters will find the correct DOM Element.
				 * But some controls have multiple DOM elements that could be target of your Action.
				 * Then you should set this property.
				 * For a detailed documentation of the suffix see {@link sap.ui.core.Element#$}
				 *
				 * @since 1.38
				 */
				idSuffix: {
					type: "string"
				}
			},
			publicMethods : [ "executeOn" ]
		},

		/**
		 * Checks if the matcher is matching - will get an instance of sap.ui.core.Control as parameter
		 * Should be overwritten by subclasses
		 *
		 * @param {sap.ui.core.Control} element the {@link sap.ui.core.Element} or a control (extends element) the action will be executed on
		 * @protected
		 * @name sap.ui.test.actions.Action#executeOn
		 * @function
		 */
		executeOn : function () {
			return true;
		},

		/**
		 * Finds the most suitable jQuery element to execute an action on.
		 * A control may have many elements in its DOM representation. The most suitable one is chosen by priority:
		 * <ol>
		 *     <li>If the user provided an idSuffix, return the element that matches it, or null</li>
		 *     <li>If there is a control adapter for the action - return the element that matches it. See {@link sap.ui.test.Press.controlAdapters} for an example</li>
		 *     <li>If there is no control adapter, or it matches no elements, return the focusDomRef of the control. Note that some controls may not have a focusDomRef.</li>
		 * </ol>
		 * @param {object} oControl the control to execute an action on
		 * @returns {jQuery} the jQuery element which is most suitable for the action
		 * @protected
		 */
		$: function (oControl) {
			var $ActionDomRef;
			var sErrorMessage = "";

			if (this.getIdSuffix()) {
				// if user requested an ID suffix, it should be used -- no fallback
				$ActionDomRef = oControl.$(this.getIdSuffix());
				sErrorMessage = $ActionDomRef.length ? "" : "DOM representation of control '" + oControl +
					"' has no element with user-provided ID suffix '" + this.getIdSuffix() + "'";
			} else {
				var sAdapter = this._getAdapter(oControl);
				if (sAdapter) {
					$ActionDomRef = oControl.$(sAdapter);
					sErrorMessage = $ActionDomRef.length ? "" : "DOM representation of control '" + oControl +
						"' has no element with ID suffix '" + sAdapter + "' which is the default adapter for '" + this.getMetadata().getName() + "'";
				}

				if (!$ActionDomRef || !$ActionDomRef.length) {
					// if no adapter is set or no element is found for it -- fallback to control focus dom ref
					$ActionDomRef = jQueryDOM(oControl.getFocusDomRef());
					if (!$ActionDomRef.length) {
						sErrorMessage += "DOM representation of control '" + oControl + "' has no focus DOM reference";
					}
				}
			}

			if ($ActionDomRef.length) {
				this.oLogger.info("Found a DOM reference for the control '" + oControl + "'. Executing '" + this.getMetadata().getName() +
				"' on the DOM element with ID '" + $ActionDomRef[0].id + "'");
				return $ActionDomRef;
			} else {
				// the control has no dom ref of any kind - action has no target
				this.oLogger.error(sErrorMessage);
				throw new Error(sErrorMessage);
			}
		},

		/**
		 * Returns the QUnitUtils
		 * @returns {sap.ui.test.qunit.QUnitUtils} QUnit utils of the current window or the OPA frame
		 * @protected
		 */
		getUtils : function () {
			return Opa5.getUtils() || QUnitUtils;
		},

		init: function () {
			this.controlAdapters = {};
			this.oLogger = _OpaLogger.getLogger(this.getMetadata().getName());
		},

		/**
		 * Traverses the metadata chain of a control and looks for action adapters.
		 * An action adapter is a suffix part of the ID of a DOM element, where
		 * the DOM element is part of a control DOM representation and should be used as a target for events
		 * @param {object} oControl the control for which to find an action adapter
		 * @returns {string|null} the ID suffix of the DOM element to use as event target
		 * @private
		 */
		_getAdapter : function (oControl) {
			var fnGetAdapterByMeta = function (oMetadata) {
				var vAdapter = this.controlAdapters[oMetadata.getName()];

				if (vAdapter) {
					if (jQueryDOM.isFunction(vAdapter)) {
						return vAdapter(oControl);
					}
					if (typeof vAdapter === "string") {
						return vAdapter;
					}
				}

				var oParentMetadata = oMetadata.getParent();
				if (oParentMetadata) {
					return fnGetAdapterByMeta(oParentMetadata);
				}

				return null;
			}.bind(this);

			return fnGetAdapterByMeta(oControl.getMetadata());
		},

		_tryOrSimulateFocusin: function ($DomRef, oControl) {
			var isAlreadyFocused = $DomRef.is(":focus");
			var bFireArtificialEvents;
			var oDomRef = $DomRef[0];

			if (isAlreadyFocused || (Device.browser.msie && Device.browser.version < 12) ||
				(Device.browser.firefox && Device.browser.version >= 60)) {
				// If the event is already focused, make sure onfocusin event of the control will be properly fired when executing this action,
				// otherwise the next blur will not be able to safely remove the focus.
				// In IE11 (and often in Firefox v61.0/v60.0 ESR, if the focus action fails and focusin is dispatched, onfocusin will be called twice
				// to avoid this, directly dispatch the artificial events
				bFireArtificialEvents = true;
			} else {
				$DomRef.focus();
				// This check will only return false if you have the focus in the dev tools console,
				// or a background tab, or the browser is not focused at all. We still want onfocusin to work
				var bWasFocused = $DomRef.is(":focus");
				// do not fire the artificial events in this case since we would recieve onfocusin twice
				bFireArtificialEvents = !bWasFocused;
			}

			if (bFireArtificialEvents) {
				this.oLogger.debug("Control " + oControl + " could not be focused - maybe you are debugging?");

				this._createAndDispatchFocusEvent("focusin", oDomRef);
				this._createAndDispatchFocusEvent("focus", oDomRef);
				this._createAndDispatchFocusEvent("activate", oDomRef);
			}
		},

		_simulateFocusout: function (oDomRef) {
			this._createAndDispatchFocusEvent("focusout", oDomRef);
			this._createAndDispatchFocusEvent("blur", oDomRef);
			this._createAndDispatchFocusEvent("deactivate", oDomRef);
		},

		/**
		 * Create the correct event object for a mouse event.
		 *
		 * @param {string} sName Name of the mouse event
		 * @param {Element} oDomRef DOM element on which the event is going to be triggered
		 * @private
		 */
		_createAndDispatchMouseEvent: function (sName, oDomRef) {
			// ignore scrolled down stuff (client X, Y not set)
			// and assume stuff is over the whole screen (screen X, Y not set)
			// See file jquery.sap.events.js for some insights to the magic
			var iLeftMouseButtonIndex = 0;
			var oMouseEvent;
			if (Device.browser.phantomJS || (Device.browser.msie && (Device.browser.version < 12))) {
				oMouseEvent = document.createEvent("MouseEvent");
				oMouseEvent.initMouseEvent(sName, true, true, window, 0, 0, 0, 0, 0,
					false, false, false, false, iLeftMouseButtonIndex, oDomRef);
			} else {
				oMouseEvent = new MouseEvent(sName, {
					bubbles: true,
					cancelable: true,
					identifier: 1,
					target: oDomRef,
					radiusX: 1,
					radiusY: 1,
					rotationAngle: 0,
					button: iLeftMouseButtonIndex,
					type: sName // include the type so jQuery.event.fixHooks can copy properties properly
				});
			}
			oDomRef.dispatchEvent(oMouseEvent);
		},

		_createAndDispatchFocusEvent: function (sName, oDomRef) {
			var oFocusEvent;

			// PhantomJS does not have a FocusEvent constructer and no InitFocusEvent function
			if (Device.browser.phantomJS) {
				oFocusEvent = document.createEvent("FocusEvent");
				oFocusEvent.initEvent(sName, true, false);
				// IE 11 and below don't really like the FocusEvent constructor - Fire it the IE way
			} else if (Device.browser.msie && (Device.browser.version < 12)) {
				oFocusEvent = document.createEvent("FocusEvent");
				oFocusEvent.initFocusEvent(sName, true, false, window, 0, oDomRef);
			} else {
				oFocusEvent = new FocusEvent(sName);
			}

			oDomRef.dispatchEvent(oFocusEvent);
			this.oLogger.info("Dispatched focus event: '" + sName + "'");
		}
	});

});