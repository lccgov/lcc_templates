    (function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.OtherStuff = LCC.OtherStuff || {};

    $(document).ready(function () {
        LCC.OtherStuff.activate();
    });

    LCC.OtherStuff.activate = function () {


    //image gallery on leisure centre page - sports specific
    $("#gallery li img").hover(function () {
        $('#main-img').attr('src', $(this).attr('src'));
    });

        $("#gallery-ImCarousel li img").hover(function () {
        $("#gallery-ImCarousel img[id$=imgTop]").attr('src', $(this).attr('src'));
    });
  

    //generic run on pages - accessibility
    //external links
    $('a[rel="external"]').attr('target', '_blank');

    //external links
    $('a[rel="pdf"]').attr('target', '_blank');

    //external links
    $('a[rel="doc"]').attr('target', '_blank');





    // event date show first three event list items - modulized
      $('ul.date-list').each(function () {
      var LiN = $(this).find('li').length;
      if (LiN > 3) {
      $('li', this).eq(2).nextAll().hide().addClass('toggleable');
      $(this).append('<a class="plusMinus">Show more...</a>');
      }
      });
      $('ul.date-list').on('click', '.plusMinus', function () {
      if ($(this).hasClass('active')) {
      $(this).text('Show more...').removeClass('active');
      } else {
      $(this).text('Show less...').addClass('active');
      }
      $(this).siblings('li.toggleable').slideToggle();
      });

    }
   global.LCC = LCC;
})(window, jQuery)