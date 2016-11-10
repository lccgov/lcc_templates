(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.EqualHeights = LCC.EqualHeights || {};

    $(global).on('load', function() {
        LCC.EqualHeights.applyEqualHeights();
    });

    $(global).on('resize', function(){
        LCC.EqualHeights.applyEqualHeights();
    });

    LCC.EqualHeights.applyEqualHeights = function () {
        var currentTallest = 0,
            currentRowStart = 0,
            rowDivs = new Array(),
            $el,
            topPosition = 0;

        $('.equal-item').each(function() {
            $el = $(this);
            $($el).height('auto')
            topPosition = $el.position().top;

            if (currentRowStart != topPosition) {
                for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                    rowDivs[currentDiv].height(currentTallest);
                }
                rowDivs.length = 0; // empty the array
                currentRowStart = topPosition;
                currentTallest = $el.height();
                rowDivs.push($el);
            } else {
                rowDivs.push($el);
                currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
            }
            for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
        });
    };

    global.LCC = LCC;

})(window, jQuery);