// sap.ui.define(["sap/ui/core/mvc/Controller", "../model/formatter"], function(
//   Controller,
//   formatter
// ) {
//   "use strict";

//   return Controller.extend(
//     "com.nubexx.ndoxx.Drive.controller.Worklist",
//     {
//       formatter: formatter,

//       onInit: function() {}
//     }
//   );
// });

sap.ui.define([
    "./BaseController",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Button",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (BaseController, Device, JSONModel, History, formatter, Filter, FilterOperator, Button, MessageBox, MessageToast, Fragment) {
    "use strict";

    return BaseController.extend("com.nubexx.ndoxx.Drive.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */

        onInit: function () {

            this.getView().setModel(this.getOwnerComponent().getModel());

            $("body").on("contextmenu", function () {
                return false;
            }); //Disable Righ tPress

            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
                shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");



            // Add the worklist page to the flp routing history
            this.addHistoryEntry({
                title: this.getResourceBundle().getText("worklistViewTitle"),
                icon: "sap-icon://table-view",
                intent: "#ndoxx_ui_v2-display"
            }, true);
            this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.oBreadcrumbs = this.byId("breadcrumbs");
            this.oSelectionText = this.byId("selectionText");

            this._registerRoutes();

            this._onInitialLoad();
            this._setProgressInterval();
            var oDynamicSideView = this.oView.byId("DynamicSideContent");
            oDynamicSideView.setShowSideContent(false);
            //  this._subscribeToNavigation();


        
        },

        onRefreshAll: function () {
            var oGridUpload = this.getView().byId("gridUpload");
            oGridUpload.setBusy(true);

             for (var i = 0; oGridUpload.getItems().length > i; i++) {
               //  oGridUpload.getItems()[i].getBindingContext().setProperty("ThumbnailUrl",  oGridUpload.getItems()[i].getBindingContext().getProperty("ThumbnailUrl")+ "?" + new Date().getTime() );

                //oGridUpload.getItems()[i].destroy();
             }


            oGridUpload.getBinding("items").refresh();
            var oGridFolder = this.getView().byId("gridFolder");
            oGridFolder.getBinding("items").refresh();
            var oHierarchayList = this.getView().byId("gridFolder");
            oHierarchayList.getBinding("items").refresh();
        },

        _subscribeToNavigation: function () {
            //sap.ui.getCore().getEventBus().subscribe("Drive", "itemSelect", this.onNavigationSelect, this);
        },

        onNavigationSelect: function (oEvent) {
            debugger;
        },

        _platformIsSuccessFactor: function () {
            var sUrl = window.location.origin;
            return sUrl.indexOf("flpnwc") !== -1;
        },

        onCreateNew: function () {
            var oView = this.getView(),
                oButton = oView.byId("createNewButton");

            if (!this._oMenuFragment) {
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "com.nubexx.ndoxx.Drive.view.fragments.dialog.CreateNewMenu",
                    controller: this
                }).then(function (oMenu) {
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
            } else {
                this._oMenuFragment.openBy(oButton);
            }
        },

        onNewMenuAction: function (oEvent) {
            var oItem = oEvent.getParameter("item"),
                sItemPath = "";
            while (oItem instanceof sap.m.MenuItem) {
                sItemPath = oItem.getText() + " > " + sItemPath;
                oItem = oItem.getParent();
            }

            sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));
            switch (sItemPath) {
                case "Folder":
                    this._showCreateFolderDialog();
                    break;
                case "Document > Word":
                    this._showCreateDocumentDialog("Word");
                    break;
                case "Document > Excel":
                    this._showCreateDocumentDialog("Excel");
                    break;
                case "Document > PowerPoint":
                    this._showCreateDocumentDialog("PowerPoint");
                    break;
                default:
                    this._showCreateFolderDialog();
            }
        },

        _showCreateFolderDialog: function () {
            var oDialog = new sap.m.Dialog({
                title: "Create folder",
                horizontalScrolling: false,
                verticalScrolling: false,
                content: [
                    new sap.m.VBox({
                        items: [
                            new sap.m.Input({
                                fieldWidth: "100%",
                                liveChange: function (oEvent) {
                                    this._validateCreateFolder(oEvent);
                                }.bind(this)
                            })
                        ]
                    }).addStyleClass("sapUiSmallMargin")
                ],
                beginButton: new sap.m.Button({
                    text: "Create",
                    type: sap.m.ButtonType.Emphasized,
                    enabled: false,
                    press: function () {
                        /* eslint-disable sap-no-ui5base-prop */
                        var sNewValue = oDialog.getContent()[0].mAggregations.items[0].getValue();
                        /* eslint-enable sap-no-ui5base-prop */
                        this._createFolder(sNewValue);
                        oDialog.close();
                    }.bind(this)
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                })
            }).addStyleClass("sapUiSizeCompact");
            oDialog.open();
        },
        _showCreateDocumentDialog: function (sDocumentType) {
            var oDialog = new sap.m.Dialog({
                title: "Create " + sDocumentType,
                horizontalScrolling: false,
                verticalScrolling: false,
                content: [
                    new sap.m.VBox({
                        items: [
                            new sap.m.Input({
                                fieldWidth: "100%",
                                liveChange: function (oEvent) {
                                    this._validateCreateFolder(oEvent);
                                }.bind(this)
                            })
                        ]
                    }).addStyleClass("sapUiSmallMargin")
                ],
                beginButton: new sap.m.Button({
                    text: "Create",
                    type: sap.m.ButtonType.Emphasized,
                    enabled: false,
                    press: function () {
                        /* eslint-disable sap-no-ui5base-prop */
                        var sNewValue = oDialog.getContent()[0].mAggregations.items[0].getValue();
                        /* eslint-enable sap-no-ui5base-prop */
                        this._createDocument(sNewValue, sDocumentType);
                        oDialog.close();
                    }.bind(this)
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                })
            }).addStyleClass("sapUiSizeCompact");
            oDialog.open();
        },

        _validateCreateFolder: function (oEvent) {
            /* eslint-disable sap-no-ui5base-prop */
            var oCreateButton = oEvent.getSource().getParent().getParent().mAggregations.beginButton;
            /* eslint-enable sap-no-ui5base-prop */
            var sInputValue = oEvent.getParameter("newValue");
            if (sInputValue.length === 0 || sInputValue.replace(/ /g, "").length === 0) {
                oCreateButton.setEnabled(false);
            } else {
                oCreateButton.setEnabled(true);
            }
        },
        _createFolder: function (sName) {
            var oView = this.getView();
            var oContext = oView.byId("gridFolder").getBinding("items");
            var sTargetId = oView.getModel("app").getProperty("/currentFolderId");
            var oEntry = {
                Name: sName,
                ParentIds: sTargetId,
                RepositoryId: oView.getModel("app").getProperty("/repositoryId"),
                BaseTypeId: "cmis:folder",
                ObjectTypeId: "cmis:folder"
            };

            if (this._isCustomizing()) {
                this.oCreate = oContext.create(oEntry);
                this.getModel().submitBatch("UpdateGroup");
                this.oCreate.created().then(function () {
                    var sFolderId = this.oCreate.getProperty("ObjectId");
                    this.fireCustomFolderPress({
                        folderId: sFolderId
                    });
                }.bind(this), function (oError) { });
            } else {
                oView.setBusy(true);
                this.oCreate = oContext.create(oEntry);
                this.oCreate.created().then(function () {
                    oView.setBusy(false);
                }.bind(this), function (oError) { });
            }

            this.getModel().submitBatch("UpdateGroup");

        },

        _isCustomizing: function () {
            return this.getView().getModel("app").getProperty("/mode") === "customizing";
        },

        _createDocument: function (sName, sDocumentType) {
            var sNameWhitExtension;
            var oView = this.getView();
            var sTargetId = oView.getModel("app").getProperty("/currentFolderId");

            switch (sDocumentType) {
                case "Word":
                    sNameWhitExtension = sName + ".docx";
                    break;
                case "Excel":
                    sNameWhitExtension = sName + ".xlsx";
                    break;
                case "PowerPoint":
                    sNameWhitExtension = sName + ".pptx";
                    break;
            }
            var oModel = oView.getModel();
            var urlFunctionImport = oModel.sServiceUrl + "CreateDocument(DocumentType='" + sDocumentType +
                "',DocumentName='" + sNameWhitExtension + "',FolderId='" + sTargetId + "')";
            $.ajax({
                url: urlFunctionImport,
                type: "GET",
                async: true,
                timeout: 25000,
                success: function (oResult) {
                    // this.fireCreateDocument({
                    // 	documentId: oResult.DocumentId,
                    // 	folderId: sTargetId
                    // });
                    this.toCreatedDocument(oResult.DocumentId, sTargetId);
                }.bind(this),
                error: function (oError) { /* do something */ }
            });

            oView.getModel().submitBatch("UpdateGroup");
        },

        toCreatedDocument: function (sDocumentId, sFolderId) {
            this._showObject(this.getView().getModel("app").getProperty("/repositoryId"), sFolderId, sDocumentId);
        },

        onDocumentPress: function (oEvent) {
            this._documentPress(oEvent);
        },

        _documentPress: function (oEvent) {
            var sdocumentId = oEvent.getSource().getBindingContext().getProperty("ObjectId");
            var sfolderId = oEvent.getSource().getBindingContext().getProperty("ParentIds");
            this.getModel("app").setProperty("/currentDocumentType", oEvent.getSource().getBindingContext().getProperty("DocumentType"));
            this._showObject(this.getView().getModel("app").getProperty("/repositoryId"), sfolderId, sdocumentId);
        },

        onAfterRendering: function (oEvent) {
            // if (this.getView().byId("toolPage").getHeader()._oOverflowToolbar.mAggregations.content[5]) {
            // 	this.getView().byId("toolPage").getHeader()._oOverflowToolbar.mAggregations.content[5].addStyleClass("nubexxSearch");
            // }
            // var sCurrentBreakpoint = this._oDSC.getCurrentBreakpoint();
            // this.updateToggleButtonState(sCurrentBreakpoint);
        },

        onItemSelect: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            this._selectItem(sKey);

            if (/^[a-zA-Z]+$/.test(sKey)) {
                this.handleClose();
            } else {
                this._setObjectDetails(this.getView().getModel("app").getProperty("/repositoryId"), this.getView()
                    .getModel("app").getProperty("/rootFolderId"), sKey, "Folder");
            }
        },

        _clearSelectedObject: function () {
            this.getView().getModel("app").setProperty("/selectedObjectId", "");
            this.getView().getModel("app").setProperty("/selectedObjectName", "");
        },

        _selectItem: function (sKey) {
            switch (sKey) {
                case "settings":
                    break;
                case "storage":
                    break;
                case "shared":
                    break;
                case "recent":
                    this._showRecent(this.oUploadCollection.getRecentSelection());
                    break;
                case "trashed":
                    this._showTrashed();
                    break;
                case "starred":
                    this._showStarred();
                    break;
                case "capture":
                    break;
                default: //Folder Item
                    this._showFolder(this.getView().getModel("app").getProperty("/repositoryId"), sKey);
            }
            this.getModel("app").setProperty("/selectedObjectId", "");
        },

        onOpenSwitcher: function (oEvent) {
            this._oPopover.openBy(oEvent.getParameter("button"));
        },

        onCloseSwitcher: function (oEvent) {
            this._oPopover.close();
        },

        onProductSwitchChange: function (oEvent) {
            var sId = oEvent.getParameter("itemPressed").getId();
            var sSemanticObject, sAction, sMode;

            switch (sId) {
                case "drive":
                    sSemanticObject = "Home";
                    sAction = "show";
                    sMode = "endUser";
                    break;
                case "customizing":
                    sSemanticObject = "Home";
                    sAction = "show";
                    sMode = "customizing";
                    break;
            }

            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                target: {
                    semanticObject: sSemanticObject,
                    action: sAction
                },
                params: {
                    "mode": sMode,
                    "any": "go"
                }
            })) || "";
            oCrossAppNavigator.toExternal({
                target: {
                    shellHash: hash
                }
            });

        },

        onInfoClose: function (oEvent) {
            var oDynamicSideView = this.oView.byId("DynamicSideContent");
            var oAppModel = this.getView().getModel("app");
            oAppModel.setProperty("/infoDisplayActive", true);
            oDynamicSideView.setShowSideContent(false)
        },

        onInfoDisplay: function () {
            var oDynamicSideView = this.oView.byId("DynamicSideContent");
            var sCurrentBreakpoint = oDynamicSideView.getCurrentBreakpoint();
            if (sCurrentBreakpoint === "S") {
                oDynamicSideView.toggle();
            } else {
                var oAppModel = this.getView().getModel("app");
                oAppModel.setProperty("/infoDisplayActive", false);
                oDynamicSideView.setShowSideContent(true)
            }
        },

        onRecentSelectionChanged: function (oEvent) {
            var sRecentSelection = oEvent.getParameter("recentSelection");
            this.getView().getModel("app").setProperty("/recentSelection", sRecentSelection);
            this._showRecent(sRecentSelection);
        },

        onCreateDocument: function (oEvent) {
            var sDocumentId = oEvent.getParameter("documentId");
            var sFolderId = oEvent.getParameter("folderId");
            this._showObject(this.getView().getModel("app").getProperty("/repositoryId"), sFolderId, sDocumentId);
        },

        onRemoveStarred: function (oEvent) {
            this.onSetStarred(oEvent);
        },

        onUploadComplete: function (oEvent) {
            this.getView().getModel("app").setProperty("/selectedObjectName", oEvent.getParameter("files")[0].fileName);
            oEvent.getSource().getBinding("items").refresh();
        },

        _loadMenu: function (sRootFolderId, sSelectedKey, sMode) {
            //To be Done: Default route should call backend and bring assigned repository to user via function import
            var oModel = this.getView().getModel();

            if (!sSelectedKey) {
                sSelectedKey = sRootFolderId;
            }

            var urlFunctionImport = oModel.sServiceUrl + "GetMenu(ObjectId='" + sRootFolderId + "',SelectedKey='" + sSelectedKey + "',Mode='" +
                sMode + "')";
            $.ajax({
                url: urlFunctionImport,
                type: "GET",
                async: true,
                timeout: 25000,
                success: function (oResult) {
                    var aHistory = JSON.parse(oResult.Menu);
                    oModel = new JSONModel(aHistory);

                        var oSideNavigation = sap.ui.getCore().byId("navigation");
                        if (oSideNavigation) {
                        oSideNavigation.setModel(oModel);
                        oSideNavigation.setBusy(false);
                        }

 

                }.bind(this),
                error: function (oError) { /* do something */

                }
            });

        },

        _onLoadRepositories: function (fnSucess, fnError) {
            var oModel = this.getView().getModel();
            var urlFunctionImport = oModel.sServiceUrl + "GetRepositories()";
            $.ajax({
                url: urlFunctionImport,
                type: "GET",
                async: true,
                timeout: 25000,
                success: function (oData, textStatus, request) {
                    console.log(request.getAllResponseHeaders());
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

        _onGetCapabilities: function (objectId, fnSucess, fnError) {
            var oModel = this.getView().getModel();
            var urlFunctionImport = oModel.sServiceUrl + "GetCapabilities(ObjectId='" + objectId + "')";
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

        _onLoadMenu: function (sSelectedKey) {
            if (!window.bIsProject) {
            //var oSideNavigation = sap.ui.getCore().byId("navigation");
            //oSideNavigation.setBusy(true);
            }
            this._onLoadRepositories(function (oResult) {
                var sRepositoryId = oResult.RepositoryId,
                    sRootFolderId = oResult.RootFolderId,
                    sMode = this.getModel("app").getProperty("/mode");
                this.getView().getModel("app").setProperty("/repositoryId", sRepositoryId);
                this.getView().getModel("app").setProperty("/rootFolderId", sRootFolderId);
                this._loadMenu(sRootFolderId, sSelectedKey, sMode);
            }.bind(this), function (oError) { /* do something */ });
        },

        _getHistory: function (sRepositoryId, sfolderId) {
            var oModel = this.getView().getModel();
            var urlFunctionImport = oModel.sServiceUrl + "GetHistory(RepositoryId='" + sRepositoryId + "',ObjectId='" + sfolderId + "')";
            $.ajax({
                url: urlFunctionImport,
                type: "GET",
                async: true,
                timeout: 25000,
                success: function (oResult) {
                    var aHistory = JSON.parse(oResult.History);
                    this.getModel("history").setProperty("/history", aHistory);
                    this.getModel("app").setProperty("/currentFolderText", oResult.CurrentFolderName);
                    this.oBreadcrumbs.setCurrentLocationText(oResult.CurrentFolderName);
                    this._setCount();
                }.bind(this),
                error: function (oError) { /* do something */ }
            });
        },

        _setCount: function (iCount) {
            if (iCount !== 0) {
                iCount = this.getView().byId("gridFolder").getItems().length + this.getView().byId("gridUpload").getItems().length; //2; ///this.oUploadCollection.getItems().length;
            }
            var sSelection = this.getView().getModel("app").getProperty("/selection");
            if (sSelection !== "folders") {
                this.oSelectionText.setText(this.oResourceBundle.getText(sSelection + "SelectionText", [iCount]));
            } else {
                this.oBreadcrumbs.setCurrentLocationText(this.getCurrentLocationText() + " (" + iCount + ")");
            }

        },
        onMenuButtonPress: function () {
            var toolPage = this.byId("toolPage");

            toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },

        onNotificationsPressed: function (oEvent) {
            var oButton = oEvent.getSource()._oNotifications;

            // create popover
            if (!this._oPopover) {
                Fragment.load({
                    name: "com.nubexx.ndoxx.Drive.view.fragments.dialog.Popover",
                    controller: this
                }).then(function (pPopover) {
                    this._oPopover = pPopover;
                    this.getView().addDependent(this._oPopover);
                    this._oPopover.openBy(oButton);
                }.bind(this));
            } else {
                this._oPopover.openBy(oButton);
            }

        },
        onBeforeUploadStarts: function (oEvent) {
            // // Stellen die Kopf Parameter slug
            // //this.oUploadCollection.setBusy(true);
            // this.getView().setBusy(true);
            // var sFilename = oEvent.getParameter("fileName");
            // var sObjectId = this.oUploadCollection.getCurrentFolderId();
            // var slug = sFilename + "folderId=" + sObjectId;

            // // check if a document with that name already exists
            // var oItems = this.oUploadCollection.getItems();
            // var i, sDocumentid;
            // for (i = 0; i < oItems.length && !sDocumentid; i++) {
            // 	if (sFilename === oItems[i].getBindingContext().getObject().Name) {
            // 		sDocumentid = oItems[i].getBindingContext().getObject().ObjectId;
            // 		slug += "documentId=" + sDocumentid;
            // 	}
            // }

            // var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
            // 	name: "slug",
            // 	value: slug
            // });
            // oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        },

        // 	<GenericTile
        // 	press="onPress"
        // 	header="Sales Fulfillment Application Title"
        // 	subheader="Subtitle">
        // 	<layoutData>
        // 		<f:GridContainerItemLayoutData minRows="2" columns="2" />
        // 	</layoutData>
        // 	<TileContent unit="EUR" footer="Current Quarter">
        // 		<ImageContent src="sap-icon://home-share" />
        // 	</TileContent>
        // </GenericTile>

        bindUploadCollectionItems: function (sPath, ofilters, fnRequested, fnReceived) {

            var oGridUpload = this.getView().byId("gridUpload");
            var oGridFolder = this.getView().byId("gridFolder");
            var oListHierarchy = this.getView().byId("idListHierarchyView");

            ofilters = [
                new sap.ui.model.Filter("ObjectTypeId", sap.ui.model.FilterOperator.Contains, "document")
            ];

            oGridUpload.bindAggregation("items", {
                path: sPath,
                parameters: {
                    $select: 'ContentStreamMimeType,ContentUrl,Name,ObjectId,RepositoryId,ThumbnailUrl,BaseTypeId,ObjectTypeId,IsTrashed,IsStarred'
                },
                filters: ofilters,
                template: sap.ui.xmlfragment("com.nubexx.ndoxx.Drive.view.fragments.upload.UploadGenericTile", this),
                events: {
                    dataRequested: function () { oGridUpload.setBusy(true); }.bind(this),
                    dataReceived: function () {
                        this._setCount()

                        for (var i = 0; i < oGridUpload.getItems().length; i++) {
                            var sDocumentType = oGridUpload.getItems()[i].getBindingContext().getProperty("DocumentType");
                            switch (sDocumentType) {
                                case 'Excel':
                                    oGridUpload.getItems()[i].getTileContent()[0].getContent().getItems()[0].addStyleClass("ndoxxTileExcelIcon");
                                    break;
                                case 'Word':
                                    oGridUpload.getItems()[i].getTileContent()[0].getContent().getItems()[0].addStyleClass("ndoxxTileWordIcon");
                                    break;
                                case 'Pdf':
                                    oGridUpload.getItems()[i].getTileContent()[0].getContent().getItems()[0].addStyleClass("ndoxxTilePdfIcon");
                                    break;
                                case 'File':
                                    oGridUpload.getItems()[i].getTileContent()[0].getContent().getItems()[0].addStyleClass("ndoxxTileFileIcon");
                                    break;
                                case 'PowerPoint':
                                    oGridUpload.getItems()[i].getTileContent()[0].getContent().getItems()[0].addStyleClass("ndoxxTilePowerPointIcon");
                                    break;
                                default:
                                    oGridUpload.getItems()[i].getTileContent()[0].getContent().getItems()[0].addStyleClass("ndoxxTileFileIcon");
                                    break;
                            }

                            oGridUpload.getItems()[i].onAfterRendering = function () {
                                for (var i = 0; i < oGridUpload.getItems().length; i++) {
                                    jQuery.sap.byId(oGridUpload.getItems()[i].getId()).bind("contextmenu", jQuery.proxy(this.onContextMenuPress, this));
                                    var sId = oGridUpload.getItems()[i].getBindingContext().getProperty("ObjectId");
                                    this._onGetCapabilities(sId, function (oResult) {
                                        //this.getModel("capability").setData(oResult);

                                        var oModel = new JSONModel(oResult);
                                        // oGridUpload.getItems()[i].setModel(oModel, "capabilites");
                                        for (var i = 0; i < oGridUpload.getItems().length; i++) {
                                            if (oGridUpload.getItems()[i].getBindingContext().getProperty("ObjectId") === oResult.ObjectId) {
                                                oGridUpload.getItems()[i].setModel(oModel, "capabilites");
                                                this.getView().setModel(oModel, oGridUpload.getItems()[i].getId());
                                            }
                                        };

                                    }.bind(this), function (oError) { /* do something */ });
                                }
                            }.bind(this)

                            // oGridUpload.getItems()[i].attachEvent('oncontextmenu', function(e) {
                            //     alert("You've tried to open context menu"); //here you draw your own menu
                            //     e.preventDefault();
                            //   }, false);
                        }
                        oGridUpload.setBusy(false);
                    }.bind(this)
                }
            });


            ofilters = [];

            ofilters = [
                new sap.ui.model.Filter("ObjectTypeId", sap.ui.model.FilterOperator.Contains, "folder")
            ];

            oGridFolder.bindAggregation("items", {
                path: sPath,
                parameters: {
                    $select: 'ContentStreamMimeType,ContentUrl,Name,ObjectId,RepositoryId,ThumbnailUrl,BaseTypeId,ObjectTypeId,IsTrashed,IsStarred'
                },
                filters: ofilters,
                template: sap.ui.xmlfragment("com.nubexx.ndoxx.Drive.view.fragments.upload.FolderGenericTile", this),
                events: {
                    dataRequested: function () {
                        //  if (this.getView().getModel("currentFolder").getProperty("HasChildrenDocuments") === "true") {
                        oGridFolder.setBusy(true);
                        //}
                    }.bind(this),
                    dataReceived: function () {
                        this._setCount();
                        oGridFolder.setBusy(false);
                        this._activeDragFolders(oGridFolder);
                    }.bind(this)
                }
            });

            oListHierarchy.bindAggregation("items", {
                path: sPath,
                parameters: {
                    $select: 'ContentStreamMimeType,ContentUrl,Name,ObjectId,RepositoryId,ThumbnailUrl,BaseTypeId,ObjectTypeId,IsTrashed,IsStarred,IsFolder,NumberOfChildren'
                },
                template: sap.ui.xmlfragment("com.nubexx.ndoxx.Drive.view.fragments.upload.HierarchyListItem", this),
                events: {
                    dataRequested: function () {
                        oListHierarchy.setBusy(true);
                    }.bind(this),
                    dataReceived: function () {
                        for (var i = 0; i < oListHierarchy.getItems().length; i++) {
                            var sDocumentType = oListHierarchy.getItems()[i].getBindingContext().getProperty("DocumentType");
                            switch (sDocumentType) {
                                case 'Excel':
                                    oListHierarchy.getItems()[i].getCells()[0].addStyleClass("ndoxxTileExcelIcon");
                                    break;
                                case 'Word':
                                    oListHierarchy.getItems()[i].getCells()[0].addStyleClass("ndoxxTileWordIcon");
                                    break;
                                case 'Pdf':
                                    oListHierarchy.getItems()[i].getCells()[0].addStyleClass("ndoxxTilePdfIcon");
                                    break;
                                case 'File':
                                    oListHierarchy.getItems()[i].getCells()[0].addStyleClass("ndoxxTileFileIcon");
                                    break;
                                case 'PowerPoint':
                                    oListHierarchy.getItems()[i].getCells()[0].addStyleClass("ndoxxTilePowerPointIcon");
                                    break;
                                default:
                                    oListHierarchy.getItems()[i].getCells()[0].addStyleClass("ndoxxTileFolderIcon");
                                    break;
                            }
                        }

                        this._setCount();
                        oListHierarchy.setBusy(false);
                        //    this._activeDragFolders(oListHierarchy);
                    }.bind(this)
                }
            });


        },

        onDisplayTypeChanged: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            this.getView().getModel("app").setProperty("/displayType", sKey);
            // if (sKey === 'grid') {
            //  this.getView().byId("gridUpload").getBinding("items").refresh()
            // }

            if (sKey === 'list') {
                this.getView().byId("grids").addStyleClass("gridInvisible");
            } else {
                this.getView().byId("grids").removeStyleClass("gridInvisible");
            }
        },

        handleClick: function (oEvent) {
            var oObject = sap.ui.getCore().byId(oEvent.currentTarget.id).getBindingContext().getObject();
        },

        onContextMenuPress: function (oEvent) {
            var oContext = sap.ui.getCore().byId(oEvent.currentTarget.id).getBindingContext();
            var oItemControl = sap.ui.getCore().byId(oEvent.currentTarget.id);
            //this.oUploadCollection._oList.setSelectedItem(oItemControl);
            this.getView().getModel("app").setProperty("/selectedObjectId", oContext.getProperty("ObjectId"));
            this.getView().getModel("app").setProperty("/isTakeAction", false);
            // this._showContextMenu(oContext, oItemControl);
            // var oCapabilitiesModel = sap.ui.getCore().byId(oEvent.currentTarget.id).getModel("capabilities");
            var oCapabilitiesModel = this.getView().getModel(oEvent.currentTarget.id);
            this._showContextMenu1(oContext, oCapabilitiesModel, oItemControl);
        },

        _showContextMenu1: function (oContext, oCapabilitiesModel, oItemControl) {

            this.getModel("capability").setData(oCapabilitiesModel.getData());
            if (!this.oOptionsDialog) {
                this.oOptionsDialog = sap.ui.xmlfragment("com.nubexx.ndoxx.Drive.view.fragments.dialog.OptionsDialog", this);
                jQuery.sap.require("sap.ui.Device");
                this.getView().addDependent(this.oOptionsDialog);
            }
            this.oOptionsDialog.setBindingContext(oContext);
            this.oOptionsDialog.openBy(oItemControl);

        },

        _activeDragFolders: function (oGridFolder) {
            var aFolders = oGridFolder.getItems();

            setTimeout(() => {
                this._dragFolderBackgroundCounter = {};
                for (var i = 0; i < aFolders.length; i++) {
                    var sElementId = aFolders[i].getId();
                    this._dragFolderBackgroundCounter[sElementId] = 0;
                    var dropZone = document.getElementById(sElementId);
                    dropZone.addEventListener('dragover', this.handleFolderDragOver.bind(this), false);
                    dropZone.addEventListener('drop', this.handleFolderSelect.bind(this), false);
                    dropZone.addEventListener('dragenter', this.handleFolderDragEnter.bind(this), false);
                    dropZone.addEventListener('dragleave', this.handleFolderDragLeave.bind(this), false);
                }
            }, 0);
        },
        handleFolderSelect: function (oEvent) {
            var sElementId = oEvent.currentTarget.id;
            oEvent.stopPropagation();
            oEvent.preventDefault();
            this._dragFolderBackgroundCounter[sElementId]--;
            $("#" + sElementId).removeClass("tileFolderDrag");
            var aFiles = oEvent.dataTransfer.files; // FileList object.

            var oTileFolder = sap.ui.getCore().byId(sElementId);
            var sFolderId = oTileFolder.getBindingContext().getProperty("ObjectId");
            var sRepositoryId = oTileFolder.getBindingContext().getProperty("RepositoryId");

            this.uploadFile(aFiles[0], sFolderId, sRepositoryId);
        },
        handleFolderDragOver: function (oEvent) {
            oEvent.stopPropagation();
            oEvent.preventDefault();
            oEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        },
        handleFolderDragEnter: function (oEvent) {
            var sElementId = oEvent.currentTarget.id;
            this._dragFolderBackgroundCounter[sElementId]++;
            $("#" + sElementId).addClass("tileFolderDrag");
        },
        handleFolderDragLeave: function (oEvent) {
            var sElementId = oEvent.currentTarget.id;
            this._dragFolderBackgroundCounter[sElementId]--;
            if (this._dragFolderBackgroundCounter[sElementId] === 0) {
                $("#" + sElementId).removeClass("tileFolderDrag");
            }
        },
        getJqueryIdGridUpload: function () {
            return "#" + this._oGridUpload.getId();
        },
        convertUint8ArrayToBinaryString: function (u8Array) {
            var i, len = u8Array.length,
                b_str = "";
            for (i = 0; i < len; i++) {
                b_str += String.fromCharCode(u8Array[i]);
            }
            return b_str;
        },

        convertToBase64: function (input) {
            const uInt8Array = new Uint8Array(input);
            const count = uInt8Array.length;

            // Allocate the necessary space up front.
            const charCodeArray = new Array(count)

            // Convert every entry in the array to a character.
            for (let i = count; i >= 0; i--) {
                charCodeArray[i] = String.fromCharCode(uInt8Array[i]);
            }

            // Convert the characters to base64.
            const base64 = btoa(charCodeArray.join(''));
            return base64;
        },

        updateProgress: function (evt, fic) {
            var id_tmp = fic.size;
            //id_tmp help us keep track of which file is uploaded
            //right now it uses the filesize as an ID: script will break if 2 files have the     
            // same size
            if (evt.lengthComputable) {
                var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
                if (percentLoaded <= 100) {
                    if (percentLoaded === 100) {
                        percentLoaded = 50;
                    }

                    if (percentLoaded < 25) {
                        var sState = "Error";
                    } else {
                        var sState = "Warning";
                    }

                    this._updateItemFilesProgressIndicator(fic.name, percentLoaded, sState);
                }
            }
        },
        traverseFileTree: function (item, path) {
            path = path || "";
            if (item.isFile) {
                // Get file
                item.file(function (file) {
                    console.log("File:", path + file.name);
                });
            } else if (item.isDirectory) {
                // Get folder contents
                var dirReader = item.createReader();
                dirReader.readEntries(function (entries) {
                    for (var i = 0; i < entries.length; i++) {
                        this.traverseFileTree(entries[i], path + item.name + "/");
                    }
                }.bind(this));
            }
        },

        uploadFile: function (oFile, sFolderId, sRepositoryId) {

            if (!sRepositoryId) {
                sRepositoryId = this.getView().getModel("app").getProperty("/repositoryId");
            }

            this.getView().getModel("app").setProperty("/repositoryId", sRepositoryId);

            var sPath = this.getModel().sServiceUrl + "Folders";

            var slug = oFile.name + "folderId=" + (sFolderId || this.getView().getModel("app").getProperty("/currentFolderId"));

            this._uploadXHR = new window.XMLHttpRequest();

            var oXhrEntry = {
                xhr: this._uploadXHR,
                requestHeaders: []
            };

            this._aXhr = this._aXhr || [];
            this._aXhr.push(oXhrEntry);
            oXhrEntry.xhr.open("POST", sPath, true);
            this._uploadXHR.setRequestHeader("slug", slug);
            oXhrEntry.file = oFile;
            oXhrEntry.xhr.upload.addEventListener('progress', function (e) {
                this.updateProgress(e, oFile);
            }.bind(this), false);

            this._addItemFilesProgressIndicator(oFile.name, 0);

            oXhrEntry.xhr.onreadystatechange = function () {
                if (oXhrEntry.xhr.readyState === 4) {
                    var oModel = this.getView().getModel();
                    var oContext = this.getView().byId("gridUpload").getBinding("items");
                    oContext.refresh();
                    this._updateItemFilesProgressIndicator(oFile.name, 100, "Success");




                    // var urlFunctionImport = oModel.sServiceUrl + "GetNewDocument(ObjectId='99999999',DocumentName='" + oFile.name + "',FolderId='" + sFolderId + "')";
                    // $.ajax({
                    //     url: urlFunctionImport,
                    //     type: "GET",
                    //     async: true,
                    //     timeout: 25000,
                    //     success: function (oResult) {

                    //         // var oEntry = {
                    //         //     Name: oFile.name,
                    //         //     BaseTypeId: "document",
                    //         //     ObjectId: oResult.DocumentId,
                    //         //     ThumbnailUrl: oResult.ThumbnailUrl,
                    //         //     RepositoryId: this.getView().getModel("app").getProperty("/repositoryId")
                    //         // };
                    //          var oContext = this.getView().byId("gridUpload").getBinding("items");
                    //          oContext.refresh();
                    //         // this.oCreate = oContext.create(oEntry);
                    //         // this.getModel().submitBatch("UpdateGroup");
                    //         // this.oCreate.created().then(function () {
                    //         //     var sDocumentId = this.oCreate.getProperty("ObjectId");

                    //         // }.bind(this), function (oError) { });
                    //     }.bind(this),
                    //     error: function (oError) { /* do something */ }
                    // });



                }
            }.bind(this);

            oXhrEntry.xhr.send(oXhrEntry.file);

        },

        _setProgressInterval: function () {
            setInterval(function () {
                var bTablePercentage = false;
                var oTableFileStatus = this.getView().byId("tableFileStatus");
                var aItemsTableFileStatus = oTableFileStatus.getItems();


                for (var i = 0; i < aItemsTableFileStatus.length; i++) {
                    var oStatusFileStatus = aItemsTableFileStatus[i].getCells()[1];
                    var sPercentage = oStatusFileStatus.getPercentValue();

                    if (sPercentage >= 50 && sPercentage < 100) {
                        sPercentage = sPercentage + 2;
                        oStatusFileStatus.setDisplayValue(sPercentage + "%");
                        oStatusFileStatus.setPercentValue(sPercentage);
                        oStatusFileStatus.setState("Warning");
                    }

                    // var oStatusFileStatus = aItemsTableFileStatus[i].getCells()[1];
                    // var sNameFileStatus = aItemsTableFileStatus[i].getCells()[0].getText();
                    // if (sNameFileStatus === sDocumentName) {
                    //     bTablePercentage = true;
                    //     oStatusFileStatus.setDisplayValue(nDocumentPercentageStatus + "%");
                    //     oStatusFileStatus.setPercentValue(nDocumentPercentageStatus);
                    //     oStatusFileStatus.setState(sState);
                    // }
                }


            }.bind(this), 2000);
        },

        onCloseLayoutFileStatus: function () {
            var oLayoutFileStatus = this.getView().byId("layoutFileStatus");
            oLayoutFileStatus.setVisible(false);
        },
        onMinimizeLayoutFileStatus: function (oEvent) {
            var oTableFileStatus = this.getView().byId("scrollFileStatus");
            var oMinimizeButton = oEvent.getSource();

            if (oTableFileStatus.getVisible()) {
                oTableFileStatus.setVisible(false);
                oMinimizeButton.setIcon("sap-icon://navigation-up-arrow");
            } else {
                oTableFileStatus.setVisible(true);
                oMinimizeButton.setIcon("sap-icon://navigation-down-arrow");
            }
        },
        _updateItemFilesProgressIndicator: function (sDocumentName, nDocumentPercentageStatus, sState) {
            var bTablePercentage = false;
            var oTableFileStatus = this.getView().byId("tableFileStatus");
            var aItemsTableFileStatus = oTableFileStatus.getItems();

            if (!sState) {
                sState = "Success";
            }

            for (var i = 0; i < aItemsTableFileStatus.length && !bTablePercentage; i++) {
                var oStatusFileStatus = aItemsTableFileStatus[i].getCells()[1];
                var sNameFileStatus = aItemsTableFileStatus[i].getCells()[0].getText();
                if (sNameFileStatus === sDocumentName) {
                    bTablePercentage = true;
                    oStatusFileStatus.setDisplayValue(nDocumentPercentageStatus + "%");
                    oStatusFileStatus.setPercentValue(nDocumentPercentageStatus);
                    oStatusFileStatus.setState(sState);
                }
            }
        },

        _addItemFilesProgressIndicator: function (sDocumentName, nDocumentPercentageStatus) {

            var oTableFileStatus = this.getView().byId("tableFileStatus");
            var aItemsTableFileStatus = oTableFileStatus.getItems();
            for (var i = 0; i < aItemsTableFileStatus.length; i++) {
                var oStatusFileStatus = aItemsTableFileStatus[i].getCells()[1];
                var sNameFileStatus = aItemsTableFileStatus[i].getCells()[0].getText();
                if (sNameFileStatus === sDocumentName) {
                    oTableFileStatus.removeItem(aItemsTableFileStatus[i]);
                }
            }

            var oLayoutFileStatus = this.getView().byId("layoutFileStatus");
            oLayoutFileStatus.setVisible(true);

            var oTableFileStatus = this.getView().byId("tableFileStatus");
            var sDocumentStatus = "Warning";

            var oColumnListItem = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Text({
                        text: sDocumentName
                    }),
                    new sap.m.ProgressIndicator({
                        width: "100%",
                        percentValue: nDocumentPercentageStatus,
                        displayValue: nDocumentPercentageStatus + "%",
                        state: sDocumentStatus,
                        displayAnimation: true
                    }).addStyleClass("sapUiSmallMarginEnd")
                ]
            });

            oTableFileStatus.addItem(oColumnListItem);

        },
        handleFileSelect: function (oEvent) {
            oEvent.stopPropagation();
            oEvent.preventDefault();
            this._dragBackgroundCounter--;
            $(this.getJqueryIdGridUpload()).removeClass("gridUploadDragDropOverlay");
            var aFiles = oEvent.dataTransfer.files; // FileList object.

            var sFolderId = this.getView().getModel("app").getProperty("/currentFolderId");
            var sRepositoryId = this.getView().getModel("app").getProperty("/repositoryId");

            this.uploadFile(aFiles[0], sFolderId, sRepositoryId);
        },
        handleDragOver: function (oEvent) {
            oEvent.stopPropagation();
            oEvent.preventDefault();
            oEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        },
        handleDragEnter: function (oEvent) {
            this._dragBackgroundCounter++;
            $(this.getJqueryIdGridUpload()).addClass("gridUploadDragDropOverlay");
        },
        handleDragLeave: function (oEvent) {
            this._dragBackgroundCounter--;
            if (this._dragBackgroundCounter === 0) {
                $(this.getJqueryIdGridUpload()).removeClass("gridUploadDragDropOverlay");
            }
        },
        _activeDrag: function (oControl) {
            this._dragBackgroundCounter = 0;
            this._oGridUpload = oControl;
            var oGridUpload = this.getView().byId("gridUpload");

            var dropZone = document.getElementById(this._oGridUpload.getId());
            dropZone.addEventListener('dragover', this.handleDragOver.bind(this), false);
            dropZone.removeEventListener('drop', this.handleFileSelect.bind(this));
            dropZone.addEventListener('drop', this.handleFileSelect.bind(this), false);
            dropZone.addEventListener('dragenter', this.handleDragEnter.bind(this), false);
            dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this), false);
        },

        uploadCollectionItemFactory: function (id, context) {
            var sThumbnail;
            if (context.getProperty("BaseTypeId") === "cmis:folder") {
                sThumbnail = "sap-icon://folder-blank";
            } else {
                sThumbnail = "{ThumbnailUrl}";
            }

            var isFolder = context.getProperty("ObjectTypeId") === "cmis:folder";

            var oItem = new sap.m.UploadCollectionItem(id, {
                documentId: "{ObjectId}",
                fileName: "{Name}",
                mimeType: "{ContentStreamMimeType}",
                thumbnailUrl: sThumbnail,
                url: "{ContentUrl}",
                visibleDelete: false,
                visibleEdit: false,
                tooltip: "{Description}"
            });

            if (isFolder) {
                oItem.attachPress(this.onFolderPress, this);
                oItem.attachDeletePress(this.onFolderDeletePress, this);
                oItem.setAriaLabelForPicture("Folder");
            }
            return oItem;
        },

        _onUploadCollectionBound: function (oEvent) {

        },

        _handleSelection: function (sPath, aFilters, sSelection) {
            this.getView().getModel("app").setProperty("/selection", sSelection);
            this.bindUploadCollectionItems(sPath, aFilters, null, function (oResult) {
                this._setCount();
            });
        },

        handlerSearchFieldSearch: function (oEvent) {

            var sfolderId = this.getView().getModel("app").getProperty("/rootFolderId");
            var afilters = [];
            var sPath = "/Folders(RepositoryId='" + this.getView().getModel("app").getProperty("/repositoryId") + "',ObjectId='" + sfolderId +
                "')/toCmisObjects";
            var sCleared = oEvent.getParameter("clearButtonPressed");
            if (!sCleared) {
                afilters = [new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("query"))];
            }
            this.bindUploadCollectionItems(sPath, afilters, null, function (oResult) {
                if (!sCleared) {
                    this.getView().getModel("app").setProperty("/selection", "search")
                } else {
                    this.getView().getModel("app").setProperty("/selection", "folders")
                }
                this._setCount();

            });

        },

        onHeaderToggle: function (oEvent) {
            if (this.getView().getModel("app").getProperty("/isToggled")) {
                oEvent.getSource().setIcon("sap-icon://navigation-down-arrow");
                this.getView().getModel("app").setProperty("/isToggled", false)
            } else {
                
                oEvent.getSource().setIcon("sap-icon://navigation-up-arrow");
                this.getView().getModel("app").setProperty("/isToggled", true)
            }
            var $a = $(this.getView().byId("block").getDomRef());
            $a.toggleClass("active"); 

        },

        onTakeAction: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            this.getView().getModel("app").setProperty("/isTakeAction", true);
            this._showContextMenu(oContext, oEvent.getSource());
        },

        _showContextMenu: function (oContext, oItemControl) {
            this._onGetCapabilities(oContext.getProperty("ObjectId"), function (oResult) {
                this.getModel("capability").setData(oResult);
                if (!this.oOptionsDialog) {
                    this.oOptionsDialog = sap.ui.xmlfragment("com.nubexx.ndoxx.Drive.view.fragments.dialog.OptionsDialog", this);
                    jQuery.sap.require("sap.ui.Device");
                    this.getView().addDependent(this.oOptionsDialog);
                }
                this.oOptionsDialog.setBindingContext(oContext);
                this.oOptionsDialog.openBy(oItemControl);
            }.bind(this), function (oError) { /* do something */ });
        },

        onDeletePress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            this.deleteObject(oContext.getProperty("ObjectTypeId"), oContext.getProperty("Name"), function () {
                this.getView().setBusy(true);
                var name = oContext.getProperty("Name");
                oContext.delete().then(function () {
                    this.handleClose();
                    this.getView().setBusy(false);
                    MessageToast.show(this.getResourceBundle().getText("objectDeleted", [name]));
                }.bind(this), function (oError) {
                    this.getView().setBusy(false);
                    MessageToast.show(oError.message);
                });
            });
        },

        onFileDeleted: function (oEvent) {

        },

        onSelectionChange: function (oEvent) {
            var oContext = oEvent.getParameter("selectedItem").getBindingContext();
            this.getView().getModel("app").setProperty("/selectedObjectId", oContext.getProperty("ObjectId"));
            this.getView().getModel("app").setProperty("/isFolder", oContext.getProperty("IsFolder"));
            this.getView().getModel("app").setProperty("/isDocument", oContext.getProperty("IsDocument"));
            this._setObjectDetails(oContext.getProperty("RepositoryId"), oContext.getProperty("ParentIds"), oContext.getProperty("ObjectId"));
        },

        handleClose: function () {
            this.getView().byId("panelContainer").removePane(this.getView().byId("panelContainer").getPanes()[1]);
            var oObjectPage = sap.ui.getCore().byId("ObjectPageLayout");
            // oObjectPage.unbindElement();
            // this.oObjectDetails.unbindElement();
        },

        onViewDetailsPress: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();
			this._setObjectDetails(oContext.getProperty("RepositoryId"), oContext.getProperty("ParentIds"), oContext.getProperty("ObjectId"), oContext.getProperty("DocumentType"));
       },

       _setObjectDetails: function (sRepositoryId,sParentId,sObjectId,sDocumentType) {

           this.getView().byId("idObjectIcon").removeStyleClass("ndoxxTileExcelIcon");
           this.getView().byId("idObjectIcon").removeStyleClass("ndoxxTileWordIcon");
           this.getView().byId("idObjectIcon").removeStyleClass("ndoxxTilePdfIcon");
           this.getView().byId("idObjectIcon").removeStyleClass("ndoxxTilePowerPointIcon");
           this.getView().byId("idObjectIcon").removeStyleClass("ndoxxTileFileIcon");
           this.getView().byId("idObjectIcon").removeStyleClass("ndoxxTileFolderIcon");
           this.getView().byId("idObjectIcon").removeStyleClass("ndoxxTileFolderIcon");
           switch (sDocumentType) {
               case 'Excel':
                   this.getView().byId("idObjectIcon").addStyleClass("ndoxxTileExcelIcon");
                   break;
               case 'Word':
                   this.getView().byId("idObjectIcon").addStyleClass("ndoxxTileWordIcon");
                   break;
               case 'Pdf':
                   this.getView().byId("idObjectIcon").addStyleClass("ndoxxTilePdfIcon");
                   break;
               case 'File':
                   this.getView().byId("idObjectIcon").addStyleClass("ndoxxTileFileIcon");
                   break;
               case 'PowerPoint':
                   this.getView().byId("idObjectIcon").addStyleClass("ndoxxTilePowerPointIcon");
                   break;
               case 'Folder': 
               this.getView().byId("idObjectIcon").addStyleClass("ndoxxTileFolderIcon");
                   break;
               default:
                   this.getView().byId("idObjectIcon").addStyleClass("ndoxxTileFileIcon");
                   break;
           };

            var oObjectDetails = this.getView().byId("idObjectDetails");

            var sPath = "/Folders(RepositoryId='" + sRepositoryId + "',ObjectId='" + sParentId +
                "')/toCmisObjects(RepositoryId='" +
                sRepositoryId + "',ObjectId='" + sObjectId + "')";
            var oObjectPage = sap.ui.getCore().byId("ObjectPageLayout");
            oObjectDetails.bindElement({
                path: sPath,
                parameters: {
                    $select: 'ObjectId,Name,Description,Tags,CreationDate,CreatedBy,DocumentType,Owener,IsImmutable,ParentName,IsTrashed,IsStarred,IsDocument,IsFolder,NumberOfChildren'
                },
                events: {
                    dataRequested: function (oData) {
                        
                    }.bind(this),
                    dataReceived: function () {
                        
                    }.bind(this)
                }
            });
        },

        onFolderPress: function (oEvent) {
            this._folderPress(oEvent);
        },

        onListItemPress: function (oEvent) {

            var bIsFolder = oEvent.getSource().getBindingContext().getProperty("IsFolder");
            if (bIsFolder) {
                this._folderPress(oEvent);
            } else {
                this._documentPress(oEvent);
            }
        },


        _folderPress: function (oEvent) {
            //	this.oUploadCollection.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext();
            var sRepositoryId = oContext.getProperty("RepositoryId");
            var sObjectId = oContext.getProperty("ObjectId");
            var sPath = "Folders(RepositoryId='" + sRepositoryId + "',ObjectId='" + sObjectId + "')";
            this._getCurrentFolder(sPath);
            //    var sPath = "/Folders(RepositoryId='" + sRepositoryId + "',ObjectId='" + sObjectId + "')/toCmisObjects";
            // var sPathToObjects = "/" + sPath + "/toCmisObjects";
            this._showFolder(sRepositoryId, sObjectId);
            this.getModel("history").setProperty("/targetId", sObjectId);
            sPath = "/" + "Folders(RepositoryId='" + sRepositoryId + "',ObjectId='" + sObjectId + "')";
            this.getModel("history").setProperty("/targetPath", sPath);

            this._setObjectDetails(oContext.getProperty("RepositoryId"), oContext.getProperty("ParentIds"), oContext.getProperty("ObjectId"), "Folder");
        },

        onFolderDeletePress: function (oEvent) {
            var objectType = "folder";
            var oItem = oEvent.getSource();
            var sFolderName = oItem.getFileName();
            MessageBox.show("Are you sure you want to delete '" + sFolderName + "'?", {
                title: "Delete Folder",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        var sItemPath = oItem.getBindingContext().sPath;
                        var objectId = sItemPath.split("'")[1];
                        this.deleteItemByObjectId(objectId, objectType);
                    }
                }.bind(this),
                dialogId: "messageBoxDeleteFolder"
            });
        },
        onBreadcrumbPress: function (oEvent) {
            //	this.oUploadCollection.setBusy(true);
            var oLink = oEvent.getSource();
            var iIndex = this.oBreadcrumbs.indexOfLink(oLink);

            // update UploadCollectionItems



            var sPath = this.getModel("history").getProperty("/history")[iIndex].path;
            var sFolderId;
            sFolderId = this.getModel("history").getProperty("/history")[iIndex].id;
            var sCurrentFolderPath = sPath.substring(0, sPath.lastIndexOf("/"));
            if (!sCurrentFolderPath) {
                sCurrentFolderPath = sPath;
            }
            sCurrentFolderPath = sCurrentFolderPath + "/toCmisObjects";
            this._showFolder(this.getView().getModel("app").getProperty("/repositoryId"), sFolderId);

            sPath = "Folders(RepositoryId='" + this.getView().getModel("app").getProperty("/repositoryId") + "',ObjectId='" + sFolderId + "')";
            this._getCurrentFolder(sPath);

            this._setObjectDetails(this.getView().getModel("app").getProperty("/repositoryId"), this.getView()
                .getModel("app").getProperty("/rootFolderId"), sFolderId);

            // remove the sub folders
            var aHistory = this.getModel("history").getProperty("/history");
            aHistory.splice(iIndex);
            this.getModel("history").setProperty("/history", aHistory);

            // reset the current location folder//
            this.oBreadcrumbs.setCurrentLocationText(oLink.getText());
        },

        getCurrentLocationText: function () {
            // Remove the previously added number of items from the currentLocationText in order to not show the number twice after rendering.
            var sText = this.oBreadcrumbs.getCurrentLocationText().replace(/\s\([0-9]*\)/, "");
            return sText;
        },

        getCurrentFolderPath: function () {
            //var aHistory = this.oModel.getProperty("/history");
            var aHistory = this.getModel("history").getProperty("/history");

            // get the current folder path
            var sPath = aHistory.length > 0 ? aHistory[aHistory.length - 1].path : "/";
            return sPath;
        },
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished: function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        // _onEdit: function (sPath) {
        // 	// The source is the list item that got pressed
        // 	this._showObject(sPath);
        // },

        /**
         * Event handler when the share in JAM button has been clicked
         * @public
         */
        onShareInJamPress: function () {
            var oViewModel = this.getModel("worklistView"),
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

        onOpenPress: function (oEvent) {
            if (oEvent.getSource().getBindingContext().getProperty("ObjectTypeId") === "cmis:document") {
                var sdocumentId = oEvent.getSource().getBindingContext().getProperty("ObjectId");
                var sfolderId = oEvent.getSource().getBindingContext().getProperty("ParentIds");
                this._showObject(this.getView().getModel("app").getProperty("/repositoryId"), sfolderId, sdocumentId);
                // this.handleClose();
            } else {
                this.onFolderPress(oEvent);
            }
        },

        onCustomFolderPress: function (oEvent) {
            var sfolderId = oEvent.getParameter("folderId");
            if (sfolderId) {
                sfolderId = sfolderId.replace(/_/g, "lowBar").replace(/-/g, "dash");
            } else {
                sfolderId = oEvent.getSource().getBindingContext().getProperty("ObjectId");
            }
            this._showCustomFolder(this.getView().getModel("app").getProperty("/repositoryId"), sfolderId);
        },

        onDownloadPress: function (oEvent) {
            // var aItems = this.oUploadCollection.getItems();
            // for (var i = 0; i < aItems.length; i++) {
            // 	if (oEvent.getSource().getBindingContext().getProperty("ObjectId") === aItems[i].getBindingContext().getProperty("ObjectId")) {
            // 		aItems[i].download();
            // 	}
            // }
        },

        onPressFolder: function (oEvent) {
            var sfolderId = oEvent.getParameter("folderId");
            if (sfolderId) {
                sfolderId = sfolderId.replace(/_/g, "lowBar").replace(/-/g, "dash");
            } else {
                sfolderId = oEvent.getSource().getBindingContext().getProperty("ObjectId");
            }
            this._showCustomFolder(this.getView().getModel("app").getProperty("/repositoryId"), sfolderId);
        },

        onGetLinkPress: function (oEvent) {

            var sLink = window.location.href + "/documentId/" + oEvent.getSource().getBindingContext().getProperty("ObjectId");
            /* eslint-disable sap-no-element-creation */
            /* eslint-disable sap-no-proprietary-browser-api */
            /* eslint-disable sap-no-dom-insertion */
            /* eslint-disable sap-no-exec-command */
            var el = document.createElement("textarea");
            el.value = sLink;

            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            MessageToast.show(this.getResourceBundle().getText("objectGetLink", [oEvent.getSource().getBindingContext().getProperty("Name")]));
        },

        // onPress: function(oEvent) {
        // 	MessageToast.show(oEvent.getParameter("type") + " marker pressed!");
        // },
        onRenamePress: function (oEvent) {
            this._showRenameDialog(oEvent.getSource().getBindingContext());
        },

        onChangeDescriptionPress: function (oEvent) {
            this._showChangeDescriptionDialog(oEvent.getSource().getBindingContext());
        },

        onPressMenu: function () {
            this.getView().byId("toolPage").toggleSideContentMode();
        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh: function () {
            // var oTable = this.byId("table");
            // oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * On phones a additional history entry is created
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject: function (sRepositoryId, sfolderId, sdocumentId) {
            this.getOwnerComponent().getRouter().navTo("object", {
                sRepositoryId: sRepositoryId,
                sfolderId: sfolderId,
                sdocumentId: sdocumentId
            });
        },
        _showCustomFolder: function (sRepositoryId, sFolderId) {
            this.getOwnerComponent().getRouter().navTo("custom", {
                sRepositoryId: sRepositoryId,
                sfolderId: sFolderId
            });
        },

        _showFolder: function (sRepositoryId, sfolderId) {
            //		this._getHistory(sRepositoryId, sfolderId);
            if (this.getView().getModel("app").getProperty("/currentFolderId") === sfolderId) {
                this._bindQuery(sRepositoryId, sfolderId);
            } else {
                this.getView().getModel("app").setProperty("/selection", "folders");
                // this.getOwnerComponent().getRouter().navTo("worklist", {
                // 	sRepositoryId: sRepositoryId,
                // 	sfolderId: sfolderId
                // });
                this.getRouter().navTo("worklistFolder", {
                    sRepositoryId: sRepositoryId,
                    sfolderId: sfolderId
                });
            }
            this._clearSelectedObject();
            this.getView().getModel("app").setProperty("/currentFolderId", sfolderId);
        },

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

        onFolderCreated: function (oEvent) {
            var sFolderId = oEvent.getParameter("folderId");
            this.getView().getModel("app").setProperty("/selectedObjectId", sFolderId);
            this._loadMenu(this.getModel("app").getProperty("/rootFolderId"), this.getModel("app").getProperty("/currentFolderId"), this.getModel(
                "app").getProperty("/mode"));
        },

        _onInitialLoad: function (oEvent) {
            this._onLoadRepositories(function (oResult) {
                var sRepositoryId = oResult.RepositoryId;
                var sRootFolderId = oResult.RootFolderId;

                this.getView().getModel("app").setProperty("/repositoryId", sRepositoryId);
                this.getView().getModel("app").setProperty("/rootFolderId", sRootFolderId);
                this.getView().getModel("app").setProperty("/currentFolderId", sRootFolderId);
                //   

                var sPath = "Folders(RepositoryId='" + sRepositoryId + "',ObjectId='" + sRootFolderId + "')";
                this._getCurrentFolder(sPath);
                var sPathToObjects = "/" + sPath + "/toCmisObjects";
                this.bindUploadCollectionItems(sPathToObjects);
                this._getHistory(sRepositoryId, sRootFolderId);
                this._onLoadMenu(sRootFolderId);
                this._activeDrag(this.getView().byId("gridUpload"));
                this._setObjectDetails(sRepositoryId, sRootFolderId, sRootFolderId, "Folder");
            }.bind(this), function (oError) { /* do something */ });
        },

        _getCurrentFolder: function (sPath) {

            this._setCount(0);
            this.getView().getModel("currentFolder").setProperty("/HasChildrenFolders", false);
            this.getView().getModel("currentFolder").setProperty("/HasChildrenDocuments", false);
            this.getView().getModel("currentFolder").setProperty("/NumberOfChildren", 0);

            $.get({
                url: this.getView().getModel().sServiceUrl + sPath,
                success: function (data) {
                    this.getView().getModel("currentFolder").setData(data);
                }.bind(this),
                error: function (error) {
                    debugger;
                }.bind(this)
            });
        },

        _onTrashedMatched: function (oEvent) {
            var sRepositoryId = oEvent.getParameter("arguments").sRepositoryId;
            var sfolderId = oEvent.getParameter("arguments").sfolderId;
            this.getView().getModel("app").setProperty("/selection", "trashed");
            this._bindQuery(sRepositoryId, sfolderId, "trashed");
        },
        _onFolderMatched: function (oEvent) {

            if (window.bIsProject) {
                this.getView().getModel("app").setProperty("/isProject", true);
                this.getView().byId("idDrive").addStyleClass("projectDrive");
            } else {
                this.getView().getModel("app").setProperty("/isProject", false);   
                this.getView().byId("idDrive").removeStyleClass("projectDrive");           
            }
            this.getView().unbindElement();
            var sRepositoryId = oEvent.getParameter("arguments").sRepositoryId;
            var sfolderId = oEvent.getParameter("arguments").sfolderId;
            if (sRepositoryId && sfolderId) {
                this._bindQuery(sRepositoryId, sfolderId);
                this._getHistory(sRepositoryId, sfolderId);
                this._setOpenedDate(sfolderId);
            } else {
                this._onInitialLoad();
            }
        },
        _onStarredMatched: function (oEvent) {
            var sRepositoryId = oEvent.getParameter("arguments").sRepositoryId;
            var sfolderId = oEvent.getParameter("arguments").sfolderId;
            this.getView().getModel("app").setProperty("/selection", "starred");
            this._bindQuery(sRepositoryId, sfolderId, "starred");
        },
        _onRecentMatched: function (oEvent) {
            var sRepositoryId = oEvent.getParameter("arguments").sRepositoryId;
            var sfolderId = oEvent.getParameter("arguments").sfolderId;
            this.getView().getModel("app").setProperty("/selection", "recent");
            var sSelection = this.getView().getModel("app").getProperty("/recentSelection");
            this._bindQuery(sRepositoryId, sfolderId, "recent=" + sSelection);
        },

        _showStarred: function () {
            if (this.getView().getModel("app").getProperty("/selection") === "starred") {
                this._bindQuery(this.getView().getModel("app").getProperty("/repositoryId"), this.getView().getModel("app").getProperty(
                    "/rootFolderId"), "starred");
            } else {
                this.getOwnerComponent().getRouter().navTo("starred", {
                    sRepositoryId: this.getView().getModel("app").getProperty("/repositoryId"),
                    sfolderId: this.getView().getModel("app").getProperty("/rootFolderId")
                });
            }
            this.getView().getModel("app").setProperty("/currentFolderId", "starred");
        },

        _showTrashed: function () {
            if (this.getView().getModel("app").getProperty("/selection") === "trashed") {
                this._bindQuery(this.getView().getModel("app").getProperty("/repositoryId"), this.getView().getModel("app").getProperty(
                    "/rootFolderId"), "trashed");
            } else {
                this.getOwnerComponent().getRouter().navTo("trashed", {
                    sRepositoryId: this.getView().getModel("app").getProperty("/repositoryId"),
                    sfolderId: this.getView().getModel("app").getProperty("/rootFolderId")
                });
            }
            this.getView().getModel("app").setProperty("/currentFolderId", "trashed");
        },

        _showRecent: function (sRecentSelection) {
            if (this.getView().getModel("app").getProperty("/selection") === "recent") {

                this._bindQuery(this.getView().getModel("app").getProperty("/repositoryId"), this.getView().getModel("app").getProperty(
                    "/rootFolderId"), "recent" + "=" + sRecentSelection);
            } else {
                this.getOwnerComponent().getRouter().navTo("recent", {
                    sRepositoryId: this.getView().getModel("app").getProperty("/repositoryId"),
                    sfolderId: this.getView().getModel("app").getProperty("/rootFolderId")
                });
            }
            this.getView().getModel("app").setProperty("/currentFolderId", "recent");
            // this.getView().getModel("app").setProperty("/selection", "recent");
            // this.getOwnerComponent().getRouter().navTo("recent", {
            // 	sRepositoryId: this.getView().getModel("app").getProperty("/repositoryId"),
            // 	sfolderId: this.getView().getModel("app").getProperty("/rootFolderId")
            // });
        },
        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function (aTableSearchState) {
            // var oTable = this.byId("table"),
            // 	oViewModel = this.getModel("worklistView");
            // oTable.getBinding("items").filter(aTableSearchState, "Application");
            // // changes the noDataText of the list in case there are no filter results
            // if (aTableSearchState.length !== 0) {
            // 	oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            // }
        }

    });
});