sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/Fragment", "../model/formatter"], function (
	Controller,
	Fragment,
	formatter
) {
	"use strict";

	return Controller.extend(
		"com.nubexx.ndoxx.Shell.controller.Master", {
		formatter: formatter,

		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("default").attachPatternMatched(this._onDefaultMatched, this);
			this.getOwnerComponent().getRouter().getRoute("home").attachPatternMatched(this._onHomeMatched, this);
			this.getOwnerComponent().getRouter().getRoute("drive").attachPatternMatched(this._onDriveMatched, this);
		},

		_onDefaultMatched: function (oEvent) {
			this.getOwnerComponent()
				.getRouter()
				.navTo("home", {
					viewPattern: "launchpad"
				});
		},

		_onHomeMatched: function (oEvent) {
			if (this.getView().byId("toolPage").getSideContent()) {
				this.getView().byId("toolPage").getSideContent().destroy();
			}
		},

		_onDriveMatched: function (oEvent) {
			Fragment.load({
				name: "com.nubexx.ndoxx.Shell.view.fragments.SideContent",
				controller: this
			}).then(function (oFragment) {
				this.getView().byId("toolPage").setSideContent(oFragment);
			}.bind(this));
		},

		onNavigationSelect: function (oEvent) {
			// var sSelectedApp = oEvent.getParameter("item").getText();
			// sap.ui.getCore().getEventBus().publish(sSelectedApp, "itemSelect", this.onNavigationSelect);
		},

		onAppSelect: function (oEvent) {
			var sSelectedApp = oEvent.getParameter("item").getText();
			oEvent.getSource().getParent().setText(sSelectedApp);

			if (sSelectedApp === 'Drive') {
				this.getOwnerComponent()
					.getRouter()
					.navTo("drive", {
						viewPattern: "worklist"
					});
			} else {
				this.getOwnerComponent()
					.getRouter()
					.navTo("home", {
						viewPattern: "launchpad"
					});
			}
		}
	}
	);
});