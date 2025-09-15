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

/***/ "./Assets/js/src/editors/site.js":
/*!***************************************!*\
  !*** ./Assets/js/src/editors/site.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/plugins */ \"@wordpress/plugins\");\n/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ \"@wordpress/i18n\");\n/* harmony import */ var _wordpress_edit_site__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/edit-site */ \"@wordpress/edit-site\");\n/**\r\n * Site Editor sidebar bootstrap\r\n */\n\n\n\n\nvar SIDEBAR_NAME = 'lmat-site-sidebar';\nvar Sidebar = function Sidebar() {\n  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_edit_site__WEBPACK_IMPORTED_MODULE_2__.PluginSidebarMoreMenuItem, {\n    target: SIDEBAR_NAME\n  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Languages', 'linguator-multilingual-ai-translation')), /*#__PURE__*/React.createElement(_wordpress_edit_site__WEBPACK_IMPORTED_MODULE_2__.PluginSidebar, {\n    name: SIDEBAR_NAME,\n    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Languages', 'linguator-multilingual-ai-translation')\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    className: \"lmat-sidebar-section\"\n  }, /*#__PURE__*/React.createElement(\"p\", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Linguator sidebar (Site Editor)', 'linguator-multilingual-ai-translation')))));\n};\n(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__.registerPlugin)(SIDEBAR_NAME, {\n  render: Sidebar\n});\n\n//# sourceURL=webpack://linguator-multilingual-ai-translation/./Assets/js/src/editors/site.js?\n}");

/***/ }),

/***/ "@wordpress/edit-site":
/*!**********************************!*\
  !*** external ["wp","editSite"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["editSite"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/plugins":
/*!*********************************!*\
  !*** external ["wp","plugins"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["plugins"];

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
/******/ 	var __webpack_exports__ = __webpack_require__("./Assets/js/src/editors/site.js");
/******/ 	
/******/ })()
;