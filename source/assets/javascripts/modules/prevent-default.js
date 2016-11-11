(function (global, $) {
    "use strict";

	var LCC = global.LCC || {}
		LCC.Modules = LCC.Modules || {}
		
 	LCC.Modules.PreventDefault = function () {
		this.start = function (element) {
            var children = element.data('prevent-default-children') ? element.data('prevent-default-children') : "";
            if(children !== "") {
                element.find(children).on('click', function (e) { e.preventDefault(); return true; });
            } else {
                element.on('click', function (e) { e.preventDefault(); return true; });
            }
		}   
	};
   
	global.LCC = LCC
  
})(window, jQuery);