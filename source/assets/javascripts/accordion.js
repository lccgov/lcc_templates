    (function (global) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.Accordion = LCC.Accordion || {};

    $(document).ready(function () {
        LCC.Accordion.activate();
    });

    LCC.Accordion.activate = function () {
         //Accordion 
         $('.expandContent h3 ~ div').hide();

         $(".expandContent h3").on("click", function()
            {
                $(this).toggleClass("active");
                var p = $(this).next('div').slideToggle();				
                if ($(this).children().find('#tooltip').text() === "Click to expand")
                {
                    $(this).children().find('#tooltip').text('Click to hide')
                }
                else
                {
                    $(this).children().find('#tooltip').text('Click to expand')
                }
                return false;
           });  

    }
   global.LCC = LCC;
})(window)