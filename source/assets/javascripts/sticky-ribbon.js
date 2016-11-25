(function(global, $) {
    "use strict";
    $(document).ready(function() {
        if($('#ms-designer-ribbon').length === 0) {
            return;
        }

        var elementPosTop = $('#ms-designer-ribbon').position().top;
        
        $(global).scroll(function() {
            var wintop = $(global).scrollTop(), docheight = $(document).height(), winheight = $(global).height();
            //if top of element is in view
            if (wintop > elementPosTop) {
                $('#ms-designer-ribbon').css({ "position":"fixed", "top":"0", "z-index":"700" });
            }
            else {
                $('#ms-designer-ribbon').css({ "position":"inherit" });
            }
        });
    });
})(window, jQuery);