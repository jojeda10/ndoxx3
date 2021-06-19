sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		ndoxxIconExcelVisible: function (sDocumentType) {
			var bVisible;
			if (sDocumentType === 'Excel') {
				bVisible = true;
			}

			// switch (sDocumentType) {
			// 	case 'Excel':
			// 		sIcon = "sap-icon://excel-attachment";
			// 		break;
			// 	case 'Word':
			// 		sIcon = "sap-icon://doc-attachment";
			// 		break;
			// 	case 'PowerPoint':
			// 		sIcon = "sap-icon://ppt-attachment";
			// 		break;
			// 	case 'Pdf':
			// 		sIcon = "sap-icon://pdf-attachment";
			// 		break;
			// 	default :
			// 		sIcon = "sap-icon://document";
			// 		break;
			// }
			return bVisible;
		},

		ndoxxIconType: function (sDocumentType) {
			var sIcon;
			switch (sDocumentType) {
				case 'Excel':
					sIcon = "sap-icon://excel-attachment";
					break;
				case 'Word':
					sIcon = "sap-icon://doc-attachment";
					break;
				case 'PowerPoint':
					sIcon = "sap-icon://ppt-attachment";
					break;
				case 'Pdf':
					sIcon = "sap-icon://pdf-attachment";
					break;
				case 'CAD':
						sIcon = "sap-icon://document";
						break;
				case 'File':
						sIcon = "sap-icon://document";
						break;
				default :
					sIcon = "sap-icon://folder-blank";
					break;
			}
			return sIcon;
		},

		ndoxxIconClass: function (sDocumentType) {
			var sIcon;
			switch (sDocumentType) {
				case 'Excel':
					sIcon = "ndoxxTileExcelIcon";
					break;
				case 'Word':
					sIcon = "sap-icon://doc-attachment";
					break;
				case 'PowerPoint':
					sIcon = "sap-icon://ppt-attachment";
					break;
				case 'Pdf':
					sIcon = "sap-icon://pdf-attachment";
					break;
				default :
					sIcon = "sap-icon://document";
					break;
			}
			return sIcon;
		},

		ndoxxTileTextLength: function (sValue) {
			// var sTileText;
			// if (sValue.length > 15) {
			// 	sTileText = sValue.substring(0, 13) + '...';
			// } else {
			// 	sTileText = sValue;
			// }
			// return sTileText;
			return sValue;
		},

		uploadButtonVisibility: function (sSelection, sMode) {
			var bInvisible;
			if (sSelection === "folders" && sMode === "endUser") {
				bInvisible = false;
			} else {
				bInvisible = true;
			}

			return bInvisible;
		}

	};

});