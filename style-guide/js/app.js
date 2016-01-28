;(function($, window, document) {

    var app = window.App = { };

    //=====================================
    // Home
    //=====================================
    app.home = {
        init: function() {
            app.home.setupTabContent();
        },

        setupTabContent: function() {
            $('#pnlTabDisplay').uTabs({
                applySelectedClassToClosest: 'li',
                classes: {
                    visible: 'visible',
                    hidden: 'hidden'
                },
                media: {
                    breakPx: app.CONST.breakPx
                }
            });
        }
    };

    //=====================================
    // Community
    //=====================================
    app.community = {
        init: function() {
            app.community.$grid = $('#pnlGrid');
            app.community.setupIsotope();
            app.community.setupMobileTabs();
        },

        setupIsotope: function() {
            app.community.$grid.closest('.social-grid')
                .on('click', '.social-filter-nav [data-filter]', function(e) {
                    e.preventDefault();
                    app.community.updateIsotopeFilter.call(this);
                });

            $(window).load(function(){
                app.community.$grid.isotope({
                    layoutMode: 'masonry',
                    //masonry: {
                        //columnWidth: 250,
                        //gutterWidth: 42
                    //},
                    animationOptions: {
                        duration: 500
                    }
                });
            });  
             
            setTimeout(function() {
                app.community.$grid.isotope({
                    layoutMode: 'masonry',
                    //masonry: {
                        //columnWidth: 250,
                        //gutterWidth: 42
                    //}
                });
            }, 0);

        },

        updateIsotopeFilter: function() {
            var $filter = $(this),
                $siblings = $filter.closest('.social-grid').find('[data-filter]'),
                selector = $filter.attr('data-filter');

            app.community.$grid.isotope({ filter: selector });
            $siblings.removeClass('selected');
            $filter.addClass('selected');
        },

        setupMobileTabs: function() {
            var $pnlGridContainer = $('#pnlSocialGridContainer');

            if (window.innerWidth < app.CONST.breakPx) {
                var $newFilter = $('[data-navigation]', $pnlGridContainer)
                    .find('.selected')
                        .removeClass('selected')
                        .end()
                    .find('[data-filter=".block-news"]')
                        .addClass('selected');

                app.community.updateIsotopeFilter.call($newFilter);
            }

            $pnlGridContainer.uTabs({
                media: {
                    breakPx: app.CONST.breakPx,
                    collapsible: false
                }
            })
        }
    };

    //=====================================
    // Physicians
    //=====================================
    app.physicians = {
        init: function () {
            app.searchPage.bindSearchExpander();
        }
    };

    //=====================================
    // Locations
    //=====================================
    app.locations = {
        init: function () {
            app.searchPage.bindSearchExpander();
        }
    };

    //=====================================
    // Search Page (Physicians or Locations)
    //=====================================
    app.searchPage = {
        bindSearchExpander: function() {
            $('#btnRefineSearch').on('click', function() {
                $(this).next('.refine-options').slideToggle();
            });
        }
    }

    //=====================================
    // Common (all pages)
    //=====================================
    app.common = {
        dataTier: 0,

        init: function() {
            app.common.initializeAnimations();
            app.common.setupDropdownSections();
            app.common.setupDropdowns();
            app.common.setupMobileFlyout();
        },

        initializeAnimations: function() {
            $('div.page, #pnlMobileFlyout').addClass('animate');
        },

        setupDropdownSections: function () {
            $('div.styled-dropdown span.label').click(function () {
                $(this).parent().toggleClass('open');
            });
        },

        setupDropdowns: function() {
            $('select.styled-dropdown').uDropdown();
        },

        setupMobileFlyout: function() {
            var $lst = $('#lstPrimaryNavigation').on('click', 'a.selected', function(e) {
                var isMobile = $lst.find('a:visible').length === 1;

                if (isMobile) {
                    e.preventDefault();
                    e.stopPropagation();
                    app.common.toggleFlyoutMenu();
                }
            });

            var $pnl = $('#pnlMobileFlyout')
                .on('click', '[data-expand]', function() {
                    app.common.incrementFlyoutRoot.call(this, 1);
                    $(this).closest('li').children('ul').addClass('selected');
                })
                .on('click', '[data-collapse]', function() {
                    app.common.incrementFlyoutRoot.call(this, -1);
                    $pnl.find('.selected').last().removeClass('selected');
                })
                .on('click', '[data-toggle-menu]', app.common.toggleFlyoutMenu)
                .on('click', function(e) {
                    e.stopPropagation();
                });

            this.setSelectedNavigation($pnl);
        },

        setSelectedNavigation: function($flyout) {
            var path = window.location.pathname;

            $selected = $flyout.find('[href="' + path + '"]');
            if ($selected.length) {
                var $parents = $selected.parentsUntil('.flyout-root').filter('.flyout-child'),
                    parent;

                $parents.addClass('selected');
                while (parent = Array.prototype.pop.call($parents)) {
                    var $label = $(parent).siblings('h1,h2,h3,h4,h5,h6').first();
                    app.common.incrementFlyoutRoot.call($label[0], 1);
                }
            }
        },

        incrementFlyoutRoot: function (increment) {
            var $root = $('#pnlMobileFlyout'),
                $labelStack = $root.find('.label-stack');

            $root.removeClass('data-tier-' + app.common.dataTier)
            app.common.dataTier += increment;
            $root.addClass('data-tier-' + app.common.dataTier);

            if (increment > 0) {
                var label = UTIL.trim($(this).text());
                $labelStack.append('<h1 class="navigation-label" data-collapse>' + label + '</h1>');
            } else {
                $labelStack.children().last().remove();
            }
        },

        toggleFlyoutMenu: function() {
            var $body = $(document.body),
                isOpen = $body.toggleClass('flyout-open').hasClass('flyout-open');

            $body[isOpen ? 'on' : 'off']('click.flyout', app.common.toggleFlyoutMenu);

            return isOpen;
        }
    };

    //=====================================
    // Utility
    //=====================================
    var CONST = app.CONST = {
        breakPx: 768
    };

    var UTIL = app.UTIL = {
        trim: function(str) {
            if (String.prototype.trim) {
                return str.trim();
            }

            return str.replace(/^\s+|\s+$/g, '');
        }
    };

    //=====================================
    // Bootstrap
    //=====================================

    app.bootstrap = function() {
        var components = $('body').data('scriptComponent').split(' ');
        components.unshift('common');

        for (var c = 0, cl = components.length; c < cl; c++) {
            var component = components[c];
            if (component in app && typeof app[component].init === 'function') {
                app[component].init();
            }
        }
    };

    $(document).ready(app.bootstrap);

}(this.jQuery, this, this.document));
