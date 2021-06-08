sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/dom/includeScript",
	"sap/base/Log"

], function (Control, includeScript, log) {
	"use strict";
	return Control.extend("nbx.control.DocumentEditor", {
		metadata: {
			properties: {
				apiUrl: {
					type: "string",
					defaultValue: ''
				},
				apiJs: {
					type: "string",
					defaultValue: '/web-apps/apps/api/documents/api.js'
				},
				documentUrl: {
					type: "string",
					defaultValue: ''
				},
				documentType: {
					type: "string",
					defaultValue: 'docx'
				},
				documentTitle: {
					type: "string",
					defaultValue: ''
				},
				editorConfig: {
					type: "object",
					defaultValue: {}
				}
			},
			events: {
				documentReady: {}
			}
		},

		/**
		 * Some defaults for document editor configuration.
		 */
		editorConfigDefaults: {
			document: {
				permissions: {
					comment: false,
					download: false,
					edit: false,
					fillForms: false,
					review: false,
					print: false,
				}
			},
			editorConfig: {
				mode: 'edit',
				customization: {
					autoSave: false,
					chat: false,
					commentAuthorOnly: false,
					comments: false,
					compactHeader: false,
					compactToolbar: false,
					forcesave: false,
					help: false,
					hideRightMenu: false,
					showReviewChanges: false,
					toolbarNoTabs: false,
				},
			}
		},

		/**
		 * Holds the document editor object after methode initializeDocumentEditor is called.
		 */
		documentEditor: {},

		init: function () {
		},
	
		/**
		 * Called after the control is rendered
		 */
		onAfterRendering: function () {
			if (this.getProperty("apiUrl")) {
				var thisControl = this;
				var elementId = thisControl.getId();
				var docEditorId = 'docEditor_' + elementId;

				var editorConfig = this.initializeEditorConfigValues();

				jQuery("#" + elementId).wrap($('<form />').attr('id', docEditorId));
				var apiJsUrl = this.getProperty("apiUrl") + this.getProperty("apiJs");

				new Promise(function (fnResolve, fnReject) {
					includeScript(apiJsUrl, "documentEditorApi", fnResolve, fnReject);
				}).then(function () {
					thisControl.initializeDocumentEditor(docEditorId, editorConfig);
				//	this.setBusy(false);
				    this.fireDocumentReady();
					
				}.bind(this), function (reason, e) {
					log.fatal("DocEditor could not load javascript API from document server.", apiJsUrl, "[documentEditor]");
					//this.setBusy(false);
				}.bind(this));

			} else {
				log.fatal('Property \"apiUrl\" was not set', "", "[documentEditor]");
			}
		},

		/**
		 * Merge editorConfig with defaults and values from properties
		 *
		 * @returns {jQuery|*|{}}
		 */
		initializeEditorConfigValues: function () {
			var editorConfigFromProperties = {
				type: (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) ? 'mobile' : 'desktop',
				document: {
					url: this.getProperty("documentUrl"),
					fileType: this.getProperty("documentType"),
					title: this.getProperty("documentTitle"),
				},
				editorConfig: {
					callbackUrl: this.getProperty("documentUrl"),
					//callbackUrl: "https://webidetesting5419390-eujbb9f9h4.dispatcher.eu2.hana.ondemand.com/ndoxxFileBackend/NdoxxService?fileName=" + this.document.getProperty("documentUrl"),
					lang: sap.ui.getCore().getConfiguration().getLanguage()
				}
			};

			return jQuery.extend(true, {}, this.editorConfigDefaults, editorConfigFromProperties, this.getProperty("editorConfig"));
		},

		/**
		 * Initialize the doc editor
		 *
		 * @param docEditorId
		 * @param editorConfig
		 */
		initializeDocumentEditor: function (docEditorId, editorConfig) {
			this.documentEditor = new DocsAPI.DocEditor(docEditorId, editorConfig);
		},

		/**
		 * Gets the document editor object
		 *
		 * @returns {{}}
		 */
		getDocumentEditor: function () {
			return this.documentEditor;
		},

		/**
		 * @param oRM
		 * @param oControl
		 */
		renderer: function (oRM, oControl) {
			oRM.write("<div style='height: 100%;'");
			oRM.writeControlData(oControl);
			oRM.write("></div>");
		}
	});
});