(function(global, $) {
    "use strict";
	var LCC = global.LCC || {};
    LCC.MaxCharacters = LCC.MaxCharacters || {};
	
	LCC.MaxCharacters.setMaxCharacters = function (element, maxlimit) {
		var new_length = element.val().length;
		if (new_length >= maxlimit) {
			element.val(element.val().substring(0, maxlimit));
			new_length = maxlimit;
		}
		return (maxlimit - new_length) + ' characters left';						
	}
	
    global.LCC = LCC;
})(window, jQuery);