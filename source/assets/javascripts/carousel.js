(function (global, $) {
    "use strict";
    
    var LCC = global.LCC || {}
        LCC.Modules = LCC.Modules || {}

    //relies on bootstrap so make sure bootstrap is loaded before this module is used                          
    LCC.Modules.Carousel = function () {
        this.start = function (element) {        
            if($(element).find('ol.carousel-indicators').length) {
                var $indicators = $(element).find('ol.carousel-indicators');
                $(element).find('.item').each(function(index) {
                    $indicators.append('<li data-target="#' + element[0].id + '" data-slide-to="' + index + '" class="' + (index === 0 ? "active" : "")  + '"></li>');
                });
            }

            //add prev button
            element.find('.carousel-inner').append('<a class="left carousel-control" href="#' + element[0].id + '" data-slide="prev"><span class="icon-prev"><span class="sr-only">Previous slide</span></span></a>');
            //add next button
            element.find('.carousel-inner').append('<a class="right carousel-control" href="#' + element[0].id + '" data-slide="next"><span class="icon-next"></span><span class="sr-only">Next slide</span></a>');  
            
            //add play and pause button
            element.find('.carousel-inner').append('<div id="carouselButtons"> \
                                                <button id="playButton" type="button" class="btn btn-default btn-sm"> \
                                                    <span class="glyphicon glyphicon-play"></span> \
                                                    <span class="sr-only">Play carousel</span> \
                                                </button> \
                                                <button id="pauseButton" type="button" class="btn btn-default btn-sm"> \
                                                    <span class="glyphicon glyphicon-pause"></span> \
                                                    <span class="sr-only">Pause carousel</span> \
                                                </button> \
                                            </div>');
    
            //add events
            $(element).find('#playButton').click(function () {
                $(element).carousel('cycle');
            });
           $(element).find('#pauseButton').click(function () {
                $(element).carousel('pause');
            });
        }   
    };
   
    global.LCC = LCC
})(window, jQuery)
