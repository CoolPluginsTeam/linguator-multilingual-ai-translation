/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * @package Linguator
 */

/**
 * Tag suggest in quick edit
 */
jQuery(function ($) {
  $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    if ('string' === typeof options.data && -1 !== options.data.indexOf('action=ajax-tag-search') && (lang = $(':input[name="inline_lang_choice"]').val())) {
      options.data = 'lang=' + lang + '&' + options.data;
    }
  });
});

/**
 * Quick edit
 */
jQuery(function ($) {
  var handleQuickEditInsertion = function handleQuickEditInsertion(mutationsList) {
    var _iterator = _createForOfIteratorHelper(mutationsList),
      _step;
    try {
      var _loop = function _loop() {
        var mutation = _step.value;
        var addedNodes = Array.from(mutation.addedNodes).filter(function (el) {
          return el.nodeType === Node.ELEMENT_NODE;
        });
        var form = addedNodes[0];
        if (0 < mutation.addedNodes.length && form.classList.contains('inline-editor')) {
          // WordPress has inserted the quick edit form.
          var post_id = Number(form.id.substring(5));
          if (post_id > 0) {
            // Get the language dropdown.
            var select = form.querySelector('select[name="inline_lang_choice"]');
            var _lang = document.querySelector('#lang_' + String(post_id)).innerHTML;
            select.value = _lang; // Populates the dropdown with the post language.

            filter_terms(_lang); // Initial filter for category checklist.
            filter_pages(_lang); // Initial filter for parent dropdown.

            // Modify category checklist and parent dropdown on language change.
            select.addEventListener('change', function (event) {
              var newLang = event.target.value;
              filter_terms(newLang);
              filter_pages(newLang);
            });
          }
        }
        /**
         * Filters the category checklist.
         */
        function filter_terms(lang) {
          if ("undefined" != typeof lmat_term_languages) {
            $.each(lmat_term_languages, function (lg, term_tax) {
              $.each(term_tax, function (tax, terms) {
                $.each(terms, function (i) {
                  var id = '#' + tax + '-' + lmat_term_languages[lg][tax][i];
                  lang == lg ? $(id).show() : $(id).hide();
                });
              });
            });
          }
        }

        /**
         * Filters the parent page dropdown list.
         */
        function filter_pages(lang) {
          if ("undefined" != typeof lmat_page_languages) {
            $.each(lmat_page_languages, function (lg, pages) {
              $.each(pages, function (i) {
                var v = $('#post_parent option[value="' + lmat_page_languages[lg][i] + '"]');
                lang == lg ? v.show() : v.hide();
              });
            });
          }
        }
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var table = document.getElementById('the-list');
  if (!table) {
    return;
  }
  var config = {
    childList: true,
    subtree: true
  };
  var observer = new MutationObserver(handleQuickEditInsertion);
  observer.observe(table, config);
});

/**
 * Update rows of translated posts when the language is modified in quick edit
 * Acts on ajaxSuccess event
 */
jQuery(function ($) {
  $(document).ajaxSuccess(function (event, xhr, settings) {
    function update_rows(post_id) {
      // collect old translations
      var translations = new Array();
      $('.translation_' + post_id).each(function () {
        translations.push($(this).parent().parent().attr('id').substring(5));
      });
      var data = {
        action: 'lmat_update_post_rows',
        post_id: post_id,
        translations: translations.join(','),
        post_type: $("input[name='post_type']").val(),
        screen: $("input[name='screen']").val(),
        _lmat_nonce: $("input[name='_inline_edit']").val() // reuse quick edit nonce
      };

      // get the modified rows in ajax and update them
      $.post(ajaxurl, data, function (response) {
        if (response) {
          // Since WP changeset #52710 parseAjaxResponse() return content to notice the user in a HTML tag with ajax-response id.
          // Not to disturb this behaviour by executing another ajax request in the ajaxSuccess event, we need to target another unexisting id.
          var res = wpAjax.parseAjaxResponse(response, 'lmat-ajax-response');
          $.each(res.responses, function () {
            if ('row' == this.what) {
              // data is built with a call to WP_Posts_List_Table::single_row method
              // which uses internally other WordPress methods which escape correctly values.
              // For Linguator language columns the HTML code is correctly escaped in LMAT_Admin_Filters_Columns::post_column method.
              $("#post-" + this.supplemental.post_id).replaceWith(this.data); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.replaceWith
            }
          });
        }
      });
    }
    if ('string' == typeof settings.data) {
      // Need to check the type due to block editor sometime sending FormData objects
      var data = wpAjax.unserialize(settings.data); // what were the data sent by the ajax request?
      if ('undefined' != typeof data['action'] && 'inline-save' == data['action']) {
        update_rows(data['post_ID']);
      }
    }
  });
});
/******/ })()
;