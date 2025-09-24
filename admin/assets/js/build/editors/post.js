/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// external ["wp","plugins"]
const external_wp_plugins_namespaceObject = window["wp"]["plugins"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceObject = window["wp"]["i18n"];
;// external ["wp","editPost"]
const external_wp_editPost_namespaceObject = window["wp"]["editPost"];
;// external ["wp","components"]
const external_wp_components_namespaceObject = window["wp"]["components"];
;// external ["wp","apiFetch"]
const external_wp_apiFetch_namespaceObject = window["wp"]["apiFetch"];
;// external ["wp","element"]
const external_wp_element_namespaceObject = window["wp"]["element"];
;// external ["wp","data"]
const external_wp_data_namespaceObject = window["wp"]["data"];
;// external "React"
const external_React_namespaceObject = window["React"];
;// ./node_modules/lucide-react/dist/esm/shared/src/utils.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};


//# sourceMappingURL=utils.js.map

;// ./node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};


//# sourceMappingURL=defaultAttributes.js.map

;// ./node_modules/lucide-react/dist/esm/Icon.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const Icon = (0,external_React_namespaceObject.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => (0,external_React_namespaceObject.createElement)(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => (0,external_React_namespaceObject.createElement)(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);


//# sourceMappingURL=Icon.js.map

;// ./node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const createLucideIcon = (iconName, iconNode) => {
  const Component = (0,external_React_namespaceObject.forwardRef)(
    ({ className, ...props }, ref) => (0,external_React_namespaceObject.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};


//# sourceMappingURL=createLucideIcon.js.map

;// ./node_modules/lucide-react/dist/esm/icons/square-pen.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);


//# sourceMappingURL=square-pen.js.map

;// ./node_modules/lucide-react/dist/esm/icons/circle-plus.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const circle_plus_iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", circle_plus_iconNode);


//# sourceMappingURL=circle-plus.js.map

;// ./Assets/js/src/editors/post.js
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * Post Editor sidebar bootstrap
 */









var SIDEBAR_NAME = 'lmat-post-sidebar';

/**
 * Simple debounce hook
 */
var useDebouncedCallback = function useDebouncedCallback(callback) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
  var timer = (0,external_wp_element_namespaceObject.useRef)(null);
  var cbRef = (0,external_wp_element_namespaceObject.useRef)(callback);
  cbRef.current = callback;
  var debounced = (0,external_wp_element_namespaceObject.useCallback)(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(function () {
      cbRef.current.apply(cbRef, args);
    }, delay);
  }, [delay]);

  // optional: clear on unmount
  var cancel = (0,external_wp_element_namespaceObject.useCallback)(function () {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  return [debounced, cancel];
};
var getSettings = function getSettings() {
  // Provided by PHP in Abstract_Screen::enqueue via wp_add_inline_script
  try {
    // eslint-disable-next-line no-undef
    if (typeof lmat_block_editor_plugin_settings !== 'undefined') {
      // eslint-disable-next-line no-undef
      return lmat_block_editor_plugin_settings;
    }
  } catch (e) {}
  if (typeof window !== 'undefined' && window.lmat_block_editor_plugin_settings) {
    return window.lmat_block_editor_plugin_settings;
  }
  return {
    lang: null,
    translations_table: {}
  };
};
var LanguageSection = function LanguageSection(_ref) {
  var lang = _ref.lang,
    allLanguages = _ref.allLanguages;
  var options = (0,external_wp_element_namespaceObject.useMemo)(function () {
    var list = [];
    if (lang) {
      list.push({
        label: lang.name,
        value: lang.slug,
        flag_url: lang.flag_url
      });
    }
    Object.values(allLanguages).forEach(function (row) {
      list.push({
        label: row.lang.name,
        value: row.lang.slug,
        flag_url: row.lang.flag_url
      });
    });
    return list;
  }, [lang, allLanguages]);
  return /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
    title: (0,external_wp_i18n_namespaceObject.__)('Language', 'linguator-multilingual-ai-translation'),
    initialOpen: true
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Flex, {
    align: "center"
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.FlexItem, null, lang !== null && lang !== void 0 && lang.flag_url ? /*#__PURE__*/React.createElement("img", {
    src: lang.flag_url,
    alt: (lang === null || lang === void 0 ? void 0 : lang.name) || '',
    className: "flag",
    style: {
      marginRight: 8,
      width: 20,
      height: 14
    }
  }) : null), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.FlexItem, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
    label: undefined,
    value: (lang === null || lang === void 0 ? void 0 : lang.slug) || '',
    onChange: function onChange(value) {
      // If selecting the current language, do nothing.
      if (!value || lang && value === lang.slug) {
        return;
      }
      // Look up the selected language row in translations table
      var selected = allLanguages === null || allLanguages === void 0 ? void 0 : allLanguages[value];
      if (selected && selected.links) {
        var target = selected.links.edit_link || selected.links.add_link;
        if (target) {
          window.location.href = target;
        }
      }
    },
    help: undefined,
    options: options.map(function (opt) {
      return {
        label: opt.label,
        value: opt.value
      };
    })
    // Changing language navigates to the corresponding edit/add page.
  }))));
};
var TranslationRow = function TranslationRow(_ref2) {
  var row = _ref2.row;
  var lang = row.lang,
    translated_post = row.translated_post,
    links = row.links;
  var initialTitle = (translated_post === null || translated_post === void 0 ? void 0 : translated_post.title) || '';
  var _useState = (0,external_wp_element_namespaceObject.useState)(initialTitle),
    _useState2 = _slicedToArray(_useState, 2),
    title = _useState2[0],
    setTitle = _useState2[1];
  var _useState3 = (0,external_wp_element_namespaceObject.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    saving = _useState4[0],
    setSaving = _useState4[1];
  var _useState5 = (0,external_wp_element_namespaceObject.useState)(''),
    _useState6 = _slicedToArray(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  var _useState7 = (0,external_wp_element_namespaceObject.useState)([]),
    _useState8 = _slicedToArray(_useState7, 2),
    allPages = _useState8[0],
    setAllPages = _useState8[1];
  var _useState9 = (0,external_wp_element_namespaceObject.useState)(false),
    _useState0 = _slicedToArray(_useState9, 2),
    loadingPages = _useState0[0],
    setLoadingPages = _useState0[1];
  var _useState1 = (0,external_wp_element_namespaceObject.useState)([]),
    _useState10 = _slicedToArray(_useState1, 2),
    suggestions = _useState10[0],
    setSuggestions = _useState10[1];
  var _useState11 = (0,external_wp_element_namespaceObject.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    selectedSuggestion = _useState12[0],
    setSelectedSuggestion = _useState12[1];
  var _useState13 = (0,external_wp_element_namespaceObject.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    linking = _useState14[0],
    setLinking = _useState14[1];
  var editable = !initialTitle; // editable only if there is no value initially

  // Debounced save
  var _useDebouncedCallback = useDebouncedCallback(/*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(nextTitle) {
        var clean, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              // Guard: don’t send empty or whitespace-only titles
              clean = (nextTitle || '').trim();
              if (clean) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              _context.p = 1;
              setSaving(true);
              setError('');

              // Example payload — adjust to match your PHP route/handler.
              // Expect your server to create/update a placeholder translation record’s title.
              _context.n = 2;
              return external_wp_apiFetch_namespaceObject({
                path: '/lmat/v1/translation-title',
                method: 'POST',
                data: {
                  postId: (translated_post === null || translated_post === void 0 ? void 0 : translated_post.id) || null,
                  // if you have it
                  lang: lang === null || lang === void 0 ? void 0 : lang.slug,
                  title: clean
                }
              });
            case 2:
              setSaving(false);
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              setSaving(false);
              setError((0,external_wp_i18n_namespaceObject.__)('Failed to save title. Please try again.', 'linguator-multilingual-ai-translation'));
              // Optional: console.error(e);
            case 4:
              return _context.a(2);
          }
        }, _callee, null, [[1, 3]]);
      }));
      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }(), 2000),
    _useDebouncedCallback2 = _slicedToArray(_useDebouncedCallback, 1),
    debouncedSave = _useDebouncedCallback2[0];
  var hasEdit = !!(links !== null && links !== void 0 && links.edit_link);
  var hasAdd = !!(links !== null && links !== void 0 && links.add_link);
  var loadAllPages = (0,external_wp_element_namespaceObject.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var pages, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          if (!(loadingPages || allPages.length > 0)) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2);
        case 1:
          _context2.p = 1;
          setLoadingPages(true);
          _context2.n = 2;
          return external_wp_apiFetch_namespaceObject({
            path: '/lmat/v1/languages/utils/get_all_pages_data'
          });
        case 2:
          pages = _context2.v;
          setAllPages(Array.isArray(pages) ? pages : []);
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
        case 4:
          _context2.p = 4;
          setLoadingPages(false);
          return _context2.f(4);
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 3, 4, 5]]);
  })), [loadingPages, allPages.length]);
  var computeSuggestions = (0,external_wp_element_namespaceObject.useCallback)(function (query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) return [];
    return allPages.filter(function (p) {
      var _p$language;
      var sameLang = (p === null || p === void 0 || (_p$language = p.language) === null || _p$language === void 0 ? void 0 : _p$language.slug) === (lang === null || lang === void 0 ? void 0 : lang.slug);
      var unlinked = !(p !== null && p !== void 0 && p.is_linked);
      var matches = ((p === null || p === void 0 ? void 0 : p.title) || '').toLowerCase().includes(q) || ((p === null || p === void 0 ? void 0 : p.slug) || '').toLowerCase().includes(q);
      return sameLang && unlinked && matches;
    }).slice(0, 10);
  }, [allPages, lang === null || lang === void 0 ? void 0 : lang.slug]);
  var handleTitleChange = function handleTitleChange(val) {
    setTitle(val);
    setSelectedSuggestion(null);
    if (editable) {
      if (val && val.trim().length > 1) {
        if (allPages.length === 0) {
          loadAllPages().then(function () {
            setSuggestions(computeSuggestions(val));
          });
        } else {
          setSuggestions(computeSuggestions(val));
        }
      } else {
        setSuggestions([]);
      }
    }
  };
  var linkSelected = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
      var _select, _select$getCurrentPos, postId, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            e.preventDefault();
            if (selectedSuggestion) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            _context3.p = 1;
            setLinking(true);
            setError('');
            postId = (_select = (0,external_wp_data_namespaceObject.select)('core/editor')) === null || _select === void 0 || (_select$getCurrentPos = _select.getCurrentPostId) === null || _select$getCurrentPos === void 0 ? void 0 : _select$getCurrentPos.call(_select);
            _context3.n = 2;
            return external_wp_apiFetch_namespaceObject({
              path: '/lmat/v1/languages/link-translation',
              method: 'POST',
              data: {
                source_id: postId,
                target_id: selectedSuggestion.ID,
                target_lang: lang === null || lang === void 0 ? void 0 : lang.slug
              }
            });
          case 2:
            window.location.reload();
            _context3.n = 4;
            break;
          case 3:
            _context3.p = 3;
            _t3 = _context3.v;
            setError((0,external_wp_i18n_namespaceObject.__)('Failed to link page. Please try again.', 'linguator-multilingual-ai-translation'));
          case 4:
            _context3.p = 4;
            setLinking(false);
            return _context3.f(4);
          case 5:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 3, 4, 5]]);
    }));
    return function linkSelected(_x2) {
      return _ref5.apply(this, arguments);
    };
  }();
  var createFromTyped = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(e) {
      var clean, _select2, _select2$getCurrentPo, _select3, _select3$getCurrentPo, postId, postType, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            e.preventDefault();
            clean = (title || '').trim();
            if (clean) {
              _context4.n = 1;
              break;
            }
            // Fallback: if no title, navigate to add page
            if (links !== null && links !== void 0 && links.add_link) {
              window.location.href = links.add_link;
            }
            return _context4.a(2);
          case 1:
            _context4.p = 1;
            setLinking(true);
            setError('');
            postId = (_select2 = (0,external_wp_data_namespaceObject.select)('core/editor')) === null || _select2 === void 0 || (_select2$getCurrentPo = _select2.getCurrentPostId) === null || _select2$getCurrentPo === void 0 ? void 0 : _select2$getCurrentPo.call(_select2);
            postType = (_select3 = (0,external_wp_data_namespaceObject.select)('core/editor')) === null || _select3 === void 0 || (_select3$getCurrentPo = _select3.getCurrentPostType) === null || _select3$getCurrentPo === void 0 ? void 0 : _select3$getCurrentPo.call(_select3);
            _context4.n = 2;
            return external_wp_apiFetch_namespaceObject({
              path: '/lmat/v1/languages/create-translation',
              method: 'POST',
              data: {
                source_id: postId,
                target_lang: lang === null || lang === void 0 ? void 0 : lang.slug,
                title: clean,
                post_type: postType || 'page'
              }
            });
          case 2:
            // Refresh to reflect new translation and show Edit icon
            window.location.reload();
            _context4.n = 4;
            break;
          case 3:
            _context4.p = 3;
            _t4 = _context4.v;
            setError((0,external_wp_i18n_namespaceObject.__)('Failed to create page. Please try again.', 'linguator-multilingual-ai-translation'));
          case 4:
            _context4.p = 4;
            setLinking(false);
            return _context4.f(4);
          case 5:
            return _context4.a(2);
        }
      }, _callee4, null, [[1, 3, 4, 5]]);
    }));
    return function createFromTyped(_x3) {
      return _ref6.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Flex, {
    align: "center",
    style: {
      marginBottom: 8,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.FlexItem, {
    style: {
      paddingTop: '14px'
    }
  }, lang !== null && lang !== void 0 && lang.flag_url ? /*#__PURE__*/React.createElement("img", {
    src: lang.flag_url,
    alt: (lang === null || lang === void 0 ? void 0 : lang.name) || '',
    style: {
      width: 20,
      height: 14
    }
  }) : null), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.FlexItem, {
    style: {
      flex: 1,
      padding: '0px'
    }
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.TextControl, {
    value: title,
    onChange: handleTitleChange,
    placeholder: (0,external_wp_i18n_namespaceObject.__)('title', 'linguator-multilingual-ai-translation'),
    readOnly: !editable,
    disabled: !editable,
    help: editable ? saving ? (0,external_wp_i18n_namespaceObject.__)('Saving…', 'linguator-multilingual-ai-translation') : (0,external_wp_i18n_namespaceObject.__)('Type title to save translation.', 'linguator-multilingual-ai-translation') : (0,external_wp_i18n_namespaceObject.__)('Modify title via Edit.', 'linguator-multilingual-ai-translation')
  })), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.FlexItem, {
    style: {
      paddingTop: '14px'
    }
  }, hasEdit ? /*#__PURE__*/React.createElement("a", {
    href: links.edit_link,
    "aria-label": (0,external_wp_i18n_namespaceObject.__)('Edit translation', 'linguator-multilingual-ai-translation'),
    style: {
      marginLeft: 8,
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(SquarePen, {
    size: 20
  })) : null, !hasEdit && (selectedSuggestion ? /*#__PURE__*/React.createElement("button", {
    onClick: linkSelected,
    "aria-label": (0,external_wp_i18n_namespaceObject.__)('Link existing page', 'linguator-multilingual-ai-translation'),
    style: {
      marginLeft: 8,
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(CirclePlus, {
    size: 20
  })) : hasAdd ? (title || '').trim().length > 0 ? /*#__PURE__*/React.createElement("button", {
    onClick: createFromTyped,
    "aria-label": (0,external_wp_i18n_namespaceObject.__)('Create translation from typed title', 'linguator-multilingual-ai-translation'),
    style: {
      marginLeft: 8,
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(CirclePlus, {
    size: 20
  })) : /*#__PURE__*/React.createElement("a", {
    href: links.add_link,
    "aria-label": (0,external_wp_i18n_namespaceObject.__)('Add translation', 'linguator-multilingual-ai-translation'),
    style: {
      marginLeft: 8,
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(CirclePlus, {
    size: 20
  })) : null), saving || linking ? /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Spinner, {
    style: {
      marginLeft: 8
    }
  }) : null)), editable && suggestions.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, suggestions.map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.ID,
      style: {
        padding: '4px 6px',
        cursor: 'pointer',
        background: (selectedSuggestion === null || selectedSuggestion === void 0 ? void 0 : selectedSuggestion.ID) === s.ID ? '#eef' : 'transparent'
      },
      onClick: function onClick() {
        return setSelectedSuggestion(s);
      },
      onMouseEnter: function onMouseEnter() {
        return setSelectedSuggestion(s);
      }
    }, s.title, " (", s.slug, ")");
  })) : null, error ? /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Notice, {
    status: "error",
    isDismissible: false
  }, error) : null);
};
var TranslationsSection = function TranslationsSection(_ref7) {
  var translations = _ref7.translations;
  var rows = Object.values(translations);
  return /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
    title: (0,external_wp_i18n_namespaceObject.__)('Translations', 'linguator-multilingual-ai-translation'),
    initialOpen: true
  }, rows.map(function (row) {
    return /*#__PURE__*/React.createElement(TranslationRow, {
      key: row.lang.slug,
      row: row
    });
  }));
};
var Sidebar = function Sidebar() {
  var settings = getSettings();
  var lang = (settings === null || settings === void 0 ? void 0 : settings.lang) || null;
  var translations = (settings === null || settings === void 0 ? void 0 : settings.translations_table) || {};
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(external_wp_editPost_namespaceObject.PluginSidebarMoreMenuItem, {
    target: SIDEBAR_NAME
  }, (0,external_wp_i18n_namespaceObject.__)('Linguator', 'linguator-multilingual-ai-translation')), /*#__PURE__*/React.createElement(external_wp_editPost_namespaceObject.PluginSidebar, {
    name: SIDEBAR_NAME,
    title: (0,external_wp_i18n_namespaceObject.__)('Linguator', 'linguator-multilingual-ai-translation')
  }, /*#__PURE__*/React.createElement(LanguageSection, {
    lang: lang,
    allLanguages: translations
  }), /*#__PURE__*/React.createElement(TranslationsSection, {
    translations: translations
  })));
};

// Compute a dynamic icon element for the flag pin
var FlagIcon = function () {
  var settings = getSettings();
  var lang = (settings === null || settings === void 0 ? void 0 : settings.lang) || null;
  if (lang !== null && lang !== void 0 && lang.flag_url) {
    return /*#__PURE__*/React.createElement("img", {
      src: lang.flag_url,
      alt: (lang === null || lang === void 0 ? void 0 : lang.name) || '',
      style: {
        width: 16,
        height: 11
      }
    });
  }
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "11",
    viewBox: "0 0 16 11"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "16",
    height: "11",
    fill: "#ddd"
  }));
}();
(0,external_wp_plugins_namespaceObject.registerPlugin)(SIDEBAR_NAME, {
  render: Sidebar,
  icon: FlagIcon
});

// Auto-open sidebar logic using editor ready event
var subscribe = wp.data.subscribe;

// Check for lang parameter and auto-open sidebar
var params = new URLSearchParams(window.location.search);
var hasLangParam = params.has('lang') || params.has('new_lang');
if (hasLangParam) {
  var unsubscribe = null;
  var attempts = 0;
  var maxAttempts = 50;
  var sidebarOpened = false;
  var tryOpenSidebar = function tryOpenSidebar() {
    attempts++;
    if (sidebarOpened) {
      return true;
    }
    try {
      var editPostStore = wp.data.select('core/edit-post');
      var editPostDispatch = wp.data.dispatch('core/edit-post');
      if (!editPostStore || !editPostDispatch) {
        return false;
      }

      // Try modern interface store if edit-post doesn't work
      var interfaceStore = wp.data.select('core/interface');
      var interfaceDispatch = wp.data.dispatch('core/interface');
      var target = "plugin-sidebar/".concat(SIDEBAR_NAME);

      // Try multiple approaches to open the sidebar
      var openSuccess = false;

      // Method 1: Standard openGeneralSidebar
      if (typeof editPostDispatch.openGeneralSidebar === 'function') {
        try {
          // Close any existing sidebar first
          if (typeof editPostDispatch.closeGeneralSidebar === 'function') {
            editPostDispatch.closeGeneralSidebar();
          }

          // Close inserter if open
          if (typeof editPostDispatch.setIsInserterOpened === 'function') {
            editPostDispatch.setIsInserterOpened(false);
          }
          editPostDispatch.openGeneralSidebar(target);
          openSuccess = true;
        } catch (e) {
          // Silent error handling
        }
      }

      // Method 2: Try interface store approach
      if (!openSuccess && interfaceDispatch && typeof interfaceDispatch.enableComplementaryArea === 'function') {
        try {
          // First ensure the sidebar is enabled at the interface level
          if (typeof interfaceDispatch.enableComplementaryArea === 'function') {
            interfaceDispatch.enableComplementaryArea('core/edit-post', target);
          }

          // Also try to set the pinned state if available
          if (typeof interfaceDispatch.pinItem === 'function') {
            interfaceDispatch.pinItem('core/edit-post', target);
          }
          openSuccess = true;
        } catch (e) {
          // Silent error handling
        }
      }

      // Method 2.5: Try to ensure the sidebar panel itself is open
      if (interfaceDispatch) {
        try {
          // Try to enable the complementary area first
          if (typeof interfaceDispatch.setDefaultComplementaryArea === 'function') {
            interfaceDispatch.setDefaultComplementaryArea('core/edit-post', target);
          }

          // Try to set the sidebar as active
          if (typeof interfaceDispatch.setActiveComplementaryArea === 'function') {
            interfaceDispatch.setActiveComplementaryArea('core/edit-post', target);
          }
        } catch (e) {
          // Silent error handling
        }
      }

      // Method 3: Try direct edit-post enableComplementaryArea
      if (!openSuccess && typeof editPostDispatch.enableComplementaryArea === 'function') {
        try {
          editPostDispatch.enableComplementaryArea('core/edit-post', target);
          openSuccess = true;
        } catch (e) {
          // Silent error handling
        }
      }
      if (openSuccess) {
        // Verify if it worked after a delay
        setTimeout(function () {
          var currentSidebar = null;

          // Check multiple ways to see if sidebar is open
          if (editPostStore.getActiveComplementaryArea) {
            currentSidebar = editPostStore.getActiveComplementaryArea('core/edit-post');
          }
          if (!currentSidebar && interfaceStore && interfaceStore.getActiveComplementaryArea) {
            currentSidebar = interfaceStore.getActiveComplementaryArea('core/edit-post');
          }
          if (currentSidebar === target) {
            // Even though API says it's open, let's ensure the visual sidebar is actually visible
            setTimeout(function () {
              // Check if sidebar panel is actually visible
              var sidebarPanel = document.querySelector('.interface-complementary-area, .edit-post-sidebar, .components-panel');
              var sidebarContainer = document.querySelector('.interface-interface-skeleton__sidebar, .edit-post-layout__sidebar');
              if (sidebarPanel) {
                var isVisible = sidebarPanel.offsetParent !== null && !sidebarPanel.hidden;
                if (!isVisible) {
                  // Force sidebar panel visibility
                  sidebarPanel.style.display = 'block';
                  sidebarPanel.style.visibility = 'visible';
                  sidebarPanel.style.opacity = '1';
                  sidebarPanel.hidden = false;
                  if (sidebarContainer) {
                    sidebarContainer.style.display = 'block';
                    sidebarContainer.style.visibility = 'visible';
                    sidebarContainer.style.width = '280px';
                  }
                }
              }

              // Also try to click the sidebar toggle button if sidebar is still not visible
              setTimeout(function () {
                var sidebarToggle = document.querySelector('button[aria-label*="Settings"], .edit-post-header__settings button, button[data-label*="Settings"]');
                var sidebarStillHidden = !document.querySelector('.interface-complementary-area:not([hidden])');
                if (sidebarToggle && sidebarStillHidden) {
                  sidebarToggle.click();

                  // Then try to click our specific sidebar tab
                  setTimeout(function () {
                    var linguatorTab = document.querySelector('button[aria-label*="Linguator"], .components-button[aria-label*="Linguator"]');
                    if (linguatorTab) {
                      linguatorTab.click();
                    }
                  }, 300);
                }
              }, 200);
            }, 100);
            sidebarOpened = true;
            if (unsubscribe) {
              unsubscribe();
              unsubscribe = null;
            }
          } else {
            // Try DOM-based verification
            var sidebarElement = document.querySelector("[data-sidebar=\"".concat(SIDEBAR_NAME, "\"], .").concat(SIDEBAR_NAME));
            if (sidebarElement && sidebarElement.offsetParent !== null) {
              sidebarOpened = true;
              if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
              }
            }
          }
        }, 500);
        return sidebarOpened;
      } else {
        // As a last resort, try to find and click the sidebar button in DOM
        setTimeout(function () {
          var sidebarButton = document.querySelector("button[aria-label*=\"Linguator\"], button[data-label*=\"Linguator\"], [data-sidebar=\"".concat(SIDEBAR_NAME, "\"]"));
          if (sidebarButton) {
            sidebarButton.click();

            // Check if it worked
            setTimeout(function () {
              var sidebarElement = document.querySelector('.interface-complementary-area');
              var isVisible = sidebarElement && sidebarElement.offsetParent !== null;
              if (isVisible) {
                sidebarOpened = true;
                if (unsubscribe) {
                  unsubscribe();
                  unsubscribe = null;
                }
              }
            }, 300);
          }
        }, 500);
      }
    } catch (e) {
      // Silent error handling
    }
    if (attempts >= maxAttempts) {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }
    return false;
  };

  // Wait for editor to be ready before trying
  var waitForEditor = function waitForEditor() {
    // Try immediately first
    if (tryOpenSidebar()) {
      return;
    }

    // If immediate attempt fails, subscribe to store changes
    unsubscribe = subscribe(function () {
      if (!sidebarOpened && attempts < maxAttempts) {
        tryOpenSidebar();
      }
    });

    // Also try with regular intervals as a fallback
    var intervalAttempts = setInterval(function () {
      if (sidebarOpened || attempts >= maxAttempts) {
        clearInterval(intervalAttempts);
        return;
      }
      tryOpenSidebar();
    }, 1000); // Try every second

    // Cleanup after maximum time
    setTimeout(function () {
      if (intervalAttempts) {
        clearInterval(intervalAttempts);
      }
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      // Cleanup completed
    }, 30000); // Give up after 30 seconds
  };

  // Start the process after a small delay to ensure everything is loaded
  setTimeout(waitForEditor, 500);
}
/******/ })()
;