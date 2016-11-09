(function (global, $) {
    "use strict";

	var LCC = global.LCC || {}
		LCC.Modules = LCC.Modules || {}
		
 	LCC.Modules.ScrollTo = function () {
		this.start = function (element) {
		    // bind a click event to the 'skip' link
            $(element).click(function (event) {
                var scrollTo = '#' + this.href.split('#')[1]
                $("body, html").animate({ scrollTop: $(scrollTo).offset().top }, 600, function () {
                    $(scrollTo).attr('tabindex', '-1').on('blur focusout', function () {
                        // when focus leaves this element, 
                        // remove the tabindex attribute
                        $(this).removeAttr('tabindex');
                    }).focus(); // focus on the content container           
                });
            });
		}   
	};
   
	global.LCC = LCC
  
})(window, jQuery);