sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library"
], function (Controller, UIComponent, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("com.nubexx.ndoxx.Drive.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		deleteObject: function (sObject, sName, fnPress) {
			if (sObject === "cmis:folder") {
				sObject = this.getResourceBundle().getText("objectFolder");
			} else {
				sObject = this.getResourceBundle().getText("objectDocument");
			}
			var oDialog = new Dialog({
				title: "Delete",
				type: "Message",
				content: new Text({
					text: this.getResourceBundle().getText("objectDeletion", [sObject, sName])
				}),
				beginButton: new Button({
					type: sap.m.ButtonType.Emphasized,
					text: "Accept",
					press: function () {
						fnPress.call(this);
						oDialog.close();
					}.bind(this)
				}),
				endButton: new Button({
					text: "Cancel",
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});
			oDialog.open();
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		bindMoveToItems: function (sPath) {
			var ofilters = [];
			ofilters = [
				new sap.ui.model.Filter("ObjectTypeId", sap.ui.model.FilterOperator.Contains, "folder")
			];
			
			var oTableItem = sap.ui.xmlfragment("com.nubexx.ndoxx.Drive.view.fragments.dialog.MoveToItem");
			var oTable = sap.ui.getCore().byId("moveto");
			oTable.bindItems({
				path: sPath,
				templateShareable: false,
				template: oTableItem,
				filters: ofilters,
				events: {
					dataRequested: function (oEvent) {
						oTable.setBusy(true);
					}.bind(this),
					dataReceived: function (oEvent) {
						oTable.setBusy(false);
					}.bind(this)
				}
			});
		},

		_registerRoutes: function (oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("worklist").attachPatternMatched(this._onFolderMatched, this);
			oRouter.getRoute("worklistFolder").attachPatternMatched(this._onFolderMatched, this);
			oRouter.getRoute("trashed").attachPatternMatched(this._onTrashedMatched, this);
			oRouter.getRoute("starred").attachPatternMatched(this._onStarredMatched, this);
			oRouter.getRoute("recent").attachPatternMatched(this._onRecentMatched, this);
		//	oRouter.getRoute("default").attachPatternMatched(this._onInitialLoad, this);
		},

		_validateRenameName: function (oEvent, sOriginalNameFile) {
			/* eslint-disable sap-no-ui5base-prop */
			var oSaveButton = oEvent.getSource().getParent().getParent().mAggregations.beginButton;
			/* eslint-enable sap-no-ui5base-prop */
			var sInputValue = oEvent.getParameter("newValue");
			if (sInputValue === sOriginalNameFile || sInputValue.length === 0) {
				oSaveButton.setEnabled(false);
			} else {
				oSaveButton.setEnabled(true);
			}
		},

		_validateChangeDescription: function (oEvent, sOriginalDescription) {
			/* eslint-disable sap-no-ui5base-prop */
			var oSaveButton = oEvent.getSource().getParent().getParent().mAggregations.beginButton;
			var oTextArea = oEvent.getSource(); //.getItems()[0];
			/* eslint-enable sap-no-ui5base-prop */
			var sInputValue = oEvent.getParameter("newValue");
			var sStatus = this._getTextAreaState(sInputValue);
			oTextArea.setValueState(sStatus);
			oTextArea.setValueStateText(this.getResourceBundle().getText("objectDescriptionStatus" + sStatus))
			if (sInputValue === sOriginalDescription || sInputValue.length === 0 || oTextArea.getValueState() === "Error") {
				oSaveButton.setEnabled(false);
			} else {
				oSaveButton.setEnabled(true);
			}
		},

		_getExtensionFile: function (sName) {
			var sExtension;
			if (sName) {
				var aName = sName.split(".");
				sExtension = aName.length > 1 ? "." + aName[aName.length - 1] : "";
			}
			return sExtension;
		},
		_getNameFile: function (sName, sExtension) {
			if (sExtension) {
				sName.replace(sExtension, "");
			}
			return sName;
		},

		_showRenameDialog: function (oItem) {

			var oPropertiesItem = oItem.getObject();

			//var sExtension = this._getExtensionFile(oPropertiesItem.Name);

			var sExtension = this._getExtensionFile(oPropertiesItem.Name);

			//	var sNameFile = this._getNameFile(oPropertiesItem.Name, sExtension);
			var sNameFile = this._getNameFile(oPropertiesItem.Name, sExtension);

			var oDialog = new sap.m.Dialog({
				title: "Name",
				horizontalScrolling: false,
				verticalScrolling: false,
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.Input({
								fieldWidth: "75%",
								value: sNameFile,
								description: sExtension,
								liveChange: function (oEvent) {
									this._validateRenameName(oEvent, sNameFile);
								}.bind(this)
							})
						]
					}).addStyleClass("sapUiSmallMargin")
				],
				beginButton: new sap.m.Button({
					text: "Save",
					type: sap.m.ButtonType.Emphasized,
					enabled: false,
					press: function () {
						/* eslint-disable sap-no-ui5base-prop */
						var sNewValue = oDialog.getContent()[0].mAggregations.items[0].getValue();
						/* eslint-enable sap-no-ui5base-prop */
						if (sExtension) {
							sNewValue = sNewValue + sExtension;
						}
						oItem.setProperty("Name", sNewValue);
						this.getModel().submitBatch("UpdateGroup").then(function () {
							MessageToast.show(this.getResourceBundle().getText("objectRenamed"), {
								closeOnBrowserNavigation: false
							});
						}.bind(this));
						oDialog.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: "Cancel",
					press: function () {
						oDialog.close();
					}
				})
			});
			oDialog.open();
		},

		_setOpenedDate: function (objectId, fnSucess, fnError) {
			var oModel = this.getView().getModel();
			var urlFunctionImport = oModel.sServiceUrl + "SetOpenedDate(ObjectId='" + objectId + "')";
			$.ajax({
				url: urlFunctionImport,
				type: "GET",
				async: true,
				timeout: 25000,
				success: function (oData) {
					if (typeof fnSucess === "function") {
						fnSucess.call(this, oData);
					}
				}.bind(this),
				error: function (oErrors) {
					if (typeof fnError === "function") {
						fnError.call(this, oErrors);
					}
				}.bind(this)
			});
		},

		_getTextAreaState: function (sDescription) {
			var sState;
			if (sDescription.length > 255) {
				sState = "Error";
			} else if (sDescription.length > 245) {
				sState = "Warning";
			} else {
				sState = "None";
			}
			return sState;
		},

		_showChangeDescriptionDialog: function (oItem) {

			var oPropertiesItem = oItem.getObject();
			var sDescription = oPropertiesItem.Description;

			var oDialog = new sap.m.Dialog({
				title: "Description",
				horizontalScrolling: false,
				verticalScrolling: false,
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.TextArea({
								editable: true,
								value: sDescription,
								growing: false,
								width: "100%",
								maxLength: 255,
								showExceededText: true,
								rows: 3,
								liveChange: function (oEvent) {
									this._validateChangeDescription(oEvent, sDescription);
								}.bind(this)
							})
						]
					}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginEnd")
				],
				beginButton: new sap.m.Button({
					text: "Save",
					type: sap.m.ButtonType.Emphasized,
					enabled: false,
					press: function () {
						/* eslint-disable sap-no-ui5base-prop */
						var sNewValue = oDialog.getContent()[0].mAggregations.items[0].getValue();
						/* eslint-enable sap-no-ui5base-prop */

						oItem.setProperty("Description", sNewValue);
						this.getModel().submitBatch("UpdateGroup").then(function () {
							MessageToast.show(this.getResourceBundle().getText("objectDescriptionChanged"), {
								closeOnBrowserNavigation: false
							});
						}.bind(this));
						oDialog.close();
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: "Cancel",
					press: function () {
						oDialog.close();
					}
				})
			});
			oDialog.open();
		},

		onSetTrash: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext(),
				isTrashed, sTransientState, sName;
			if (oContext.getProperty("IsTrashed")) {
				isTrashed = false;
				sTransientState = "toUntrash";
			} else {
				isTrashed = true;
				sTransientState = "toTrash";
			}
			sName = oContext.getProperty("Name");
			oContext.setProperty("IsTrashed", isTrashed);
			oContext.setProperty("TransientState", sTransientState);
			var sObjectType = oContext.getProperty("ObjectTypeId");
			this.getModel().submitBatch("UpdateGroup").then(function () {
				oContext.delete().then(function () {
					if (sObjectType === "cmis:folder") {
						this._loadMenu(this.getView().getModel("app").getProperty("/rootFolderId"));
					}
					if (isTrashed) {
						MessageToast.show(this.getResourceBundle().getText("objectTrashed", [sName]), {
							closeOnBrowserNavigation: false
						});
					} else {
						MessageToast.show(this.getResourceBundle().getText("objectUntrashed", [sName]), {
							closeOnBrowserNavigation: false
						});
					}
					this.handleClose();
				}.bind(this), function (oError) {
					this.getView().setBusy(false);
					MessageToast.show(oError.message);
				});

			}.bind(this));
		},

		onRestorePress: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext(),
				sName;
			sName = oContext.getProperty("Name");
			oContext.setProperty("IsTrashed", false);
			oContext.setProperty("TransientState", "toUntrash");
			var sObjectType = oContext.getProperty("ObjectTypeId");
			this.getModel().submitBatch("UpdateGroup").then(function () {
				oContext.delete().then(function () {
					if (sObjectType === "cmis:folder") {
						this._loadMenu(this.getView().getModel("app").getProperty("/rootFolderId"), "trashed");
					}
					this.handleClose();
					MessageToast.show(this.getResourceBundle().getText("objectUntrashed", [sName]), {
						closeOnBrowserNavigation: false
					});
				}.bind(this), function (oError) {
					this.getView().setBusy(false);
					MessageToast.show(oError.message);
				});

			}.bind(this));
		},

		onSetStarred: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext(),
				isStarred, sTransientState, sName;
			if (oContext.getProperty("IsStarred")) {
				isStarred = false;
				sTransientState = "toUnstar";
			} else {
				isStarred = true;
				sTransientState = "toStar";
			}
			sName = oContext.getProperty("Name");
			oContext.setProperty("IsStarred", isStarred);
			oContext.setProperty("TransientState", sTransientState);

			this.getModel().submitBatch("UpdateGroup").then(function () {
				if (isStarred) {
					MessageToast.show(this.getResourceBundle().getText("objectStarred", [sName]), {
						closeOnBrowserNavigation: false
					});
				} else {
					if (this.getView().getModel("app").getProperty("/selection") === "starred") {
						oContext.delete().then(function () {
							MessageToast.show(this.getResourceBundle().getText("objectUnstarred", [sName]), {
								closeOnBrowserNavigation: false
							});
						}.bind(this), function (oError) {
							this.getView().setBusy(false);
							MessageToast.show(oError.message);
						});
					} else {
						MessageToast.show(this.getResourceBundle().getText("objectUnstarred", [sName]), {
							closeOnBrowserNavigation: false
						});
					}
				}
			}.bind(this));

		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},
		// closeSesion: function () {
		// 	/* eslint-disable sap-no-localstorage */
		// 	localStorage.clear();
		// 	/* eslint-enable sap-no-localstorage */
		// 	this.getModel("app").setProperty("/accountId", "");
		// 	delete this.getModel().mHeaders.auth;
		// 	this.getOwnerComponent().getRouter().navTo("default", {}, true);
		// },
		// _checkSesion: function () {
		// 	/* eslint-disable sap-no-localstorage */
		// 	var sToken = localStorage.getItem("token");
		// 	var sAccountId = localStorage.getItem("accountId");
		// 	/* eslint-enable sap-no-localstorage */
		// 	if (sToken && sAccountId) {
		// 		this.getModel().mHeaders.auth = sToken;
		// 		return true;
		// 	} else {
		// 		this.closeSesion();
		// 		return false;
		// 	}
		// },

		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */
		addHistoryEntry: (function () {
			var aHistoryEntries = [];

			return function (oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function (oHistoryEntry) {
					return oHistoryEntry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function (oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})()
	});

});