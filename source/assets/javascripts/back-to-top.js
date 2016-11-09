(function (global) {
    "use strict";

	var $ = global.jQuery
	var LCC = global.LCC || {}
		LCC.Modules = LCC.Modules || {}
		
 	LCC.Modules.BackToTop = function () {
		this.start = function (element) {
			// browser window scroll (in pixels) after which the "back to top" link is shown
			var offset = element.data('offset') ? element.data('offset') : 300,
				//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
				offset_opacity = element.data('offset-opacity') ? element.data('offset-opacity') : 1200,
				//duration of the top scrolling animation (in ms)
				scroll_top_duration = element.data('scroll-top-duration') ? element.data('scroll-top-duration') : 700;
	
			//hide or show the "back to top" link
			$(global).scroll(function() {
				($(this).scrollTop() > offset) ? element.addClass('cd-is-visible') : element.removeClass('cd-is-visible cd-fade-out');		
				if($(this).scrollTop() > offset_opacity) { 
					element.addClass('cd-fade-out');
				}
			});

			//smooth scroll to top
			element.on('click', function(event){
				event.preventDefault();
				$('body,html').animate({
				   scrollTop: 0 ,
				}, scroll_top_duration);
			});
		}   
	};
   
	global.LCC = LCC
  
})(window);