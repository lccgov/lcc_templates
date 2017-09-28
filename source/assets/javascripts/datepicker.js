(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.Datepicker = LCC.Datepicker || {};

    $(document).ready(function () {
        $("input[data-type='datepicker-start']").datepicker({
            defaultDate: null,
            dateFormat: "dd/mm/yy",
            changeMonth: true,
            minDate: 0,
            onSelect: function(selected) {
                $("input[data-type='datepicker-end']").datepicker("option", "minDate", selected)
            }
        });
        $("input[data-type='datepicker-end']").datepicker({
            defaultDate: null,
            dateFormat: "dd/mm/yy",
            changeMonth: true,
            minDate: 0,
            onSelect: function (selected) {
                $("input[data-type='datepicker-start']").datepicker("option", "maxDate", selected)
            }
        }); 
        $("input[data-type='datepicker-start-nomin']").datepicker({
            defaultDate: null,
            dateFormat: "dd/mm/yy",
            changeMonth: true,
            onSelect: function(selected) {
                $("input[data-type='datepicker-end-nomin']").datepicker("option", "minDate", selected)
            }
        });
        $("input[data-type='datepicker-end-nomin']").datepicker({
            defaultDate: null,
            dateFormat: "dd/mm/yy",
            changeMonth: true,
            onSelect: function (selected) {
                $("input[data-type='datepicker-start-nomin']").datepicker("option", "maxDate", selected)
            }
        });
    });

    global.LCC = LCC;

})(window, jQuery);