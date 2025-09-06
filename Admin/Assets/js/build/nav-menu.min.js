/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Handles the options in the language switcher nav menu metabox.
 *
 * @package Linguator
 */

var lmatNavMenu = {
  /**
   * The element wrapping the menu elements.
   *
   * @member {HTMLElement|null}
   */
  wrapper: null,
  /**
   * Init.
   */
  init: function init() {
    if (document.readyState !== 'loading') {
      lmatNavMenu.ready();
    } else {
      document.addEventListener('DOMContentLoaded', lmatNavMenu.ready);
    }
  },
  /**
   * Called when the DOM is ready. Attaches the events to the wrapper.
   */
  ready: function ready() {
    lmatNavMenu.wrapper = document.getElementById('menu-to-edit');
    if (!lmatNavMenu.wrapper) {
      return;
    }
    lmatNavMenu.wrapper.addEventListener('click', lmatNavMenu.printMetabox);
    lmatNavMenu.wrapper.addEventListener('change', lmatNavMenu.ensureContent);
    lmatNavMenu.wrapper.addEventListener('change', lmatNavMenu.showHideRows);
  },
  printMetabox: {
    /**
     * Event callback that prints our checkboxes in the language switcher.
     *
     * @param {Event} event The event.
     */
    handleEvent: function handleEvent(event) {
      if (!event.target.classList.contains('item-edit')) {
        // Not clicking on a Edit arrow button.
        return;
      }
      var metabox = event.target.closest('.menu-item').querySelector('.menu-item-settings');
      if (!(metabox !== null && metabox !== void 0 && metabox.id)) {
        // Should not happen.
        return;
      }
      if (!metabox.querySelectorAll('input[value="#lmat_switcher"][type=text]').length) {
        // Not our metabox, or already replaced.
        return;
      }

      // Remove default fields we don't need.
      _toConsumableArray(metabox.children).forEach(function (el) {
        if ('P' === el.nodeName && !el.classList.contains('field-move')) {
          el.remove();
        }
      });
      var t = lmatNavMenu.printMetabox;
      var itemId = Number(metabox.id.replace('menu-item-settings-', ''));
      metabox.append(t.createHiddenInput('title', itemId, lmat_data.title)); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.append
      metabox.append(t.createHiddenInput('url', itemId, '#lmat_switcher')); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.append
      metabox.append(t.createHiddenInput('lmat-detect', itemId, 1)); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.append

      var ids = Array('hide_if_no_translation', 'hide_current', 'force_home', 'show_flags', 'show_names', 'dropdown'); // Reverse order.
      var isValDefined = typeof lmat_data.val[itemId] !== 'undefined';
      ids.forEach(function (optionName) {
        // Create the checkbox's wrapper.
        var inputWrapper = t.createElement('p', {
          class: 'description'
        });
        if ('hide_current' === optionName && isValDefined && 1 === lmat_data.val[itemId].dropdown) {
          // Hide the `hide_current` checkbox if `dropdown` is checked.
          inputWrapper.classList.add('hidden');
        }
        metabox.prepend(inputWrapper); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.prepend

        // Create the checkbox's label.
        var inputId = "edit-menu-item-".concat(optionName, "-").concat(itemId);
        var label = t.createElement('label', {
          'for': inputId
        });
        label.innerText = " ".concat(lmat_data.strings[optionName]);
        inputWrapper.append(label); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.append

        // Create the checkbox.
        var cb = t.createElement('input', {
          type: 'checkbox',
          id: inputId,
          name: "menu-item-".concat(optionName, "[").concat(itemId, "]"),
          value: 1
        });
        if (isValDefined && 1 === lmat_data.val[itemId][optionName] || !isValDefined && 'show_names' === optionName) {
          // `show_names` as default value.
          cb.checked = true;
        }
        label.prepend(cb); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.prepend
      });
    },
    /**
     * Creates and returns a `<input type=hidden"/>` element.
     *
     * @param {string}        id     An identifier for this input. It will be part of the final `id` attribute.
     * @param {number}        itemId The ID of the menu element (post ID).
     * @param {string|number} value  The input's value.
     * @return {HTMLElement} The input element.
     */
    createHiddenInput: function createHiddenInput(id, itemId, value) {
      return lmatNavMenu.printMetabox.createElement('input', {
        type: 'hidden',
        id: "edit-menu-item-".concat(id, "-").concat(itemId),
        name: "menu-item-".concat(id, "[").concat(itemId, "]"),
        value: value
      });
    },
    /**
     * Creates and returns an element.
     *
     * @param {string} type Element's type.
     * @param {Object} atts Element's attributes.
     * @return {HTMLElement} The element.
     */
    createElement: function createElement(type, atts) {
      var el = document.createElement(type);
      for (var _i = 0, _Object$entries = Object.entries(atts); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        el.setAttribute(key, value);
      }
      return el;
    }
  },
  ensureContent: {
    regExpr: new RegExp(/^edit-menu-item-show_(names|flags)-(\d+)$/),
    /**
     * Event callback that disallows unchecking both `show_names` and `show_flags`.
     *
     * @param {Event} event The event.
     */
    handleEvent: function handleEvent(event) {
      if (!event.target.id || event.target.checked) {
        // Now checked, nothing to do.
        return;
      }
      var matches = event.target.id.match(lmatNavMenu.ensureContent.regExpr);
      if (!matches) {
        // Not the checkbox we want.
        return;
      }

      // Check the other checkbox.
      var _matches = _slicedToArray(matches, 3),
        type = _matches[1],
        id = _matches[2];
      var otherType = 'names' === type ? 'flags' : 'names';
      document.getElementById("edit-menu-item-show_".concat(otherType, "-").concat(id)).checked = true;
    }
  },
  showHideRows: {
    regExpr: new RegExp(/^edit-menu-item-dropdown-(\d+)$/),
    /**
     * Event callback that shows or hides the `hide_current` checkbox when `dropdown` is checked.
     *
     * @param {Event} event The event.
     */
    handleEvent: function handleEvent(event) {
      if (!event.target.id) {
        // Not the checkbox we want.
        return;
      }
      var matches = event.target.id.match(lmatNavMenu.showHideRows.regExpr);
      if (!matches) {
        // Not the checkbox we want.
        return;
      }
      var hideCb = document.getElementById("edit-menu-item-hide_current-".concat(matches[1]));
      if (!hideCb) {
        // Should not happen.
        return;
      }
      var description = hideCb.closest('.description');

      // Hide or show.
      description.classList.toggle('hidden', event.target.checked);
      if (event.target.checked) {
        // Uncheck after hiding.
        hideCb.checked = false;
        hideCb.dispatchEvent(new Event('change'));
      }
    }
  }
};
lmatNavMenu.init();
/******/ })()
;