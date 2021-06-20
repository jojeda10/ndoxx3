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
			this.getOwnerComponent().getRouter().getRoute("accountPage").attachPatternMatched(this._onAccountMatched, this);
			// window.oRouter = this.getOwnerComponent()
			// .getRouter();

		},

		_onDefaultMatched: function (oEvent) {
			this.getOwnerComponent()
				.getRouter()
				.navTo("home", {
					viewPattern: "launchpad"
				});
		},

		_onHomeMatched: function (oEvent) {
			this.getView().byId("idShellbar").setShowNavButton(false);
			if (this.getView().byId("toolPage").getSideContent()) {
				this.getView().byId("toolPage").getSideContent().destroy();
			}
		},

		_onAccountMatched: function (oEvent) {

		},
		
		onNavBack: function (oEvent) {
			window.history.go(-1);
		},	

		_onDriveMatched: function (oEvent) {
			if (!window.bIsProject) {
				this.getView().byId("idShellbar").setShowNavButton(false);
				Fragment.load({
					name: "com.nubexx.ndoxx.Shell.view.fragments.SideContent",
					controller: this
				}).then(function (oFragment) {
					this.getView().byId("toolPage").setSideContent(oFragment);
				}.bind(this));
			} else {
				this.getView().byId("idShellbar").setShowNavButton(true);
				if (this.getView().byId("toolPage").getSideContent()) {
					this.getView().byId("toolPage").getSideContent().destroy();
				}
			}
		},

		_onProjectMatched: function (oEvent) {
			if (this.getView().byId("toolPage").getSideContent()) {
				this.getView().byId("toolPage").getSideContent().destroy();
			}

		},

		onNavigationSelect: function (oEvent) {
			// var sSelectedApp = oEvent.getParameter("item").getText();
			// sap.ui.getCore().getEventBus().publish(sSelectedApp, "itemSelect", this.onNavigationSelect);
		},

		onAppSelect: function (oEvent) {
			var sSelectedApp = oEvent.getParameter("item").getText();
			oEvent.getSource().getParent().setText(sSelectedApp);
			window.bIsProject = false;
			if (sSelectedApp === 'Drive') {
				this.getOwnerComponent()
					.getRouter()
					.navTo("drive", {
						viewPattern: "worklist"
					});
			} else if (sSelectedApp === 'Projects') {
				// if (this.getView().byId("toolPage").getSideContent()) {
				// 	this.getView().byId("toolPage").getSideContent().destroy();
				// }
				this.getOwnerComponent()
					.getRouter()
					.navTo("drive", {
						viewPattern: "worklist"
					});
					window.bIsProject = true;
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