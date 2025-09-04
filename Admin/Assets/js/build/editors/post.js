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
;// external ["wp","element"]
const external_wp_element_namespaceObject = window["wp"]["element"];
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

;// ./node_modules/lucide-react/dist/esm/icons/pencil.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);


//# sourceMappingURL=pencil.js.map

;// ./node_modules/lucide-react/dist/esm/icons/plus.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const plus_iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", plus_iconNode);


//# sourceMappingURL=plus.js.map

;// ./js/src/editors/post.js
/**
 * Post Editor sidebar bootstrap
 */







var SIDEBAR_NAME = 'lmat-post-sidebar';
var LanguageIcon = function LanguageIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    focusable: "false"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 2a8 8 0 0 1 7.75 6h-3.2a9.9 9.9 0 0 0-2.01-3.61A7.94 7.94 0 0 1 12 4Zm-2.54 2.05A7.88 7.88 0 0 1 12 6c.38 0 .76.03 1.13.08A7.9 7.9 0 0 1 15.2 10H8.8a7.9 7.9 0 0 1 1.66-3.95ZM4.25 12a8 8 0 0 1 1.2-4h3.2A9.9 9.9 0 0 0 6.64 12Zm3.35 2h8.8a7.9 7.9 0 0 1-2.07 3.92A8.02 8.02 0 0 1 5.45 14ZM12 20a8 8 0 0 1-7.75-6h3.2a9.9 9.9 0 0 0 2.01 3.61A7.94 7.94 0 0 1 12 20Zm2.36-2.05A7.88 7.88 0 0 1 12 18c-.38 0-.76-.03-1.13-.08A7.9 7.9 0 0 1 8.8 14h6.4a7.9 7.9 0 0 1-1.66 3.95Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M19 7h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 0 0 0 2h1.59a6.5 6.5 0 0 1-2.43 3.5 1 1 0 1 0 1.19 1.6A8.5 8.5 0 0 0 16 9h1v1a1 1 0 0 0 2 0V9h1a1 1 0 0 0 0-2Z"
  }));
};
var getSettings = function getSettings() {
  // Provided by PHP in Abstract_Screen::enqueue via wp_add_inline_script
  // Inline script declares: let lmat_block_editor_plugin_settings = {...}
  // Top-level 'let' is not a window property; read the lexical global if present.
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
      marginRight: 8
    }
  }) : null), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.FlexItem, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
    label: undefined,
    value: (lang === null || lang === void 0 ? void 0 : lang.slug) || '',
    onChange: function onChange() {},
    help: undefined,
    options: options.map(function (opt) {
      return {
        label: opt.label,
        value: opt.value
      };
    })
    // Keep read-only for now; changing language requires server actions.
    ,
    disabled: true
  }))));
};
var TranslationRow = function TranslationRow(_ref2) {
  var row = _ref2.row;
  var lang = row.lang,
    translated_post = row.translated_post,
    links = row.links;
  var title = (translated_post === null || translated_post === void 0 ? void 0 : translated_post.title) || '';
  var hasEdit = !!(links !== null && links !== void 0 && links.edit_link);
  var hasAdd = !!(links !== null && links !== void 0 && links.add_link);
  return /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.Flex, {
    align: "center",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.FlexItem, null, lang !== null && lang !== void 0 && lang.flag_url ? /*#__PURE__*/React.createElement("img", {
    src: lang.flag_url,
    alt: (lang === null || lang === void 0 ? void 0 : lang.name) || '',
    style: {
      width: 18,
      height: 12
    }
  }) : null), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.FlexItem, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.TextControl, {
    value: title,
    onChange: function onChange() {},
    placeholder: (0,external_wp_i18n_namespaceObject.__)('title', 'linguator-multilingual-ai-translation')
  })), /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.FlexItem, null, hasEdit ? /*#__PURE__*/React.createElement("a", {
    href: links.edit_link,
    "aria-label": (0,external_wp_i18n_namespaceObject.__)('Edit translation', 'linguator-multilingual-ai-translation'),
    style: {
      marginLeft: 8
    }
  }, /*#__PURE__*/React.createElement(Pencil, null)) : null, !hasEdit && hasAdd ? /*#__PURE__*/React.createElement("a", {
    href: links.add_link,
    "aria-label": (0,external_wp_i18n_namespaceObject.__)('Add translation', 'linguator-multilingual-ai-translation'),
    style: {
      marginLeft: 8
    }
  }, /*#__PURE__*/React.createElement(Plus, null)) : null));
};
var TranslationsSection = function TranslationsSection(_ref3) {
  var translations = _ref3.translations;
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
    title: (0,external_wp_i18n_namespaceObject.__)('Languages', 'linguator-multilingual-ai-translation')
  }, /*#__PURE__*/React.createElement(LanguageSection, {
    lang: lang,
    allLanguages: translations
  }), /*#__PURE__*/React.createElement(TranslationsSection, {
    translations: translations
  })));
};
(0,external_wp_plugins_namespaceObject.registerPlugin)(SIDEBAR_NAME, {
  render: Sidebar,
  icon: LanguageIcon
});
/******/ })()
;