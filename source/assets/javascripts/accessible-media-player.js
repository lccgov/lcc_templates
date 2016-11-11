/*! jQuery UI - v1.10.2 - 2013-03-19
 * http://jqueryui.com
 * Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.slider.js
 * Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function($, undefined) {

  var uuid = 0,
    runiqueId = /^ui-id-\d+$/;

  // $.ui might exist from components with no dependencies, e.g., $.ui.position
  $.ui = $.ui || {};

  $.extend($.ui, {
    version: "1.10.2",

    keyCode: {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      NUMPAD_ADD: 107,
      NUMPAD_DECIMAL: 110,
      NUMPAD_DIVIDE: 111,
      NUMPAD_ENTER: 108,
      NUMPAD_MULTIPLY: 106,
      NUMPAD_SUBTRACT: 109,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38
    }
  });

  // plugins
  $.fn.extend({
    focus: (function(orig) {
      return function(delay, fn) {
        return typeof delay === "number" ?
          this.each(function() {
            var elem = this;
            setTimeout(function() {
              $(elem).focus();
              if (fn) {
                fn.call(elem);
              }
            }, delay);
          }) :
          orig.apply(this, arguments);
      };
    })($.fn.focus),

    scrollParent: function() {
      var scrollParent;
      if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
        scrollParent = this.parents().filter(function() {
          return (/(relative|absolute|fixed)/).test($.css(this, "position")) && (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
        }).eq(0);
      } else {
        scrollParent = this.parents().filter(function() {
          return (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
        }).eq(0);
      }

      return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
    },

    zIndex: function(zIndex) {
      if (zIndex !== undefined) {
        return this.css("zIndex", zIndex);
      }

      if (this.length) {
        var elem = $(this[0]),
          position, value;
        while (elem.length && elem[0] !== document) {
          // Ignore z-index if position is set to a value where z-index is ignored by the browser
          // This makes behavior of this function consistent across browsers
          // WebKit always returns auto if the element is positioned
          position = elem.css("position");
          if (position === "absolute" || position === "relative" || position === "fixed") {
            // IE returns 0 when zIndex is not specified
            // other browsers return a string
            // we ignore the case of nested elements with an explicit value of 0
            // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
            value = parseInt(elem.css("zIndex"), 10);
            if (!isNaN(value) && value !== 0) {
              return value;
            }
          }
          elem = elem.parent();
        }
      }

      return 0;
    },

    uniqueId: function() {
      return this.each(function() {
        if (!this.id) {
          this.id = "ui-id-" + (++uuid);
        }
      });
    },

    removeUniqueId: function() {
      return this.each(function() {
        if (runiqueId.test(this.id)) {
          $(this).removeAttr("id");
        }
      });
    }
  });

  // selectors
  function focusable(element, isTabIndexNotNaN) {
    var map, mapName, img,
      nodeName = element.nodeName.toLowerCase();
    if ("area" === nodeName) {
      map = element.parentNode;
      mapName = map.name;
      if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
        return false;
      }
      img = $("img[usemap=#" + mapName + "]")[0];
      return !!img && visible(img);
    }
    return (/input|select|textarea|button|object/.test(nodeName) ?
        !element.disabled :
        "a" === nodeName ?
        element.href || isTabIndexNotNaN :
        isTabIndexNotNaN) &&
      // the element and all of its ancestors must be visible
      visible(element);
  }

  function visible(element) {
    return $.expr.filters.visible(element) &&
      !$(element).parents().addBack().filter(function() {
        return $.css(this, "visibility") === "hidden";
      }).length;
  }

  $.extend($.expr[":"], {
    data: $.expr.createPseudo ?
      $.expr.createPseudo(function(dataName) {
        return function(elem) {
          return !!$.data(elem, dataName);
        };
      }) :
      // support: jQuery <1.8
      function(elem, i, match) {
        return !!$.data(elem, match[3]);
      },

    focusable: function(element) {
      return focusable(element, !isNaN($.attr(element, "tabindex")));
    },

    tabbable: function(element) {
      var tabIndex = $.attr(element, "tabindex"),
        isTabIndexNaN = isNaN(tabIndex);
      return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
    }
  });

  // support: jQuery <1.8
  if (!$("<a>").outerWidth(1).jquery) {
    $.each(["Width", "Height"], function(i, name) {
      var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
        type = name.toLowerCase(),
        orig = {
          innerWidth: $.fn.innerWidth,
          innerHeight: $.fn.innerHeight,
          outerWidth: $.fn.outerWidth,
          outerHeight: $.fn.outerHeight
        };

      function reduce(elem, size, border, margin) {
        $.each(side, function() {
          size -= parseFloat($.css(elem, "padding" + this)) || 0;
          if (border) {
            size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
          }
          if (margin) {
            size -= parseFloat($.css(elem, "margin" + this)) || 0;
          }
        });
        return size;
      }

      $.fn["inner" + name] = function(size) {
        if (size === undefined) {
          return orig["inner" + name].call(this);
        }

        return this.each(function() {
          $(this).css(type, reduce(this, size) + "px");
        });
      };

      $.fn["outer" + name] = function(size, margin) {
        if (typeof size !== "number") {
          return orig["outer" + name].call(this, size);
        }

        return this.each(function() {
          $(this).css(type, reduce(this, size, true, margin) + "px");
        });
      };
    });
  }

  // support: jQuery <1.8
  if (!$.fn.addBack) {
    $.fn.addBack = function(selector) {
      return this.add(selector == null ?
        this.prevObject : this.prevObject.filter(selector)
      );
    };
  }

  // support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
  if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
    $.fn.removeData = (function(removeData) {
      return function(key) {
        if (arguments.length) {
          return removeData.call(this, $.camelCase(key));
        } else {
          return removeData.call(this);
        }
      };
    })($.fn.removeData);
  }

  // deprecated
  $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());

  $.support.selectstart = "onselectstart" in document.createElement("div");
  $.fn.extend({
    disableSelection: function() {
      return this.bind(($.support.selectstart ? "selectstart" : "mousedown") +
        ".ui-disableSelection",
        function(event) {
          event.preventDefault();
        });
    },

    enableSelection: function() {
      return this.unbind(".ui-disableSelection");
    }
  });

  $.extend($.ui, {
    // $.ui.plugin is deprecated.  Use the proxy pattern instead.
    plugin: {
      add: function(module, option, set) {
        var i,
          proto = $.ui[module].prototype;
        for (i in set) {
          proto.plugins[i] = proto.plugins[i] || [];
          proto.plugins[i].push([option, set[i]]);
        }
      },
      call: function(instance, name, args) {
        var i,
          set = instance.plugins[name];
        if (!set || !instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11) {
          return;
        }

        for (i = 0; i < set.length; i++) {
          if (instance.options[set[i][0]]) {
            set[i][1].apply(instance.element, args);
          }
        }
      }
    },

    // only used by resizable
    hasScroll: function(el, a) {

      //If overflow is hidden, the element might have extra content, but the user wants to hide it
      if ($(el).css("overflow") === "hidden") {
        return false;
      }

      var scroll = (a && a === "left") ? "scrollLeft" : "scrollTop",
        has = false;

      if (el[scroll] > 0) {
        return true;
      }

      // TODO: determine which cases actually cause this to happen
      // if the element doesn't have the scroll set, see if it's possible to
      // set the scroll
      el[scroll] = 1;
      has = (el[scroll] > 0);
      el[scroll] = 0;
      return has;
    }
  });

})(jQuery);
(function($, undefined) {

  var uuid = 0,
    slice = Array.prototype.slice,
    _cleanData = $.cleanData;
  $.cleanData = function(elems) {
    for (var i = 0, elem;
      (elem = elems[i]) != null; i++) {
      try {
        $(elem).triggerHandler("remove");
        // http://bugs.jquery.com/ticket/8235
      } catch (e) {}
    }
    _cleanData(elems);
  };

  $.widget = function(name, base, prototype) {
    var fullName, existingConstructor, constructor, basePrototype,
      // proxiedPrototype allows the provided prototype to remain unmodified
      // so that it can be used as a mixin for multiple widgets (#8876)
      proxiedPrototype = {},
      namespace = name.split(".")[0];

    name = name.split(".")[1];
    fullName = namespace + "-" + name;

    if (!prototype) {
      prototype = base;
      base = $.Widget;
    }

    // create selector for plugin
    $.expr[":"][fullName.toLowerCase()] = function(elem) {
      return !!$.data(elem, fullName);
    };

    $[namespace] = $[namespace] || {};
    existingConstructor = $[namespace][name];
    constructor = $[namespace][name] = function(options, element) {
      // allow instantiation without "new" keyword
      if (!this._createWidget) {
        return new constructor(options, element);
      }

      // allow instantiation without initializing for simple inheritance
      // must use "new" keyword (the code above always passes args)
      if (arguments.length) {
        this._createWidget(options, element);
      }
    };
    // extend with the existing constructor to carry over any static properties
    $.extend(constructor, existingConstructor, {
      version: prototype.version,
      // copy the object used to create the prototype in case we need to
      // redefine the widget later
      _proto: $.extend({}, prototype),
      // track widgets that inherit from this widget in case this widget is
      // redefined after a widget inherits from it
      _childConstructors: []
    });

    basePrototype = new base();
    // we need to make the options hash a property directly on the new instance
    // otherwise we'll modify the options hash on the prototype that we're
    // inheriting from
    basePrototype.options = $.widget.extend({}, basePrototype.options);
    $.each(prototype, function(prop, value) {
      if (!$.isFunction(value)) {
        proxiedPrototype[prop] = value;
        return;
      }
      proxiedPrototype[prop] = (function() {
        var _super = function() {
            return base.prototype[prop].apply(this, arguments);
          },
          _superApply = function(args) {
            return base.prototype[prop].apply(this, args);
          };
        return function() {
          var __super = this._super,
            __superApply = this._superApply,
            returnValue;

          this._super = _super;
          this._superApply = _superApply;

          returnValue = value.apply(this, arguments);

          this._super = __super;
          this._superApply = __superApply;

          return returnValue;
        };
      })();
    });
    constructor.prototype = $.widget.extend(basePrototype, {
      // TODO: remove support for widgetEventPrefix
      // always use the name + a colon as the prefix, e.g., draggable:start
      // don't prefix for widgets that aren't DOM-based
      widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
    }, proxiedPrototype, {
      constructor: constructor,
      namespace: namespace,
      widgetName: name,
      widgetFullName: fullName
    });

    // If this widget is being redefined then we need to find all widgets that
    // are inheriting from it and redefine all of them so that they inherit from
    // the new version of this widget. We're essentially trying to replace one
    // level in the prototype chain.
    if (existingConstructor) {
      $.each(existingConstructor._childConstructors, function(i, child) {
        var childPrototype = child.prototype;

        // redefine the child widget using the same prototype that was
        // originally used, but inherit from the new version of the base
        $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
      });
      // remove the list of existing child constructors from the old constructor
      // so the old child constructors can be garbage collected
      delete existingConstructor._childConstructors;
    } else {
      base._childConstructors.push(constructor);
    }

    $.widget.bridge(name, constructor);
  };

  $.widget.extend = function(target) {
    var input = slice.call(arguments, 1),
      inputIndex = 0,
      inputLength = input.length,
      key,
      value;
    for (; inputIndex < inputLength; inputIndex++) {
      for (key in input[inputIndex]) {
        value = input[inputIndex][key];
        if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
          // Clone objects
          if ($.isPlainObject(value)) {
            target[key] = $.isPlainObject(target[key]) ?
              $.widget.extend({}, target[key], value) :
              // Don't extend strings, arrays, etc. with objects
              $.widget.extend({}, value);
            // Copy everything else by reference
          } else {
            target[key] = value;
          }
        }
      }
    }
    return target;
  };

  $.widget.bridge = function(name, object) {
    var fullName = object.prototype.widgetFullName || name;
    $.fn[name] = function(options) {
      var isMethodCall = typeof options === "string",
        args = slice.call(arguments, 1),
        returnValue = this;

      // allow multiple hashes to be passed on init
      options = !isMethodCall && args.length ?
        $.widget.extend.apply(null, [options].concat(args)) :
        options;

      if (isMethodCall) {
        this.each(function() {
          var methodValue,
            instance = $.data(this, fullName);
          if (!instance) {
            return $.error("cannot call methods on " + name + " prior to initialization; " +
              "attempted to call method '" + options + "'");
          }
          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            return $.error("no such method '" + options + "' for " + name + " widget instance");
          }
          methodValue = instance[options].apply(instance, args);
          if (methodValue !== instance && methodValue !== undefined) {
            returnValue = methodValue && methodValue.jquery ?
              returnValue.pushStack(methodValue.get()) :
              methodValue;
            return false;
          }
        });
      } else {
        this.each(function() {
          var instance = $.data(this, fullName);
          if (instance) {
            instance.option(options || {})._init();
          } else {
            $.data(this, fullName, new object(options, this));
          }
        });
      }

      return returnValue;
    };
  };

  $.Widget = function( /* options, element */ ) {};
  $.Widget._childConstructors = [];

  $.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
      disabled: false,

      // callbacks
      create: null
    },
    _createWidget: function(options, element) {
      element = $(element || this.defaultElement || this)[0];
      this.element = $(element);
      this.uuid = uuid++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.options = $.widget.extend({},
        this.options,
        this._getCreateOptions(),
        options);

      this.bindings = $();
      this.hoverable = $();
      this.focusable = $();

      if (element !== this) {
        $.data(element, this.widgetFullName, this);
        this._on(true, this.element, {
          remove: function(event) {
            if (event.target === element) {
              this.destroy();
            }
          }
        });
        this.document = $(element.style ?
          // element within the document
          element.ownerDocument :
          // element is window or document
          element.document || element);
        this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
      }

      this._create();
      this._trigger("create", null, this._getCreateEventData());
      this._init();
    },
    _getCreateOptions: $.noop,
    _getCreateEventData: $.noop,
    _create: $.noop,
    _init: $.noop,

    destroy: function() {
      this._destroy();
      // we can probably remove the unbind calls in 2.0
      // all event bindings should go through this._on()
      this.element
        .unbind(this.eventNamespace)
        // 1.9 BC for #7810
        // TODO remove dual storage
        .removeData(this.widgetName)
        .removeData(this.widgetFullName)
        // support: jquery <1.6.3
        // http://bugs.jquery.com/ticket/9413
        .removeData($.camelCase(this.widgetFullName));
      this.widget()
        .unbind(this.eventNamespace)
        .removeAttr("aria-disabled")
        .removeClass(
          this.widgetFullName + "-disabled " +
          "ui-state-disabled");

      // clean up events and states
      this.bindings.unbind(this.eventNamespace);
      this.hoverable.removeClass("ui-state-hover");
      this.focusable.removeClass("ui-state-focus");
    },
    _destroy: $.noop,

    widget: function() {
      return this.element;
    },

    option: function(key, value) {
      var options = key,
        parts,
        curOption,
        i;

      if (arguments.length === 0) {
        // don't return a reference to the internal hash
        return $.widget.extend({}, this.options);
      }

      if (typeof key === "string") {
        // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
        options = {};
        parts = key.split(".");
        key = parts.shift();
        if (parts.length) {
          curOption = options[key] = $.widget.extend({}, this.options[key]);
          for (i = 0; i < parts.length - 1; i++) {
            curOption[parts[i]] = curOption[parts[i]] || {};
            curOption = curOption[parts[i]];
          }
          key = parts.pop();
          if (value === undefined) {
            return curOption[key] === undefined ? null : curOption[key];
          }
          curOption[key] = value;
        } else {
          if (value === undefined) {
            return this.options[key] === undefined ? null : this.options[key];
          }
          options[key] = value;
        }
      }

      this._setOptions(options);

      return this;
    },
    _setOptions: function(options) {
      var key;

      for (key in options) {
        this._setOption(key, options[key]);
      }

      return this;
    },
    _setOption: function(key, value) {
      this.options[key] = value;

      if (key === "disabled") {
        this.widget()
          .toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!value)
          .attr("aria-disabled", value);
        this.hoverable.removeClass("ui-state-hover");
        this.focusable.removeClass("ui-state-focus");
      }

      return this;
    },

    enable: function() {
      return this._setOption("disabled", false);
    },
    disable: function() {
      return this._setOption("disabled", true);
    },

    _on: function(suppressDisabledCheck, element, handlers) {
      var delegateElement,
        instance = this;

      // no suppressDisabledCheck flag, shuffle arguments
      if (typeof suppressDisabledCheck !== "boolean") {
        handlers = element;
        element = suppressDisabledCheck;
        suppressDisabledCheck = false;
      }

      // no element argument, shuffle and use this.element
      if (!handlers) {
        handlers = element;
        element = this.element;
        delegateElement = this.widget();
      } else {
        // accept selectors, DOM elements
        element = delegateElement = $(element);
        this.bindings = this.bindings.add(element);
      }

      $.each(handlers, function(event, handler) {
        function handlerProxy() {
          // allow widgets to customize the disabled handling
          // - disabled as an array instead of boolean
          // - disabled class as method for disabling individual parts
          if (!suppressDisabledCheck &&
            (instance.options.disabled === true ||
              $(this).hasClass("ui-state-disabled"))) {
            return;
          }
          return (typeof handler === "string" ? instance[handler] : handler)
            .apply(instance, arguments);
        }

        // copy the guid so direct unbinding works
        if (typeof handler !== "string") {
          handlerProxy.guid = handler.guid =
            handler.guid || handlerProxy.guid || $.guid++;
        }

        var match = event.match(/^(\w+)\s*(.*)$/),
          eventName = match[1] + instance.eventNamespace,
          selector = match[2];
        if (selector) {
          delegateElement.delegate(selector, eventName, handlerProxy);
        } else {
          element.bind(eventName, handlerProxy);
        }
      });
    },

    _off: function(element, eventName) {
      eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
      element.unbind(eventName).undelegate(eventName);
    },

    _delay: function(handler, delay) {
      function handlerProxy() {
        return (typeof handler === "string" ? instance[handler] : handler)
          .apply(instance, arguments);
      }
      var instance = this;
      return setTimeout(handlerProxy, delay || 0);
    },

    _hoverable: function(element) {
      this.hoverable = this.hoverable.add(element);
      this._on(element, {
        mouseenter: function(event) {
          $(event.currentTarget).addClass("ui-state-hover");
        },
        mouseleave: function(event) {
          $(event.currentTarget).removeClass("ui-state-hover");
        }
      });
    },

    _focusable: function(element) {
      this.focusable = this.focusable.add(element);
      this._on(element, {
        focusin: function(event) {
          $(event.currentTarget).addClass("ui-state-focus");
        },
        focusout: function(event) {
          $(event.currentTarget).removeClass("ui-state-focus");
        }
      });
    },

    _trigger: function(type, event, data) {
      var prop, orig,
        callback = this.options[type];

      data = data || {};
      event = $.Event(event);
      event.type = (type === this.widgetEventPrefix ?
        type :
        this.widgetEventPrefix + type).toLowerCase();
      // the original event may come from any element
      // so we need to reset the target on the new event
      event.target = this.element[0];

      // copy original event properties over to the new event
      orig = event.originalEvent;
      if (orig) {
        for (prop in orig) {
          if (!(prop in event)) {
            event[prop] = orig[prop];
          }
        }
      }

      this.element.trigger(event, data);
      return !($.isFunction(callback) &&
        callback.apply(this.element[0], [event].concat(data)) === false ||
        event.isDefaultPrevented());
    }
  };

  $.each({
    show: "fadeIn",
    hide: "fadeOut"
  }, function(method, defaultEffect) {
    $.Widget.prototype["_" + method] = function(element, options, callback) {
      if (typeof options === "string") {
        options = {
          effect: options
        };
      }
      var hasOptions,
        effectName = !options ?
        method :
        options === true || typeof options === "number" ?
        defaultEffect :
        options.effect || defaultEffect;
      options = options || {};
      if (typeof options === "number") {
        options = {
          duration: options
        };
      }
      hasOptions = !$.isEmptyObject(options);
      options.complete = callback;
      if (options.delay) {
        element.delay(options.delay);
      }
      if (hasOptions && $.effects && $.effects.effect[effectName]) {
        element[method](options);
      } else if (effectName !== method && element[effectName]) {
        element[effectName](options.duration, options.easing, callback);
      } else {
        element.queue(function(next) {
          $(this)[method]();
          if (callback) {
            callback.call(element[0]);
          }
          next();
        });
      }
    };
  });

})(jQuery);
(function($, undefined) {

  var mouseHandled = false;
  $(document).mouseup(function() {
    mouseHandled = false;
  });

  $.widget("ui.mouse", {
    version: "1.10.2",
    options: {
      cancel: "input,textarea,button,select,option",
      distance: 1,
      delay: 0
    },
    _mouseInit: function() {
      var that = this;

      this.element
        .bind("mousedown." + this.widgetName, function(event) {
          return that._mouseDown(event);
        })
        .bind("click." + this.widgetName, function(event) {
          if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
            $.removeData(event.target, that.widgetName + ".preventClickEvent");
            event.stopImmediatePropagation();
            return false;
      $.ui.ie    }
        });

      this.started = false;
    },

    // TODO: make sure destroying one instance of mouse doesn't mess with
    // other instances of mouse
    _mouseDestroy: function() {
      this.element.unbind("." + this.widgetName);
      if (this._mouseMoveDelegate) {
        $(document)
          .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
          .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      }
    },

    _mouseDown: function(event) {
      // don't let more than one widget handle mouseStart
      if (mouseHandled) {
        return;
      }

      // we may have missed mouseup (out of window)
      (this._mouseStarted && this._mouseUp(event));

      this._mouseDownEvent = event;

      var that = this,
        btnIsLeft = (event.which === 1),
        // event.target.nodeName works around a bug in IE 8 with
        // disabled inputs (#7620)
        elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
      if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
        return true;
      }

      this.mouseDelayMet = !this.options.delay;
      if (!this.mouseDelayMet) {
        this._mouseDelayTimer = setTimeout(function() {
          that.mouseDelayMet = true;
        }, this.options.delay);
      }

      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = (this._mouseStart(event) !== false);
        if (!this._mouseStarted) {
          event.preventDefault();
          return true;
        }
      }

      // Click event may never have fired (Gecko & Opera)
      if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
        $.removeData(event.target, this.widgetName + ".preventClickEvent");
      }

      // these delegates are required to keep context
      this._mouseMoveDelegate = function(event) {
        return that._mouseMove(event);
      };
      this._mouseUpDelegate = function(event) {
        return that._mouseUp(event);
      };
      $(document)
        .bind("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .bind("mouseup." + this.widgetName, this._mouseUpDelegate);

      event.preventDefault();

      mouseHandled = true;
      return true;
    },

    _mouseMove: function(event) {
      // IE mouseup check - mouseup happened when mouse was out of window
      if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
        return this._mouseUp(event);
      }

      if (this._mouseStarted) {
        this._mouseDrag(event);
        return event.preventDefault();
      }

      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted =
          (this._mouseStart(this._mouseDownEvent, event) !== false);
        (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
      }

      return !this._mouseStarted;
    },

    _mouseUp: function(event) {
      $(document)
        .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);

      if (this._mouseStarted) {
        this._mouseStarted = false;

        if (event.target === this._mouseDownEvent.target) {
          $.data(event.target, this.widgetName + ".preventClickEvent", true);
        }

        this._mouseStop(event);
      }

      return false;
    },

    _mouseDistanceMet: function(event) {
      return (Math.max(
        Math.abs(this._mouseDownEvent.pageX - event.pageX),
        Math.abs(this._mouseDownEvent.pageY - event.pageY)
      ) >= this.options.distance);
    },

    _mouseDelayMet: function( /* event */ ) {
      return this.mouseDelayMet;
    },

    // These are placeholder methods, to be overriden by extending plugin
    _mouseStart: function( /* event */ ) {},
    _mouseDrag: function( /* event */ ) {},
    _mouseStop: function( /* event */ ) {},
    _mouseCapture: function( /* event */ ) {
      return true;
    }
  });

})(jQuery);
(function($, undefined) {

  // number of pages in a slider
  // (how many times can you page up/down to go through the whole range)
  var numPages = 5;

  $.widget("ui.slider", $.ui.mouse, {
    version: "1.10.2",
    widgetEventPrefix: "slide",

    options: {
      animate: false,
      distance: 0,
      max: 100,
      min: 0,
      orientation: "horizontal",
      range: false,
      step: 1,
      value: 0,
      values: null,

      // callbacks
      change: null,
      slide: null,
      start: null,
      stop: null
    },

    _create: function() {
      this._keySliding = false;
      this._mouseSliding = false;
      this._animateOff = true;
      this._handleIndex = null;
      this._detectOrientation();
      this._mouseInit();

      this.element
        .addClass("ui-slider" +
          " ui-slider-" + this.orientation +
          " ui-widget" +
          " ui-widget-content" +
          " ui-corner-all");

      this._refresh();
      this._setOption("disabled", this.options.disabled);

      this._animateOff = false;
    },

    _refresh: function() {
      this._createRange();
      this._createHandles();
      this._setupEvents();
      this._refreshValue();
    },

    _createHandles: function() {
      var i, handleCount,
        options = this.options,
        existingHandles = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
        handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
        handles = [];

      handleCount = (options.values && options.values.length) || 1;

      if (existingHandles.length > handleCount) {
        existingHandles.slice(handleCount).remove();
        existingHandles = existingHandles.slice(0, handleCount);
      }

      for (i = existingHandles.length; i < handleCount; i++) {
        handles.push(handle);
      }

      this.handles = existingHandles.add($(handles.join("")).appendTo(this.element));

      this.handle = this.handles.eq(0);

      this.handles.each(function(i) {
        $(this).data("ui-slider-handle-index", i);
      });
    },

    _createRange: function() {
      var options = this.options,
        classes = "";

      if (options.range) {
        if (options.range === true) {
          if (!options.values) {
            options.values = [this._valueMin(), this._valueMin()];
          } else if (options.values.length && options.values.length !== 2) {
            options.values = [options.values[0], options.values[0]];
          } else if ($.isArray(options.values)) {
            options.values = options.values.slice(0);
          }
        }

        if (!this.range || !this.range.length) {
          this.range = $("<div></div>")
            .appendTo(this.element);

          classes = "ui-slider-range" +
            // note: this isn't the most fittingly semantic framework class for this element,
            // but worked best visually with a variety of themes
            " ui-widget-header ui-corner-all";
        } else {
          this.range.removeClass("ui-slider-range-min ui-slider-range-max")
            // Handle range switching from true to min/max
            .css({
              "left": "",
              "bottom": ""
            });
        }

        this.range.addClass(classes +
          ((options.range === "min" || options.range === "max") ? " ui-slider-range-" + options.range : ""));
      } else {
        this.range = $([]);
      }
    },

    _setupEvents: function() {
      var elements = this.handles.add(this.range).filter("a");
      this._off(elements);
      this._on(elements, this._handleEvents);
      this._hoverable(elements);
      this._focusable(elements);
    },

    _destroy: function() {
      this.handles.remove();
      this.range.remove();

      this.element
        .removeClass("ui-slider" +
          " ui-slider-horizontal" +
          " ui-slider-vertical" +
          " ui-widget" +
          " ui-widget-content" +
          " ui-corner-all");

      this._mouseDestroy();
    },

    _mouseCapture: function(event) {
      var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
        that = this,
        o = this.options;

      if (o.disabled) {
        return false;
      }

      this.elementSize = {
        width: this.element.outerWidth(),
        height: this.element.outerHeight()
      };
      this.elementOffset = this.element.offset();

      position = {
        x: event.pageX,
        y: event.pageY
      };
      normValue = this._normValueFromMouse(position);
      distance = this._valueMax() - this._valueMin() + 1;
      this.handles.each(function(i) {
        var thisDistance = Math.abs(normValue - that.values(i));
        if ((distance > thisDistance) ||
          (distance === thisDistance &&
            (i === that._lastChangedValue || that.values(i) === o.min))) {
          distance = thisDistance;
          closestHandle = $(this);
          index = i;
        }
      });

      allowed = this._start(event, index);
      if (allowed === false) {
        return false;
      }
      this._mouseSliding = true;

      this._handleIndex = index;

      closestHandle
        .addClass("ui-state-active")
        .focus();

      offset = closestHandle.offset();
      mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle");
      this._clickOffset = mouseOverHandle ? {
        left: 0,
        top: 0
      } : {
        left: event.pageX - offset.left - (closestHandle.width() / 2),
        top: event.pageY - offset.top -
          (closestHandle.height() / 2) -
          (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) -
          (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) +
          (parseInt(closestHandle.css("marginTop"), 10) || 0)
      };

      if (!this.handles.hasClass("ui-state-hover")) {
        this._slide(event, index, normValue);
      }
      this._animateOff = true;
      return true;
    },

    _mouseStart: function() {
      return true;
    },

    _mouseDrag: function(event) {
      var position = {
          x: event.pageX,
          y: event.pageY
        },
        normValue = this._normValueFromMouse(position);

      this._slide(event, this._handleIndex, normValue);

      return false;
    },

    _mouseStop: function(event) {
      this.handles.removeClass("ui-state-active");
      this._mouseSliding = false;

      this._stop(event, this._handleIndex);
      this._change(event, this._handleIndex);

      this._handleIndex = null;
      this._clickOffset = null;
      this._animateOff = false;

      return false;
    },

    _detectOrientation: function() {
      this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
    },

    _normValueFromMouse: function(position) {
      var pixelTotal,
        pixelMouse,
        percentMouse,
        valueTotal,
        valueMouse;

      if (this.orientation === "horizontal") {
        pixelTotal = this.elementSize.width;
        pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
      } else {
        pixelTotal = this.elementSize.height;
        pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
      }

      percentMouse = (pixelMouse / pixelTotal);
      if (percentMouse > 1) {
        percentMouse = 1;
      }
      if (percentMouse < 0) {
        percentMouse = 0;
      }
      if (this.orientation === "vertical") {
        percentMouse = 1 - percentMouse;
      }

      valueTotal = this._valueMax() - this._valueMin();
      valueMouse = this._valueMin() + percentMouse * valueTotal;

      return this._trimAlignValue(valueMouse);
    },

    _start: function(event, index) {
      var uiHash = {
        handle: this.handles[index],
        value: this.value()
      };
      if (this.options.values && this.options.values.length) {
        uiHash.value = this.values(index);
        uiHash.values = this.values();
      }
      return this._trigger("start", event, uiHash);
    },

    _slide: function(event, index, newVal) {
      var otherVal,
        newValues,
        allowed;

      if (this.options.values && this.options.values.length) {
        otherVal = this.values(index ? 0 : 1);

        if ((this.options.values.length === 2 && this.options.range === true) &&
          ((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))
        ) {
          newVal = otherVal;
        }

        if (newVal !== this.values(index)) {
          newValues = this.values();
          newValues[index] = newVal;
          // A slide can be canceled by returning false from the slide callback
          allowed = this._trigger("slide", event, {
            handle: this.handles[index],
            value: newVal,
            values: newValues
          });
          otherVal = this.values(index ? 0 : 1);
          if (allowed !== false) {
            this.values(index, newVal, true);
          }
        }
      } else {
        if (newVal !== this.value()) {
          // A slide can be canceled by returning false from the slide callback
          allowed = this._trigger("slide", event, {
            handle: this.handles[index],
            value: newVal
          });
          if (allowed !== false) {
            this.value(newVal);
          }
        }
      }
    },

    _stop: function(event, index) {
      var uiHash = {
        handle: this.handles[index],
        value: this.value()
      };
      if (this.options.values && this.options.values.length) {
        uiHash.value = this.values(index);
        uiHash.values = this.values();
      }

      this._trigger("stop", event, uiHash);
    },

    _change: function(event, index) {
      if (!this._keySliding && !this._mouseSliding) {
        var uiHash = {
          handle: this.handles[index],
          value: this.value()
        };
        if (this.options.values && this.options.values.length) {
          uiHash.value = this.values(index);
          uiHash.values = this.values();
        }

        //store the last changed value index for reference when handles overlap
        this._lastChangedValue = index;

        this._trigger("change", event, uiHash);
      }
    },

    value: function(newValue) {
      if (arguments.length) {
        this.options.value = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, 0);
        return;
      }

      return this._value();
    },

    values: function(index, newValue) {
      var vals,
        newValues,
        i;

      if (arguments.length > 1) {
        this.options.values[index] = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, index);
        return;
      }

      if (arguments.length) {
        if ($.isArray(arguments[0])) {
          vals = this.options.values;
          newValues = arguments[0];
          for (i = 0; i < vals.length; i += 1) {
            vals[i] = this._trimAlignValue(newValues[i]);
            this._change(null, i);
          }
          this._refreshValue();
        } else {
          if (this.options.values && this.options.values.length) {
            return this._values(index);
          } else {
            return this.value();
          }
        }
      } else {
        return this._values();
      }
    },

    _setOption: function(key, value) {
      var i,
        valsLength = 0;

      if (key === "range" && this.options.range === true) {
        if (value === "min") {
          this.options.value = this._values(0);
          this.options.values = null;
        } else if (value === "max") {
          this.options.value = this._values(this.options.values.length - 1);
          this.options.values = null;
        }
      }

      if ($.isArray(this.options.values)) {
        valsLength = this.options.values.length;
      }

      $.Widget.prototype._setOption.apply(this, arguments);

      switch (key) {
        case "orientation":
          this._detectOrientation();
          this.element
            .removeClass("ui-slider-horizontal ui-slider-vertical")
            .addClass("ui-slider-" + this.orientation);
          this._refreshValue();
          break;
        case "value":
          this._animateOff = true;
          this._refreshValue();
          this._change(null, 0);
          this._animateOff = false;
          break;
        case "values":
          this._animateOff = true;
          this._refreshValue();
          for (i = 0; i < valsLength; i += 1) {
            this._change(null, i);
          }
          this._animateOff = false;
          break;
        case "min":
        case "max":
          this._animateOff = true;
          this._refreshValue();
          this._animateOff = false;
          break;
        case "range":
          this._animateOff = true;
          this._refresh();
          this._animateOff = false;
          break;
      }
    },

    //internal value getter
    // _value() returns value trimmed by min and max, aligned by step
    _value: function() {
      var val = this.options.value;
      val = this._trimAlignValue(val);

      return val;
    },

    //internal values getter
    // _values() returns array of values trimmed by min and max, aligned by step
    // _values( index ) returns single value trimmed by min and max, aligned by step
    _values: function(index) {
      var val,
        vals,
        i;

      if (arguments.length) {
        val = this.options.values[index];
        val = this._trimAlignValue(val);

        return val;
      } else if (this.options.values && this.options.values.length) {
        // .slice() creates a copy of the array
        // this copy gets trimmed by min and max and then returned
        vals = this.options.values.slice();
        for (i = 0; i < vals.length; i += 1) {
          vals[i] = this._trimAlignValue(vals[i]);
        }

        return vals;
      } else {
        return [];
      }
    },

    // returns the step-aligned value that val is closest to, between (inclusive) min and max
    _trimAlignValue: function(val) {
      if (val <= this._valueMin()) {
        return this._valueMin();
      }
      if (val >= this._valueMax()) {
        return this._valueMax();
      }
      var step = (this.options.step > 0) ? this.options.step : 1,
        valModStep = (val - this._valueMin()) % step,
        alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= step) {
        alignValue += (valModStep > 0) ? step : (-step);
      }

      // Since JavaScript has problems with large floats, round
      // the final value to 5 digits after the decimal point (see #4124)
      return parseFloat(alignValue.toFixed(5));
    },

    _valueMin: function() {
      return this.options.min;
    },

    _valueMax: function() {
      return this.options.max;
    },

    _refreshValue: function() {
      var lastValPercent, valPercent, value, valueMin, valueMax,
        oRange = this.options.range,
        o = this.options,
        that = this,
        animate = (!this._animateOff) ? o.animate : false,
        _set = {};

      if (this.options.values && this.options.values.length) {
        this.handles.each(function(i) {
          valPercent = (that.values(i) - that._valueMin()) / (that._valueMax() - that._valueMin()) * 100;
          _set[that.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
          $(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
          if (that.options.range === true) {
            if (that.orientation === "horizontal") {
              if (i === 0) {
                that.range.stop(1, 1)[animate ? "animate" : "css"]({
                  left: valPercent + "%"
                }, o.animate);
              }
              if (i === 1) {
                that.range[animate ? "animate" : "css"]({
                  width: (valPercent - lastValPercent) + "%"
                }, {
                  queue: false,
                  duration: o.animate
                });
              }
            } else {
              if (i === 0) {
                that.range.stop(1, 1)[animate ? "animate" : "css"]({
                  bottom: (valPercent) + "%"
                }, o.animate);
              }
              if (i === 1) {
                that.range[animate ? "animate" : "css"]({
                  height: (valPercent - lastValPercent) + "%"
                }, {
                  queue: false,
                  duration: o.animate
                });
              }
            }
          }
          lastValPercent = valPercent;
        });
      } else {
        value = this.value();
        valueMin = this._valueMin();
        valueMax = this._valueMax();
        valPercent = (valueMax !== valueMin) ?
          (value - valueMin) / (valueMax - valueMin) * 100 :
          0;
        _set[this.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
        this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);

        if (oRange === "min" && this.orientation === "horizontal") {
          this.range.stop(1, 1)[animate ? "animate" : "css"]({
            width: valPercent + "%"
          }, o.animate);
        }
        if (oRange === "max" && this.orientation === "horizontal") {
          this.range[animate ? "animate" : "css"]({
            width: (100 - valPercent) + "%"
          }, {
            queue: false,
            duration: o.animate
          });
        }
        if (oRange === "min" && this.orientation === "vertical") {
          this.range.stop(1, 1)[animate ? "animate" : "css"]({
            height: valPercent + "%"
          }, o.animate);
        }
        if (oRange === "max" && this.orientation === "vertical") {
          this.range[animate ? "animate" : "css"]({
            height: (100 - valPercent) + "%"
          }, {
            queue: false,
            duration: o.animate
          });
        }
      }
    },

    _handleEvents: {
      keydown: function(event) {
        /*jshint maxcomplexity:25*/
        var allowed, curVal, newVal, step,
          index = $(event.target).data("ui-slider-handle-index");

        switch (event.keyCode) {
          case $.ui.keyCode.HOME:
          case $.ui.keyCode.END:
          case $.ui.keyCode.PAGE_UP:
          case $.ui.keyCode.PAGE_DOWN:
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            event.preventDefault();
            if (!this._keySliding) {
              this._keySliding = true;
              $(event.target).addClass("ui-state-active");
              allowed = this._start(event, index);
              if (allowed === false) {
                return;
              }
            }
            break;
        }

        step = this.options.step;
        if (this.options.values && this.options.values.length) {
          curVal = newVal = this.values(index);
        } else {
          curVal = newVal = this.value();
        }

        switch (event.keyCode) {
          case $.ui.keyCode.HOME:
            newVal = this._valueMin();
            break;
          case $.ui.keyCode.END:
            newVal = this._valueMax();
            break;
          case $.ui.keyCode.PAGE_UP:
            newVal = this._trimAlignValue(curVal + ((this._valueMax() - this._valueMin()) / numPages));
            break;
          case $.ui.keyCode.PAGE_DOWN:
            newVal = this._trimAlignValue(curVal - ((this._valueMax() - this._valueMin()) / numPages));
            break;
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
            if (curVal === this._valueMax()) {
              return;
            }
            newVal = this._trimAlignValue(curVal + step);
            break;
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            if (curVal === this._valueMin()) {
              return;
            }
            newVal = this._trimAlignValue(curVal - step);
            break;
        }

        this._slide(event, index, newVal);
      },
      click: function(event) {
        event.preventDefault();
      },
      keyup: function(event) {
        var index = $(event.target).data("ui-slider-handle-index");

        if (this._keySliding) {
          this._keySliding = false;
          this._stop(event, index);
          this._change(event, index);
          $(event.target).removeClass("ui-state-active");
        }
      }
    }

  });

}(jQuery));
/**
 *    The Nomensa accessible media player is a flexible multimedia solution for websites and intranets.
 *    The core player consists of JavaScript wrapper responsible for generating an accessible HTML toolbar
 *    for interacting with a media player of your choice. We currently provide support for YouTube (default),
 *    Vimeo and JWPlayer although it should be possible to integrate the player with almost any media player on
 *    the web (provided a JavaScript api for the player in question is available).
 *
 *    Copyright (C) 2013  Nomensa Ltd
 *
 *    Version 2.1.2
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
var swfobject = function() {
  var aq = "undefined",
    aD = "object",
    ab = "Shockwave Flash",
    X = "ShockwaveFlash.ShockwaveFlash",
    aE = "application/x-shockwave-flash",
    ac = "SWFObjectExprInst",
    ax = "onreadystatechange",
    af = window,
    aL = document,
    aB = navigator,
    aa = false,
    Z = [aN],
    aG = [],
    ag = [],
    al = [],
    aJ, ad, ap, at, ak = false,
    aU = false,
    aH, an, aI = true,
    ah = function() {
      var a = typeof aL.getElementById != aq && typeof aL.getElementsByTagName != aq && typeof aL.createElement != aq,
        e = aB.userAgent.toLowerCase(),
        c = aB.platform.toLowerCase(),
        h = c ? /win/.test(c) : /win/.test(e),
        j = c ? /mac/.test(c) : /mac/.test(e),
        g = /webkit/.test(e) ? parseFloat(e.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
        d = !+"\v1",
        f = [0, 0, 0],
        k = null;
      if (typeof aB.plugins != aq && typeof aB.plugins[ab] == aD) {
        k = aB.plugins[ab].description;
        if (k && !(typeof aB.mimeTypes != aq && aB.mimeTypes[aE] && !aB.mimeTypes[aE].enabledPlugin)) {
          aa = true;
          d = false;
          k = k.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
          f[0] = parseInt(k.replace(/^(.*)\..*$/, "$1"), 10);
          f[1] = parseInt(k.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
          f[2] = /[a-zA-Z]/.test(k) ? parseInt(k.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
        }
      } else {
        if (typeof af.ActiveXObject != aq) {
          try {
            var i = new ActiveXObject(X);
            if (i) {
              k = i.GetVariable("$version");
              if (k) {
                d = true;
                k = k.split(" ")[1].split(",");
                f = [parseInt(k[0], 10), parseInt(k[1], 10), parseInt(k[2], 10)];
              }
            }
          } catch (b) {}
        }
      }
      return {
        w3: a,
        pv: f,
        wk: g,
        ie: d,
        win: h,
        mac: j
      };
    }(),
    aK = function() {
      if (!ah.w3) {
        return;
      }
      if ((typeof aL.readyState != aq && aL.readyState == "complete") || (typeof aL.readyState == aq && (aL.getElementsByTagName("body")[0] || aL.body))) {
        aP();
      }
      if (!ak) {
        if (typeof aL.addEventListener != aq) {
          aL.addEventListener("DOMContentLoaded", aP, false);
        }
        if (ah.ie && ah.win) {
          aL.attachEvent(ax, function() {
            if (aL.readyState == "complete") {
              aL.detachEvent(ax, arguments.callee);
              aP();
            }
          });
          if (af == top) {
            (function() {
              if (ak) {
                return;
              }
              try {
                aL.documentElement.doScroll("left");
              } catch (a) {
                setTimeout(arguments.callee, 0);
                return;
              }
              aP();
            })();
          }
        }
        if (ah.wk) {
          (function() {
            if (ak) {
              return;
            }
            if (!/loaded|complete/.test(aL.readyState)) {
              setTimeout(arguments.callee, 0);
              return;
            }
            aP();
          })();
        }
        aC(aP);
      }
    }();

  function aP() {
    if (ak) {
      return;
    }
    try {
      var b = aL.getElementsByTagName("body")[0].appendChild(ar("span"));
      b.parentNode.removeChild(b);
    } catch (a) {
      return;
    }
    ak = true;
    var d = Z.length;
    for (var c = 0; c < d; c++) {
      Z[c]();
    }
  }

  function aj(a) {
    if (ak) {
      a();
    } else {
      Z[Z.length] = a;
    }
  }

  function aC(a) {
    if (typeof af.addEventListener != aq) {
      af.addEventListener("load", a, false);
    } else {
      if (typeof aL.addEventListener != aq) {
        aL.addEventListener("load", a, false);
      } else {
        if (typeof af.attachEvent != aq) {
          aM(af, "onload", a);
        } else {
          if (typeof af.onload == "function") {
            var b = af.onload;
            af.onload = function() {
              b();
              a();
            };
          } else {
            af.onload = a;
          }
        }
      }
    }
  }

  function aN() {
    if (aa) {
      Y();
    } else {
      am();
    }
  }

  function Y() {
    var d = aL.getElementsByTagName("body")[0];
    var b = ar(aD);
    b.setAttribute("type", aE);
    var a = d.appendChild(b);
    if (a) {
      var c = 0;
      (function() {
        if (typeof a.GetVariable != aq) {
          var e = a.GetVariable("$version");
          if (e) {
            e = e.split(" ")[1].split(",");
            ah.pv = [parseInt(e[0], 10), parseInt(e[1], 10), parseInt(e[2], 10)];
          }
        } else {
          if (c < 10) {
            c++;
            setTimeout(arguments.callee, 10);
            return;
          }
        }
        d.removeChild(b);
        a = null;
        am();
      })();
    } else {
      am();
    }
  }

  function am() {
    var g = aG.length;
    if (g > 0) {
      for (var h = 0; h < g; h++) {
        var c = aG[h].id;
        var l = aG[h].callbackFn;
        var a = {
          success: false,
          id: c
        };
        if (ah.pv[0] > 0) {
          var i = aS(c);
          if (i) {
            if (ao(aG[h].swfVersion) && !(ah.wk && ah.wk < 312)) {
              ay(c, true);
              if (l) {
                a.success = true;
                a.ref = av(c);
                l(a);
              }
            } else {
              if (aG[h].expressInstall && au()) {
                var e = {};
                e.data = aG[h].expressInstall;
                e.width = i.getAttribute("width") || "0";
                e.height = i.getAttribute("height") || "0";
                if (i.getAttribute("class")) {
                  e.styleclass = i.getAttribute("class");
                }
                if (i.getAttribute("align")) {
                  e.align = i.getAttribute("align");
                }
                var f = {};
                var d = i.getElementsByTagName("param");
                var k = d.length;
                for (var j = 0; j < k; j++) {
                  if (d[j].getAttribute("name").toLowerCase() != "movie") {
                    f[d[j].getAttribute("name")] = d[j].getAttribute("value");
                  }
                }
                ae(e, f, c, l);
              } else {
                aF(i);
                if (l) {
                  l(a);
                }
              }
            }
          }
        } else {
          ay(c, true);
          if (l) {
            var b = av(c);
            if (b && typeof b.SetVariable != aq) {
              a.success = true;
              a.ref = b;
            }
            l(a);
          }
        }
      }
    }
  }

  function av(b) {
    var d = null;
    var c = aS(b);
    if (c && c.nodeName == "OBJECT") {
      if (typeof c.SetVariable != aq) {
        d = c;
      } else {
        var a = c.getElementsByTagName(aD)[0];
        if (a) {
          d = a;
        }
      }
    }
    return d;
  }

  function au() {
    return !aU && ao("6.0.65") && (ah.win || ah.mac) && !(ah.wk && ah.wk < 312);
  }

  function ae(f, d, h, e) {
    aU = true;
    ap = e || null;
    at = {
      success: false,
      id: h
    };
    var a = aS(h);
    if (a) {
      if (a.nodeName == "OBJECT") {
        aJ = aO(a);
        ad = null;
      } else {
        aJ = a;
        ad = h;
      }
      f.id = ac;
      if (typeof f.width == aq || (!/%$/.test(f.width) && parseInt(f.width, 10) < 310)) {
        f.width = "310";
      }
      if (typeof f.height == aq || (!/%$/.test(f.height) && parseInt(f.height, 10) < 137)) {
        f.height = "137";
      }
      aL.title = aL.title.slice(0, 47) + " - Flash Player Installation";
      var b = ah.ie && ah.win ? "ActiveX" : "PlugIn",
        c = "MMredirectURL=" + af.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + b + "&MMdoctitle=" + aL.title;
      if (typeof d.flashvars != aq) {
        d.flashvars += "&" + c;
      } else {
        d.flashvars = c;
      }
      if (ah.ie && ah.win && a.readyState != 4) {
        var g = ar("div");
        h += "SWFObjectNew";
        g.setAttribute("id", h);
        a.parentNode.insertBefore(g, a);
        a.style.display = "none";
        (function() {
          if (a.readyState == 4) {
            a.parentNode.removeChild(a);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      }
      aA(f, d, h);
    }
  }

  function aF(a) {
    if (ah.ie && ah.win && a.readyState != 4) {
      var b = ar("div");
      a.parentNode.insertBefore(b, a);
      b.parentNode.replaceChild(aO(a), b);
      a.style.display = "none";
      (function() {
        if (a.readyState == 4) {
          a.parentNode.removeChild(a);
        } else {
          setTimeout(arguments.callee, 10);
        }
      })();
    } else {
      a.parentNode.replaceChild(aO(a), a);
    }
  }

  function aO(b) {
    var d = ar("div");
    if (ah.win && ah.ie) {
      d.innerHTML = b.innerHTML;
    } else {
      var e = b.getElementsByTagName(aD)[0];
      if (e) {
        var a = e.childNodes;
        if (a) {
          var f = a.length;
          for (var c = 0; c < f; c++) {
            if (!(a[c].nodeType == 1 && a[c].nodeName == "PARAM") && !(a[c].nodeType == 8)) {
              d.appendChild(a[c].cloneNode(true));
            }
          }
        }
      }
    }
    return d;
  }

  function aA(e, g, c) {
    var d, a = aS(c);
    if (ah.wk && ah.wk < 312) {
      return d;
    }
    if (a) {
      if (typeof e.id == aq) {
        e.id = c;
      }
      if (ah.ie && ah.win) {
        var f = "";
        for (var i in e) {
          if (e[i] != Object.prototype[i]) {
            if (i.toLowerCase() == "data") {
              g.movie = e[i];
            } else {
              if (i.toLowerCase() == "styleclass") {
                f += ' class="' + e[i] + '"';
              } else {
                if (i.toLowerCase() != "classid") {
                  f += " " + i + '="' + e[i] + '"';
                }
              }
            }
          }
        }
        var h = "";
        for (var j in g) {
          if (g[j] != Object.prototype[j]) {
            h += '<param name="' + j + '" value="' + g[j] + '" />';
          }
        }
        a.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + f + ">" + h + "</object>";
        ag[ag.length] = e.id;
        d = aS(e.id);
      } else {
        var b = ar(aD);
        b.setAttribute("type", aE);
        for (var k in e) {
          if (e[k] != Object.prototype[k]) {
            if (k.toLowerCase() == "styleclass") {
              b.setAttribute("class", e[k]);
            } else {
              if (k.toLowerCase() != "classid") {
                b.setAttribute(k, e[k]);
              }
            }
          }
        }
        for (var l in g) {
          if (g[l] != Object.prototype[l] && l.toLowerCase() != "movie") {
            aQ(b, l, g[l]);
          }
        }
        a.parentNode.replaceChild(b, a);
        d = b;
      }
    }
    return d;
  }

  function aQ(b, d, c) {
    var a = ar("param");
    a.setAttribute("name", d);
    a.setAttribute("value", c);
    b.appendChild(a);
  }

  function aw(a) {
    var b = aS(a);
    if (b && b.nodeName == "OBJECT") {
      if (ah.ie && ah.win) {
        b.style.display = "none";
        (function() {
          if (b.readyState == 4) {
            aT(a);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      } else {
        b.parentNode.removeChild(b);
      }
    }
  }

  function aT(a) {
    var b = aS(a);
    if (b) {
      for (var c in b) {
        if (typeof b[c] == "function") {
          b[c] = null;
        }
      }
      b.parentNode.removeChild(b);
    }
  }

  function aS(a) {
    var c = null;
    try {
      c = aL.getElementById(a);
    } catch (b) {}
    return c;
  }

  function ar(a) {
    return aL.createElement(a);
  }

  function aM(a, c, b) {
    a.attachEvent(c, b);
    al[al.length] = [a, c, b];
  }

  function ao(a) {
    var b = ah.pv,
      c = a.split(".");
    c[0] = parseInt(c[0], 10);
    c[1] = parseInt(c[1], 10) || 0;
    c[2] = parseInt(c[2], 10) || 0;
    return (b[0] > c[0] || (b[0] == c[0] && b[1] > c[1]) || (b[0] == c[0] && b[1] == c[1] && b[2] >= c[2])) ? true : false;
  }

  function az(b, f, a, c) {
    if (ah.ie && ah.mac) {
      return;
    }
    var e = aL.getElementsByTagName("head")[0];
    if (!e) {
      return;
    }
    var g = (a && typeof a == "string") ? a : "screen";
    if (c) {
      aH = null;
      an = null;
    }
    if (!aH || an != g) {
      var d = ar("style");
      d.setAttribute("type", "text/css");
      d.setAttribute("media", g);
      aH = e.appendChild(d);
      if (ah.ie && ah.win && typeof aL.styleSheets != aq && aL.styleSheets.length > 0) {
        aH = aL.styleSheets[aL.styleSheets.length - 1];
      }
      an = g;
    }
    if (ah.ie && ah.win) {
      if (aH && typeof aH.addRule == aD) {
        aH.addRule(b, f);
      }
    } else {
      if (aH && typeof aL.createTextNode != aq) {
        aH.appendChild(aL.createTextNode(b + " {" + f + "}"));
      }
    }
  }

  function ay(a, c) {
    if (!aI) {
      return;
    }
    var b = c ? "visible" : "hidden";
    if (ak && aS(a)) {
      aS(a).style.visibility = b;
    } else {
      az("#" + a, "visibility:" + b);
    }
  }

  function ai(b) {
    var a = /[\\\"<>\.;]/;
    var c = a.exec(b) != null;
    return c && typeof encodeURIComponent != aq ? encodeURIComponent(b) : b;
  }
  var aR = function() {
    if (ah.ie && ah.win) {
      window.attachEvent("onunload", function() {
        var a = al.length;
        for (var b = 0; b < a; b++) {
          al[b][0].detachEvent(al[b][1], al[b][2]);
        }
        var d = ag.length;
        for (var c = 0; c < d; c++) {
          aw(ag[c]);
        }
        for (var e in ah) {
          ah[e] = null;
        }
        ah = null;
        for (var f in swfobject) {
          swfobject[f] = null;
        }
        swfobject = null;
      });
    }
  }();
  return {
    registerObject: function(a, e, c, b) {
      if (ah.w3 && a && e) {
        var d = {};
        d.id = a;
        d.swfVersion = e;
        d.expressInstall = c;
        d.callbackFn = b;
        aG[aG.length] = d;
        ay(a, false);
      } else {
        if (b) {
          b({
            success: false,
            id: a
          });
        }
      }
    },
    getObjectById: function(a) {
      if (ah.w3) {
        return av(a);
      }
    },
    embedSWF: function(k, e, h, f, c, a, b, i, g, j) {
      var d = {
        success: false,
        id: e
      };
      if (ah.w3 && !(ah.wk && ah.wk < 312) && k && e && h && f && c) {
        ay(e, false);
        aj(function() {
          h += "";
          f += "";
          var q = {};
          if (g && typeof g === aD) {
            for (var o in g) {
              q[o] = g[o];
            }
          }
          q.data = k;
          q.width = h;
          q.height = f;
          var n = {};
          if (i && typeof i === aD) {
            for (var p in i) {
              n[p] = i[p];
            }
          }
          if (b && typeof b === aD) {
            for (var l in b) {
              if (typeof n.flashvars != aq) {
                n.flashvars += "&" + l + "=" + b[l];
              } else {
                n.flashvars = l + "=" + b[l];
              }
            }
          }
          if (ao(c)) {
            var m = aA(q, n, e);
            if (q.id == e) {
              ay(e, true);
            }
            d.success = true;
            d.ref = m;
          } else {
            if (a && au()) {
              q.data = a;
              ae(q, n, e, j);
              return;
            } else {
              ay(e, true);
            }
          }
          if (j) {
            j(d);
          }
        });
      } else {
        if (j) {
          j(d);
        }
      }
    },
    switchOffAutoHideShow: function() {
      aI = false;
    },
    ua: ah,
    getFlashPlayerVersion: function() {
      return {
        major: ah.pv[0],
        minor: ah.pv[1],
        release: ah.pv[2]
      };
    },
    hasFlashPlayerVersion: ao,
    createSWF: function(a, b, c) {
      if (ah.w3) {
        return aA(a, b, c);
      } else {
        return undefined;
      }
    },
    showExpressInstall: function(b, a, d, c) {
      if (ah.w3 && au()) {
        ae(b, a, d, c);
      }
    },
    removeSWF: function(a) {
      if (ah.w3) {
        aw(a);
      }
    },
    createCSS: function(b, a, c, d) {
      if (ah.w3) {
        az(b, a, c, d);
      }
    },
    addDomLoadEvent: aj,
    addLoadEvent: aC,
    getQueryParamValue: function(b) {
      var a = aL.location.search || aL.location.hash;
      if (a) {
        if (/\?/.test(a)) {
          a = a.split("?")[1];
        }
        if (b == null) {
          return ai(a);
        }
        var c = a.split("&");
        for (var d = 0; d < c.length; d++) {
          if (c[d].substring(0, c[d].indexOf("=")) == b) {
            return ai(c[d].substring((c[d].indexOf("=") + 1)));
          }
        }
      }
      return "";
    },
    expressInstallCallback: function() {
      if (aU) {
        var a = aS(ac);
        if (a && aJ) {
          a.parentNode.replaceChild(aJ, a);
          if (ad) {
            ay(ad, true);
            if (ah.ie && ah.win) {
              aJ.style.display = "block";
            }
          }
          if (ap) {
            ap(at);
          }
        }
        aU = false;
      }
    }
  };
}();
(function(d) {
  d.NOMENSA = d.NOMENSA || {};
  var a, c, b;
  d.NOMENSA.uaMatch = function(f) {
    f = f.toLowerCase();
    var e = /(webkit)[ \/]([\w.]+)/.exec(f) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(f) || /(msie) ([\w.]+)/.exec(f) || f.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(f) || [];
    return {
      browser: e[1] || "",
      version: e[2] || "0"
    };
  };
  a = d.NOMENSA.uaMatch(d.navigator.userAgent);
  c = {};
  if (a.browser) {
    c[a.browser] = true;
    c.version = a.version;
  }
  d.NOMENSA.browser = c;
})(window);
window.NOMENSA = window.NOMENSA || {};
window.NOMENSA.player = window.NOMENSA.player || {};
window.NOMENSA.player.YoutubePlayer = function(a) {
  this.config = a;
  this.config.playerVars = {
    controls: 0,
    showinfo: 0,
    origin: window.location.protocol + "//" + window.location.hostname,
    rel: 0
  };
};
window.NOMENSA.player.YoutubePlayer.apiLoaded = false;
window.NOMENSA.player.YoutubePlayer.prototype = {
  getYTOptions: function() {
    var b = this,
      a = {
        height: this.config.flashHeight,
        width: this.config.flashWidth,
        videoId: this.config.media,
        events: {
          onReady: function(c) {
            b.$html.find("iframe").attr({
              id: b.config.id,
              role: "presentation"
            });
            b.onPlayerReady(c);
          },
          onStateChange: function(c) {
            b.onPlayerStateChange(c.data);
          }
        }
      };
    a.playerVars = this.config.playerVars;
    if (this.config.repeat) {
      a.playerVars.playlist = this.config.media;
    }
    return a;
  },
  init: function() {
    if (typeof window.postMessage !== "undefined") {
      return function(d) {
        var a = document.createElement("script"),
          b = document.getElementsByTagName("script")[0],
          c = this;
        this.$html = this.assembleHTML();
        if (this.config.captions) {
          this.getCaptions();
        }
        d.html(this.$html);
        window.NOMENSA.player.PlayerDaemon.addPlayer(this);
        if (!window.NOMENSA.player.YoutubePlayer.apiLoaded) {
          if (typeof window.onYouTubeIframeAPIReady === "undefined") {
            window.onYouTubeIframeAPIReady = function() {
              window.NOMENSA.player.PlayerDaemon.map(function(e) {
                if (typeof e.getYTOptions !== "undefined") {
                  e.player = new YT.Player("player-" + e.config.id, e.getYTOptions());
                }
              });
              window.NOMENSA.player.YoutubePlayer.apiLoaded = true;
            };
            a.src = "//www.youtube.com/iframe_api";
            b.parentNode.insertBefore(a, b);
          }
        } else {
          this.player = YT.Player("player-" + player.config.id, getOptions(player));
        }
      };
    } else {
      return function(b) {
        var a = this;
        this.$html = this.assembleHTML();
        if (this.config.captions) {
          this.getCaptions();
        }
        b.html(this.$html);
        window.NOMENSA.player.PlayerDaemon.addPlayer(this);
        window.NOMENSA.player.stateHandlers[this.config.id] = function(d) {
          var c = window.NOMENSA.player.PlayerDaemon.getPlayer(a.config.id);
          c.onPlayerStateChange(d);
        };
        window.onYouTubePlayerReady = function(c) {
          var d = window.NOMENSA.player.PlayerDaemon.getPlayer(c);
          var e = document.getElementById(d.config.id);
          d.player = e;
          d.cue();
          d.getPlayer().addEventListener("onStateChange", "window.NOMENSA.player.stateHandlers." + a.config.id);
          d.onPlayerReady();
        };
      };
    }
  }(),
  state: {
    ended: 0,
    playing: 1,
    paused: 2,
    unstarted: -1
  },
  onPlayerReady: (function() {
    var b = [],
      a;
    return function(d) {
      var c = b.length;
      if (typeof d === "function") {
        b.push(d);
      } else {
        if (c === 0) {
          return false;
        }
        for (a = 0; a < c; a++) {
          b[a].apply(this, arguments);
        }
      }
    };
  }()),
  onPlayerStateChange: function(a) {
    if (a == 1) {
      this.play();
      if (this.config.buttons.toggle) {
        this.$html.find(".play").removeClass("play").addClass("pause").text("Pause");
      }
    } else {
      if (this.config.repeat && (a == 0)) {
        this.play();
      }
    }
  },
  getFlashVars: function() {
    var a = {
      controlbar: "none",
      file: this.config.media
    };
    if (this.config.image != "") {
      a.image = this.config.image;
    }
    if (this.config.repeat) {
      a.repeat = this.config.repeat;
    }
    return a;
  },
  getFlashParams: function() {
    return {
      allowScriptAccess: "always",
      wmode: "transparent"
    };
  },
  generateFlashPlayer: function(c) {
    var g = this;
    var a = this.getFlashVars();
    var f = this.getFlashParams();
    var h = {
      id: this.config.id,
      name: this.config.id
    };
    var e = $("<" + this.config.flashContainer + " />").attr("id", "player-" + this.config.id).addClass("flashReplace").html('This content requires Macromedia Flash Player. You can <a href="http://get.adobe.com/flashplayer/">install or upgrade the Adobe Flash Player here</a>.');
    var d = $("<span />").addClass("video");
    var b = this.getURL();
    setTimeout(function() {
      swfobject.embedSWF(b, e.attr("id"), g.config.flashWidth, g.config.flashHeight, "9.0.115", null, a, f, h, g.config.swfCallback);
      if (window.NOMENSA.browser.mozilla && (parseInt(window.NOMENSA.browser.version, 10) >= 2)) {
        g.$html.find("object").attr("tabindex", "-1");
      }
    }, 0);
    c.append(d.append(e));
    return c;
  },
  generateVideoPlayer: function(b) {
    if (typeof window.postMessage === "undefined") {
      return this.generateFlashPlayer(b);
    } else {
      var a = $("<" + this.config.flashContainer + " />").attr("id", "player-" + this.config.id);
      var c = $("<span />").addClass("video");
      b.append(c.append(a));
      return b;
    }
  },
  getPlayer: function() {
    return this.player;
  },
  is_html5: false,
  play: function() {
    this.player.playVideo();
    this.setSliderTimeout();
    if (this.config.captionsOn && this.captions) {
      this.setCaptionTimeout();
    }
  },
  pause: function() {
    this.player.pauseVideo();
    this.clearSliderTimeout();
    if (this.config.captionsOn && this.captions) {
      this.clearCaptionTimeout();
    }
  },
  ffwd: function() {
    var b = this.getCurrentTime() + this.config.playerSkip,
      a = this.getDuration();
    if (b > a) {
      b = a;
    }
    this.seek(b);
  },
  rewd: function() {
    var a = this.getCurrentTime() - this.config.playerSkip;
    if (a < 0) {
      a = 0;
    }
    this.seek(a);
  },
  mute: function() {
    var a = this.$html.find("button.mute");
    if (this.player.isMuted()) {
      this.player.unMute();
      if (a.hasClass("muted")) {
        a.removeClass("muted");
      }
    } else {
      this.player.mute();
      a.addClass("muted");
    }
  },
  volup: function() {
    var a = this.player.getVolume();
    if (a >= 100) {
      a = 100;
    } else {
      a = a + this.config.volumeStep;
    }
    this.player.setVolume(a);
    this.updateVolume(a);
  },
  voldwn: function() {
    var a = this.player.getVolume();
    if (a <= 0) {
      a = 0;
    } else {
      a = a - this.config.volumeStep;
    }
    this.player.setVolume(a);
    this.updateVolume(a);
  },
  getDuration: function() {
    return this.player.getDuration();
  },
  getCurrentTime: function() {
    return this.player.getCurrentTime();
  },
  getBytesLoaded: function() {
    return this.player.getVideoBytesLoaded();
  },
  getBytesTotal: function() {
    return this.player.getVideoBytesTotal();
  },
  seek: function(a) {
    this.player.seekTo(a, true);
    if (this.config.captionsOn && this.captions) {
      this.$html.find(".caption").remove();
      this.clearCaptionTimeout();
      this.setCaptionTimeout();
      this.getPreviousCaption();
    }
  },
  cue: function() {
    this.player.cueVideoById(this.config.media);
  },
  toggleCaptions: function() {
    var a = this;
    var b = this.$html.find(".captions");
    if (b.hasClass("captions-off")) {
      b.removeClass("captions-off").addClass("captions-on");
      a.getPreviousCaption();
      a.setCaptionTimeout();
      a.config.captionsOn = true;
    } else {
      b.removeClass("captions-on").addClass("captions-off");
      a.clearCaptionTimeout();
      a.$html.find(".caption").remove();
      a.config.captionsOn = false;
    }
  }
};
window.NOMENSA = window.NOMENSA || {};
window.NOMENSA.player = window.NOMENSA.player || {};
window.NOMENSA.player.MediaplayerDecorator = function(a) {
  var b = a;
  this.config = b.config;
  this.player = b.player;
  this.state = b.state;
  for (var c in b) {
    if (typeof b[c] === "function") {
      this[c] = (function(d) {
        return function() {
          return b[d].apply(this, arguments);
        };
      }(c));
    }
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.generatePlayerContainer = function() {
  var a = $("<" + this.config.playerContainer + " />").css(this.config.playerStyles).addClass("player-container");
  if (window.NOMENSA.browser.msie) {
    a.addClass("player-container-ie player-container-ie-" + window.NOMENSA.browser.version.substring(0, 1));
  }
  return a;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.assembleHTML = function() {
  var a = this.generatePlayerContainer();
  var c = this.generateVideoPlayer(a);
  var b = c.append(this.getControls());
  return b;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getURL = function() {
  return [this.config.url, this.config.id].join("");
};
window.NOMENSA.player.MediaplayerDecorator.prototype.createButton = function(d, b) {
  var a = 0;
  var e = [d, this.config.id].join("-");
  var c = $("<button />").append(b).addClass(d).attr({
    title: d,
    id: e
  }).addClass("ui-corner-all ui-state-default").hover(function() {
    $(this).addClass("ui-state-hover");
  }, function() {
    $(this).removeClass("ui-state-hover");
  }).focus(function() {
    $(this).addClass("ui-state-focus");
  }).blur(function() {
    $(this).removeClass("ui-state-focus");
  }).click(function(f) {
    f.preventDefault();
  });
  return c;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getFuncControls = function() {
  var l = this;
  var j = $("<div>");
  j[0].className = "player-controls";
  var g = [];
  if (l.config.buttons.toggle) {
    var a = l.createButton("play", "Play").attr({
      "aria-live": "assertive"
    }).click(function() {
      if ($(this).hasClass("play")) {
        $(this).removeClass("play").addClass("pause").attr({
          title: "Pause",
          id: "pause-" + l.config.id
        }).text("Pause");
        l.play();
      } else {
        $(this).removeClass("pause").addClass("play").attr({
          title: "Play",
          id: "play-" + l.config.id
        }).text("Play");
        l.pause();
      }
    });
    g.push(a);
  } else {
    var c = l.createButton("play", "Play").click(function() {
      l.play();
    });
    var k = l.createButton("pause", "Pause").click(function() {
      l.pause();
    });
    g.push(c);
    g.push(k);
  }
  if (l.config.buttons.rewind) {
    var f = l.createButton("rewind", "Rewind").click(function() {
      l.rewd();
    });
    g.push(f);
  }
  if (l.config.buttons.forward) {
    var h = l.createButton("forward", "Forward").click(function() {
      l.ffwd();
    });
    g.push(h);
  }
  if (l.config.captions) {
    var b = l.createButton("captions", "Captions").click(function() {
      l.toggleCaptions();
    });
    var d = (l.config.captionsOn == true) ? "captions-on" : "captions-off";
    b.addClass(d);
    g.push(b);
  }
  for (var e = 0; e < g.length; e = e + 1) {
    j[0].appendChild(g[e][0]);
  }
  return j;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getVolControls = function() {
  var c = this;
  var g = $("<div>").addClass("volume-controls");
  var b = c.createButton("mute", "Mute").click(function() {
    c.mute();
  });
  var h = c.createButton("vol-up", '+<span class="ui-helper-hidden-accessible"> Volume Up</span>').click(function() {
    c.volup();
  });
  var e = c.createButton("vol-down", '-<span class="ui-helper-hidden-accessible"> Volume Down</span>').click(function() {
    c.voldwn();
  });
  var f = $("<span />").attr({
    id: "vol-" + c.config.id,
    "class": "vol-display"
  }).text("100%");
  var a = [b, e, h, f];
  for (var d = 0; d < a.length; d = d + 1) {
    g[0].appendChild(a[d][0]);
  }
  return g;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getSliderBar = function() {
  var c = $("<span />").addClass("ui-helper-hidden-accessible").html("<p>The timeline slider below uses WAI ARIA. Please use the documentation for your screen reader to find out more.</p>");
  var a = $("<span />").addClass("current-time").attr({
    id: "current-" + this.config.id
  }).text("00:00:00");
  var g = this.getSlider();
  var f = $("<span />").addClass("duration-time").attr({
    id: "duration-" + this.config.id
  }).text("00:00:00");
  var e = $("<div />").addClass("timer-bar").append(c);
  var d = [a, g, f];
  for (var b = 0; b < d.length; b = b + 1) {
    e[0].appendChild(d[b][0]);
  }
  return e;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getSlider = function() {
  var d = this;
  var a = $("<span />").attr("id", "slider-" + this.config.id).slider({
    orientation: "horizontal",
    change: function(f, g) {
      var e = g.value;
      var h = (e / 100) * d.getDuration();
      d.seek(h);
    }
  });
  a.find("a.ui-slider-handle").attr({
    role: "slider",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": "0",
    "aria-valuetext": "0 percent",
    title: "Slider Control"
  });
  var c = $("<span />").addClass("progress-bar").attr({
    id: "progress-bar-" + this.config.id,
    tabindex: "-1"
  }).addClass("ui-progressbar-value ui-widget-header ui-corner-left").css({
    width: "0%",
    height: "95%"
  });
  var b = $("<span />").attr({
    id: "loaded-bar-" + this.config.id,
    tabindex: "-1"
  }).addClass("loaded-bar ui-progressbar-value ui-widget-header ui-corner-left").css({
    height: "95%",
    width: "0%"
  });
  return a.append(c, b);
};
window.NOMENSA.player.MediaplayerDecorator.prototype.setSliderTimeout = function() {
  var a = this;
  if (a.sliderInterval == undefined) {
    a.sliderInterval = setInterval(function() {
      a.updateSlider();
    }, a.config.sliderTimeout);
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.clearSliderTimeout = function() {
  var a = this;
  if (a.sliderInterval != undefined) {
    a.sliderInterval = clearInterval(a.sliderInterval);
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.updateSlider = function() {
  var c = (typeof(this.duration) != "undefined") ? this.duration : this.getDuration();
  var a = (typeof(this.duration_found) == "boolean") ? this.duration_found : false;
  var d = this.getCurrentTime();
  var b = 0;
  if (c > 0) {
    b = (d / c) * 100;
    b = parseInt(b, 10);
  } else {
    c = 0;
  }
  if (!a) {
    $("#duration-" + this.config.id).html(this.formatTime(parseInt(c, 10)));
    this.duration_found = true;
  }
  $("#slider-" + this.config.id).find("a.ui-slider-handle").attr({
    "aria-valuenow": b,
    "aria-valuetext": b.toString() + " percent"
  }).css("left", b.toString() + "%");
  $("#progress-bar-" + this.config.id).attr({
    "aria-valuenow": b,
    "aria-valuetext": b.toString() + " percent"
  }).css("width", b.toString() + "%");
  this.updateLoaderBar();
  this.updateTime(d);
};
window.NOMENSA.player.MediaplayerDecorator.prototype.updateLoaderBar = function() {
  var a = (this.getBytesLoaded() / this.getBytesTotal()) * 100;
  a = parseInt(a, 10);
  if (!isFinite(a)) {
    a = 0;
  }
  $("#loaded-bar-" + this.config.id).attr({
    "aria-valuetext": a.toString() + " percent",
    "aria-valuenow": a
  }).css("width", a.toString() + "%");
};
window.NOMENSA.player.MediaplayerDecorator.prototype.formatTime = function(e) {
  var a = 0;
  var d = 0;
  var f = 0;
  if (e >= 60) {
    d = parseInt(e / 60, 10);
    f = e - (d * 60);
    if (d >= 60) {
      a = parseInt(d / 60, 10);
      d -= parseInt(a * 60, 10);
    }
  } else {
    f = e;
  }
  var c = [a, d, f];
  for (var b = 0; b < c.length; b = b + 1) {
    c[b] = (c[b] < 10) ? "0" + c[b].toString() : c[b].toString();
  }
  return c.join(":");
};
window.NOMENSA.player.MediaplayerDecorator.prototype.updateTime = function(b) {
  var a = this.formatTime(parseInt(b, 10));
  this.$html.find("#current-" + this.config.id).html(a);
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getControls = function() {
  var a = $("<span />").addClass("ui-corner-bottom").addClass("control-bar");
  var d = $("<a />").attr("href", "http://www.nomensa.com?ref=logo").html("Accessible Media Player by Nomensa").addClass("logo");
  a.append(d);
  var b = this.getFuncControls();
  var e = this.getVolControls();
  var g = this.getSliderBar();
  var f = [b, e, g];
  for (var c = 0; c < f.length; c = c + 1) {
    a[0].appendChild(f[c][0]);
  }
  return a;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.updateVolume = function(b) {
  $("#vol-" + this.config.id).text(b.toString() + "%");
  var a = this.$html.find("button.mute");
  if (b == 0) {
    a.addClass("muted");
  } else {
    if (a.hasClass("muted")) {
      a.removeClass("muted");
    }
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getCaptions = function() {
  var b = this;
  if (b.config.captions) {
    var a = [];
    $.ajax({
      url: b.config.captions,
      success: function(c) {
        if ($(c).find("p").length > 0) {
          b.captions = $(c).find("p");
        }
      }
    });
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.toggleCaptions = function() {
  var a = this;
  var b = this.$html.find(".captions");
  if (b.hasClass("captions-off")) {
    b.removeClass("captions-off").addClass("captions-on");
    a.getPreviousCaption();
    a.setCaptionTimeout();
    a.config.captionsOn = true;
  } else {
    b.removeClass("captions-on").addClass("captions-off");
    a.clearCaptionTimeout();
    a.$html.find(".caption").remove();
    a.config.captionsOn = false;
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.syncCaptions = function() {
  var a;
  if (this.captions) {
    var b = this.getCurrentTime();
    b = this.formatTime(parseInt(b, 10));
    a = this.captions.filter('[begin="' + b + '"]');
    if (a.length == 1) {
      this.insertCaption(a);
    }
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.insertCaption = function(a) {
  if (this.$html.find(".caption").length == 1) {
    this.$html.find(".caption").text(a.text());
  } else {
    var b = $("<div>").text(a.text());
    b[0].className = "caption";
    this.$html.find(".video").prepend(b);
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getPreviousCaption = function(c) {
  var a;
  if (c == undefined) {
    c = this.getCurrentTime();
  }
  var b = this.formatTime(parseInt(c, 10));
  if (this.captions) {
    a = this.captions.filter('[begin="' + b + '"]');
    while ((a.length != 1) && (c > 0)) {
      c--;
      b = this.formatTime(parseInt(c, 10));
      a = this.captions.filter('[begin="' + b + '"]');
    }
    if (a.length == 1) {
      this.insertCaption(a);
    }
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.destroyPlayerInstance = function() {
  return false;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.destroy = function() {
  this.clearSliderTimeout();
  this.clearCaptionTimeout();
  this.destroyPlayerInstance();
  this.$html.remove();
};
window.NOMENSA.player.MediaplayerDecorator.prototype.setCaptionTimeout = function() {
  var a = this;
  if (a.captionInterval == undefined) {
    a.captionInterval = setInterval(function() {
      a.syncCaptions();
    }, 500);
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.clearCaptionTimeout = function() {
  if (this.captionInterval != undefined) {
    this.captionInterval = clearInterval(this.captionInterval);
  }
};
window.NOMENSA = window.NOMENSA || {};
window.NOMENSA.player = window.NOMENSA.player || {};
jQuery(function(a) {
  a(window).resize(function() {
    a(".player-container").each(function() {
      if (a(this).width() > 580) {
        a(this).addClass("player-wide");
      } else {
        a(this).removeClass("player-wide");
      }
    });
  });
});
if (typeof window.postMessage === "undefined") {
  window.NOMENSA.player.stateHandlers = {};
}
window.NOMENSA.player.PlayerManager = function() {
  var a = {};
  this.getPlayer = function(b) {
    if (a[b] != undefined) {
      return a[b];
    }
    return null;
  };
  this.addPlayer = function(b) {
    a[b.config.id] = b;
    return true;
  };
  this.removePlayer = function(b) {
    if (a[b] != undefined) {
      a[b].destroy();
      delete a[b];
    }
  };
  this.map = function(c) {
    var b;
    for (b in a) {
      c(a[b]);
    }
  };
};
window.NOMENSA.player.PlayerDaemon = new window.NOMENSA.player.PlayerManager();
var html5_methods = {
  play: function() {
    this.player.play();
    this.setSliderTimeout();
    if (this.config.captionsOn && this.captions) {
      this.setCaptionTimeout();
    }
  },
  pause: function() {
    this.player.pause();
    this.clearSliderTimeout();
    if (this.config.captionsOn && this.captions) {
      this.clearCaptionTimeout();
    }
  },
  ffwd: function() {
    var a = this.getCurrentTime() + this.config.playerSkip;
    this.seek(a);
  },
  rewd: function() {
    var a = this.getCurrentTime() - this.config.playerSkip;
    if (a < 0) {
      a = 0;
    }
    this.seek(a);
  },
  mute: function() {
    var a = this.$html.find("button.mute");
    if (this.player.muted) {
      this.player.muted = false;
      if (a.hasClass("muted")) {
        a.removeClass("muted");
      }
    } else {
      this.player.muted = true;
      a.addClass("muted");
    }
  },
  volup: function() {
    var a = this.player.volume * 100;
    if (a < (100 - this.config.volumeStep)) {
      a += this.config.volumeStep;
    } else {
      a = 100;
    }
    this.player.volume = (a / 100);
    this.updateVolume(Math.round(a));
  },
  voldwn: function() {
    var a = this.player.volume * 100;
    if (a > this.config.volumeStep) {
      a -= this.config.volumeStep;
    } else {
      a = 0;
    }
    this.player.volume = (a / 100);
    this.updateVolume(Math.round(a));
  },
  getDuration: function() {
    return this.player.duration;
  },
  getCurrentTime: function() {
    return this.player.currentTime;
  },
  getBytesLoaded: function() {
    return this.player.buffered.end(0);
  },
  getBytesTotal: function() {
    return this.player.duration;
  },
  seek: function(a) {
    this.player.currentTime = a;
  },
  cue: function() {
    return;
  }
};
(function(a) {
  a.fn.player = function(k, f) {
    var e = {
      id: "media_player",
      url: window.location.protocol + "//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=",
      media: "8LiQ-bLJaM4",
      repeat: false,
      captions: null,
      captionsOn: true,
      flashWidth: "100%",
      flashHeight: "300px",
      playerStyles: {
        height: "100%",
        width: "100%"
      },
      sliderTimeout: 350,
      flashContainer: "span",
      playerContainer: "span",
      image: "",
      playerSkip: 10,
      volumeStep: 10,
      buttons: {
        forward: true,
        rewind: true,
        toggle: true
      },
      logoURL: "http://www.nomensa.com?ref=logo",
      useHtml5: true,
      swfCallback: null
    };
    var c = a.extend(true, {}, e, k);
    var i = function(p) {
      var s = p.config.media,
        r, o, q, n, m, l;
      n = function(t) {
        r = document.createElement(t.container);
        if (r.canPlayType != undefined) {
          q = r.canPlayType(t.mimetype);
          if ((q.toLowerCase() == "maybe") || (q.toLowerCase() == "probably")) {
            return true;
          }
        }
      };
      if (typeof s === "string") {
        o = g(s);
        if (n(o)) {
          o.src = s;
          return o;
        }
      }
      if ((s instanceof Array) && (typeof s.push !== "undefined")) {
        for (m = 0, l = s.length; m < l; m++) {
          o = g(s[m]);
          if (n(o)) {
            o.src = s[m];
            return o;
          }
        }
      }
      return false;
    };
    var h = function(n) {
      var m = "";
      var l = "video";
      switch (n) {
        case "mp4":
          m = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
          break;
        case "m4v":
          m = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
          break;
        case "ogg":
          m = 'video/ogg; codecs="theora, vorbis"';
          break;
        case "ogv":
          m = 'video/ogg; codecs="theora, vorbis"';
          break;
        case "webm":
          m = 'video/webm; codecs="vp8, vorbis"';
          break;
        case "mp3":
          m = "audio/mpeg";
          l = "audio";
          break;
      }
      return {
        mimetype: m,
        container: l
      };
    };
    var g = function(o) {
      var m = o.lastIndexOf(".");
      if (m != -1) {
        var l = o.substring(m + 1);
        var n = h(l);
        return n;
      }
      return null;
    };
    var b = function() {
      if (window.NOMENSA.browser.mozilla) {
        return (parseInt(window.NOMENSA.browser.version, 10) >= 2) ? true : false;
      }
      return false;
    };
    var d = {
      generatePlayerContainer: function() {
        var l = a("<" + this.config.playerContainer + " />").css(this.config.playerStyles).addClass("player-container");
        if (window.NOMENSA.browser.msie) {
          l.addClass("player-container-ie player-container-ie-" + window.NOMENSA.browser.version.substring(0, 1));
        }
        return l;
      },
      getFlashVars: function() {
        var l = {
          controlbar: "none",
          file: this.config.media
        };
        if (this.config.image != "") {
          l.image = this.config.image;
        }
        if (this.config.repeat) {
          l.repeat = this.config.repeat;
        }
        return l;
      },
      getFlashParams: function() {
        return {
          allowScriptAccess: "always",
          wmode: "transparent"
        };
      },
      getURL: function() {
        return [this.config.url, this.config.id].join("");
      },
      generateFlashPlayer: function(n) {
        var r = this;
        var l = this.getFlashVars();
        var q = this.getFlashParams();
        var s = {
          id: this.config.id,
          name: this.config.id
        };
        var p = a("<" + this.config.flashContainer + " />").attr("id", "player-" + this.config.id).addClass("flashReplace").html('This content requires Macromedia Flash Player. You can <a href="http://get.adobe.com/flashplayer/">install or upgrade the Adobe Flash Player here</a>.');
        var o = a("<span />").addClass("video");
        var m = this.getURL();
        setTimeout(function() {
          swfobject.embedSWF(m, p.attr("id"), r.config.flashWidth, r.config.flashHeight, "9.0.115", null, l, q, s, r.config.swfCallback);
          if (b()) {
            r.$html.find("object").attr("tabindex", "-1");
          }
        }, 0);
        n.append(o.append(p));
        return n;
      },
      generateHTML5Player: function(m, p, o) {
        var n = a("<span />");
        n[0].className = "video";
        var l = a("<" + p + " />").attr({
          id: this.config.id,
          src: this.config.media,
          type: o
        }).css({
          width: "100%",
          height: "50%"
        });
        if (a.trim(this.config.image) != "") {
          l.attr({
            poster: a.trim(this.config.image)
          });
        }
        return m.append(n.append(l));
      },
      createButton: function(o, m) {
        var l = 0;
        var p = [o, this.config.id].join("-");
        var n = a("<button />").append(m).addClass(o).attr({
          title: o,
          id: p
        }).addClass("ui-corner-all ui-state-default").hover(function() {
          a(this).addClass("ui-state-hover");
        }, function() {
          a(this).removeClass("ui-state-hover");
        }).focus(function() {
          a(this).addClass("ui-state-focus");
        }).blur(function() {
          a(this).removeClass("ui-state-focus");
        }).click(function(q) {
          q.preventDefault();
        });
        return n;
      },
      getFuncControls: function() {
        var v = this;
        var t = a("<div>");
        t[0].className = "player-controls";
        var r = [];
        if (v.config.buttons.toggle) {
          var l = v.createButton("play", "Play").attr({
            "aria-live": "assertive"
          }).click(function() {
            if (a(this).hasClass("play")) {
              a(this).removeClass("play").addClass("pause").attr({
                title: "Pause",
                id: "pause-" + v.config.id
              }).text("Pause");
              v.play();
            } else {
              a(this).removeClass("pause").addClass("play").attr({
                title: "Play",
                id: "play-" + v.config.id
              }).text("Play");
              v.pause();
            }
          });
          r.push(l);
        } else {
          var n = v.createButton("play", "Play").click(function() {
            v.play();
          });
          var u = v.createButton("pause", "Pause").click(function() {
            v.pause();
          });
          r.push(n);
          r.push(u);
        }
        if (v.config.buttons.rewind) {
          var q = v.createButton("rewind", "Rewind").click(function() {
            v.rewd();
          });
          r.push(q);
        }
        if (v.config.buttons.forward) {
          var s = v.createButton("forward", "Forward").click(function() {
            v.ffwd();
          });
          r.push(s);
        }
        if (v.config.captions) {
          var m = v.createButton("captions", "Captions").click(function() {
            v.toggleCaptions();
          });
          var o = (v.config.captionsOn == true) ? "captions-on" : "captions-off";
          m.addClass(o);
          r.push(m);
        }
        var p;
        for (p = 0; p < r.length; p = p + 1) {
          t[0].appendChild(r[p][0]);
        }
        return t;
      },
      getVolControls: function() {
        var n = this;
        var r = a("<div>").addClass("volume-controls");
        var m = n.createButton("mute", "Mute").click(function() {
          n.mute();
        });
        var s = n.createButton("vol-up", '+<span class="ui-helper-hidden-accessible"> Volume Up</span>').click(function() {
          n.volup();
        });
        var p = n.createButton("vol-down", '-<span class="ui-helper-hidden-accessible"> Volume Down</span>').click(function() {
          n.voldwn();
        });
        var q = a("<span />").attr({
          id: "vol-" + n.config.id,
          "class": "vol-display"
        }).text("100%");
        var l = [m, p, s, q];
        var o;
        for (o = 0; o < l.length; o = o + 1) {
          r[0].appendChild(l[o][0]);
        }
        return r;
      },
      getSliderBar: function() {
        var n = a("<span />").addClass("ui-helper-hidden-accessible").html("<p>The timeline slider below uses WAI ARIA. Please use the documentation for your screen reader to find out more.</p>");
        var l = a("<span />").addClass("current-time").attr({
          id: "current-" + this.config.id
        }).text("00:00:00");
        var r = this.getSlider();
        var q = a("<span />").addClass("duration-time").attr({
          id: "duration-" + this.config.id
        }).text("00:00:00");
        var p = a("<div />").addClass("timer-bar").append(n);
        var o = [l, r, q];
        var m;
        for (m = 0; m < o.length; m = m + 1) {
          p[0].appendChild(o[m][0]);
        }
        return p;
      },
      getSlider: function() {
        var o = this;
        var l = a("<span />").attr("id", "slider-" + this.config.id).slider({
          orientation: "horizontal",
          change: function(q, r) {
            var p = r.value;
            var s = (p / 100) * o.getDuration();
            o.seek(s);
          }
        });
        l.find("a.ui-slider-handle").attr({
          role: "slider",
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          "aria-valuenow": "0",
          "aria-valuetext": "0 percent",
          title: "Slider Control"
        });
        var n = a("<span />").addClass("progress-bar").attr({
          id: "progress-bar-" + this.config.id,
          tabindex: "-1"
        }).addClass("ui-progressbar-value ui-widget-header ui-corner-left").css({
          width: "0%",
          height: "95%"
        });
        var m = a("<span />").attr({
          id: "loaded-bar-" + this.config.id,
          tabindex: "-1"
        }).addClass("loaded-bar ui-progressbar-value ui-widget-header ui-corner-left").css({
          height: "95%",
          width: "0%"
        });
        return l.append(n, m);
      },
      setSliderTimeout: function() {
        var l = this;
        if (l.sliderInterval == undefined) {
          l.sliderInterval = setInterval(function() {
            l.updateSlider();
          }, l.config.sliderTimeout);
        }
      },
      clearSliderTimeout: function() {
        var l = this;
        if (l.sliderInterval != undefined) {
          l.sliderInterval = clearInterval(l.sliderInterval);
        }
      },
      updateSlider: function() {
        var n = (typeof(this.duration) != "undefined") ? this.duration : this.getDuration();
        var l = (typeof(this.duration_found) == "boolean") ? this.duration_found : false;
        var o = this.getCurrentTime();
        var m = 0;
        if (n > 0) {
          m = (o / n) * 100;
          m = parseInt(m, 10);
        } else {
          n = 0;
        }
        if (!l) {
          a("#duration-" + this.config.id).html(this.formatTime(parseInt(n, 10)));
          this.duration_found = true;
        }
        a("#slider-" + this.config.id).find("a.ui-slider-handle").attr({
          "aria-valuenow": m,
          "aria-valuetext": m.toString() + " percent"
        }).css("left", m.toString() + "%");
        a("#progress-bar-" + this.config.id).attr({
          "aria-valuenow": m,
          "aria-valuetext": m.toString() + " percent"
        }).css("width", m.toString() + "%");
        this.updateLoaderBar();
        this.updateTime(o);
      },
      updateLoaderBar: function() {
        var l = (this.getBytesLoaded() / this.getBytesTotal()) * 100;
        l = parseInt(l, 10);
        if (!isFinite(l)) {
          l = 0;
        }
        a("#loaded-bar-" + this.config.id).attr({
          "aria-valuetext": l.toString() + " percent",
          "aria-valuenow": l
        }).css("width", l.toString() + "%");
      },
      formatTime: function(p) {
        var l = 0;
        var o = 0;
        var q = 0;
        if (p >= 60) {
          o = parseInt(p / 60, 10);
          q = p - (o * 60);
          if (o >= 60) {
            l = parseInt(o / 60, 10);
            o -= parseInt(l * 60, 10);
          }
        } else {
          q = p;
        }
        var n = [l, o, q];
        var m;
        for (m = 0; m < n.length; m = m + 1) {
          n[m] = (n[m] < 10) ? "0" + n[m].toString() : n[m].toString();
        }
        return n.join(":");
      },
      updateTime: function(m) {
        var l = this.formatTime(parseInt(m, 10));
        this.$html.find("#current-" + this.config.id).html(l);
      },
      getControls: function() {
        var l = a("<span />").addClass("ui-corner-bottom").addClass("control-bar");
        var o = a("<a />").attr("href", "http://www.nomensa.com?ref=logo").html("Accessible Media Player by Nomensa").addClass("logo");
        l.append(o);
        var m = this.getFuncControls();
        var p = this.getVolControls();
        var r = this.getSliderBar();
        var q = [m, p, r];
        var n;
        for (n = 0; n < q.length; n = n + 1) {
          l[0].appendChild(q[n][0]);
        }
        return l;
      },
      assembleHTML: function() {
        var l = this.generatePlayerContainer();
        var n = this.generateFlashPlayer(l);
        var m = n.append(this.getControls());
        return m;
      },
      assembleHTML5: function(p, o) {
        var l = this.generatePlayerContainer();
        var n = this.generateHTML5Player(l, p, o);
        var m = n.append(this.getControls());
        return m;
      },
      updateVolume: function(m) {
        a("#vol-" + this.config.id).text(m.toString() + "%");
        var l = this.$html.find("button.mute");
        if (m == 0) {
          l.addClass("muted");
        } else {
          if (l.hasClass("muted")) {
            l.removeClass("muted");
          }
        }
      },
      getCaptions: function() {
        var m = this;
        if (m.config.captions) {
          var l = [];
          a.ajax({
            url: m.config.captions,
            success: function(n) {
              if (a(n).find("p").length > 0) {
                m.captions = a(n).find("p");
              }
            }
          });
        }
      },
      syncCaptions: function() {
        var l;
        if (this.captions) {
          var m = this.getCurrentTime();
          m = this.formatTime(parseInt(m, 10));
          l = this.captions.filter('[begin="' + m + '"]');
          if (l.length == 1) {
            this.insertCaption(l);
          }
        }
      },
      insertCaption: function(l) {
        if (this.$html.find(".caption").length == 1) {
          this.$html.find(".caption").text(l.text());
        } else {
          var m = a("<div>").text(l.text());
          m[0].className = "caption";
          this.$html.find(".video").prepend(m);
        }
      },
      getPreviousCaption: function(n) {
        var l;
        if (n == undefined) {
          n = this.getCurrentTime();
        }
        var m = this.formatTime(parseInt(n, 10));
        if (this.captions) {
          l = this.captions.filter('[begin="' + m + '"]');
          while ((l.length != 1) && (n > 0)) {
            n--;
            m = this.formatTime(parseInt(n, 10));
            l = this.captions.filter('[begin="' + m + '"]');
          }
          if (l.length == 1) {
            this.insertCaption(l);
          }
        }
      },
      destroyPlayerInstance: function() {
        return false;
      },
      destroy: function() {
        this.clearSliderTimeout();
        this.clearCaptionTimeout();
        this.destroyPlayerInstance();
        this.$html.remove();
      },
      setCaptionTimeout: function() {
        var l = this;
        if (l.captionInterval == undefined) {
          l.captionInterval = setInterval(function() {
            l.syncCaptions();
          }, 500);
        }
      },
      clearCaptionTimeout: function() {
        if (this.captionInterval != undefined) {
          this.captionInterval = clearInterval(this.captionInterval);
        }
      },
      play: function() {
        this.player.playVideo();
        this.setSliderTimeout();
        if (this.config.captionsOn && this.captions) {
          this.setCaptionTimeout();
        }
      },
      pause: function() {
        this.player.pauseVideo();
        this.clearSliderTimeout();
        if (this.config.captionsOn && this.captions) {
          this.clearCaptionTimeout();
        }
      },
      ffwd: function() {
        var l = this.getCurrentTime() + this.config.playerSkip;
        this.seek(l);
      },
      rewd: function() {
        var l = this.getCurrentTime() - this.config.playerSkip;
        if (l < 0) {
          l = 0;
        }
        this.seek(l);
      },
      mute: function() {
        var l = this.$html.find("button.mute");
        if (this.player.isMuted()) {
          this.player.unMute();
          if (l.hasClass("muted")) {
            l.removeClass("muted");
          }
        } else {
          this.player.mute();
          l.addClass("muted");
        }
      },
      volup: function() {
        var l = this.player.getVolume();
        if (l < (100 - this.config.volumeStep)) {
          l += this.config.volumeStep;
        } else {
          l = 100;
        }
        this.player.setVolume(l);
        this.updateVolume(l);
      },
      voldwn: function() {
        var l = this.player.getVolume();
        if (l > this.config.volumeStep) {
          l -= this.config.volumeStep;
        } else {
          l = 0;
        }
        this.player.setVolume(l);
        this.updateVolume(l);
      },
      getDuration: function() {
        return this.player.getDuration();
      },
      getCurrentTime: function() {
        return this.player.getCurrentTime();
      },
      getBytesLoaded: function() {
        return this.player.getVideoBytesLoaded();
      },
      getBytesTotal: function() {
        return this.player.getVideoBytesTotal();
      },
      seek: function(l) {
        this.player.seekTo(l);
        if (this.config.captionsOn && this.captions) {
          this.$html.find(".caption").remove();
          this.clearCaptionTimeout();
          this.setCaptionTimeout();
          this.getPreviousCaption();
        }
      },
      cue: function() {
        this.player.cueVideoById(this.config.media);
      },
      toggleCaptions: function() {
        var l = this;
        var m = this.$html.find(".captions");
        if (m.hasClass("captions-off")) {
          m.removeClass("captions-off").addClass("captions-on");
          l.getPreviousCaption();
          l.setCaptionTimeout();
          l.config.captionsOn = true;
        } else {
          m.removeClass("captions-on").addClass("captions-off");
          l.clearCaptionTimeout();
          l.$html.find(".caption").remove();
          l.config.captionsOn = false;
        }
      }
    };

    function j(l) {
      this.config = c;
      a.extend(true, this, d, f);
      this.is_html5 = false;
      var m = i(this);
      if (m && this.config.useHtml5) {
        this.config.media = m.src;
        this.is_html5 = true;
        this.$html = this.assembleHTML5(m.container, m.mimetype);
        a.extend(this, html5_methods);
      } else {
        if ((this.config.media instanceof Array) && (typeof this.config.media.push !== "undefined")) {
          this.config.media = this.config.media[0];
        }
        this.$html = this.assembleHTML();
      }
      if (this.config.captions) {
        this.getCaptions();
      }
    }
    return this.each(function(n) {
      var p = a(this),
        o, m, l = function(q) {
          if (q.$html.width() > 580) {
            q.$html.addClass("player-wide");
          }
          if (q.is_html5) {
            q.player = document.getElementById(q.config.id);
          }
        };
      if (c.url.match(/^(http|https)\:\/\/www\.youtube\.com/)) {
        o = new window.NOMENSA.player.YoutubePlayer(c);
        m = new window.NOMENSA.player.MediaplayerDecorator(o);
        m.onPlayerReady(function() {
          l(m);
          this.getPlayer().setLoop(true);
        });
        m.init(p);
      } else {
        m = new j(n);
        p.html(m.$html);
        l(m);
        window.NOMENSA.player.PlayerDaemon.addPlayer(m);
      }
    });
  };
}(jQuery));
(function ($) {
  window.LCC = window.LCC || {};

  function parseYoutubeVideoId(string){
    if(string.indexOf('youtube.com') > -1){
      var i, _i, part, parts, params = {};
      parts = string.split('?');
      if (parts.length === 1){
        return;
      }
      parts = parts[1].split('&');
      for(i=0,_i=parts.length; i<_i; i++){
        part = parts[i].split('=');
        params[part[0]] = part[1];
      }
      return params.v;
    }
    if(string.indexOf('youtu.be') > -1){
      var parts = string.split('/');
      return parts.pop();
    }
  }

  function enhanceYoutubeVideoLinks($el){
    $el.find("a[href*='youtube.com']").each(function(i){
      var $link = $(this),
          videoId = parseYoutubeVideoId($link.attr('href')),
          $holder = $('<span class="media-player" />'),
          $captions = $link.siblings('.captions');

      if ($(this).attr("data-youtube-player") == "off") {
        // Don't convert this link to an embedded player
      } else {
        if(typeof videoId !== 'undefined'){
          $link.parent().replaceWith($holder);

          $holder.player({
            id: 'youtube-'+i,
            media: videoId,
            captions: $captions.length > 0 ? $captions.attr('href') : null,
            url: (document.location.protocol + '//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=')
          });
        }
      }
    });
  }

  LCC.enhanceYoutubeVideoLinks = enhanceYoutubeVideoLinks;

  $(function(){
    LCC.enhanceYoutubeVideoLinks($('.media-container'));
  });
})(jQuery);