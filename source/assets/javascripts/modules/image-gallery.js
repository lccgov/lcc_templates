(function (global) {
    "use strict";

	var $ = global.jQuery
	var LCC = global.LCC || {}
		LCC.Modules = LCC.Modules || {}
		
 	LCC.Modules.ImageGallery = function () {
		this.start = function (element) {
			var thumbnails = element.data('thumbnails') ? element.data('thumbnails') : "li img",
                main_image = element.data('main-image') ? element.data('main-image') : "img.main-image";
	
            element.find(thumbnails).hover(function () {
                element.find(main_image).attr('src', $(this).attr('src'));
            });
		}   
	};
   
	global.LCC = LCC
  
})(window);