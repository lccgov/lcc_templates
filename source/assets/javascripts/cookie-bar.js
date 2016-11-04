(function (global, $) {
  "use strict";

  var LCC = global.LCC || {};
	  LCC.Cookie = LCC.Cookie || {};

  $(document).ready(function () {
    LCC.Cookie.addCookieMessage();
  });

  LCC.Cookie.addCookieMessage = function () {

    var message = document.getElementById('global-cookie-message');
    if (message) {
      $(message).on('click', '.js-seen-cookie-message', function (event) {
        LCC.Cookie.cookieCommand('seen_cookie_message', 'yes', { days: 28 });
      });

      if (LCC.Cookie.cookieCommand('seen_cookie_message') === null) {
        message.style.display = 'block';
      }
    }
  };

  /*
    Cookie methods
    ==============

    Usage:

      Setting a cookie:
      LCC.Cookie.cookieCommand('hobnob', 'tasty', { days: 30 });

      Reading a cookie:
      LCC.Cookie.cookieCommand('hobnob');

      Deleting a cookie:
      LCC.Cookie.cookieCommand('hobnob', null);
  */
  
  LCC.Cookie.cookieCommand = function (name, value, options) {
    if (typeof value !== 'undefined') {
      if (value === false || value === null) {
        return LCC.Cookie.setCookie(name, '', { days: -1 });
      } else {
        return LCC.Cookie.setCookie(name, value, options);
      }
    } else {
      return LCC.Cookie.getCookie(name);
    }
  };
  LCC.Cookie.setCookie = function (name, value, options) {
    if (typeof options === 'undefined') {
      options = {};
    }
    var cookieString = name + "=" + value + "; path=/";
    if (options.days) {
      var date = new Date();
      date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
      cookieString = cookieString + "; expires=" + date.toGMTString();
    }
    if (document.location.protocol == 'https:') {
      cookieString = cookieString + "; Secure";
    }
    document.cookie = cookieString;
  };
  LCC.Cookie.getCookie = function (name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  };

  global.LCC = LCC;
})(window, jQuery);