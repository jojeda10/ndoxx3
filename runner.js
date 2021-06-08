sap.ui.require(
  [
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/routing/HashChanger"
  ],
  function(ComponentContainer, HashChanger) {
    "use strict";
    //Busy application
    sap.ui.core.BusyIndicator.show(0);
      new ComponentContainer({
        async: true,
        name: "com.nubexx.ndoxx.Shell",
        height: "100%"
      }).placeAt("content");

    //Set initial view to 
 //    HashChanger.getInstance().setHash("drive/worklist");
  //  HashChanger.getInstance().setHash("home/launchpad");
  }
);
