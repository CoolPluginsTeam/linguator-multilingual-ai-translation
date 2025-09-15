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

/***/ "./Assets/js/src/admin.js":
/*!********************************!*\
  !*** ./Assets/js/src/admin.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_ajax_filter_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/ajax-filter/index.js */ \"./Assets/js/src/lib/ajax-filter/index.js\");\nvar _lmat_admin;\n/**\r\n * @package Linguator\r\n */\n\n\n(0,_lib_ajax_filter_index_js__WEBPACK_IMPORTED_MODULE_0__.ajaxFilter)((_lmat_admin = lmat_admin) === null || _lmat_admin === void 0 ? void 0 : _lmat_admin.ajax_filter);\n\n//# sourceURL=webpack://linguator-multilingual-ai-translation/./Assets/js/src/admin.js?\n}");

/***/ }),

/***/ "./Assets/js/src/lib/ajax-filter/index.js":
/*!************************************************!*\
  !*** ./Assets/js/src/lib/ajax-filter/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ajaxFilter: () => (/* binding */ ajaxFilter)\n/* harmony export */ });\n/**\r\n * @package Linguator\r\n */\n\n/**\r\n * Adds data to all ajax requests made with jQuery.\r\n *\r\n * @since 3.7\r\n *\r\n * @param {Object} data The data to add.\r\n * @returns {void}\r\n */\nfunction ajaxFilter(data) {\n  if ('undefined' === typeof jQuery || !data) {\n    return;\n  }\n  var dataStr = jQuery.param(data);\n  jQuery.ajaxPrefilter(function (options) {\n    if (-1 === options.url.indexOf(ajaxurl) && -1 === ajaxurl.indexOf(options.url)) {\n      return;\n    }\n    if ('undefined' === typeof options.data || null === options.data || 'string' === typeof options.data && '' === options.data.trim()) {\n      // An empty string or null/undefined.\n      options.data = dataStr;\n    } else if ('string' === typeof options.data) {\n      // A non-empty string: can be a JSON string or a query string.\n      try {\n        options.data = JSON.stringify(Object.assign(JSON.parse(options.data), data));\n      } catch (exception) {\n        // A non-empty non-JSON string is considered a query string.\n        options.data = \"\".concat(options.data, \"&\").concat(dataStr);\n      }\n    } else if (jQuery.isPlainObject(options.data)) {\n      // An object.\n      options.data = Object.assign(options.data, data);\n    }\n  });\n}\n\n//# sourceURL=webpack://linguator-multilingual-ai-translation/./Assets/js/src/lib/ajax-filter/index.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
/******/ 	var __webpack_exports__ = __webpack_require__("./Assets/js/src/admin.js");
/******/ 	
/******/ })()
;