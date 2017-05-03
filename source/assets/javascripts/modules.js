//https://github.com/alphagov/govuk_frontend_toolkit/blob/master/javascripts/govuk/modules.js
$(document).ready(function () {
  LCC.modules.start();
});

(function (global) {
  "use strict";


  var $ = global.jQuery;
  var LCC = global.LCC || {};
  LCC.Modules = LCC.Modules || {};


  LCC.modules = {
    find: function (container) {
      var modules,
        moduleSelector = '[data-module]',
        container = container || $('body');

      modules = container.find(moduleSelector);

      // Container could be a module too 
      if (container.is(moduleSelector)) {
        modules = modules.add(container);
      }

      return modules;
    },

    start: function (container, force) {
      var modules = this.find(container);
      force = force || false;

      for (var i = 0, l = modules.length; i < l; i++) {
        var module,
          element = $(modules[i]),
          type = camelCaseAndCapitalise(element.data('module')),
          started = element.data('module-started');

        if (typeof LCC.Modules[type] === "function" && (!started || force )) {
          module = new LCC.Modules[type]();
          module.start(element);
          element.data('module-started', true);
        }
      }

      // eg selectable-table to SelectableTable 
      function camelCaseAndCapitalise(string) {
        return capitaliseFirstLetter(camelCase(string));
      }

      // http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase 
      function camelCase(string) {
        return string.replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
      }

      // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript 
      function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }
  }

  global.LCC = LCC;
})(window); 