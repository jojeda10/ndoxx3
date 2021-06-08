sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/Component", "../model/formatter"],
  function(Controller, Component, formatter) {
    "use strict";

    return Controller.extend(
      "com.nubexx.ndoxx.Shell.controller.Home",
      {
        formatter: formatter,

        onInit: function() {
          if (!Component.get("sub1Component")) {
            Component.create({
              name: "com.nubexx.ndoxx.Home",
              id: "sub1Component"
            }).then(
              function(Component) {
                this.getView()
                  .byId("sub1CmpCtr")
                  .setComponent(Component);
              }.bind(this)
            );
          }
        }
      }
    );
  }
);
