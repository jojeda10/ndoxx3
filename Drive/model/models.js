sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		setAppModel: function () {
			var oModel = new JSONModel({
				"accountId": "",
				"mode": "endUser",
				"displayType": "grid",
				"authorization": "",
				"repositoryId": "",
				"rootFolderId": "",
				"currentFolderId": "",
				"currentFolderText": "",
				"currentDocumentType": "",
				"infoDisplayActive": true,
				"selectedObjectId": "",
				"selectedObjectName": "",
				"detailsOpen": false,
				"createVisible": false,
				"selection": "folders",
				"selectionKey": "folders",
				"recentSelection": "day",
				"isFolder": false,
				"isDocument": true,
				"isTakeAction": false,
				"isToggled": false,
				"uploadUrl": "",
				"isProject": false,
				"thumbnail": "https://onlyoffice.nubexx.com/cache/files/conv_Khirz6zTPsasd_jpeg/output.jpg/Example%20Document%20Title.jpg?md5=FOAKwd-F_iP_Hi2J0ahF9A&expires=1589033311"
			}
			);

			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		setCurrentFolderModel: function () {
			var oModel = new JSONModel({
				"RepositoryId": "",
				"ObjectId": "",
				"Name": "",
				"Description": "",
				"ObjectTypeId": "",
				"ParentIds": "",
				"ParentName": "",
				"Path": "",
				"AllowedChildObjectTypeIds": "",
				"Tags": "",
				"CreationDate": "",
				"SecondaryObjectTypeIds": "",
				"ChangeToken": "",
				"LastModifiedBy": "",
				"CreatedBy": "",
				"Ident": "",
				"Owner": "",
				"IsImmutable": "",
				"IsDocument": "",
				"AclCompany": "",
				"AclBusinessUnit": "",
				"AclDivision": "",
				"AclDepartment": "",
				"AclLocation": "",
				"AclPosition": "",
				"AclJobClassification": "",
				"AclRole": "",
				"AclPermission": "",
				"AclUser": "",
				"LastModificationDate": "",
				"ParentId": "",
				"Blockdate": "",
				"HasChildrenFolders": false,
				"HasChildrenDocuments": false,
				"NumberOfChildren": 0
			}
			);

			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},


		setSelectedObjectModel: function () {
			var oModel = new JSONModel({
			}
			);

			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createPermissionModel: function () {
			var oModel = new JSONModel({});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		setCapabilityModel: function () {
			var oModel = new JSONModel({});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		setHistoryModel: function () {
			var oModel = new JSONModel({
				"history": [],
				"targetId": "",
				"targetPath": "",
				"currentLocationText": "",
				"name": ""
			}
			);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	};
});