/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/* global XMLHttpRequest */

sap.ui.define([
	"sap/base/security/encodeURLParameters",
	"sap/base/Log"
], function (
	encodeURLParameters,
	Log
) {
	"use strict";

	/**
	 * Util class for Connector implementations (apply).
	 *
	 * @namespace sap.ui.fl.apply._internal.connectors.Utils
	 * @since 1.70
	 * @version 1.74.0
	 * @private
	 * @ui5-restricted sap.ui.fl.apply._internal.connectors, sap.ui.fl.write._internal.connectors
	 */

	return {
		/**
		 * Creates a Error messages in case of a failed Connector call while getting responses from multiple endpoints
		 *
		 * @param {object} oResponse Response from the sent request
		 * @param {object} oConnectorConfig Configured Connector
		 * @param {string} sFunctionName Name of the called function
		 * @param {string} sErrorMessage Error messages retrieved from the endpoint
		 * @returns {object} oResponse Response from the endpoint
		 */
		logAndResolveDefault: function (oResponse, oConnectorConfig, sFunctionName, sErrorMessage) {
			Log.error("Connector (" + oConnectorConfig.connector + ") failed call '" + sFunctionName + "': " + sErrorMessage);
			return oResponse;
		},

		/**
		 * Creating a full request url. Generic Method for all Connectors.
		 * This includes the url prefix and optional cache buster token, flex reference and query parameters.
		 *
		 * @param {string} sRoute Url-suffix e.g. "/flex/data/"
		 * @param {object} mPropertyBag Object with parameters as properties
		 * @param {string} mPropertyBag.url Configured url for the connector
		 * @param {string} [mPropertyBag.reference] Flexibility reference
		 * @param {string} [mPropertyBag.cacheKey] Cache-Buster token
		 * @param {string} [mPropertyBag.fileName] Filename of an existing flex object
		 * @param {object} [mParameters] Query-parameters which will be added to the url
		 * @returns {string} Complete request url
		 * @private
		 * @restricted sap.ui.fl.apply._internal, sap.ui.fl.write._internal
		 */
		getUrl: function (sRoute, mPropertyBag, mParameters) {
			if (!sRoute || !mPropertyBag.url) {
				throw new Error("Not all necessary parameters were passed");
			}
			var sUrl = mPropertyBag.url + sRoute;

			// If any of the following properties are available in mPropertyBag we append them to the Url
			if (mPropertyBag.cacheKey) {
				sUrl += "~" + mPropertyBag.cacheKey + "~/";
			}
			if (mPropertyBag.reference) {
				sUrl += mPropertyBag.reference;
			} else if (mPropertyBag.fileName) {
				sUrl += mPropertyBag.fileName;
			}

			// Adding Query-Parameters to the Url
			if (mParameters) {
				Object.keys(mParameters).forEach(function (sKey) {
					if (mParameters[sKey] === undefined) {
						delete mParameters[sKey];
					}
				});
				var sQueryParameters = encodeURLParameters(mParameters);

				if (sQueryParameters.length > 0) {
					sUrl += "?" + sQueryParameters;
				}
			}
			return sUrl;
		},

		/**
		 * Sending a xhr request and handling the response according to the status code of the response.
		 *
		 * @param {string} sUrl Url of the sent request
		 * @param {string} [sMethod="GET"] Desired action to be performed for a given resource
		 * @param {object} [mPropertyBag] Object with parameters as properties
		 * @param {string} [mPropertyBag.xsrfToken] Existing X-CSRF token of the connector which triggers the request
		 * @param {string} [mPropertyBag.payload] Payload of the request
		 * @param {string} [mPropertyBag.contentType] Content type of the request
		 * @param {string} [mPropertyBag.dataType] Expected data type of the response
		 * @param {object} [mPropertyBag.appDescriptor] Manifest that belongs to actual component
		 * @param {string} [mPropertyBag.siteId] <code>sideId</code> that belongs to actual component
		 * @returns {Promise<object>} Promise resolving with the JSON parsed response of the request
		 */
		sendRequest: function (sUrl, sMethod, mPropertyBag) {
			sMethod = sMethod || "GET";
			sMethod = sMethod.toUpperCase();

			return new Promise(function (resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.open(sMethod, sUrl);
				if ((sMethod === "GET" || sMethod === "HEAD") && (!mPropertyBag || !mPropertyBag.xsrfToken)) {
					xhr.setRequestHeader("X-CSRF-Token", "fetch");
				}
				if ((sMethod === "POST" || sMethod === "PUT" || sMethod === "DELETE") && mPropertyBag && mPropertyBag.xsrfToken) {
					xhr.setRequestHeader("X-CSRF-Token", mPropertyBag.xsrfToken);
				}
				if (mPropertyBag && mPropertyBag.contentType) {
					xhr.setRequestHeader("Content-Type", mPropertyBag.contentType);
				}
				if (mPropertyBag && mPropertyBag.siteId) {
					xhr.setRequestHeader("X-LRep-Site-Id", mPropertyBag.siteId);
				}
				if (mPropertyBag && mPropertyBag.sAppDescriptorId) {
					xhr.setRequestHeader("X-LRep-AppDescriptor-Id", mPropertyBag.sAppDescriptorId);
				}
				if (mPropertyBag && mPropertyBag.dataType) {
					xhr.responseType = mPropertyBag.dataType;
				}
				if (mPropertyBag && mPropertyBag.payload) {
					xhr.send(mPropertyBag.payload);
				} else {
					xhr.send();
				}
				xhr.onload = function () {
					if (xhr.status >= 200 && xhr.status < 400) {
						var oResult = {};

						if (xhr.status !== 204) {
							// mockservers using sinon servers have the response in responseText, not in response
							if (!xhr.response && xhr.responseText) {
								xhr.response = xhr.responseText;
							}

							if (xhr.response) {
								oResult.response = typeof xhr.response === "string" ? JSON.parse(xhr.response) : xhr.response;
							}
						}
						oResult.status = xhr.status;
						if (xhr.getResponseHeader("X-CSRF-Token")) {
							oResult.xsrfToken = xhr.getResponseHeader("X-CSRF-Token");
						}
						resolve(oResult);
					} else {
						reject({
							status: xhr.status,
							message: xhr.statusText
						});
					}
				};
			});
		}
	};
});