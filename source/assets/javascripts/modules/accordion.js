(function (global, $) {
    "use strict";
    
    var LCC = global.LCC || {}
        LCC.Modules = LCC.Modules || {}
                                
    LCC.Modules.Accordion = function () {
        this.start = function (element) {
            var drawer_panel = element.data('accordion-drawer-panel') ? element.data('accordion-drawer-panel') : '.accordion-drawer a ~ div',
                drawer_header = element.data('accordion-drawer-header') ? element.data('accordion-drawer-header') : '.accordion-drawer a:first-child';

            $(element).find(drawer_panel).hide();
            $(element).find(drawer_header).on("click", function()
            {
                $(this).toggleClass("active");
                $(this).next('div').slideToggle();                                                                
                if ($(this).children().find('#tooltip').text() === "Click to expand") {
                    $(this).children().find('#tooltip').text('Click to hide')
                }
                else {
                    $(this).children().find('#tooltip').text('Click to expand')
                }
                return false;
            });  
        }   
    };
   
    global.LCC = LCC
})(window, jQuery)
