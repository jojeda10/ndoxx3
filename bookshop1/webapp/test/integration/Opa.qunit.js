sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'bookshop1/test/integration/pages/MainListReport' ,
        'bookshop1/test/integration/pages/MainObjectPage',
        'bookshop1/test/integration/OpaJourney'
    ],
    function(JourneyRunner, MainListReport, MainObjectPage, Journey) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('bookshop1') + '/index.html'
        });

        
        JourneyRunner.run(
            {
                pages: { onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage }
            },
            Journey.run
        );
        
    }
);