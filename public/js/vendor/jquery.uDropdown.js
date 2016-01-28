/*!
 * jQuery.uDropdown
 */
;(function($, window) {

  var uDropdown = window.uDropdown = function(el, options) {
    this.el = el;
    this.$el = $(el);
    this.guid = uDropdown.guid++;

    this.settings = $.extend(true, {}, uDropdown.defaults, options);
    if (typeof this.settings.label === 'function') {
      this.settings.label = this.settings.label.call(this);
    }

    var replacement = this.replacement = this.getReplacementElement();
    this.$replacement = $(replacement);

    this.replaceOriginal();
    this.bindEvents();
  };

  uDropdown.guid = 0;

  uDropdown.defaults = {
    label: function($el) {
      var $options = this.$el.find('option'),
        label = $options.filter('[selected]').text();
      if (label) {
        return label;
      }

      var label = this.$el.prev(this.settings.classes.label).text();
      if (label) {
        return label;
      }

      return $options.first().text();
    },
    onAfterToggle: function($replacement) { },
    onAfterSelect: function($selected) { },
    classes: {
      open: 'open',
      label: 'label',
      list: 'list',
      optGroup: 'optgroup',
      optGroupChild: 'optgroup-child',
      hasOptGroup: 'has-optgroup'
    },
    eventNamespace: '.uDropdown',
    clickEvent: 'click',
    autoSetWidth: true
  };

  uDropdown.prototype.getReplacementElement = function() {
    // Container
    var ctr = document.createElement('div');
    ctr.className = this.el.className;
    ctr.setAttribute('data-value', '');

    // Label
    var lbl = document.createElement('span');
    lbl.className = this.settings.classes.label;
    lbl.innerHTML = this.settings.label;
    ctr.appendChild(lbl);

    // List
    var lst = document.createElement('ul');

    // Append option children
    var $options = this.$el.children('option');
    this.renderChildren($options, lst);

    // Check if option groups exist
    var optGroups = this.getOptionGroups();
    if (optGroups.length) {
      // Render each option group as parent list
      for (var i = 0, ogl = optGroups.length; i < ogl; i++) {
        var optGroup = optGroups[i];

        var newOptGroup = document.createElement('ul');
        newOptGroup.className = this.settings.classes.optGroup;

        // OptGroup label
        var ogLabel = document.createElement('li');
        ogLabel.innerHTML = optGroup.label;
        newOptGroup.appendChild(ogLabel);

        // OptGroup children
        var ogChildren = document.createElement('li'),
          ogChildrenList = document.createElement('ul');
        ogChildrenList.className = this.settings.classes.optGroupChild;
        this.renderChildren(optGroup.children, ogChildrenList);
        ogChildren.appendChild(ogChildrenList);
        newOptGroup.appendChild(ogChildren);

        var lstChild = document.createElement('li');
        lstChild.appendChild(newOptGroup);
        lst.appendChild(lstChild);
      }
    }

    // Apply list class and indicator of option group existing
    lst.className = this.settings.classes.list + ' ' +
      (optGroups.length ? '' : 'no-') + this.settings.classes.hasOptGroup;

    ctr.appendChild(lst);
    return ctr;
  };

  uDropdown.prototype.getOptionGroups = function() {
    var optGroups = [];

    this.$el.find('optgroup').each(function() {
      var label = $(this).attr('label');
      optGroups.push({
        label: label,
        children: $(this).children('option')
      });
    });

    return optGroups;
  };

  uDropdown.prototype.renderChildren = function(options, elList) {
    for (var i = 0, ol = options.length; i < ol; i++) {
      var opt = options[i],
        newOpt = document.createElement('li');

      newOpt.innerHTML = opt.innerHTML;
      newOpt.setAttribute('data-value', opt.value);
      elList.appendChild(newOpt);
    }

    return elList;
  };

  uDropdown.prototype.bindEvents = function() {
    this.$replacement.on(this.settings.clickEvent + this.settings.eventNamespace, $.proxy(this.toggle, this));
    this.$replacement.on(this.settings.clickEvent + this.settings.eventNamespace, 'li', $.proxy(this.select, this));
  };

  uDropdown.prototype.replaceOriginal = function() {
    this.$el.replaceWith(this.$replacement);
    this.$replacement.append(this.$el.hide());

    if (this.settings.autoSetWidth) {
      this.setCalculatedWidth();
    }
  };

  uDropdown.prototype.setCalculatedWidth = function() {
    var $options = this.$replacement.find('li');

    if ($options.length > 0) {
      // Find longest
      var longest = $options.sort(function(a, b) {
        return b.innerHTML.length - a.innerHTML.length;
      })[0];

      // Set label to longest
      var curLabel = this.settings.label,
        $label = this.$replacement.find('.' + this.settings.classes.label),
        _this = this;

      if (curLabel !== longest.innerHTML) {
        $label.text(longest.innerHTML);
      }

      // Update width and reset
      setTimeout(function() {
        var newWidth = $label.outerWidth();
        $label.text(curLabel);
        _this.$replacement.css('width', newWidth + 'px');
      }, 100);
    }
  };

  uDropdown.prototype.toggle = function() {
    var isOpen = this.$replacement.hasClass('open'),
      newListHeight = 0,
      bodyEvent = this.settings.clickEvent + this.settings.eventNamespace + this.guid;

    $('body').off(bodyEvent);

    if (!isOpen) {
      // Calculate new height
      var $opts = this.$replacement.find('li');
      $opts.each(function() {
        newListHeight += $(this).outerHeight();
      });

      // Close on body click
      var _this = this;
      setTimeout(function() {
        $('body').on(bodyEvent, $.proxy(_this.toggle, _this));
      });
    }

    // Trigger expand
    this.$replacement
      .toggleClass(this.settings.classes.open, !isOpen)
      .trigger('toggle', this.$replacement)
      .find('.' + this.settings.classes.list)
        .css('height', newListHeight);
  };

  uDropdown.prototype.select = function(e) {
    var $target = $((e && e.target) || window.event.target),
      newValue = $target.attr('data-value');

    // Do not select if parent is option group
    if ($target.parent().is('.' + this.settings.classes.optGroup)) {
      e && e.stopPropagation();
      return;
    }

    // Update replacement
    this.$replacement
      .attr('data-value', $target.attr('data-value'))
      .find('.' + this.settings.classes.label)
      .text($target.text())
      .trigger('select', $target);

    // Update original
    this.$el.val(newValue);
  };

  var pluginName = 'uDropdown';
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$(this).data('plugin_' + pluginName)) {
        return $(this).data('plugin_' + pluginName, new uDropdown(this, options));
      }
    });
  };

}(this.jQuery || this.Zepto, this));