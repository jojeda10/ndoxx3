/* global sha512:true */
sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("com.nubexx.ndoxx.Shell.controller.LoginPage", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.getRouter().getRoute("loginPage").attachPatternMatched(this._onLoginPageMatched, this);
			this.setModel(oViewModel, "objectView");

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		onLiveChangeLogin: function () {
			var oInpEmailUser = this.getView().byId("inpEmailUser");
			var oInpPassword = this.getView().byId("inpPassword");
			var oBtnLogin = this.getView().byId("btnLogin");
			var isEnabled = oInpEmailUser.getValue().length > 0 && oInpPassword.getValue().length > 0;
			oBtnLogin.setEnabled(isEnabled);
		},

		onLogin: function () {
			var oBtnLogin = this.getView().byId("btnLogin");
			
			if (oBtnLogin.getEnabled()) {
				var oInpEmailUser = this.getView().byId("inpEmailUser");
				var oInpPassword = this.getView().byId("inpPassword");
				var sEmailUser = oInpEmailUser.getValue();
			//	var sEncryptedPassword = sha512(oInpPassword.getValue());

				var sAccountId = this.getModel("app").getProperty("/accountId");

				var oData = {
					"IdAccount": sAccountId,
					"UserIdentifier": sEmailUser,
					"Password": oInpPassword.getValue() //sEncryptedPassword
				};
				var sData = JSON.stringify(oData);

				var oModel = this.getView().getModel();

				var urlFunctionImport = oModel.sServiceUrl + "Login";
				$.ajax({
					url: urlFunctionImport,
					type: "POST",
					contentType: "application/json",
					headers: {
						"x-http-method": "POST"
					},
					datatype: "json",
					data: sData,
					success: function (oResult) {
						var sToken = oResult.Auth;
						/* eslint-disable sap-no-localstorage */
						localStorage.setItem("token", sToken);
						localStorage.setItem("accountId", sAccountId);
						/* eslint-enable sap-no-localstorage */
						oInpEmailUser.setValue("");
						oInpPassword.setValue("");
						this.getRouter().navTo("instancesPage", {
							accountId: sAccountId
						});
					}.bind(this),
					error: function (oError) { /* do something */
						sap.m.MessageToast.show("Incorrect password or ID");
						oInpEmailUser.setValue("");
						oInpPassword.setValue("");
					}.bind(this)
				});
			}

		},

		_onLoginPageMatched: function (oEvent) {
			var sAccountId = oEvent.getParameter("arguments").accountId;
			this._validateAccount(sAccountId);
		},
		_validateAccount: function (sAccountId) {
			var oModel = this.getView().getModel();

			this.getView().setBusy(true);
			var urlFunctionImport = oModel.sServiceUrl + "GetAccount(IdAccount='" + sAccountId + "')";

			$.ajax({
				url: urlFunctionImport,
				type: "GET",
				success: function (oResult) {
					this.getView().setBusy(false);
					this.getModel("app").setProperty("/accountId", sAccountId);
				}.bind(this),
				error: function (oError) {
					this.getView().setBusy(false);
					MessageBox.error("Incorrect Account ID", {
						actions: [MessageBox.Action.CLOSE],
						onClose: function (sAction) {
							this.closeSesion();
						}.bind(this)
					});
				}.bind(this)
			});

		}

	});

});