sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/m/Token",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../model/formatter",
	"../controls/DocumentEditor"
], function (BaseController, JSONModel, History, Fragment, Token, Text, Button, Dialog, MessageToast, Filter, FilterOperator, formatter,
	DocumentEditor) {
	"use strict";

	return BaseController.extend("com.nubexx.ndoxx.Drive.controller.Object", {

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
			// this.getOwnerComponent().getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.getOwnerComponent().getRouter().attachRouteMatched(this._onRouteMatched, this);
			this.setModel(oViewModel, "objectView");

			// this.oDocumentEditor = this.getView().byId("DocumentEditor");
		},

		_onRouteMatched: function (oEvent) {

			//	if (oEvent.getParameter("name") === 'worklist') {
			this.getView().byId("objectContent").getSubHeader().removeStyleClass("defaultHeader");
			this.getView().byId("objectContent").getSubHeader().removeStyleClass("excelHeader");
			this.getView().byId("objectContent").getSubHeader().removeStyleClass("powerPointHeader");
			this.getView().byId("objectContent").getSubHeader().removeStyleClass("cadHeader");
			///	}	

			var sCurrentDocumentType = this.getModel("app").getProperty("/currentDocumentType");
			if (sCurrentDocumentType === "Excel") {
				this.getView().byId("objectContent").getSubHeader().addStyleClass("excelHeader");
			} else if (sCurrentDocumentType === "PowerPoint") {
				this.getView().byId("objectContent").getSubHeader().addStyleClass("powerPointHeader");
			} else if (sCurrentDocumentType === "CAD") {
				this.getView().byId("objectContent").getSubHeader().addStyleClass("cadHeader");
			} else {
				this.getView().byId("objectContent").getSubHeader().addStyleClass("defaultHeader");
			}

			if (oEvent.getParameter("name") === "object") {
				this._onObjectMatched(oEvent);
			} else {
				var aContent = this.getView().byId("objectContent").getContent();
				// for (var i = 0; i < aContent.length; i++) {
				// 	aContent[i].destroy();
				// }
				if (aContent) {
				aContent[0].destroy();
			}
			}
		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSharePress: function () {
			if (!this.oShare) {
				this.oShare = sap.ui.xmlfragment("com.nubexx.ndoxx.Drive.view.fragments.dialog.Share", this);
				jQuery.sap.require("sap.ui.Device");
				this.oShare.setStretch((sap.ui.Device.system.tablet || sap.ui.Device.system.phone) ? true : false);
				this.getView().addDependent(this.oShare);
			} else {
				sap.ui.getCore().byId("multiInput").removeAllTokens();
			}
			this.oShare.open();
		},

		onShareCancel: function () {
			this.oShare.close();
		},

		onShare: function () {
			var aUsers = sap.ui.getCore().byId("multiInput").getTokens();
			var sUsers = "";

			for (var i = 0; i < aUsers.length; i++) {
				if (i > 0) {
					sUsers = sUsers + aUsers[i].getKey() + ",";
				} else {
					sUsers = aUsers[i].getKey() + ",";
				}
			}

			this.oShare.close();
		},
		onMoveToSelect: function () {

		},

		onNavBack: function (oEvent) {
			// var sRepositoryId = this.sRepositoryId,
			// 	sFolderId = this.sFolderId;
			// this.getOwnerComponent().getRouter().navTo("drive", {
			// 	sRepositoryId: sRepositoryId,
			// 	sfolderId: sFolderId
			// });
		//	this.getView().byId("objectContent").getContent()[1].destroy();
			this.getView().unbindElement();
			window.history.go(-1);
		},

		onFileDelete: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();
			this.deleteObject(oContext.getProperty("ObjectTypeId").substring(5, oContext.getProperty("ObjectTypeId").length), oContext.getProperty(
				"Name"), function () {
					this.getView().setBusy(true);
					var name = oContext.getProperty("Name");
					oContext.delete().then(function () {
						this.getView().setBusy(false);
						var sRepositoryId = this.sRepositoryId,
							sFolderId = this.sFolderId;
						this.getOwnerComponent().getRouter().navTo("worklist", {
							sRepositoryId: sRepositoryId,
							sfolderId: sFolderId
						});
						MessageToast.show(this.getResourceBundle().getText("objectDeleted", [name]), {
							closeOnBrowserNavigation: false
						});
					}.bind(this), function (oError) {
						this.getView().setBusy(false);
						MessageToast.show(oError.message);
					});
				});
		},

		onRenamePress: function (oEvent) {
			// this._showRenameDialog(oEvent.getSource().getBindingContext());
			var name = oEvent.getSource().getBindingContext().getProperty("Name");
			$("#title-doc-name").after(
				'<p style="position: absolute;white-space: nowrap;text-overflow:ellipsis;overflow: hidden;text-align: center;font-size: 12px;height: 100%;width: 100%;background-color: transparent;border: 0 none;cursor: default;padding: 6px 12px;"> Jaime</p>'
			);
			$("#title-doc-name").remove();
		},

		onMoveToPress: function () {
			if (!this.oMoveTo) {
				this.oMoveTo = sap.ui.xmlfragment("com.nubexx.ndoxx.Drive.view.fragments.dialog.MoveTo", this);
				jQuery.sap.require("sap.ui.Device");
				this.oMoveTo.setStretch((sap.ui.Device.system.tablet || sap.ui.Device.system.phone) ? true : false);
				this.getView().addDependent(this.oMoveTo);

				var sfolderId = this.getView().getModel("app").getProperty("/rootFolderId");
				var sPath = "/Folders(ObjectId='" + sfolderId + "')/toCmisObjects";
				this.bindMoveToItems(sPath);
			}
			this.oMoveTo.open();
		},

		handleShareValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			// create value help dialog
			if (!this._valueHelpDialog) {
				Fragment.load({
					id: "shareValueHelpDialog",
					name: "com.nubexx.ndoxx.Drive.view.fragments.dialog.ShareWithUser",
					controller: this
				}).then(function (oValueHelpDialog) {
					this._valueHelpDialog = oValueHelpDialog;
					this.getView().addDependent(this._valueHelpDialog);
					this._openValueHelpDialog(sInputValue);
				}.bind(this));
			} else {
				this._openValueHelpDialog(sInputValue);
			}

		},

		_openValueHelpDialog: function (sInputValue) {
			var oBinding = this._valueHelpDialog.getBinding("items");
			oBinding.getModel().setSizeLimit(999999999);
			oBinding.attachDataRequested(function () {
				this._valueHelpDialog.setBusy(true);
			}.bind(this));

			oBinding.attachDataReceived(function () {
				this._valueHelpDialog.setBusy(false);
			}.bind(this));

			oBinding.filter([new Filter(
				"DefaultFullName",
				FilterOperator.Contains,
				sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"DefaultFullName",
				FilterOperator.Contains,
				sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function (evt) {
			var aSelectedItems = evt.getParameter("selectedItems"),
				oMultiInput = sap.ui.getCore().byId("multiInput");

			if (aSelectedItems && aSelectedItems.length > 0) {
				var i;
				for (i = 0; i < aSelectedItems.length; i++) {
					oMultiInput.addToken(new Token({
						text: aSelectedItems[i].getTitle(),
						key: aSelectedItems[i].getDescription()
					}));
				}
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_bindQuery: function (sRepositoryId, sfolderId, sQuery) {
			var sPath = "/Folders(RepositoryId='" + sRepositoryId + "',ObjectId='" + sfolderId + "')/toCmisObjects";

			if (sQuery) {
				var aFilters = [new sap.ui.model.Filter("QueryType", sap.ui.model.FilterOperator.Contains, sQuery)];
			}
			// if (sParameter) {
			// 	aFilters.push(new sap.ui.model.Filter("Parameter", sap.ui.model.FilterOperator.Contains, sParameter));
			// }

			var sRootFolderId = this.getModel("app").getProperty("/rootFolderId"),
				sCurrentFolderId = this.getModel("app").getProperty("/currentFolderId"),
				sMode = this.getModel("app").getProperty("/mode");
			if (sRootFolderId) {
				this._loadMenu(sRootFolderId, sCurrentFolderId, sMode);
			} else {
				this._onLoadMenu(sQuery);
			}
			this.bindUploadCollectionItems(sPath, aFilters, null, function (oResult) {
				this._setCount();
			});
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			this.sRepositoryId = oEvent.getParameter("arguments").sRepositoryId;
			this.sFolderId = oEvent.getParameter("arguments").sfolderId.replace(/lowBar/g, "_").replace(/dash/g, "-");
			var sdocumentId = oEvent.getParameter("arguments").sdocumentId.replace(/lowBar/g, "_").replace(/dash/g, "-");
			var sPath = "/Folders(RepositoryId='" + this.sRepositoryId + "',ObjectId='" + this.sFolderId + "')/toCmisObjects(RepositoryId='" +
				this.sRepositoryId + "',ObjectId='" + sdocumentId + "')";
			this._bindView(sPath);
			this._setOpenedDate(sdocumentId);
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView");
			var oAppModel = this.getModel("app");
			var sToken = oAppModel.getProperty("/authorization");


			this.getView().setBusy(true);
			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					$select: 'ParentIds,Name,IsStarred,OnlyOfficeUrl,ContentUrl,IsImage,DocumentType'
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function (resp) {
						oViewModel.setProperty("/busy", false);
						// if (!this.getView().getBindingContext().getProperty("IsImage")) {
							 if (this.getView().getBindingContext().getProperty("DocumentType") === "CAD") {
								this._openCADViewer();
							 } else {
							 	this._openOnlyOffice();
							 }
						// } else {
						// 	Fragment.load({
						// 		name: "com.nubexx.ndoxx.Drive.view.fragments.form.ImageEditor",
						// 		controller: this
						// 	}).then(function (pImageEditor) {

						// 		var oModel = new JSONModel({
						// 			blocked: true
						// 		});
						// 		pImageEditor.setModel(oModel);

						// 		pImageEditor.getAggregation("imageEditor").setSrc(this.getView().getBindingContext().getProperty("ContentUrl"));

						// 		this.getView().addDependent(pImageEditor);
						// 		this.getView().byId("objectContent").addContent(pImageEditor);
						// 	}.bind(this));

						// 	var oImageEditor = this.getView().byId("image");
						// 	var oModel = new JSONModel({

						// 		zoom: true
						// 	});
						// 	oImageEditor.setModel(oModel);
						// 	oImageEditor.setSrc(window.location.href + this.getView().getBindingContext().getProperty("ContentUrl"));
						// }
					}.bind(this)
				}
			});
		},

		/**
		   * Event was called if documnet editor recives a "downloadAs" command. @See download action methode.
		   * @param event
		   */
		documentDownloadAs: function (event) {
			console.log("ONLYOFFICE Document Editor create file: " + event.data);
			document.location.href = event.data;
		},

		/**
		 * Event "editorReady" is called if document editor is ready.
		 */
		editorReady: function () {
			console.log('The document editor is ready');
		},

		/**
		 * Event "documentReady" is called if document is fully loaded in the document editor.
		 */
		documentReady: function () {
			console.log('The document is loaded.');
		},

		/**
		 * Event "editorError" is called if an error in document editor occured.
		 */
		editorError: function (event) {
			console.log('ERROR: Document editor reports an error. Code: ' + event.data.errorCode + ', Description: ' + event.data.errorDescription);
		},

		/**
		 * Event "editorWarning" is called if a warning in document editor occured.
		 */
		editorWarning: function (event) {
			console.log("WARNING: Document editor reports a warning: code " + event.data.warningCode + ", description " + event.data.warningDescription);
		},

		onDocumentPress: function (oEvent) {
			var sdocumentId = oEvent.getSource().getBindingContext().getProperty("ObjectId");
			var sfolderId = oEvent.getSource().getBindingContext().getProperty("ParentIds");
			this._showObject(this.getView().getModel("app").getProperty("/repositoryId"), sfolderId, sdocumentId);
		},
		onUndo: function () {
			alert("onUndo");
		},

		_checkIsImage: function () {
			var bIsImage = false;

			return bIsImage;
		},
		_openCADViewer: function () {
			Fragment.load({
				name: "com.nubexx.ndoxx.Drive.view.fragments.CADViewer.CADViewer",
				controller: this
			}).then(function (oCADViewer) {
				this.getView().byId("objectContent").addContent(oCADViewer);
				this.getView().setBusy(false);
			}.bind(this));
		},

		_openOnlyOffice: function () {
			var oParameters = this.getView().getBindingContext().getObject();
			var sDocumentUrl = oParameters.OnlyOfficeUrl;

			var sDocumentUrl = "https://ndoxxserviceeujbb9f9h4.eu2.hana.ondemand.com/NdoxxService/onlyOffice?objectId=" + oParameters.ObjectId;

			var oAppModel = this.getModel("app");
			var sToken = oAppModel.getProperty("/authorization");
			//todo


			// var sDocumentUrl =
			// 	"https://ndoxxserviceeujbb9f9h4.eu2.hana.ondemand.com/NdoxxService/cmis1/json/92ce0d6f9a9c39e24aa6cbe5/root?objectId=Li5yhYQBkIHefOyPrSDBYRsxrwElx4Ay7PYCYzJSfps&cmisselector=content";
			var oEditorConfig = {
				callbackUrl: sDocumentUrl,
				mode: "edit",
				customization: {
					autoSave: true,
					chat: true,
					commentAuthorOnly: false,
					comments: false,
					compactHeader: true,
					compactToolbar: false,
					forcesave: true,
					help: true,
					hideRightMenu: false,
					showReviewChanges: false,
					toolbarNoTabs: false
				},
				document: {
					permissions: {
						edit: true,
						download: true
					}
				}
				// documentType: "text",
				// document: {
				// 	title: "test.docx",
				// 	fileType: "docx",
				// 	permissions: {
				// 		edit: true,
				// 		download: true
				// 	}
				// },
				//token: "eyJhbGciOiJIUzI1NiJ9.eyJkb2N1bWVudCI6eyJrZXkiOiJDNjA4NzRCREEyNTU5RDVCQzA4MzczMzBBOUMwOEVGODJFMzQxN0ZGMzQ5QzNDRkE5OTc2QTJEMDM5OTU4RjgxIiwidXJsIjoiaHR0cHM6Ly9uZG94eHNlcnZpY2VldWpiYjlmOWg0LmV1Mi5oYW5hLm9uZGVtYW5kLmNvbS9OZG94eFNlcnZpY2Uvb25seU9mZmljZT9vYmplY3RJZD0wbWJWbVBVY1RZdlB0NjJNbnoyNVpNZFZqWUdnU1BQdXNUUkhiQmgtUnFRIn0sImVkaXRvckNvbmZpZyI6eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vbmRveHhzZXJ2aWNlZXVqYmI5ZjloNC5ldTIuaGFuYS5vbmRlbWFuZC5jb20vTmRveHhTZXJ2aWNlL29ubHlPZmZpY2U_b2JqZWN0SWQ9MG1iVm1QVWNUWXZQdDYyTW56MjVaTWRWallHZ1NQUHVzVFJIYkJoLVJxUSJ9LCJleHAiOjE2MTY2Njc4MTh9.m78MAScKHK_KLYVqp4yK5YAsdeNZ7U-d_jae-m4WIVY"
			};
			this.getView().setBusy(true);
			var oDocumentEditor = new DocumentEditor("onlyOffice", {
				documentTitle: oParameters.Name,
				documentType: oParameters.Name.slice((oParameters.Name.lastIndexOf(".") - 1 >>> 0) + 2),
				documentUrl: sDocumentUrl,
				//				apiUrl: "https://documentserver.test.nubexx.com/",
				apiUrl: "https://onlyoffice.nubexx.com/",
				editorConfig: oEditorConfig,
				documentReady: function (oEvent) {
					this.getView().setBusy(false);
				}.bind(this)
			});
			oDocumentEditor.setBusy(true);

			this.getView().byId("objectContent").addContent(oDocumentEditor);
			//this.getView().getContent()[1].addContent(oDocumentEditor);
			//  this.getView().byId("dynamicSideContent").addMainContent(oDocumentEditor);
		},


		_onBindingChange: function () {
			var oView = this.getView(),
				//	oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// // No data for the binding
			// if (!oElementBinding.getBoundContext()) {
			// 	this.getOwnerComponent().getRouter().getTargets().display("objectNotFound");
			// 	return;
			// }

			//var oResourceBundle = this.getResourceBundle();
			if (oView.getBindingContext()) {
				oView.getBindingContext().requestObject().then((function (oObject) {
					var sObjectId = oObject.ObjectId,
						sObjectName = oObject.Name;

					// Add the object page to the flp routing history
					this.addHistoryEntry({
						title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
						icon: "sap-icon://enter-more",
						intent: "#ndoxx_ui_v2-display&/Folders(" + sObjectId + ")"
					});

					// oViewModel.setProperty("/busy", false);
					// oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
					// oViewModel.setProperty("/shareOnJamTitle", sObjectName);
					// oViewModel.setProperty("/shareSendEmailSubject",
					// 	oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
					// oViewModel.setProperty("/shareSendEmailMessage",
					// 	oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
				}).bind(this));
			}
		}
	});

});