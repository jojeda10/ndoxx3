sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/Component", "../model/formatter"],
  function(Controller, Component, formatter) {
    "use strict";

    return Controller.extend(
      "com.nubexx.ndoxx.Shell.controller.Drive",
      {
        formatter: formatter,

        onInit: function() {
          if (!Component.get("sub2Component")) {
            Component.create({
              name: "com.nubexx.ndoxx.Drive",
              id: "sub2Component"
            }).then(
              function(Component) {
                this.getView()
                  .byId("idDrive")
                  .setComponent(Component);
              }.bind(this)
            );
          }
        }
      }
    );
  }
);
