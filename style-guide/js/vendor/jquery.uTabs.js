/*!
 * jQuery.uTabs
 */
;(function($, window) {

  var uTabs = window.uTabs = function(el, options) {
    this.settings = $.extend(true, {}, uTabs.defaults, options);

    this.el = el;
    this.$el = $(el);
    this.$navigation = $(this.settings.selectors.navigation, this.$el);
    this.$content = $(this.settings.selectors.content, this.$el);

    this.bindNavigation();
    this.displayPanel = this.getDisplayBehavior();

    if (this.settings.media.breakPx) {
      this.bindMediaResize();
    }

    if (this.settings.initialize) {
      this.initialize();
    }
  };

  uTabs.defaults = {
    applySelectedClassToClosest: undefined,
    initialize: true,
    clickEvent: 'click',
    selectors: {
      navigation: '[data-navigation]',
      content: '[data-content]'
    },
    calculatedProperties: {
      transition: ['-webkit-transition', '-moz-transition', 'transition'],
      visibility: ['position', 'height', 'visibility']
    },
    classes: {
      visible: undefined,
      hidden: undefined,
      selected: 'selected',
      splitNav: {
        before: 'before',
        after: 'after'
      }
    },
    media: {
      breakPx: undefined,
      collapsible: true,
      toggleCalculatedHeight: true
    }
  };

  uTabs.prototype.bindMediaResize = function() {
    var fnResize = UTIL.debounce($.proxy(this.onWindowResize, this));
    $(window).on('resize.uTabs', fnResize);
  };

  uTabs.prototype.onWindowResize = function() {
    if (window.innerWidth < this.settings.media.breakPx) {
      if (!this.mediaSplit) {
        this.mediaSplit = true;
        this.redrawList();
      }

      if (this.$visible) {
        this.setCalculatedHeight(this.$visible);
      }
    } else if (this.mediaSplit) {
      this.mediaSplit = false;
      this.redrawList();
      this.removeCalculatedProperties();
    }
  };

  uTabs.prototype.removeCalculatedProperties = function() {
    if (!this.$visible) return;

    var styles = [];

    for (var ps in this.settings.calculatedProperties) {
      var propSet = this.settings.calculatedProperties[ps];
      for (var p = 0, pl = propSet.length; p < pl; p++) {
        styles.push(propSet[p]);
      }
    }

    UTIL.removeStyles(this.$visible, styles);
  };

  uTabs.prototype.redrawList = function() {
    var listItems = { },
      navs = { };

    if (this.mediaSplit) {
      var $lis = this.$navigation.find('li'),
        selIndex = 0;

      // Find selected in array of list items
      for (var l = 0, ll = $lis.length; l < ll; l++) {
        var $li = $($lis[l]),
          selSelected = '.' + this.settings.classes.selected;
        if ($li.is(selSelected) || $li.has(selSelected).length) {
          selIndex = l;
          break;
        }
      }

      listItems = {
        before: $lis.slice(0, selIndex + 1), // Selected and any list items before
        after: $lis.slice(selIndex + 1) // List items after selected
      };
    } else {
      listItems = {
        before: this.$navigation.find('li')
      }
    }

    // Generate new list elements
    for (var pos in listItems) {
      var $list = listItems[pos],
        $nav, navClasses;

      // Don't generate navigation if no items
      if (!$list.length) continue;

      $nav = $(this.$navigation[0]).clone(),
      navClasses;

      // Retrieve array of split navigation classes
      navClasses = $.map(this.settings.classes.splitNav,
        function(key) {
          return key;
        });

      $nav
        .off('.uTabs') // Unregister event handlers
        .removeClass(navClasses.join(' ')) // Remove existing split navigation classes
        .addClass(this.settings.classes.splitNav[pos]) // Add class for position
        .find('ul')
          .empty() // Clear existing items
          .append($list); // Add new items

      navs[pos] = $nav;
    }

    // Replace existing list with new lists
    this.$navigation.remove();
    for (var pos in navs) {
      var $nav = navs[pos];
      this.$navigation = this.$navigation.add($nav);
      this.$content[pos]($nav);
    }

    // Re-bind events
    this.bindNavigation();
  };

  uTabs.prototype.bindNavigation = function() {
    var _this = this;

    this.$navigation.on(this.settings.clickEvent + '.uTabs', 'a', function(e) {
      var $panel = $(this.hash, _this.$content),
        isVisible = _this.togglePanel($panel, $(this));

      _this.$content.trigger('change', $panel, isVisible);

      e.preventDefault();
    });
  };

  uTabs.prototype.togglePanel = function($panel, $clicked) {
    var $toSelect = this.getElementToSelect($clicked);

    if (this.settings.media.collapsible &&
      $toSelect.is('.' + this.settings.classes.selected)) {
      this.displayPanel(null);
      $toSelect.removeClass(this.settings.classes.selected);
      return false;
    }

    this.setSelected($toSelect);
    this.displayPanel($panel);
    return true;
  }

  uTabs.prototype.setSelected = function($selected) {
    // Remove current selected
    this.$navigation.find('.' + this.settings.classes.selected)
      .removeClass(this.settings.classes.selected);

    // Add new selected
    $selected
      .addClass(this.settings.classes.selected);

    if (this.mediaSplit) {
      this.redrawList();
    }
  };

  uTabs.prototype.getElementToSelect = function($from) {
    if (this.settings.applySelectedClassToClosest) {
      return $from.closest(this.settings.applySelectedClassToClosest);
    }

    return $from;
  };

  uTabs.prototype.toggleCalculatedHeight = function($panel) {
    if ($panel.height() == 0) {
      this.setCalculatedHeight($panel);
    } else if (this.settings.initialize) {
      this.setStaticHeight($panel);
    } else {
      $panel.css('height', 0);
    }
  };

  uTabs.prototype.setCalculatedHeight = function($el) {
    var curVisibility = UTIL.getStyles($el, this.settings.calculatedProperties.visibility),
      height;

    // TODO: Correctly recalculate height on window resize
    $el.css({ position: 'absolute', height: 'auto', visibility: 'hidden' });
    curVisibility.height = $el.outerHeight() + 'px';
    $el.css(curVisibility);
  };

  uTabs.prototype.setStaticHeight = function($el) {
    var curTransition = UTIL.getStyles($el, this.settings.calculatedProperties.transition),
      newTransition = $.extend({}, curTransition);

    for (var attr in curTransition) {
      newTransition[attr] = 'none';
    }

    $el
      .css(newTransition)
      .css('height', $el.height());

    return setTimeout(function() {
      $el.css(curTransition);
    }, 0);
  };

  uTabs.prototype.getDisplayBehavior = function() {
    if (this.settings.classes.visible &&
        this.settings.classes.hidden) {
      return function($panel) {
        var $panels = this.$content.find('[id]').not($panel),
          $visible = $panels.filter('.' + this.settings.classes.visible);

        if (this.mediaSplit && this.settings.media.toggleCalculatedHeight) {
          if ($visible.length) this.toggleCalculatedHeight($visible);
          if ($panel) this.toggleCalculatedHeight($panel);
        }

        $visible
          .removeClass(this.settings.classes.visible);

        $visible.add($panels)
          .addClass(this.settings.classes.hidden);

        if ($panel) {
          this.$visible = $panel;

          $panel
            .removeClass(this.settings.classes.hidden)
            .addClass(this.settings.classes.visible);
        }
      }
    }

    return function($panel) {
      this.$content.find('[id]:visible').hide();

      if ($panel) {
        this.$visible = $panel;

        if (this.mediaSplit && this.settings.media.toggleCalculatedHeight) {
          this.toggleCalculatedHeight($panel);
        }

        $panel.show();
      }
    }
  };

  uTabs.prototype.initialize = function() {
    var $lnk = this.$navigation.find('.' + this.settings.classes.selected + ' a,a.' + this.settings.classes.selected),
      $selectedPanel;

    if (!$lnk.length) return;

    $selectedPanel = $($lnk[0].hash);

    if (this.settings.media.breakPx) {
      this.onWindowResize();
    }
    this.displayPanel($selectedPanel);

    this.settings.initialize = false;
  };

  var UTIL = {
    debounce: function(fn, delay) {
      var timeout;

      return function() {
        var obj = this,
          args = arguments;
          delayedFn = function() {
            fn.apply(obj, args);
            timeout = null;
          };

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(delayedFn, delay || 100);
      };
    },

    getStyles: function($el, styles) {
      var attrs = { };

      for (var n = 0, nl = styles.length; n < nl; n++) {
        var name = styles[n],
          attrVal = $el.css(name);

        if (typeof attrVal != 'undefined') {
          attrs[name] = attrVal;
        }
      }

      return attrs;
    },

    removeStyles: function($el, styles) {
      var style = $el.attr('style');

      for (var s = 0, sl = styles.length; s < sl; s++) {
        var prop = styles[s];
        var rxReplace = new RegExp(prop + ':\\s*[^;]*;', 'i');
        style = style.replace(rxReplace, '');
      }

      $el.attr('style', style);
    }
  };

  var pluginName = 'uTabs';
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$(this).data('plugin_' + pluginName)) {
        return $(this).data('plugin_' + pluginName, new uTabs(this, options));
      }
    });
  };

}(this.jQuery || this.Zepto, this));