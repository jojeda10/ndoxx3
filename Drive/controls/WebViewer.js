sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/dom/includeScript",
    "sap/base/Log"

], function (Control, includeScript, log) {
    "use strict";
    return Control.extend("nbx.control.WebViewer", {
        metadata : {
            properties : {
                webViewerServer: {type : "string", defaultValue : ''},
                libJsPath: {type : "string", defaultValue : ''},
                documentUrl: {type : "string", defaultValue : ''},
                viewerConfig: {type : "object", defaultValue : {}}
            },
        },

        /**
         * Some defaults for web viewer configuration.
         */
        viewerConfigDefaults: {
         },

        /**
         * Holds the web viewer object after methode initializeWebViewer is called.
         */
        webViewer: {},

        /**
         * Holds the annotation manager object after methode initializeWebViewer is called.
         */
        annotManager: {},

        /**
         * Called before onAfterRendering
         */
        init : function () {
            console.log('init')
        },

        /**
         * Called after the control is rendered
         */
        onAfterRendering: function() {
            if (this.getProperty("libJsPath")) {
                var thisControl = this;
                var libJs = thisControl.getProperty("libJsPath") + 'webviewer.min.js';

                new Promise(function(fnResolve, fnReject) {
                    includeScript(libJs, "webViewerLib", fnResolve, fnReject);
                }).then(function() {
                    var elementId = thisControl.getId();
                    var viewerConfig = thisControl.initializeViewerConfigValues();
                    thisControl.initializeWebViewer(elementId, viewerConfig)
                }, function(reason, e) {
                    log.fatal("The web viewer lib could not loaded.", libJs, "[webViewer]");
                });

            } else {
                log.fatal('Property \"libJsPath\" ist not set', "", "[webViewer]");
            }
        },

        /**
         * Merge viewerConfig with defaults and values from properties
         *
         * @returns {jQuery|*|{}}
         */
        initializeViewerConfigValues: function() {
            var viewerConfigFromProperties = {
                type: (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) ? 'mobile' : 'desktop',
                documentUrl: this.getProperty("documentUrl")
            };

            return jQuery.extend( true, {}, this.viewerConfigDefaults, viewerConfigFromProperties, this.getProperty("viewerConfig")) ;
        },

        /**
         * Initialize the web viewer
         *
         * @param webViewerId
         * @param viewerConfig
         */
        initializeWebViewer: function(webViewerId, viewerConfig) {
            var libJsPath = this.getProperty("libJsPath");
            var webViewContainer = document.getElementById(webViewerId)
            webViewContainer.style.height = '100%';
            const webViewerConfig = {
                path: libJsPath,
                initialDoc: viewerConfig.documentUrl,
                //enableAnnotations: true,
                enableFilePicker: true,
                enableMeasurement: true,
                enableRedaction: true,
                disabledElements: [
                    'selectToolButton', 'outlinesPanelButton', 'notesPanelButton'
                ],
                forceClientSideInit: true
            }
            if (this.getProperty("webViewerServer")) {
                webViewerConfig.pdftronServer = this.getProperty("webViewerServer");
            }
            console.log(webViewerConfig);
            WebViewer(webViewerConfig, webViewContainer).then(function(instance) {
                const options = {
                    customHeaders: { MyDocIdentifier: "12345id" },
                    filename: "Document.pdf"
                };

                const webViewer = instance.docViewer;
                const annotManager = instance.annotManager;
                webViewer.on('documentLoaded', function() {
                    console.log('documentLoaded');
                });

                // for Layers
                // https://www.pdftron.com/documentation/web/guides/show-hide-layers/
                const { docViewer } = instance;
                docViewer.on('documentLoaded', () => {
                    const doc = docViewer.getDocument();
                    doc.getLayersArray().then(layers => {
                        // Set all layers to not visible
//                        layers.forEach((layer, index) => {
//                            layers[index].visible = false;
//                        });
                        doc.setLayersArray(layers);
                        // clears page cache
                        docViewer.refreshAll();
                        // redraws
                        docViewer.updateView();
                    });
                })
            });
        },

        /**
         * Gets the web viewer object
         *
         * @returns {{}}
         */
        getWebViewer: function() {
            return this.webViewer;
        },

        /**
         * @param oRM
         * @param oControl
         */
        renderer : function (oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write("></div>");
        }
    });
});