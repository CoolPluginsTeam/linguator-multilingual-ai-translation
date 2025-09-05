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

// const LanguageIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 44 44"><path d="M31.81 18.162v5.274c0 2.39-1.94 4.33-4.329 4.33H15.585a4.33 4.33 0 0 1-4.329-4.33v-5.274a4.33 4.33 0 0 1 4.329-4.329h11.896a4.33 4.33 0 0 1 4.329 4.329m-2.25 2.637a4.336 4.336 0 0 0-4.334-4.334H17.84a4.336 4.336 0 0 0-4.334 4.334 4.336 4.336 0 0 0 4.334 4.334h7.386a4.336 4.336 0 0 0 4.334-4.334"/><ellipse cx="11.256" cy="20.799" rx="1.435" ry="2.689"/><ellipse cx="31.81" cy="20.799" rx="1.435" ry="2.689"/><circle cx="17.684" cy="20.799" r="2.258"/><circle cx="25.382" cy="20.799" r="2.258"/><path d="m21.854 10.289-1.402 5.157 1.366-.018 1.414-4.996z"/><path d="M22.678 9.158a1.644 1.644 0 0 1 1.161 2.011 1.643 1.643 0 1 1-1.161-2.011"/><path d="M27.347 42.27c-1.85.519-3.8.796-5.814.796C9.649 43.066 0 33.417 0 21.533S9.649 0 21.533 0s21.533 9.649 21.533 21.533c0 2.517-.433 4.934-1.228 7.181h-2.251a19.4 19.4 0 0 0 1.372-7.181c0-10.722-8.704-19.427-19.426-19.427S2.106 10.811 2.106 21.533s8.705 19.426 19.427 19.426c2.045 0 4.016-.316 5.868-.903z"/><path d="M28.655 29.976h5.857a43 43 0 0 0-.589-1.765l2.144-.435q.526 1.395.799 2.2h5.339v1.892h-2.081q-1.058 3.181-3.048 5.374 2.159 1.492 5.325 2.277-1.163 1.416-1.541 2.06-3.202-1.072-5.437-2.831-2.25 1.696-5.521 2.915a22 22 0 0 0-1.402-2.032q3.147-.981 5.269-2.424-2.018-2.249-2.858-5.339h-2.256zm9.087 1.892h-4.666a9.9 9.9 0 0 0 2.34 3.973 9.6 9.6 0 0 0 2.326-3.973" style="fill-rule:nonzero"/></svg>
// );

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
  icon: /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    xmlSpace: "preserve",
    style: {
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2
    },
    viewBox: "0 0 44 44",
    width: "20",
    height: "20"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M31.81 18.162v5.274c0 2.39-1.94 4.33-4.329 4.33H15.585a4.33 4.33 0 0 1-4.329-4.33v-5.274a4.33 4.33 0 0 1 4.329-4.329h11.896a4.33 4.33 0 0 1 4.329 4.329m-2.25 2.637a4.336 4.336 0 0 0-4.334-4.334H17.84a4.336 4.336 0 0 0-4.334 4.334 4.336 4.336 0 0 0 4.334 4.334h7.386a4.336 4.336 0 0 0 4.334-4.334"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "11.256",
    cy: "20.799",
    rx: "1.435",
    ry: "2.689"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "31.81",
    cy: "20.799",
    rx: "1.435",
    ry: "2.689"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.684",
    cy: "20.799",
    r: "2.258"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "25.382",
    cy: "20.799",
    r: "2.258"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21.854 10.289-1.402 5.157 1.366-.018 1.414-4.996z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22.678 9.158a1.644 1.644 0 0 1 1.161 2.011 1.643 1.643 0 1 1-1.161-2.011"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M27.347 42.27c-1.85.519-3.8.796-5.814.796C9.649 43.066 0 33.417 0 21.533S9.649 0 21.533 0s21.533 9.649 21.533 21.533c0 2.517-.433 4.934-1.228 7.181h-2.251a19.4 19.4 0 0 0 1.372-7.181c0-10.722-8.704-19.427-19.426-19.427S2.106 10.811 2.106 21.533s8.705 19.426 19.427 19.426c2.045 0 4.016-.316 5.868-.903z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M28.655 29.976h5.857a43 43 0 0 0-.589-1.765l2.144-.435q.526 1.395.799 2.2h5.339v1.892h-2.081q-1.058 3.181-3.048 5.374 2.159 1.492 5.325 2.277-1.163 1.416-1.541 2.06-3.202-1.072-5.437-2.831-2.25 1.696-5.521 2.915a22 22 0 0 0-1.402-2.032q3.147-.981 5.269-2.424-2.018-2.249-2.858-5.339h-2.256zm9.087 1.892h-4.666a9.9 9.9 0 0 0 2.34 3.973 9.6 9.6 0 0 0 2.326-3.973",
    style: {
      fillRule: "nonzero"
    }
  }))
});
/******/ })()
;