sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/dnd/DragInfo",
	"sap/f/dnd/GridDropInfo",
	"sap/ui/core/dnd/DropPosition",
	"sap/ui/core/dnd/DropLayout",
	"sap/ui/core/Fragment",
	"sap/ui/core/format/DateFormat",
	"../model/formatter"
], function (
	Controller,
	JSONModel,
	DragInfo,
	GridDropInfo,
	DropPosition,
	DropLayout,
	Fragment,
	DateFormat,
	formatter
) {
	"use strict";

	return Controller.extend(
		"com.nubexx.ndoxx.Home.controller.Launchpad", {
		formatter: formatter,

		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("launchpad").attachPatternMatched(this._onLaunchpadMatched, this);

			var cardManifests = new JSONModel();

			cardManifests.loadData(sap.ui.require.toUrl("com/nubexx/ndoxx/Home/model/cardManifests.json"));

			this.getView().setModel(cardManifests, "manifests");

		},

		onProjectSelect: function () {
			this._getShellRouter().navTo("drive", {
				viewPattern: "worklist"
			});
			window.bIsProject = true;
		},	

		_getShellRouter: function() {
			return sap.ui.getCore().byId(this.getView().getParent().getParent().getParent()._sOwnerId + "---app").getController().getOwnerComponent().getRouter();
		},

		_validate_token: function() {
			var sToken = localStorage.getItem("token");
			/* eslint-enable sap-no-localstorage */
			//Call Backend and validate token

			this._goToLoginPage();

			//this._goToHomePage();
			return true;
		},

		_onLaunchpadMatched: function (oEvent) {

			//If valid token then continue otherwise go to account page
			var sToken = localStorage.getItem("token");
                sToken = "397";

			this._validate_token(sToken);
			
			// if (this_validate_token(sToken)) 
			// //if valid account id then go to login page otherwise go to account page


		},

		_goToLoginPage: function (oEvent) {
			 var sAccountId = localStorage.getItem("accountId");
			 /* eslint-enable sap-no-localstorage */
			 if (sAccountId && sAccountId !== "") {
			 	this._getShellRouter().navTo("loginPage", {
			 		accountId: sAccountId
			 	});
			 } else {
			 	// this._getShellRouter().navTo("loginPage", {
			 	// 	accountId: "777777777777"
			 	// });
			 	this._getShellRouter().navTo("accountPage");
			 }
		},

		_goToHomePage: function (oEvent) {

			this.getView().byId("reports").destroyContent();
			Fragment.load({
				name: "com.nubexx.ndoxx.Home.view.fragments.tabs.Kpi",
				controller: this
			}).then(function (oFragment) {
				this.getView().byId("reports").addContent(oFragment);
			}.bind(this));

			// Model used to manipulate control states. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});

			var oGrid = this.byId("grid1");

			oGrid.addDragDropConfig(new DragInfo({
				sourceAggregation: "items"
			}));

			oGrid.addDragDropConfig(new GridDropInfo({
				targetAggregation: "items",
				dropPosition: DropPosition.Between,
				dropLayout: DropLayout.Horizontal,
				drop: function (oInfo) {
					var oDragged = oInfo.getParameter("draggedControl"),
						oDropped = oInfo.getParameter("droppedControl"),
						sInsertPosition = oInfo.getParameter("dropPosition"),
						iDragPosition = oGrid.indexOfItem(oDragged),
						iDropPosition = oGrid.indexOfItem(oDropped);

					oGrid.removeItem(oDragged);

					if (iDragPosition < iDropPosition) {
						iDropPosition--;
					}

					if (sInsertPosition === "After") {
						iDropPosition++;
					}

					oGrid.insertItem(oDragged, iDropPosition);
					oGrid.focusItem(iDropPosition);
				}
			}));

			// Use smaller margin around grid when on smaller screens
			oGrid.attachLayoutChange(function (oEvent) {
				var sLayout = oEvent.getParameter("layout");

				if (sLayout === "layoutXS" || sLayout === "layoutS") {
					oGrid.removeStyleClass("sapUiSmallMargin");
					oGrid.addStyleClass("sapUiTinyMargin");
				} else {
					oGrid.removeStyleClass("sapUiTinyMargin");
					oGrid.addStyleClass("sapUiSmallMargin");
				}
			});

			// this.getRouter().getRoute("home").attachPatternMatched(this._onHomeMatched, this);
			// this.getRouter().getRoute("default").attachPatternMatched(this._onDefaultMatched, this);
			//	this._onDefaultMatched();
			this.getView().setModel(oViewModel, "objectView");
			var lineChartData = {
				labels: ["January", "February", "March", "April", "May", "June", "July"],
				datasets: [{
					label: "My First dataset",
					fill: false,
					lineTension: 0.1,
					backgroundColor: "rgba(75,192,192,0.4)",
					borderColor: "rgba(75,192,192,1)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: "rgba(75,192,192,1)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(75,192,192,1)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: [65, 59, 80, 81, 56, 55, 40],
					spanGaps: false
				}]
			};

			var barChartData = {
				labels: ["January", "February", "March", "April", "May", "June", "July"],
				datasets: [{
					label: "My First dataset",
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255,99,132,1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1,
					data: [65, 59, 80, 81, 56, 55, 40],
				}]
			};

			var radarChartData = {
				labels: ["Scope of OH&S", "OH&S policy", "Responsibilities", "Risks", "Assessment", "Plans", "Emergencies"],
				datasets: [{
					label: "OHSAS 18001",
					backgroundColor: "rgba(179,181,198,0.2)",
					borderColor: "rgba(179,181,198,1)",
					pointBackgroundColor: "rgba(179,181,198,1)",
					pointBorderColor: "#fff",
					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: "rgba(179,181,198,1)",
					data: [65, 59, 90, 81, 56, 55, 40]
				}, {
					label: "ISO 45001:2018",
					backgroundColor: "rgba(255,99,132,0.2)",
					borderColor: "rgba(255,99,132,1)",
					pointBackgroundColor: "rgba(255,99,132,1)",
					pointBorderColor: "#fff",
					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: "rgba(255,99,132,1)",
					data: [28, 48, 40, 19, 96, 27, 100]
				}]
			};

			var polarAreaChartData = {
				labels: [
					"Red",
					"Green",
					"Yellow",
					"Grey",
					"Blue"
				],
				datasets: [{
					data: [
						11,
						16,
						7,
						3,
						14
					],
					backgroundColor: [
						"#FF6384",
						"#4BC0C0",
						"#FFCE56",
						"#E7E9ED",
						"#36A2EB"
					],
					label: 'My dataset' // for legend
				}]
			};

			var pieChartData = {
				labels: [
					"Red",
					"Blue",
					"Yellow"
				],
				datasets: [{
					data: [300, 50, 100],
					backgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56"
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56"
					]
				}]
			};

			var bubbleChartData = {
				datasets: [{
					label: 'First Dataset',
					data: [{
						x: 20,
						y: 30,
						r: 15
					}, {
						x: 40,
						y: 10,
						r: 10
					}],
					backgroundColor: "#FF6384",
					hoverBackgroundColor: "#FF6384",
				}]
			};

			this.getView().setModel(new JSONModel({
				lineChart: lineChartData,
				barChart: barChartData,
				radarChart: radarChartData,
				polarAreaChart: polarAreaChartData,
				pieChart: pieChartData,
				bubbleChart: bubbleChartData
			}), "temp");
		},

		onPressNav2Button: function () {
			this.getOwnerComponent()
				.getRouter()
				.navTo("sub1view2");
		},

		onPressNavSub2Button: function () {
			sap.ui
				.getCore()
				.getEventBus()
				.publish("nav", "sub2component:home");
		}
	}
	);
});