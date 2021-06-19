sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "com/nubexx/ndoxx/Drive/model/formatter"
  ],
  function(Controller, formatter) {
    "use strict";

    return Controller.extend(
      "com.nubexx.ndoxx.Drive.controller.App",
      {
        formatter: formatter,

        onInit: function() {}
      }
    );
  }
);
