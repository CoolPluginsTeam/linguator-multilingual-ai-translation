/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* global wp */
(function () {
  var __ = wp.i18n.__;
  var _wp$blocks = wp.blocks,
    registerBlockType = _wp$blocks.registerBlockType,
    createBlock = _wp$blocks.createBlock;
  var Fragment = wp.element.Fragment;
  var _ref = wp.blockEditor || wp.editor,
    InspectorControls = _ref.InspectorControls,
    useBlockProps = _ref.useBlockProps; // fallback for older WP
  var _wp$components = wp.components,
    PanelBody = _wp$components.PanelBody,
    ToggleControl = _wp$components.ToggleControl,
    Disabled = _wp$components.Disabled;
  var ServerSideRender = wp.serverSideRender && wp.serverSideRender.default || wp.serverSideRender;
  var addFilter = wp.hooks.addFilter;

  // ---------------------------------------------------------------------------
  // Icon: translation (simple inline SVG)
  // ---------------------------------------------------------------------------
  var TranslationIcon = function TranslationIcon() {
    return wp.element.createElement('svg', {
      width: 20,
      height: 20,
      viewBox: '0 0 20 20',
      xmlns: 'http://www.w3.org/2000/svg'
    }, wp.element.createElement('path', {
      d: 'M11 7H9.49c-.63 0-1.25.3-1.59.7L7 5H4.13l-2.39 7h1.69l.74-2H7v4H2c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v2zM6.51 9H4.49l1-2.93zM10 8h7c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2h-7c-1.1 0-2-.9-2-2v-7c0-1.1.9-2 2-2zm7.25 5v-1.08h-3.17V9.75h-1.16v2.17H9.75V13h1.28c.11.85.56 1.85 1.28 2.62-.87.36-1.89.62-2.31.62-.01.02.22.97.2 1.46.84 0 2.21-.5 3.28-1.15 1.09.65 2.48 1.15 3.34 1.15-.02-.49.2-1.44.2-1.46-.43 0-1.49-.27-2.38-.63.7-.77 1.14-1.77 1.25-2.61h1.36zm-3.81 1.93c-.5-.46-.85-1.13-1.01-1.93h2.09c-.17.8-.51 1.47-1 1.93l-.04.03s-.03-.02-.04-.03z'
    }));
  };

  // ---------------------------------------------------------------------------
  // Icon: submenu chevron (used in nav dropdown)
  // ---------------------------------------------------------------------------
  var SubmenuChevron = function SubmenuChevron() {
    return wp.element.createElement('svg', {
      width: 12,
      height: 12,
      viewBox: '0 0 12 12',
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none'
    }, wp.element.createElement('path', {
      d: 'M1.5 4L6 8l4.5-4',
      strokeWidth: 1.5,
      stroke: 'currentColor'
    }));
  };

  // ---------------------------------------------------------------------------
  // Shared attributes
  // ---------------------------------------------------------------------------
  var sharedAttributes = {
    dropdown: {
      type: 'boolean',
      default: false
    },
    show_names: {
      type: 'boolean',
      default: true
    },
    show_flags: {
      type: 'boolean',
      default: false
    },
    force_home: {
      type: 'boolean',
      default: false
    },
    hide_current: {
      type: 'boolean',
      default: false
    },
    hide_if_no_translation: {
      type: 'boolean',
      default: false
    }
  };

  // ---------------------------------------------------------------------------
  // Helper: ensure at least one of show_names/show_flags is true
  // ---------------------------------------------------------------------------
  function enforceNamesOrFlags(nextAttrs, currentAttrs) {
    var result = _objectSpread(_objectSpread({}, currentAttrs), nextAttrs);
    if (result.show_names === false && result.show_flags === false) {
      // If the user just turned one off and both are now false, re-enable the other.
      // Prefer re-enabling the one that did NOT change in this update.
      if (typeof nextAttrs.show_names !== 'undefined') {
        result.show_flags = true;
      } else {
        result.show_names = true;
      }
    }
    return result;
  }

  // ---------------------------------------------------------------------------
  // Reusable inspector panel for both blocks
  // ---------------------------------------------------------------------------
  function SwitcherInspector(_ref2) {
    var attributes = _ref2.attributes,
      setAttributes = _ref2.setAttributes,
      _ref2$showHideCurrent = _ref2.showHideCurrentEvenInDropdown,
      showHideCurrentEvenInDropdown = _ref2$showHideCurrent === void 0 ? false : _ref2$showHideCurrent;
    var dropdown = attributes.dropdown,
      show_names = attributes.show_names,
      show_flags = attributes.show_flags,
      force_home = attributes.force_home,
      hide_current = attributes.hide_current,
      hide_if_no_translation = attributes.hide_if_no_translation;
    var update = function update(patch) {
      setAttributes(enforceNamesOrFlags(patch, attributes));
    };
    return wp.element.createElement(InspectorControls, {}, wp.element.createElement(PanelBody, {
      title: __('Language switcher settings', 'linguator')
    }, wp.element.createElement(ToggleControl, {
      label: __('Display as dropdown', 'linguator'),
      checked: !!dropdown,
      onChange: function onChange(v) {
        return update({
          dropdown: !!v
        });
      }
    }), (!dropdown || showHideCurrentEvenInDropdown) && wp.element.createElement(ToggleControl, {
      label: __('Show language names', 'linguator'),
      checked: !!show_names,
      onChange: function onChange(v) {
        return update({
          show_names: !!v
        });
      }
    }), (!dropdown || showHideCurrentEvenInDropdown) && wp.element.createElement(ToggleControl, {
      label: __('Show flags', 'linguator'),
      checked: !!show_flags,
      onChange: function onChange(v) {
        return update({
          show_flags: !!v
        });
      }
    }), wp.element.createElement(ToggleControl, {
      label: __('Force switch to homepage', 'linguator'),
      checked: !!force_home,
      onChange: function onChange(v) {
        return update({
          force_home: !!v
        });
      }
    }), !attributes.dropdown && wp.element.createElement(ToggleControl, {
      label: __('Hide current language', 'linguator'),
      checked: !!hide_current,
      onChange: function onChange(v) {
        return update({
          hide_current: !!v
        });
      }
    }), wp.element.createElement(ToggleControl, {
      label: __('Hide languages without translation', 'linguator'),
      checked: !!hide_if_no_translation,
      onChange: function onChange(v) {
        return update({
          hide_if_no_translation: !!v
        });
      }
    })));
  }

  // ---------------------------------------------------------------------------
  // Regular block: linguator/language-switcher
  // ---------------------------------------------------------------------------
  registerBlockType('linguator/language-switcher', {
    title: __('Language switcher', 'linguator'),
    description: __('Add a language switcher so visitors can select their preferred language.', 'linguator'),
    icon: TranslationIcon,
    category: 'widgets',
    attributes: _objectSpread({}, sharedAttributes),
    supports: {
      html: false
    },
    edit: function edit(props) {
      var blockProps = useBlockProps ? useBlockProps() : {};
      return wp.element.createElement(Fragment, {}, wp.element.createElement(SwitcherInspector, {
        attributes: props.attributes,
        setAttributes: props.setAttributes
      }), wp.element.createElement(Disabled, {}, ServerSideRender ? wp.element.createElement(ServerSideRender, {
        block: 'linguator/language-switcher',
        attributes: props.attributes
      }) : wp.element.createElement('div', blockProps, __('Language Switcher preview (SSR not available).', 'linguator'))));
    },
    save: function save() {
      return null;
    } // Rendered via PHP
  });

  // ---------------------------------------------------------------------------
  // Navigation child block: linguator/navigation-language-switcher
  // ---------------------------------------------------------------------------
  var NAV_BLOCK = 'linguator/navigation-language-switcher';
  registerBlockType(NAV_BLOCK, {
    title: __('Language switcher', 'linguator'),
    description: __('Add a language switcher to the Navigation block.', 'linguator'),
    icon: TranslationIcon,
    category: 'widgets',
    parent: ['core/navigation'],
    attributes: _objectSpread({}, sharedAttributes),
    usesContext: ['textColor', 'customTextColor', 'backgroundColor', 'customBackgroundColor', 'overlayTextColor', 'customOverlayTextColor', 'overlayBackgroundColor', 'customOverlayBackgroundColor', 'fontSize', 'customFontSize', 'showSubmenuIcon', 'openSubmenusOnClick', 'style'],
    transforms: {
      from: [{
        type: 'block',
        blocks: ['core/navigation-link'],
        transform: function transform() {
          return createBlock(NAV_BLOCK);
        }
      }]
    },
    edit: function edit(props) {
      var attributes = props.attributes,
        setAttributes = props.setAttributes,
        context = props.context;
      var _ref3 = context || {},
        showSubmenuIcon = _ref3.showSubmenuIcon,
        openSubmenusOnClick = _ref3.openSubmenusOnClick;
      var dropdown = attributes.dropdown;
      var maybeSubmenuIcon = dropdown && (showSubmenuIcon || openSubmenusOnClick) ? wp.element.createElement('span', {
        className: 'wp-block-navigation__submenu-icon'
      }, wp.element.createElement(SubmenuChevron)) : null;
      return wp.element.createElement(Fragment, {}, wp.element.createElement(SwitcherInspector, {
        attributes: attributes,
        setAttributes: setAttributes,
        // In the nav block we allow toggling names/flags even in dropdown for clarity
        showHideCurrentEvenInDropdown: true
      }), wp.element.createElement(Disabled, {}, wp.element.createElement('div', {
        className: 'wp-block-navigation-item'
      }, ServerSideRender ? wp.element.createElement(ServerSideRender, {
        block: NAV_BLOCK,
        attributes: attributes,
        className: 'wp-block-navigation__container block-editor-block-list__layout'
      }) : wp.element.createElement('div', {}, __('Language Switcher (Navigation) preview (SSR not available).', 'linguator')), maybeSubmenuIcon)));
    },
    save: function save() {
      return null;
    } // Rendered via PHP
  });

  // ---------------------------------------------------------------------------
  // Classic Menu → Navigation conversion hook
  // Replaces a menu item with URL "#lmat_switcher" by our NAV_BLOCK with options from meta._lmat_menu_item
  // WARNING: relies on an unstable filter that may change across WP versions.
  // ---------------------------------------------------------------------------
  function mapBlockTree(blocks, menuItems, blocksMapping, mapper) {
    var _convert = function convert(block) {
      var replaced = mapper(block, menuItems, blocksMapping);
      var innerBlocks = (replaced.innerBlocks || []).map(function (b) {
        return _convert(b);
      });
      return _objectSpread(_objectSpread({}, replaced), {}, {
        innerBlocks: innerBlocks
      });
    };
    return blocks.map(_convert);
  }
  function blocksFilter(block, menuItems, blocksMapping) {
    if (block.name === 'core/navigation-link' && block.attributes && block.attributes.url === '#lmat_switcher') {
      var menuItem = (menuItems || []).find(function (m) {
        return m && m.url === '#lmat_switcher';
      });
      var attrs = menuItem && menuItem.meta && menuItem.meta._lmat_menu_item || {};
      var newBlock = createBlock(NAV_BLOCK, attrs);
      if (menuItem && typeof menuItem.id !== 'undefined') {
        blocksMapping[menuItem.id] = newBlock.clientId;
      }
      return newBlock;
    }
    return block;
  }
  function menuItemsToBlocksFilter(blocks, menuItems) {
    return _objectSpread(_objectSpread({}, blocks), {}, {
      innerBlocks: mapBlockTree(blocks.innerBlocks || [], menuItems || [], blocks.mapping || {}, blocksFilter)
    });
  }
  addFilter('blocks.navigation.__unstableMenuItemsToBlocks', 'linguator/include-language-switcher', menuItemsToBlocksFilter);
})();
/******/ })()
;