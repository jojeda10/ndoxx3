sap.ui.define([
	"./BaseController",
	"../model/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("com.nubexx.ndoxx.Shell.controller.AccountPage", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */

		onInit: function () {

			this.getRouter().getRoute("default").attachPatternMatched(this._onDefaultMatched, this);
			// this.getRouter().getRoute("default").attachPatternMatched(this._onInitialLoad, this);

		},
		onEnterCompany: function () {
			var oBtnGo = this.getView().byId("btnGo");
			if (oBtnGo.getEnabled()) {
				var oInpCompany = this.getView().byId("inpCompany");
				var sAccountId = oInpCompany.getValue();
				oInpCompany.setValue("");

				this.getRouter().navTo("loginPage", {
					accountId: sAccountId
				});
			}
		},
		onLiveChangeCompany: function (oEvent) {
			var oInput = oEvent.getSource();
			var sValue = oInput.getValue();
			var oBtnGo = this.getView().byId("btnGo");
			oBtnGo.setEnabled(sValue.length === 12);
		},

		// Login to use your account with SFCPART000064 or enter a different account ID

		// _onInitialLoad: function (oEvent) {
		// this._onLoadRepositories(function (oResult) {
		// 	var sRootFolderId = oResult.RootFolderId;
		// 	this.getView().getModel("app").setProperty("/rootFolderId", sRootFolderId);
		// 	var sPath = "/Folders(LoginPageId='" + sRootFolderId + "')/toCmisLoginPages";
		// 	this.bindUploadCollectionItems(sPath);
		// 	this._getHistory(sRootFolderId);
		// 	this._onLoadMenu(sRootFolderId);
		// }.bind(this), function (oError) { /* do something */ });

		// },

		_onDefaultMatched: function (oEvent) {
			/* eslint-disable sap-no-localstorage */
			var sAccountId = localStorage.getItem("accountId");
			/* eslint-enable sap-no-localstorage */
			if (sAccountId && sAccountId !== "") {
				this.getRouter().navTo("loginPage", {
					accountId: sAccountId
				});
			}
		}

	});
});