/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * @package Linguator
 */

/**
 * Quick edit
 */
jQuery(function ($) {
  var handleQuickEditInsertion = function handleQuickEditInsertion(mutationsList) {
    var _iterator = _createForOfIteratorHelper(mutationsList),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var mutation = _step.value;
        var addedNodes = Array.from(mutation.addedNodes).filter(function (el) {
          return el.nodeType === Node.ELEMENT_NODE;
        });
        var form = addedNodes[0];
        if (0 < mutation.addedNodes.length && form.classList.contains('inline-edit-row')) {
          // WordPress has inserted the quick edit form.
          var term_id = Number(form.id.substring(5));
          if (term_id > 0) {
            var _document$querySelect;
            // Get the language dropdown.
            var select = form.querySelector('select[name="inline_lang_choice"]');
            var lang = document.querySelector('#lang_' + String(term_id)).innerHTML;
            select.value = lang; // Populates the dropdown with the post language.

            // Disable the language dropdown for default categories.
            var default_cat = (_document$querySelect = document.querySelector("#default_cat_".concat(term_id))) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.innerHTML;
            if (term_id == default_cat) {
              select.disabled = true;
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var table = document.getElementById('the-list');
  if (null !== table) {
    // Ensure the table is displayed before listening to any change.
    var config = {
      childList: true,
      subtree: true
    };
    var observer = new MutationObserver(handleQuickEditInsertion);
    observer.observe(table, config);
  }
});

/**
 * Update rows of translated terms when adding / deleting a translation or when the language is modified in quick edit.
 * Acts on ajaxSuccess event.
 */
jQuery(function ($) {
  $(document).ajaxSuccess(function (event, xhr, settings) {
    function update_rows(term_id) {
      // collect old translations
      var translations = new Array();
      $('.translation_' + term_id).each(function () {
        translations.push($(this).parent().parent().attr('id').substring(4));
      });
      var data = {
        action: 'lmat_update_term_rows',
        term_id: term_id,
        translations: translations.join(','),
        taxonomy: $("input[name='taxonomy']").val(),
        post_type: $("input[name='post_type']").val(),
        screen: $("input[name='screen']").val(),
        _lmat_nonce: $('#_lmat_nonce').val()
      };

      // get the modified rows in ajax and update them
      $.post(ajaxurl, data, function (response) {
        if (response) {
          // Target a non existing WP HTML id to avoid a conflict with WP ajax requests.
          var res = wpAjax.parseAjaxResponse(response, 'lmat-ajax-response');
          $.each(res.responses, function () {
            if ('row' == this.what) {
              // data is built with a call to WP_Terms_List_Table::single_row method
              // which uses internally other WordPress methods which escape correctly values.
              // For Linguator language columns the HTML code is correctly escaped in LMAT_Admin_Filters_Columns::term_column method.
              $("#tag-" + this.supplemental.term_id).replaceWith(this.data); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.replaceWith
            }
          });
        }
      });
    }
    var data = wpAjax.unserialize(settings.data); // what were the data sent by the ajax request?
    if ('undefined' != typeof data['action']) {
      switch (data['action']) {
        // when adding a term, the new term_id is in the ajax response
        case 'add-tag':
          // Target a non existing WP HTML id to avoid a conflict with WP ajax requests.
          var res = wpAjax.parseAjaxResponse(xhr.responseXML, 'lmat-ajax-response');
          $.each(res.responses, function () {
            if ('term' == this.what) {
              update_rows(this.supplemental.term_id);
            }
          });

          // and also reset translations hidden input fields
          $('.htr_lang').val(0);
          break;

        // when deleting a term
        case 'delete-tag':
          update_rows(data['tag_ID']);
          break;

        // in case the language is modified in quick edit and breaks translations
        case 'inline-save-tax':
          update_rows(data['tax_ID']);
          break;
      }
    }
  });
});
jQuery(function ($) {
  // translations autocomplete input box
  function init_translations() {
    $('.tr_lang').each(function () {
      var tr_lang = $(this).attr('id').substring(8);
      var td = $(this).parent().parent().siblings('.lmat-edit-column');
      $(this).autocomplete({
        minLength: 0,
        source: ajaxurl + '?action=lmat_terms_not_translated' + '&term_language=' + $('#term_lang_choice').val() + '&term_id=' + $("input[name='tag_ID']").val() + '&taxonomy=' + $("input[name='taxonomy']").val() + '&translation_language=' + tr_lang + '&post_type=' + typenow + '&_lmat_nonce=' + $('#_lmat_nonce').val(),
        select: function select(event, ui) {
          $('#htr_lang_' + tr_lang).val(ui.item.id);
          // ui.item.link is built and come from server side and is well escaped when necessary
          td.html(ui.item.link); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.html
        }
      });

      // when the input box is emptied
      $(this).on('blur', function () {
        if (!$(this).val()) {
          $('#htr_lang_' + tr_lang).val(0);
          // Value is retrieved from HTML already generated server side
          td.html(td.siblings('.hidden').children().clone()); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.html
        }
      });
    });
  }
  init_translations();

  // ajax for changing the term's language
  $('#term_lang_choice').on('change', function () {
    var value = $(this).val();
    // The selected option in the dropdown list.
    var selectedOption = event.target;
    var data = {
      action: 'lmat_term_lang_choice',
      lang: value,
      from_tag: $("input[name='from_tag']").val(),
      term_id: $("input[name='tag_ID']").val(),
      taxonomy: $("input[name='taxonomy']").val(),
      post_type: typenow,
      _lmat_nonce: $('#_lmat_nonce').val()
    };
    $.post(ajaxurl, data, function (response) {
      // Target a non existing WP HTML id to avoid a conflict with WP ajax requests.
      var res = wpAjax.parseAjaxResponse(response, 'lmat-ajax-response');
      $.each(res.responses, function () {
        switch (this.what) {
          case 'translations':
            // translations fields
            // Data is built and come from server side and is well escaped when necessary
            $("#term-translations").html(this.data); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.html
            init_translations();
            break;
          case 'parent':
            // parent dropdown list for hierarchical taxonomies
            // data correctly escaped in LMAT_Admin_Filters_Term::term_lang_choice method which uses wp_dropdown_categories function.
            $('#parent').replaceWith(this.data); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.replaceWith
            break;
          case 'tag_cloud':
            // popular items
            // data correctly escaped in LMAT_Admin_Filters_Term::term_lang_choice method which uses wp_tag_cloud and wp_generate_tag_cloud functions.
            $('.tagcloud').replaceWith(this.data); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.replaceWith
            break;
          case 'flag':
            // flag in front of the select dropdown
            // Data is built and come from server side and is well escaped when necessary
            $('.lmat-select-flag').html(this.data); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.html
            break;
        }
      });

      // Creates an event once the language has been successfully changed.
      var onTermLangChoice = new CustomEvent("onTermLangChoice", {
        detail: {
          lang: JSON.parse(selectedOption.options[selectedOption.options.selectedIndex].getAttribute('data-lang'))
        }
      });
      document.dispatchEvent(onTermLangChoice);
    });
  });

  // Listen to `onTermLangChoice` to perform actions after the language has been changed.
  document.addEventListener('onTermLangChoice', function (e) {
    // Modifies the text direction.
    var dir = e.detail.lang.is_rtl ? 'rtl' : 'ltr';
    $('body').removeClass('lmat-dir-rtl').removeClass('lmat-dir-ltr').addClass('lmat-dir-' + dir);
  });
});
/******/ })()
;