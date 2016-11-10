(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.GlobalSearch = LCC.GlobalSearch || {};

    $(document).ready(function () {
        LCC.GlobalSearch.addClickEvent();
    });

    LCC.GlobalSearch.addClickEvent = function () {
        $('a.search').click(function() {
            $('#nav-search').toggleClass("active");
            $(this).toggleClass("active");
            $('#nav-search input').focus();
        });
    };

    global.LCC = LCC;

})(window, jQuery);