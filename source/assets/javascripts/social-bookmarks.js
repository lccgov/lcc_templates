(function (global) {
    "use strict";

    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};

    LCC.Modules.SocialBookmarks = function () {
        this.start = function (element) {
        
            getSocialBookmarks();
            
            function getSocialBookmarks() { 
                
                var source = $("#bookmarks-template").html().replace("//<![CDATA[", "").replace("//]]>", "");   //Remove replaces when we switch to templates
                var template = Handlebars.compile(source);

                var html;
                var currentDate = Date.now();					
                
                if (localStorage && localStorage.getItem('socialBookmarks') 
                    && currentDate < localStorage.getItem('socialBookmarksExpiry'))
                {
                    html = localStorage.getItem('socialBookmarks');
                    $("#bookmarks").html(html);
                    document.getElementById('socialBookmarks').style.display = 'block';
                }
                else
                {					
                    $.ajax({
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('Social Bookmarks')/items?$select=Title,URL,RoutingRuleDescription&$orderby=LCCOrderBy",
                        type: "GET",
                        dataType: 'json',
                        headers: {
                            "accept": "application/json;odata=verbose"
                        },
                        success: function (data) {

                            var bookmarks = [];
                            
                            $.each(data.d.results, function (index, item) 	{							
                                bookmarks.push({ 'class': item.Title, 'link': item.URL.Url, 'description': item.RoutingRuleDescription });
                            });

                            html = template({ Bookmarks: bookmarks });
                            $("#bookmarks").html(html);
                            document.getElementById('socialBookmarks').style.display = 'block';

                            localStorage.setItem('socialBookmarks', html);
                            var expires = currentDate + 2419200000; // 28 days
                            localStorage.setItem('socialBookmarksExpiry', expires);
                        },
                        error: function (err) {
                            html = "<p>Error retrieving list items</p>";
                            $("#bookmarks").html(html);
                        }
                    });					
                }
            }
        }
    };

    global.LCC = LCC;
})(window);