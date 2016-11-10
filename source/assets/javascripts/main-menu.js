(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.MainMenu = LCC.MainMenu || {};

    $(document).ready(function () {
        LCC.MainMenu.addActiveItemEvent();
    });

    LCC.MainMenu.addActiveItemEvent = function () {
        $('a.main-menu').click(function() {
            $('#main-menu').toggleClass("active");
            $(this).toggleClass("active");
            $('#main-menu ul.root li:nth-child(1) a').addClass("firstItem");
            $('#main-menu ul.root li ul li a').removeClass("firstItem");
            $('#main-menu ul.root li a.firstItem').focus();
        });
    };

    global.LCC = LCC;

})(window, jQuery);