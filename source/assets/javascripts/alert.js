(function (global, $) {
    "use strict";

var HostURL = window.location.host;
var LCCSite = HostURL.match(/www(-?)(.*?).leeds.gov.uk/)
                             if(LCCSite){
                                           document.getElementById("LCCAlerts").classList.remove("hide");
                             }else{
                                           document.getElementById("HNSCAlerts").classList.remove("hide");
                             }



})(window, jQuery);