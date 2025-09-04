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

;// external ["wp","primitives"]
const external_wp_primitives_namespaceObject = window["wp"]["primitives"];
;// external "ReactJSXRuntime"
const external_ReactJSXRuntime_namespaceObject = window["ReactJSXRuntime"];
;// ./node_modules/@wordpress/icons/build-module/library/globe.js
/**
 * WordPress dependencies
 */


const globe = /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,external_ReactJSXRuntime_namespaceObject.jsx)(external_wp_primitives_namespaceObject.Path, {
    d: "M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Zm6.5 8c0 .6 0 1.2-.2 1.8h-2.7c0-.6.2-1.1.2-1.8s0-1.2-.2-1.8h2.7c.2.6.2 1.1.2 1.8Zm-.9-3.2h-2.4c-.3-.9-.7-1.8-1.1-2.4-.1-.2-.2-.4-.3-.5 1.6.5 3 1.6 3.8 3ZM12.8 17c-.3.5-.6 1-.8 1.3-.2-.3-.5-.8-.8-1.3-.3-.5-.6-1.1-.8-1.7h3.3c-.2.6-.5 1.2-.8 1.7Zm-2.9-3.2c-.1-.6-.2-1.1-.2-1.8s0-1.2.2-1.8H14c.1.6.2 1.1.2 1.8s0 1.2-.2 1.8H9.9ZM11.2 7c.3-.5.6-1 .8-1.3.2.3.5.8.8 1.3.3.5.6 1.1.8 1.7h-3.3c.2-.6.5-1.2.8-1.7Zm-1-1.2c-.1.2-.2.3-.3.5-.4.7-.8 1.5-1.1 2.4H6.4c.8-1.4 2.2-2.5 3.8-3Zm-1.8 8H5.7c-.2-.6-.2-1.1-.2-1.8s0-1.2.2-1.8h2.7c0 .6-.2 1.1-.2 1.8s0 1.2.2 1.8Zm-2 1.4h2.4c.3.9.7 1.8 1.1 2.4.1.2.2.4.3.5-1.6-.5-3-1.6-3.8-3Zm7.4 3c.1-.2.2-.3.3-.5.4-.7.8-1.5 1.1-2.4h2.4c-.8 1.4-2.2 2.5-3.8 3Z"
  })
});
/* harmony default export */ const library_globe = (globe);
//# sourceMappingURL=globe.js.map
;// ./js/src/editors/post.js
/**
 * Post Editor sidebar bootstrap
 */








var SIDEBAR_NAME = 'lmat-post-sidebar';

// Use WP icon to ensure compatibility with @wordpress/components/Icon expectations
var LanguageIcon = library_globe;
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
  // Runtime guard: ensure editor components exist (avoids React rendering undefined elements)
  if (!external_wp_editPost_namespaceObject.PluginSidebar || !external_wp_editPost_namespaceObject.PluginSidebarMoreMenuItem) {
    return null;
  }
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

// Guard register to avoid calling with missing deps
if (typeof external_wp_plugins_namespaceObject.registerPlugin === 'function' && external_wp_editPost_namespaceObject.PluginSidebar && external_wp_editPost_namespaceObject.PluginSidebarMoreMenuItem) {
  (0,external_wp_plugins_namespaceObject.registerPlugin)(SIDEBAR_NAME, {
    render: Sidebar,
    icon: LanguageIcon
  });
}
/******/ })()
;