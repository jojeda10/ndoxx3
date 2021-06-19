sap.ui.define(
	["sap/ui/core/UIComponent", "sap/ui/Device", "./model/models"],
	function (UIComponent, Device, models) {
		"use strict";

		return UIComponent.extend(
			"com.nubexx.ndoxx.Drive.Component", {
				metadata: {
					manifest: "json"
				},

				/**
				 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
				 * @public
				 * @override
				 */
				init: function () {
					// call the base component's init function
					UIComponent.prototype.init.apply(this, arguments);

					// set the app model
					this.setModel(models.setAppModel(), "app");

					// set current folder model
					this.setModel(models.setCurrentFolderModel(), "currentFolder");

					// set the selected object model
					this.setModel(models.setAppModel(), "selectedObject");

					// set the device model
					this.setModel(models.setHistoryModel(), "history");

					//set the capability model
					this.setModel(models.setCapabilityModel(), "capability");

					// set the device model
					this.setModel(models.createPermissionModel(), "permission");

					// set the device model
					this.setModel(models.createDeviceModel(), "device");

					// create the views based on the url/hash
					this.getRouter().initialize();
				}
			}
		);
	}
);