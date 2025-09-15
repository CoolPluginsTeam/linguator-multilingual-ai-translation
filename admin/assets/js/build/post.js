/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Assets/js/src/post.js":
/*!*******************************!*\
  !*** ./Assets/js/src/post.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\nfunction _createForOfIteratorHelper(r, e) { var t = \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && \"number\" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\n/**\r\n * @package Linguator\r\n */\n\n/**\r\n * Tag suggest in quick edit\r\n */\njQuery(function ($) {\n  $.ajaxPrefilter(function (options, originalOptions, jqXHR) {\n    if ('string' === typeof options.data && -1 !== options.data.indexOf('action=ajax-tag-search') && (lang = $(':input[name=\"inline_lang_choice\"]').val())) {\n      options.data = 'lang=' + lang + '&' + options.data;\n    }\n  });\n});\n\n/**\r\n * Quick edit\r\n */\njQuery(function ($) {\n  var handleQuickEditInsertion = function handleQuickEditInsertion(mutationsList) {\n    var _iterator = _createForOfIteratorHelper(mutationsList),\n      _step;\n    try {\n      var _loop = function _loop() {\n        var mutation = _step.value;\n        var addedNodes = Array.from(mutation.addedNodes).filter(function (el) {\n          return el.nodeType === Node.ELEMENT_NODE;\n        });\n        var form = addedNodes[0];\n        if (0 < mutation.addedNodes.length && form.classList.contains('inline-editor')) {\n          // WordPress has inserted the quick edit form.\n          var post_id = Number(form.id.substring(5));\n          if (post_id > 0) {\n            // Get the language dropdown.\n            var select = form.querySelector('select[name=\"inline_lang_choice\"]');\n            var _lang = document.querySelector('#lang_' + String(post_id)).innerHTML;\n            select.value = _lang; // Populates the dropdown with the post language.\n\n            filter_terms(_lang); // Initial filter for category checklist.\n            filter_pages(_lang); // Initial filter for parent dropdown.\n\n            // Modify category checklist and parent dropdown on language change.\n            select.addEventListener('change', function (event) {\n              var newLang = event.target.value;\n              filter_terms(newLang);\n              filter_pages(newLang);\n            });\n          }\n        }\n        /**\r\n         * Filters the category checklist.\r\n         */\n        function filter_terms(lang) {\n          if (\"undefined\" != typeof lmat_term_languages) {\n            $.each(lmat_term_languages, function (lg, term_tax) {\n              $.each(term_tax, function (tax, terms) {\n                $.each(terms, function (i) {\n                  id = '#' + tax + '-' + lmat_term_languages[lg][tax][i];\n                  lang == lg ? $(id).show() : $(id).hide();\n                });\n              });\n            });\n          }\n        }\n\n        /**\r\n         * Filters the parent page dropdown list.\r\n         */\n        function filter_pages(lang) {\n          if (\"undefined\" != typeof lmat_page_languages) {\n            $.each(lmat_page_languages, function (lg, pages) {\n              $.each(pages, function (i) {\n                v = $('#post_parent option[value=\"' + lmat_page_languages[lg][i] + '\"]');\n                lang == lg ? v.show() : v.hide();\n              });\n            });\n          }\n        }\n      };\n      for (_iterator.s(); !(_step = _iterator.n()).done;) {\n        _loop();\n      }\n    } catch (err) {\n      _iterator.e(err);\n    } finally {\n      _iterator.f();\n    }\n  };\n  var table = document.getElementById('the-list');\n  if (!table) {\n    return;\n  }\n  var config = {\n    childList: true,\n    subtree: true\n  };\n  var observer = new MutationObserver(handleQuickEditInsertion);\n  observer.observe(table, config);\n});\n\n/**\r\n * Update rows of translated posts when the language is modified in quick edit\r\n * Acts on ajaxSuccess event\r\n */\njQuery(function ($) {\n  $(document).ajaxSuccess(function (event, xhr, settings) {\n    function update_rows(post_id) {\n      // collect old translations\n      var translations = new Array();\n      $('.translation_' + post_id).each(function () {\n        translations.push($(this).parent().parent().attr('id').substring(5));\n      });\n      var data = {\n        action: 'lmat_update_post_rows',\n        post_id: post_id,\n        translations: translations.join(','),\n        post_type: $(\"input[name='post_type']\").val(),\n        screen: $(\"input[name='screen']\").val(),\n        _lmat_nonce: $(\"input[name='_inline_edit']\").val() // reuse quick edit nonce\n      };\n\n      // get the modified rows in ajax and update them\n      $.post(ajaxurl, data, function (response) {\n        if (response) {\n          // Since WP changeset #52710 parseAjaxResponse() return content to notice the user in a HTML tag with ajax-response id.\n          // Not to disturb this behaviour by executing another ajax request in the ajaxSuccess event, we need to target another unexisting id.\n          var res = wpAjax.parseAjaxResponse(response, 'lmat-ajax-response');\n          $.each(res.responses, function () {\n            if ('row' == this.what) {\n              // data is built with a call to WP_Posts_List_Table::single_row method\n              // which uses internally other WordPress methods which escape correctly values.\n              // For Linguator language columns the HTML code is correctly escaped in LMAT_Admin_Filters_Columns::post_column method.\n              $(\"#post-\" + this.supplemental.post_id).replaceWith(this.data); // phpcs:ignore WordPressVIPMinimum.JS.HTMLExecutingFunctions.replaceWith\n            }\n          });\n        }\n      });\n    }\n    if ('string' == typeof settings.data) {\n      // Need to check the type due to block editor sometime sending FormData objects\n      var data = wpAjax.unserialize(settings.data); // what were the data sent by the ajax request?\n      if ('undefined' != typeof data['action'] && 'inline-save' == data['action']) {\n        update_rows(data['post_ID']);\n      }\n    }\n  });\n});\n\n//# sourceURL=webpack://linguator-multilingual-ai-translation/./Assets/js/src/post.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./Assets/js/src/post.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;