/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 338:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;


var m = __webpack_require__(795);
if (true) {
  exports.H = m.createRoot;
  __webpack_unused_export__ = m.hydrateRoot;
} else // removed by dead control flow
{ var i; }


/***/ }),

/***/ 795:
/***/ ((module) => {

module.exports = window["ReactDOM"];

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
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
var __webpack_exports__ = {};

;// external "React"
const external_React_namespaceObject = window["React"];
var external_React_namespaceObject_0 = /*#__PURE__*/__webpack_require__.t(external_React_namespaceObject, 2);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_namespaceObject);
;// external ["wp","i18n"]
const external_wp_i18n_namespaceObject = window["wp"]["i18n"];
;// ./Assets/logo/linguator-icon.svg
var _circle, _circle2;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

var SvgLinguatorIcon = function SvgLinguatorIcon(props) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    xmlSpace: "preserve",
    style: {
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeMiterlimit: 1.5
    },
    viewBox: "0 0 44 44"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M31.81 18.162v5.274c0 2.39-1.94 4.33-4.329 4.33H15.585a4.33 4.33 0 0 1-4.329-4.33v-5.274a4.33 4.33 0 0 1 4.329-4.329h11.896a4.33 4.33 0 0 1 4.329 4.329m-2.25 2.637a4.336 4.336 0 0 0-4.334-4.334H17.84a4.336 4.336 0 0 0-4.334 4.334 4.336 4.336 0 0 0 4.334 4.334h7.386a4.336 4.336 0 0 0 4.334-4.334",
    style: {
      fill: "#30b230"
    }
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: 11.256,
    cy: 20.799,
    rx: 1.435,
    ry: 2.689,
    style: {
      fill: "#30b230"
    }
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: 31.81,
    cy: 20.799,
    rx: 1.435,
    ry: 2.689,
    style: {
      fill: "#30b230"
    }
  }), _circle || (_circle = /*#__PURE__*/React.createElement("circle", {
    cx: 17.684,
    cy: 20.799,
    r: 2.258
  })), _circle2 || (_circle2 = /*#__PURE__*/React.createElement("circle", {
    cx: 25.382,
    cy: 20.799,
    r: 2.258
  })), /*#__PURE__*/React.createElement("path", {
    d: "m22.09 11.461-1.036 3.867",
    style: {
      fill: "none",
      stroke: "#30b230",
      strokeWidth: "1.59px"
    }
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22.678 9.158a1.644 1.644 0 0 1 1.161 2.011 1.643 1.643 0 1 1-1.161-2.011",
    style: {
      fill: "#30b230"
    }
  }), /*#__PURE__*/React.createElement("path", {
    d: "M27.347 42.27c-1.85.519-3.8.796-5.814.796C9.649 43.066 0 33.417 0 21.533S9.649 0 21.533 0s21.533 9.649 21.533 21.533c0 2.517-.433 4.934-1.228 7.181h-2.251a19.4 19.4 0 0 0 1.372-7.181c0-10.722-8.704-19.427-19.426-19.427S2.106 10.811 2.106 21.533s8.705 19.426 19.427 19.426c2.045 0 4.016-.316 5.868-.903z",
    style: {
      fill: "#30b230"
    }
  }), /*#__PURE__*/React.createElement("path", {
    d: "M28.655 29.976h5.857a43 43 0 0 0-.589-1.765l2.144-.435q.526 1.395.799 2.2h5.339v1.892h-2.081q-1.058 3.181-3.048 5.374 2.159 1.492 5.325 2.277-1.163 1.416-1.541 2.06-3.202-1.072-5.437-2.831-2.25 1.696-5.521 2.915a22 22 0 0 0-1.402-2.032q3.147-.981 5.269-2.424-2.018-2.249-2.858-5.339h-2.256zm9.087 1.892h-4.666a9.9 9.9 0 0 0 2.34 3.973 9.6 9.6 0 0 0 2.326-3.973",
    style: {
      fillRule: "nonzero"
    }
  }));
};
/* harmony default export */ const linguator_icon = ((/* unused pure expression or super */ null && (SvgLinguatorIcon)));
;// ./Admin/Settings/Views/src/components/Header.jsx



var Header = function Header(_ref) {
  var setCurrentPage = _ref.setCurrentPage,
    currentPage = _ref.currentPage;
  var tabs = [{
    label: __("GENERAL", "linguator-multilingual-ai-translation"),
    value: "general"
  }, {
    label: __("Translation", "linguator-multilingual-ai-translation"),
    value: "translation"
  }];
  return /*#__PURE__*/React.createElement(Topbar, {
    className: "w-full min-h-[unset] h-16 shadow-sm p-0 relative z-[1] rounded-lg",
    gap: 0
  }, /*#__PURE__*/React.createElement(Topbar.Left, {
    className: "p-5"
  }, /*#__PURE__*/React.createElement(Topbar.Item, {
    className: "flex items-center p-2"
  }, /*#__PURE__*/React.createElement(LinguatorIcon, {
    width: "40",
    height: "40",
    style: {
      display: 'block'
    }
  }))), /*#__PURE__*/React.createElement(Topbar.Middle, {
    align: "left",
    className: "h-full"
  }, /*#__PURE__*/React.createElement(Topbar.Item, {
    className: "h-full gap-4"
  }, tabs.map(function (tab, index) {
    return /*#__PURE__*/React.createElement("a", {
      className: "content-center no-underline h-full py-0 px-1 m-0 bg-transparent outline-none shadow-none border-0 focus:outline-none text-text-secondary text-sm font-medium cursor-pointer relative ".concat(currentPage === tabs[index].value ? "active" : ''),
      target: "_self",
      key: index,
      onClick: function onClick() {
        setCurrentPage(tab.value);
      }
    }, tab.label);
  }))), /*#__PURE__*/React.createElement(Topbar.Right, {
    className: "p-5",
    gap: "md"
  }, /*#__PURE__*/React.createElement(Topbar.Item, null)));
};
/* harmony default export */ const components_Header = ((/* unused pure expression or super */ null && (Header)));
;// external "ReactJSXRuntime"
const external_ReactJSXRuntime_namespaceObject = window["ReactJSXRuntime"];
;// ./node_modules/tailwind-merge/dist/bundle-mjs.mjs
const CLASS_PART_SEPARATOR = '-';
const createClassGroupUtils = config => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = className => {
    const classParts = className.split(CLASS_PART_SEPARATOR);
    // Classes like `-inset-1` produce an empty string as first classPart. We assume that classes for negative values are used correctly and remove it from classParts.
    if (classParts[0] === '' && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
    }
    return conflicts;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
const getGroupRecursive = (classParts, classPartObject) => {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[0];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : undefined;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return undefined;
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(({
    validator
  }) => validator(classRest))?.classGroupId;
};
const arbitraryPropertyRegex = /^\[(.+)\]$/;
const getGroupIdForArbitraryProperty = className => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(':'));
    if (property) {
      // I use two dots here because one dot is used as prefix for class groups in plugins
      return 'arbitrary..' + property;
    }
  }
};
/**
 * Exported for testing only
 */
const createClassMap = config => {
  const {
    theme,
    prefix
  } = config;
  const classMap = {
    nextPart: new Map(),
    validators: []
  };
  const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
  prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
    processClassesRecursively(classGroup, classMap, classGroupId, theme);
  });
  return classMap;
};
const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach(classDefinition => {
    if (typeof classDefinition === 'string') {
      const classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === 'function') {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(([key, classGroup]) => {
      processClassesRecursively(classGroup, getPart(classPartObject, key), classGroupId, theme);
    });
  });
};
const getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach(pathPart => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
};
const isThemeGetter = func => func.isThemeGetter;
const getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
  if (!prefix) {
    return classGroupEntries;
  }
  return classGroupEntries.map(([classGroupId, classGroup]) => {
    const prefixedClassGroup = classGroup.map(classDefinition => {
      if (typeof classDefinition === 'string') {
        return prefix + classDefinition;
      }
      if (typeof classDefinition === 'object') {
        return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
      }
      return classDefinition;
    });
    return [classGroupId, prefixedClassGroup];
  });
};

// LRU cache inspired from hashlru (https://github.com/dominictarr/hashlru/blob/v1.0.4/index.js) but object replaced with Map to improve performance
const createLruCache = maxCacheSize => {
  if (maxCacheSize < 1) {
    return {
      get: () => undefined,
      set: () => {}
    };
  }
  let cacheSize = 0;
  let cache = new Map();
  let previousCache = new Map();
  const update = (key, value) => {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = new Map();
    }
  };
  return {
    get(key) {
      let value = cache.get(key);
      if (value !== undefined) {
        return value;
      }
      if ((value = previousCache.get(key)) !== undefined) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
};
const IMPORTANT_MODIFIER = '!';
const createParseClassName = config => {
  const {
    separator,
    experimentalParseClassName
  } = config;
  const isSeparatorSingleCharacter = separator.length === 1;
  const firstSeparatorCharacter = separator[0];
  const separatorLength = separator.length;
  // parseClassName inspired by https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
  const parseClassName = className => {
    const modifiers = [];
    let bracketDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index];
      if (bracketDepth === 0) {
        if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + separatorLength;
          continue;
        }
        if (currentCharacter === '/') {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === '[') {
        bracketDepth++;
      } else if (currentCharacter === ']') {
        bracketDepth--;
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : undefined;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
  if (experimentalParseClassName) {
    return className => experimentalParseClassName({
      className,
      parseClassName
    });
  }
  return parseClassName;
};
/**
 * Sorts modifiers according to following schema:
 * - Predefined modifiers are sorted alphabetically
 * - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
 */
const sortModifiers = modifiers => {
  if (modifiers.length <= 1) {
    return modifiers;
  }
  const sortedModifiers = [];
  let unsortedModifiers = [];
  modifiers.forEach(modifier => {
    const isArbitraryVariant = modifier[0] === '[';
    if (isArbitraryVariant) {
      sortedModifiers.push(...unsortedModifiers.sort(), modifier);
      unsortedModifiers = [];
    } else {
      unsortedModifiers.push(modifier);
    }
  });
  sortedModifiers.push(...unsortedModifiers.sort());
  return sortedModifiers;
};
const createConfigUtils = config => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  ...createClassGroupUtils(config)
});
const SPLIT_CLASSES_REGEX = /\s+/;
const mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds
  } = configUtils;
  /**
   * Set of classGroupIds in following format:
   * `{importantModifier}{variantModifiers}{classGroupId}`
   * @example 'float'
   * @example 'hover:focus:bg-color'
   * @example 'md:!pr'
   */
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = '';
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
    let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        // Not a Tailwind class
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        // Not a Tailwind class
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = sortModifiers(modifiers).join(':');
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.includes(classId)) {
      // Tailwind class omitted due to conflict
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    // Tailwind class not in conflict
    result = originalClassName + (result.length > 0 ? ' ' + result : result);
  }
  return result;
};

/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */
function twJoin() {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = '';
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
}
const toValue = mix => {
  if (typeof mix === 'string') {
    return mix;
  }
  let resolvedValue;
  let string = '';
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
const fromTheme = key => {
  const themeGetter = theme => theme[key] || [];
  themeGetter.isThemeGetter = true;
  return themeGetter;
};
const arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
const fractionRegex = /^\d+\/\d+$/;
const stringLengths = /*#__PURE__*/new Set(['px', 'full', 'screen']);
const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/;
// Shadow always begins with x and y offset separated by underscore optionally prepended by inset
const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
const isLength = value => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
const isArbitraryLength = value => getIsArbitraryValue(value, 'length', isLengthOnly);
const isNumber = value => Boolean(value) && !Number.isNaN(Number(value));
const isArbitraryNumber = value => getIsArbitraryValue(value, 'number', isNumber);
const isInteger = value => Boolean(value) && Number.isInteger(Number(value));
const isPercent = value => value.endsWith('%') && isNumber(value.slice(0, -1));
const isArbitraryValue = value => arbitraryValueRegex.test(value);
const isTshirtSize = value => tshirtUnitRegex.test(value);
const sizeLabels = /*#__PURE__*/new Set(['length', 'size', 'percentage']);
const isArbitrarySize = value => getIsArbitraryValue(value, sizeLabels, isNever);
const isArbitraryPosition = value => getIsArbitraryValue(value, 'position', isNever);
const imageLabels = /*#__PURE__*/new Set(['image', 'url']);
const isArbitraryImage = value => getIsArbitraryValue(value, imageLabels, isImage);
const isArbitraryShadow = value => getIsArbitraryValue(value, '', isShadow);
const isAny = () => true;
const getIsArbitraryValue = (value, label, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return typeof label === 'string' ? result[1] === label : label.has(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
const isLengthOnly = value =>
// `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
// For example, `hsl(0 0% 0%)` would be classified as a length without this check.
// I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
const isNever = () => false;
const isShadow = value => shadowRegex.test(value);
const isImage = value => imageRegex.test(value);
const validators = /*#__PURE__*/Object.defineProperty({
  __proto__: null,
  isAny,
  isArbitraryImage,
  isArbitraryLength,
  isArbitraryNumber,
  isArbitraryPosition,
  isArbitraryShadow,
  isArbitrarySize,
  isArbitraryValue,
  isInteger,
  isLength,
  isNumber,
  isPercent,
  isTshirtSize
}, Symbol.toStringTag, {
  value: 'Module'
});
const getDefaultConfig = () => {
  const colors = fromTheme('colors');
  const spacing = fromTheme('spacing');
  const blur = fromTheme('blur');
  const brightness = fromTheme('brightness');
  const borderColor = fromTheme('borderColor');
  const borderRadius = fromTheme('borderRadius');
  const borderSpacing = fromTheme('borderSpacing');
  const borderWidth = fromTheme('borderWidth');
  const contrast = fromTheme('contrast');
  const grayscale = fromTheme('grayscale');
  const hueRotate = fromTheme('hueRotate');
  const invert = fromTheme('invert');
  const gap = fromTheme('gap');
  const gradientColorStops = fromTheme('gradientColorStops');
  const gradientColorStopPositions = fromTheme('gradientColorStopPositions');
  const inset = fromTheme('inset');
  const margin = fromTheme('margin');
  const opacity = fromTheme('opacity');
  const padding = fromTheme('padding');
  const saturate = fromTheme('saturate');
  const scale = fromTheme('scale');
  const sepia = fromTheme('sepia');
  const skew = fromTheme('skew');
  const space = fromTheme('space');
  const translate = fromTheme('translate');
  const getOverscroll = () => ['auto', 'contain', 'none'];
  const getOverflow = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'];
  const getSpacingWithAutoAndArbitrary = () => ['auto', isArbitraryValue, spacing];
  const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
  const getLengthWithEmptyAndArbitrary = () => ['', isLength, isArbitraryLength];
  const getNumberWithAutoAndArbitrary = () => ['auto', isNumber, isArbitraryValue];
  const getPositions = () => ['bottom', 'center', 'left', 'left-bottom', 'left-top', 'right', 'right-bottom', 'right-top', 'top'];
  const getLineStyles = () => ['solid', 'dashed', 'dotted', 'double', 'none'];
  const getBlendModes = () => ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
  const getAlign = () => ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'];
  const getZeroAndEmpty = () => ['', '0', isArbitraryValue];
  const getBreaks = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'];
  const getNumberAndArbitrary = () => [isNumber, isArbitraryValue];
  return {
    cacheSize: 500,
    separator: ':',
    theme: {
      colors: [isAny],
      spacing: [isLength, isArbitraryLength],
      blur: ['none', '', isTshirtSize, isArbitraryValue],
      brightness: getNumberAndArbitrary(),
      borderColor: [colors],
      borderRadius: ['none', '', 'full', isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmptyAndArbitrary(),
      contrast: getNumberAndArbitrary(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumberAndArbitrary(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumberAndArbitrary(),
      scale: getNumberAndArbitrary(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ['auto', 'square', 'video', isArbitraryValue]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ['container'],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isTshirtSize]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      'break-after': [{
        'break-after': getBreaks()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      'break-before': [{
        'break-before': getBreaks()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      'break-inside': [{
        'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column']
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      'box-decoration': [{
        'box-decoration': ['slice', 'clone']
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ['border', 'content']
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'table-row', 'flow-root', 'grid', 'inline-grid', 'contents', 'list-item', 'hidden'],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ['right', 'left', 'none', 'start', 'end']
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ['left', 'right', 'both', 'none', 'start', 'end']
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ['isolate', 'isolation-auto'],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      'object-fit': [{
        object: ['contain', 'cover', 'fill', 'none', 'scale-down']
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      'object-position': [{
        object: [...getPositions(), isArbitraryValue]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: getOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-x': [{
        'overflow-x': getOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-y': [{
        'overflow-y': getOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: getOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-x': [{
        'overscroll-x': getOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-y': [{
        'overscroll-y': getOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [inset]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-x': [{
        'inset-x': [inset]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-y': [{
        'inset-y': [inset]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [inset]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [inset]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [inset]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [inset]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [inset]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [inset]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ['visible', 'invisible', 'collapse'],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ['auto', isInteger, isArbitraryValue]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: getSpacingWithAutoAndArbitrary()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      'flex-direction': [{
        flex: ['row', 'row-reverse', 'col', 'col-reverse']
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      'flex-wrap': [{
        flex: ['wrap', 'wrap-reverse', 'nowrap']
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ['1', 'auto', 'initial', 'none', isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: getZeroAndEmpty()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: getZeroAndEmpty()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ['first', 'last', 'none', isInteger, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      'grid-cols': [{
        'grid-cols': [isAny]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start-end': [{
        col: ['auto', {
          span: ['full', isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start': [{
        'col-start': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-end': [{
        'col-end': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      'grid-rows': [{
        'grid-rows': [isAny]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start-end': [{
        row: ['auto', {
          span: [isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start': [{
        'row-start': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-end': [{
        'row-end': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      'grid-flow': [{
        'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense']
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      'auto-cols': [{
        'auto-cols': ['auto', 'min', 'max', 'fr', isArbitraryValue]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      'auto-rows': [{
        'auto-rows': ['auto', 'min', 'max', 'fr', isArbitraryValue]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [gap]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-x': [{
        'gap-x': [gap]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-y': [{
        'gap-y': [gap]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      'justify-content': [{
        justify: ['normal', ...getAlign()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      'justify-items': [{
        'justify-items': ['start', 'end', 'center', 'stretch']
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      'justify-self': [{
        'justify-self': ['auto', 'start', 'end', 'center', 'stretch']
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      'align-content': [{
        content: ['normal', ...getAlign(), 'baseline']
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      'align-items': [{
        items: ['start', 'end', 'center', 'baseline', 'stretch']
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      'align-self': [{
        self: ['auto', 'start', 'end', 'center', 'stretch', 'baseline']
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      'place-content': [{
        'place-content': [...getAlign(), 'baseline']
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      'place-items': [{
        'place-items': ['start', 'end', 'center', 'baseline', 'stretch']
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      'place-self': [{
        'place-self': ['auto', 'start', 'end', 'center', 'stretch']
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [padding]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [padding]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [padding]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [padding]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [padding]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [padding]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [padding]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [padding]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [padding]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [margin]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [margin]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [margin]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [margin]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [margin]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [margin]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [margin]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [margin]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [margin]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      'space-x': [{
        'space-x': [space]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      'space-x-reverse': ['space-x-reverse'],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      'space-y': [{
        'space-y': [space]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      'space-y-reverse': ['space-y-reverse'],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ['auto', 'min', 'max', 'fit', 'svw', 'lvw', 'dvw', isArbitraryValue, spacing]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      'min-w': [{
        'min-w': [isArbitraryValue, spacing, 'min', 'max', 'fit']
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      'max-w': [{
        'max-w': [isArbitraryValue, spacing, 'none', 'full', 'min', 'max', 'fit', 'prose', {
          screen: [isTshirtSize]
        }, isTshirtSize]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [isArbitraryValue, spacing, 'auto', 'min', 'max', 'fit', 'svh', 'lvh', 'dvh']
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      'min-h': [{
        'min-h': [isArbitraryValue, spacing, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh']
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      'max-h': [{
        'max-h': [isArbitraryValue, spacing, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh']
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [isArbitraryValue, spacing, 'auto', 'min', 'max', 'fit']
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      'font-size': [{
        text: ['base', isTshirtSize, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      'font-smoothing': ['antialiased', 'subpixel-antialiased'],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      'font-style': ['italic', 'not-italic'],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      'font-weight': [{
        font: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black', isArbitraryNumber]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      'font-family': [{
        font: [isAny]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-normal': ['normal-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-ordinal': ['ordinal'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-slashed-zero': ['slashed-zero'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-figure': ['lining-nums', 'oldstyle-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-spacing': ['proportional-nums', 'tabular-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest', isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      'line-clamp': [{
        'line-clamp': ['none', isNumber, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose', isLength, isArbitraryValue]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      'list-image': [{
        'list-image': ['none', isArbitraryValue]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      'list-style-type': [{
        list: ['none', 'disc', 'decimal', isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      'list-style-position': [{
        list: ['inside', 'outside']
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      'placeholder-color': [{
        placeholder: [colors]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      'placeholder-opacity': [{
        'placeholder-opacity': [opacity]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      'text-alignment': [{
        text: ['left', 'center', 'right', 'justify', 'start', 'end']
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      'text-color': [{
        text: [colors]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      'text-opacity': [{
        'text-opacity': [opacity]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      'text-decoration-style': [{
        decoration: [...getLineStyles(), 'wavy']
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      'text-decoration-thickness': [{
        decoration: ['auto', 'from-font', isLength, isArbitraryLength]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      'underline-offset': [{
        'underline-offset': ['auto', isLength, isArbitraryValue]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      'text-decoration-color': [{
        decoration: [colors]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      'text-wrap': [{
        text: ['wrap', 'nowrap', 'balance', 'pretty']
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: getSpacingWithArbitrary()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      'vertical-align': [{
        align: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super', isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces']
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ['normal', 'words', 'all', 'keep']
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ['none', 'manual', 'auto']
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ['none', isArbitraryValue]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      'bg-attachment': [{
        bg: ['fixed', 'local', 'scroll']
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      'bg-clip': [{
        'bg-clip': ['border', 'padding', 'content', 'text']
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      'bg-opacity': [{
        'bg-opacity': [opacity]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      'bg-origin': [{
        'bg-origin': ['border', 'padding', 'content']
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      'bg-position': [{
        bg: [...getPositions(), isArbitraryPosition]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      'bg-repeat': [{
        bg: ['no-repeat', {
          repeat: ['', 'x', 'y', 'round', 'space']
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      'bg-size': [{
        bg: ['auto', 'cover', 'contain', isArbitrarySize]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      'bg-image': [{
        bg: ['none', {
          'gradient-to': ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
        }, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      'bg-color': [{
        bg: [colors]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from-pos': [{
        from: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via-pos': [{
        via: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to-pos': [{
        to: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from': [{
        from: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via': [{
        via: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to': [{
        to: [gradientColorStops]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [borderRadius]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-s': [{
        'rounded-s': [borderRadius]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-e': [{
        'rounded-e': [borderRadius]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-t': [{
        'rounded-t': [borderRadius]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-r': [{
        'rounded-r': [borderRadius]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-b': [{
        'rounded-b': [borderRadius]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-l': [{
        'rounded-l': [borderRadius]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ss': [{
        'rounded-ss': [borderRadius]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-se': [{
        'rounded-se': [borderRadius]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ee': [{
        'rounded-ee': [borderRadius]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-es': [{
        'rounded-es': [borderRadius]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tl': [{
        'rounded-tl': [borderRadius]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tr': [{
        'rounded-tr': [borderRadius]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-br': [{
        'rounded-br': [borderRadius]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-bl': [{
        'rounded-bl': [borderRadius]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w': [{
        border: [borderWidth]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-x': [{
        'border-x': [borderWidth]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-y': [{
        'border-y': [borderWidth]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-s': [{
        'border-s': [borderWidth]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-e': [{
        'border-e': [borderWidth]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-t': [{
        'border-t': [borderWidth]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-r': [{
        'border-r': [borderWidth]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-b': [{
        'border-b': [borderWidth]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-l': [{
        'border-l': [borderWidth]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      'border-opacity': [{
        'border-opacity': [opacity]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      'border-style': [{
        border: [...getLineStyles(), 'hidden']
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-x': [{
        'divide-x': [borderWidth]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-x-reverse': ['divide-x-reverse'],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-y': [{
        'divide-y': [borderWidth]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-y-reverse': ['divide-y-reverse'],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      'divide-opacity': [{
        'divide-opacity': [opacity]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      'divide-style': [{
        divide: getLineStyles()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color': [{
        border: [borderColor]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-x': [{
        'border-x': [borderColor]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-y': [{
        'border-y': [borderColor]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-s': [{
        'border-s': [borderColor]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-e': [{
        'border-e': [borderColor]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-t': [{
        'border-t': [borderColor]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-r': [{
        'border-r': [borderColor]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-b': [{
        'border-b': [borderColor]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-l': [{
        'border-l': [borderColor]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      'divide-color': [{
        divide: [borderColor]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      'outline-style': [{
        outline: ['', ...getLineStyles()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      'outline-offset': [{
        'outline-offset': [isLength, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      'outline-w': [{
        outline: [isLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      'outline-color': [{
        outline: [colors]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      'ring-w': [{
        ring: getLengthWithEmptyAndArbitrary()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      'ring-w-inset': ['ring-inset'],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      'ring-color': [{
        ring: [colors]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      'ring-opacity': [{
        'ring-opacity': [opacity]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      'ring-offset-w': [{
        'ring-offset': [isLength, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      'ring-offset-color': [{
        'ring-offset': [colors]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ['', 'inner', 'none', isTshirtSize, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      'shadow-color': [{
        shadow: [isAny]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [opacity]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      'mix-blend': [{
        'mix-blend': [...getBlendModes(), 'plus-lighter', 'plus-darker']
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      'bg-blend': [{
        'bg-blend': getBlendModes()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ['', 'none']
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [blur]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [brightness]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [contrast]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      'drop-shadow': [{
        'drop-shadow': ['', 'none', isTshirtSize, isArbitraryValue]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [grayscale]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      'hue-rotate': [{
        'hue-rotate': [hueRotate]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [invert]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [saturate]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [sepia]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      'backdrop-filter': [{
        'backdrop-filter': ['', 'none']
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      'backdrop-blur': [{
        'backdrop-blur': [blur]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      'backdrop-brightness': [{
        'backdrop-brightness': [brightness]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      'backdrop-contrast': [{
        'backdrop-contrast': [contrast]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      'backdrop-grayscale': [{
        'backdrop-grayscale': [grayscale]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      'backdrop-hue-rotate': [{
        'backdrop-hue-rotate': [hueRotate]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      'backdrop-invert': [{
        'backdrop-invert': [invert]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      'backdrop-opacity': [{
        'backdrop-opacity': [opacity]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      'backdrop-saturate': [{
        'backdrop-saturate': [saturate]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      'backdrop-sepia': [{
        'backdrop-sepia': [sepia]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      'border-collapse': [{
        border: ['collapse', 'separate']
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing': [{
        'border-spacing': [borderSpacing]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-x': [{
        'border-spacing-x': [borderSpacing]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-y': [{
        'border-spacing-y': [borderSpacing]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      'table-layout': [{
        table: ['auto', 'fixed']
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ['top', 'bottom']
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ['none', 'all', '', 'colors', 'opacity', 'shadow', 'transform', isArbitraryValue]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: getNumberAndArbitrary()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ['linear', 'in', 'out', 'in-out', isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: getNumberAndArbitrary()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ['none', 'spin', 'ping', 'pulse', 'bounce', isArbitraryValue]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ['', 'gpu', 'none']
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [scale]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-x': [{
        'scale-x': [scale]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-y': [{
        'scale-y': [scale]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [isInteger, isArbitraryValue]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-x': [{
        'translate-x': [translate]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-y': [{
        'translate-y': [translate]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-x': [{
        'skew-x': [skew]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-y': [{
        'skew-y': [skew]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      'transform-origin': [{
        origin: ['center', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left', isArbitraryValue]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ['auto', colors]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ['none', 'auto']
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'help', 'not-allowed', 'none', 'context-menu', 'progress', 'cell', 'crosshair', 'vertical-text', 'alias', 'copy', 'no-drop', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out', isArbitraryValue]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      'caret-color': [{
        caret: [colors]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      'pointer-events': [{
        'pointer-events': ['none', 'auto']
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ['none', 'y', 'x', '']
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      'scroll-behavior': [{
        scroll: ['auto', 'smooth']
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-m': [{
        'scroll-m': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mx': [{
        'scroll-mx': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-my': [{
        'scroll-my': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ms': [{
        'scroll-ms': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-me': [{
        'scroll-me': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mt': [{
        'scroll-mt': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mr': [{
        'scroll-mr': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mb': [{
        'scroll-mb': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ml': [{
        'scroll-ml': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-p': [{
        'scroll-p': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-px': [{
        'scroll-px': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-py': [{
        'scroll-py': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-ps': [{
        'scroll-ps': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pe': [{
        'scroll-pe': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pt': [{
        'scroll-pt': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pr': [{
        'scroll-pr': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pb': [{
        'scroll-pb': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pl': [{
        'scroll-pl': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      'snap-align': [{
        snap: ['start', 'end', 'center', 'align-none']
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      'snap-stop': [{
        snap: ['normal', 'always']
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-type': [{
        snap: ['none', 'x', 'y', 'both']
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-strictness': [{
        snap: ['mandatory', 'proximity']
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ['auto', 'none', 'manipulation']
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-x': [{
        'touch-pan': ['x', 'left', 'right']
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-y': [{
        'touch-pan': ['y', 'up', 'down']
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-pz': ['touch-pinch-zoom'],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ['none', 'text', 'all', 'auto']
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      'will-change': [{
        'will-change': ['auto', 'scroll', 'contents', 'transform', isArbitraryValue]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [colors, 'none']
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      'stroke-w': [{
        stroke: [isLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [colors, 'none']
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ['sr-only', 'not-sr-only'],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      'forced-color-adjust': [{
        'forced-color-adjust': ['auto', 'none']
      }]
    },
    conflictingClassGroups: {
      overflow: ['overflow-x', 'overflow-y'],
      overscroll: ['overscroll-x', 'overscroll-y'],
      inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
      'inset-x': ['right', 'left'],
      'inset-y': ['top', 'bottom'],
      flex: ['basis', 'grow', 'shrink'],
      gap: ['gap-x', 'gap-y'],
      p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
      px: ['pr', 'pl'],
      py: ['pt', 'pb'],
      m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
      mx: ['mr', 'ml'],
      my: ['mt', 'mb'],
      size: ['w', 'h'],
      'font-size': ['leading'],
      'fvn-normal': ['fvn-ordinal', 'fvn-slashed-zero', 'fvn-figure', 'fvn-spacing', 'fvn-fraction'],
      'fvn-ordinal': ['fvn-normal'],
      'fvn-slashed-zero': ['fvn-normal'],
      'fvn-figure': ['fvn-normal'],
      'fvn-spacing': ['fvn-normal'],
      'fvn-fraction': ['fvn-normal'],
      'line-clamp': ['display', 'overflow'],
      rounded: ['rounded-s', 'rounded-e', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l', 'rounded-ss', 'rounded-se', 'rounded-ee', 'rounded-es', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl'],
      'rounded-s': ['rounded-ss', 'rounded-es'],
      'rounded-e': ['rounded-se', 'rounded-ee'],
      'rounded-t': ['rounded-tl', 'rounded-tr'],
      'rounded-r': ['rounded-tr', 'rounded-br'],
      'rounded-b': ['rounded-br', 'rounded-bl'],
      'rounded-l': ['rounded-tl', 'rounded-bl'],
      'border-spacing': ['border-spacing-x', 'border-spacing-y'],
      'border-w': ['border-w-s', 'border-w-e', 'border-w-t', 'border-w-r', 'border-w-b', 'border-w-l'],
      'border-w-x': ['border-w-r', 'border-w-l'],
      'border-w-y': ['border-w-t', 'border-w-b'],
      'border-color': ['border-color-s', 'border-color-e', 'border-color-t', 'border-color-r', 'border-color-b', 'border-color-l'],
      'border-color-x': ['border-color-r', 'border-color-l'],
      'border-color-y': ['border-color-t', 'border-color-b'],
      'scroll-m': ['scroll-mx', 'scroll-my', 'scroll-ms', 'scroll-me', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml'],
      'scroll-mx': ['scroll-mr', 'scroll-ml'],
      'scroll-my': ['scroll-mt', 'scroll-mb'],
      'scroll-p': ['scroll-px', 'scroll-py', 'scroll-ps', 'scroll-pe', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl'],
      'scroll-px': ['scroll-pr', 'scroll-pl'],
      'scroll-py': ['scroll-pt', 'scroll-pb'],
      touch: ['touch-x', 'touch-y', 'touch-pz'],
      'touch-x': ['touch'],
      'touch-y': ['touch'],
      'touch-pz': ['touch']
    },
    conflictingClassGroupModifiers: {
      'font-size': ['leading']
    }
  };
};

/**
 * @param baseConfig Config where other config will be merged into. This object will be mutated.
 * @param configExtension Partial config to merge into the `baseConfig`.
 */
const mergeConfigs = (baseConfig, {
  cacheSize,
  prefix,
  separator,
  experimentalParseClassName,
  extend = {},
  override = {}
}) => {
  overrideProperty(baseConfig, 'cacheSize', cacheSize);
  overrideProperty(baseConfig, 'prefix', prefix);
  overrideProperty(baseConfig, 'separator', separator);
  overrideProperty(baseConfig, 'experimentalParseClassName', experimentalParseClassName);
  for (const configKey in override) {
    overrideConfigProperties(baseConfig[configKey], override[configKey]);
  }
  for (const key in extend) {
    mergeConfigProperties(baseConfig[key], extend[key]);
  }
  return baseConfig;
};
const overrideProperty = (baseObject, overrideKey, overrideValue) => {
  if (overrideValue !== undefined) {
    baseObject[overrideKey] = overrideValue;
  }
};
const overrideConfigProperties = (baseObject, overrideObject) => {
  if (overrideObject) {
    for (const key in overrideObject) {
      overrideProperty(baseObject, key, overrideObject[key]);
    }
  }
};
const mergeConfigProperties = (baseObject, mergeObject) => {
  if (mergeObject) {
    for (const key in mergeObject) {
      const mergeValue = mergeObject[key];
      if (mergeValue !== undefined) {
        baseObject[key] = (baseObject[key] || []).concat(mergeValue);
      }
    }
  }
};
const extendTailwindMerge = (configExtension, ...createConfig) => typeof configExtension === 'function' ? createTailwindMerge(getDefaultConfig, configExtension, ...createConfig) : createTailwindMerge(() => mergeConfigs(getDefaultConfig(), configExtension), ...createConfig);
const twMerge = /*#__PURE__*/createTailwindMerge(getDefaultConfig);

//# sourceMappingURL=bundle-mjs.mjs.map

;// ./node_modules/clsx/dist/clsx.mjs
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const dist_clsx = ((/* unused pure expression or super */ null && (clsx)));
;// ./node_modules/@bsf/force-ui/dist/utilities/functions.es.js


const functions_es_c = (...r) => twMerge(clsx(...r)), i = (...r) => (...o) => r.filter(Boolean).forEach((t) => t?.(...o)), functions_es_g = (r) => {
  const o = {
    0: "gap-0",
    xxs: "gap-1",
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-5",
    xl: "gap-6",
    "2xl": "gap-8"
  };
  return o[r] || o.md;
}, functions_es_d = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12"
}, functions_es_f = () => {
  const r = window.navigator?.userAgentData?.platform || window.navigator.platform, o = [
    "macOS",
    "Macintosh",
    "MacIntel",
    "MacPPC",
    "Mac68K"
  ], t = ["Win32", "Win64", "Windows", "WinCE"];
  let e = "null";
  return o.includes(r) ? e = "Mac OS" : t.includes(r) && (e = "Windows"), e;
}, functions_es_u = (r) => r < 1024 ? `${r} bytes` : r < 1024 * 1024 ? `${(r / 1024).toFixed(2)} KB` : r < 1024 * 1024 * 1024 ? `${(r / (1024 * 1024)).toFixed(2)} MB` : `${(r / (1024 * 1024 * 1024)).toFixed(2)} GB`, functions_es_m = {
  set: (r, o) => {
    if (!(typeof window > "u"))
      try {
        localStorage.setItem(r, JSON.stringify(o));
      } catch (t) {
        console.error(t);
      }
  },
  get: (r) => {
    if (typeof window > "u")
      return null;
    try {
      const o = localStorage.getItem(r);
      return o ? JSON.parse(o) : null;
    } catch (o) {
      return console.error(o), null;
    }
  },
  remove: (r) => {
    if (!(typeof window > "u"))
      try {
        localStorage.removeItem(r);
      } catch (o) {
        console.error(o);
      }
  }
};

//# sourceMappingURL=functions.es.js.map

;// ./node_modules/@bsf/force-ui/dist/components/container/container-styles.es.js
const container_styles_es_l = {
  sm: {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12"
  },
  md: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    7: "md:grid-cols-7",
    8: "md:grid-cols-8",
    9: "md:grid-cols-9",
    10: "md:grid-cols-10",
    11: "md:grid-cols-11",
    12: "md:grid-cols-12"
  },
  lg: {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    7: "lg:grid-cols-7",
    8: "lg:grid-cols-8",
    9: "lg:grid-cols-9",
    10: "lg:grid-cols-10",
    11: "lg:grid-cols-11",
    12: "lg:grid-cols-12"
  }
}, s = {
  sm: {
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-5",
    lg: "gap-6",
    xl: "gap-6",
    "2xl": "gap-8"
  },
  md: {
    xs: "md:gap-2",
    sm: "md:gap-4",
    md: "md:gap-5",
    lg: "md:gap-6",
    xl: "md:gap-6",
    "2xl": "md:gap-8"
  },
  lg: {
    xs: "lg:gap-2",
    sm: "lg:gap-4",
    md: "lg:gap-5",
    lg: "lg:gap-6",
    xl: "lg:gap-6",
    "2xl": "lg:gap-8"
  }
}, container_styles_es_e = {
  sm: {
    xs: "gap-x-2",
    sm: "gap-x-4",
    md: "gap-x-5",
    lg: "gap-x-6",
    xl: "gap-x-6",
    "2xl": "gap-x-8"
  },
  md: {
    xs: "md:gap-x-2",
    sm: "md:gap-x-4",
    md: "md:gap-x-5",
    lg: "md:gap-x-6",
    xl: "md:gap-x-6",
    "2xl": "md:gap-x-8"
  },
  lg: {
    xs: "lg:gap-x-2",
    sm: "lg:gap-x-4",
    md: "lg:gap-x-5",
    lg: "lg:gap-x-6",
    xl: "lg:gap-x-6",
    "2xl": "lg:gap-x-8"
  }
}, container_styles_es_r = {
  sm: {
    xs: "gap-y-2",
    sm: "gap-y-4",
    md: "gap-y-5",
    lg: "gap-y-6",
    xl: "gap-y-6",
    "2xl": "gap-y-8"
  },
  md: {
    xs: "md:gap-y-2",
    sm: "md:gap-y-4",
    md: "md:gap-y-5",
    lg: "md:gap-y-6",
    xl: "md:gap-y-6",
    "2xl": "md:gap-y-8"
  },
  lg: {
    xs: "lg:gap-y-2",
    sm: "lg:gap-y-4",
    md: "lg:gap-y-5",
    lg: "lg:gap-y-6",
    xl: "lg:gap-y-6",
    "2xl": "lg:gap-y-8"
  }
}, container_styles_es_t = {
  sm: {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12"
  },
  md: {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12"
  },
  lg: {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
    5: "lg:col-span-5",
    6: "lg:col-span-6",
    7: "lg:col-span-7",
    8: "lg:col-span-8",
    9: "lg:col-span-9",
    10: "lg:col-span-10",
    11: "lg:col-span-11",
    12: "lg:col-span-12"
  }
}, container_styles_es_d = {
  sm: {
    1: "col-start-1",
    2: "col-start-2",
    3: "col-start-3",
    4: "col-start-4",
    5: "col-start-5",
    6: "col-start-6",
    7: "col-start-7",
    8: "col-start-8",
    9: "col-start-9",
    10: "col-start-10",
    11: "col-start-11",
    12: "col-start-12"
  },
  md: {
    1: "md:col-start-1",
    2: "md:col-start-2",
    3: "md:col-start-3",
    4: "md:col-start-4",
    5: "md:col-start-5",
    6: "md:col-start-6",
    7: "md:col-start-7",
    8: "md:col-start-8",
    9: "md:col-start-9",
    10: "md:col-start-10",
    11: "md:col-start-11",
    12: "md:col-start-12"
  },
  lg: {
    1: "lg:col-start-1",
    2: "lg:col-start-2",
    3: "lg:col-start-3",
    4: "lg:col-start-4",
    5: "lg:col-start-5",
    6: "lg:col-start-6",
    7: "lg:col-start-7",
    8: "lg:col-start-8",
    9: "lg:col-start-9",
    10: "lg:col-start-10",
    11: "lg:col-start-11",
    12: "lg:col-start-12"
  }
}, container_styles_es_o = {
  sm: {
    row: "grid-flow-row",
    column: "grid-flow-col",
    "row-dense": "grid-flow-row-dense",
    "column-dense": "grid-flow-col-dense"
  },
  md: {
    row: "md:grid-flow-row",
    column: "md:grid-flow-col",
    "row-dense": "md:grid-flow-row-dense",
    "column-dense": "md:grid-flow-col-dense"
  },
  lg: {
    row: "lg:grid-flow-row",
    column: "lg:grid-flow-col",
    "row-dense": "lg:grid-flow-row-dense",
    "column-dense": "lg:grid-flow-col-dense"
  }
}, container_styles_es_g = {
  sm: {
    normal: "justify-normal",
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
    stretch: "justify-stretch"
  },
  md: {
    normal: "md:justify-normal",
    start: "md:justify-start",
    end: "md:justify-end",
    center: "md:justify-center",
    between: "md:justify-between",
    around: "md:justify-around",
    evenly: "md:justify-evenly",
    stretch: "md:justify-stretch"
  },
  lg: {
    normal: "lg:justify-normal",
    start: "lg:justify-start",
    end: "lg:justify-end",
    center: "lg:justify-center",
    between: "lg:justify-between",
    around: "lg:justify-around",
    evenly: "lg:justify-evenly",
    stretch: "lg:justify-stretch"
  }
}, container_styles_es_a = {
  sm: {
    start: "items-start",
    end: "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch"
  },
  md: {
    start: "md:items-start",
    end: "md:items-end",
    center: "md:items-center",
    baseline: "md:items-baseline",
    stretch: "md:items-stretch"
  },
  lg: {
    start: "lg:items-start",
    end: "lg:items-end",
    center: "lg:items-center",
    baseline: "lg:items-baseline",
    stretch: "lg:items-stretch"
  }
}, container_styles_es_m = {
  sm: {
    start: "self-start",
    end: "self-end",
    center: "self-center",
    baseline: "self-baseline",
    stretch: "self-stretch"
  },
  md: {
    start: "md:self-start",
    end: "md:self-end",
    center: "md:self-center",
    baseline: "md:self-baseline",
    stretch: "md:self-stretch"
  },
  lg: {
    start: "lg:self-start",
    end: "lg:self-end",
    center: "lg:self-center",
    baseline: "lg:self-baseline",
    stretch: "lg:self-stretch"
  }
}, container_styles_es_c = {
  sm: {
    auto: "justify-self-auto",
    start: "justify-self-start",
    end: "justify-self-end",
    center: "justify-self-center",
    baseline: "justify-self-baseline",
    stretch: "justify-self-stretch"
  },
  md: {
    auto: "md:justify-self-auto",
    start: "md:justify-self-start",
    end: "md:justify-self-end",
    center: "md:justify-self-center",
    baseline: "md:justify-self-baseline",
    stretch: "md:justify-self-stretch"
  },
  lg: {
    auto: "lg:justify-self-auto",
    start: "lg:justify-self-start",
    end: "lg:justify-self-end",
    center: "lg:justify-self-center",
    baseline: "lg:justify-self-baseline",
    stretch: "lg:justify-self-stretch"
  }
}, container_styles_es_n = {
  sm: {
    row: "flex-row",
    "row-reverse": "flex-row-reverse",
    column: "flex-col",
    "column-reverse": "flex-col-reverse"
  },
  md: {
    row: "md:flex-row",
    "row-reverse": "md:flex-row-reverse",
    column: "md:flex-col",
    "column-reverse": "md:flex-col-reverse"
  },
  lg: {
    row: "lg:flex-row",
    "row-reverse": "lg:flex-row-reverse",
    column: "lg:flex-col",
    "column-reverse": "lg:flex-col-reverse"
  }
}, container_styles_es_i = {
  sm: {
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
    nowrap: "flex-nowrap"
  },
  md: {
    wrap: "md:flex-wrap",
    "wrap-reverse": "md:flex-wrap-reverse",
    nowrap: "md:flex-nowrap"
  },
  lg: {
    wrap: "lg:flex-wrap",
    "wrap-reverse": "lg:flex-wrap-reverse",
    nowrap: "lg:flex-nowrap"
  }
}, container_styles_es_f = {
  sm: {
    1: "w-full",
    2: "w-1/2",
    3: "w-1/3",
    4: "w-1/4",
    5: "w-1/5",
    6: "w-1/6",
    7: "w-1/7",
    8: "w-1/8",
    9: "w-1/9",
    10: "w-1/10",
    11: "w-1/11",
    12: "w-1/12"
  },
  md: {
    1: "md:w-full",
    2: "md:w-1/2",
    3: "md:w-1/3",
    4: "md:w-1/4",
    5: "md:w-1/5",
    6: "md:w-1/6",
    7: "md:w-1/7",
    8: "md:w-1/8",
    9: "md:w-1/9",
    10: "md:w-1/10",
    11: "md:w-1/11",
    12: "md:w-1/12"
  },
  lg: {
    1: "lg:w-full",
    2: "lg:w-1/2",
    3: "lg:w-1/3",
    4: "lg:w-1/4",
    5: "lg:w-1/5",
    6: "lg:w-1/6",
    7: "lg:w-1/7",
    8: "lg:w-1/8",
    9: "lg:w-1/9",
    10: "lg:w-1/10",
    11: "lg:w-1/11",
    12: "lg:w-1/12"
  }
}, container_styles_es_p = {
  sm: {
    1: "order-1",
    2: "order-2",
    3: "order-3",
    4: "order-4",
    5: "order-5",
    6: "order-6",
    7: "order-7",
    8: "order-8",
    9: "order-9",
    10: "order-10",
    11: "order-11",
    12: "order-12",
    first: "order-first",
    last: "order-last",
    none: "order-none"
  },
  md: {
    1: "md:order-1",
    2: "md:order-2",
    3: "md:order-3",
    4: "md:order-4",
    5: "md:order-5",
    6: "md:order-6",
    7: "md:order-7",
    8: "md:order-8",
    9: "md:order-9",
    10: "md:order-10",
    11: "md:order-11",
    12: "md:order-12",
    first: "md:order-first",
    last: "md:order-last",
    none: "md:order-none"
  },
  lg: {
    1: "lg:order-1",
    2: "lg:order-2",
    3: "lg:order-3",
    4: "lg:order-4",
    5: "lg:order-5",
    6: "lg:order-6",
    7: "lg:order-7",
    8: "lg:order-8",
    9: "lg:order-9",
    10: "lg:order-10",
    11: "lg:order-11",
    12: "lg:order-12",
    first: "lg:order-first",
    last: "lg:order-last",
    none: "lg:order-none"
  }
}, w = {
  sm: {
    0: "grow-0",
    1: "grow"
  },
  md: {
    0: "md:grow-0",
    1: "md:grow"
  },
  lg: {
    0: "lg:grow-0",
    1: "lg:grow"
  }
}, container_styles_es_u = {
  sm: {
    0: "shrink-0",
    1: "shrink"
  },
  md: {
    0: "md:shrink-0",
    1: "md:shrink"
  },
  lg: {
    0: "lg:shrink-0",
    1: "lg:shrink"
  }
};

//# sourceMappingURL=container-styles.es.js.map

;// ./node_modules/@bsf/force-ui/dist/components/container/container-utils.es.js
const container_utils_es_p = (o, r, i, c = "sm") => {
  const t = [];
  switch (typeof o) {
    case "object":
      for (const [n, e] of Object.entries(o))
        r[n] && t.push(
          r?.[n]?.[e] ?? r?.[n]?.[i?.[n]] ?? ""
        );
      break;
    case "string":
    case "number":
      const b = c;
      t.push(
        r?.[b]?.[o] ?? r?.[b]?.[i?.[b]] ?? ""
      );
      break;
    default:
      if (o === void 0)
        break;
      t.push(
        r?.[c]?.[i] ?? ""
      );
      break;
  }
  return t.join(" ");
};

//# sourceMappingURL=container-utils.es.js.map

;// ./node_modules/@bsf/force-ui/dist/components/container/grid-container.es.js




const B = ({
  className: a,
  cols: l,
  gap: e,
  gapX: o,
  gapY: m,
  align: t,
  justify: r,
  gridFlow: i,
  colsSubGrid: C = !1,
  rowsSubGrid: n = !1,
  autoRows: N = !1,
  autoCols: f = !1,
  children: d,
  ...u
}) => {
  const p = container_utils_es_p(l, container_styles_es_l, 1), S = container_utils_es_p(e, s, "sm"), j = container_utils_es_p(o, container_styles_es_e, ""), w = container_utils_es_p(m, container_styles_es_r, ""), y = container_utils_es_p(t, container_styles_es_a, ""), b = container_utils_es_p(r, container_styles_es_g, ""), v = container_utils_es_p(i, container_styles_es_o, "");
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    "div",
    {
      className: functions_es_c(
        "grid",
        {
          "grid-cols-subgrid": C,
          "grid-rows-subgrid": n,
          "auto-cols-auto": f,
          "auto-rows-auto": N
        },
        p,
        S,
        j,
        w,
        y,
        b,
        v,
        a
      ),
      ...u,
      children: d
    }
  );
}, D = ({
  className: a,
  children: l,
  colSpan: e,
  colStart: o,
  alignSelf: m,
  justifySelf: t,
  ...r
}) => {
  const i = container_utils_es_p(e, container_styles_es_t, 0), C = container_utils_es_p(
    o,
    container_styles_es_d,
    0
  ), n = container_utils_es_p(
    m,
    container_styles_es_m,
    ""
  ), N = container_utils_es_p(
    t,
    container_styles_es_c,
    ""
  );
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    "div",
    {
      className: functions_es_c(
        i,
        C,
        n,
        N,
        a
      ),
      ...r,
      children: l
    }
  );
};
B.Item = D;

//# sourceMappingURL=grid-container.es.js.map

;// ./node_modules/@bsf/force-ui/dist/components/container/container.es.js






const container_es_g = (0,external_React_namespaceObject.createContext)({}), M = () => (0,external_React_namespaceObject.useContext)(container_es_g), S = ({
  containerType: a = "flex",
  // flex, (grid - functionality not implemented)
  gap: r = "sm",
  // xs, sm, md, lg, xl, 2xl
  gapX: m,
  gapY: t,
  direction: N,
  // row, row-reverse, column, column reverse
  justify: o,
  // justify-content (normal, start, end, center, between, around, evenly, stretch)
  align: n,
  // align-items (start, end, center, baseline, stretch)
  wrap: c,
  // nowrap, wrap, wrap-reverse
  cols: l,
  className: C,
  children: i,
  ...f
}) => {
  if (a === "grid")
    return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
      container_es_g.Provider,
      {
        value: {
          containerType: a
        },
        children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
          B,
          {
            className: C,
            gap: r,
            gapX: m,
            gapY: t,
            cols: l,
            children: i,
            align: n,
            justify: o,
            ...f
          }
        )
      }
    );
  const d = container_utils_es_p(c, container_styles_es_i, ""), u = container_utils_es_p(r, s, "sm"), x = container_utils_es_p(m, container_styles_es_e, ""), p = container_utils_es_p(t, container_styles_es_r, ""), w = container_utils_es_p(
    N,
    container_styles_es_n,
    ""
  ), j = container_utils_es_p(
    o,
    container_styles_es_g,
    ""
  ), k = container_utils_es_p(n, container_styles_es_a, ""), y = functions_es_c(
    "flex",
    d,
    u,
    x,
    p,
    w,
    j,
    k,
    C
  ), G = () => a === "flex" ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("div", { className: y, children: i }) : /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    B,
    {
      className: C,
      gap: r,
      gapX: m,
      gapY: t,
      cols: l,
      children: i,
      align: n,
      justify: o,
      ...f
    }
  );
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    container_es_g.Provider,
    {
      value: {
        containerType: a,
        cols: l
      },
      children: G()
    }
  );
}, b = ({
  grow: a,
  shrink: r,
  order: m,
  alignSelf: t,
  justifySelf: N,
  className: o,
  children: n,
  ...c
}) => {
  const { containerType: l, cols: C } = M();
  if (l === "grid")
    return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
      B.Item,
      {
        className: o,
        alignSelf: t,
        justifySelf: N,
        children: n,
        ...c
      }
    );
  const i = container_utils_es_p(
    t,
    container_styles_es_m,
    ""
  ), f = container_utils_es_p(
    N,
    container_styles_es_c,
    ""
  ), d = container_utils_es_p(a, w, 0), u = container_utils_es_p(r, container_styles_es_u, 0), x = container_utils_es_p(m, container_styles_es_p, 0), p = container_utils_es_p(C, container_styles_es_f, 1);
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    "div",
    {
      className: functions_es_c(
        "box-border",
        d,
        u,
        x,
        i,
        f,
        p,
        o
      ),
      children: n
    }
  );
};
S.Item = b;
S.displayName = "Container";
b.displayName = "Container.Item";

//# sourceMappingURL=container.es.js.map

;// ./node_modules/@bsf/force-ui/dist/components/button/button.es.js



const R = (0,external_React_namespaceObject.forwardRef)(
  (u, b) => {
    const {
      variant: n = "primary",
      // primary, secondary, outline, ghost, link
      size: g = "md",
      // xs, sm, md, lg
      type: c = "button",
      tag: h = "button",
      className: m,
      children: r,
      disabled: t = !1,
      destructive: s = !1,
      // true, false
      icon: e = null,
      // icon component
      iconPosition: v = "left",
      // left, right,
      loading: f = !1,
      ...p
    } = u, x = "outline outline-1 border-none cursor-pointer transition-colors duration-300 ease-in-out text-xs font-semibold focus:ring-2 focus:ring-toggle-on focus:ring-offset-2 disabled:text-text-disabled", y = s && "focus:ring-focus-error", w = f ? "opacity-50 disabled:cursor-not-allowed" : "", N = {
      primary: "text-text-on-color bg-button-primary hover:bg-button-primary-hover outline-button-primary hover:outline-button-primary-hover shadow-xs disabled:shadow-none focus:shadow-none disabled:bg-button-disabled disabled:outline-button-disabled",
      secondary: "text-text-on-color bg-button-secondary hover:bg-button-secondary-hover outline-button-secondary hover:outline-button-secondary-hover shadow-xs focus:shadow-none disabled:shadow-none disabled:bg-button-disabled disabled:outline-button-disabled",
      outline: "text-button-tertiary-color outline-border-subtle bg-button-tertiary shadow-sm focus:shadow-none hover:bg-button-tertiary-hover hover:outline-border-subtle disabled:bg-button-tertiary disabled:outline-border-disabled",
      ghost: "text-text-primary bg-transparent outline-transparent hover:bg-button-tertiary-hover",
      link: "outline-none text-link-primary bg-transparent hover:text-link-primary-hover hover:underline p-0 border-0 leading-none"
    }[n], C = s && !t ? {
      primary: "bg-button-danger hover:bg-button-danger-hover outline-button-danger hover:outline-button-danger-hover",
      secondary: "bg-button-danger hover:bg-button-danger-hover outline-button-danger hover:outline-button-danger-hover",
      outline: "text-button-danger outline outline-1 outline-button-danger hover:outline-button-danger bg-button-tertiary hover:bg-field-background-error",
      ghost: "text-button-danger hover:bg-field-background-error",
      link: "text-button-danger hover:text-button-danger-secondary"
    }[n] : "", k = {
      xs: "p-1 rounded [&>svg]:size-4",
      sm: "p-2 rounded [&>svg]:size-4 gap-0.5",
      md: "p-2.5 rounded-md text-sm [&>svg]:size-5 gap-1",
      lg: "p-3 rounded-lg text-base [&>svg]:size-6 gap-1"
    }[g];
    let a, i = null, d = "";
    return e && (d = "flex items-center justify-center", v === "left" ? a = e : i = e), /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
      h,
      {
        ref: b,
        type: c,
        className: functions_es_c(
          d,
          x,
          k,
          N,
          C,
          y,
          w,
          {
            "cursor-default": t
          },
          m
        ),
        disabled: t,
        "aria-disabled": t,
        ...p,
        children: [
          /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_React_namespaceObject.Fragment, { children: a }, "left-icon"),
          r ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("span", { className: "px-1", children: r }) : null,
          /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_React_namespaceObject.Fragment, { children: i }, "right-icon")
        ]
      }
    );
  }
);
R.displayName = "Button";

//# sourceMappingURL=button.es.js.map

;// ./node_modules/@bsf/force-ui/dist/components/label/label.es.js



const label_es_c = (0,external_React_namespaceObject.forwardRef)(
  ({
    children: e = null,
    tag: l = "label",
    size: r = "sm",
    // xs, sm, md
    className: a = "",
    variant: t = "neutral",
    // neutral, help, error, disabled
    required: o = !1,
    ...d
  }, f) => {
    const i = "font-medium text-field-label flex items-center gap-0.5", n = {
      xs: "text-xs [&>*]:text-xs [&>svg]:h-3 [&>svg]:w-3",
      sm: "text-sm [&>*]:text-sm [&>svg]:h-4 [&>svg]:w-4",
      md: "text-base [&>*]:text-base [&>svg]:h-5 [&>svg]:w-5"
    }, x = {
      neutral: "text-field-label [&>*]:text-field-label",
      help: "text-field-helper [&>*]:text-field-helper",
      error: "text-support-error [&>*]:text-support-error",
      disabled: "text-field-color-disabled disabled cursor-not-allowed [&>*]:text-field-color-disabled"
    }, m = {
      neutral: "",
      help: "font-normal",
      error: "font-normal",
      disabled: ""
    };
    if (!e)
      return null;
    let s = "";
    return o && (s = "after:content-['*'] after:text-field-required after:ml-0.5"), /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
      l,
      {
        ref: f,
        className: functions_es_c(
          i,
          n[r],
          x[t],
          s,
          m?.[t],
          a
        ),
        ...d,
        children: e
      }
    );
  }
);
label_es_c.displayName = "Label";

//# sourceMappingURL=label.es.js.map

;// ./node_modules/nanoid/url-alphabet/index.js
const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'

;// ./node_modules/nanoid/index.browser.js
/* @ts-self-types="./index.d.ts" */


let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << Math.log2(alphabet.length - 1)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step | 0
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length >= size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size | 0, random)
let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array((size |= 0)))
  while (size--) {
    id += urlAlphabet[bytes[size] & 63]
  }
  return id
}

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/shared/src/utils.js
/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && array.indexOf(className) === index;
}).join(" ");


//# sourceMappingURL=utils.js.map

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
 * @license lucide-react v0.417.0 - ISC
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

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/Icon.js
/**
 * @license lucide-react v0.417.0 - ISC
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
  }, ref) => {
    return (0,external_React_namespaceObject.createElement)(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0,external_React_namespaceObject.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);


//# sourceMappingURL=Icon.js.map

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const createLucideIcon = (iconName, iconNode) => {
  const Component = (0,external_React_namespaceObject.forwardRef)(
    ({ className, ...props }, ref) => (0,external_React_namespaceObject.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};


//# sourceMappingURL=createLucideIcon.js.map

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/icons/info.js
/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);


//# sourceMappingURL=info.js.map

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/icons/check.js
/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);


//# sourceMappingURL=check.js.map

;// ./node_modules/@bsf/force-ui/dist/components/radio-button/styles.es.js
const styles_es_e = {
  primary: {
    checkbox: "border-border-strong hover:border-border-interactive checked:border-border-interactive bg-white checked:bg-toggle-on checked:hover:bg-toggle-on-hover checked:hover:border-toggle-on-hover focus:ring-2 focus:ring-offset-2 focus:ring-focus",
    icon: "text-white"
  }
}, styles_es_s = {
  checkbox: "disabled:bg-white checked:disabled:bg-white disabled:border-border-disabled checked:disabled:border-border-disabled cursor-not-allowed",
  icon: "peer-disabled:text-border-disabled cursor-not-allowed"
}, styles_es_o = {
  sm: "text-sm leading-5",
  md: "text-base leading-6"
}, styles_es_r = {
  sm: {
    checkbox: "size-4",
    icon: "size-1.5",
    info: "size-4"
  },
  md: {
    checkbox: "size-5",
    icon: "size-2",
    info: "size-5"
  }
}, t = {
  xs: "py-1 px-1 text-sm gap-0.5 [&>svg]:size-4",
  sm: "py-1 px-1.5 text-base gap-1 [&>svg]:size-4",
  md: "py-2 px-2.5 text-base gap-1 [&>svg]:size-5",
  lg: "py-2.5 px-3 text-base gap-1 [&>svg]:size-6"
}, styles_es_d = "border-0 border-r border-border-subtle border-solid", styles_es_i = "bg-background-primary text-primary cursor-pointer flex items-center justify-center", styles_es_c = "hover:bg-button-tertiary-hover", styles_es_b = "focus:outline-none";

//# sourceMappingURL=styles.es.js.map

;// ./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
  return typeof window !== 'undefined';
}
function floating_ui_utils_dom_getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function floating_ui_utils_dom_getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof floating_ui_utils_dom_getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof floating_ui_utils_dom_getWindow(value).Element;
}
function floating_ui_utils_dom_isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof floating_ui_utils_dom_getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof floating_ui_utils_dom_getWindow(value).ShadowRoot;
}
const invalidOverflowDisplayValues = /*#__PURE__*/new Set(['inline', 'contents']);
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = floating_ui_utils_dom_getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
}
const tableElements = /*#__PURE__*/new Set(['table', 'td', 'th']);
function isTableElement(element) {
  return tableElements.has(floating_ui_utils_dom_getNodeName(element));
}
const topLayerSelectors = [':popover-open', ':modal'];
function isTopLayer(element) {
  return topLayerSelectors.some(selector => {
    try {
      return element.matches(selector);
    } catch (_e) {
      return false;
    }
  });
}
const transformProperties = ['transform', 'translate', 'scale', 'rotate', 'perspective'];
const willChangeValues = ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'];
const containValues = ['paint', 'layout', 'strict', 'content'];
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? floating_ui_utils_dom_getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return transformProperties.some(value => css[value] ? css[value] !== 'none' : false) || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || willChangeValues.some(value => (css.willChange || '').includes(value)) || containValues.some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (floating_ui_utils_dom_isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
const lastTraversableNodeNames = /*#__PURE__*/new Set(['html', 'body', '#document']);
function isLastTraversableNode(node) {
  return lastTraversableNodeNames.has(floating_ui_utils_dom_getNodeName(node));
}
function floating_ui_utils_dom_getComputedStyle(element) {
  return floating_ui_utils_dom_getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (floating_ui_utils_dom_getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (floating_ui_utils_dom_isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = floating_ui_utils_dom_getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}



;// ./node_modules/@floating-ui/react/dist/floating-ui.react.utils.mjs


function floating_ui_react_utils_activeElement(doc) {
  let activeElement = doc.activeElement;
  while (((_activeElement = activeElement) == null || (_activeElement = _activeElement.shadowRoot) == null ? void 0 : _activeElement.activeElement) != null) {
    var _activeElement;
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
}
function floating_ui_react_utils_contains(parent, child) {
  if (!parent || !child) {
    return false;
  }
  const rootNode = child.getRootNode == null ? void 0 : child.getRootNode();

  // First, attempt with faster native method
  if (parent.contains(child)) {
    return true;
  }

  // then fallback to custom implementation with Shadow DOM support
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) {
        return true;
      }
      // @ts-ignore
      next = next.parentNode || next.host;
    }
  }

  // Give up, the result is false
  return false;
}
// Avoid Chrome DevTools blue warning.
function floating_ui_react_utils_getPlatform() {
  const uaData = navigator.userAgentData;
  if (uaData != null && uaData.platform) {
    return uaData.platform;
  }
  return navigator.platform;
}
function floating_ui_react_utils_getUserAgent() {
  const uaData = navigator.userAgentData;
  if (uaData && Array.isArray(uaData.brands)) {
    return uaData.brands.map(_ref => {
      let {
        brand,
        version
      } = _ref;
      return brand + "/" + version;
    }).join(' ');
  }
  return navigator.userAgent;
}

// License: https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/utils/src/isVirtualEvent.ts
function floating_ui_react_utils_isVirtualClick(event) {
  // FIXME: Firefox is now emitting a deprecation warning for `mozInputSource`.
  // Try to find a workaround for this. `react-aria` source still has the check.
  if (event.mozInputSource === 0 && event.isTrusted) {
    return true;
  }
  if (isAndroid() && event.pointerType) {
    return event.type === 'click' && event.buttons === 1;
  }
  return event.detail === 0 && !event.pointerType;
}
function floating_ui_react_utils_isVirtualPointerEvent(event) {
  if (isJSDOM()) return false;
  return !isAndroid() && event.width === 0 && event.height === 0 || isAndroid() && event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'mouse' ||
  // iOS VoiceOver returns 0.333• for width/height.
  event.width < 1 && event.height < 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'touch';
}
function floating_ui_react_utils_isSafari() {
  // Chrome DevTools does not complain about navigator.vendor
  return /apple/i.test(navigator.vendor);
}
function isAndroid() {
  const re = /android/i;
  return re.test(floating_ui_react_utils_getPlatform()) || re.test(floating_ui_react_utils_getUserAgent());
}
function floating_ui_react_utils_isMac() {
  return floating_ui_react_utils_getPlatform().toLowerCase().startsWith('mac') && !navigator.maxTouchPoints;
}
function isJSDOM() {
  return floating_ui_react_utils_getUserAgent().includes('jsdom/');
}
function floating_ui_react_utils_isMouseLikePointerType(pointerType, strict) {
  // On some Linux machines with Chromium, mouse inputs return a `pointerType`
  // of "pen": https://github.com/floating-ui/floating-ui/issues/2015
  const values = ['mouse', 'pen'];
  if (!strict) {
    values.push('', undefined);
  }
  return values.includes(pointerType);
}
function isReactEvent(event) {
  return 'nativeEvent' in event;
}
function isRootElement(element) {
  return element.matches('html,body');
}
function floating_ui_react_utils_getDocument(node) {
  return (node == null ? void 0 : node.ownerDocument) || document;
}
function isEventTargetWithin(event, node) {
  if (node == null) {
    return false;
  }
  if ('composedPath' in event) {
    return event.composedPath().includes(node);
  }

  // TS thinks `event` is of type never as it assumes all browsers support composedPath, but browsers without shadow dom don't
  const e = event;
  return e.target != null && node.contains(e.target);
}
function floating_ui_react_utils_getTarget(event) {
  if ('composedPath' in event) {
    return event.composedPath()[0];
  }

  // TS thinks `event` is of type never as it assumes all browsers support
  // `composedPath()`, but browsers without shadow DOM don't.
  return event.target;
}
const TYPEABLE_SELECTOR = "input:not([type='hidden']):not([disabled])," + "[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
function isTypeableElement(element) {
  return floating_ui_utils_dom_isHTMLElement(element) && element.matches(TYPEABLE_SELECTOR);
}
function floating_ui_react_utils_stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
function floating_ui_react_utils_isTypeableCombobox(element) {
  if (!element) return false;
  return element.getAttribute('role') === 'combobox' && isTypeableElement(element);
}



;// ./node_modules/tabbable/dist/index.esm.js
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
// NOTE: separate `:not()` selectors has broader browser support than the newer
//  `:not([inert], [inert] *)` (Feb 2023)
// CAREFUL: JSDom does not support `:not([inert] *)` as a selector; using it causes
//  the entire query to fail, resulting in no nodes found, which will break a lot
//  of things... so we have to rely on JS to identify nodes inside an inert container
var candidateSelectors = ['input:not([inert])', 'select:not([inert])', 'textarea:not([inert])', 'a[href]:not([inert])', 'button:not([inert])', '[tabindex]:not(slot):not([inert])', 'audio[controls]:not([inert])', 'video[controls]:not([inert])', '[contenteditable]:not([contenteditable="false"]):not([inert])', 'details>summary:first-of-type:not([inert])', 'details:not([inert])'];
var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
var NoElement = typeof Element === 'undefined';
var matches = NoElement ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function (element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function (element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};

/**
 * Determines if a node is inert or in an inert ancestor.
 * @param {Element} [node]
 * @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
 *  see if any of them are inert. If false, only `node` itself is considered.
 * @returns {boolean} True if inert itself or by way of being in an inert ancestor.
 *  False if `node` is falsy.
 */
var isInert = function isInert(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  // CAREFUL: JSDom does not support inert at all, so we can't use the `HTMLElement.inert`
  //  JS API property; we have to check the attribute, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's an active element
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, 'inert');
  var inert = inertAtt === '' || inertAtt === 'true';

  // NOTE: this could also be handled with `node.matches('[inert], :is([inert] *)')`
  //  if it weren't for `matches()` not being a function on shadow roots; the following
  //  code works for any kind of node
  // CAREFUL: JSDom does not appear to support certain selectors like `:not([inert] *)`
  //  so it likely would not support `:is([inert] *)` either...
  var result = inert || lookUp && node && isInert(node.parentNode); // recursive

  return result;
};

/**
 * Determines if a node's content is editable.
 * @param {Element} [node]
 * @returns True if it's content-editable; false if it's not or `node` is falsy.
 */
var isContentEditable = function isContentEditable(node) {
  var _node$getAttribute2;
  // CAREFUL: JSDom does not support the `HTMLElement.isContentEditable` API so we have
  //  to use the attribute directly to check for this, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's a non-editable element
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, 'contenteditable');
  return attValue === '' || attValue === 'true';
};

/**
 * @param {Element} el container to check in
 * @param {boolean} includeContainer add container to check
 * @param {(node: Element) => boolean} filter filter candidates
 * @returns {Element[]}
 */
var getCandidates = function getCandidates(el, includeContainer, filter) {
  // even if `includeContainer=false`, we still have to check it for inertness because
  //  if it's inert, all its children are inert
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};

/**
 * @callback GetShadowRoot
 * @param {Element} element to check for shadow root
 * @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
 */

/**
 * @callback ShadowRootFilter
 * @param {Element} shadowHostNode the element which contains shadow content
 * @returns {boolean} true if a shadow root could potentially contain valid candidates.
 */

/**
 * @typedef {Object} CandidateScope
 * @property {Element} scopeParent contains inner candidates
 * @property {Element[]} candidates list of candidates found in the scope parent
 */

/**
 * @typedef {Object} IterativeOptions
 * @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
 *  if a function, implies shadow support is enabled and either returns the shadow root of an element
 *  or a boolean stating if it has an undisclosed shadow root
 * @property {(node: Element) => boolean} filter filter candidates
 * @property {boolean} flatten if true then result will flatten any CandidateScope into the returned list
 * @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
 */

/**
 * @param {Element[]} elements list of element containers to match candidates from
 * @param {boolean} includeContainer add container list to check
 * @param {IterativeOptions} options
 * @returns {Array.<Element|CandidateScope>}
 */
var getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      // no need to look up since we're drilling down
      // anything inside this container will also be inert
      continue;
    }
    if (element.tagName === 'SLOT') {
      // add shadow dom slot scope (slot itself cannot be focusable)
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      // check candidate element
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }

      // iterate over shadow content if possible
      var shadowRoot = element.shadowRoot ||
      // check for an undisclosed shadow
      typeof options.getShadowRoot === 'function' && options.getShadowRoot(element);

      // no inert look up because we're already drilling down and checking for inertness
      //  on the way down, so all containers to this root node should have already been
      //  vetted as non-inert
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
        //  shadow exists, so look at light dom children as fallback BUT create a scope for any
        //  child candidates found because they're likely slotted elements (elements that are
        //  children of the web component element (which has the shadow), in the light dom, but
        //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
        //  _after_ we return from this recursive call
        var _nestedCandidates = getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        // there's not shadow so just dig into the element's (light dom) children
        //  __without__ giving the element special scope treatment
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};

/**
 * @private
 * Determines if the node has an explicitly specified `tabindex` attribute.
 * @param {HTMLElement} node
 * @returns {boolean} True if so; false if not.
 */
var hasTabIndex = function hasTabIndex(node) {
  return !isNaN(parseInt(node.getAttribute('tabindex'), 10));
};

/**
 * Determine the tab index of a given node.
 * @param {HTMLElement} node
 * @returns {number} Tab order (negative, 0, or positive number).
 * @throws {Error} If `node` is falsy.
 */
var getTabIndex = function getTabIndex(node) {
  if (!node) {
    throw new Error('No node provided');
  }
  if (node.tabIndex < 0) {
    // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
    // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
    // yet they are still part of the regular tab order; in FF, they get a default
    // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
    // order, consider their tab index to be 0.
    // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};

/**
 * Determine the tab index of a given node __for sort order purposes__.
 * @param {HTMLElement} node
 * @param {boolean} [isScope] True for a custom element with shadow root or slot that, by default,
 *  has tabIndex -1, but needs to be sorted by document order in order for its content to be
 *  inserted into the correct sort position.
 * @returns {number} Tab order (negative, 0, or positive number).
 */
var getSortOrderTabIndex = function getSortOrderTabIndex(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput(node) {
  return node.tagName === 'INPUT';
};
var isHiddenInput = function isHiddenInput(node) {
  return isInput(node) && node.type === 'hidden';
};
var isDetailsWithSummary = function isDetailsWithSummary(node) {
  var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
    return child.tagName === 'SUMMARY';
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio(node) {
  return isInput(node) && node.type === 'radio';
};
var isNonTabbableRadio = function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
};

// determines if a node is ultimately attached to the window's document
var isNodeAttached = function isNodeAttached(node) {
  var _nodeRoot;
  // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
  //  (but NOT _the_ document; see second 'If' comment below for more).
  // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
  //  is attached, and the one we need to check if it's in the document or not (because the
  //  shadow, and all nodes it contains, is never considered in the document since shadows
  //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
  //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
  //  visibility, including all the nodes it contains). The host could be any normal node,
  //  or a custom element (i.e. web component). Either way, that's the one that is considered
  //  part of the document, not the shadow root, nor any of its children (i.e. the node being
  //  tested).
  // To further complicate things, we have to look all the way up until we find a shadow HOST
  //  that is attached (or find none) because the node might be in nested shadows...
  // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
  //  document (per the docs) and while it's a Document-type object, that document does not
  //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
  //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
  //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
  //  node is actually detached.
  // NOTE: If `nodeRootHost` or `node` happens to be the `document` itself (which is possible
  //  if a tabbable/focusable node was quickly added to the DOM, focused, and then removed
  //  from the DOM as in https://github.com/focus-trap/focus-trap-react/issues/905), then
  //  `ownerDocument` will be `null`, hence the optional chaining on it.
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;

  // in some cases, a detached node will return itself as the root instead of a document or
  //  shadow root object, in which case, we shouldn't try to look further up the host chain
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      // since it's not attached and we have a root host, the node MUST be in a nested shadow DOM,
      //  which means we need to get the host's host and check if that parent host is contained
      //  in (i.e. attached to) the document
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(),
    width = _node$getBoundingClie.width,
    height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden(node, _ref) {
  var displayCheck = _ref.displayCheck,
    getShadowRoot = _ref.getShadowRoot;
  // NOTE: visibility will be `undefined` if node is detached from the document
  //  (see notes about this further down), which means we will consider it visible
  //  (this is legacy behavior from a very long way back)
  // NOTE: we check this regardless of `displayCheck="none"` because this is a
  //  _visibility_ check, not a _display_ check
  if (getComputedStyle(node).visibility === 'hidden') {
    return true;
  }
  var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
    return true;
  }
  if (!displayCheck || displayCheck === 'full' || displayCheck === 'legacy-full') {
    if (typeof getShadowRoot === 'function') {
      // figure out if we should consider the node to be in an undisclosed shadow and use the
      //  'non-zero-area' fallback
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
        ) {
          // node has an undisclosed shadow which means we can only treat it as a black box, so we
          //  fall back to a non-zero-area test
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          // iterate up slot
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          // cross shadow boundary
          node = rootNode.host;
        } else {
          // iterate up normal dom
          node = parentElement;
        }
      }
      node = originalNode;
    }
    // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
    //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
    //  it might be a falsy value, which means shadow DOM support is disabled

    // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
    //  now we can just test to see if it would normally be visible or not, provided it's
    //  attached to the main document.
    // NOTE: We must consider case where node is inside a shadow DOM and given directly to
    //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.

    if (isNodeAttached(node)) {
      // this works wherever the node is: if there's at least one client rect, it's
      //  somehow displayed; it also covers the CSS 'display: contents' case where the
      //  node itself is hidden in place of its contents; and there's no need to search
      //  up the hierarchy either
      return !node.getClientRects().length;
    }

    // Else, the node isn't attached to the document, which means the `getClientRects()`
    //  API will __always__ return zero rects (this can happen, for example, if React
    //  is used to render nodes onto a detached tree, as confirmed in this thread:
    //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
    //
    // It also means that even window.getComputedStyle(node).display will return `undefined`
    //  because styles are only computed for nodes that are in the document.
    //
    // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
    //  somehow. Though it was never stated officially, anyone who has ever used tabbable
    //  APIs on nodes in detached containers has actually implicitly used tabbable in what
    //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
    //  considering __everything__ to be visible because of the innability to determine styles.
    //
    // v6.0.0: As of this major release, the default 'full' option __no longer treats detached
    //  nodes as visible with the 'none' fallback.__
    if (displayCheck !== 'legacy-full') {
      return true; // hidden
    }
    // else, fallback to 'none' mode and consider the node visible
  } else if (displayCheck === 'non-zero-area') {
    // NOTE: Even though this tests that the node's client rect is non-zero to determine
    //  whether it's displayed, and that a detached node will __always__ have a zero-area
    //  client rect, we don't special-case for whether the node is attached or not. In
    //  this mode, we do want to consider nodes that have a zero area to be hidden at all
    //  times, and that includes attached or not.
    return isZeroArea(node);
  }

  // visible, as far as we can tell, or per current `displayCheck=none` mode, we assume
  //  it's visible
  return false;
};

// form fields (nested) inside a disabled fieldset are not focusable/tabbable
//  unless they are in the _first_ <legend> element of the top-most disabled
//  fieldset
var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    // check if `node` is contained in a disabled <fieldset>
    while (parentNode) {
      if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
        // look for the first <legend> among the children of the disabled <fieldset>
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          // when the first <legend> (in document order) is found
          if (child.tagName === 'LEGEND') {
            // if its parent <fieldset> is not nested in another disabled <fieldset>,
            // return whether `node` is a descendant of its first <legend>
            return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
          }
        }
        // the disabled <fieldset> containing `node` has no <legend>
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }

  // else, node's tabbable/focusable state should not be affected by a fieldset's
  //  enabled/disabled state
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
  if (node.disabled ||
  // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) ||
  // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute('tabindex'), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  // If a custom element has an explicit negative tabindex,
  // browsers will not allow tab targeting said element's children.
  return false;
};

/**
 * @param {Array.<Element|CandidateScope>} candidates
 * @returns Element[]
 */
var sortByOrder = function sortByOrder(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function (item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? sortByOrder(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item: item,
        isScope: isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function (acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var index_esm_tabbable = function tabbable(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
var focusable = function focusable(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var index_esm_isTabbable = function isTabbable(node, options) {
  options = options || {};
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* #__PURE__ */(/* unused pure expression or super */ null && (candidateSelectors.concat('iframe').join(',')));
var isFocusable = function isFocusable(node, options) {
  options = options || {};
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};


//# sourceMappingURL=index.esm.js.map

// EXTERNAL MODULE: external "ReactDOM"
var external_ReactDOM_ = __webpack_require__(795);
;// ./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const floating_ui_utils_sides = (/* unused pure expression or super */ null && (['top', 'right', 'bottom', 'left']));
const alignments = (/* unused pure expression or super */ null && (['start', 'end']));
const floating_ui_utils_placements = /*#__PURE__*/(/* unused pure expression or super */ null && (floating_ui_utils_sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), [])));
const floating_ui_utils_min = Math.min;
const floating_ui_utils_max = Math.max;
const floating_ui_utils_round = Math.round;
const floating_ui_utils_floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return floating_ui_utils_max(start, floating_ui_utils_min(value, end));
}
function floating_ui_utils_evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function floating_ui_utils_getSide(placement) {
  return placement.split('-')[0];
}
function floating_ui_utils_getAlignment(placement) {
  return placement.split('-')[1];
}
function floating_ui_utils_getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
const yAxisSides = /*#__PURE__*/new Set(['top', 'bottom']);
function floating_ui_utils_getSideAxis(placement) {
  return yAxisSides.has(floating_ui_utils_getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return floating_ui_utils_getOppositeAxis(floating_ui_utils_getSideAxis(placement));
}
function floating_ui_utils_getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = floating_ui_utils_getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [floating_ui_utils_getOppositeAlignmentPlacement(placement), oppositePlacement, floating_ui_utils_getOppositeAlignmentPlacement(oppositePlacement)];
}
function floating_ui_utils_getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = floating_ui_utils_getAlignment(placement);
  let list = getSideList(floating_ui_utils_getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(floating_ui_utils_getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function floating_ui_utils_getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function floating_ui_utils_rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}



;// ./node_modules/@floating-ui/core/dist/floating-ui.core.mjs



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = floating_ui_utils_getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = floating_ui_utils_getSide(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (floating_ui_utils_getAlignment(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function floating_ui_core_detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = floating_ui_utils_evaluate(options, state);
  const paddingObject = floating_ui_utils_getPaddingObject(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = floating_ui_utils_rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = floating_ui_utils_rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = floating_ui_utils_evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = floating_ui_utils_getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = floating_ui_utils_min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = floating_ui_utils_min(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = clamp(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && floating_ui_utils_getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => getAlignment(placement) === alignment), ...allowedPlacements.filter(placement => getAlignment(placement) !== alignment)] : allowedPlacements.filter(placement => getSide(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return getAlignment(placement) === alignment || (autoAlignment ? getOppositeAlignmentPlacement(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const overflow = await floating_ui_core_detectOverflow(state, detectOverflowOptions);
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }
      const alignmentSides = getAlignmentSides(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const currentOverflows = [overflow[getSide(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = getAlignment(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      getAlignment(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = floating_ui_utils_evaluate(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = floating_ui_utils_getSide(placement);
      const initialSideAxis = floating_ui_utils_getSideAxis(initialPlacement);
      const isBasePlacement = floating_ui_utils_getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await floating_ui_core_detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = floating_ui_utils_getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== floating_ui_utils_getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => floating_ui_utils_getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = floating_ui_utils_getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await floating_ui_core_detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await floating_ui_core_detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = min(...rects.map(rect => rect.left));
  const minY = min(...rects.map(rect => rect.top));
  const maxX = max(...rects.map(rect => rect.right));
  const maxY = max(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => rectToClientRect(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = evaluate(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = rectToClientRect(getBoundingRect(nativeClientRects));
      const paddingObject = getPaddingObject(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if (getSideAxis(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = getSide(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          const isLeftSide = getSide(placement) === 'left';
          const maxRight = max(...clientRects.map(rect => rect.right));
          const minLeft = min(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = floating_ui_utils_getSide(placement);
  const alignment = floating_ui_utils_getAlignment(placement);
  const isVertical = floating_ui_utils_getSideAxis(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = floating_ui_utils_evaluate(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const floating_ui_core_offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = floating_ui_utils_evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await floating_ui_core_detectOverflow(state, detectOverflowOptions);
      const crossAxis = floating_ui_utils_getSideAxis(floating_ui_utils_getSide(placement));
      const mainAxis = floating_ui_utils_getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await floating_ui_core_detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};



;// ./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs





function getCssDimensions(element) {
  const css = floating_ui_utils_dom_getComputedStyle(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = floating_ui_utils_dom_isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = floating_ui_utils_round(width) !== offsetWidth || floating_ui_utils_round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!floating_ui_utils_dom_isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? floating_ui_utils_round(rect.width) : rect.width) / width;
  let y = ($ ? floating_ui_utils_round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/createCoords(0);
function getVisualOffsets(element) {
  const win = floating_ui_utils_dom_getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== floating_ui_utils_dom_getWindow(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = floating_ui_utils_dom_getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? floating_ui_utils_dom_getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = floating_ui_utils_dom_getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = floating_ui_utils_dom_getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return floating_ui_utils_rectToClientRect({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = floating_ui_utils_dom_isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (floating_ui_utils_dom_getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (floating_ui_utils_dom_isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = floating_ui_utils_max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = floating_ui_utils_max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (floating_ui_utils_dom_getComputedStyle(body).direction === 'rtl') {
    x += floating_ui_utils_max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
  const win = floating_ui_utils_dom_getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  // <html> `overflow: hidden` + `scrollbar-gutter: stable` reduces the
  // visual width of the <html> but this is not considered in the size
  // of `html.clientWidth`.
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
      width -= clippingStableScrollbarWidth;
    }
  } else if (windowScrollbarX <= SCROLLBAR_MAX) {
    // If the <body> scrollbar is on the left, the width needs to be extended
    // by the scrollbar amount so there isn't extra space on the right.
    width += windowScrollbarX;
  }
  return {
    width,
    height,
    x,
    y
  };
}

const absoluteOrFixed = /*#__PURE__*/new Set(['absolute', 'fixed']);
// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = floating_ui_utils_dom_isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return floating_ui_utils_rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return floating_ui_utils_dom_getComputedStyle(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && floating_ui_utils_dom_getNodeName(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = floating_ui_utils_dom_getComputedStyle(element).position === 'fixed';
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = floating_ui_utils_dom_getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = floating_ui_utils_max(rect.top, accRect.top);
    accRect.right = floating_ui_utils_min(rect.right, accRect.right);
    accRect.bottom = floating_ui_utils_min(rect.bottom, accRect.bottom);
    accRect.left = floating_ui_utils_max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = floating_ui_utils_dom_isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (floating_ui_utils_dom_getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return floating_ui_utils_dom_getComputedStyle(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!floating_ui_utils_dom_isHTMLElement(element) || floating_ui_utils_dom_getComputedStyle(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = floating_ui_utils_dom_getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!floating_ui_utils_dom_isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return floating_ui_utils_dom_getComputedStyle(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floating_ui_utils_floor(top);
    const insetRight = floating_ui_utils_floor(root.clientWidth - (left + width));
    const insetBottom = floating_ui_utils_floor(root.clientHeight - (top + height));
    const insetLeft = floating_ui_utils_floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: floating_ui_utils_max(0, floating_ui_utils_min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        // It's possible that even though the ratio is reported as 1, the
        // element is not actually fully within the IntersectionObserver's root
        // area anymore. This can happen under performance constraints. This may
        // be a bug in the browser's IntersectionObserver implementation. To
        // work around this, we compare the element's bounding rect now with
        // what it was at the time we created the IntersectionObserver. If they
        // are not equal then the element moved, so we refresh.
        refresh();
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const floating_ui_dom_detectOverflow = (/* unused pure expression or super */ null && (detectOverflow$1));

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const floating_ui_dom_offset = floating_ui_core_offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const floating_ui_dom_autoPlacement = (/* unused pure expression or super */ null && (autoPlacement$1));

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const floating_ui_dom_shift = shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const floating_ui_dom_flip = flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const floating_ui_dom_size = (/* unused pure expression or super */ null && (size$1));

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const floating_ui_dom_hide = (/* unused pure expression or super */ null && (hide$1));

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const floating_ui_dom_arrow = arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const floating_ui_dom_inline = (/* unused pure expression or super */ null && (inline$1));

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const floating_ui_dom_limitShift = (/* unused pure expression or super */ null && (limitShift$1));

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const floating_ui_dom_computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};



;// ./node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs






var isClient = typeof document !== 'undefined';

var noop = function noop() {};
var index = isClient ? external_React_namespaceObject.useLayoutEffect : noop;

// Fork of `fast-deep-equal` that only does the comparisons we need and compares
// functions
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === 'function' && a.toString() === b.toString()) {
    return true;
  }
  let length;
  let i;
  let keys;
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0;) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (i = length; i-- !== 0;) {
      if (!{}.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0;) {
      const key = keys[i];
      if (key === '_owner' && a.$$typeof) {
        continue;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}

function getDPR(element) {
  if (typeof window === 'undefined') {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}

function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}

function useLatestRef(value) {
  const ref = external_React_namespaceObject.useRef(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}

/**
 * Provides data to position a floating element.
 * @see https://floating-ui.com/docs/useFloating
 */
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform,
    elements: {
      reference: externalReference,
      floating: externalFloating
    } = {},
    transform = true,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = external_React_namespaceObject.useState({
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = external_React_namespaceObject.useState(middleware);
  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const [_reference, _setReference] = external_React_namespaceObject.useState(null);
  const [_floating, _setFloating] = external_React_namespaceObject.useState(null);
  const setReference = external_React_namespaceObject.useCallback(node => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = external_React_namespaceObject.useCallback(node => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;
  const referenceRef = external_React_namespaceObject.useRef(null);
  const floatingRef = external_React_namespaceObject.useRef(null);
  const dataRef = external_React_namespaceObject.useRef(data);
  const hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const platformRef = useLatestRef(platform);
  const openRef = useLatestRef(open);
  const update = external_React_namespaceObject.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config.platform = platformRef.current;
    }
    floating_ui_dom_computePosition(referenceRef.current, floatingRef.current, config).then(data => {
      const fullData = {
        ...data,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: openRef.current !== false
      };
      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        external_ReactDOM_.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef, openRef]);
  index(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData(data => ({
        ...data,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = external_React_namespaceObject.useRef(false);
  index(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;
    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
  const refs = external_React_namespaceObject.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = external_React_namespaceObject.useMemo(() => ({
    reference: referenceEl,
    floating: floatingEl
  }), [referenceEl, floatingEl]);
  const floatingStyles = external_React_namespaceObject.useMemo(() => {
    const initialStyles = {
      position: strategy,
      left: 0,
      top: 0
    };
    if (!elements.floating) {
      return initialStyles;
    }
    const x = roundByDPR(elements.floating, data.x);
    const y = roundByDPR(elements.floating, data.y);
    if (transform) {
      return {
        ...initialStyles,
        transform: "translate(" + x + "px, " + y + "px)",
        ...(getDPR(elements.floating) >= 1.5 && {
          willChange: 'transform'
        })
      };
    }
    return {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);
  return external_React_namespaceObject.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    floatingStyles
  }), [data, update, refs, elements, floatingStyles]);
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$1 = options => {
  function isRef(value) {
    return {}.hasOwnProperty.call(value, 'current');
  }
  return {
    name: 'arrow',
    options,
    fn(state) {
      const {
        element,
        padding
      } = typeof options === 'function' ? options(state) : options;
      if (element && isRef(element)) {
        if (element.current != null) {
          return floating_ui_dom_arrow({
            element: element.current,
            padding
          }).fn(state);
        }
        return {};
      }
      if (element) {
        return floating_ui_dom_arrow({
          element,
          padding
        }).fn(state);
      }
      return {};
    }
  };
};

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const floating_ui_react_dom_offset = (options, deps) => ({
  ...floating_ui_dom_offset(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const floating_ui_react_dom_shift = (options, deps) => ({
  ...floating_ui_dom_shift(options),
  options: [options, deps]
});

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const floating_ui_react_dom_limitShift = (options, deps) => ({
  ...limitShift$1(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const floating_ui_react_dom_flip = (options, deps) => ({
  ...floating_ui_dom_flip(options),
  options: [options, deps]
});

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const floating_ui_react_dom_size = (options, deps) => ({
  ...size$1(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const floating_ui_react_dom_autoPlacement = (options, deps) => ({
  ...autoPlacement$1(options),
  options: [options, deps]
});

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const floating_ui_react_dom_hide = (options, deps) => ({
  ...hide$1(options),
  options: [options, deps]
});

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const floating_ui_react_dom_inline = (options, deps) => ({
  ...inline$1(options),
  options: [options, deps]
});

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const floating_ui_react_dom_arrow = (options, deps) => ({
  ...arrow$1(options),
  options: [options, deps]
});



;// ./node_modules/@floating-ui/react/dist/floating-ui.react.mjs










/**
 * Merges an array of refs into a single memoized callback ref or `null`.
 * @see https://floating-ui.com/docs/react-utils#usemergerefs
 */
function useMergeRefs(refs) {
  return React.useMemo(() => {
    if (refs.every(ref => ref == null)) {
      return null;
    }
    return value => {
      refs.forEach(ref => {
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref != null) {
          ref.current = value;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

// https://github.com/mui/material-ui/issues/41190#issuecomment-2040873379
const SafeReact = {
  ...external_React_namespaceObject_0
};

const useInsertionEffect = SafeReact.useInsertionEffect;
const useSafeInsertionEffect = useInsertionEffect || (fn => fn());
function useEffectEvent(callback) {
  const ref = external_React_namespaceObject.useRef(() => {
    if (false) // removed by dead control flow
{}
  });
  useSafeInsertionEffect(() => {
    ref.current = callback;
  });
  return external_React_namespaceObject.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return ref.current == null ? void 0 : ref.current(...args);
  }, []);
}

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
function isDifferentRow(index, cols, prevRow) {
  return Math.floor(index / cols) !== prevRow;
}
function isIndexOutOfBounds(listRef, index) {
  return index < 0 || index >= listRef.current.length;
}
function getMinIndex(listRef, disabledIndices) {
  return findNonDisabledIndex(listRef, {
    disabledIndices
  });
}
function getMaxIndex(listRef, disabledIndices) {
  return findNonDisabledIndex(listRef, {
    decrement: true,
    startingIndex: listRef.current.length,
    disabledIndices
  });
}
function findNonDisabledIndex(listRef, _temp) {
  let {
    startingIndex = -1,
    decrement = false,
    disabledIndices,
    amount = 1
  } = _temp === void 0 ? {} : _temp;
  const list = listRef.current;
  let index = startingIndex;
  do {
    index += decrement ? -amount : amount;
  } while (index >= 0 && index <= list.length - 1 && isDisabled(list, index, disabledIndices));
  return index;
}
function getGridNavigatedIndex(elementsRef, _ref) {
  let {
    event,
    orientation,
    loop,
    rtl,
    cols,
    disabledIndices,
    minIndex,
    maxIndex,
    prevIndex,
    stopEvent: stop = false
  } = _ref;
  let nextIndex = prevIndex;
  if (event.key === ARROW_UP) {
    stop && stopEvent(event);
    if (prevIndex === -1) {
      nextIndex = maxIndex;
    } else {
      nextIndex = findNonDisabledIndex(elementsRef, {
        startingIndex: nextIndex,
        amount: cols,
        decrement: true,
        disabledIndices
      });
      if (loop && (prevIndex - cols < minIndex || nextIndex < 0)) {
        const col = prevIndex % cols;
        const maxCol = maxIndex % cols;
        const offset = maxIndex - (maxCol - col);
        if (maxCol === col) {
          nextIndex = maxIndex;
        } else {
          nextIndex = maxCol > col ? offset : offset - cols;
        }
      }
    }
    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      nextIndex = prevIndex;
    }
  }
  if (event.key === ARROW_DOWN) {
    stop && stopEvent(event);
    if (prevIndex === -1) {
      nextIndex = minIndex;
    } else {
      nextIndex = findNonDisabledIndex(elementsRef, {
        startingIndex: prevIndex,
        amount: cols,
        disabledIndices
      });
      if (loop && prevIndex + cols > maxIndex) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex % cols - cols,
          amount: cols,
          disabledIndices
        });
      }
    }
    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      nextIndex = prevIndex;
    }
  }

  // Remains on the same row/column.
  if (orientation === 'both') {
    const prevRow = floor(prevIndex / cols);
    if (event.key === (rtl ? ARROW_LEFT : ARROW_RIGHT)) {
      stop && stopEvent(event);
      if (prevIndex % cols !== cols - 1) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex,
          disabledIndices
        });
        if (loop && isDifferentRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledIndex(elementsRef, {
            startingIndex: prevIndex - prevIndex % cols - 1,
            disabledIndices
          });
        }
      } else if (loop) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
      }
      if (isDifferentRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    if (event.key === (rtl ? ARROW_RIGHT : ARROW_LEFT)) {
      stop && stopEvent(event);
      if (prevIndex % cols !== 0) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex,
          decrement: true,
          disabledIndices
        });
        if (loop && isDifferentRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledIndex(elementsRef, {
            startingIndex: prevIndex + (cols - prevIndex % cols),
            decrement: true,
            disabledIndices
          });
        }
      } else if (loop) {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex + (cols - prevIndex % cols),
          decrement: true,
          disabledIndices
        });
      }
      if (isDifferentRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    const lastRow = floor(maxIndex / cols) === prevRow;
    if (isIndexOutOfBounds(elementsRef, nextIndex)) {
      if (loop && lastRow) {
        nextIndex = event.key === (rtl ? ARROW_RIGHT : ARROW_LEFT) ? maxIndex : findNonDisabledIndex(elementsRef, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
      } else {
        nextIndex = prevIndex;
      }
    }
  }
  return nextIndex;
}

/** For each cell index, gets the item index that occupies that cell */
function buildCellMap(sizes, cols, dense) {
  const cellMap = [];
  let startIndex = 0;
  sizes.forEach((_ref2, index) => {
    let {
      width,
      height
    } = _ref2;
    if (width > cols) {
      if (false) // removed by dead control flow
{}
    }
    let itemPlaced = false;
    if (dense) {
      startIndex = 0;
    }
    while (!itemPlaced) {
      const targetCells = [];
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          targetCells.push(startIndex + i + j * cols);
        }
      }
      if (startIndex % cols + width <= cols && targetCells.every(cell => cellMap[cell] == null)) {
        targetCells.forEach(cell => {
          cellMap[cell] = index;
        });
        itemPlaced = true;
      } else {
        startIndex++;
      }
    }
  });

  // convert into a non-sparse array
  return [...cellMap];
}

/** Gets cell index of an item's corner or -1 when index is -1. */
function getCellIndexOfCorner(index, sizes, cellMap, cols, corner) {
  if (index === -1) return -1;
  const firstCellIndex = cellMap.indexOf(index);
  const sizeItem = sizes[index];
  switch (corner) {
    case 'tl':
      return firstCellIndex;
    case 'tr':
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + sizeItem.width - 1;
    case 'bl':
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + (sizeItem.height - 1) * cols;
    case 'br':
      return cellMap.lastIndexOf(index);
  }
}

/** Gets all cell indices that correspond to the specified indices */
function getCellIndices(indices, cellMap) {
  return cellMap.flatMap((index, cellIndex) => indices.includes(index) ? [cellIndex] : []);
}
function isDisabled(list, index, disabledIndices) {
  if (disabledIndices) {
    return disabledIndices.includes(index);
  }
  const element = list[index];
  return element == null || element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
}

var floating_ui_react_index = typeof document !== 'undefined' ? external_React_namespaceObject.useLayoutEffect : external_React_namespaceObject.useEffect;

function sortByDocumentPosition(a, b) {
  const position = a.compareDocumentPosition(b);
  if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
    return -1;
  }
  if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
    return 1;
  }
  return 0;
}
function areMapsEqual(map1, map2) {
  if (map1.size !== map2.size) {
    return false;
  }
  for (const [key, value] of map1.entries()) {
    if (value !== map2.get(key)) {
      return false;
    }
  }
  return true;
}
const FloatingListContext = /*#__PURE__*/external_React_namespaceObject.createContext({
  register: () => {},
  unregister: () => {},
  map: /*#__PURE__*/new Map(),
  elementsRef: {
    current: []
  }
});
/**
 * Provides context for a list of items within the floating element.
 * @see https://floating-ui.com/docs/FloatingList
 */
function FloatingList(props) {
  const {
    children,
    elementsRef,
    labelsRef
  } = props;
  const [map, setMap] = React.useState(() => new Map());
  const register = React.useCallback(node => {
    setMap(prevMap => new Map(prevMap).set(node, null));
  }, []);
  const unregister = React.useCallback(node => {
    setMap(prevMap => {
      const map = new Map(prevMap);
      map.delete(node);
      return map;
    });
  }, []);
  floating_ui_react_index(() => {
    const newMap = new Map(map);
    const nodes = Array.from(newMap.keys()).sort(sortByDocumentPosition);
    nodes.forEach((node, index) => {
      newMap.set(node, index);
    });
    if (!areMapsEqual(map, newMap)) {
      setMap(newMap);
    }
  }, [map]);
  return /*#__PURE__*/React.createElement(FloatingListContext.Provider, {
    value: React.useMemo(() => ({
      register,
      unregister,
      map,
      elementsRef,
      labelsRef
    }), [register, unregister, map, elementsRef, labelsRef])
  }, children);
}
/**
 * Used to register a list item and its index (DOM position) in the
 * `FloatingList`.
 * @see https://floating-ui.com/docs/FloatingList#uselistitem
 */
function useListItem(props) {
  if (props === void 0) {
    props = {};
  }
  const {
    label
  } = props;
  const {
    register,
    unregister,
    map,
    elementsRef,
    labelsRef
  } = React.useContext(FloatingListContext);
  const [index$1, setIndex] = React.useState(null);
  const componentRef = React.useRef(null);
  const ref = React.useCallback(node => {
    componentRef.current = node;
    if (index$1 !== null) {
      elementsRef.current[index$1] = node;
      if (labelsRef) {
        var _node$textContent;
        const isLabelDefined = label !== undefined;
        labelsRef.current[index$1] = isLabelDefined ? label : (_node$textContent = node == null ? void 0 : node.textContent) != null ? _node$textContent : null;
      }
    }
  }, [index$1, elementsRef, labelsRef, label]);
  floating_ui_react_index(() => {
    const node = componentRef.current;
    if (node) {
      register(node);
      return () => {
        unregister(node);
      };
    }
  }, [register, unregister]);
  floating_ui_react_index(() => {
    const index = componentRef.current ? map.get(componentRef.current) : null;
    if (index != null) {
      setIndex(index);
    }
  }, [map]);
  return React.useMemo(() => ({
    ref,
    index: index$1 == null ? -1 : index$1
  }), [index$1, ref]);
}

function renderJsx(render, computedProps) {
  if (typeof render === 'function') {
    return render(computedProps);
  }
  if (render) {
    return /*#__PURE__*/React.cloneElement(render, computedProps);
  }
  return /*#__PURE__*/React.createElement("div", computedProps);
}
const CompositeContext = /*#__PURE__*/external_React_namespaceObject.createContext({
  activeIndex: 0,
  onNavigate: () => {}
});
const horizontalKeys = [ARROW_LEFT, ARROW_RIGHT];
const verticalKeys = [ARROW_UP, ARROW_DOWN];
const allKeys = [...horizontalKeys, ...verticalKeys];

/**
 * Creates a single tab stop whose items are navigated by arrow keys, which
 * provides list navigation outside of floating element contexts.
 *
 * This is useful to enable navigation of a list of items that aren’t part of a
 * floating element. A menubar is an example of a composite, with each reference
 * element being an item.
 * @see https://floating-ui.com/docs/Composite
 */
const Composite = /*#__PURE__*/(/* unused pure expression or super */ null && (React.forwardRef(function Composite(props, forwardedRef) {
  const {
    render,
    orientation = 'both',
    loop = true,
    rtl = false,
    cols = 1,
    disabledIndices,
    activeIndex: externalActiveIndex,
    onNavigate: externalSetActiveIndex,
    itemSizes,
    dense = false,
    ...domProps
  } = props;
  const [internalActiveIndex, internalSetActiveIndex] = React.useState(0);
  const activeIndex = externalActiveIndex != null ? externalActiveIndex : internalActiveIndex;
  const onNavigate = useEffectEvent(externalSetActiveIndex != null ? externalSetActiveIndex : internalSetActiveIndex);
  const elementsRef = React.useRef([]);
  const renderElementProps = render && typeof render !== 'function' ? render.props : {};
  const contextValue = React.useMemo(() => ({
    activeIndex,
    onNavigate
  }), [activeIndex, onNavigate]);
  const isGrid = cols > 1;
  function handleKeyDown(event) {
    if (!allKeys.includes(event.key)) return;
    let nextIndex = activeIndex;
    const minIndex = getMinIndex(elementsRef, disabledIndices);
    const maxIndex = getMaxIndex(elementsRef, disabledIndices);
    const horizontalEndKey = rtl ? ARROW_LEFT : ARROW_RIGHT;
    const horizontalStartKey = rtl ? ARROW_RIGHT : ARROW_LEFT;
    if (isGrid) {
      const sizes = itemSizes || Array.from({
        length: elementsRef.current.length
      }, () => ({
        width: 1,
        height: 1
      }));
      // To calculate movements on the grid, we use hypothetical cell indices
      // as if every item was 1x1, then convert back to real indices.
      const cellMap = buildCellMap(sizes, cols, dense);
      const minGridIndex = cellMap.findIndex(index => index != null && !isDisabled(elementsRef.current, index, disabledIndices));
      // last enabled index
      const maxGridIndex = cellMap.reduce((foundIndex, index, cellIndex) => index != null && !isDisabled(elementsRef.current, index, disabledIndices) ? cellIndex : foundIndex, -1);
      const maybeNextIndex = cellMap[getGridNavigatedIndex({
        current: cellMap.map(itemIndex => itemIndex ? elementsRef.current[itemIndex] : null)
      }, {
        event,
        orientation,
        loop,
        rtl,
        cols,
        // treat undefined (empty grid spaces) as disabled indices so we
        // don't end up in them
        disabledIndices: getCellIndices([...(disabledIndices || elementsRef.current.map((_, index) => isDisabled(elementsRef.current, index) ? index : undefined)), undefined], cellMap),
        minIndex: minGridIndex,
        maxIndex: maxGridIndex,
        prevIndex: getCellIndexOfCorner(activeIndex > maxIndex ? minIndex : activeIndex, sizes, cellMap, cols,
        // use a corner matching the edge closest to the direction we're
        // moving in so we don't end up in the same item. Prefer
        // top/left over bottom/right.
        event.key === ARROW_DOWN ? 'bl' : event.key === horizontalEndKey ? 'tr' : 'tl')
      })];
      if (maybeNextIndex != null) {
        nextIndex = maybeNextIndex;
      }
    }
    const toEndKeys = {
      horizontal: [horizontalEndKey],
      vertical: [ARROW_DOWN],
      both: [horizontalEndKey, ARROW_DOWN]
    }[orientation];
    const toStartKeys = {
      horizontal: [horizontalStartKey],
      vertical: [ARROW_UP],
      both: [horizontalStartKey, ARROW_UP]
    }[orientation];
    const preventedKeys = isGrid ? allKeys : {
      horizontal: horizontalKeys,
      vertical: verticalKeys,
      both: allKeys
    }[orientation];
    if (nextIndex === activeIndex && [...toEndKeys, ...toStartKeys].includes(event.key)) {
      if (loop && nextIndex === maxIndex && toEndKeys.includes(event.key)) {
        nextIndex = minIndex;
      } else if (loop && nextIndex === minIndex && toStartKeys.includes(event.key)) {
        nextIndex = maxIndex;
      } else {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: nextIndex,
          decrement: toStartKeys.includes(event.key),
          disabledIndices
        });
      }
    }
    if (nextIndex !== activeIndex && !isIndexOutOfBounds(elementsRef, nextIndex)) {
      var _elementsRef$current$;
      event.stopPropagation();
      if (preventedKeys.includes(event.key)) {
        event.preventDefault();
      }
      onNavigate(nextIndex);
      (_elementsRef$current$ = elementsRef.current[nextIndex]) == null || _elementsRef$current$.focus();
    }
  }
  const computedProps = {
    ...domProps,
    ...renderElementProps,
    ref: forwardedRef,
    'aria-orientation': orientation === 'both' ? undefined : orientation,
    onKeyDown(e) {
      domProps.onKeyDown == null || domProps.onKeyDown(e);
      renderElementProps.onKeyDown == null || renderElementProps.onKeyDown(e);
      handleKeyDown(e);
    }
  };
  return /*#__PURE__*/React.createElement(CompositeContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(FloatingList, {
    elementsRef: elementsRef
  }, renderJsx(render, computedProps)));
})));
/**
 * @see https://floating-ui.com/docs/Composite
 */
const CompositeItem = /*#__PURE__*/(/* unused pure expression or super */ null && (React.forwardRef(function CompositeItem(props, forwardedRef) {
  const {
    render,
    ...domProps
  } = props;
  const renderElementProps = render && typeof render !== 'function' ? render.props : {};
  const {
    activeIndex,
    onNavigate
  } = React.useContext(CompositeContext);
  const {
    ref,
    index
  } = useListItem();
  const mergedRef = useMergeRefs([ref, forwardedRef, renderElementProps.ref]);
  const isActive = activeIndex === index;
  const computedProps = {
    ...domProps,
    ...renderElementProps,
    ref: mergedRef,
    tabIndex: isActive ? 0 : -1,
    'data-active': isActive ? '' : undefined,
    onFocus(e) {
      domProps.onFocus == null || domProps.onFocus(e);
      renderElementProps.onFocus == null || renderElementProps.onFocus(e);
      onNavigate(index);
    }
  };
  return renderJsx(render, computedProps);
})));

function floating_ui_react_extends() {
  floating_ui_react_extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return floating_ui_react_extends.apply(this, arguments);
}

let serverHandoffComplete = false;
let count = 0;
const genId = () => // Ensure the id is unique with multiple independent versions of Floating UI
// on <React 18
"floating-ui-" + Math.random().toString(36).slice(2, 6) + count++;
function useFloatingId() {
  const [id, setId] = external_React_namespaceObject.useState(() => serverHandoffComplete ? genId() : undefined);
  floating_ui_react_index(() => {
    if (id == null) {
      setId(genId());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  external_React_namespaceObject.useEffect(() => {
    serverHandoffComplete = true;
  }, []);
  return id;
}
const useReactId = SafeReact.useId;

/**
 * Uses React 18's built-in `useId()` when available, or falls back to a
 * slightly less performant (requiring a double render) implementation for
 * earlier React versions.
 * @see https://floating-ui.com/docs/react-utils#useid
 */
const useId = useReactId || useFloatingId;

let devMessageSet;
if (false) // removed by dead control flow
{}
function warn() {
  var _devMessageSet;
  for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
    messages[_key] = arguments[_key];
  }
  const message = "Floating UI: " + messages.join(' ');
  if (!((_devMessageSet = devMessageSet) != null && _devMessageSet.has(message))) {
    var _devMessageSet2;
    (_devMessageSet2 = devMessageSet) == null || _devMessageSet2.add(message);
    console.warn(message);
  }
}
function error() {
  var _devMessageSet3;
  for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    messages[_key2] = arguments[_key2];
  }
  const message = "Floating UI: " + messages.join(' ');
  if (!((_devMessageSet3 = devMessageSet) != null && _devMessageSet3.has(message))) {
    var _devMessageSet4;
    (_devMessageSet4 = devMessageSet) == null || _devMessageSet4.add(message);
    console.error(message);
  }
}

/**
 * Renders a pointing arrow triangle.
 * @see https://floating-ui.com/docs/FloatingArrow
 */
const FloatingArrow = /*#__PURE__*/external_React_namespaceObject.forwardRef(function FloatingArrow(props, ref) {
  const {
    context: {
      placement,
      elements: {
        floating
      },
      middlewareData: {
        arrow,
        shift
      }
    },
    width = 14,
    height = 7,
    tipRadius = 0,
    strokeWidth = 0,
    staticOffset,
    stroke,
    d,
    style: {
      transform,
      ...restStyle
    } = {},
    ...rest
  } = props;
  if (false) // removed by dead control flow
{}
  const clipPathId = useId();
  const [isRTL, setIsRTL] = external_React_namespaceObject.useState(false);

  // https://github.com/floating-ui/floating-ui/issues/2932
  floating_ui_react_index(() => {
    if (!floating) return;
    const isRTL = floating_ui_utils_dom_getComputedStyle(floating).direction === 'rtl';
    if (isRTL) {
      setIsRTL(true);
    }
  }, [floating]);
  if (!floating) {
    return null;
  }
  const [side, alignment] = placement.split('-');
  const isVerticalSide = side === 'top' || side === 'bottom';
  let computedStaticOffset = staticOffset;
  if (isVerticalSide && shift != null && shift.x || !isVerticalSide && shift != null && shift.y) {
    computedStaticOffset = null;
  }

  // Strokes must be double the border width, this ensures the stroke's width
  // works as you'd expect.
  const computedStrokeWidth = strokeWidth * 2;
  const halfStrokeWidth = computedStrokeWidth / 2;
  const svgX = width / 2 * (tipRadius / -8 + 1);
  const svgY = height / 2 * tipRadius / 4;
  const isCustomShape = !!d;
  const yOffsetProp = computedStaticOffset && alignment === 'end' ? 'bottom' : 'top';
  let xOffsetProp = computedStaticOffset && alignment === 'end' ? 'right' : 'left';
  if (computedStaticOffset && isRTL) {
    xOffsetProp = alignment === 'end' ? 'left' : 'right';
  }
  const arrowX = (arrow == null ? void 0 : arrow.x) != null ? computedStaticOffset || arrow.x : '';
  const arrowY = (arrow == null ? void 0 : arrow.y) != null ? computedStaticOffset || arrow.y : '';
  const dValue = d || 'M0,0' + (" H" + width) + (" L" + (width - svgX) + "," + (height - svgY)) + (" Q" + width / 2 + "," + height + " " + svgX + "," + (height - svgY)) + ' Z';
  const rotation = {
    top: isCustomShape ? 'rotate(180deg)' : '',
    left: isCustomShape ? 'rotate(90deg)' : 'rotate(-90deg)',
    bottom: isCustomShape ? '' : 'rotate(180deg)',
    right: isCustomShape ? 'rotate(-90deg)' : 'rotate(90deg)'
  }[side];
  return /*#__PURE__*/external_React_namespaceObject.createElement("svg", floating_ui_react_extends({}, rest, {
    "aria-hidden": true,
    ref: ref,
    width: isCustomShape ? width : width + computedStrokeWidth,
    height: width,
    viewBox: "0 0 " + width + " " + (height > width ? height : width),
    style: {
      position: 'absolute',
      pointerEvents: 'none',
      [xOffsetProp]: arrowX,
      [yOffsetProp]: arrowY,
      [side]: isVerticalSide || isCustomShape ? '100%' : "calc(100% - " + computedStrokeWidth / 2 + "px)",
      transform: [rotation, transform].filter(t => !!t).join(' '),
      ...restStyle
    }
  }), computedStrokeWidth > 0 && /*#__PURE__*/external_React_namespaceObject.createElement("path", {
    clipPath: "url(#" + clipPathId + ")",
    fill: "none",
    stroke: stroke
    // Account for the stroke on the fill path rendered below.
    ,
    strokeWidth: computedStrokeWidth + (d ? 0 : 1),
    d: dValue
  }), /*#__PURE__*/external_React_namespaceObject.createElement("path", {
    stroke: computedStrokeWidth && !d ? rest.fill : 'none',
    d: dValue
  }), /*#__PURE__*/external_React_namespaceObject.createElement("clipPath", {
    id: clipPathId
  }, /*#__PURE__*/external_React_namespaceObject.createElement("rect", {
    x: -halfStrokeWidth,
    y: halfStrokeWidth * (isCustomShape ? -1 : 1),
    width: width + computedStrokeWidth,
    height: width
  })));
});

function createPubSub() {
  const map = new Map();
  return {
    emit(event, data) {
      var _map$get;
      (_map$get = map.get(event)) == null || _map$get.forEach(handler => handler(data));
    },
    on(event, listener) {
      map.set(event, [...(map.get(event) || []), listener]);
    },
    off(event, listener) {
      var _map$get2;
      map.set(event, ((_map$get2 = map.get(event)) == null ? void 0 : _map$get2.filter(l => l !== listener)) || []);
    }
  };
}

const FloatingNodeContext = /*#__PURE__*/external_React_namespaceObject.createContext(null);
const FloatingTreeContext = /*#__PURE__*/external_React_namespaceObject.createContext(null);

/**
 * Returns the parent node id for nested floating elements, if available.
 * Returns `null` for top-level floating elements.
 */
const useFloatingParentNodeId = () => {
  var _React$useContext;
  return ((_React$useContext = external_React_namespaceObject.useContext(FloatingNodeContext)) == null ? void 0 : _React$useContext.id) || null;
};

/**
 * Returns the nearest floating tree context, if available.
 */
const useFloatingTree = () => external_React_namespaceObject.useContext(FloatingTreeContext);

/**
 * Registers a node into the `FloatingTree`, returning its id.
 * @see https://floating-ui.com/docs/FloatingTree
 */
function useFloatingNodeId(customParentId) {
  const id = useId();
  const tree = useFloatingTree();
  const reactParentId = useFloatingParentNodeId();
  const parentId = customParentId || reactParentId;
  floating_ui_react_index(() => {
    const node = {
      id,
      parentId
    };
    tree == null || tree.addNode(node);
    return () => {
      tree == null || tree.removeNode(node);
    };
  }, [tree, id, parentId]);
  return id;
}
/**
 * Provides parent node context for nested floating elements.
 * @see https://floating-ui.com/docs/FloatingTree
 */
function FloatingNode(props) {
  const {
    children,
    id
  } = props;
  const parentId = useFloatingParentNodeId();
  return /*#__PURE__*/React.createElement(FloatingNodeContext.Provider, {
    value: React.useMemo(() => ({
      id,
      parentId
    }), [id, parentId])
  }, children);
}
/**
 * Provides context for nested floating elements when they are not children of
 * each other on the DOM.
 * This is not necessary in all cases, except when there must be explicit communication between parent and child floating elements. It is necessary for:
 * - The `bubbles` option in the `useDismiss()` Hook
 * - Nested virtual list navigation
 * - Nested floating elements that each open on hover
 * - Custom communication between parent and child floating elements
 * @see https://floating-ui.com/docs/FloatingTree
 */
function FloatingTree(props) {
  const {
    children
  } = props;
  const nodesRef = React.useRef([]);
  const addNode = React.useCallback(node => {
    nodesRef.current = [...nodesRef.current, node];
  }, []);
  const removeNode = React.useCallback(node => {
    nodesRef.current = nodesRef.current.filter(n => n !== node);
  }, []);
  const events = React.useState(() => createPubSub())[0];
  return /*#__PURE__*/React.createElement(FloatingTreeContext.Provider, {
    value: React.useMemo(() => ({
      nodesRef,
      addNode,
      removeNode,
      events
    }), [addNode, removeNode, events])
  }, children);
}

function createAttribute(name) {
  return "data-floating-ui-" + name;
}

function floating_ui_react_useLatestRef(value) {
  const ref = (0,external_React_namespaceObject.useRef)(value);
  floating_ui_react_index(() => {
    ref.current = value;
  });
  return ref;
}

const safePolygonIdentifier = /*#__PURE__*/createAttribute('safe-polygon');
function getDelay(value, prop, pointerType) {
  if (pointerType && !floating_ui_react_utils_isMouseLikePointerType(pointerType)) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return value == null ? void 0 : value[prop];
}
/**
 * Opens the floating element while hovering over the reference element, like
 * CSS `:hover`.
 * @see https://floating-ui.com/docs/useHover
 */
function useHover(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    dataRef,
    events,
    elements
  } = context;
  const {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true
  } = props;
  const tree = useFloatingTree();
  const parentId = useFloatingParentNodeId();
  const handleCloseRef = floating_ui_react_useLatestRef(handleClose);
  const delayRef = floating_ui_react_useLatestRef(delay);
  const openRef = floating_ui_react_useLatestRef(open);
  const pointerTypeRef = external_React_namespaceObject.useRef();
  const timeoutRef = external_React_namespaceObject.useRef(-1);
  const handlerRef = external_React_namespaceObject.useRef();
  const restTimeoutRef = external_React_namespaceObject.useRef(-1);
  const blockMouseMoveRef = external_React_namespaceObject.useRef(true);
  const performedPointerEventsMutationRef = external_React_namespaceObject.useRef(false);
  const unbindMouseMoveRef = external_React_namespaceObject.useRef(() => {});
  const restTimeoutPendingRef = external_React_namespaceObject.useRef(false);
  const isHoverOpen = external_React_namespaceObject.useCallback(() => {
    var _dataRef$current$open;
    const type = (_dataRef$current$open = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open.type;
    return (type == null ? void 0 : type.includes('mouse')) && type !== 'mousedown';
  }, [dataRef]);

  // When closing before opening, clear the delay timeouts to cancel it
  // from showing.
  external_React_namespaceObject.useEffect(() => {
    if (!enabled) return;
    function onOpenChange(_ref) {
      let {
        open
      } = _ref;
      if (!open) {
        clearTimeout(timeoutRef.current);
        clearTimeout(restTimeoutRef.current);
        blockMouseMoveRef.current = true;
        restTimeoutPendingRef.current = false;
      }
    }
    events.on('openchange', onOpenChange);
    return () => {
      events.off('openchange', onOpenChange);
    };
  }, [enabled, events]);
  external_React_namespaceObject.useEffect(() => {
    if (!enabled) return;
    if (!handleCloseRef.current) return;
    if (!open) return;
    function onLeave(event) {
      if (isHoverOpen()) {
        onOpenChange(false, event, 'hover');
      }
    }
    const html = floating_ui_react_utils_getDocument(elements.floating).documentElement;
    html.addEventListener('mouseleave', onLeave);
    return () => {
      html.removeEventListener('mouseleave', onLeave);
    };
  }, [elements.floating, open, onOpenChange, enabled, handleCloseRef, isHoverOpen]);
  const closeWithDelay = external_React_namespaceObject.useCallback(function (event, runElseBranch, reason) {
    if (runElseBranch === void 0) {
      runElseBranch = true;
    }
    if (reason === void 0) {
      reason = 'hover';
    }
    const closeDelay = getDelay(delayRef.current, 'close', pointerTypeRef.current);
    if (closeDelay && !handlerRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => onOpenChange(false, event, reason), closeDelay);
    } else if (runElseBranch) {
      clearTimeout(timeoutRef.current);
      onOpenChange(false, event, reason);
    }
  }, [delayRef, onOpenChange]);
  const cleanupMouseMoveHandler = useEffectEvent(() => {
    unbindMouseMoveRef.current();
    handlerRef.current = undefined;
  });
  const clearPointerEvents = useEffectEvent(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = floating_ui_react_utils_getDocument(elements.floating).body;
      body.style.pointerEvents = '';
      body.removeAttribute(safePolygonIdentifier);
      performedPointerEventsMutationRef.current = false;
    }
  });
  const isClickLikeOpenEvent = useEffectEvent(() => {
    return dataRef.current.openEvent ? ['click', 'mousedown'].includes(dataRef.current.openEvent.type) : false;
  });

  // Registering the mouse events on the reference directly to bypass React's
  // delegation system. If the cursor was on a disabled element and then entered
  // the reference (no gap), `mouseenter` doesn't fire in the delegation system.
  external_React_namespaceObject.useEffect(() => {
    if (!enabled) return;
    function onMouseEnter(event) {
      clearTimeout(timeoutRef.current);
      blockMouseMoveRef.current = false;
      if (mouseOnly && !floating_ui_react_utils_isMouseLikePointerType(pointerTypeRef.current) || restMs > 0 && !getDelay(delayRef.current, 'open')) {
        return;
      }
      const openDelay = getDelay(delayRef.current, 'open', pointerTypeRef.current);
      if (openDelay) {
        timeoutRef.current = window.setTimeout(() => {
          if (!openRef.current) {
            onOpenChange(true, event, 'hover');
          }
        }, openDelay);
      } else if (!open) {
        onOpenChange(true, event, 'hover');
      }
    }
    function onMouseLeave(event) {
      if (isClickLikeOpenEvent()) return;
      unbindMouseMoveRef.current();
      const doc = floating_ui_react_utils_getDocument(elements.floating);
      clearTimeout(restTimeoutRef.current);
      restTimeoutPendingRef.current = false;
      if (handleCloseRef.current && dataRef.current.floatingContext) {
        // Prevent clearing `onScrollMouseLeave` timeout.
        if (!open) {
          clearTimeout(timeoutRef.current);
        }
        handlerRef.current = handleCloseRef.current({
          ...dataRef.current.floatingContext,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            if (!isClickLikeOpenEvent()) {
              closeWithDelay(event, true, 'safe-polygon');
            }
          }
        });
        const handler = handlerRef.current;
        doc.addEventListener('mousemove', handler);
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener('mousemove', handler);
        };
        return;
      }

      // Allow interactivity without `safePolygon` on touch devices. With a
      // pointer, a short close delay is an alternative, so it should work
      // consistently.
      const shouldClose = pointerTypeRef.current === 'touch' ? !floating_ui_react_utils_contains(elements.floating, event.relatedTarget) : true;
      if (shouldClose) {
        closeWithDelay(event);
      }
    }

    // Ensure the floating element closes after scrolling even if the pointer
    // did not move.
    // https://github.com/floating-ui/floating-ui/discussions/1692
    function onScrollMouseLeave(event) {
      if (isClickLikeOpenEvent()) return;
      if (!dataRef.current.floatingContext) return;
      handleCloseRef.current == null || handleCloseRef.current({
        ...dataRef.current.floatingContext,
        tree,
        x: event.clientX,
        y: event.clientY,
        onClose() {
          clearPointerEvents();
          cleanupMouseMoveHandler();
          if (!isClickLikeOpenEvent()) {
            closeWithDelay(event);
          }
        }
      })(event);
    }
    if (isElement(elements.domReference)) {
      var _elements$floating;
      const ref = elements.domReference;
      open && ref.addEventListener('mouseleave', onScrollMouseLeave);
      (_elements$floating = elements.floating) == null || _elements$floating.addEventListener('mouseleave', onScrollMouseLeave);
      move && ref.addEventListener('mousemove', onMouseEnter, {
        once: true
      });
      ref.addEventListener('mouseenter', onMouseEnter);
      ref.addEventListener('mouseleave', onMouseLeave);
      return () => {
        var _elements$floating2;
        open && ref.removeEventListener('mouseleave', onScrollMouseLeave);
        (_elements$floating2 = elements.floating) == null || _elements$floating2.removeEventListener('mouseleave', onScrollMouseLeave);
        move && ref.removeEventListener('mousemove', onMouseEnter);
        ref.removeEventListener('mouseenter', onMouseEnter);
        ref.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, [elements, enabled, context, mouseOnly, restMs, move, closeWithDelay, cleanupMouseMoveHandler, clearPointerEvents, onOpenChange, open, openRef, tree, delayRef, handleCloseRef, dataRef, isClickLikeOpenEvent]);

  // Block pointer-events of every element other than the reference and floating
  // while the floating element is open and has a `handleClose` handler. Also
  // handles nested floating elements.
  // https://github.com/floating-ui/floating-ui/issues/1722
  floating_ui_react_index(() => {
    var _handleCloseRef$curre;
    if (!enabled) return;
    if (open && (_handleCloseRef$curre = handleCloseRef.current) != null && _handleCloseRef$curre.__options.blockPointerEvents && isHoverOpen()) {
      performedPointerEventsMutationRef.current = true;
      const floatingEl = elements.floating;
      if (isElement(elements.domReference) && floatingEl) {
        var _tree$nodesRef$curren;
        const body = floating_ui_react_utils_getDocument(elements.floating).body;
        body.setAttribute(safePolygonIdentifier, '');
        const ref = elements.domReference;
        const parentFloating = tree == null || (_tree$nodesRef$curren = tree.nodesRef.current.find(node => node.id === parentId)) == null || (_tree$nodesRef$curren = _tree$nodesRef$curren.context) == null ? void 0 : _tree$nodesRef$curren.elements.floating;
        if (parentFloating) {
          parentFloating.style.pointerEvents = '';
        }
        body.style.pointerEvents = 'none';
        ref.style.pointerEvents = 'auto';
        floatingEl.style.pointerEvents = 'auto';
        return () => {
          body.style.pointerEvents = '';
          ref.style.pointerEvents = '';
          floatingEl.style.pointerEvents = '';
        };
      }
    }
  }, [enabled, open, parentId, elements, tree, handleCloseRef, isHoverOpen]);
  floating_ui_react_index(() => {
    if (!open) {
      pointerTypeRef.current = undefined;
      restTimeoutPendingRef.current = false;
      cleanupMouseMoveHandler();
      clearPointerEvents();
    }
  }, [open, cleanupMouseMoveHandler, clearPointerEvents]);
  external_React_namespaceObject.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      clearPointerEvents();
    };
  }, [enabled, elements.domReference, cleanupMouseMoveHandler, clearPointerEvents]);
  const reference = external_React_namespaceObject.useMemo(() => {
    function setPointerRef(event) {
      pointerTypeRef.current = event.pointerType;
    }
    return {
      onPointerDown: setPointerRef,
      onPointerEnter: setPointerRef,
      onMouseMove(event) {
        const {
          nativeEvent
        } = event;
        function handleMouseMove() {
          if (!blockMouseMoveRef.current && !openRef.current) {
            onOpenChange(true, nativeEvent, 'hover');
          }
        }
        if (mouseOnly && !floating_ui_react_utils_isMouseLikePointerType(pointerTypeRef.current)) {
          return;
        }
        if (open || restMs === 0) {
          return;
        }

        // Ignore insignificant movements to account for tremors.
        if (restTimeoutPendingRef.current && event.movementX ** 2 + event.movementY ** 2 < 2) {
          return;
        }
        clearTimeout(restTimeoutRef.current);
        if (pointerTypeRef.current === 'touch') {
          handleMouseMove();
        } else {
          restTimeoutPendingRef.current = true;
          restTimeoutRef.current = window.setTimeout(handleMouseMove, restMs);
        }
      }
    };
  }, [mouseOnly, onOpenChange, open, openRef, restMs]);
  const floating = external_React_namespaceObject.useMemo(() => ({
    onMouseEnter() {
      clearTimeout(timeoutRef.current);
    },
    onMouseLeave(event) {
      if (!isClickLikeOpenEvent()) {
        closeWithDelay(event.nativeEvent, false);
      }
    }
  }), [closeWithDelay, isClickLikeOpenEvent]);
  return external_React_namespaceObject.useMemo(() => enabled ? {
    reference,
    floating
  } : {}, [enabled, reference, floating]);
}

const NOOP = () => {};
const FloatingDelayGroupContext = /*#__PURE__*/external_React_namespaceObject.createContext({
  delay: 0,
  initialDelay: 0,
  timeoutMs: 0,
  currentId: null,
  setCurrentId: NOOP,
  setState: NOOP,
  isInstantPhase: false
});

/**
 * @deprecated
 * Use the return value of `useDelayGroup()` instead.
 */
const useDelayGroupContext = () => React.useContext(FloatingDelayGroupContext);
/**
 * Provides context for a group of floating elements that should share a
 * `delay`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
function FloatingDelayGroup(props) {
  const {
    children,
    delay,
    timeoutMs = 0
  } = props;
  const [state, setState] = React.useReducer((prev, next) => ({
    ...prev,
    ...next
  }), {
    delay,
    timeoutMs,
    initialDelay: delay,
    currentId: null,
    isInstantPhase: false
  });
  const initialCurrentIdRef = React.useRef(null);
  const setCurrentId = React.useCallback(currentId => {
    setState({
      currentId
    });
  }, []);
  floating_ui_react_index(() => {
    if (state.currentId) {
      if (initialCurrentIdRef.current === null) {
        initialCurrentIdRef.current = state.currentId;
      } else if (!state.isInstantPhase) {
        setState({
          isInstantPhase: true
        });
      }
    } else {
      if (state.isInstantPhase) {
        setState({
          isInstantPhase: false
        });
      }
      initialCurrentIdRef.current = null;
    }
  }, [state.currentId, state.isInstantPhase]);
  return /*#__PURE__*/React.createElement(FloatingDelayGroupContext.Provider, {
    value: React.useMemo(() => ({
      ...state,
      setState,
      setCurrentId
    }), [state, setCurrentId])
  }, children);
}
/**
 * Enables grouping when called inside a component that's a child of a
 * `FloatingDelayGroup`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
function useDelayGroup(context, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    open,
    onOpenChange,
    floatingId
  } = context;
  const {
    id: optionId,
    enabled = true
  } = options;
  const id = optionId != null ? optionId : floatingId;
  const groupContext = useDelayGroupContext();
  const {
    currentId,
    setCurrentId,
    initialDelay,
    setState,
    timeoutMs
  } = groupContext;
  floating_ui_react_index(() => {
    if (!enabled) return;
    if (!currentId) return;
    setState({
      delay: {
        open: 1,
        close: getDelay(initialDelay, 'close')
      }
    });
    if (currentId !== id) {
      onOpenChange(false);
    }
  }, [enabled, id, onOpenChange, setState, currentId, initialDelay]);
  floating_ui_react_index(() => {
    function unset() {
      onOpenChange(false);
      setState({
        delay: initialDelay,
        currentId: null
      });
    }
    if (!enabled) return;
    if (!currentId) return;
    if (!open && currentId === id) {
      if (timeoutMs) {
        const timeout = window.setTimeout(unset, timeoutMs);
        return () => {
          clearTimeout(timeout);
        };
      }
      unset();
    }
  }, [enabled, open, setState, currentId, id, onOpenChange, initialDelay, timeoutMs]);
  floating_ui_react_index(() => {
    if (!enabled) return;
    if (setCurrentId === NOOP || !open) return;
    setCurrentId(id);
  }, [enabled, open, setCurrentId, id]);
  return groupContext;
}

let rafId = 0;
function enqueueFocus(el, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    preventScroll = false,
    cancelPrevious = true,
    sync = false
  } = options;
  cancelPrevious && cancelAnimationFrame(rafId);
  const exec = () => el == null ? void 0 : el.focus({
    preventScroll
  });
  if (sync) {
    exec();
  } else {
    rafId = requestAnimationFrame(exec);
  }
}

function getAncestors(nodes, id) {
  var _nodes$find;
  let allAncestors = [];
  let currentParentId = (_nodes$find = nodes.find(node => node.id === id)) == null ? void 0 : _nodes$find.parentId;
  while (currentParentId) {
    const currentNode = nodes.find(node => node.id === currentParentId);
    currentParentId = currentNode == null ? void 0 : currentNode.parentId;
    if (currentNode) {
      allAncestors = allAncestors.concat(currentNode);
    }
  }
  return allAncestors;
}

function getChildren(nodes, id) {
  let allChildren = nodes.filter(node => {
    var _node$context;
    return node.parentId === id && ((_node$context = node.context) == null ? void 0 : _node$context.open);
  });
  let currentChildren = allChildren;
  while (currentChildren.length) {
    currentChildren = nodes.filter(node => {
      var _currentChildren;
      return (_currentChildren = currentChildren) == null ? void 0 : _currentChildren.some(n => {
        var _node$context2;
        return node.parentId === n.id && ((_node$context2 = node.context) == null ? void 0 : _node$context2.open);
      });
    });
    allChildren = allChildren.concat(currentChildren);
  }
  return allChildren;
}
function getDeepestNode(nodes, id) {
  let deepestNodeId;
  let maxDepth = -1;
  function findDeepest(nodeId, depth) {
    if (depth > maxDepth) {
      deepestNodeId = nodeId;
      maxDepth = depth;
    }
    const children = getChildren(nodes, nodeId);
    children.forEach(child => {
      findDeepest(child.id, depth + 1);
    });
  }
  findDeepest(id, 0);
  return nodes.find(node => node.id === deepestNodeId);
}

// Modified to add conditional `aria-hidden` support:
// https://github.com/theKashey/aria-hidden/blob/9220c8f4a4fd35f63bee5510a9f41a37264382d4/src/index.ts
let counterMap = /*#__PURE__*/new WeakMap();
let uncontrolledElementsSet = /*#__PURE__*/new WeakSet();
let markerMap = {};
let lockCount$1 = 0;
const supportsInert = () => typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype;
const unwrapHost = node => node && (node.host || unwrapHost(node.parentNode));
const correctElements = (parent, targets) => targets.map(target => {
  if (parent.contains(target)) {
    return target;
  }
  const correctedTarget = unwrapHost(target);
  if (parent.contains(correctedTarget)) {
    return correctedTarget;
  }
  return null;
}).filter(x => x != null);
function applyAttributeToOthers(uncorrectedAvoidElements, body, ariaHidden, inert) {
  const markerName = 'data-floating-ui-inert';
  const controlAttribute = inert ? 'inert' : ariaHidden ? 'aria-hidden' : null;
  const avoidElements = correctElements(body, uncorrectedAvoidElements);
  const elementsToKeep = new Set();
  const elementsToStop = new Set(avoidElements);
  const hiddenElements = [];
  if (!markerMap[markerName]) {
    markerMap[markerName] = new WeakMap();
  }
  const markerCounter = markerMap[markerName];
  avoidElements.forEach(keep);
  deep(body);
  elementsToKeep.clear();
  function keep(el) {
    if (!el || elementsToKeep.has(el)) {
      return;
    }
    elementsToKeep.add(el);
    el.parentNode && keep(el.parentNode);
  }
  function deep(parent) {
    if (!parent || elementsToStop.has(parent)) {
      return;
    }
    [].forEach.call(parent.children, node => {
      if (getNodeName(node) === 'script') return;
      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        const attr = controlAttribute ? node.getAttribute(controlAttribute) : null;
        const alreadyHidden = attr !== null && attr !== 'false';
        const counterValue = (counterMap.get(node) || 0) + 1;
        const markerValue = (markerCounter.get(node) || 0) + 1;
        counterMap.set(node, counterValue);
        markerCounter.set(node, markerValue);
        hiddenElements.push(node);
        if (counterValue === 1 && alreadyHidden) {
          uncontrolledElementsSet.add(node);
        }
        if (markerValue === 1) {
          node.setAttribute(markerName, '');
        }
        if (!alreadyHidden && controlAttribute) {
          node.setAttribute(controlAttribute, 'true');
        }
      }
    });
  }
  lockCount$1++;
  return () => {
    hiddenElements.forEach(element => {
      const counterValue = (counterMap.get(element) || 0) - 1;
      const markerValue = (markerCounter.get(element) || 0) - 1;
      counterMap.set(element, counterValue);
      markerCounter.set(element, markerValue);
      if (!counterValue) {
        if (!uncontrolledElementsSet.has(element) && controlAttribute) {
          element.removeAttribute(controlAttribute);
        }
        uncontrolledElementsSet.delete(element);
      }
      if (!markerValue) {
        element.removeAttribute(markerName);
      }
    });
    lockCount$1--;
    if (!lockCount$1) {
      counterMap = new WeakMap();
      counterMap = new WeakMap();
      uncontrolledElementsSet = new WeakSet();
      markerMap = {};
    }
  };
}
function markOthers(avoidElements, ariaHidden, inert) {
  if (ariaHidden === void 0) {
    ariaHidden = false;
  }
  if (inert === void 0) {
    inert = false;
  }
  const body = getDocument(avoidElements[0]).body;
  return applyAttributeToOthers(avoidElements.concat(Array.from(body.querySelectorAll('[aria-live]'))), body, ariaHidden, inert);
}

const getTabbableOptions = () => ({
  getShadowRoot: true,
  displayCheck:
  // JSDOM does not support the `tabbable` library. To solve this we can
  // check if `ResizeObserver` is a real function (not polyfilled), which
  // determines if the current environment is JSDOM-like.
  typeof ResizeObserver === 'function' && ResizeObserver.toString().includes('[native code]') ? 'full' : 'none'
});
function getTabbableIn(container, direction) {
  const allTabbable = index_esm_tabbable(container, getTabbableOptions());
  if (direction === 'prev') {
    allTabbable.reverse();
  }
  const activeIndex = allTabbable.indexOf(floating_ui_react_utils_activeElement(floating_ui_react_utils_getDocument(container)));
  const nextTabbableElements = allTabbable.slice(activeIndex + 1);
  return nextTabbableElements[0];
}
function getNextTabbable() {
  return getTabbableIn(document.body, 'next');
}
function getPreviousTabbable() {
  return getTabbableIn(document.body, 'prev');
}
function isOutsideEvent(event, container) {
  const containerElement = container || event.currentTarget;
  const relatedTarget = event.relatedTarget;
  return !relatedTarget || !floating_ui_react_utils_contains(containerElement, relatedTarget);
}
function disableFocusInside(container) {
  const tabbableElements = index_esm_tabbable(container, getTabbableOptions());
  tabbableElements.forEach(element => {
    element.dataset.tabindex = element.getAttribute('tabindex') || '';
    element.setAttribute('tabindex', '-1');
  });
}
function enableFocusInside(container) {
  const elements = container.querySelectorAll('[data-tabindex]');
  elements.forEach(element => {
    const tabindex = element.dataset.tabindex;
    delete element.dataset.tabindex;
    if (tabindex) {
      element.setAttribute('tabindex', tabindex);
    } else {
      element.removeAttribute('tabindex');
    }
  });
}

// See Diego Haz's Sandbox for making this logic work well on Safari/iOS:
// https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/FocusTrap.tsx

const HIDDEN_STYLES = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'fixed',
  whiteSpace: 'nowrap',
  width: '1px',
  top: 0,
  left: 0
};
let timeoutId;
function setActiveElementOnTab(event) {
  if (event.key === 'Tab') {
    event.target;
    clearTimeout(timeoutId);
  }
}
const FocusGuard = /*#__PURE__*/external_React_namespaceObject.forwardRef(function FocusGuard(props, ref) {
  const [role, setRole] = external_React_namespaceObject.useState();
  floating_ui_react_index(() => {
    if (floating_ui_react_utils_isSafari()) {
      // Unlike other screen readers such as NVDA and JAWS, the virtual cursor
      // on VoiceOver does trigger the onFocus event, so we can use the focus
      // trap element. On Safari, only buttons trigger the onFocus event.
      // NB: "group" role in the Sandbox no longer appears to work, must be a
      // button role.
      setRole('button');
    }
    document.addEventListener('keydown', setActiveElementOnTab);
    return () => {
      document.removeEventListener('keydown', setActiveElementOnTab);
    };
  }, []);
  const restProps = {
    ref,
    tabIndex: 0,
    // Role is only for VoiceOver
    role,
    'aria-hidden': role ? undefined : true,
    [createAttribute('focus-guard')]: '',
    style: HIDDEN_STYLES
  };
  return /*#__PURE__*/external_React_namespaceObject.createElement("span", floating_ui_react_extends({}, props, restProps));
});

const PortalContext = /*#__PURE__*/external_React_namespaceObject.createContext(null);
const attr = /*#__PURE__*/createAttribute('portal');
/**
 * @see https://floating-ui.com/docs/FloatingPortal#usefloatingportalnode
 */
function useFloatingPortalNode(props) {
  if (props === void 0) {
    props = {};
  }
  const {
    id,
    root
  } = props;
  const uniqueId = useId();
  const portalContext = usePortalContext();
  const [portalNode, setPortalNode] = external_React_namespaceObject.useState(null);
  const portalNodeRef = external_React_namespaceObject.useRef(null);
  floating_ui_react_index(() => {
    return () => {
      portalNode == null || portalNode.remove();
      // Allow the subsequent layout effects to create a new node on updates.
      // The portal node will still be cleaned up on unmount.
      // https://github.com/floating-ui/floating-ui/issues/2454
      queueMicrotask(() => {
        portalNodeRef.current = null;
      });
    };
  }, [portalNode]);
  floating_ui_react_index(() => {
    // Wait for the uniqueId to be generated before creating the portal node in
    // React <18 (using `useFloatingId` instead of the native `useId`).
    // https://github.com/floating-ui/floating-ui/issues/2778
    if (!uniqueId) return;
    if (portalNodeRef.current) return;
    const existingIdRoot = id ? document.getElementById(id) : null;
    if (!existingIdRoot) return;
    const subRoot = document.createElement('div');
    subRoot.id = uniqueId;
    subRoot.setAttribute(attr, '');
    existingIdRoot.appendChild(subRoot);
    portalNodeRef.current = subRoot;
    setPortalNode(subRoot);
  }, [id, uniqueId]);
  floating_ui_react_index(() => {
    // Wait for the root to exist before creating the portal node. The root must
    // be stored in state, not a ref, for this to work reactively.
    if (root === null) return;
    if (!uniqueId) return;
    if (portalNodeRef.current) return;
    let container = root || (portalContext == null ? void 0 : portalContext.portalNode);
    if (container && !isElement(container)) container = container.current;
    container = container || document.body;
    let idWrapper = null;
    if (id) {
      idWrapper = document.createElement('div');
      idWrapper.id = id;
      container.appendChild(idWrapper);
    }
    const subRoot = document.createElement('div');
    subRoot.id = uniqueId;
    subRoot.setAttribute(attr, '');
    container = idWrapper || container;
    container.appendChild(subRoot);
    portalNodeRef.current = subRoot;
    setPortalNode(subRoot);
  }, [id, root, uniqueId, portalContext]);
  return portalNode;
}
/**
 * Portals the floating element into a given container element — by default,
 * outside of the app root and into the body.
 * This is necessary to ensure the floating element can appear outside any
 * potential parent containers that cause clipping (such as `overflow: hidden`),
 * while retaining its location in the React tree.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
function FloatingPortal(props) {
  const {
    children,
    id,
    root,
    preserveTabOrder = true
  } = props;
  const portalNode = useFloatingPortalNode({
    id,
    root
  });
  const [focusManagerState, setFocusManagerState] = external_React_namespaceObject.useState(null);
  const beforeOutsideRef = external_React_namespaceObject.useRef(null);
  const afterOutsideRef = external_React_namespaceObject.useRef(null);
  const beforeInsideRef = external_React_namespaceObject.useRef(null);
  const afterInsideRef = external_React_namespaceObject.useRef(null);
  const modal = focusManagerState == null ? void 0 : focusManagerState.modal;
  const open = focusManagerState == null ? void 0 : focusManagerState.open;
  const shouldRenderGuards =
  // The FocusManager and therefore floating element are currently open/
  // rendered.
  !!focusManagerState &&
  // Guards are only for non-modal focus management.
  !focusManagerState.modal &&
  // Don't render if unmount is transitioning.
  focusManagerState.open && preserveTabOrder && !!(root || portalNode);

  // https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/TabbablePortal.tsx
  external_React_namespaceObject.useEffect(() => {
    if (!portalNode || !preserveTabOrder || modal) {
      return;
    }

    // Make sure elements inside the portal element are tabbable only when the
    // portal has already been focused, either by tabbing into a focus trap
    // element outside or using the mouse.
    function onFocus(event) {
      if (portalNode && isOutsideEvent(event)) {
        const focusing = event.type === 'focusin';
        const manageFocus = focusing ? enableFocusInside : disableFocusInside;
        manageFocus(portalNode);
      }
    }
    // Listen to the event on the capture phase so they run before the focus
    // trap elements onFocus prop is called.
    portalNode.addEventListener('focusin', onFocus, true);
    portalNode.addEventListener('focusout', onFocus, true);
    return () => {
      portalNode.removeEventListener('focusin', onFocus, true);
      portalNode.removeEventListener('focusout', onFocus, true);
    };
  }, [portalNode, preserveTabOrder, modal]);
  external_React_namespaceObject.useEffect(() => {
    if (!portalNode) return;
    if (open) return;
    enableFocusInside(portalNode);
  }, [open, portalNode]);
  return /*#__PURE__*/external_React_namespaceObject.createElement(PortalContext.Provider, {
    value: external_React_namespaceObject.useMemo(() => ({
      preserveTabOrder,
      beforeOutsideRef,
      afterOutsideRef,
      beforeInsideRef,
      afterInsideRef,
      portalNode,
      setFocusManagerState
    }), [preserveTabOrder, portalNode])
  }, shouldRenderGuards && portalNode && /*#__PURE__*/external_React_namespaceObject.createElement(FocusGuard, {
    "data-type": "outside",
    ref: beforeOutsideRef,
    onFocus: event => {
      if (isOutsideEvent(event, portalNode)) {
        var _beforeInsideRef$curr;
        (_beforeInsideRef$curr = beforeInsideRef.current) == null || _beforeInsideRef$curr.focus();
      } else {
        const prevTabbable = getPreviousTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        prevTabbable == null || prevTabbable.focus();
      }
    }
  }), shouldRenderGuards && portalNode && /*#__PURE__*/external_React_namespaceObject.createElement("span", {
    "aria-owns": portalNode.id,
    style: HIDDEN_STYLES
  }), portalNode && /*#__PURE__*/external_ReactDOM_.createPortal(children, portalNode), shouldRenderGuards && portalNode && /*#__PURE__*/external_React_namespaceObject.createElement(FocusGuard, {
    "data-type": "outside",
    ref: afterOutsideRef,
    onFocus: event => {
      if (isOutsideEvent(event, portalNode)) {
        var _afterInsideRef$curre;
        (_afterInsideRef$curre = afterInsideRef.current) == null || _afterInsideRef$curre.focus();
      } else {
        const nextTabbable = getNextTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        nextTabbable == null || nextTabbable.focus();
        (focusManagerState == null ? void 0 : focusManagerState.closeOnFocusOut) && (focusManagerState == null ? void 0 : focusManagerState.onOpenChange(false, event.nativeEvent, 'focus-out'));
      }
    }
  }));
}
const usePortalContext = () => external_React_namespaceObject.useContext(PortalContext);

const FOCUSABLE_ATTRIBUTE = 'data-floating-ui-focusable';
function getFloatingFocusElement(floatingElement) {
  if (!floatingElement) {
    return null;
  }
  // Try to find the element that has `{...getFloatingProps()}` spread on it.
  // This indicates the floating element is acting as a positioning wrapper, and
  // so focus should be managed on the child element with the event handlers and
  // aria props.
  return floatingElement.hasAttribute(FOCUSABLE_ATTRIBUTE) ? floatingElement : floatingElement.querySelector("[" + FOCUSABLE_ATTRIBUTE + "]") || floatingElement;
}

const LIST_LIMIT = 20;
let previouslyFocusedElements = (/* unused pure expression or super */ null && ([]));
function addPreviouslyFocusedElement(element) {
  previouslyFocusedElements = previouslyFocusedElements.filter(el => el.isConnected);
  let tabbableEl = element;
  if (!tabbableEl || getNodeName(tabbableEl) === 'body') return;
  if (!isTabbable(tabbableEl, getTabbableOptions())) {
    const tabbableChild = tabbable(tabbableEl, getTabbableOptions())[0];
    if (tabbableChild) {
      tabbableEl = tabbableChild;
    }
  }
  previouslyFocusedElements.push(tabbableEl);
  if (previouslyFocusedElements.length > LIST_LIMIT) {
    previouslyFocusedElements = previouslyFocusedElements.slice(-LIST_LIMIT);
  }
}
function getPreviouslyFocusedElement() {
  return previouslyFocusedElements.slice().reverse().find(el => el.isConnected);
}
const VisuallyHiddenDismiss = /*#__PURE__*/(/* unused pure expression or super */ null && (React.forwardRef(function VisuallyHiddenDismiss(props, ref) {
  return /*#__PURE__*/React.createElement("button", floating_ui_react_extends({}, props, {
    type: "button",
    ref: ref,
    tabIndex: -1,
    style: HIDDEN_STYLES
  }));
})));
/**
 * Provides focus management for the floating element.
 * @see https://floating-ui.com/docs/FloatingFocusManager
 */
function FloatingFocusManager(props) {
  const {
    context,
    children,
    disabled = false,
    order = ['content'],
    guards: _guards = true,
    initialFocus = 0,
    returnFocus = true,
    restoreFocus = false,
    modal = true,
    visuallyHiddenDismiss = false,
    closeOnFocusOut = true
  } = props;
  const {
    open,
    refs,
    nodeId,
    onOpenChange,
    events,
    dataRef,
    floatingId,
    elements: {
      domReference,
      floating
    }
  } = context;
  const ignoreInitialFocus = typeof initialFocus === 'number' && initialFocus < 0;
  // If the reference is a combobox and is typeable (e.g. input/textarea),
  // there are different focus semantics. The guards should not be rendered, but
  // aria-hidden should be applied to all nodes still. Further, the visually
  // hidden dismiss button should only appear at the end of the list, not the
  // start.
  const isUntrappedTypeableCombobox = isTypeableCombobox(domReference) && ignoreInitialFocus;

  // Force the guards to be rendered if the `inert` attribute is not supported.
  const guards = supportsInert() ? _guards : true;
  const orderRef = floating_ui_react_useLatestRef(order);
  const initialFocusRef = floating_ui_react_useLatestRef(initialFocus);
  const returnFocusRef = floating_ui_react_useLatestRef(returnFocus);
  const tree = useFloatingTree();
  const portalContext = usePortalContext();
  const startDismissButtonRef = React.useRef(null);
  const endDismissButtonRef = React.useRef(null);
  const preventReturnFocusRef = React.useRef(false);
  const isPointerDownRef = React.useRef(false);
  const tabbableIndexRef = React.useRef(-1);
  const isInsidePortal = portalContext != null;
  const floatingFocusElement = getFloatingFocusElement(floating);
  const getTabbableContent = useEffectEvent(function (container) {
    if (container === void 0) {
      container = floatingFocusElement;
    }
    return container ? tabbable(container, getTabbableOptions()) : [];
  });
  const getTabbableElements = useEffectEvent(container => {
    const content = getTabbableContent(container);
    return orderRef.current.map(type => {
      if (domReference && type === 'reference') {
        return domReference;
      }
      if (floatingFocusElement && type === 'floating') {
        return floatingFocusElement;
      }
      return content;
    }).filter(Boolean).flat();
  });
  React.useEffect(() => {
    if (disabled) return;
    if (!modal) return;
    function onKeyDown(event) {
      if (event.key === 'Tab') {
        // The focus guards have nothing to focus, so we need to stop the event.
        if (contains(floatingFocusElement, activeElement(getDocument(floatingFocusElement))) && getTabbableContent().length === 0 && !isUntrappedTypeableCombobox) {
          stopEvent(event);
        }
        const els = getTabbableElements();
        const target = getTarget(event);
        if (orderRef.current[0] === 'reference' && target === domReference) {
          stopEvent(event);
          if (event.shiftKey) {
            enqueueFocus(els[els.length - 1]);
          } else {
            enqueueFocus(els[1]);
          }
        }
        if (orderRef.current[1] === 'floating' && target === floatingFocusElement && event.shiftKey) {
          stopEvent(event);
          enqueueFocus(els[0]);
        }
      }
    }
    const doc = getDocument(floatingFocusElement);
    doc.addEventListener('keydown', onKeyDown);
    return () => {
      doc.removeEventListener('keydown', onKeyDown);
    };
  }, [disabled, domReference, floatingFocusElement, modal, orderRef, isUntrappedTypeableCombobox, getTabbableContent, getTabbableElements]);
  React.useEffect(() => {
    if (disabled) return;
    if (!floating) return;
    function handleFocusIn(event) {
      const target = getTarget(event);
      const tabbableContent = getTabbableContent();
      const tabbableIndex = tabbableContent.indexOf(target);
      if (tabbableIndex !== -1) {
        tabbableIndexRef.current = tabbableIndex;
      }
    }
    floating.addEventListener('focusin', handleFocusIn);
    return () => {
      floating.removeEventListener('focusin', handleFocusIn);
    };
  }, [disabled, floating, getTabbableContent]);
  React.useEffect(() => {
    if (disabled) return;
    if (!closeOnFocusOut) return;

    // In Safari, buttons lose focus when pressing them.
    function handlePointerDown() {
      isPointerDownRef.current = true;
      setTimeout(() => {
        isPointerDownRef.current = false;
      });
    }
    function handleFocusOutside(event) {
      const relatedTarget = event.relatedTarget;
      queueMicrotask(() => {
        const movedToUnrelatedNode = !(contains(domReference, relatedTarget) || contains(floating, relatedTarget) || contains(relatedTarget, floating) || contains(portalContext == null ? void 0 : portalContext.portalNode, relatedTarget) || relatedTarget != null && relatedTarget.hasAttribute(createAttribute('focus-guard')) || tree && (getChildren(tree.nodesRef.current, nodeId).find(node => {
          var _node$context, _node$context2;
          return contains((_node$context = node.context) == null ? void 0 : _node$context.elements.floating, relatedTarget) || contains((_node$context2 = node.context) == null ? void 0 : _node$context2.elements.domReference, relatedTarget);
        }) || getAncestors(tree.nodesRef.current, nodeId).find(node => {
          var _node$context3, _node$context4;
          return ((_node$context3 = node.context) == null ? void 0 : _node$context3.elements.floating) === relatedTarget || ((_node$context4 = node.context) == null ? void 0 : _node$context4.elements.domReference) === relatedTarget;
        })));

        // Restore focus to the previous tabbable element index to prevent
        // focus from being lost outside the floating tree.
        if (restoreFocus && movedToUnrelatedNode && activeElement(getDocument(floatingFocusElement)) === getDocument(floatingFocusElement).body) {
          // Let `FloatingPortal` effect knows that focus is still inside the
          // floating tree.
          if (isHTMLElement(floatingFocusElement)) {
            floatingFocusElement.focus();
          }
          const prevTabbableIndex = tabbableIndexRef.current;
          const tabbableContent = getTabbableContent();
          const nodeToFocus = tabbableContent[prevTabbableIndex] || tabbableContent[tabbableContent.length - 1] || floatingFocusElement;
          if (isHTMLElement(nodeToFocus)) {
            nodeToFocus.focus();
          }
        }

        // Focus did not move inside the floating tree, and there are no tabbable
        // portal guards to handle closing.
        if ((isUntrappedTypeableCombobox ? true : !modal) && relatedTarget && movedToUnrelatedNode && !isPointerDownRef.current &&
        // Fix React 18 Strict Mode returnFocus due to double rendering.
        relatedTarget !== getPreviouslyFocusedElement()) {
          preventReturnFocusRef.current = true;
          onOpenChange(false, event, 'focus-out');
        }
      });
    }
    if (floating && isHTMLElement(domReference)) {
      domReference.addEventListener('focusout', handleFocusOutside);
      domReference.addEventListener('pointerdown', handlePointerDown);
      floating.addEventListener('focusout', handleFocusOutside);
      return () => {
        domReference.removeEventListener('focusout', handleFocusOutside);
        domReference.removeEventListener('pointerdown', handlePointerDown);
        floating.removeEventListener('focusout', handleFocusOutside);
      };
    }
  }, [disabled, domReference, floating, floatingFocusElement, modal, nodeId, tree, portalContext, onOpenChange, closeOnFocusOut, restoreFocus, getTabbableContent, isUntrappedTypeableCombobox]);
  React.useEffect(() => {
    var _portalContext$portal;
    if (disabled) return;

    // Don't hide portals nested within the parent portal.
    const portalNodes = Array.from((portalContext == null || (_portalContext$portal = portalContext.portalNode) == null ? void 0 : _portalContext$portal.querySelectorAll("[" + createAttribute('portal') + "]")) || []);
    if (floating) {
      const insideElements = [floating, ...portalNodes, startDismissButtonRef.current, endDismissButtonRef.current, orderRef.current.includes('reference') || isUntrappedTypeableCombobox ? domReference : null].filter(x => x != null);
      const cleanup = modal || isUntrappedTypeableCombobox ? markOthers(insideElements, guards, !guards) : markOthers(insideElements);
      return () => {
        cleanup();
      };
    }
  }, [disabled, domReference, floating, modal, orderRef, portalContext, isUntrappedTypeableCombobox, guards]);
  floating_ui_react_index(() => {
    if (disabled || !isHTMLElement(floatingFocusElement)) return;
    const doc = getDocument(floatingFocusElement);
    const previouslyFocusedElement = activeElement(doc);

    // Wait for any layout effect state setters to execute to set `tabIndex`.
    queueMicrotask(() => {
      const focusableElements = getTabbableElements(floatingFocusElement);
      const initialFocusValue = initialFocusRef.current;
      const elToFocus = (typeof initialFocusValue === 'number' ? focusableElements[initialFocusValue] : initialFocusValue.current) || floatingFocusElement;
      const focusAlreadyInsideFloatingEl = contains(floatingFocusElement, previouslyFocusedElement);
      if (!ignoreInitialFocus && !focusAlreadyInsideFloatingEl && open) {
        enqueueFocus(elToFocus, {
          preventScroll: elToFocus === floatingFocusElement
        });
      }
    });
  }, [disabled, open, floatingFocusElement, ignoreInitialFocus, getTabbableElements, initialFocusRef]);
  floating_ui_react_index(() => {
    if (disabled || !floatingFocusElement) return;
    let preventReturnFocusScroll = false;
    const doc = getDocument(floatingFocusElement);
    const previouslyFocusedElement = activeElement(doc);
    const contextData = dataRef.current;
    let openEvent = contextData.openEvent;
    addPreviouslyFocusedElement(previouslyFocusedElement);

    // Dismissing via outside press should always ignore `returnFocus` to
    // prevent unwanted scrolling.
    function onOpenChange(_ref) {
      let {
        open,
        reason,
        event,
        nested
      } = _ref;
      if (open) {
        openEvent = event;
      }
      if (reason === 'escape-key' && refs.domReference.current) {
        addPreviouslyFocusedElement(refs.domReference.current);
      }
      if (reason === 'hover' && event.type === 'mouseleave') {
        preventReturnFocusRef.current = true;
      }
      if (reason !== 'outside-press') return;
      if (nested) {
        preventReturnFocusRef.current = false;
        preventReturnFocusScroll = true;
      } else {
        preventReturnFocusRef.current = !(isVirtualClick(event) || isVirtualPointerEvent(event));
      }
    }
    events.on('openchange', onOpenChange);
    const fallbackEl = doc.createElement('span');
    fallbackEl.setAttribute('tabindex', '-1');
    fallbackEl.setAttribute('aria-hidden', 'true');
    Object.assign(fallbackEl.style, HIDDEN_STYLES);
    if (isInsidePortal && domReference) {
      domReference.insertAdjacentElement('afterend', fallbackEl);
    }
    function getReturnElement() {
      if (typeof returnFocusRef.current === 'boolean') {
        return getPreviouslyFocusedElement() || fallbackEl;
      }
      return returnFocusRef.current.current || fallbackEl;
    }
    return () => {
      events.off('openchange', onOpenChange);
      const activeEl = activeElement(doc);
      const isFocusInsideFloatingTree = contains(floating, activeEl) || tree && getChildren(tree.nodesRef.current, nodeId).some(node => {
        var _node$context5;
        return contains((_node$context5 = node.context) == null ? void 0 : _node$context5.elements.floating, activeEl);
      });
      const shouldFocusReference = isFocusInsideFloatingTree || openEvent && ['click', 'mousedown'].includes(openEvent.type);
      if (shouldFocusReference && refs.domReference.current) {
        addPreviouslyFocusedElement(refs.domReference.current);
      }
      const returnElement = getReturnElement();
      queueMicrotask(() => {
        if (
        // eslint-disable-next-line react-hooks/exhaustive-deps
        returnFocusRef.current && !preventReturnFocusRef.current && isHTMLElement(returnElement) && (
        // If the focus moved somewhere else after mount, avoid returning focus
        // since it likely entered a different element which should be
        // respected: https://github.com/floating-ui/floating-ui/issues/2607
        returnElement !== activeEl && activeEl !== doc.body ? isFocusInsideFloatingTree : true)) {
          returnElement.focus({
            preventScroll: preventReturnFocusScroll
          });
        }
        fallbackEl.remove();
      });
    };
  }, [disabled, floating, floatingFocusElement, returnFocusRef, dataRef, refs, events, tree, nodeId, isInsidePortal, domReference]);
  React.useEffect(() => {
    // The `returnFocus` cleanup behavior is inside a microtask; ensure we
    // wait for it to complete before resetting the flag.
    queueMicrotask(() => {
      preventReturnFocusRef.current = false;
    });
  }, [disabled]);

  // Synchronize the `context` & `modal` value to the FloatingPortal context.
  // It will decide whether or not it needs to render its own guards.
  floating_ui_react_index(() => {
    if (disabled) return;
    if (!portalContext) return;
    portalContext.setFocusManagerState({
      modal,
      closeOnFocusOut,
      open,
      onOpenChange,
      refs
    });
    return () => {
      portalContext.setFocusManagerState(null);
    };
  }, [disabled, portalContext, modal, open, onOpenChange, refs, closeOnFocusOut]);
  floating_ui_react_index(() => {
    if (disabled) return;
    if (!floatingFocusElement) return;
    if (typeof MutationObserver !== 'function') return;
    if (ignoreInitialFocus) return;
    const handleMutation = () => {
      const tabIndex = floatingFocusElement.getAttribute('tabindex');
      const tabbableContent = getTabbableContent();
      const activeEl = activeElement(getDocument(floating));
      const tabbableIndex = tabbableContent.indexOf(activeEl);
      if (tabbableIndex !== -1) {
        tabbableIndexRef.current = tabbableIndex;
      }
      if (orderRef.current.includes('floating') || activeEl !== refs.domReference.current && tabbableContent.length === 0) {
        if (tabIndex !== '0') {
          floatingFocusElement.setAttribute('tabindex', '0');
        }
      } else if (tabIndex !== '-1') {
        floatingFocusElement.setAttribute('tabindex', '-1');
      }
    };
    handleMutation();
    const observer = new MutationObserver(handleMutation);
    observer.observe(floatingFocusElement, {
      childList: true,
      subtree: true,
      attributes: true
    });
    return () => {
      observer.disconnect();
    };
  }, [disabled, floating, floatingFocusElement, refs, orderRef, getTabbableContent, ignoreInitialFocus]);
  function renderDismissButton(location) {
    if (disabled || !visuallyHiddenDismiss || !modal) {
      return null;
    }
    return /*#__PURE__*/React.createElement(VisuallyHiddenDismiss, {
      ref: location === 'start' ? startDismissButtonRef : endDismissButtonRef,
      onClick: event => onOpenChange(false, event.nativeEvent)
    }, typeof visuallyHiddenDismiss === 'string' ? visuallyHiddenDismiss : 'Dismiss');
  }
  const shouldRenderGuards = !disabled && guards && (modal ? !isUntrappedTypeableCombobox : true) && (isInsidePortal || modal);
  return /*#__PURE__*/React.createElement(React.Fragment, null, shouldRenderGuards && /*#__PURE__*/React.createElement(FocusGuard, {
    "data-type": "inside",
    ref: portalContext == null ? void 0 : portalContext.beforeInsideRef,
    onFocus: event => {
      if (modal) {
        const els = getTabbableElements();
        enqueueFocus(order[0] === 'reference' ? els[0] : els[els.length - 1]);
      } else if (portalContext != null && portalContext.preserveTabOrder && portalContext.portalNode) {
        preventReturnFocusRef.current = false;
        if (isOutsideEvent(event, portalContext.portalNode)) {
          const nextTabbable = getNextTabbable() || domReference;
          nextTabbable == null || nextTabbable.focus();
        } else {
          var _portalContext$before;
          (_portalContext$before = portalContext.beforeOutsideRef.current) == null || _portalContext$before.focus();
        }
      }
    }
  }), !isUntrappedTypeableCombobox && renderDismissButton('start'), children, renderDismissButton('end'), shouldRenderGuards && /*#__PURE__*/React.createElement(FocusGuard, {
    "data-type": "inside",
    ref: portalContext == null ? void 0 : portalContext.afterInsideRef,
    onFocus: event => {
      if (modal) {
        enqueueFocus(getTabbableElements()[0]);
      } else if (portalContext != null && portalContext.preserveTabOrder && portalContext.portalNode) {
        if (closeOnFocusOut) {
          preventReturnFocusRef.current = true;
        }
        if (isOutsideEvent(event, portalContext.portalNode)) {
          const prevTabbable = getPreviousTabbable() || domReference;
          prevTabbable == null || prevTabbable.focus();
        } else {
          var _portalContext$afterO;
          (_portalContext$afterO = portalContext.afterOutsideRef.current) == null || _portalContext$afterO.focus();
        }
      }
    }
  }));
}

let lockCount = 0;
function enableScrollLock() {
  const isIOS = /iP(hone|ad|od)|iOS/.test(getPlatform());
  const bodyStyle = document.body.style;
  // RTL <body> scrollbar
  const scrollbarX = Math.round(document.documentElement.getBoundingClientRect().left) + document.documentElement.scrollLeft;
  const paddingProp = scrollbarX ? 'paddingLeft' : 'paddingRight';
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const scrollX = bodyStyle.left ? parseFloat(bodyStyle.left) : window.scrollX;
  const scrollY = bodyStyle.top ? parseFloat(bodyStyle.top) : window.scrollY;
  bodyStyle.overflow = 'hidden';
  if (scrollbarWidth) {
    bodyStyle[paddingProp] = scrollbarWidth + "px";
  }

  // Only iOS doesn't respect `overflow: hidden` on document.body, and this
  // technique has fewer side effects.
  if (isIOS) {
    var _window$visualViewpor, _window$visualViewpor2;
    // iOS 12 does not support `visualViewport`.
    const offsetLeft = ((_window$visualViewpor = window.visualViewport) == null ? void 0 : _window$visualViewpor.offsetLeft) || 0;
    const offsetTop = ((_window$visualViewpor2 = window.visualViewport) == null ? void 0 : _window$visualViewpor2.offsetTop) || 0;
    Object.assign(bodyStyle, {
      position: 'fixed',
      top: -(scrollY - Math.floor(offsetTop)) + "px",
      left: -(scrollX - Math.floor(offsetLeft)) + "px",
      right: '0'
    });
  }
  return () => {
    Object.assign(bodyStyle, {
      overflow: '',
      [paddingProp]: ''
    });
    if (isIOS) {
      Object.assign(bodyStyle, {
        position: '',
        top: '',
        left: '',
        right: ''
      });
      window.scrollTo(scrollX, scrollY);
    }
  };
}
let cleanup = () => {};

/**
 * Provides base styling for a fixed overlay element to dim content or block
 * pointer events behind a floating element.
 * It's a regular `<div>`, so it can be styled via any CSS solution you prefer.
 * @see https://floating-ui.com/docs/FloatingOverlay
 */
const FloatingOverlay = /*#__PURE__*/(/* unused pure expression or super */ null && (React.forwardRef(function FloatingOverlay(props, ref) {
  const {
    lockScroll = false,
    ...rest
  } = props;
  floating_ui_react_index(() => {
    if (!lockScroll) return;
    lockCount++;
    if (lockCount === 1) {
      cleanup = enableScrollLock();
    }
    return () => {
      lockCount--;
      if (lockCount === 0) {
        cleanup();
      }
    };
  }, [lockScroll]);
  return /*#__PURE__*/React.createElement("div", floating_ui_react_extends({
    ref: ref
  }, rest, {
    style: {
      position: 'fixed',
      overflow: 'auto',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...rest.style
    }
  }));
})));

function isButtonTarget(event) {
  return floating_ui_utils_dom_isHTMLElement(event.target) && event.target.tagName === 'BUTTON';
}
function isSpaceIgnored(element) {
  return isTypeableElement(element);
}
/**
 * Opens or closes the floating element when clicking the reference element.
 * @see https://floating-ui.com/docs/useClick
 */
function useClick(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    dataRef,
    elements: {
      domReference
    }
  } = context;
  const {
    enabled = true,
    event: eventOption = 'click',
    toggle = true,
    ignoreMouse = false,
    keyboardHandlers = true,
    stickIfOpen = true
  } = props;
  const pointerTypeRef = external_React_namespaceObject.useRef();
  const didKeyDownRef = external_React_namespaceObject.useRef(false);
  const reference = external_React_namespaceObject.useMemo(() => ({
    onPointerDown(event) {
      pointerTypeRef.current = event.pointerType;
    },
    onMouseDown(event) {
      const pointerType = pointerTypeRef.current;

      // Ignore all buttons except for the "main" button.
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
      if (event.button !== 0) return;
      if (eventOption === 'click') return;
      if (floating_ui_react_utils_isMouseLikePointerType(pointerType, true) && ignoreMouse) return;
      if (open && toggle && (dataRef.current.openEvent && stickIfOpen ? dataRef.current.openEvent.type === 'mousedown' : true)) {
        onOpenChange(false, event.nativeEvent, 'click');
      } else {
        // Prevent stealing focus from the floating element
        event.preventDefault();
        onOpenChange(true, event.nativeEvent, 'click');
      }
    },
    onClick(event) {
      const pointerType = pointerTypeRef.current;
      if (eventOption === 'mousedown' && pointerTypeRef.current) {
        pointerTypeRef.current = undefined;
        return;
      }
      if (floating_ui_react_utils_isMouseLikePointerType(pointerType, true) && ignoreMouse) return;
      if (open && toggle && (dataRef.current.openEvent && stickIfOpen ? dataRef.current.openEvent.type === 'click' : true)) {
        onOpenChange(false, event.nativeEvent, 'click');
      } else {
        onOpenChange(true, event.nativeEvent, 'click');
      }
    },
    onKeyDown(event) {
      pointerTypeRef.current = undefined;
      if (event.defaultPrevented || !keyboardHandlers || isButtonTarget(event)) {
        return;
      }
      if (event.key === ' ' && !isSpaceIgnored(domReference)) {
        // Prevent scrolling
        event.preventDefault();
        didKeyDownRef.current = true;
      }
      if (event.key === 'Enter') {
        if (open && toggle) {
          onOpenChange(false, event.nativeEvent, 'click');
        } else {
          onOpenChange(true, event.nativeEvent, 'click');
        }
      }
    },
    onKeyUp(event) {
      if (event.defaultPrevented || !keyboardHandlers || isButtonTarget(event) || isSpaceIgnored(domReference)) {
        return;
      }
      if (event.key === ' ' && didKeyDownRef.current) {
        didKeyDownRef.current = false;
        if (open && toggle) {
          onOpenChange(false, event.nativeEvent, 'click');
        } else {
          onOpenChange(true, event.nativeEvent, 'click');
        }
      }
    }
  }), [dataRef, domReference, eventOption, ignoreMouse, keyboardHandlers, onOpenChange, open, stickIfOpen, toggle]);
  return external_React_namespaceObject.useMemo(() => enabled ? {
    reference
  } : {}, [enabled, reference]);
}

function createVirtualElement(domElement, data) {
  let offsetX = null;
  let offsetY = null;
  let isAutoUpdateEvent = false;
  return {
    contextElement: domElement || undefined,
    getBoundingClientRect() {
      var _data$dataRef$current;
      const domRect = (domElement == null ? void 0 : domElement.getBoundingClientRect()) || {
        width: 0,
        height: 0,
        x: 0,
        y: 0
      };
      const isXAxis = data.axis === 'x' || data.axis === 'both';
      const isYAxis = data.axis === 'y' || data.axis === 'both';
      const canTrackCursorOnAutoUpdate = ['mouseenter', 'mousemove'].includes(((_data$dataRef$current = data.dataRef.current.openEvent) == null ? void 0 : _data$dataRef$current.type) || '') && data.pointerType !== 'touch';
      let width = domRect.width;
      let height = domRect.height;
      let x = domRect.x;
      let y = domRect.y;
      if (offsetX == null && data.x && isXAxis) {
        offsetX = domRect.x - data.x;
      }
      if (offsetY == null && data.y && isYAxis) {
        offsetY = domRect.y - data.y;
      }
      x -= offsetX || 0;
      y -= offsetY || 0;
      width = 0;
      height = 0;
      if (!isAutoUpdateEvent || canTrackCursorOnAutoUpdate) {
        width = data.axis === 'y' ? domRect.width : 0;
        height = data.axis === 'x' ? domRect.height : 0;
        x = isXAxis && data.x != null ? data.x : x;
        y = isYAxis && data.y != null ? data.y : y;
      } else if (isAutoUpdateEvent && !canTrackCursorOnAutoUpdate) {
        height = data.axis === 'x' ? domRect.height : height;
        width = data.axis === 'y' ? domRect.width : width;
      }
      isAutoUpdateEvent = true;
      return {
        width,
        height,
        x,
        y,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x
      };
    }
  };
}
function isMouseBasedEvent(event) {
  return event != null && event.clientX != null;
}
/**
 * Positions the floating element relative to a client point (in the viewport),
 * such as the mouse position. By default, it follows the mouse cursor.
 * @see https://floating-ui.com/docs/useClientPoint
 */
function useClientPoint(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    dataRef,
    elements: {
      floating,
      domReference
    },
    refs
  } = context;
  const {
    enabled = true,
    axis = 'both',
    x = null,
    y = null
  } = props;
  const initialRef = React.useRef(false);
  const cleanupListenerRef = React.useRef(null);
  const [pointerType, setPointerType] = React.useState();
  const [reactive, setReactive] = React.useState([]);
  const setReference = useEffectEvent((x, y) => {
    if (initialRef.current) return;

    // Prevent setting if the open event was not a mouse-like one
    // (e.g. focus to open, then hover over the reference element).
    // Only apply if the event exists.
    if (dataRef.current.openEvent && !isMouseBasedEvent(dataRef.current.openEvent)) {
      return;
    }
    refs.setPositionReference(createVirtualElement(domReference, {
      x,
      y,
      axis,
      dataRef,
      pointerType
    }));
  });
  const handleReferenceEnterOrMove = useEffectEvent(event => {
    if (x != null || y != null) return;
    if (!open) {
      setReference(event.clientX, event.clientY);
    } else if (!cleanupListenerRef.current) {
      // If there's no cleanup, there's no listener, but we want to ensure
      // we add the listener if the cursor landed on the floating element and
      // then back on the reference (i.e. it's interactive).
      setReactive([]);
    }
  });

  // If the pointer is a mouse-like pointer, we want to continue following the
  // mouse even if the floating element is transitioning out. On touch
  // devices, this is undesirable because the floating element will move to
  // the dismissal touch point.
  const openCheck = isMouseLikePointerType(pointerType) ? floating : open;
  const addListener = React.useCallback(() => {
    // Explicitly specified `x`/`y` coordinates shouldn't add a listener.
    if (!openCheck || !enabled || x != null || y != null) return;
    const win = getWindow(floating);
    function handleMouseMove(event) {
      const target = getTarget(event);
      if (!contains(floating, target)) {
        setReference(event.clientX, event.clientY);
      } else {
        win.removeEventListener('mousemove', handleMouseMove);
        cleanupListenerRef.current = null;
      }
    }
    if (!dataRef.current.openEvent || isMouseBasedEvent(dataRef.current.openEvent)) {
      win.addEventListener('mousemove', handleMouseMove);
      const cleanup = () => {
        win.removeEventListener('mousemove', handleMouseMove);
        cleanupListenerRef.current = null;
      };
      cleanupListenerRef.current = cleanup;
      return cleanup;
    }
    refs.setPositionReference(domReference);
  }, [openCheck, enabled, x, y, floating, dataRef, refs, domReference, setReference]);
  React.useEffect(() => {
    return addListener();
  }, [addListener, reactive]);
  React.useEffect(() => {
    if (enabled && !floating) {
      initialRef.current = false;
    }
  }, [enabled, floating]);
  React.useEffect(() => {
    if (!enabled && open) {
      initialRef.current = true;
    }
  }, [enabled, open]);
  floating_ui_react_index(() => {
    if (enabled && (x != null || y != null)) {
      initialRef.current = false;
      setReference(x, y);
    }
  }, [enabled, x, y, setReference]);
  const reference = React.useMemo(() => {
    function setPointerTypeRef(_ref) {
      let {
        pointerType
      } = _ref;
      setPointerType(pointerType);
    }
    return {
      onPointerDown: setPointerTypeRef,
      onPointerEnter: setPointerTypeRef,
      onMouseMove: handleReferenceEnterOrMove,
      onMouseEnter: handleReferenceEnterOrMove
    };
  }, [handleReferenceEnterOrMove]);
  return React.useMemo(() => enabled ? {
    reference
  } : {}, [enabled, reference]);
}

const bubbleHandlerKeys = {
  pointerdown: 'onPointerDown',
  mousedown: 'onMouseDown',
  click: 'onClick'
};
const captureHandlerKeys = {
  pointerdown: 'onPointerDownCapture',
  mousedown: 'onMouseDownCapture',
  click: 'onClickCapture'
};
const normalizeProp = normalizable => {
  var _normalizable$escapeK, _normalizable$outside;
  return {
    escapeKey: typeof normalizable === 'boolean' ? normalizable : (_normalizable$escapeK = normalizable == null ? void 0 : normalizable.escapeKey) != null ? _normalizable$escapeK : false,
    outsidePress: typeof normalizable === 'boolean' ? normalizable : (_normalizable$outside = normalizable == null ? void 0 : normalizable.outsidePress) != null ? _normalizable$outside : true
  };
};
/**
 * Closes the floating element when a dismissal is requested — by default, when
 * the user presses the `escape` key or outside of the floating element.
 * @see https://floating-ui.com/docs/useDismiss
 */
function useDismiss(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    elements,
    dataRef
  } = context;
  const {
    enabled = true,
    escapeKey = true,
    outsidePress: unstable_outsidePress = true,
    outsidePressEvent = 'pointerdown',
    referencePress = false,
    referencePressEvent = 'pointerdown',
    ancestorScroll = false,
    bubbles,
    capture
  } = props;
  const tree = useFloatingTree();
  const outsidePressFn = useEffectEvent(typeof unstable_outsidePress === 'function' ? unstable_outsidePress : () => false);
  const outsidePress = typeof unstable_outsidePress === 'function' ? outsidePressFn : unstable_outsidePress;
  const insideReactTreeRef = external_React_namespaceObject.useRef(false);
  const endedOrStartedInsideRef = external_React_namespaceObject.useRef(false);
  const {
    escapeKey: escapeKeyBubbles,
    outsidePress: outsidePressBubbles
  } = normalizeProp(bubbles);
  const {
    escapeKey: escapeKeyCapture,
    outsidePress: outsidePressCapture
  } = normalizeProp(capture);
  const isComposingRef = external_React_namespaceObject.useRef(false);
  const closeOnEscapeKeyDown = useEffectEvent(event => {
    var _dataRef$current$floa;
    if (!open || !enabled || !escapeKey || event.key !== 'Escape') {
      return;
    }

    // Wait until IME is settled. Pressing `Escape` while composing should
    // close the compose menu, but not the floating element.
    if (isComposingRef.current) {
      return;
    }
    const nodeId = (_dataRef$current$floa = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa.nodeId;
    const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];
    if (!escapeKeyBubbles) {
      event.stopPropagation();
      if (children.length > 0) {
        let shouldDismiss = true;
        children.forEach(child => {
          var _child$context;
          if ((_child$context = child.context) != null && _child$context.open && !child.context.dataRef.current.__escapeKeyBubbles) {
            shouldDismiss = false;
            return;
          }
        });
        if (!shouldDismiss) {
          return;
        }
      }
    }
    onOpenChange(false, isReactEvent(event) ? event.nativeEvent : event, 'escape-key');
  });
  const closeOnEscapeKeyDownCapture = useEffectEvent(event => {
    var _getTarget2;
    const callback = () => {
      var _getTarget;
      closeOnEscapeKeyDown(event);
      (_getTarget = floating_ui_react_utils_getTarget(event)) == null || _getTarget.removeEventListener('keydown', callback);
    };
    (_getTarget2 = floating_ui_react_utils_getTarget(event)) == null || _getTarget2.addEventListener('keydown', callback);
  });
  const closeOnPressOutside = useEffectEvent(event => {
    var _dataRef$current$floa2;
    // Given developers can stop the propagation of the synthetic event,
    // we can only be confident with a positive value.
    const insideReactTree = insideReactTreeRef.current;
    insideReactTreeRef.current = false;

    // When click outside is lazy (`click` event), handle dragging.
    // Don't close if:
    // - The click started inside the floating element.
    // - The click ended inside the floating element.
    const endedOrStartedInside = endedOrStartedInsideRef.current;
    endedOrStartedInsideRef.current = false;
    if (outsidePressEvent === 'click' && endedOrStartedInside) {
      return;
    }
    if (insideReactTree) {
      return;
    }
    if (typeof outsidePress === 'function' && !outsidePress(event)) {
      return;
    }
    const target = floating_ui_react_utils_getTarget(event);
    const inertSelector = "[" + createAttribute('inert') + "]";
    const markers = floating_ui_react_utils_getDocument(elements.floating).querySelectorAll(inertSelector);
    let targetRootAncestor = isElement(target) ? target : null;
    while (targetRootAncestor && !isLastTraversableNode(targetRootAncestor)) {
      const nextParent = getParentNode(targetRootAncestor);
      if (isLastTraversableNode(nextParent) || !isElement(nextParent)) {
        break;
      }
      targetRootAncestor = nextParent;
    }

    // Check if the click occurred on a third-party element injected after the
    // floating element rendered.
    if (markers.length && isElement(target) && !isRootElement(target) &&
    // Clicked on a direct ancestor (e.g. FloatingOverlay).
    !floating_ui_react_utils_contains(target, elements.floating) &&
    // If the target root element contains none of the markers, then the
    // element was injected after the floating element rendered.
    Array.from(markers).every(marker => !floating_ui_react_utils_contains(targetRootAncestor, marker))) {
      return;
    }

    // Check if the click occurred on the scrollbar
    if (floating_ui_utils_dom_isHTMLElement(target) && floating) {
      // In Firefox, `target.scrollWidth > target.clientWidth` for inline
      // elements.
      const canScrollX = target.clientWidth > 0 && target.scrollWidth > target.clientWidth;
      const canScrollY = target.clientHeight > 0 && target.scrollHeight > target.clientHeight;
      let xCond = canScrollY && event.offsetX > target.clientWidth;

      // In some browsers it is possible to change the <body> (or window)
      // scrollbar to the left side, but is very rare and is difficult to
      // check for. Plus, for modal dialogs with backdrops, it is more
      // important that the backdrop is checked but not so much the window.
      if (canScrollY) {
        const isRTL = floating_ui_utils_dom_getComputedStyle(target).direction === 'rtl';
        if (isRTL) {
          xCond = event.offsetX <= target.offsetWidth - target.clientWidth;
        }
      }
      if (xCond || canScrollX && event.offsetY > target.clientHeight) {
        return;
      }
    }
    const nodeId = (_dataRef$current$floa2 = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa2.nodeId;
    const targetIsInsideChildren = tree && getChildren(tree.nodesRef.current, nodeId).some(node => {
      var _node$context;
      return isEventTargetWithin(event, (_node$context = node.context) == null ? void 0 : _node$context.elements.floating);
    });
    if (isEventTargetWithin(event, elements.floating) || isEventTargetWithin(event, elements.domReference) || targetIsInsideChildren) {
      return;
    }
    const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];
    if (children.length > 0) {
      let shouldDismiss = true;
      children.forEach(child => {
        var _child$context2;
        if ((_child$context2 = child.context) != null && _child$context2.open && !child.context.dataRef.current.__outsidePressBubbles) {
          shouldDismiss = false;
          return;
        }
      });
      if (!shouldDismiss) {
        return;
      }
    }
    onOpenChange(false, event, 'outside-press');
  });
  const closeOnPressOutsideCapture = useEffectEvent(event => {
    var _getTarget4;
    const callback = () => {
      var _getTarget3;
      closeOnPressOutside(event);
      (_getTarget3 = floating_ui_react_utils_getTarget(event)) == null || _getTarget3.removeEventListener(outsidePressEvent, callback);
    };
    (_getTarget4 = floating_ui_react_utils_getTarget(event)) == null || _getTarget4.addEventListener(outsidePressEvent, callback);
  });
  external_React_namespaceObject.useEffect(() => {
    if (!open || !enabled) {
      return;
    }
    dataRef.current.__escapeKeyBubbles = escapeKeyBubbles;
    dataRef.current.__outsidePressBubbles = outsidePressBubbles;
    let compositionTimeout = -1;
    function onScroll(event) {
      onOpenChange(false, event, 'ancestor-scroll');
    }
    function handleCompositionStart() {
      window.clearTimeout(compositionTimeout);
      isComposingRef.current = true;
    }
    function handleCompositionEnd() {
      // Safari fires `compositionend` before `keydown`, so we need to wait
      // until the next tick to set `isComposing` to `false`.
      // https://bugs.webkit.org/show_bug.cgi?id=165004
      compositionTimeout = window.setTimeout(() => {
        isComposingRef.current = false;
      },
      // 0ms or 1ms don't work in Safari. 5ms appears to consistently work.
      // Only apply to WebKit for the test to remain 0ms.
      isWebKit() ? 5 : 0);
    }
    const doc = floating_ui_react_utils_getDocument(elements.floating);
    if (escapeKey) {
      doc.addEventListener('keydown', escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
      doc.addEventListener('compositionstart', handleCompositionStart);
      doc.addEventListener('compositionend', handleCompositionEnd);
    }
    outsidePress && doc.addEventListener(outsidePressEvent, outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside, outsidePressCapture);
    let ancestors = [];
    if (ancestorScroll) {
      if (isElement(elements.domReference)) {
        ancestors = getOverflowAncestors(elements.domReference);
      }
      if (isElement(elements.floating)) {
        ancestors = ancestors.concat(getOverflowAncestors(elements.floating));
      }
      if (!isElement(elements.reference) && elements.reference && elements.reference.contextElement) {
        ancestors = ancestors.concat(getOverflowAncestors(elements.reference.contextElement));
      }
    }

    // Ignore the visual viewport for scrolling dismissal (allow pinch-zoom)
    ancestors = ancestors.filter(ancestor => {
      var _doc$defaultView;
      return ancestor !== ((_doc$defaultView = doc.defaultView) == null ? void 0 : _doc$defaultView.visualViewport);
    });
    ancestors.forEach(ancestor => {
      ancestor.addEventListener('scroll', onScroll, {
        passive: true
      });
    });
    return () => {
      if (escapeKey) {
        doc.removeEventListener('keydown', escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
        doc.removeEventListener('compositionstart', handleCompositionStart);
        doc.removeEventListener('compositionend', handleCompositionEnd);
      }
      outsidePress && doc.removeEventListener(outsidePressEvent, outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside, outsidePressCapture);
      ancestors.forEach(ancestor => {
        ancestor.removeEventListener('scroll', onScroll);
      });
      window.clearTimeout(compositionTimeout);
    };
  }, [dataRef, elements, escapeKey, outsidePress, outsidePressEvent, open, onOpenChange, ancestorScroll, enabled, escapeKeyBubbles, outsidePressBubbles, closeOnEscapeKeyDown, escapeKeyCapture, closeOnEscapeKeyDownCapture, closeOnPressOutside, outsidePressCapture, closeOnPressOutsideCapture]);
  external_React_namespaceObject.useEffect(() => {
    insideReactTreeRef.current = false;
  }, [outsidePress, outsidePressEvent]);
  const reference = external_React_namespaceObject.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    [bubbleHandlerKeys[referencePressEvent]]: event => {
      if (referencePress) {
        onOpenChange(false, event.nativeEvent, 'reference-press');
      }
    }
  }), [closeOnEscapeKeyDown, onOpenChange, referencePress, referencePressEvent]);
  const floating = external_React_namespaceObject.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    onMouseDown() {
      endedOrStartedInsideRef.current = true;
    },
    onMouseUp() {
      endedOrStartedInsideRef.current = true;
    },
    [captureHandlerKeys[outsidePressEvent]]: () => {
      insideReactTreeRef.current = true;
    }
  }), [closeOnEscapeKeyDown, outsidePressEvent]);
  return external_React_namespaceObject.useMemo(() => enabled ? {
    reference,
    floating
  } : {}, [enabled, reference, floating]);
}

function useFloatingRootContext(options) {
  const {
    open = false,
    onOpenChange: onOpenChangeProp,
    elements: elementsProp
  } = options;
  const floatingId = useId();
  const dataRef = external_React_namespaceObject.useRef({});
  const [events] = external_React_namespaceObject.useState(() => createPubSub());
  const nested = useFloatingParentNodeId() != null;
  if (false) // removed by dead control flow
{}
  const [positionReference, setPositionReference] = external_React_namespaceObject.useState(elementsProp.reference);
  const onOpenChange = useEffectEvent((open, event, reason) => {
    dataRef.current.openEvent = open ? event : undefined;
    events.emit('openchange', {
      open,
      event,
      reason,
      nested
    });
    onOpenChangeProp == null || onOpenChangeProp(open, event, reason);
  });
  const refs = external_React_namespaceObject.useMemo(() => ({
    setPositionReference
  }), []);
  const elements = external_React_namespaceObject.useMemo(() => ({
    reference: positionReference || elementsProp.reference || null,
    floating: elementsProp.floating || null,
    domReference: elementsProp.reference
  }), [positionReference, elementsProp.reference, elementsProp.floating]);
  return external_React_namespaceObject.useMemo(() => ({
    dataRef,
    open,
    onOpenChange,
    elements,
    events,
    floatingId,
    refs
  }), [open, onOpenChange, elements, events, floatingId, refs]);
}

/**
 * Provides data to position a floating element and context to add interactions.
 * @see https://floating-ui.com/docs/useFloating
 */
function floating_ui_react_useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    nodeId
  } = options;
  const internalRootContext = useFloatingRootContext({
    ...options,
    elements: {
      reference: null,
      floating: null,
      ...options.elements
    }
  });
  const rootContext = options.rootContext || internalRootContext;
  const computedElements = rootContext.elements;
  const [_domReference, setDomReference] = external_React_namespaceObject.useState(null);
  const [positionReference, _setPositionReference] = external_React_namespaceObject.useState(null);
  const optionDomReference = computedElements == null ? void 0 : computedElements.domReference;
  const domReference = optionDomReference || _domReference;
  const domReferenceRef = external_React_namespaceObject.useRef(null);
  const tree = useFloatingTree();
  floating_ui_react_index(() => {
    if (domReference) {
      domReferenceRef.current = domReference;
    }
  }, [domReference]);
  const position = useFloating({
    ...options,
    elements: {
      ...computedElements,
      ...(positionReference && {
        reference: positionReference
      })
    }
  });
  const setPositionReference = external_React_namespaceObject.useCallback(node => {
    const computedPositionReference = isElement(node) ? {
      getBoundingClientRect: () => node.getBoundingClientRect(),
      contextElement: node
    } : node;
    // Store the positionReference in state if the DOM reference is specified externally via the
    // `elements.reference` option. This ensures that it won't be overridden on future renders.
    _setPositionReference(computedPositionReference);
    position.refs.setReference(computedPositionReference);
  }, [position.refs]);
  const setReference = external_React_namespaceObject.useCallback(node => {
    if (isElement(node) || node === null) {
      domReferenceRef.current = node;
      setDomReference(node);
    }

    // Backwards-compatibility for passing a virtual element to `reference`
    // after it has set the DOM reference.
    if (isElement(position.refs.reference.current) || position.refs.reference.current === null ||
    // Don't allow setting virtual elements using the old technique back to
    // `null` to support `positionReference` + an unstable `reference`
    // callback ref.
    node !== null && !isElement(node)) {
      position.refs.setReference(node);
    }
  }, [position.refs]);
  const refs = external_React_namespaceObject.useMemo(() => ({
    ...position.refs,
    setReference,
    setPositionReference,
    domReference: domReferenceRef
  }), [position.refs, setReference, setPositionReference]);
  const elements = external_React_namespaceObject.useMemo(() => ({
    ...position.elements,
    domReference: domReference
  }), [position.elements, domReference]);
  const context = external_React_namespaceObject.useMemo(() => ({
    ...position,
    ...rootContext,
    refs,
    elements,
    nodeId
  }), [position, refs, elements, nodeId, rootContext]);
  floating_ui_react_index(() => {
    rootContext.dataRef.current.floatingContext = context;
    const node = tree == null ? void 0 : tree.nodesRef.current.find(node => node.id === nodeId);
    if (node) {
      node.context = context;
    }
  });
  return external_React_namespaceObject.useMemo(() => ({
    ...position,
    context,
    refs,
    elements
  }), [position, refs, elements, context]);
}

/**
 * Opens the floating element while the reference element has focus, like CSS
 * `:focus`.
 * @see https://floating-ui.com/docs/useFocus
 */
function useFocus(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    events,
    dataRef,
    elements
  } = context;
  const {
    enabled = true,
    visibleOnly = true
  } = props;
  const blockFocusRef = external_React_namespaceObject.useRef(false);
  const timeoutRef = external_React_namespaceObject.useRef();
  const keyboardModalityRef = external_React_namespaceObject.useRef(true);
  external_React_namespaceObject.useEffect(() => {
    if (!enabled) return;
    const win = floating_ui_utils_dom_getWindow(elements.domReference);

    // If the reference was focused and the user left the tab/window, and the
    // floating element was not open, the focus should be blocked when they
    // return to the tab/window.
    function onBlur() {
      if (!open && floating_ui_utils_dom_isHTMLElement(elements.domReference) && elements.domReference === floating_ui_react_utils_activeElement(floating_ui_react_utils_getDocument(elements.domReference))) {
        blockFocusRef.current = true;
      }
    }
    function onKeyDown() {
      keyboardModalityRef.current = true;
    }
    win.addEventListener('blur', onBlur);
    win.addEventListener('keydown', onKeyDown, true);
    return () => {
      win.removeEventListener('blur', onBlur);
      win.removeEventListener('keydown', onKeyDown, true);
    };
  }, [elements.domReference, open, enabled]);
  external_React_namespaceObject.useEffect(() => {
    if (!enabled) return;
    function onOpenChange(_ref) {
      let {
        reason
      } = _ref;
      if (reason === 'reference-press' || reason === 'escape-key') {
        blockFocusRef.current = true;
      }
    }
    events.on('openchange', onOpenChange);
    return () => {
      events.off('openchange', onOpenChange);
    };
  }, [events, enabled]);
  external_React_namespaceObject.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  const reference = external_React_namespaceObject.useMemo(() => ({
    onPointerDown(event) {
      if (floating_ui_react_utils_isVirtualPointerEvent(event.nativeEvent)) return;
      keyboardModalityRef.current = false;
    },
    onMouseLeave() {
      blockFocusRef.current = false;
    },
    onFocus(event) {
      if (blockFocusRef.current) return;
      const target = floating_ui_react_utils_getTarget(event.nativeEvent);
      if (visibleOnly && isElement(target)) {
        try {
          // Mac Safari unreliably matches `:focus-visible` on the reference
          // if focus was outside the page initially - use the fallback
          // instead.
          if (floating_ui_react_utils_isSafari() && floating_ui_react_utils_isMac()) throw Error();
          if (!target.matches(':focus-visible')) return;
        } catch (e) {
          // Old browsers will throw an error when using `:focus-visible`.
          if (!keyboardModalityRef.current && !isTypeableElement(target)) {
            return;
          }
        }
      }
      onOpenChange(true, event.nativeEvent, 'focus');
    },
    onBlur(event) {
      blockFocusRef.current = false;
      const relatedTarget = event.relatedTarget;
      const nativeEvent = event.nativeEvent;

      // Hit the non-modal focus management portal guard. Focus will be
      // moved into the floating element immediately after.
      const movedToFocusGuard = isElement(relatedTarget) && relatedTarget.hasAttribute(createAttribute('focus-guard')) && relatedTarget.getAttribute('data-type') === 'outside';

      // Wait for the window blur listener to fire.
      timeoutRef.current = window.setTimeout(() => {
        var _dataRef$current$floa;
        const activeEl = floating_ui_react_utils_activeElement(elements.domReference ? elements.domReference.ownerDocument : document);

        // Focus left the page, keep it open.
        if (!relatedTarget && activeEl === elements.domReference) return;

        // When focusing the reference element (e.g. regular click), then
        // clicking into the floating element, prevent it from hiding.
        // Note: it must be focusable, e.g. `tabindex="-1"`.
        // We can not rely on relatedTarget to point to the correct element
        // as it will only point to the shadow host of the newly focused element
        // and not the element that actually has received focus if it is located
        // inside a shadow root.
        if (floating_ui_react_utils_contains((_dataRef$current$floa = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa.refs.floating.current, activeEl) || floating_ui_react_utils_contains(elements.domReference, activeEl) || movedToFocusGuard) {
          return;
        }
        onOpenChange(false, nativeEvent, 'focus');
      });
    }
  }), [dataRef, elements.domReference, onOpenChange, visibleOnly]);
  return external_React_namespaceObject.useMemo(() => enabled ? {
    reference
  } : {}, [enabled, reference]);
}

const ACTIVE_KEY = 'active';
const SELECTED_KEY = 'selected';
function mergeProps(userProps, propsList, elementKey) {
  const map = new Map();
  const isItem = elementKey === 'item';
  let domUserProps = userProps;
  if (isItem && userProps) {
    const {
      [ACTIVE_KEY]: _,
      [SELECTED_KEY]: __,
      ...validProps
    } = userProps;
    domUserProps = validProps;
  }
  return {
    ...(elementKey === 'floating' && {
      tabIndex: -1,
      [FOCUSABLE_ATTRIBUTE]: ''
    }),
    ...domUserProps,
    ...propsList.map(value => {
      const propsOrGetProps = value ? value[elementKey] : null;
      if (typeof propsOrGetProps === 'function') {
        return userProps ? propsOrGetProps(userProps) : null;
      }
      return propsOrGetProps;
    }).concat(userProps).reduce((acc, props) => {
      if (!props) {
        return acc;
      }
      Object.entries(props).forEach(_ref => {
        let [key, value] = _ref;
        if (isItem && [ACTIVE_KEY, SELECTED_KEY].includes(key)) {
          return;
        }
        if (key.indexOf('on') === 0) {
          if (!map.has(key)) {
            map.set(key, []);
          }
          if (typeof value === 'function') {
            var _map$get;
            (_map$get = map.get(key)) == null || _map$get.push(value);
            acc[key] = function () {
              var _map$get2;
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              return (_map$get2 = map.get(key)) == null ? void 0 : _map$get2.map(fn => fn(...args)).find(val => val !== undefined);
            };
          }
        } else {
          acc[key] = value;
        }
      });
      return acc;
    }, {})
  };
}
/**
 * Merges an array of interaction hooks' props into prop getters, allowing
 * event handler functions to be composed together without overwriting one
 * another.
 * @see https://floating-ui.com/docs/useInteractions
 */
function useInteractions(propsList) {
  if (propsList === void 0) {
    propsList = [];
  }
  const referenceDeps = propsList.map(key => key == null ? void 0 : key.reference);
  const floatingDeps = propsList.map(key => key == null ? void 0 : key.floating);
  const itemDeps = propsList.map(key => key == null ? void 0 : key.item);
  const getReferenceProps = external_React_namespaceObject.useCallback(userProps => mergeProps(userProps, propsList, 'reference'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  referenceDeps);
  const getFloatingProps = external_React_namespaceObject.useCallback(userProps => mergeProps(userProps, propsList, 'floating'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  floatingDeps);
  const getItemProps = external_React_namespaceObject.useCallback(userProps => mergeProps(userProps, propsList, 'item'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  itemDeps);
  return external_React_namespaceObject.useMemo(() => ({
    getReferenceProps,
    getFloatingProps,
    getItemProps
  }), [getReferenceProps, getFloatingProps, getItemProps]);
}

let isPreventScrollSupported = false;
function doSwitch(orientation, vertical, horizontal) {
  switch (orientation) {
    case 'vertical':
      return vertical;
    case 'horizontal':
      return horizontal;
    default:
      return vertical || horizontal;
  }
}
function isMainOrientationKey(key, orientation) {
  const vertical = key === ARROW_UP || key === ARROW_DOWN;
  const horizontal = key === ARROW_LEFT || key === ARROW_RIGHT;
  return doSwitch(orientation, vertical, horizontal);
}
function isMainOrientationToEndKey(key, orientation, rtl) {
  const vertical = key === ARROW_DOWN;
  const horizontal = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  return doSwitch(orientation, vertical, horizontal) || key === 'Enter' || key === ' ' || key === '';
}
function isCrossOrientationOpenKey(key, orientation, rtl) {
  const vertical = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  const horizontal = key === ARROW_DOWN;
  return doSwitch(orientation, vertical, horizontal);
}
function isCrossOrientationCloseKey(key, orientation, rtl) {
  const vertical = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT;
  const horizontal = key === ARROW_UP;
  return doSwitch(orientation, vertical, horizontal);
}
/**
 * Adds arrow key-based navigation of a list of items, either using real DOM
 * focus or virtual focus.
 * @see https://floating-ui.com/docs/useListNavigation
 */
function useListNavigation(context, props) {
  const {
    open,
    onOpenChange,
    elements
  } = context;
  const {
    listRef,
    activeIndex,
    onNavigate: unstable_onNavigate = () => {},
    enabled = true,
    selectedIndex = null,
    allowEscape = false,
    loop = false,
    nested = false,
    rtl = false,
    virtual = false,
    focusItemOnOpen = 'auto',
    focusItemOnHover = true,
    openOnArrowKeyDown = true,
    disabledIndices = undefined,
    orientation = 'vertical',
    cols = 1,
    scrollItemIntoView = true,
    virtualItemRef,
    itemSizes,
    dense = false
  } = props;
  if (false) // removed by dead control flow
{}
  const floatingFocusElement = getFloatingFocusElement(elements.floating);
  const floatingFocusElementRef = floating_ui_react_useLatestRef(floatingFocusElement);
  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree();
  const onNavigate = useEffectEvent(unstable_onNavigate);
  const typeableComboboxReference = isTypeableCombobox(elements.domReference);
  const focusItemOnOpenRef = React.useRef(focusItemOnOpen);
  const indexRef = React.useRef(selectedIndex != null ? selectedIndex : -1);
  const keyRef = React.useRef(null);
  const isPointerModalityRef = React.useRef(true);
  const previousOnNavigateRef = React.useRef(onNavigate);
  const previousMountedRef = React.useRef(!!elements.floating);
  const previousOpenRef = React.useRef(open);
  const forceSyncFocus = React.useRef(false);
  const forceScrollIntoViewRef = React.useRef(false);
  const disabledIndicesRef = floating_ui_react_useLatestRef(disabledIndices);
  const latestOpenRef = floating_ui_react_useLatestRef(open);
  const scrollItemIntoViewRef = floating_ui_react_useLatestRef(scrollItemIntoView);
  const selectedIndexRef = floating_ui_react_useLatestRef(selectedIndex);
  const [activeId, setActiveId] = React.useState();
  const [virtualId, setVirtualId] = React.useState();
  const focusItem = useEffectEvent(function (listRef, indexRef, forceScrollIntoView) {
    if (forceScrollIntoView === void 0) {
      forceScrollIntoView = false;
    }
    function runFocus(item) {
      if (virtual) {
        setActiveId(item.id);
        tree == null || tree.events.emit('virtualfocus', item);
        if (virtualItemRef) {
          virtualItemRef.current = item;
        }
      } else {
        enqueueFocus(item, {
          preventScroll: true,
          // Mac Safari does not move the virtual cursor unless the focus call
          // is sync. However, for the very first focus call, we need to wait
          // for the position to be ready in order to prevent unwanted
          // scrolling. This means the virtual cursor will not move to the first
          // item when first opening the floating element, but will on
          // subsequent calls. `preventScroll` is supported in modern Safari,
          // so we can use that instead.
          // iOS Safari must be async or the first item will not be focused.
          sync: isMac() && isSafari() ? isPreventScrollSupported || forceSyncFocus.current : false
        });
      }
    }
    const initialItem = listRef.current[indexRef.current];
    if (initialItem) {
      runFocus(initialItem);
    }
    requestAnimationFrame(() => {
      const waitedItem = listRef.current[indexRef.current] || initialItem;
      if (!waitedItem) return;
      if (!initialItem) {
        runFocus(waitedItem);
      }
      const scrollIntoViewOptions = scrollItemIntoViewRef.current;
      const shouldScrollIntoView = scrollIntoViewOptions && item && (forceScrollIntoView || !isPointerModalityRef.current);
      if (shouldScrollIntoView) {
        // JSDOM doesn't support `.scrollIntoView()` but it's widely supported
        // by all browsers.
        waitedItem.scrollIntoView == null || waitedItem.scrollIntoView(typeof scrollIntoViewOptions === 'boolean' ? {
          block: 'nearest',
          inline: 'nearest'
        } : scrollIntoViewOptions);
      }
    });
  });
  floating_ui_react_index(() => {
    document.createElement('div').focus({
      get preventScroll() {
        isPreventScrollSupported = true;
        return false;
      }
    });
  }, []);

  // Sync `selectedIndex` to be the `activeIndex` upon opening the floating
  // element. Also, reset `activeIndex` upon closing the floating element.
  floating_ui_react_index(() => {
    if (!enabled) return;
    if (open && elements.floating) {
      if (focusItemOnOpenRef.current && selectedIndex != null) {
        // Regardless of the pointer modality, we want to ensure the selected
        // item comes into view when the floating element is opened.
        forceScrollIntoViewRef.current = true;
        indexRef.current = selectedIndex;
        onNavigate(selectedIndex);
      }
    } else if (previousMountedRef.current) {
      // Since the user can specify `onNavigate` conditionally
      // (onNavigate: open ? setActiveIndex : setSelectedIndex),
      // we store and call the previous function.
      indexRef.current = -1;
      previousOnNavigateRef.current(null);
    }
  }, [enabled, open, elements.floating, selectedIndex, onNavigate]);

  // Sync `activeIndex` to be the focused item while the floating element is
  // open.
  floating_ui_react_index(() => {
    if (!enabled) return;
    if (open && elements.floating) {
      if (activeIndex == null) {
        forceSyncFocus.current = false;
        if (selectedIndexRef.current != null) {
          return;
        }

        // Reset while the floating element was open (e.g. the list changed).
        if (previousMountedRef.current) {
          indexRef.current = -1;
          focusItem(listRef, indexRef);
        }

        // Initial sync.
        if ((!previousOpenRef.current || !previousMountedRef.current) && focusItemOnOpenRef.current && (keyRef.current != null || focusItemOnOpenRef.current === true && keyRef.current == null)) {
          let runs = 0;
          const waitForListPopulated = () => {
            if (listRef.current[0] == null) {
              // Avoid letting the browser paint if possible on the first try,
              // otherwise use rAF. Don't try more than twice, since something
              // is wrong otherwise.
              if (runs < 2) {
                const scheduler = runs ? requestAnimationFrame : queueMicrotask;
                scheduler(waitForListPopulated);
              }
              runs++;
            } else {
              indexRef.current = keyRef.current == null || isMainOrientationToEndKey(keyRef.current, orientation, rtl) || nested ? getMinIndex(listRef, disabledIndicesRef.current) : getMaxIndex(listRef, disabledIndicesRef.current);
              keyRef.current = null;
              onNavigate(indexRef.current);
            }
          };
          waitForListPopulated();
        }
      } else if (!isIndexOutOfBounds(listRef, activeIndex)) {
        indexRef.current = activeIndex;
        focusItem(listRef, indexRef, forceScrollIntoViewRef.current);
        forceScrollIntoViewRef.current = false;
      }
    }
  }, [enabled, open, elements.floating, activeIndex, selectedIndexRef, nested, listRef, orientation, rtl, onNavigate, focusItem, disabledIndicesRef]);

  // Ensure the parent floating element has focus when a nested child closes
  // to allow arrow key navigation to work after the pointer leaves the child.
  floating_ui_react_index(() => {
    var _nodes$find;
    if (!enabled || elements.floating || !tree || virtual || !previousMountedRef.current) {
      return;
    }
    const nodes = tree.nodesRef.current;
    const parent = (_nodes$find = nodes.find(node => node.id === parentId)) == null || (_nodes$find = _nodes$find.context) == null ? void 0 : _nodes$find.elements.floating;
    const activeEl = activeElement(getDocument(elements.floating));
    const treeContainsActiveEl = nodes.some(node => node.context && contains(node.context.elements.floating, activeEl));
    if (parent && !treeContainsActiveEl && isPointerModalityRef.current) {
      parent.focus({
        preventScroll: true
      });
    }
  }, [enabled, elements.floating, tree, parentId, virtual]);
  floating_ui_react_index(() => {
    if (!enabled) return;
    if (!tree) return;
    if (!virtual) return;
    if (parentId) return;
    function handleVirtualFocus(item) {
      setVirtualId(item.id);
      if (virtualItemRef) {
        virtualItemRef.current = item;
      }
    }
    tree.events.on('virtualfocus', handleVirtualFocus);
    return () => {
      tree.events.off('virtualfocus', handleVirtualFocus);
    };
  }, [enabled, tree, virtual, parentId, virtualItemRef]);
  floating_ui_react_index(() => {
    previousOnNavigateRef.current = onNavigate;
    previousMountedRef.current = !!elements.floating;
  });
  floating_ui_react_index(() => {
    if (!open) {
      keyRef.current = null;
    }
  }, [open]);
  floating_ui_react_index(() => {
    previousOpenRef.current = open;
  }, [open]);
  const hasActiveIndex = activeIndex != null;
  const item = React.useMemo(() => {
    function syncCurrentTarget(currentTarget) {
      if (!open) return;
      const index = listRef.current.indexOf(currentTarget);
      if (index !== -1) {
        onNavigate(index);
      }
    }
    const props = {
      onFocus(_ref) {
        let {
          currentTarget
        } = _ref;
        syncCurrentTarget(currentTarget);
      },
      onClick: _ref2 => {
        let {
          currentTarget
        } = _ref2;
        return currentTarget.focus({
          preventScroll: true
        });
      },
      // Safari
      ...(focusItemOnHover && {
        onMouseMove(_ref3) {
          let {
            currentTarget
          } = _ref3;
          syncCurrentTarget(currentTarget);
        },
        onPointerLeave(_ref4) {
          let {
            pointerType
          } = _ref4;
          if (!isPointerModalityRef.current || pointerType === 'touch') {
            return;
          }
          indexRef.current = -1;
          focusItem(listRef, indexRef);
          onNavigate(null);
          if (!virtual) {
            enqueueFocus(floatingFocusElementRef.current, {
              preventScroll: true
            });
          }
        }
      })
    };
    return props;
  }, [open, floatingFocusElementRef, focusItem, focusItemOnHover, listRef, onNavigate, virtual]);
  const commonOnKeyDown = useEffectEvent(event => {
    isPointerModalityRef.current = false;
    forceSyncFocus.current = true;

    // When composing a character, Chrome fires ArrowDown twice. Firefox/Safari
    // don't appear to suffer from this. `event.isComposing` is avoided due to
    // Safari not supporting it properly (although it's not needed in the first
    // place for Safari, just avoiding any possible issues).
    if (event.which === 229) {
      return;
    }

    // If the floating element is animating out, ignore navigation. Otherwise,
    // the `activeIndex` gets set to 0 despite not being open so the next time
    // the user ArrowDowns, the first item won't be focused.
    if (!latestOpenRef.current && event.currentTarget === floatingFocusElementRef.current) {
      return;
    }
    if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl)) {
      stopEvent(event);
      onOpenChange(false, event.nativeEvent, 'list-navigation');
      if (isHTMLElement(elements.domReference)) {
        if (virtual) {
          tree == null || tree.events.emit('virtualfocus', elements.domReference);
        } else {
          elements.domReference.focus();
        }
      }
      return;
    }
    const currentIndex = indexRef.current;
    const minIndex = getMinIndex(listRef, disabledIndices);
    const maxIndex = getMaxIndex(listRef, disabledIndices);
    if (!typeableComboboxReference) {
      if (event.key === 'Home') {
        stopEvent(event);
        indexRef.current = minIndex;
        onNavigate(indexRef.current);
      }
      if (event.key === 'End') {
        stopEvent(event);
        indexRef.current = maxIndex;
        onNavigate(indexRef.current);
      }
    }

    // Grid navigation.
    if (cols > 1) {
      const sizes = itemSizes || Array.from({
        length: listRef.current.length
      }, () => ({
        width: 1,
        height: 1
      }));
      // To calculate movements on the grid, we use hypothetical cell indices
      // as if every item was 1x1, then convert back to real indices.
      const cellMap = buildCellMap(sizes, cols, dense);
      const minGridIndex = cellMap.findIndex(index => index != null && !isDisabled(listRef.current, index, disabledIndices));
      // last enabled index
      const maxGridIndex = cellMap.reduce((foundIndex, index, cellIndex) => index != null && !isDisabled(listRef.current, index, disabledIndices) ? cellIndex : foundIndex, -1);
      const index = cellMap[getGridNavigatedIndex({
        current: cellMap.map(itemIndex => itemIndex != null ? listRef.current[itemIndex] : null)
      }, {
        event,
        orientation,
        loop,
        rtl,
        cols,
        // treat undefined (empty grid spaces) as disabled indices so we
        // don't end up in them
        disabledIndices: getCellIndices([...(disabledIndices || listRef.current.map((_, index) => isDisabled(listRef.current, index) ? index : undefined)), undefined], cellMap),
        minIndex: minGridIndex,
        maxIndex: maxGridIndex,
        prevIndex: getCellIndexOfCorner(indexRef.current > maxIndex ? minIndex : indexRef.current, sizes, cellMap, cols,
        // use a corner matching the edge closest to the direction
        // we're moving in so we don't end up in the same item. Prefer
        // top/left over bottom/right.
        event.key === ARROW_DOWN ? 'bl' : event.key === (rtl ? ARROW_LEFT : ARROW_RIGHT) ? 'tr' : 'tl'),
        stopEvent: true
      })];
      if (index != null) {
        indexRef.current = index;
        onNavigate(indexRef.current);
      }
      if (orientation === 'both') {
        return;
      }
    }
    if (isMainOrientationKey(event.key, orientation)) {
      stopEvent(event);

      // Reset the index if no item is focused.
      if (open && !virtual && activeElement(event.currentTarget.ownerDocument) === event.currentTarget) {
        indexRef.current = isMainOrientationToEndKey(event.key, orientation, rtl) ? minIndex : maxIndex;
        onNavigate(indexRef.current);
        return;
      }
      if (isMainOrientationToEndKey(event.key, orientation, rtl)) {
        if (loop) {
          indexRef.current = currentIndex >= maxIndex ? allowEscape && currentIndex !== listRef.current.length ? -1 : minIndex : findNonDisabledIndex(listRef, {
            startingIndex: currentIndex,
            disabledIndices
          });
        } else {
          indexRef.current = Math.min(maxIndex, findNonDisabledIndex(listRef, {
            startingIndex: currentIndex,
            disabledIndices
          }));
        }
      } else {
        if (loop) {
          indexRef.current = currentIndex <= minIndex ? allowEscape && currentIndex !== -1 ? listRef.current.length : maxIndex : findNonDisabledIndex(listRef, {
            startingIndex: currentIndex,
            decrement: true,
            disabledIndices
          });
        } else {
          indexRef.current = Math.max(minIndex, findNonDisabledIndex(listRef, {
            startingIndex: currentIndex,
            decrement: true,
            disabledIndices
          }));
        }
      }
      if (isIndexOutOfBounds(listRef, indexRef.current)) {
        onNavigate(null);
      } else {
        onNavigate(indexRef.current);
      }
    }
  });
  const ariaActiveDescendantProp = React.useMemo(() => {
    return virtual && open && hasActiveIndex && {
      'aria-activedescendant': virtualId || activeId
    };
  }, [virtual, open, hasActiveIndex, virtualId, activeId]);
  const floating = React.useMemo(() => {
    return {
      'aria-orientation': orientation === 'both' ? undefined : orientation,
      ...(!isTypeableCombobox(elements.domReference) && ariaActiveDescendantProp),
      onKeyDown: commonOnKeyDown,
      onPointerMove() {
        isPointerModalityRef.current = true;
      }
    };
  }, [ariaActiveDescendantProp, commonOnKeyDown, elements.domReference, orientation]);
  const reference = React.useMemo(() => {
    function checkVirtualMouse(event) {
      if (focusItemOnOpen === 'auto' && isVirtualClick(event.nativeEvent)) {
        focusItemOnOpenRef.current = true;
      }
    }
    function checkVirtualPointer(event) {
      // `pointerdown` fires first, reset the state then perform the checks.
      focusItemOnOpenRef.current = focusItemOnOpen;
      if (focusItemOnOpen === 'auto' && isVirtualPointerEvent(event.nativeEvent)) {
        focusItemOnOpenRef.current = true;
      }
    }
    return {
      ...ariaActiveDescendantProp,
      onKeyDown(event) {
        isPointerModalityRef.current = false;
        const isArrowKey = event.key.startsWith('Arrow');
        const isHomeOrEndKey = ['Home', 'End'].includes(event.key);
        const isMoveKey = isArrowKey || isHomeOrEndKey;
        const isCrossOpenKey = isCrossOrientationOpenKey(event.key, orientation, rtl);
        const isCrossCloseKey = isCrossOrientationCloseKey(event.key, orientation, rtl);
        const isMainKey = isMainOrientationKey(event.key, orientation);
        const isNavigationKey = (nested ? isCrossOpenKey : isMainKey) || event.key === 'Enter' || event.key.trim() === '';
        if (virtual && open) {
          const rootNode = tree == null ? void 0 : tree.nodesRef.current.find(node => node.parentId == null);
          const deepestNode = tree && rootNode ? getDeepestNode(tree.nodesRef.current, rootNode.id) : null;
          if (isMoveKey && deepestNode && virtualItemRef) {
            const eventObject = new KeyboardEvent('keydown', {
              key: event.key,
              bubbles: true
            });
            if (isCrossOpenKey || isCrossCloseKey) {
              var _deepestNode$context, _deepestNode$context2;
              const isCurrentTarget = ((_deepestNode$context = deepestNode.context) == null ? void 0 : _deepestNode$context.elements.domReference) === event.currentTarget;
              const dispatchItem = isCrossCloseKey && !isCurrentTarget ? (_deepestNode$context2 = deepestNode.context) == null ? void 0 : _deepestNode$context2.elements.domReference : isCrossOpenKey ? listRef.current.find(item => (item == null ? void 0 : item.id) === activeId) : null;
              if (dispatchItem) {
                stopEvent(event);
                dispatchItem.dispatchEvent(eventObject);
                setVirtualId(undefined);
              }
            }
            if ((isMainKey || isHomeOrEndKey) && deepestNode.context) {
              if (deepestNode.context.open && deepestNode.parentId && event.currentTarget !== deepestNode.context.elements.domReference) {
                var _deepestNode$context$;
                stopEvent(event);
                (_deepestNode$context$ = deepestNode.context.elements.domReference) == null || _deepestNode$context$.dispatchEvent(eventObject);
                return;
              }
            }
          }
          return commonOnKeyDown(event);
        }

        // If a floating element should not open on arrow key down, avoid
        // setting `activeIndex` while it's closed.
        if (!open && !openOnArrowKeyDown && isArrowKey) {
          return;
        }
        if (isNavigationKey) {
          keyRef.current = nested && isMainKey ? null : event.key;
        }
        if (nested) {
          if (isCrossOpenKey) {
            stopEvent(event);
            if (open) {
              indexRef.current = getMinIndex(listRef, disabledIndicesRef.current);
              onNavigate(indexRef.current);
            } else {
              onOpenChange(true, event.nativeEvent, 'list-navigation');
            }
          }
          return;
        }
        if (isMainKey) {
          if (selectedIndex != null) {
            indexRef.current = selectedIndex;
          }
          stopEvent(event);
          if (!open && openOnArrowKeyDown) {
            onOpenChange(true, event.nativeEvent, 'list-navigation');
          } else {
            commonOnKeyDown(event);
          }
          if (open) {
            onNavigate(indexRef.current);
          }
        }
      },
      onFocus() {
        if (open && !virtual) {
          onNavigate(null);
        }
      },
      onPointerDown: checkVirtualPointer,
      onMouseDown: checkVirtualMouse,
      onClick: checkVirtualMouse
    };
  }, [activeId, ariaActiveDescendantProp, commonOnKeyDown, disabledIndicesRef, focusItemOnOpen, listRef, nested, onNavigate, onOpenChange, open, openOnArrowKeyDown, orientation, rtl, selectedIndex, tree, virtual, virtualItemRef]);
  return React.useMemo(() => enabled ? {
    reference,
    floating,
    item
  } : {}, [enabled, reference, floating, item]);
}

const componentRoleToAriaRoleMap = /*#__PURE__*/new Map([['select', 'listbox'], ['combobox', 'listbox'], ['label', false]]);

/**
 * Adds base screen reader props to the reference and floating elements for a
 * given floating element `role`.
 * @see https://floating-ui.com/docs/useRole
 */
function useRole(context, props) {
  var _componentRoleToAriaR;
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    floatingId
  } = context;
  const {
    enabled = true,
    role = 'dialog'
  } = props;
  const ariaRole = (_componentRoleToAriaR = componentRoleToAriaRoleMap.get(role)) != null ? _componentRoleToAriaR : role;
  const referenceId = useId();
  const parentId = useFloatingParentNodeId();
  const isNested = parentId != null;
  const reference = external_React_namespaceObject.useMemo(() => {
    if (ariaRole === 'tooltip' || role === 'label') {
      return {
        ["aria-" + (role === 'label' ? 'labelledby' : 'describedby')]: open ? floatingId : undefined
      };
    }
    return {
      'aria-expanded': open ? 'true' : 'false',
      'aria-haspopup': ariaRole === 'alertdialog' ? 'dialog' : ariaRole,
      'aria-controls': open ? floatingId : undefined,
      ...(ariaRole === 'listbox' && {
        role: 'combobox'
      }),
      ...(ariaRole === 'menu' && {
        id: referenceId
      }),
      ...(ariaRole === 'menu' && isNested && {
        role: 'menuitem'
      }),
      ...(role === 'select' && {
        'aria-autocomplete': 'none'
      }),
      ...(role === 'combobox' && {
        'aria-autocomplete': 'list'
      })
    };
  }, [ariaRole, floatingId, isNested, open, referenceId, role]);
  const floating = external_React_namespaceObject.useMemo(() => {
    const floatingProps = {
      id: floatingId,
      ...(ariaRole && {
        role: ariaRole
      })
    };
    if (ariaRole === 'tooltip' || role === 'label') {
      return floatingProps;
    }
    return {
      ...floatingProps,
      ...(ariaRole === 'menu' && {
        'aria-labelledby': referenceId
      })
    };
  }, [ariaRole, floatingId, referenceId, role]);
  const item = external_React_namespaceObject.useCallback(_ref => {
    let {
      active,
      selected
    } = _ref;
    const commonProps = {
      role: 'option',
      ...(active && {
        id: floatingId + "-option"
      })
    };

    // For `menu`, we are unable to tell if the item is a `menuitemradio`
    // or `menuitemcheckbox`. For backwards-compatibility reasons, also
    // avoid defaulting to `menuitem` as it may overwrite custom role props.
    switch (role) {
      case 'select':
        return {
          ...commonProps,
          'aria-selected': active && selected
        };
      case 'combobox':
        {
          return {
            ...commonProps,
            ...(active && {
              'aria-selected': true
            })
          };
        }
    }
    return {};
  }, [floatingId, role]);
  return external_React_namespaceObject.useMemo(() => enabled ? {
    reference,
    floating,
    item
  } : {}, [enabled, reference, floating, item]);
}

// Converts a JS style key like `backgroundColor` to a CSS transition-property
// like `background-color`.
const camelCaseToKebabCase = str => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
function execWithArgsOrReturn(valueOrFn, args) {
  return typeof valueOrFn === 'function' ? valueOrFn(args) : valueOrFn;
}
function useDelayUnmount(open, durationMs) {
  const [isMounted, setIsMounted] = external_React_namespaceObject.useState(open);
  if (open && !isMounted) {
    setIsMounted(true);
  }
  external_React_namespaceObject.useEffect(() => {
    if (!open && isMounted) {
      const timeout = setTimeout(() => setIsMounted(false), durationMs);
      return () => clearTimeout(timeout);
    }
  }, [open, isMounted, durationMs]);
  return isMounted;
}
/**
 * Provides a status string to apply CSS transitions to a floating element,
 * correctly handling placement-aware transitions.
 * @see https://floating-ui.com/docs/useTransition#usetransitionstatus
 */
function useTransitionStatus(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    elements: {
      floating
    }
  } = context;
  const {
    duration = 250
  } = props;
  const isNumberDuration = typeof duration === 'number';
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;
  const [status, setStatus] = external_React_namespaceObject.useState('unmounted');
  const isMounted = useDelayUnmount(open, closeDuration);
  if (!isMounted && status === 'close') {
    setStatus('unmounted');
  }
  floating_ui_react_index(() => {
    if (!floating) return;
    if (open) {
      setStatus('initial');
      const frame = requestAnimationFrame(() => {
        setStatus('open');
      });
      return () => {
        cancelAnimationFrame(frame);
      };
    }
    setStatus('close');
  }, [open, floating]);
  return {
    isMounted,
    status
  };
}
/**
 * Provides styles to apply CSS transitions to a floating element, correctly
 * handling placement-aware transitions. Wrapper around `useTransitionStatus`.
 * @see https://floating-ui.com/docs/useTransition#usetransitionstyles
 */
function useTransitionStyles(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    initial: unstable_initial = {
      opacity: 0
    },
    open: unstable_open,
    close: unstable_close,
    common: unstable_common,
    duration = 250
  } = props;
  const placement = context.placement;
  const side = placement.split('-')[0];
  const fnArgs = external_React_namespaceObject.useMemo(() => ({
    side,
    placement
  }), [side, placement]);
  const isNumberDuration = typeof duration === 'number';
  const openDuration = (isNumberDuration ? duration : duration.open) || 0;
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;
  const [styles, setStyles] = external_React_namespaceObject.useState(() => ({
    ...execWithArgsOrReturn(unstable_common, fnArgs),
    ...execWithArgsOrReturn(unstable_initial, fnArgs)
  }));
  const {
    isMounted,
    status
  } = useTransitionStatus(context, {
    duration
  });
  const initialRef = floating_ui_react_useLatestRef(unstable_initial);
  const openRef = floating_ui_react_useLatestRef(unstable_open);
  const closeRef = floating_ui_react_useLatestRef(unstable_close);
  const commonRef = floating_ui_react_useLatestRef(unstable_common);
  floating_ui_react_index(() => {
    const initialStyles = execWithArgsOrReturn(initialRef.current, fnArgs);
    const closeStyles = execWithArgsOrReturn(closeRef.current, fnArgs);
    const commonStyles = execWithArgsOrReturn(commonRef.current, fnArgs);
    const openStyles = execWithArgsOrReturn(openRef.current, fnArgs) || Object.keys(initialStyles).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    if (status === 'initial') {
      setStyles(styles => ({
        transitionProperty: styles.transitionProperty,
        ...commonStyles,
        ...initialStyles
      }));
    }
    if (status === 'open') {
      setStyles({
        transitionProperty: Object.keys(openStyles).map(camelCaseToKebabCase).join(','),
        transitionDuration: openDuration + "ms",
        ...commonStyles,
        ...openStyles
      });
    }
    if (status === 'close') {
      const styles = closeStyles || initialStyles;
      setStyles({
        transitionProperty: Object.keys(styles).map(camelCaseToKebabCase).join(','),
        transitionDuration: closeDuration + "ms",
        ...commonStyles,
        ...styles
      });
    }
  }, [closeDuration, closeRef, initialRef, openRef, commonRef, openDuration, status, fnArgs]);
  return {
    isMounted,
    styles
  };
}

/**
 * Provides a matching callback that can be used to focus an item as the user
 * types, often used in tandem with `useListNavigation()`.
 * @see https://floating-ui.com/docs/useTypeahead
 */
function useTypeahead(context, props) {
  var _ref;
  const {
    open,
    dataRef
  } = context;
  const {
    listRef,
    activeIndex,
    onMatch: unstable_onMatch,
    onTypingChange: unstable_onTypingChange,
    enabled = true,
    findMatch = null,
    resetMs = 750,
    ignoreKeys = [],
    selectedIndex = null
  } = props;
  const timeoutIdRef = React.useRef();
  const stringRef = React.useRef('');
  const prevIndexRef = React.useRef((_ref = selectedIndex != null ? selectedIndex : activeIndex) != null ? _ref : -1);
  const matchIndexRef = React.useRef(null);
  const onMatch = useEffectEvent(unstable_onMatch);
  const onTypingChange = useEffectEvent(unstable_onTypingChange);
  const findMatchRef = floating_ui_react_useLatestRef(findMatch);
  const ignoreKeysRef = floating_ui_react_useLatestRef(ignoreKeys);
  floating_ui_react_index(() => {
    if (open) {
      clearTimeout(timeoutIdRef.current);
      matchIndexRef.current = null;
      stringRef.current = '';
    }
  }, [open]);
  floating_ui_react_index(() => {
    // Sync arrow key navigation but not typeahead navigation.
    if (open && stringRef.current === '') {
      var _ref2;
      prevIndexRef.current = (_ref2 = selectedIndex != null ? selectedIndex : activeIndex) != null ? _ref2 : -1;
    }
  }, [open, selectedIndex, activeIndex]);
  const setTypingChange = useEffectEvent(value => {
    if (value) {
      if (!dataRef.current.typing) {
        dataRef.current.typing = value;
        onTypingChange(value);
      }
    } else {
      if (dataRef.current.typing) {
        dataRef.current.typing = value;
        onTypingChange(value);
      }
    }
  });
  const onKeyDown = useEffectEvent(event => {
    function getMatchingIndex(list, orderedList, string) {
      const str = findMatchRef.current ? findMatchRef.current(orderedList, string) : orderedList.find(text => (text == null ? void 0 : text.toLocaleLowerCase().indexOf(string.toLocaleLowerCase())) === 0);
      return str ? list.indexOf(str) : -1;
    }
    const listContent = listRef.current;
    if (stringRef.current.length > 0 && stringRef.current[0] !== ' ') {
      if (getMatchingIndex(listContent, listContent, stringRef.current) === -1) {
        setTypingChange(false);
      } else if (event.key === ' ') {
        stopEvent(event);
      }
    }
    if (listContent == null || ignoreKeysRef.current.includes(event.key) ||
    // Character key.
    event.key.length !== 1 ||
    // Modifier key.
    event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (open && event.key !== ' ') {
      stopEvent(event);
      setTypingChange(true);
    }

    // Bail out if the list contains a word like "llama" or "aaron". TODO:
    // allow it in this case, too.
    const allowRapidSuccessionOfFirstLetter = listContent.every(text => {
      var _text$, _text$2;
      return text ? ((_text$ = text[0]) == null ? void 0 : _text$.toLocaleLowerCase()) !== ((_text$2 = text[1]) == null ? void 0 : _text$2.toLocaleLowerCase()) : true;
    });

    // Allows the user to cycle through items that start with the same letter
    // in rapid succession.
    if (allowRapidSuccessionOfFirstLetter && stringRef.current === event.key) {
      stringRef.current = '';
      prevIndexRef.current = matchIndexRef.current;
    }
    stringRef.current += event.key;
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      stringRef.current = '';
      prevIndexRef.current = matchIndexRef.current;
      setTypingChange(false);
    }, resetMs);
    const prevIndex = prevIndexRef.current;
    const index = getMatchingIndex(listContent, [...listContent.slice((prevIndex || 0) + 1), ...listContent.slice(0, (prevIndex || 0) + 1)], stringRef.current);
    if (index !== -1) {
      onMatch(index);
      matchIndexRef.current = index;
    } else if (event.key !== ' ') {
      stringRef.current = '';
      setTypingChange(false);
    }
  });
  const reference = React.useMemo(() => ({
    onKeyDown
  }), [onKeyDown]);
  const floating = React.useMemo(() => {
    return {
      onKeyDown,
      onKeyUp(event) {
        if (event.key === ' ') {
          setTypingChange(false);
        }
      }
    };
  }, [onKeyDown, setTypingChange]);
  return React.useMemo(() => enabled ? {
    reference,
    floating
  } : {}, [enabled, reference, floating]);
}

function getArgsWithCustomFloatingHeight(state, height) {
  return {
    ...state,
    rects: {
      ...state.rects,
      floating: {
        ...state.rects.floating,
        height
      }
    }
  };
}
/**
 * Positions the floating element such that an inner element inside of it is
 * anchored to the reference element.
 * @see https://floating-ui.com/docs/inner
 */
const inner = props => ({
  name: 'inner',
  options: props,
  async fn(state) {
    const {
      listRef,
      overflowRef,
      onFallbackChange,
      offset: innerOffset = 0,
      index = 0,
      minItemsVisible = 4,
      referenceOverflowThreshold = 0,
      scrollRef,
      ...detectOverflowOptions
    } = evaluate(props, state);
    const {
      rects,
      elements: {
        floating
      }
    } = state;
    const item = listRef.current[index];
    const scrollEl = (scrollRef == null ? void 0 : scrollRef.current) || floating;

    // Valid combinations:
    // 1. Floating element is the scrollRef and has a border (default)
    // 2. Floating element is not the scrollRef, floating element has a border
    // 3. Floating element is not the scrollRef, scrollRef has a border
    // Floating > {...getFloatingProps()} wrapper > scrollRef > items is not
    // allowed as VoiceOver doesn't work.
    const clientTop = floating.clientTop || scrollEl.clientTop;
    const floatingIsBordered = floating.clientTop !== 0;
    const scrollElIsBordered = scrollEl.clientTop !== 0;
    const floatingIsScrollEl = floating === scrollEl;
    if (false) // removed by dead control flow
{}
    if (!item) {
      return {};
    }
    const nextArgs = {
      ...state,
      ...(await offset(-item.offsetTop - floating.clientTop - rects.reference.height / 2 - item.offsetHeight / 2 - innerOffset).fn(state))
    };
    const overflow = await detectOverflow(getArgsWithCustomFloatingHeight(nextArgs, scrollEl.scrollHeight + clientTop + floating.clientTop), detectOverflowOptions);
    const refOverflow = await detectOverflow(nextArgs, {
      ...detectOverflowOptions,
      elementContext: 'reference'
    });
    const diffY = max(0, overflow.top);
    const nextY = nextArgs.y + diffY;
    const isScrollable = scrollEl.scrollHeight > scrollEl.clientHeight;
    const rounder = isScrollable ? v => v : round;
    const maxHeight = rounder(max(0, scrollEl.scrollHeight + (floatingIsBordered && floatingIsScrollEl || scrollElIsBordered ? clientTop * 2 : 0) - diffY - max(0, overflow.bottom)));
    scrollEl.style.maxHeight = maxHeight + "px";
    scrollEl.scrollTop = diffY;

    // There is not enough space, fallback to standard anchored positioning
    if (onFallbackChange) {
      const shouldFallback = scrollEl.offsetHeight < item.offsetHeight * min(minItemsVisible, listRef.current.length) - 1 || refOverflow.top >= -referenceOverflowThreshold || refOverflow.bottom >= -referenceOverflowThreshold;
      ReactDOM.flushSync(() => onFallbackChange(shouldFallback));
    }
    if (overflowRef) {
      overflowRef.current = await detectOverflow(getArgsWithCustomFloatingHeight({
        ...nextArgs,
        y: nextY
      }, scrollEl.offsetHeight + clientTop + floating.clientTop), detectOverflowOptions);
    }
    return {
      y: nextY
    };
  }
});
/**
 * Changes the `inner` middleware's `offset` upon a `wheel` event to
 * expand the floating element's height, revealing more list items.
 * @see https://floating-ui.com/docs/inner
 */
function useInnerOffset(context, props) {
  const {
    open,
    elements
  } = context;
  const {
    enabled = true,
    overflowRef,
    scrollRef,
    onChange: unstable_onChange
  } = props;
  const onChange = useEffectEvent(unstable_onChange);
  const controlledScrollingRef = React.useRef(false);
  const prevScrollTopRef = React.useRef(null);
  const initialOverflowRef = React.useRef(null);
  React.useEffect(() => {
    if (!enabled) return;
    function onWheel(e) {
      if (e.ctrlKey || !el || overflowRef.current == null) {
        return;
      }
      const dY = e.deltaY;
      const isAtTop = overflowRef.current.top >= -0.5;
      const isAtBottom = overflowRef.current.bottom >= -0.5;
      const remainingScroll = el.scrollHeight - el.clientHeight;
      const sign = dY < 0 ? -1 : 1;
      const method = dY < 0 ? 'max' : 'min';
      if (el.scrollHeight <= el.clientHeight) {
        return;
      }
      if (!isAtTop && dY > 0 || !isAtBottom && dY < 0) {
        e.preventDefault();
        ReactDOM.flushSync(() => {
          onChange(d => d + Math[method](dY, remainingScroll * sign));
        });
      } else if (/firefox/i.test(getUserAgent())) {
        // Needed to propagate scrolling during momentum scrolling phase once
        // it gets limited by the boundary. UX improvement, not critical.
        el.scrollTop += dY;
      }
    }
    const el = (scrollRef == null ? void 0 : scrollRef.current) || elements.floating;
    if (open && el) {
      el.addEventListener('wheel', onWheel);

      // Wait for the position to be ready.
      requestAnimationFrame(() => {
        prevScrollTopRef.current = el.scrollTop;
        if (overflowRef.current != null) {
          initialOverflowRef.current = {
            ...overflowRef.current
          };
        }
      });
      return () => {
        prevScrollTopRef.current = null;
        initialOverflowRef.current = null;
        el.removeEventListener('wheel', onWheel);
      };
    }
  }, [enabled, open, elements.floating, overflowRef, scrollRef, onChange]);
  const floating = React.useMemo(() => ({
    onKeyDown() {
      controlledScrollingRef.current = true;
    },
    onWheel() {
      controlledScrollingRef.current = false;
    },
    onPointerMove() {
      controlledScrollingRef.current = false;
    },
    onScroll() {
      const el = (scrollRef == null ? void 0 : scrollRef.current) || elements.floating;
      if (!overflowRef.current || !el || !controlledScrollingRef.current) {
        return;
      }
      if (prevScrollTopRef.current !== null) {
        const scrollDiff = el.scrollTop - prevScrollTopRef.current;
        if (overflowRef.current.bottom < -0.5 && scrollDiff < -1 || overflowRef.current.top < -0.5 && scrollDiff > 1) {
          ReactDOM.flushSync(() => onChange(d => d + scrollDiff));
        }
      }

      // [Firefox] Wait for the height change to have been applied.
      requestAnimationFrame(() => {
        prevScrollTopRef.current = el.scrollTop;
      });
    }
  }), [elements.floating, onChange, overflowRef, scrollRef]);
  return React.useMemo(() => enabled ? {
    floating
  } : {}, [enabled, floating]);
}

function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let isInside = false;
  const length = polygon.length;
  for (let i = 0, j = length - 1; i < length; j = i++) {
    const [xi, yi] = polygon[i] || [0, 0];
    const [xj, yj] = polygon[j] || [0, 0];
    const intersect = yi >= y !== yj >= y && x <= (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) {
      isInside = !isInside;
    }
  }
  return isInside;
}
function isInside(point, rect) {
  return point[0] >= rect.x && point[0] <= rect.x + rect.width && point[1] >= rect.y && point[1] <= rect.y + rect.height;
}
/**
 * Generates a safe polygon area that the user can traverse without closing the
 * floating element once leaving the reference element.
 * @see https://floating-ui.com/docs/useHover#safepolygon
 */
function safePolygon(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    buffer = 0.5,
    blockPointerEvents = false,
    requireIntent = true
  } = options;
  let timeoutId;
  let hasLanded = false;
  let lastX = null;
  let lastY = null;
  let lastCursorTime = performance.now();
  function getCursorSpeed(x, y) {
    const currentTime = performance.now();
    const elapsedTime = currentTime - lastCursorTime;
    if (lastX === null || lastY === null || elapsedTime === 0) {
      lastX = x;
      lastY = y;
      lastCursorTime = currentTime;
      return null;
    }
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const speed = distance / elapsedTime; // px / ms

    lastX = x;
    lastY = y;
    lastCursorTime = currentTime;
    return speed;
  }
  const fn = _ref => {
    let {
      x,
      y,
      placement,
      elements,
      onClose,
      nodeId,
      tree
    } = _ref;
    return function onMouseMove(event) {
      function close() {
        clearTimeout(timeoutId);
        onClose();
      }
      clearTimeout(timeoutId);
      if (!elements.domReference || !elements.floating || placement == null || x == null || y == null) {
        return;
      }
      const {
        clientX,
        clientY
      } = event;
      const clientPoint = [clientX, clientY];
      const target = floating_ui_react_utils_getTarget(event);
      const isLeave = event.type === 'mouseleave';
      const isOverFloatingEl = floating_ui_react_utils_contains(elements.floating, target);
      const isOverReferenceEl = floating_ui_react_utils_contains(elements.domReference, target);
      const refRect = elements.domReference.getBoundingClientRect();
      const rect = elements.floating.getBoundingClientRect();
      const side = placement.split('-')[0];
      const cursorLeaveFromRight = x > rect.right - rect.width / 2;
      const cursorLeaveFromBottom = y > rect.bottom - rect.height / 2;
      const isOverReferenceRect = isInside(clientPoint, refRect);
      const isFloatingWider = rect.width > refRect.width;
      const isFloatingTaller = rect.height > refRect.height;
      const left = (isFloatingWider ? refRect : rect).left;
      const right = (isFloatingWider ? refRect : rect).right;
      const top = (isFloatingTaller ? refRect : rect).top;
      const bottom = (isFloatingTaller ? refRect : rect).bottom;
      if (isOverFloatingEl) {
        hasLanded = true;
        if (!isLeave) {
          return;
        }
      }
      if (isOverReferenceEl) {
        hasLanded = false;
      }
      if (isOverReferenceEl && !isLeave) {
        hasLanded = true;
        return;
      }

      // Prevent overlapping floating element from being stuck in an open-close
      // loop: https://github.com/floating-ui/floating-ui/issues/1910
      if (isLeave && isElement(event.relatedTarget) && floating_ui_react_utils_contains(elements.floating, event.relatedTarget)) {
        return;
      }

      // If any nested child is open, abort.
      if (tree && getChildren(tree.nodesRef.current, nodeId).some(_ref2 => {
        let {
          context
        } = _ref2;
        return context == null ? void 0 : context.open;
      })) {
        return;
      }

      // If the pointer is leaving from the opposite side, the "buffer" logic
      // creates a point where the floating element remains open, but should be
      // ignored.
      // A constant of 1 handles floating point rounding errors.
      if (side === 'top' && y >= refRect.bottom - 1 || side === 'bottom' && y <= refRect.top + 1 || side === 'left' && x >= refRect.right - 1 || side === 'right' && x <= refRect.left + 1) {
        return close();
      }

      // Ignore when the cursor is within the rectangular trough between the
      // two elements. Since the triangle is created from the cursor point,
      // which can start beyond the ref element's edge, traversing back and
      // forth from the ref to the floating element can cause it to close. This
      // ensures it always remains open in that case.
      let rectPoly = [];
      switch (side) {
        case 'top':
          rectPoly = [[left, refRect.top + 1], [left, rect.bottom - 1], [right, rect.bottom - 1], [right, refRect.top + 1]];
          break;
        case 'bottom':
          rectPoly = [[left, rect.top + 1], [left, refRect.bottom - 1], [right, refRect.bottom - 1], [right, rect.top + 1]];
          break;
        case 'left':
          rectPoly = [[rect.right - 1, bottom], [rect.right - 1, top], [refRect.left + 1, top], [refRect.left + 1, bottom]];
          break;
        case 'right':
          rectPoly = [[refRect.right - 1, bottom], [refRect.right - 1, top], [rect.left + 1, top], [rect.left + 1, bottom]];
          break;
      }
      function getPolygon(_ref3) {
        let [x, y] = _ref3;
        switch (side) {
          case 'top':
            {
              const cursorPointOne = [isFloatingWider ? x + buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y + buffer + 1];
              const cursorPointTwo = [isFloatingWider ? x - buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y + buffer + 1];
              const commonPoints = [[rect.left, cursorLeaveFromRight ? rect.bottom - buffer : isFloatingWider ? rect.bottom - buffer : rect.top], [rect.right, cursorLeaveFromRight ? isFloatingWider ? rect.bottom - buffer : rect.top : rect.bottom - buffer]];
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }
          case 'bottom':
            {
              const cursorPointOne = [isFloatingWider ? x + buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y - buffer];
              const cursorPointTwo = [isFloatingWider ? x - buffer / 2 : cursorLeaveFromRight ? x + buffer * 4 : x - buffer * 4, y - buffer];
              const commonPoints = [[rect.left, cursorLeaveFromRight ? rect.top + buffer : isFloatingWider ? rect.top + buffer : rect.bottom], [rect.right, cursorLeaveFromRight ? isFloatingWider ? rect.top + buffer : rect.bottom : rect.top + buffer]];
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }
          case 'left':
            {
              const cursorPointOne = [x + buffer + 1, isFloatingTaller ? y + buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
              const cursorPointTwo = [x + buffer + 1, isFloatingTaller ? y - buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
              const commonPoints = [[cursorLeaveFromBottom ? rect.right - buffer : isFloatingTaller ? rect.right - buffer : rect.left, rect.top], [cursorLeaveFromBottom ? isFloatingTaller ? rect.right - buffer : rect.left : rect.right - buffer, rect.bottom]];
              return [...commonPoints, cursorPointOne, cursorPointTwo];
            }
          case 'right':
            {
              const cursorPointOne = [x - buffer, isFloatingTaller ? y + buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
              const cursorPointTwo = [x - buffer, isFloatingTaller ? y - buffer / 2 : cursorLeaveFromBottom ? y + buffer * 4 : y - buffer * 4];
              const commonPoints = [[cursorLeaveFromBottom ? rect.left + buffer : isFloatingTaller ? rect.left + buffer : rect.right, rect.top], [cursorLeaveFromBottom ? isFloatingTaller ? rect.left + buffer : rect.right : rect.left + buffer, rect.bottom]];
              return [cursorPointOne, cursorPointTwo, ...commonPoints];
            }
        }
      }
      if (isPointInPolygon([clientX, clientY], rectPoly)) {
        return;
      }
      if (hasLanded && !isOverReferenceRect) {
        return close();
      }
      if (!isLeave && requireIntent) {
        const cursorSpeed = getCursorSpeed(event.clientX, event.clientY);
        const cursorSpeedThreshold = 0.1;
        if (cursorSpeed !== null && cursorSpeed < cursorSpeedThreshold) {
          return close();
        }
      }
      if (!isPointInPolygon([clientX, clientY], getPolygon([x, y]))) {
        close();
      } else if (!hasLanded && requireIntent) {
        timeoutId = window.setTimeout(close, 40);
      }
    };
  };
  fn.__options = {
    blockPointerEvents
  };
  return fn;
}



;// ./node_modules/@bsf/force-ui/dist/components/toaster/utils.es.js





const l = "light", p = "neutral", v = "button", h = ({
  theme: t = l,
  variant: r = p
}) => {
  let e = t === "light" ? "text-icon-secondary" : "text-icon-inverse";
  return e = {
    info: t === "light" ? "text-support-info" : "text-support-info-inverse",
    success: t === "light" ? "text-support-success" : "text-support-success-inverse",
    warning: t === "light" ? "text-support-warning" : "text-support-warning-inverse",
    error: t === "light" ? "text-support-error" : "text-support-error-inverse"
  }[r] || e, e;
}, E = ({
  icon: t,
  theme: r = l,
  variant: e = p
}) => {
  const s = "[&>svg]:h-5 [&>svg]:w-5", o = h({ theme: r, variant: e });
  if (t && m(t))
    return x(t, {
      className: n(
        s,
        o,
        t?.props?.className ?? ""
      )
    });
  const i = {
    neutral: /* @__PURE__ */ a(c, { className: n(s, o) }),
    info: /* @__PURE__ */ a(c, { className: n(s, o) }),
    success: /* @__PURE__ */ a(g, { className: n(s, o) }),
    warning: /* @__PURE__ */ a(f, { className: n(s, o) }),
    error: /* @__PURE__ */ a(d, { className: n(s, o) })
  };
  return i[e] || i.neutral;
}, y = ({
  actionType: t = v,
  onAction: r = () => {
  },
  actionLabel: e = "",
  theme: s = l
}) => {
  const o = "focus:ring-0 focus:ring-offset-0 ring-offset-0 focus:outline-none";
  let i = "text-button-primary border-button-primary hover:border-button-primary hover:text-button-primary-hover";
  switch (s === "dark" && (i = "text-text-inverse border-text-inverse hover:border-text-inverse hover:text-text-inverse"), t) {
    case "button":
      return /* @__PURE__ */ a(
        u,
        {
          variant: "outline",
          size: "xs",
          onClick: r,
          className: n(
            "rounded",
            o,
            i,
            s === "dark" ? "bg-transparent hover:bg-transparent" : "bg-white hover:bg-white"
          ),
          children: e
        }
      );
    case "link":
      return /* @__PURE__ */ a(
        u,
        {
          variant: "link",
          size: "xs",
          onClick: r,
          className: n(o, i),
          children: e
        }
      );
    default:
      return null;
  }
}, A = ({
  theme: t = l,
  title: r = "",
  inline: e = !1
}) => r ? /* @__PURE__ */ a(
  "span",
  {
    className: n(
      "block",
      {
        light: "text-text-primary",
        dark: "text-text-inverse"
      }[t],
      "text-sm leading-5 font-semibold",
      e ? "inline" : "block"
    ),
    children: r
  }
) : null, I = ({
  theme: t = l,
  content: r = "",
  inline: e = !1
}) => r ? /* @__PURE__ */ a(
  "span",
  {
    className: n(
      {
        light: "text-text-primary",
        dark: "text-text-inverse"
      }[t],
      "block text-sm [&_*]:text-sm leading-5 [&_*]:leading-5 font-normal [word-break:break-word]",
      e ? "inline" : "block"
    ),
    children: r
  }
) : null, utils_es_ = (...t) => (r) => {
  t.forEach((e) => {
    typeof e == "function" ? e(r) : e && (e.current = r);
  });
};

//# sourceMappingURL=utils.es.js.map

;// ./node_modules/@bsf/force-ui/dist/components/tooltip/tooltip.es.js





const ie = ({
  variant: c = "dark",
  // 'light' | 'dark';
  placement: h = "bottom",
  //  | 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
  title: d = "",
  content: f,
  arrow: x = !1,
  open: l,
  setOpen: n,
  children: s,
  className: w,
  tooltipPortalRoot: b,
  // Root element where the dropdown will be rendered.
  tooltipPortalId: k,
  // Id of the dropdown portal where the dropdown will be rendered.
  boundary: p = "clippingAncestors",
  strategy: y = "fixed",
  // 'fixed' | 'absolute';
  offset: C = 8,
  // Offset option or number value. Default is 8.
  triggers: a = ["hover", "focus"],
  // 'click' | 'hover' | 'focus';
  interactive: v = !1
}) => {
  const o = (0,external_React_namespaceObject.useMemo)(
    () => typeof l == "boolean" && typeof n == "function",
    [l, n]
  ), [F, N] = (0,external_React_namespaceObject.useState)(!1), m = (0,external_React_namespaceObject.useRef)(null), { refs: u, floatingStyles: R, context: e } = floating_ui_react_useFloating({
    open: o ? l : F,
    onOpenChange: o ? n : N,
    placement: h,
    strategy: y,
    middleware: [
      floating_ui_react_dom_offset(C),
      floating_ui_react_dom_flip({ boundary: p }),
      // Ensure this is correctly cast
      floating_ui_react_dom_shift({ boundary: p }),
      // Ensure this is correctly cast
      floating_ui_react_dom_arrow({ element: m })
    ],
    whileElementsMounted: autoUpdate
  }), P = useClick(e, {
    enabled: !o && a.includes("click")
  }), E = useHover(e, {
    move: !1,
    enabled: !o && a.includes("hover"),
    ...v && { handleClose: safePolygon() }
  }), M = useFocus(e, {
    enabled: !o && a.includes("focus")
  }), S = useDismiss(e), T = useRole(e, { role: "tooltip" }), { getReferenceProps: j, getFloatingProps: A } = useInteractions([
    P,
    E,
    M,
    S,
    T
  ]), { isMounted: I, styles: z } = useTransitionStyles(e, {
    duration: 150,
    initial: { opacity: 0 },
    open: { opacity: 1 },
    close: { opacity: 0 }
  }), D = "absolute z-20 py-2 px-3 rounded-md text-xs leading-4 shadow-soft-shadow-lg", H = {
    light: "bg-tooltip-background-light text-text-primary",
    dark: "bg-tooltip-background-dark text-text-on-color"
  }[c], O = c === "dark" ? "text-tooltip-background-dark" : "text-tooltip-background-light";
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(external_React_namespaceObject.Fragment, { children: [
    (0,external_React_namespaceObject.isValidElement)(s) && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_React_namespaceObject.Fragment, { children: (0,external_React_namespaceObject.cloneElement)(s, {
      ref: utils_es_(
        s.ref,
        u.setReference
      ),
      className: functions_es_c(s.props.className),
      ...j()
    }) }, "tooltip-reference"),
    /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(FloatingPortal, { id: k, root: b, children: I && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
      "div",
      {
        className: functions_es_c(
          D,
          H,
          "max-w-80 w-fit",
          w
        ),
        ref: u.setFloating,
        style: {
          ...R,
          ...z
        },
        ...A(),
        children: [
          /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", { children: [
            !!d && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
              "span",
              {
                className: "font-semibold",
                children: d
              },
              "tooltip-title"
            ),
            !!f && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
              "div",
              {
                className: "font-normal",
                children: f
              },
              "tooltip-content"
            )
          ] }),
          x && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
            FloatingArrow,
            {
              ref: m,
              context: e,
              className: functions_es_c("fill-current", O)
            }
          )
        ]
      }
    ) })
  ] });
};
ie.displayName = "Tooltip";

//# sourceMappingURL=tooltip.es.js.map

;// ./node_modules/@bsf/force-ui/dist/components/switch/switch.es.js





const switch_es_M = ({
  label: e,
  switchId: g,
  disabled: r = !1,
  children: c,
  size: s
}) => {
  const o = {
    xs: "text-xs leading-4 font-medium",
    sm: "text-sm leading-5 font-medium",
    md: "text-base leading-6 font-medium"
  }, h = {
    xs: "text-xs leading-4 font-normal",
    sm: "text-sm leading-5 font-normal",
    md: "text-sm leading-5 font-normal"
  }, f = {
    xs: "space-y-0.5",
    sm: "space-y-0.5",
    md: "space-y-1"
  };
  if ((0,external_React_namespaceObject.isValidElement)(e))
    return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
      "div",
      {
        className: functions_es_c("inline-flex items-center gap-3", "items-start"),
        children: [
          c,
          e
        ]
      }
    );
  const u = () => {
    const { heading: n = "", description: l = "" } = e || {};
    return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", { className: functions_es_c("space-y-0.5", f[s]), children: [
      n && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
        label_es_c,
        {
          htmlFor: g,
          className: functions_es_c("m-0", o[s]),
          ...r && { variant: "disabled" },
          children: n
        }
      ),
      l && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
        label_es_c,
        {
          tag: "p",
          variant: "help",
          className: functions_es_c(
            "text-sm font-normal leading-5 m-0",
            h[s]
          ),
          ...r && { variant: "disabled" },
          children: l
        }
      )
    ] });
  }, p = !e?.heading && !e?.description, i = !e?.heading || !e?.description ? "items-center" : "items-start";
  return p ? c : /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", { className: functions_es_c("inline-flex", i, "gap-3"), children: [
    c,
    u()
  ] });
}, switch_es_R = ({
  id: e,
  onChange: g,
  value: r,
  defaultValue: c = !1,
  size: s = "sm",
  disabled: o = !1,
  label: h = { heading: "", description: "" },
  name: f,
  className: b,
  ...u
}, p) => {
  const i = s === "lg" ? "md" : s, n = (0,external_React_namespaceObject.useMemo)(() => typeof r < "u", [r]), l = (0,external_React_namespaceObject.useMemo)(() => e || `switch-${nanoid()}`, []), [w, D] = (0,external_React_namespaceObject.useState)(c), m = "primary", z = (0,external_React_namespaceObject.useCallback)(
    () => n ? r : w,
    [n, r, w]
  ), L = (j) => {
    if (o)
      return;
    const y = j.target.checked;
    n || D(y), typeof g == "function" && g(y);
  }, x = {
    primary: {
      input: "bg-toggle-off checked:bg-toggle-on focus:ring focus:ring-toggle-on focus:ring-offset-2 border border-solid border-toggle-off-border checked:border-toggle-on-border shadow-toggleContainer focus:outline-none checked:focus:border-toggle-on-border focus:border-toggle-off-border",
      toggleDial: "bg-toggle-dial-background shadow-toggleDial"
    }
  }, S = {
    primary: {
      input: "group-hover/switch:bg-toggle-off-hover checked:group-hover/switch:bg-toggle-on-hover checked:group-hover/switch:border-toggle-on-border"
    }
  }, v = {
    md: {
      container: "w-11 h-6",
      toggleDial: "size-4 peer-checked:translate-x-5"
    },
    sm: {
      container: "w-10 h-5",
      toggleDial: "size-3 peer-checked:translate-x-5"
    },
    xs: {
      container: "w-8 h-4",
      toggleDial: "size-2.5 peer-checked:translate-x-3.75"
    }
  }, V = {
    md: "group-hover/switch:size-5 group-focus-within/switch:size-5 not-rtl:group-focus-within/switch:left-0.5 rtl:group-focus-within/switch:right-0.5 not-rtl:group-hover/switch:left-0.5 rtl:group-hover/switch:right-0.5",
    sm: "group-hover/switch:size-4 group-focus-within/switch:size-4 not-rtl:group-focus-within/switch:left-0.5 rtl:group-focus-within/switch:right-0.5 not-rtl:group-hover/switch:left-0.5 rtl:group-hover/switch:right-0.5",
    xs: "group-hover/switch:size-3.25 group-focus-within/switch:size-3.25 not-rtl:group-focus-within/switch:left-0.5 rtl:group-focus-within/switch:right-0.5 not-rtl:group-hover/switch:left-0.5 rtl:group-hover/switch:right-0.5"
  }, k = {
    input: "bg-toggle-off-disabled disabled:border-transparent disabled:cursor-not-allowed checked:disabled:bg-toggle-on-disabled disabled:shadow-toggle-disabled",
    toggleDial: "peer-disabled:cursor-not-allowed"
  };
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    switch_es_M,
    {
      label: h,
      switchId: l,
      disabled: o,
      size: i,
      children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
        "div",
        {
          className: functions_es_c(
            "relative group/switch inline-block cursor-pointer rounded-full shrink-0",
            v[i].container,
            b
          ),
          children: [
            /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
              "input",
              {
                ref: p,
                id: l,
                type: "checkbox",
                className: functions_es_c(
                  "peer appearance-none absolute rounded-full cursor-pointer transition-colors duration-300 h-full w-full  before:content-[''] checked:before:content-[''] m-0 checked:[background-image:none]",
                  x[m].input,
                  o && k.input,
                  !o && S[m].input
                ),
                checked: z(),
                onChange: L,
                disabled: o,
                name: f,
                ...u
              }
            ),
            /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
              "label",
              {
                htmlFor: l,
                className: functions_es_c(
                  "peer/toggle-dial bg-white border rounded-full absolute cursor-pointer shadow-md before:content[''] before:transition-opacity before:opacity-0 hover:before:opacity-10 before:hidden border-none transition-all duration-300 top-2/4 not-rtl:left-1 rtl:right-1 -translate-y-2/4 before:w-10 before:h-10 before:rounded-full before:absolute before:top-2/4 not-rtl:before:left-2/4 rtl:before:right-2/4 before:-translate-y-2/4 before:-translate-x-2/4",
                  v[i].toggleDial,
                  x[m].toggleDial,
                  o && k.toggleDial,
                  !o && V[i]
                )
              }
            )
          ]
        }
      )
    }
  );
}, switch_es_$ = (0,external_React_namespaceObject.forwardRef)(switch_es_R);
switch_es_$.displayName = "Switch";

//# sourceMappingURL=switch.es.js.map

;// ./node_modules/@bsf/force-ui/dist/components/radio-button/radio-button.es.js








const Q = (0,external_React_namespaceObject.createContext)({}), U = () => (0,external_React_namespaceObject.useContext)(Q), X = ({
  children: b,
  name: r,
  style: e = "simple",
  size: A = "md",
  value: c,
  defaultValue: i,
  by: y = "id",
  as: R = "div",
  onChange: s,
  className: l,
  disableGroup: x = !1,
  vertical: p = !1,
  columns: a = 4,
  multiSelection: m = !1,
  gapClassName: z = "gap-2"
}) => {
  const h = (0,external_React_namespaceObject.useMemo)(() => typeof c < "u", [c]), G = (0,external_React_namespaceObject.useMemo)(
    () => r || `radio-button-group-${nanoid()}`,
    [r]
  );
  let k;
  h ? k = c : m ? k = i ?? [] : k = i;
  const [F, N] = (0,external_React_namespaceObject.useState)(k), P = (0,external_React_namespaceObject.useCallback)(
    (n) => {
      if (m)
        N((C) => {
          const D = Array.isArray(C) && typeof n == "string" && C.includes(n);
          let u;
          return D ? u = C.filter(
            (o) => o !== n
          ) : u = [
            ...Array.isArray(C) ? C : [],
            ...typeof n == "string" ? [n] : []
          ], typeof s == "function" && s(u), u;
        });
      else {
        if (h || N(n), typeof s != "function")
          return;
        s(n);
      }
    },
    [s]
  );
  l = functions_es_c(
    "grid grid-cols-4",
    functions_es_d[a],
    z,
    e === "tile" && "gap-0",
    p && "grid-cols-1",
    l
  );
  const f = functions_es_c(
    e === "tile" ? "border border-border-subtle border-solid rounded-md shadow-sm" : "gap-6",
    l
  ), $ = () => /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    Q.Provider,
    {
      value: {
        name: G,
        value: h ? c : F,
        by: y,
        onChange: P,
        isControlled: h,
        disableAll: x,
        style: e,
        columns: a,
        multiSelection: m,
        size: A
      },
      children: external_React_namespaceObject.Children.map(b, (n) => (0,external_React_namespaceObject.isValidElement)(n) ? n : null)
    }
  );
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_ReactJSXRuntime_namespaceObject.Fragment, { children: e === "tile" ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("div", { className: f, children: $() }) : /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(R, { ...R === external_React_namespaceObject.Fragment ? {} : { className: l }, children: $() }) });
};
X.displayName = "RadioButton.Group";
const pe = ({
  id: b,
  label: r,
  value: e,
  children: A,
  disabled: c,
  icon: i = null,
  inlineIcon: y = !1,
  hideSelection: R = !1,
  reversePosition: s = !1,
  borderOn: l = !1,
  borderOnActive: x = !0,
  badgeItem: p = null,
  useSwitch: a = !1,
  info: m = void 0,
  minWidth: z = !0,
  ...h
}, G) => {
  const { buttonWrapperClasses: k, ...F } = h, N = U(), {
    name: P,
    value: f,
    by: $,
    onChange: n,
    disableAll: C,
    checked: D,
    multiSelection: u,
    size: o = "md"
    // Default size to 'md' if not provided
  } = N, w = "primary", T = (0,external_React_namespaceObject.useMemo)(() => b || `radio-button-${nanoid()}`, [b]), B = (0,external_React_namespaceObject.useMemo)(
    () => C || c,
    [C, c]
  ), L = (0,external_React_namespaceObject.useMemo)(() => u ? Array.isArray(f) && f.includes(e) : typeof D < "u" ? D : typeof f != typeof e ? !1 : typeof f == "string" ? f === e : Array.isArray(f) ? f.includes(e) : f[$] === e[$], [f, e, D]), Y = (0,external_React_namespaceObject.useCallback)(() => (0,external_React_namespaceObject.isValidElement)(r) ? r : r?.heading ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
    "div",
    {
      className: functions_es_c(
        !y && {
          "space-y-3": o === "sm",
          "space-y-4": o === "md"
        },
        s && (a ? "ml-10" : "ml-4"),
        y && "flex gap-2",
        y && !r.description && "items-center"
      ),
      children: [
        i && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_ReactJSXRuntime_namespaceObject.Fragment, { children: i }),
        /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
          "div",
          {
            className: functions_es_c(
              !(i && a) || i && p ? {
                "space-y-0.5": o === "sm",
                "space-y-1": o === "md"
              } : "space-y-0.5"
            ),
            children: [
              /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
                "p",
                {
                  className: functions_es_c(
                    "text-text-primary font-medium m-0",
                    styles_es_o[o],
                    c && "text-text-disabled cursor-not-allowed"
                  ),
                  children: r.heading
                }
              ),
              r.description && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("p", { className: "text-text-tertiary text-sm font-normal leading-5 m-0", children: r.description })
            ]
          }
        )
      ]
    }
  ) : null, [r]);
  if (N.style === "tile")
    return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
      me,
      {
        id: b,
        label: r,
        value: e,
        disabled: c,
        size: o,
        children: A
      }
    );
  const E = () => {
    B || (u ? a && n(e, !L) : n(e));
  };
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
    "label",
    {
      className: functions_es_c(
        "inline-flex items-center relative cursor-pointer transition-all duration-300",
        !!r && "items-start justify-between",
        z && "min-w-[180px]",
        l && "outline outline-field-border outline-1 rounded-md shadow-sm hover:outline-border-interactive",
        x && l && L && "outline-border-interactive",
        {
          "pl-3.5 pr-2.5 py-2.5": o === "sm" && !(i && a),
          "p-3": o === "sm" && (i && a || i && p),
          "pl-4 pr-3 py-3": o === "md" && !(i && a),
          "p-4": o === "md" && (i && a || i && p)
        },
        "pr-12",
        B && "cursor-not-allowed opacity-40",
        k
      ),
      htmlFor: T,
      onClick: E,
      children: [
        !!r && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
          "label",
          {
            className: functions_es_c(
              "cursor-pointer",
              B && "cursor-not-allowed"
            ),
            htmlFor: T,
            children: Y()
          }
        ),
        !!m && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("div", { className: "absolute mr-0.5 bottom-1.5 right-3", children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(ie, { title: m?.heading, content: m?.description, children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
          Info,
          {
            className: functions_es_c(
              "text-text-primary",
              styles_es_r[o]?.info
            )
          }
        ) }) }),
        /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
          "label",
          {
            className: functions_es_c(
              "absolute mr-0.5 right-3 flex items-center cursor-pointer rounded-full gap-2",
              s && "left-0",
              B && "cursor-not-allowed",
              y && "mr-3"
            ),
            onClick: E,
            children: [
              !!p && p,
              !R && (a ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_ReactJSXRuntime_namespaceObject.Fragment, { children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
                switch_es_$,
                {
                  defaultValue: !1,
                  size: o,
                  onChange: () => {
                    u ? n(e, !L) : n(e);
                  },
                  checked: L,
                  ...F,
                  "aria-label": r?.heading ?? "Switch"
                }
              ) }) : /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)("span", { className: "relative p-0.5", children: [
                /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
                  "input",
                  {
                    ref: G,
                    id: T,
                    type: u ? "checkbox" : "radio",
                    className: functions_es_c(
                      "peer flex relative cursor-pointer appearance-none transition-all m-0 before:content-[''] checked:before:content-[''] checked:before:hidden before:hidden !border-1.5 border-solid",
                      !u && "rounded-full",
                      styles_es_e[w].checkbox,
                      styles_es_r[o].checkbox,
                      B && styles_es_s.checkbox
                    ),
                    name: P,
                    value: e,
                    onChange: (Z) => n(Z.target.value),
                    checked: L,
                    disabled: B,
                    ...F
                  }
                ),
                /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
                  "span",
                  {
                    className: functions_es_c(
                      "inline-flex items-center absolute top-2/4 not-rtl:left-2/4 rtl:right-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100",
                      styles_es_e[w].icon,
                      B && styles_es_s.icon
                    ),
                    children: u ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
                      Check,
                      {
                        className: o === "sm" ? "size-3" : "size-4"
                      }
                    ) : /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
                      "div",
                      {
                        className: functions_es_c(
                          "rounded-full bg-current",
                          styles_es_r[o]?.icon
                        )
                      }
                    )
                  }
                )
              ] }))
            ]
          }
        )
      ]
    }
  );
}, W = (0,external_React_namespaceObject.forwardRef)(pe);
W.displayName = "RadioButton.Button";
const me = ({
  id: b,
  children: r,
  value: e,
  disabled: A,
  size: c = "md",
  ...i
}) => {
  const y = U(), {
    name: R,
    value: s,
    by: l,
    onChange: x,
    disableAll: p,
    checked: a
  } = y || {}, m = (0,external_React_namespaceObject.useMemo)(() => b || `radio-button-${nanoid()}`, [b]), z = (0,external_React_namespaceObject.useMemo)(
    () => p || A,
    [p, A]
  ), h = (0,external_React_namespaceObject.useMemo)(() => typeof a < "u" ? a : typeof s != typeof e ? !1 : typeof s == "string" ? s === e : Array.isArray(s) ? s.includes(e) : s && l ? s[l] === e[l] : !1, [s, e, a, l]), G = () => {
    x && x(e);
  }, F = functions_es_c(
    styles_es_i,
    styles_es_c,
    styles_es_b,
    z ? "text-text-disabled cursor-not-allowed" : "",
    t[c],
    styles_es_d
  );
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(external_ReactJSXRuntime_namespaceObject.Fragment, { children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
    "button",
    {
      type: "button",
      id: m,
      "aria-label": "Radio Button",
      className: functions_es_c(
        F,
        "first:rounded-tl first:rounded-bl first:border-0 first:border-r first:border-border-subtle last:rounded-tr last:rounded-br last:border-0",
        h && "bg-button-disabled"
      ),
      onClick: G,
      disabled: z,
      ...i,
      children: [
        /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
          "input",
          {
            type: "hidden",
            value: e,
            name: R,
            checked: h,
            onChange: (N) => x?.(N.target.value)
          }
        ),
        r
      ]
    }
  ) });
}, Ae = Object.assign(W, {
  Group: X,
  Button: W
});

//# sourceMappingURL=radio-button.es.js.map

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/icons/x.js
/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const x_X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);


//# sourceMappingURL=x.js.map

;// ./node_modules/@bsf/force-ui/dist/components/badge/badge.es.js




const j = (0,external_React_namespaceObject.forwardRef)(
  ({
    label: r = "",
    size: s = "sm",
    // xxs, xs, sm, md, lg
    className: c = "",
    type: u = "pill",
    // pill, rounded
    variant: a = "neutral",
    // neutral, red, yellow, green, blue, inverse
    icon: l = null,
    disabled: b = !1,
    onClose: x = () => {
    },
    closable: p = !1,
    onMouseDown: m = () => {
    },
    disableHover: v = !1
  }, y) => {
    const h = "font-medium border-badge-border-gray flex items-center justify-center border border-solid box-border max-w-full transition-colors duration-150 ease-in-out", f = {
      xxs: "py-0.5 px-0.5 text-xs h-4",
      xs: "py-0.5 px-1 text-xs h-5",
      sm: "py-1 px-1.5 text-xs h-6",
      md: "py-1 px-1.5 text-sm h-7",
      lg: "py-1 px-1.5 text-base h-8"
    }, k = {
      pill: "rounded-full",
      rounded: "rounded"
    }, w = {
      neutral: "hover:bg-badge-hover-gray",
      red: "hover:bg-badge-hover-red",
      yellow: "hover:bg-badge-hover-yellow",
      green: "hover:bg-badge-hover-green",
      blue: "hover:bg-badge-hover-sky",
      inverse: "hover:bg-badge-hover-inverse",
      disabled: "hover:bg-badge-hover-disabled"
    }, t = {
      neutral: "bg-badge-background-gray text-badge-color-gray border-badge-border-gray",
      red: "bg-badge-background-red text-badge-color-red border-badge-border-red",
      yellow: "bg-badge-background-yellow text-badge-color-yellow border-badge-border-yellow",
      green: "bg-badge-background-green text-badge-color-green border-badge-border-green",
      blue: "bg-badge-background-sky text-badge-color-sky border-badge-border-sky",
      inverse: "bg-background-inverse text-text-inverse border-background-inverse",
      disabled: "bg-badge-background-disabled text-badge-color-disabled border-badge-border-disabled disabled cursor-not-allowed"
    };
    let o = "", n = "group relative justify-center flex items-center cursor-pointer";
    const g = {
      xxs: "[&>svg]:size-3",
      xs: "[&>svg]:size-3",
      sm: "[&>svg]:size-3",
      md: "[&>svg]:size-4",
      lg: "[&>svg]:size-5"
    };
    return b ? (o = t.disabled, n += " cursor-not-allowed disabled") : o = t[a], r ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
      "span",
      {
        className: functions_es_c(
          h,
          f[s],
          k[u],
          "gap-0.5",
          o,
          !v && w[a],
          c
        ),
        ref: y,
        children: [
          l ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
            "span",
            {
              className: functions_es_c(
                "justify-center flex items-center",
                g[s]
              ),
              children: l
            }
          ) : null,
          /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("span", { className: "px-1 truncate inline-block", children: r }),
          p && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
            "span",
            {
              className: functions_es_c(n, g[s]),
              onMouseDown: m,
              role: "button",
              tabIndex: 0,
              ...!b && {
                onClick: x
              },
              children: [
                /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("span", { className: "sr-only", children: `Remove ${r}` }),
                /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(x_X, {}),
                /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("span", { className: "absolute -inset-1" })
              ]
            }
          )
        ]
      }
    ) : null;
  }
);
j.displayName = "Badge";

//# sourceMappingURL=badge.es.js.map

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/icons/upload.js
/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Upload = createLucideIcon("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);


//# sourceMappingURL=upload.js.map

;// ./node_modules/@bsf/force-ui/dist/components/input/input.es.js







const se = ({
  id: w,
  type: s = "text",
  defaultValue: M = "",
  value: d,
  size: e = "sm",
  // sm, md, lg
  className: N = "",
  disabled: o = !1,
  onChange: x = () => {
  },
  error: I = !1,
  onError: k = () => {
  },
  prefix: n = null,
  suffix: i = null,
  label: p = "",
  ...b
}, F) => {
  const u = (0,external_React_namespaceObject.useRef)(null), c = (0,external_React_namespaceObject.useMemo)(() => w || `input-${s}-${nanoid()}`, [w]), g = (0,external_React_namespaceObject.useMemo)(() => typeof d < "u", [d]), [R, X] = (0,external_React_namespaceObject.useState)(M), [S, h] = (0,external_React_namespaceObject.useState)(null), A = (0,external_React_namespaceObject.useCallback)(
    () => g ? d : R,
    [g, d, R]
  ), V = (a) => {
    if (o)
      return;
    let l;
    s === "file" ? (l = a.target.files, l && l.length > 0 ? h(l[0].name) : h(null)) : l = a.target.value, !g && s !== "file" && X(l), typeof x == "function" && x(l);
  }, j = () => {
    h(null), u.current && (u.current.value = ""), x(null);
  }, q = "bg-field-secondary-background font-normal placeholder-text-tertiary text-text-primary w-full outline outline-1 outline-border-subtle border-none transition-[color,box-shadow,outline] duration-200", L = {
    xs: "px-2 py-1 rounded",
    sm: "p-3 py-2 rounded",
    md: "p-3.5 py-2.5 rounded-md",
    lg: "p-4 py-3 rounded-lg"
  }, B = {
    xs: "text-xs font-medium",
    sm: "text-sm font-medium",
    md: "text-sm font-medium",
    lg: "text-base font-medium"
  }, f = {
    xs: "text-xs",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }, E = {
    sm: n ? "pl-8" : "",
    md: n ? "pl-9" : "",
    lg: n ? "pl-10" : ""
  }, G = {
    sm: i ? "pr-8" : "",
    md: i ? "pr-9" : "",
    lg: i ? "pr-10" : ""
  }, P = o ? "hover:outline-border-disabled" : "hover:outline-border-strong", U = "focus:outline-focus-border focus:ring-2 focus:ring-toggle-on focus:ring-offset-2", H = I ? "focus:outline-focus-error-border focus:ring-field-color-error outline-focus-error-border" : "", J = I ? "focus:outline-focus-error-border focus:ring-field-color-error outline-focus-error-border" : "", O = o ? "outline-border-disabled bg-field-background-disabled cursor-not-allowed text-text-disabled" : "", Q = o ? "outline-border-disabled cursor-not-allowed text-text-disabled file:text-text-tertiary" : "", W = "font-normal placeholder-text-tertiary text-text-primary pointer-events-none absolute inset-y-0 flex flex-1 items-center [&>svg]:h-4 [&>svg]:w-4", v = o ? "font-normal placeholder-text-tertiary text-icon-disabled pointer-events-none absolute inset-y-0 flex flex-1 items-center" : "font-normal placeholder-text-tertiary text-field-placeholder pointer-events-none absolute inset-y-0 flex flex-1 items-center", C = {
    xs: "[&>svg]:size-4",
    sm: "[&>svg]:size-4",
    md: "[&>svg]:size-5",
    lg: "[&>svg]:size-6"
  }, T = () => n ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("div", { className: functions_es_c(W, "left-0 pl-3", f[e]), children: n }) : null, Y = () => s === "file" ? S ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    "div",
    {
      className: functions_es_c(
        v,
        "right-0 pr-3 cursor-pointer z-20 pointer-events-auto",
        C[e]
      ),
      onClick: j,
      role: "button",
      tabIndex: 0,
      onKeyDown: (a) => {
        (a.key === "Enter" || a.key === " ") && j();
      },
      children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(x_X, {})
    }
  ) : /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    "div",
    {
      className: functions_es_c(
        v,
        "right-0 pr-3",
        C[e]
      ),
      children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(Upload, {})
    }
  ) : i ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)("div", { className: functions_es_c(W, "right-0 pr-3", f[e]), children: i }) : null, _ = (0,external_React_namespaceObject.useMemo)(() => p ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    label_es_c,
    {
      className: functions_es_c(B[e]),
      htmlFor: c,
      ...b?.required && { required: !0 },
      children: p
    }
  ) : null, [p, e, c]), Z = S ? "file:border-0 file:bg-transparent pr-10" : "text-text-tertiary file:border-0 file:bg-transparent pr-10";
  return s === "file" ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", { className: "flex flex-col items-start gap-1.5 [&_*]:box-border box-border", children: [
    _,
    /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
      "div",
      {
        className: functions_es_c(
          "w-full relative flex focus-within:z-10",
          N
        ),
        children: [
          /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
            "input",
            {
              ref: utils_es_(u, F),
              id: c,
              type: "file",
              className: functions_es_c(
                q,
                Q,
                L[e],
                f[e],
                U,
                P,
                J,
                Z
              ),
              disabled: o,
              onChange: V,
              onInvalid: k,
              ...b
            }
          ),
          /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
            "div",
            {
              className: functions_es_c(
                v,
                "right-0 pr-3",
                C[e]
              ),
              children: /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(Upload, {})
            }
          )
        ]
      }
    )
  ] }) : /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", { className: "flex flex-col items-start gap-1.5 [&_*]:box-border box-border", children: [
    _,
    /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
      "div",
      {
        className: functions_es_c(
          "w-full relative flex focus-within:z-10",
          N
        ),
        children: [
          T(),
          /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
            "input",
            {
              ref: utils_es_(u, F),
              id: c,
              type: s,
              className: functions_es_c(
                q,
                O,
                L[e],
                f[e],
                E[e],
                G[e],
                U,
                P,
                H
              ),
              disabled: o,
              onChange: V,
              onInvalid: k,
              value: A(),
              ...b
            }
          ),
          Y()
        ]
      }
    )
  ] });
}, ne = (0,external_React_namespaceObject.forwardRef)(se);
ne.displayName = "Input";

//# sourceMappingURL=input.es.js.map

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/icons/minus.js
/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Minus = createLucideIcon("Minus", [["path", { d: "M5 12h14", key: "1ays0h" }]]);


//# sourceMappingURL=minus.js.map

;// ./node_modules/@bsf/force-ui/dist/components/checkbox/checkbox.es.js






const checkbox_es_A = ({
  id: l,
  label: e,
  defaultChecked: v = !1,
  checked: i,
  onChange: h,
  indeterminate: y,
  disabled: t,
  size: o = "md",
  className: C,
  ...N
}, w) => {
  const s = (0,external_React_namespaceObject.useMemo)(() => l || `checkbox-${nanoid()}`, [l]), a = (0,external_React_namespaceObject.useMemo)(
    () => typeof i < "u",
    [i]
  ), [m, j] = (0,external_React_namespaceObject.useState)(v || !1), p = "primary", n = {
    sm: {
      checkbox: "size-4 rounded gap-1",
      icon: "size-3",
      text: "text-sm",
      // text class for sm
      description: "text-sm",
      gap: "gap-0.5"
    },
    md: {
      checkbox: "size-5 rounded gap-1",
      icon: "size-4",
      text: "text-base",
      // text class for md
      description: "text-sm",
      gap: "gap-1"
    }
  }, f = {
    primary: {
      checkbox: "border-border-strong hover:border-border-interactive checked:border-border-interactive bg-white checked:bg-toggle-on checked:hover:bg-toggle-on-hover checked:hover:border-toggle-on-hover focus:ring-2 focus:ring-offset-2 focus:ring-focus",
      icon: "text-white"
    }
  }, x = {
    checkbox: "cursor-not-allowed disabled:bg-white checked:disabled:bg-white disabled:border-border-disabled checked:disabled:border-border-disabled",
    icon: "cursor-not-allowed peer-disabled:text-border-disabled"
  }, V = (0,external_React_namespaceObject.useCallback)(
    () => a ? i : m,
    [a, i, m]
  ), F = (L) => {
    if (t)
      return;
    const b = L.target.checked;
    a || j(b), typeof h == "function" && h(b);
  }, I = (0,external_React_namespaceObject.useCallback)(() => (0,external_React_namespaceObject.isValidElement)(e) ? e : !e?.heading && !e?.description ? null : /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)("div", { className: n[o].gap, children: [
    e?.heading && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
      label_es_c,
      {
        className: functions_es_c(
          "text-text-primary font-medium leading-4 m-0",
          n[o].text,
          n[o].gap,
          t && "text-text-disabled"
        ),
        htmlFor: s,
        children: e?.heading
      }
    ),
    e?.description && /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
      label_es_c,
      {
        tag: "p",
        className: functions_es_c(
          "font-normal leading-5 m-0",
          n[o].description,
          t && "text-text-disabled"
        ),
        variant: "help",
        children: e?.description
      }
    )
  ] }), [e, o, t]);
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
    "div",
    {
      className: functions_es_c(
        "inline-flex items-center justify-center gap-2",
        !!e && "items-start",
        t && "cursor-not-allowed"
      ),
      children: [
        /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsxs)(
          "label",
          {
            className: functions_es_c(
              "relative flex items-center justify-center rounded-full p-0.5",
              !t && "cursor-pointer"
            ),
            htmlFor: s,
            children: [
              /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
                "input",
                {
                  ref: w,
                  id: s,
                  type: "checkbox",
                  className: functions_es_c(
                    "peer relative cursor-pointer appearance-none transition-all m-0 before:content-[''] checked:before:content-[''] checked:before:hidden before:hidden !border-1.5 border-solid",
                    f[p].checkbox,
                    n[o].checkbox,
                    t && x.checkbox,
                    C
                  ),
                  checked: V(),
                  onChange: F,
                  disabled: t,
                  ...N
                }
              ),
              /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
                "span",
                {
                  className: functions_es_c(
                    "pointer-events-none inline-flex items-center absolute top-2/4 not-rtl:left-2/4 rtl:right-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100",
                    f[p].icon,
                    t && x.icon
                  ),
                  children: y ? /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(Minus, { className: functions_es_c(n[o]?.icon) }) : /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(Check, { className: functions_es_c(n[o]?.icon) })
                }
              )
            ]
          }
        ),
        !!e && I()
      ]
    }
  );
}, checkbox_es_B = (0,external_React_namespaceObject.forwardRef)(checkbox_es_A);
checkbox_es_B.displayName = "Checkbox";

//# sourceMappingURL=checkbox.es.js.map

;// external ["wp","apiFetch"]
const external_wp_apiFetch_namespaceObject = window["wp"]["apiFetch"];
var external_wp_apiFetch_default = /*#__PURE__*/__webpack_require__.n(external_wp_apiFetch_namespaceObject);
;// ./node_modules/sonner/dist/index.mjs
'use client';
function __insertCSS(code) {
  if (!code || typeof document == 'undefined') return
  let head = document.head || document.getElementsByTagName('head')[0]
  let style = document.createElement('style')
  style.type = 'text/css'
  head.appendChild(style)
  ;style.styleSheet ? (style.styleSheet.cssText = code) : style.appendChild(document.createTextNode(code))
}




const getAsset = (type)=>{
    switch(type){
        case 'success':
            return SuccessIcon;
        case 'info':
            return InfoIcon;
        case 'warning':
            return WarningIcon;
        case 'error':
            return ErrorIcon;
        default:
            return null;
    }
};
const bars = Array(12).fill(0);
const Loader = ({ visible, className })=>{
    return /*#__PURE__*/ external_React_namespaceObject.createElement("div", {
        className: [
            'sonner-loading-wrapper',
            className
        ].filter(Boolean).join(' '),
        "data-visible": visible
    }, /*#__PURE__*/ external_React_namespaceObject.createElement("div", {
        className: "sonner-spinner"
    }, bars.map((_, i)=>/*#__PURE__*/ external_React_namespaceObject.createElement("div", {
            className: "sonner-loading-bar",
            key: `spinner-bar-${i}`
        }))));
};
const SuccessIcon = /*#__PURE__*/ external_React_namespaceObject.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20"
}, /*#__PURE__*/ external_React_namespaceObject.createElement("path", {
    fillRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
    clipRule: "evenodd"
}));
const WarningIcon = /*#__PURE__*/ external_React_namespaceObject.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    height: "20",
    width: "20"
}, /*#__PURE__*/ external_React_namespaceObject.createElement("path", {
    fillRule: "evenodd",
    d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
    clipRule: "evenodd"
}));
const InfoIcon = /*#__PURE__*/ external_React_namespaceObject.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20"
}, /*#__PURE__*/ external_React_namespaceObject.createElement("path", {
    fillRule: "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
    clipRule: "evenodd"
}));
const ErrorIcon = /*#__PURE__*/ external_React_namespaceObject.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20"
}, /*#__PURE__*/ external_React_namespaceObject.createElement("path", {
    fillRule: "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
    clipRule: "evenodd"
}));
const CloseIcon = /*#__PURE__*/ external_React_namespaceObject.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
}, /*#__PURE__*/ external_React_namespaceObject.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
}), /*#__PURE__*/ external_React_namespaceObject.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
}));

const useIsDocumentHidden = ()=>{
    const [isDocumentHidden, setIsDocumentHidden] = external_React_namespaceObject.useState(document.hidden);
    external_React_namespaceObject.useEffect(()=>{
        const callback = ()=>{
            setIsDocumentHidden(document.hidden);
        };
        document.addEventListener('visibilitychange', callback);
        return ()=>window.removeEventListener('visibilitychange', callback);
    }, []);
    return isDocumentHidden;
};

let toastsCounter = 1;
class Observer {
    constructor(){
        // We use arrow functions to maintain the correct `this` reference
        this.subscribe = (subscriber)=>{
            this.subscribers.push(subscriber);
            return ()=>{
                const index = this.subscribers.indexOf(subscriber);
                this.subscribers.splice(index, 1);
            };
        };
        this.publish = (data)=>{
            this.subscribers.forEach((subscriber)=>subscriber(data));
        };
        this.addToast = (data)=>{
            this.publish(data);
            this.toasts = [
                ...this.toasts,
                data
            ];
        };
        this.create = (data)=>{
            var _data_id;
            const { message, ...rest } = data;
            const id = typeof (data == null ? void 0 : data.id) === 'number' || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
            const alreadyExists = this.toasts.find((toast)=>{
                return toast.id === id;
            });
            const dismissible = data.dismissible === undefined ? true : data.dismissible;
            if (this.dismissedToasts.has(id)) {
                this.dismissedToasts.delete(id);
            }
            if (alreadyExists) {
                this.toasts = this.toasts.map((toast)=>{
                    if (toast.id === id) {
                        this.publish({
                            ...toast,
                            ...data,
                            id,
                            title: message
                        });
                        return {
                            ...toast,
                            ...data,
                            id,
                            dismissible,
                            title: message
                        };
                    }
                    return toast;
                });
            } else {
                this.addToast({
                    title: message,
                    ...rest,
                    dismissible,
                    id
                });
            }
            return id;
        };
        this.dismiss = (id)=>{
            if (id) {
                this.dismissedToasts.add(id);
                requestAnimationFrame(()=>this.subscribers.forEach((subscriber)=>subscriber({
                            id,
                            dismiss: true
                        })));
            } else {
                this.toasts.forEach((toast)=>{
                    this.subscribers.forEach((subscriber)=>subscriber({
                            id: toast.id,
                            dismiss: true
                        }));
                });
            }
            return id;
        };
        this.message = (message, data)=>{
            return this.create({
                ...data,
                message
            });
        };
        this.error = (message, data)=>{
            return this.create({
                ...data,
                message,
                type: 'error'
            });
        };
        this.success = (message, data)=>{
            return this.create({
                ...data,
                type: 'success',
                message
            });
        };
        this.info = (message, data)=>{
            return this.create({
                ...data,
                type: 'info',
                message
            });
        };
        this.warning = (message, data)=>{
            return this.create({
                ...data,
                type: 'warning',
                message
            });
        };
        this.loading = (message, data)=>{
            return this.create({
                ...data,
                type: 'loading',
                message
            });
        };
        this.promise = (promise, data)=>{
            if (!data) {
                // Nothing to show
                return;
            }
            let id = undefined;
            if (data.loading !== undefined) {
                id = this.create({
                    ...data,
                    promise,
                    type: 'loading',
                    message: data.loading,
                    description: typeof data.description !== 'function' ? data.description : undefined
                });
            }
            const p = Promise.resolve(promise instanceof Function ? promise() : promise);
            let shouldDismiss = id !== undefined;
            let result;
            const originalPromise = p.then(async (response)=>{
                result = [
                    'resolve',
                    response
                ];
                const isReactElementResponse = external_React_namespaceObject.isValidElement(response);
                if (isReactElementResponse) {
                    shouldDismiss = false;
                    this.create({
                        id,
                        type: 'default',
                        message: response
                    });
                } else if (isHttpResponse(response) && !response.ok) {
                    shouldDismiss = false;
                    const promiseData = typeof data.error === 'function' ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
                    const description = typeof data.description === 'function' ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
                    const isExtendedResult = typeof promiseData === 'object' && !external_React_namespaceObject.isValidElement(promiseData);
                    const toastSettings = isExtendedResult ? promiseData : {
                        message: promiseData
                    };
                    this.create({
                        id,
                        type: 'error',
                        description,
                        ...toastSettings
                    });
                } else if (response instanceof Error) {
                    shouldDismiss = false;
                    const promiseData = typeof data.error === 'function' ? await data.error(response) : data.error;
                    const description = typeof data.description === 'function' ? await data.description(response) : data.description;
                    const isExtendedResult = typeof promiseData === 'object' && !external_React_namespaceObject.isValidElement(promiseData);
                    const toastSettings = isExtendedResult ? promiseData : {
                        message: promiseData
                    };
                    this.create({
                        id,
                        type: 'error',
                        description,
                        ...toastSettings
                    });
                } else if (data.success !== undefined) {
                    shouldDismiss = false;
                    const promiseData = typeof data.success === 'function' ? await data.success(response) : data.success;
                    const description = typeof data.description === 'function' ? await data.description(response) : data.description;
                    const isExtendedResult = typeof promiseData === 'object' && !external_React_namespaceObject.isValidElement(promiseData);
                    const toastSettings = isExtendedResult ? promiseData : {
                        message: promiseData
                    };
                    this.create({
                        id,
                        type: 'success',
                        description,
                        ...toastSettings
                    });
                }
            }).catch(async (error)=>{
                result = [
                    'reject',
                    error
                ];
                if (data.error !== undefined) {
                    shouldDismiss = false;
                    const promiseData = typeof data.error === 'function' ? await data.error(error) : data.error;
                    const description = typeof data.description === 'function' ? await data.description(error) : data.description;
                    const isExtendedResult = typeof promiseData === 'object' && !external_React_namespaceObject.isValidElement(promiseData);
                    const toastSettings = isExtendedResult ? promiseData : {
                        message: promiseData
                    };
                    this.create({
                        id,
                        type: 'error',
                        description,
                        ...toastSettings
                    });
                }
            }).finally(()=>{
                if (shouldDismiss) {
                    // Toast is still in load state (and will be indefinitely — dismiss it)
                    this.dismiss(id);
                    id = undefined;
                }
                data.finally == null ? void 0 : data.finally.call(data);
            });
            const unwrap = ()=>new Promise((resolve, reject)=>originalPromise.then(()=>result[0] === 'reject' ? reject(result[1]) : resolve(result[1])).catch(reject));
            if (typeof id !== 'string' && typeof id !== 'number') {
                // cannot Object.assign on undefined
                return {
                    unwrap
                };
            } else {
                return Object.assign(id, {
                    unwrap
                });
            }
        };
        this.custom = (jsx, data)=>{
            const id = (data == null ? void 0 : data.id) || toastsCounter++;
            this.create({
                jsx: jsx(id),
                id,
                ...data
            });
            return id;
        };
        this.getActiveToasts = ()=>{
            return this.toasts.filter((toast)=>!this.dismissedToasts.has(toast.id));
        };
        this.subscribers = [];
        this.toasts = [];
        this.dismissedToasts = new Set();
    }
}
const ToastState = new Observer();
// bind this to the toast function
const toastFunction = (message, data)=>{
    const id = (data == null ? void 0 : data.id) || toastsCounter++;
    ToastState.addToast({
        title: message,
        ...data,
        id
    });
    return id;
};
const isHttpResponse = (data)=>{
    return data && typeof data === 'object' && 'ok' in data && typeof data.ok === 'boolean' && 'status' in data && typeof data.status === 'number';
};
const basicToast = toastFunction;
const getHistory = ()=>ToastState.toasts;
const getToasts = ()=>ToastState.getActiveToasts();
// We use `Object.assign` to maintain the correct types as we would lose them otherwise
const toast = Object.assign(basicToast, {
    success: ToastState.success,
    info: ToastState.info,
    warning: ToastState.warning,
    error: ToastState.error,
    custom: ToastState.custom,
    message: ToastState.message,
    promise: ToastState.promise,
    dismiss: ToastState.dismiss,
    loading: ToastState.loading
}, {
    getHistory,
    getToasts
});

__insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");

function isAction(action) {
    return action.label !== undefined;
}

// Visible toasts amount
const VISIBLE_TOASTS_AMOUNT = 3;
// Viewport padding
const VIEWPORT_OFFSET = '24px';
// Mobile viewport padding
const MOBILE_VIEWPORT_OFFSET = '16px';
// Default lifetime of a toasts (in ms)
const TOAST_LIFETIME = 4000;
// Default toast width
const TOAST_WIDTH = 356;
// Default gap between toasts
const GAP = 14;
// Threshold to dismiss a toast
const SWIPE_THRESHOLD = 45;
// Equal to exit animation duration
const TIME_BEFORE_UNMOUNT = 200;
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
function getDefaultSwipeDirections(position) {
    const [y, x] = position.split('-');
    const directions = [];
    if (y) {
        directions.push(y);
    }
    if (x) {
        directions.push(x);
    }
    return directions;
}
const Toast = (props)=>{
    var _toast_classNames, _toast_classNames1, _toast_classNames2, _toast_classNames3, _toast_classNames4, _toast_classNames5, _toast_classNames6, _toast_classNames7, _toast_classNames8;
    const { invert: ToasterInvert, toast, unstyled, interacting, setHeights, visibleToasts, heights, index, toasts, expanded, removeToast, defaultRichColors, closeButton: closeButtonFromToaster, style, cancelButtonStyle, actionButtonStyle, className = '', descriptionClassName = '', duration: durationFromToaster, position, gap, expandByDefault, classNames, icons, closeButtonAriaLabel = 'Close toast' } = props;
    const [swipeDirection, setSwipeDirection] = external_React_namespaceObject.useState(null);
    const [swipeOutDirection, setSwipeOutDirection] = external_React_namespaceObject.useState(null);
    const [mounted, setMounted] = external_React_namespaceObject.useState(false);
    const [removed, setRemoved] = external_React_namespaceObject.useState(false);
    const [swiping, setSwiping] = external_React_namespaceObject.useState(false);
    const [swipeOut, setSwipeOut] = external_React_namespaceObject.useState(false);
    const [isSwiped, setIsSwiped] = external_React_namespaceObject.useState(false);
    const [offsetBeforeRemove, setOffsetBeforeRemove] = external_React_namespaceObject.useState(0);
    const [initialHeight, setInitialHeight] = external_React_namespaceObject.useState(0);
    const remainingTime = external_React_namespaceObject.useRef(toast.duration || durationFromToaster || TOAST_LIFETIME);
    const dragStartTime = external_React_namespaceObject.useRef(null);
    const toastRef = external_React_namespaceObject.useRef(null);
    const isFront = index === 0;
    const isVisible = index + 1 <= visibleToasts;
    const toastType = toast.type;
    const dismissible = toast.dismissible !== false;
    const toastClassname = toast.className || '';
    const toastDescriptionClassname = toast.descriptionClassName || '';
    // Height index is used to calculate the offset as it gets updated before the toast array, which means we can calculate the new layout faster.
    const heightIndex = external_React_namespaceObject.useMemo(()=>heights.findIndex((height)=>height.toastId === toast.id) || 0, [
        heights,
        toast.id
    ]);
    const closeButton = external_React_namespaceObject.useMemo(()=>{
        var _toast_closeButton;
        return (_toast_closeButton = toast.closeButton) != null ? _toast_closeButton : closeButtonFromToaster;
    }, [
        toast.closeButton,
        closeButtonFromToaster
    ]);
    const duration = external_React_namespaceObject.useMemo(()=>toast.duration || durationFromToaster || TOAST_LIFETIME, [
        toast.duration,
        durationFromToaster
    ]);
    const closeTimerStartTimeRef = external_React_namespaceObject.useRef(0);
    const offset = external_React_namespaceObject.useRef(0);
    const lastCloseTimerStartTimeRef = external_React_namespaceObject.useRef(0);
    const pointerStartRef = external_React_namespaceObject.useRef(null);
    const [y, x] = position.split('-');
    const toastsHeightBefore = external_React_namespaceObject.useMemo(()=>{
        return heights.reduce((prev, curr, reducerIndex)=>{
            // Calculate offset up until current toast
            if (reducerIndex >= heightIndex) {
                return prev;
            }
            return prev + curr.height;
        }, 0);
    }, [
        heights,
        heightIndex
    ]);
    const isDocumentHidden = useIsDocumentHidden();
    const invert = toast.invert || ToasterInvert;
    const disabled = toastType === 'loading';
    offset.current = external_React_namespaceObject.useMemo(()=>heightIndex * gap + toastsHeightBefore, [
        heightIndex,
        toastsHeightBefore
    ]);
    external_React_namespaceObject.useEffect(()=>{
        remainingTime.current = duration;
    }, [
        duration
    ]);
    external_React_namespaceObject.useEffect(()=>{
        // Trigger enter animation without using CSS animation
        setMounted(true);
    }, []);
    external_React_namespaceObject.useEffect(()=>{
        const toastNode = toastRef.current;
        if (toastNode) {
            const height = toastNode.getBoundingClientRect().height;
            // Add toast height to heights array after the toast is mounted
            setInitialHeight(height);
            setHeights((h)=>[
                    {
                        toastId: toast.id,
                        height,
                        position: toast.position
                    },
                    ...h
                ]);
            return ()=>setHeights((h)=>h.filter((height)=>height.toastId !== toast.id));
        }
    }, [
        setHeights,
        toast.id
    ]);
    external_React_namespaceObject.useLayoutEffect(()=>{
        // Keep height up to date with the content in case it updates
        if (!mounted) return;
        const toastNode = toastRef.current;
        const originalHeight = toastNode.style.height;
        toastNode.style.height = 'auto';
        const newHeight = toastNode.getBoundingClientRect().height;
        toastNode.style.height = originalHeight;
        setInitialHeight(newHeight);
        setHeights((heights)=>{
            const alreadyExists = heights.find((height)=>height.toastId === toast.id);
            if (!alreadyExists) {
                return [
                    {
                        toastId: toast.id,
                        height: newHeight,
                        position: toast.position
                    },
                    ...heights
                ];
            } else {
                return heights.map((height)=>height.toastId === toast.id ? {
                        ...height,
                        height: newHeight
                    } : height);
            }
        });
    }, [
        mounted,
        toast.title,
        toast.description,
        setHeights,
        toast.id,
        toast.jsx,
        toast.action,
        toast.cancel
    ]);
    const deleteToast = external_React_namespaceObject.useCallback(()=>{
        // Save the offset for the exit swipe animation
        setRemoved(true);
        setOffsetBeforeRemove(offset.current);
        setHeights((h)=>h.filter((height)=>height.toastId !== toast.id));
        setTimeout(()=>{
            removeToast(toast);
        }, TIME_BEFORE_UNMOUNT);
    }, [
        toast,
        removeToast,
        setHeights,
        offset
    ]);
    external_React_namespaceObject.useEffect(()=>{
        if (toast.promise && toastType === 'loading' || toast.duration === Infinity || toast.type === 'loading') return;
        let timeoutId;
        // Pause the timer on each hover
        const pauseTimer = ()=>{
            if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
                // Get the elapsed time since the timer started
                const elapsedTime = new Date().getTime() - closeTimerStartTimeRef.current;
                remainingTime.current = remainingTime.current - elapsedTime;
            }
            lastCloseTimerStartTimeRef.current = new Date().getTime();
        };
        const startTimer = ()=>{
            // setTimeout(, Infinity) behaves as if the delay is 0.
            // As a result, the toast would be closed immediately, giving the appearance that it was never rendered.
            // See: https://github.com/denysdovhan/wtfjs?tab=readme-ov-file#an-infinite-timeout
            if (remainingTime.current === Infinity) return;
            closeTimerStartTimeRef.current = new Date().getTime();
            // Let the toast know it has started
            timeoutId = setTimeout(()=>{
                toast.onAutoClose == null ? void 0 : toast.onAutoClose.call(toast, toast);
                deleteToast();
            }, remainingTime.current);
        };
        if (expanded || interacting || isDocumentHidden) {
            pauseTimer();
        } else {
            startTimer();
        }
        return ()=>clearTimeout(timeoutId);
    }, [
        expanded,
        interacting,
        toast,
        toastType,
        isDocumentHidden,
        deleteToast
    ]);
    external_React_namespaceObject.useEffect(()=>{
        if (toast.delete) {
            deleteToast();
            toast.onDismiss == null ? void 0 : toast.onDismiss.call(toast, toast);
        }
    }, [
        deleteToast,
        toast.delete
    ]);
    function getLoadingIcon() {
        var _toast_classNames;
        if (icons == null ? void 0 : icons.loading) {
            var _toast_classNames1;
            return /*#__PURE__*/ external_React_namespaceObject.createElement("div", {
                className: cn(classNames == null ? void 0 : classNames.loader, toast == null ? void 0 : (_toast_classNames1 = toast.classNames) == null ? void 0 : _toast_classNames1.loader, 'sonner-loader'),
                "data-visible": toastType === 'loading'
            }, icons.loading);
        }
        return /*#__PURE__*/ external_React_namespaceObject.createElement(Loader, {
            className: cn(classNames == null ? void 0 : classNames.loader, toast == null ? void 0 : (_toast_classNames = toast.classNames) == null ? void 0 : _toast_classNames.loader),
            visible: toastType === 'loading'
        });
    }
    const icon = toast.icon || (icons == null ? void 0 : icons[toastType]) || getAsset(toastType);
    var _toast_richColors, _icons_close;
    return /*#__PURE__*/ external_React_namespaceObject.createElement("li", {
        tabIndex: 0,
        ref: toastRef,
        className: cn(className, toastClassname, classNames == null ? void 0 : classNames.toast, toast == null ? void 0 : (_toast_classNames = toast.classNames) == null ? void 0 : _toast_classNames.toast, classNames == null ? void 0 : classNames.default, classNames == null ? void 0 : classNames[toastType], toast == null ? void 0 : (_toast_classNames1 = toast.classNames) == null ? void 0 : _toast_classNames1[toastType]),
        "data-sonner-toast": "",
        "data-rich-colors": (_toast_richColors = toast.richColors) != null ? _toast_richColors : defaultRichColors,
        "data-styled": !Boolean(toast.jsx || toast.unstyled || unstyled),
        "data-mounted": mounted,
        "data-promise": Boolean(toast.promise),
        "data-swiped": isSwiped,
        "data-removed": removed,
        "data-visible": isVisible,
        "data-y-position": y,
        "data-x-position": x,
        "data-index": index,
        "data-front": isFront,
        "data-swiping": swiping,
        "data-dismissible": dismissible,
        "data-type": toastType,
        "data-invert": invert,
        "data-swipe-out": swipeOut,
        "data-swipe-direction": swipeOutDirection,
        "data-expanded": Boolean(expanded || expandByDefault && mounted),
        "data-testid": toast.testId,
        style: {
            '--index': index,
            '--toasts-before': index,
            '--z-index': toasts.length - index,
            '--offset': `${removed ? offsetBeforeRemove : offset.current}px`,
            '--initial-height': expandByDefault ? 'auto' : `${initialHeight}px`,
            ...style,
            ...toast.style
        },
        onDragEnd: ()=>{
            setSwiping(false);
            setSwipeDirection(null);
            pointerStartRef.current = null;
        },
        onPointerDown: (event)=>{
            if (event.button === 2) return; // Return early on right click
            if (disabled || !dismissible) return;
            dragStartTime.current = new Date();
            setOffsetBeforeRemove(offset.current);
            // Ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
            event.target.setPointerCapture(event.pointerId);
            if (event.target.tagName === 'BUTTON') return;
            setSwiping(true);
            pointerStartRef.current = {
                x: event.clientX,
                y: event.clientY
            };
        },
        onPointerUp: ()=>{
            var _toastRef_current, _toastRef_current1, _dragStartTime_current;
            if (swipeOut || !dismissible) return;
            pointerStartRef.current = null;
            const swipeAmountX = Number(((_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.getPropertyValue('--swipe-amount-x').replace('px', '')) || 0);
            const swipeAmountY = Number(((_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.getPropertyValue('--swipe-amount-y').replace('px', '')) || 0);
            const timeTaken = new Date().getTime() - ((_dragStartTime_current = dragStartTime.current) == null ? void 0 : _dragStartTime_current.getTime());
            const swipeAmount = swipeDirection === 'x' ? swipeAmountX : swipeAmountY;
            const velocity = Math.abs(swipeAmount) / timeTaken;
            if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
                setOffsetBeforeRemove(offset.current);
                toast.onDismiss == null ? void 0 : toast.onDismiss.call(toast, toast);
                if (swipeDirection === 'x') {
                    setSwipeOutDirection(swipeAmountX > 0 ? 'right' : 'left');
                } else {
                    setSwipeOutDirection(swipeAmountY > 0 ? 'down' : 'up');
                }
                deleteToast();
                setSwipeOut(true);
                return;
            } else {
                var _toastRef_current2, _toastRef_current3;
                (_toastRef_current2 = toastRef.current) == null ? void 0 : _toastRef_current2.style.setProperty('--swipe-amount-x', `0px`);
                (_toastRef_current3 = toastRef.current) == null ? void 0 : _toastRef_current3.style.setProperty('--swipe-amount-y', `0px`);
            }
            setIsSwiped(false);
            setSwiping(false);
            setSwipeDirection(null);
        },
        onPointerMove: (event)=>{
            var _window_getSelection, // Apply transform using both x and y values
            _toastRef_current, _toastRef_current1;
            if (!pointerStartRef.current || !dismissible) return;
            const isHighlighted = ((_window_getSelection = window.getSelection()) == null ? void 0 : _window_getSelection.toString().length) > 0;
            if (isHighlighted) return;
            const yDelta = event.clientY - pointerStartRef.current.y;
            const xDelta = event.clientX - pointerStartRef.current.x;
            var _props_swipeDirections;
            const swipeDirections = (_props_swipeDirections = props.swipeDirections) != null ? _props_swipeDirections : getDefaultSwipeDirections(position);
            // Determine swipe direction if not already locked
            if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
                setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? 'x' : 'y');
            }
            let swipeAmount = {
                x: 0,
                y: 0
            };
            const getDampening = (delta)=>{
                const factor = Math.abs(delta) / 20;
                return 1 / (1.5 + factor);
            };
            // Only apply swipe in the locked direction
            if (swipeDirection === 'y') {
                // Handle vertical swipes
                if (swipeDirections.includes('top') || swipeDirections.includes('bottom')) {
                    if (swipeDirections.includes('top') && yDelta < 0 || swipeDirections.includes('bottom') && yDelta > 0) {
                        swipeAmount.y = yDelta;
                    } else {
                        // Smoothly transition to dampened movement
                        const dampenedDelta = yDelta * getDampening(yDelta);
                        // Ensure we don't jump when transitioning to dampened movement
                        swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
                    }
                }
            } else if (swipeDirection === 'x') {
                // Handle horizontal swipes
                if (swipeDirections.includes('left') || swipeDirections.includes('right')) {
                    if (swipeDirections.includes('left') && xDelta < 0 || swipeDirections.includes('right') && xDelta > 0) {
                        swipeAmount.x = xDelta;
                    } else {
                        // Smoothly transition to dampened movement
                        const dampenedDelta = xDelta * getDampening(xDelta);
                        // Ensure we don't jump when transitioning to dampened movement
                        swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
                    }
                }
            }
            if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
                setIsSwiped(true);
            }
            (_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.setProperty('--swipe-amount-x', `${swipeAmount.x}px`);
            (_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.setProperty('--swipe-amount-y', `${swipeAmount.y}px`);
        }
    }, closeButton && !toast.jsx && toastType !== 'loading' ? /*#__PURE__*/ external_React_namespaceObject.createElement("button", {
        "aria-label": closeButtonAriaLabel,
        "data-disabled": disabled,
        "data-close-button": true,
        onClick: disabled || !dismissible ? ()=>{} : ()=>{
            deleteToast();
            toast.onDismiss == null ? void 0 : toast.onDismiss.call(toast, toast);
        },
        className: cn(classNames == null ? void 0 : classNames.closeButton, toast == null ? void 0 : (_toast_classNames2 = toast.classNames) == null ? void 0 : _toast_classNames2.closeButton)
    }, (_icons_close = icons == null ? void 0 : icons.close) != null ? _icons_close : CloseIcon) : null, (toastType || toast.icon || toast.promise) && toast.icon !== null && ((icons == null ? void 0 : icons[toastType]) !== null || toast.icon) ? /*#__PURE__*/ external_React_namespaceObject.createElement("div", {
        "data-icon": "",
        className: cn(classNames == null ? void 0 : classNames.icon, toast == null ? void 0 : (_toast_classNames3 = toast.classNames) == null ? void 0 : _toast_classNames3.icon)
    }, toast.promise || toast.type === 'loading' && !toast.icon ? toast.icon || getLoadingIcon() : null, toast.type !== 'loading' ? icon : null) : null, /*#__PURE__*/ external_React_namespaceObject.createElement("div", {
        "data-content": "",
        className: cn(classNames == null ? void 0 : classNames.content, toast == null ? void 0 : (_toast_classNames4 = toast.classNames) == null ? void 0 : _toast_classNames4.content)
    }, /*#__PURE__*/ external_React_namespaceObject.createElement("div", {
        "data-title": "",
        className: cn(classNames == null ? void 0 : classNames.title, toast == null ? void 0 : (_toast_classNames5 = toast.classNames) == null ? void 0 : _toast_classNames5.title)
    }, toast.jsx ? toast.jsx : typeof toast.title === 'function' ? toast.title() : toast.title), toast.description ? /*#__PURE__*/ external_React_namespaceObject.createElement("div", {
        "data-description": "",
        className: cn(descriptionClassName, toastDescriptionClassname, classNames == null ? void 0 : classNames.description, toast == null ? void 0 : (_toast_classNames6 = toast.classNames) == null ? void 0 : _toast_classNames6.description)
    }, typeof toast.description === 'function' ? toast.description() : toast.description) : null), /*#__PURE__*/ external_React_namespaceObject.isValidElement(toast.cancel) ? toast.cancel : toast.cancel && isAction(toast.cancel) ? /*#__PURE__*/ external_React_namespaceObject.createElement("button", {
        "data-button": true,
        "data-cancel": true,
        style: toast.cancelButtonStyle || cancelButtonStyle,
        onClick: (event)=>{
            // We need to check twice because typescript
            if (!isAction(toast.cancel)) return;
            if (!dismissible) return;
            toast.cancel.onClick == null ? void 0 : toast.cancel.onClick.call(toast.cancel, event);
            deleteToast();
        },
        className: cn(classNames == null ? void 0 : classNames.cancelButton, toast == null ? void 0 : (_toast_classNames7 = toast.classNames) == null ? void 0 : _toast_classNames7.cancelButton)
    }, toast.cancel.label) : null, /*#__PURE__*/ external_React_namespaceObject.isValidElement(toast.action) ? toast.action : toast.action && isAction(toast.action) ? /*#__PURE__*/ external_React_namespaceObject.createElement("button", {
        "data-button": true,
        "data-action": true,
        style: toast.actionButtonStyle || actionButtonStyle,
        onClick: (event)=>{
            // We need to check twice because typescript
            if (!isAction(toast.action)) return;
            toast.action.onClick == null ? void 0 : toast.action.onClick.call(toast.action, event);
            if (event.defaultPrevented) return;
            deleteToast();
        },
        className: cn(classNames == null ? void 0 : classNames.actionButton, toast == null ? void 0 : (_toast_classNames8 = toast.classNames) == null ? void 0 : _toast_classNames8.actionButton)
    }, toast.action.label) : null);
};
function getDocumentDirection() {
    if (typeof window === 'undefined') return 'ltr';
    if (typeof document === 'undefined') return 'ltr'; // For Fresh purpose
    const dirAttribute = document.documentElement.getAttribute('dir');
    if (dirAttribute === 'auto' || !dirAttribute) {
        return window.getComputedStyle(document.documentElement).direction;
    }
    return dirAttribute;
}
function assignOffset(defaultOffset, mobileOffset) {
    const styles = {};
    [
        defaultOffset,
        mobileOffset
    ].forEach((offset, index)=>{
        const isMobile = index === 1;
        const prefix = isMobile ? '--mobile-offset' : '--offset';
        const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
        function assignAll(offset) {
            [
                'top',
                'right',
                'bottom',
                'left'
            ].forEach((key)=>{
                styles[`${prefix}-${key}`] = typeof offset === 'number' ? `${offset}px` : offset;
            });
        }
        if (typeof offset === 'number' || typeof offset === 'string') {
            assignAll(offset);
        } else if (typeof offset === 'object') {
            [
                'top',
                'right',
                'bottom',
                'left'
            ].forEach((key)=>{
                if (offset[key] === undefined) {
                    styles[`${prefix}-${key}`] = defaultValue;
                } else {
                    styles[`${prefix}-${key}`] = typeof offset[key] === 'number' ? `${offset[key]}px` : offset[key];
                }
            });
        } else {
            assignAll(defaultValue);
        }
    });
    return styles;
}
function useSonner() {
    const [activeToasts, setActiveToasts] = React.useState([]);
    React.useEffect(()=>{
        return ToastState.subscribe((toast)=>{
            if (toast.dismiss) {
                setTimeout(()=>{
                    ReactDOM.flushSync(()=>{
                        setActiveToasts((toasts)=>toasts.filter((t)=>t.id !== toast.id));
                    });
                });
                return;
            }
            // Prevent batching, temp solution.
            setTimeout(()=>{
                ReactDOM.flushSync(()=>{
                    setActiveToasts((toasts)=>{
                        const indexOfExistingToast = toasts.findIndex((t)=>t.id === toast.id);
                        // Update the toast if it already exists
                        if (indexOfExistingToast !== -1) {
                            return [
                                ...toasts.slice(0, indexOfExistingToast),
                                {
                                    ...toasts[indexOfExistingToast],
                                    ...toast
                                },
                                ...toasts.slice(indexOfExistingToast + 1)
                            ];
                        }
                        return [
                            toast,
                            ...toasts
                        ];
                    });
                });
            });
        });
    }, []);
    return {
        toasts: activeToasts
    };
}
const Toaster = /*#__PURE__*/ external_React_namespaceObject.forwardRef(function Toaster(props, ref) {
    const { id, invert, position = 'bottom-right', hotkey = [
        'altKey',
        'KeyT'
    ], expand, closeButton, className, offset, mobileOffset, theme = 'light', richColors, duration, style, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions, dir = getDocumentDirection(), gap = GAP, icons, containerAriaLabel = 'Notifications' } = props;
    const [toasts, setToasts] = external_React_namespaceObject.useState([]);
    const filteredToasts = external_React_namespaceObject.useMemo(()=>{
        if (id) {
            return toasts.filter((toast)=>toast.toasterId === id);
        }
        return toasts.filter((toast)=>!toast.toasterId);
    }, [
        toasts,
        id
    ]);
    const possiblePositions = external_React_namespaceObject.useMemo(()=>{
        return Array.from(new Set([
            position
        ].concat(filteredToasts.filter((toast)=>toast.position).map((toast)=>toast.position))));
    }, [
        filteredToasts,
        position
    ]);
    const [heights, setHeights] = external_React_namespaceObject.useState([]);
    const [expanded, setExpanded] = external_React_namespaceObject.useState(false);
    const [interacting, setInteracting] = external_React_namespaceObject.useState(false);
    const [actualTheme, setActualTheme] = external_React_namespaceObject.useState(theme !== 'system' ? theme : typeof window !== 'undefined' ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : 'light');
    const listRef = external_React_namespaceObject.useRef(null);
    const hotkeyLabel = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '');
    const lastFocusedElementRef = external_React_namespaceObject.useRef(null);
    const isFocusWithinRef = external_React_namespaceObject.useRef(false);
    const removeToast = external_React_namespaceObject.useCallback((toastToRemove)=>{
        setToasts((toasts)=>{
            var _toasts_find;
            if (!((_toasts_find = toasts.find((toast)=>toast.id === toastToRemove.id)) == null ? void 0 : _toasts_find.delete)) {
                ToastState.dismiss(toastToRemove.id);
            }
            return toasts.filter(({ id })=>id !== toastToRemove.id);
        });
    }, []);
    external_React_namespaceObject.useEffect(()=>{
        return ToastState.subscribe((toast)=>{
            if (toast.dismiss) {
                // Prevent batching of other state updates
                requestAnimationFrame(()=>{
                    setToasts((toasts)=>toasts.map((t)=>t.id === toast.id ? {
                                ...t,
                                delete: true
                            } : t));
                });
                return;
            }
            // Prevent batching, temp solution.
            setTimeout(()=>{
                external_ReactDOM_.flushSync(()=>{
                    setToasts((toasts)=>{
                        const indexOfExistingToast = toasts.findIndex((t)=>t.id === toast.id);
                        // Update the toast if it already exists
                        if (indexOfExistingToast !== -1) {
                            return [
                                ...toasts.slice(0, indexOfExistingToast),
                                {
                                    ...toasts[indexOfExistingToast],
                                    ...toast
                                },
                                ...toasts.slice(indexOfExistingToast + 1)
                            ];
                        }
                        return [
                            toast,
                            ...toasts
                        ];
                    });
                });
            });
        });
    }, [
        toasts
    ]);
    external_React_namespaceObject.useEffect(()=>{
        if (theme !== 'system') {
            setActualTheme(theme);
            return;
        }
        if (theme === 'system') {
            // check if current preference is dark
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // it's currently dark
                setActualTheme('dark');
            } else {
                // it's not dark
                setActualTheme('light');
            }
        }
        if (typeof window === 'undefined') return;
        const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        try {
            // Chrome & Firefox
            darkMediaQuery.addEventListener('change', ({ matches })=>{
                if (matches) {
                    setActualTheme('dark');
                } else {
                    setActualTheme('light');
                }
            });
        } catch (error) {
            // Safari < 14
            darkMediaQuery.addListener(({ matches })=>{
                try {
                    if (matches) {
                        setActualTheme('dark');
                    } else {
                        setActualTheme('light');
                    }
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }, [
        theme
    ]);
    external_React_namespaceObject.useEffect(()=>{
        // Ensure expanded is always false when no toasts are present / only one left
        if (toasts.length <= 1) {
            setExpanded(false);
        }
    }, [
        toasts
    ]);
    external_React_namespaceObject.useEffect(()=>{
        const handleKeyDown = (event)=>{
            var _listRef_current;
            const isHotkeyPressed = hotkey.every((key)=>event[key] || event.code === key);
            if (isHotkeyPressed) {
                var _listRef_current1;
                setExpanded(true);
                (_listRef_current1 = listRef.current) == null ? void 0 : _listRef_current1.focus();
            }
            if (event.code === 'Escape' && (document.activeElement === listRef.current || ((_listRef_current = listRef.current) == null ? void 0 : _listRef_current.contains(document.activeElement)))) {
                setExpanded(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return ()=>document.removeEventListener('keydown', handleKeyDown);
    }, [
        hotkey
    ]);
    external_React_namespaceObject.useEffect(()=>{
        if (listRef.current) {
            return ()=>{
                if (lastFocusedElementRef.current) {
                    lastFocusedElementRef.current.focus({
                        preventScroll: true
                    });
                    lastFocusedElementRef.current = null;
                    isFocusWithinRef.current = false;
                }
            };
        }
    }, [
        listRef.current
    ]);
    return(// Remove item from normal navigation flow, only available via hotkey
    /*#__PURE__*/ external_React_namespaceObject.createElement("section", {
        ref: ref,
        "aria-label": `${containerAriaLabel} ${hotkeyLabel}`,
        tabIndex: -1,
        "aria-live": "polite",
        "aria-relevant": "additions text",
        "aria-atomic": "false",
        suppressHydrationWarning: true
    }, possiblePositions.map((position, index)=>{
        var _heights_;
        const [y, x] = position.split('-');
        if (!filteredToasts.length) return null;
        return /*#__PURE__*/ external_React_namespaceObject.createElement("ol", {
            key: position,
            dir: dir === 'auto' ? getDocumentDirection() : dir,
            tabIndex: -1,
            ref: listRef,
            className: className,
            "data-sonner-toaster": true,
            "data-sonner-theme": actualTheme,
            "data-y-position": y,
            "data-x-position": x,
            style: {
                '--front-toast-height': `${((_heights_ = heights[0]) == null ? void 0 : _heights_.height) || 0}px`,
                '--width': `${TOAST_WIDTH}px`,
                '--gap': `${gap}px`,
                ...style,
                ...assignOffset(offset, mobileOffset)
            },
            onBlur: (event)=>{
                if (isFocusWithinRef.current && !event.currentTarget.contains(event.relatedTarget)) {
                    isFocusWithinRef.current = false;
                    if (lastFocusedElementRef.current) {
                        lastFocusedElementRef.current.focus({
                            preventScroll: true
                        });
                        lastFocusedElementRef.current = null;
                    }
                }
            },
            onFocus: (event)=>{
                const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === 'false';
                if (isNotDismissible) return;
                if (!isFocusWithinRef.current) {
                    isFocusWithinRef.current = true;
                    lastFocusedElementRef.current = event.relatedTarget;
                }
            },
            onMouseEnter: ()=>setExpanded(true),
            onMouseMove: ()=>setExpanded(true),
            onMouseLeave: ()=>{
                // Avoid setting expanded to false when interacting with a toast, e.g. swiping
                if (!interacting) {
                    setExpanded(false);
                }
            },
            onDragEnd: ()=>setExpanded(false),
            onPointerDown: (event)=>{
                const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === 'false';
                if (isNotDismissible) return;
                setInteracting(true);
            },
            onPointerUp: ()=>setInteracting(false)
        }, filteredToasts.filter((toast)=>!toast.position && index === 0 || toast.position === position).map((toast, index)=>{
            var _toastOptions_duration, _toastOptions_closeButton;
            return /*#__PURE__*/ external_React_namespaceObject.createElement(Toast, {
                key: toast.id,
                icons: icons,
                index: index,
                toast: toast,
                defaultRichColors: richColors,
                duration: (_toastOptions_duration = toastOptions == null ? void 0 : toastOptions.duration) != null ? _toastOptions_duration : duration,
                className: toastOptions == null ? void 0 : toastOptions.className,
                descriptionClassName: toastOptions == null ? void 0 : toastOptions.descriptionClassName,
                invert: invert,
                visibleToasts: visibleToasts,
                closeButton: (_toastOptions_closeButton = toastOptions == null ? void 0 : toastOptions.closeButton) != null ? _toastOptions_closeButton : closeButton,
                interacting: interacting,
                position: position,
                style: toastOptions == null ? void 0 : toastOptions.style,
                unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
                classNames: toastOptions == null ? void 0 : toastOptions.classNames,
                cancelButtonStyle: toastOptions == null ? void 0 : toastOptions.cancelButtonStyle,
                actionButtonStyle: toastOptions == null ? void 0 : toastOptions.actionButtonStyle,
                closeButtonAriaLabel: toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel,
                removeToast: removeToast,
                toasts: filteredToasts.filter((t)=>t.position == toast.position),
                heights: heights.filter((h)=>h.position == toast.position),
                setHeights: setHeights,
                expandByDefault: expand,
                gap: gap,
                expanded: expanded,
                swipeDirections: props.swipeDirections
            });
        }));
    })));
});



;// ./Admin/Settings/Views/src/utils.js
var _window$lmat_settings, _window$lmat_settings2;


// Get synchronization options from localized data
var synchronizations = ((_window$lmat_settings = window.lmat_settings) === null || _window$lmat_settings === void 0 ? void 0 : _window$lmat_settings.sync_options) || [];

// Get language switcher options from localized data
var languageSwitcherOptions = ((_window$lmat_settings2 = window.lmat_settings) === null || _window$lmat_settings2 === void 0 ? void 0 : _window$lmat_settings2.language_switcher_options) || [];

// Get nonce from localized script data
var getNonce = function getNonce() {
  var _window$lmat_settings3;
  return ((_window$lmat_settings3 = window.lmat_settings) === null || _window$lmat_settings3 === void 0 ? void 0 : _window$lmat_settings3.nonce) || '';
};
;// ./node_modules/lucide-react/dist/esm/shared/src/utils.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const utils_toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const utils_mergeClasses = (...classes) => classes.filter((className, index, array) => {
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

var defaultAttributes_defaultAttributes = {
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





const Icon_Icon = (0,external_React_namespaceObject.forwardRef)(
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
      ...defaultAttributes_defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: utils_mergeClasses("lucide", className),
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





const createLucideIcon_createLucideIcon = (iconName, iconNode) => {
  const Component = (0,external_React_namespaceObject.forwardRef)(
    ({ className, ...props }, ref) => (0,external_React_namespaceObject.createElement)(Icon_Icon, {
      ref,
      iconNode,
      className: utils_mergeClasses(
        `lucide-${utils_toKebabCase(toPascalCase(iconName))}`,
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

;// ./node_modules/lucide-react/dist/esm/icons/link.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
];
const Link = createLucideIcon_createLucideIcon("link", __iconNode);


//# sourceMappingURL=link.js.map

;// ./node_modules/lucide-react/dist/esm/icons/globe.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const globe_iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon_createLucideIcon("globe", globe_iconNode);


//# sourceMappingURL=globe.js.map

;// ./node_modules/lucide-react/dist/esm/icons/focus.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const focus_iconNode = [
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }]
];
const Focus = createLucideIcon_createLucideIcon("focus", focus_iconNode);


//# sourceMappingURL=focus.js.map

;// ./node_modules/lucide-react/dist/esm/icons/milestone.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const milestone_iconNode = [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  ["path", { d: "M12 3v3", key: "1n5kay" }],
  [
    "path",
    {
      d: "M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z",
      key: "1btarq"
    }
  ]
];
const Milestone = createLucideIcon_createLucideIcon("milestone", milestone_iconNode);


//# sourceMappingURL=milestone.js.map

;// ./node_modules/lucide-react/dist/esm/icons/refresh-ccw.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const refresh_ccw_iconNode = [
  ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "14sxne" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16", key: "1hlbsb" }],
  ["path", { d: "M16 16h5v5", key: "ccwih5" }]
];
const RefreshCcw = createLucideIcon_createLucideIcon("refresh-ccw", refresh_ccw_iconNode);


//# sourceMappingURL=refresh-ccw.js.map

;// ./node_modules/lucide-react/dist/esm/icons/languages.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const languages_iconNode = [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }]
];
const Languages = createLucideIcon_createLucideIcon("languages", languages_iconNode);


//# sourceMappingURL=languages.js.map

;// ./node_modules/lucide-react/dist/esm/icons/share-2.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const share_2_iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon_createLucideIcon("share-2", share_2_iconNode);


//# sourceMappingURL=share-2.js.map

;// ./Admin/Settings/Views/src/components/General.jsx
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
//Genral Tab Body




 // importing toaster and toast for notification purpose




var General = function General(_ref) {
  var data = _ref.data,
    setData = _ref.setData;
  var _useState = (0,external_React_namespaceObject.useState)(data.browser),
    _useState2 = _slicedToArray(_useState, 2),
    browser = _useState2[0],
    setBrowser = _useState2[1]; //For Detect Browser Language
  var _useState3 = (0,external_React_namespaceObject.useState)(data.media_support),
    _useState4 = _slicedToArray(_useState3, 2),
    mediaSupport = _useState4[0],
    setMediaSupport = _useState4[1]; // For Media
  var _useState5 = (0,external_React_namespaceObject.useState)(data.hide_default),
    _useState6 = _slicedToArray(_useState5, 2),
    hideDefault = _useState6[0],
    setHideDefault = _useState6[1]; //For Hide URL language in URL modifications
  var _useState7 = (0,external_React_namespaceObject.useState)(data.force_lang),
    _useState8 = _slicedToArray(_useState7, 2),
    forceLang = _useState8[0],
    setForceLang = _useState8[1]; // Main Radio Options for URL modifications
  var _useState9 = (0,external_React_namespaceObject.useState)(data.rewrite),
    _useState0 = _slicedToArray(_useState9, 2),
    rewrite = _useState0[0],
    setRewrite = _useState0[1]; // if the first option is selected then for that radio options
  var _useState1 = (0,external_React_namespaceObject.useState)([]),
    _useState10 = _slicedToArray(_useState1, 2),
    domains = _useState10[0],
    setDomains = _useState10[1]; // if 3rd option is selected then for that url inputs
  var currentDomain = window.lmat_settings.home_url; // Fetch the current domain of website
  var _useState11 = (0,external_React_namespaceObject.useState)([]),
    _useState12 = _slicedToArray(_useState11, 2),
    AvailablePostTypes = _useState12[0],
    setAvailablePostTypes = _useState12[1]; // Available Custom Post Types
  var _useState13 = (0,external_React_namespaceObject.useState)([]),
    _useState14 = _slicedToArray(_useState13, 2),
    AvailableTaxonomies = _useState14[0],
    setAvailableTaxonomies = _useState14[1]; // Available Custom Taxonomies
  var _useState15 = (0,external_React_namespaceObject.useState)(data.sync),
    _useState16 = _slicedToArray(_useState15, 2),
    selectedSynchronization = _useState16[0],
    setSelectedSyncronization = _useState16[1]; // Selected Synchronization options
  var _useState17 = (0,external_React_namespaceObject.useState)(data.post_types),
    _useState18 = _slicedToArray(_useState17, 2),
    selectedPostTypes = _useState18[0],
    setSelectedPostTypes = _useState18[1]; // Selected Custom Post Types
  var _useState19 = (0,external_React_namespaceObject.useState)(data.taxonomies),
    _useState20 = _slicedToArray(_useState19, 2),
    selectedTaxonomies = _useState20[0],
    setSelectedTaxonomies = _useState20[1]; //Selected Custom Taxonomies
  var disabledPostTypes = data.disabled_post_types || []; //Disabled Post Types (programmatically active)
  var _useState21 = (0,external_React_namespaceObject.useState)(true),
    _useState22 = _slicedToArray(_useState21, 2),
    handleButtonDisabled = _useState22[0],
    setHandleButtonDisabled = _useState22[1];
  var _useState23 = (0,external_React_namespaceObject.useState)(false),
    _useState24 = _slicedToArray(_useState23, 2),
    selectAllSync = _useState24[0],
    setSelectAllSync = _useState24[1];
  var previousDomains = external_React_default().useRef([]);
  var _useState25 = (0,external_React_namespaceObject.useState)(data.lmat_feedback_data !== undefined ? data.lmat_feedback_data : false),
    _useState26 = _slicedToArray(_useState25, 2),
    lmatFeedbackData = _useState26[0],
    setLmatFeedbackData = _useState26[1]; // For Usage Data Sharing
  var _useState27 = (0,external_React_namespaceObject.useState)(data.lmat_language_switcher_options || ['default']),
    _useState28 = _slicedToArray(_useState27, 2),
    selectedLanguageSwitchers = _useState28[0],
    setSelectedLanguageSwitchers = _useState28[1]; // Selected Language Switcher options
  var _useState29 = (0,external_React_namespaceObject.useState)(false),
    _useState30 = _slicedToArray(_useState29, 2),
    showTerms = _useState30[0],
    setShowTerms = _useState30[1]; // For showing/hiding terms box

  //make the Domains in a suitable way to view
  (0,external_React_namespaceObject.useEffect)(function () {
    var newDomains = window.lmat_settings.languages.map(function (item) {
      var code = item.slug;
      return {
        value: data.domains[code] || "",
        name: "".concat(item.name, "-").concat(item.locale),
        code: code
      };
    });
    setDomains(newDomains);
    previousDomains.current = newDomains;
  }, []);
  (0,external_React_namespaceObject.useEffect)(function () {
    var sameChecker = {
      browser: true,
      mediaSupport: true,
      hideDefault: true,
      forceLang: true,
      rewrite: true,
      domains: true,
      selectedSynchronization: true,
      selectedPostTypes: true,
      selectedTaxonomies: true,
      selectedLanguageSwitchers: true
    };

    // Only include lmatFeedbackData in the checker if the setting is available
    if (data.lmat_feedback_data !== undefined) {
      sameChecker.lmatFeedbackData = true;
    }
    if (forceLang !== data.force_lang) {
      sameChecker.forceLang = false;
    }
    if (hideDefault !== data.hide_default) {
      sameChecker.hideDefault = false;
    }
    if (browser !== data.browser) {
      sameChecker.browser = false;
    }
    if (data.lmat_feedback_data !== undefined && lmatFeedbackData !== data.lmat_feedback_data) {
      sameChecker.lmatFeedbackData = false;
    }
    if (rewrite !== data.rewrite) {
      sameChecker.rewrite = false;
    }
    if (mediaSupport !== data.media_support) {
      sameChecker.mediaSupport = false;
    }
    var _iterator = _createForOfIteratorHelper(previousDomains.current),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _value4 = _step.value;
        if (!domains.includes(_value4) || previousDomains.current.length != domains.length) {
          sameChecker.domains = false;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (data.post_types.length != selectedPostTypes.length) {
      sameChecker.selectedPostTypes = false;
    } else {
      var _iterator2 = _createForOfIteratorHelper(data.post_types),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var value = _step2.value;
          if (!selectedPostTypes.includes(value)) {
            sameChecker.selectedPostTypes = false;
            break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    if (data.taxonomies.length != selectedTaxonomies.length) {
      sameChecker.selectedTaxonomies = false;
    } else {
      var _iterator3 = _createForOfIteratorHelper(data.taxonomies),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _value = _step3.value;
          if (!selectedTaxonomies.includes(_value)) {
            sameChecker.selectedTaxonomies = false;
            break;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
    if (data.sync.length != selectedSynchronization.length) {
      sameChecker.selectedSynchronization = false;
    } else {
      var _iterator4 = _createForOfIteratorHelper(data.sync),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _value2 = _step4.value;
          if (!selectedSynchronization.includes(_value2)) {
            sameChecker.selectedSynchronization = false;
            break;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
    if (data.lmat_language_switcher_options && data.lmat_language_switcher_options.length != selectedLanguageSwitchers.length) {
      sameChecker.selectedLanguageSwitchers = false;
    } else if (data.lmat_language_switcher_options) {
      var _iterator5 = _createForOfIteratorHelper(data.lmat_language_switcher_options),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _value3 = _step5.value;
          if (!selectedLanguageSwitchers.includes(_value3)) {
            sameChecker.selectedLanguageSwitchers = false;
            break;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
    var flag = true;
    for (var key in sameChecker) {
      if (!sameChecker[key]) {
        flag = false;
        setHandleButtonDisabled(false);
        break;
      }
    }
    if (flag) {
      setHandleButtonDisabled(true);
    }
  }, [browser, mediaSupport, hideDefault, forceLang, rewrite, domains, selectedSynchronization, selectedPostTypes, selectedTaxonomies, lmatFeedbackData, selectedLanguageSwitchers]);

  //Make the post types and taxonomies from  posttype->posttype_name   to {value: postype ,label:posttype_name (posttype)}
  (0,external_React_namespaceObject.useEffect)(function () {
    var newAvailableTaxonomies = Object.keys(data.available_taxonomies).map(function (key) {
      return {
        value: data.available_taxonomies[key].taxonomy_key,
        label: data.available_taxonomies[key].taxonomy_name + " ( " + data.available_taxonomies[key].taxonomy_key + " )"
      };
    });
    setAvailableTaxonomies(newAvailableTaxonomies);
    var newAvailablePostTypes = data.available_post_types.map(function (post_type) {
      return {
        value: post_type.post_type_key,
        label: post_type.post_type_name + " ( " + post_type.post_type_key + " )"
      };
    });
    setAvailablePostTypes(newAvailablePostTypes);
  }, [data.taxonomies, data.post_types]);

  //Handle checkboxes of PostType
  var handlePostTypeChange = function handlePostTypeChange(postType) {
    setHandleButtonDisabled(false);
    setSelectedPostTypes(function (prev) {
      if (prev.includes(postType)) {
        return prev.filter(function (item) {
          return item !== postType;
        });
      } else {
        return [].concat(_toConsumableArray(prev), [postType]);
      }
    });
  };

  //Handle Checkboxes of taxonomies
  var handleTaxonomyChange = function handleTaxonomyChange(taxonomy) {
    setHandleButtonDisabled(false);
    setSelectedTaxonomies(function (prev) {
      if (prev.includes(taxonomy)) {
        return prev.filter(function (item) {
          return item !== taxonomy;
        });
      } else {
        return [].concat(_toConsumableArray(prev), [taxonomy]);
      }
    });
  };

  //Handle Checkboxes of Synchronization
  var handleSynchronizationChange = function handleSynchronizationChange(synchronization) {
    setHandleButtonDisabled(false);
    setSelectedSyncronization(function (prev) {
      if (prev.includes(synchronization)) {
        return prev.filter(function (item) {
          return item !== synchronization;
        });
      } else {
        return [].concat(_toConsumableArray(prev), [synchronization]);
      }
    });
  };

  //Handle Checkboxes of Language Switcher
  var handleLanguageSwitcherChange = function handleLanguageSwitcherChange(switcher) {
    setHandleButtonDisabled(false);
    setSelectedLanguageSwitchers(function (prev) {
      if (prev.includes(switcher)) {
        return prev.filter(function (item) {
          return item !== switcher;
        });
      } else {
        return [].concat(_toConsumableArray(prev), [switcher]);
      }
    });
  };

  //Handle Select All Sync
  var handleSelectAllSync = function handleSelectAllSync() {
    setHandleButtonDisabled(false);
    if (selectAllSync) {
      // Deselect all
      setSelectedSyncronization([]);
      setSelectAllSync(false);
    } else {
      // Select all
      var allSyncValues = synchronizations.map(function (sync) {
        return sync.value;
      });
      setSelectedSyncronization(allSyncValues);
      setSelectAllSync(true);
    }
  };

  // Update selectAllSync state when individual sync items change
  external_React_default().useEffect(function () {
    var allSyncValues = synchronizations.map(function (sync) {
      return sync.value;
    });
    var allSelected = allSyncValues.every(function (value) {
      return selectedSynchronization.includes(value);
    });
    setSelectAllSync(allSelected && selectedSynchronization.length > 0);
  }, [selectedSynchronization]);

  // Handle terms box visibility
  var handleTermsToggle = function handleTermsToggle(e) {
    e.preventDefault();
    setShowTerms(!showTerms);
  };

  //Save Setting Function 
  function SaveSettings() {
    return _SaveSettings.apply(this, arguments);
  } //label and descriptions of URL modifications
  function _SaveSettings() {
    _SaveSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var apiBody, final_domain, used_hosts, _iterator6, _step6, domain, response, _t, _t2;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            if (!(forceLang === 3)) {
              _context.n = 10;
              break;
            }
            final_domain = {};
            used_hosts = []; // Validate domains before processing
            _iterator6 = _createForOfIteratorHelper(domains);
            _context.p = 1;
            _iterator6.s();
          case 2:
            if ((_step6 = _iterator6.n()).done) {
              _context.n = 6;
              break;
            }
            domain = _step6.value;
            if (!(!domain.value || domain.value.trim() === '')) {
              _context.n = 3;
              break;
            }
            throw new Error((0,external_wp_i18n_namespaceObject.__)("Domain URL is required for all languages", "linguator-multilingual-ai-translation"));
          case 3:
            if (!(!domain.value.includes("http://") && !domain.value.includes("https://"))) {
              _context.n = 4;
              break;
            }
            throw new Error((0,external_wp_i18n_namespaceObject.__)("Please enter valid URLs with http:// or https://", "linguator-multilingual-ai-translation"));
          case 4:
            final_domain[domain.code] = domain.value;
          case 5:
            _context.n = 2;
            break;
          case 6:
            _context.n = 8;
            break;
          case 7:
            _context.p = 7;
            _t = _context.v;
            _iterator6.e(_t);
          case 8:
            _context.p = 8;
            _iterator6.f();
            return _context.f(8);
          case 9:
            //API Body
            apiBody = {
              hide_default: hideDefault,
              browser: forceLang === 3 ? false : browser,
              media_support: mediaSupport,
              force_lang: forceLang,
              rewrite: rewrite,
              domains: final_domain,
              sync: selectedSynchronization,
              post_types: selectedPostTypes,
              taxonomies: selectedTaxonomies,
              lmat_language_switcher_options: selectedLanguageSwitchers
            };

            // Only include lmat_feedback_data if the setting is available
            if (data.lmat_feedback_data !== undefined) {
              apiBody.lmat_feedback_data = lmatFeedbackData;
            }
            _context.n = 11;
            break;
          case 10:
            apiBody = {
              hide_default: hideDefault,
              browser: forceLang === 3 ? false : browser,
              media_support: mediaSupport,
              force_lang: forceLang,
              rewrite: rewrite,
              sync: selectedSynchronization,
              post_types: selectedPostTypes,
              taxonomies: selectedTaxonomies,
              lmat_language_switcher_options: selectedLanguageSwitchers
            };

            // Only include lmat_feedback_data if the setting is available
            if (data.lmat_feedback_data !== undefined) {
              apiBody.lmat_feedback_data = lmatFeedbackData;
            }
          case 11:
            setData(function (prev) {
              return _objectSpread(_objectSpread({}, prev), apiBody);
            });
            //API Call
            response = external_wp_apiFetch_default()({
              path: 'lmat/v1/settings',
              method: 'POST',
              'headers': {
                'Content-Type': 'application/json',
                'X-WP-Nonce': getNonce()
              },
              body: JSON.stringify(apiBody)
            }).then(function (response) {
              setData(function (prev) {
                return _objectSpread(_objectSpread({}, prev), response);
              });
            }).catch(function (error) {
              // Handle domain validation errors from backend
              if (error !== null && error !== void 0 && error.code && error !== null && error !== void 0 && error.code.includes('domain')) {
                throw new Error(error.message);
              }
              if ((error === null || error === void 0 ? void 0 : error.code) === "missing_domains" || (error === null || error === void 0 ? void 0 : error.code) === "invalid_domain_format" || (error === null || error === void 0 ? void 0 : error.code) === "duplicate_domain" || (error === null || error === void 0 ? void 0 : error.code) === "empty_domain" || (error === null || error === void 0 ? void 0 : error.code) === "invalid_language" || (error === null || error === void 0 ? void 0 : error.code) === "missing_language_domain") {
                throw new Error(error.message);
              }
              // Handle general API errors
              if (error !== null && error !== void 0 && error.message) {
                throw new Error(error.message);
              }
              throw new Error((0,external_wp_i18n_namespaceObject.__)("Something went wrong", 'linguator-multilingual-ai-translation'));
            });
            toast.promise(response, {
              loading: (0,external_wp_i18n_namespaceObject.__)('Saving Settings', 'linguator-multilingual-ai-translation'),
              success: (0,external_wp_i18n_namespaceObject.__)('Settings Saved', 'linguator-multilingual-ai-translation'),
              error: function error(_error) {
                return _error.message;
              }
            });
            setHandleButtonDisabled(true);
            _context.n = 13;
            break;
          case 12:
            _context.p = 12;
            _t2 = _context.v;
            // Handle domain validation errors
            if (_t2.message.includes((0,external_wp_i18n_namespaceObject.__)("Please enter valid URLs", "linguator-multilingual-ai-translation")) || _t2.message.includes((0,external_wp_i18n_namespaceObject.__)("Domain URL is required", "linguator-multilingual-ai-translation")) || _t2.message.includes((0,external_wp_i18n_namespaceObject.__)("Invalid URL format", "linguator-multilingual-ai-translation")) || _t2.message.includes((0,external_wp_i18n_namespaceObject.__)("Invalid domain format", "linguator-multilingual-ai-translation")) || _t2.message.includes((0,external_wp_i18n_namespaceObject.__)("Duplicate domain host", "linguator-multilingual-ai-translation")) || _t2.message.includes("domain") || _t2.message.includes("Domain")) {
              toast.error(_t2.message);
            } else if (_t2.message.includes((0,external_wp_i18n_namespaceObject.__)("Linguator was unable to access", "linguator-multilingual-ai-translation"))) {
              toast.error(_t2.message);
            } else {
              toast.error(_t2.message || (0,external_wp_i18n_namespaceObject.__)("Something went wrong", "linguator-multilingual-ai-translation"));
            }
          case 13:
            return _context.a(2);
        }
      }, _callee, null, [[1, 7, 8, 9], [0, 12]]);
    }));
    return _SaveSettings.apply(this, arguments);
  }
  var urlCheckboxes = [{
    description: (0,external_wp_i18n_namespaceObject.sprintf)((0,external_wp_i18n_namespaceObject.__)('Example1: %s/en/my-post', 'linguator-multilingual-ai-translation'), currentDomain),
    description2: (0,external_wp_i18n_namespaceObject.sprintf)((0,external_wp_i18n_namespaceObject.__)('Example2: %s/hi/my-post', 'linguator-multilingual-ai-translation'), currentDomain),
    heading: (0,external_wp_i18n_namespaceObject.__)("Different languages in directories", 'linguator-multilingual-ai-translation'),
    value: 1
  }, {
    description: (0,external_wp_i18n_namespaceObject.sprintf)((0,external_wp_i18n_namespaceObject.__)('Example1: %sen.%s/my-post', 'linguator-multilingual-ai-translation'), currentDomain.match(/^https?:\/\//)[0], currentDomain.replace(/^https?:\/\//, '')),
    description2: (0,external_wp_i18n_namespaceObject.sprintf)((0,external_wp_i18n_namespaceObject.__)('Example2: %shi.%s/my-post', 'linguator-multilingual-ai-translation'), currentDomain.match(/^https?:\/\//)[0], currentDomain.replace(/^https?:\/\//, '')),
    heading: (0,external_wp_i18n_namespaceObject.__)("The language is set from the subdomain name ", 'linguator-multilingual-ai-translation'),
    value: 2
  }, {
    description: '',
    description2: '',
    heading: (0,external_wp_i18n_namespaceObject.__)("A different domain per language", 'linguator-multilingual-ai-translation'),
    value: 3
  }];
  var directoryNamesLinks = [{
    description: (0,external_wp_i18n_namespaceObject.sprintf)((0,external_wp_i18n_namespaceObject.__)('Example: %s/en/', 'linguator-multilingual-ai-translation'), currentDomain),
    heading: (0,external_wp_i18n_namespaceObject.__)("Remove /language/ in pretty permalinks", 'linguator-multilingual-ai-translation'),
    value: true
  }, {
    description: (0,external_wp_i18n_namespaceObject.sprintf)((0,external_wp_i18n_namespaceObject.__)('Example: %s/language/en', 'linguator-multilingual-ai-translation'), currentDomain),
    heading: (0,external_wp_i18n_namespaceObject.__)("Keep /language/ in pretty permalinks", 'linguator-multilingual-ai-translation'),
    value: false
  }];
  return /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, /*#__PURE__*/external_React_default().createElement(S, {
    className: "bg-white p-10 rounded-lg",
    cols: "1",
    containerType: "grid"
  }, /*#__PURE__*/external_React_default().createElement(S, {
    className: "flex items-center"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex w-full justify-between px-4 gap-6"
  }, /*#__PURE__*/external_React_default().createElement("h1", {
    className: "font-bold"
  }, "General Settings"), /*#__PURE__*/external_React_default().createElement(R, {
    disabled: handleButtonDisabled,
    className: "",
    iconPosition: "left",
    size: "md",
    tag: "button",
    type: "button",
    onClick: SaveSettings,
    variant: "primary"
  }, (0,external_wp_i18n_namespaceObject.__)('Save Settings', 'linguator-multilingual-ai-translation')))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement(S, {
    cols: "1",
    containerType: "grid",
    className: "border border-b-2"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement(label_es_c, {
    size: "md",
    className: "font-bold flex items-center gap-2"
  }, /*#__PURE__*/external_React_default().createElement(Link, {
    className: "flex-shrink-0 size-5 text-icon-secondary"
  }), (0,external_wp_i18n_namespaceObject.__)('Language URL format', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement(label_es_c, {
    variant: "help"
  }, (0,external_wp_i18n_namespaceObject.__)('Choose how to decide which language your visitors will see.', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S, {
    cols: "2",
    containerType: "grid"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement(Ae.Group, {
    columns: 1,
    size: "sm"
  }, urlCheckboxes.map(function (checkbox, index) {
    return /*#__PURE__*/external_React_default().createElement(Ae.Button, {
      badgeItem: /*#__PURE__*/external_React_default().createElement(j, {
        className: "mr-2",
        size: "sm",
        type: "rounded",
        variant: "green"
      }),
      label: {
        heading: checkbox.heading,
        description: /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, checkbox.description, checkbox.description2 && /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, /*#__PURE__*/external_React_default().createElement("br", null), checkbox.description2))
      },
      reversePosition: true,
      value: checkbox.value,
      key: index,
      checked: forceLang === checkbox.value,
      onChange: function onChange() {
        setForceLang(checkbox.value);
      }
    });
  })), forceLang === 3 && /*#__PURE__*/external_React_default().createElement("div", {
    className: "flex flex-col gap-4"
  }, domains.map(function (domain, index) {
    return /*#__PURE__*/external_React_default().createElement(S.Item, {
      key: index
    }, /*#__PURE__*/external_React_default().createElement(label_es_c, {
      size: "sm",
      className: "font-semibold"
    }, domain.name, /*#__PURE__*/external_React_default().createElement("span", {
      style: {
        color: "red"
      }
    }, "*")), /*#__PURE__*/external_React_default().createElement(ne, {
      "aria-label": "Text Input",
      id: "input-element-".concat(index),
      size: "sm",
      type: "text",
      value: domain.value,
      onChange: function onChange(value) {
        var updatedDomains = domains.map(function (d, i) {
          if (index === i) {
            return _objectSpread(_objectSpread({}, d), {}, {
              value: value
            });
          }
          return d;
        });
        setDomains(updatedDomains);
      }
    }));
  }))), /*#__PURE__*/external_React_default().createElement(S.Item, null, forceLang !== 3 && /*#__PURE__*/external_React_default().createElement(checkbox_es_B, {
    label: {
      heading: (0,external_wp_i18n_namespaceObject.__)('Hide URL language information for default language', 'linguator-multilingual-ai-translation')
    },
    size: "sm",
    className: "cursor-pointer",
    checked: hideDefault,
    onChange: function onChange() {
      setHideDefault(!hideDefault);
    }
  }), forceLang === 1 && /*#__PURE__*/external_React_default().createElement(Ae.Group, {
    columns: 1,
    size: "sm"
  }, directoryNamesLinks.map(function (checkbox, index) {
    return /*#__PURE__*/external_React_default().createElement(Ae.Button, {
      badgeItem: /*#__PURE__*/external_React_default().createElement(j, {
        className: "mr-2",
        size: "sm",
        type: "rounded",
        variant: "green"
      }),
      label: {
        description: checkbox.description,
        heading: checkbox.heading
      },
      reversePosition: true,
      value: checkbox.value,
      key: index,
      checked: rewrite === checkbox.value,
      onChange: function onChange() {
        setRewrite(checkbox.value);
      }
    });
  }))))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement("div", {
    className: "switcher"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement("h3", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/external_React_default().createElement(Globe, {
    className: "flex-shrink-0 size-5 text-icon-secondary"
  }), (0,external_wp_i18n_namespaceObject.__)('Detect Browser Language', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("p", null, (0,external_wp_i18n_namespaceObject.__)('When visitors open your homepage, Linguator sends them to their preferred language. To avoid issues, homepage caching is turned off for supported cache plugins.', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex items-center justify-end",
    style: {
      paddingRight: '30%'
    }
  }, forceLang === 3 ? /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Switch Element",
    id: "browser-support",
    onChange: function onChange() {
      setBrowser(!browser);
    },
    disabled: true,
    value: browser,
    size: "sm"
  }) : /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Switch Element",
    id: "browser-support",
    onChange: function onChange() {
      setBrowser(!browser);
    },
    value: browser,
    size: "sm"
  }))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement("div", {
    className: "switcher"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement("h3", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/external_React_default().createElement(Focus, {
    className: "flex-shrink-0 size-5 text-icon-secondary"
  }), (0,external_wp_i18n_namespaceObject.__)('Media', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("p", null, (0,external_wp_i18n_namespaceObject.__)('Turn on media translation only if you need to translate titles, alt text, captions, or descriptions. The original file stays the same.', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex items-center justify-end",
    style: {
      paddingRight: '30%'
    }
  }, /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Switch Element",
    id: "media-support",
    onChange: function onChange() {
      setMediaSupport(!mediaSupport);
    },
    size: "sm",
    value: mediaSupport
  }))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement(S, {
    cols: "1",
    containerType: "grid"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement(label_es_c, {
    size: "md",
    className: "font-bold flex items-center gap-2"
  }, /*#__PURE__*/external_React_default().createElement(Milestone, {
    className: "flex-shrink-0 size-5 text-icon-secondary"
  }), (0,external_wp_i18n_namespaceObject.__)('Custom post types and Taxonomies', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex gap-4 flex-wrap"
  }, AvailablePostTypes.length == 0 && AvailableTaxonomies.length == 0 ? /*#__PURE__*/external_React_default().createElement("div", {
    style: {
      color: "red"
    }
  }, (0,external_wp_i18n_namespaceObject.__)('No Custom Post Types and Taxonomies Available', 'linguator-multilingual-ai-translation')) : /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, AvailablePostTypes.length > 0 && /*#__PURE__*/external_React_default().createElement("div", null, /*#__PURE__*/external_React_default().createElement("h5", null, (0,external_wp_i18n_namespaceObject.__)('Custom Post Types', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("div", {
    className: "flex gap-4 flex-wrap"
  }, AvailablePostTypes.map(function (postType, index) {
    var isDisabled = Array.isArray(disabledPostTypes) && disabledPostTypes.some(function (disabledType) {
      // Handle both string and object formats
      var postTypeKey = _typeof(disabledType) === 'object' ? disabledType.post_type_key : disabledType;
      return postTypeKey === postType.value;
    });
    return /*#__PURE__*/external_React_default().createElement(checkbox_es_B, {
      label: {
        description: '',
        heading: postType.label + (isDisabled ? ' (Programmatically Active)' : '')
      },
      className: isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      value: postType.value,
      checked: isDisabled ? true : selectedPostTypes.includes(postType.value),
      disabled: isDisabled,
      key: index,
      size: "sm",
      onChange: function onChange() {
        return handlePostTypeChange(postType.value);
      }
    });
  }))), AvailableTaxonomies.length > 0 && /*#__PURE__*/external_React_default().createElement("div", null, /*#__PURE__*/external_React_default().createElement("h5", null, (0,external_wp_i18n_namespaceObject.__)('Custom Taxonomies', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("div", {
    className: "flex gap-4 flex-wrap"
  }, AvailableTaxonomies.map(function (taxonomy, index) {
    return /*#__PURE__*/external_React_default().createElement(checkbox_es_B, {
      label: {
        description: '',
        heading: taxonomy.label
      },
      className: "cursor-pointer",
      value: taxonomy.value,
      checked: selectedTaxonomies.includes(taxonomy.value),
      key: index,
      size: "sm",
      onChange: function onChange() {
        return handleTaxonomyChange(taxonomy.value);
      }
    });
  })))))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement(S, {
    cols: "1",
    containerType: "grid"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "switcher"
  }, /*#__PURE__*/external_React_default().createElement(label_es_c, {
    size: "md",
    className: "font-bold flex items-center gap-2"
  }, /*#__PURE__*/external_React_default().createElement(RefreshCcw, {
    className: "flex-shrink-0 size-5 text-icon-secondary"
  }), (0,external_wp_i18n_namespaceObject.__)('Synchronization', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("div", {
    className: "flex items-center justify-end  gap-2",
    style: {
      paddingRight: '30%'
    }
  }, /*#__PURE__*/external_React_default().createElement(label_es_c, {
    size: "sm",
    className: "cursor-pointer",
    htmlFor: "select-all-sync"
  }, (0,external_wp_i18n_namespaceObject.__)('Select All', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Select All Synchronization",
    id: "select-all-sync",
    value: selectAllSync,
    onChange: handleSelectAllSync,
    size: "sm"
  }))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex gap-6 flex-wrap"
  }, synchronizations.map(function (synchronization, index) {
    return /*#__PURE__*/external_React_default().createElement(checkbox_es_B, {
      label: {
        description: '',
        heading: synchronization.label
      },
      className: "cursor-pointer",
      value: synchronization.value,
      key: index,
      checked: selectedSynchronization.includes(synchronization.value),
      size: "sm",
      onChange: function onChange() {
        return handleSynchronizationChange(synchronization.value);
      }
    });
  }))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement(S, {
    cols: "1",
    containerType: "grid"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "switcher"
  }, /*#__PURE__*/external_React_default().createElement(label_es_c, {
    size: "md",
    className: "font-bold flex items-center gap-2"
  }, /*#__PURE__*/external_React_default().createElement(Languages, {
    className: "flex-shrink-0 size-5 text-icon-secondary"
  }), (0,external_wp_i18n_namespaceObject.__)('Language Switcher', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex gap-6 flex-wrap"
  }, languageSwitcherOptions.map(function (switcher, index) {
    return /*#__PURE__*/external_React_default().createElement("div", {
      key: index,
      className: "flex items-center gap-2"
    }, /*#__PURE__*/external_React_default().createElement(switch_es_$, {
      "aria-label": "Switch for ".concat(switcher.label),
      id: "lmat_language_switcher_".concat(switcher.value),
      onChange: function onChange() {
        return handleLanguageSwitcherChange(switcher.value);
      },
      size: "sm",
      value: selectedLanguageSwitchers.includes(switcher.value)
    }), /*#__PURE__*/external_React_default().createElement(label_es_c, {
      htmlFor: "lmat_language_switcher_".concat(switcher.value),
      className: "cursor-pointer"
    }, switcher.label));
  }))), data.lmat_feedback_data !== undefined && /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement("div", {
    className: "switcher"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement("h3", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/external_React_default().createElement(Share2, {
    className: "flex-shrink-0 size-5 text-icon-secondary"
  }), (0,external_wp_i18n_namespaceObject.__)('Usage Data Sharing', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("p", null, (0,external_wp_i18n_namespaceObject.__)('Help us make this plugin more compatible with your site by sharing non-sensitive site data.', 'linguator-multilingual-ai-translation'), /*#__PURE__*/external_React_default().createElement("a", {
    href: "#",
    className: "lmat-see-terms",
    onClick: handleTermsToggle
  }, "[", showTerms ? 'Hide terms' : 'See terms', "]"), /*#__PURE__*/external_React_default().createElement("div", {
    id: "termsBox",
    className: "lmat-terms-box",
    style: {
      display: showTerms ? 'block' : 'none',
      paddingLeft: '20px',
      marginTop: '10px',
      fontSize: '12px',
      color: '#999'
    }
  }, /*#__PURE__*/external_React_default().createElement("p", null, (0,external_wp_i18n_namespaceObject.__)("Opt in to receive email updates about security improvements, new features, helpful tutorials, and occasional special offers. We'll collect:", 'linguator-multilingual-ai-translation'), " ", /*#__PURE__*/external_React_default().createElement("a", {
    href: "https://my.coolplugins.net/terms/usage-tracking/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Click Here")), /*#__PURE__*/external_React_default().createElement("ul", {
    style: {
      listStyleType: 'auto',
      paddingLeft: '20px'
    }
  }, /*#__PURE__*/external_React_default().createElement("li", null, (0,external_wp_i18n_namespaceObject.__)("Your website home URL and WordPress admin email.", 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("li", null, (0,external_wp_i18n_namespaceObject.__)("To check plugin compatibility, we will collect the following: list of active plugins and themes, server type, MySQL version, WordPress version, memory limit, site language and database prefix.", 'linguator-multilingual-ai-translation')))))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex items-center justify-end",
    style: {
      paddingRight: '30%'
    }
  }, /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Switch Element",
    id: "lmat_feedback_data",
    onChange: function onChange() {
      setLmatFeedbackData(!lmatFeedbackData);
    },
    size: "sm",
    value: lmatFeedbackData
  })))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement(S, {
    className: "flex items-center justify-end"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex gap-6"
  }, /*#__PURE__*/external_React_default().createElement(R, {
    disabled: handleButtonDisabled,
    className: "",
    iconPosition: "left",
    size: "md",
    tag: "button",
    type: "button",
    onClick: SaveSettings,
    variant: "primary"
  }, (0,external_wp_i18n_namespaceObject.__)('Save Settings', 'linguator-multilingual-ai-translation'))))));
};
/* harmony default export */ const components_General = (General);
;// ./Admin/Settings/Views/src/components/Sidebar.jsx
function Sidebar_extends() { return Sidebar_extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, Sidebar_extends.apply(null, arguments); }


var Sidebar = function Sidebar() {
  var _window$lmat_settings;
  // Get LocoAI plugin status from localized script data
  var locoaiStatus = ((_window$lmat_settings = window.lmat_settings) === null || _window$lmat_settings === void 0 ? void 0 : _window$lmat_settings.locoai_plugin_status) || {
    status: 'not_installed'
  };

  // Determine button text and behavior based on plugin status
  var getButtonConfig = function getButtonConfig() {
    var _window$lmat_settings2;
    switch (locoaiStatus.status) {
      case 'active':
        return {
          text: (0,external_wp_i18n_namespaceObject.__)('ACTIVATED', 'linguator-multilingual-ai-translation'),
          href: 'plugins.php',
          className: 'button button-secondary',
          disabled: false,
          target: '_self'
        };
      case 'installed':
        return {
          text: (0,external_wp_i18n_namespaceObject.__)('ACTIVATE', 'linguator-multilingual-ai-translation'),
          href: "plugins.php?_wpnonce=".concat(((_window$lmat_settings2 = window.lmat_settings) === null || _window$lmat_settings2 === void 0 ? void 0 : _window$lmat_settings2.activate_nonce) || '', "&action=activate&plugin=automatic-translator-addon-for-loco-translate/automatic-translator-addon-for-loco-translate.php"),
          className: 'button button-primary',
          disabled: false,
          target: '_self'
        };
      default:
        return {
          text: (0,external_wp_i18n_namespaceObject.__)('INSTALL', 'linguator-multilingual-ai-translation'),
          href: 'plugin-install.php?s=locoai&tab=search&type=term',
          className: 'button button-primary',
          disabled: false,
          target: '_blank'
        };
    }
  };
  var buttonConfig = getButtonConfig();
  return /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full rounded-lg"
  }, /*#__PURE__*/React.createElement(S, {
    className: "flex flex-col p-6  bg-white border border-gray-200 rounded-lg shadow-sm"
  }, /*#__PURE__*/React.createElement(S.Item, null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-gray-900 mb-2"
  }, (0,external_wp_i18n_namespaceObject.__)('Auto Translation Status', 'linguator-multilingual-ai-translation')), /*#__PURE__*/React.createElement(S.Item, {
    className: ""
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold text-gray-900 m-0"
  }, "0"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 m-0"
  }, (0,external_wp_i18n_namespaceObject.__)('Total Characters Translated!', 'linguator-multilingual-ai-translation')))), /*#__PURE__*/React.createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-gray-400 my-1"
  }), /*#__PURE__*/React.createElement(S.Item, {
    className: "w-full"
  }, /*#__PURE__*/React.createElement(S.Item, {
    className: "flex flex-col gap-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm text-gray-700 m-0"
  }, (0,external_wp_i18n_namespaceObject.__)('Total Strings', 'linguator-multilingual-ai-translation')), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-gray-900 m-0"
  }, "0")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm text-gray-700 m-0"
  }, (0,external_wp_i18n_namespaceObject.__)('Total Pages / Posts', 'linguator-multilingual-ai-translation')), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-gray-900 m-0"
  }, "0")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm text-gray-700 m-0"
  }, (0,external_wp_i18n_namespaceObject.__)('Time Taken', 'linguator-multilingual-ai-translation')), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-gray-900 m-0"
  }, "0"))))), /*#__PURE__*/React.createElement("div", {
    className: " p-6"
  }, /*#__PURE__*/React.createElement("h2", null, (0,external_wp_i18n_namespaceObject.__)('Automatically Translate Plugins & Themes', 'linguator-multilingual-ai-translation')), /*#__PURE__*/React.createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-gray-400 my-1"
  }), /*#__PURE__*/React.createElement(S.Item, {
    className: "flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-[70%]"
  }, /*#__PURE__*/React.createElement("h4", null, (0,external_wp_i18n_namespaceObject.__)('LocoAI - Auto Translation for Loco Translate', 'linguator-multilingual-ai-translation')), /*#__PURE__*/React.createElement("p", null, (0,external_wp_i18n_namespaceObject.__)('Loco Addon to translate plugins and themes', 'linguator-multilingual-ai-translation')), /*#__PURE__*/React.createElement("a", Sidebar_extends({
    href: buttonConfig.href,
    target: buttonConfig.target,
    className: buttonConfig.className
  }, buttonConfig.disabled && {
    disabled: true
  }), buttonConfig.text)), /*#__PURE__*/React.createElement("div", {
    className: "w-[30%] flex items-center object-contain p-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: "plugin-install.php?s=locoai&tab=search&type=term",
    target: "_blank"
  }, /*#__PURE__*/React.createElement("img", {
    className: "w-full h-auto  ",
    src: "".concat(window.lmat_settings_logo_data.logoUrl, "loco.png"),
    alt: "Loco translate logo"
  }))), /*#__PURE__*/React.createElement("div", null)))));
};
/* harmony default export */ const components_Sidebar = (Sidebar);
;// ./node_modules/lucide-react/dist/esm/icons/loader-pinwheel.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const loader_pinwheel_iconNode = [
  ["path", { d: "M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0", key: "1lzz15" }],
  ["path", { d: "M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6", key: "1gnrpi" }],
  ["path", { d: "M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6", key: "u9yy5q" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const LoaderPinwheel = createLucideIcon_createLucideIcon("loader-pinwheel", loader_pinwheel_iconNode);


//# sourceMappingURL=loader-pinwheel.js.map

;// ./node_modules/@bsf/force-ui/node_modules/lucide-react/dist/esm/icons/loader-circle.js
/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const LoaderCircle = createLucideIcon("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);


//# sourceMappingURL=loader-circle.js.map

;// ./node_modules/@bsf/force-ui/dist/components/loader/loader.es.js



const loader_es_d = ({
  variant: a = "primary",
  // primary, secondary
  size: e = "md",
  // sm, md, lg, xl,
  icon: s = null,
  className: m = ""
}) => {
  const i = {
    primary: "text-brand-primary-600",
    secondary: "text-background-primary"
  }[a], t = {
    sm: "[&>svg]:size-4",
    md: "[&>svg]:size-5",
    lg: "[&>svg]:size-6",
    xl: "[&>svg]:size-8"
  }[e];
  return /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(
    "span",
    {
      className: functions_es_c("flex", t, i, m),
      children: s || /* @__PURE__ */ (0,external_ReactJSXRuntime_namespaceObject.jsx)(LoaderCircle, { className: "animate-spin shrink-0" })
    }
  );
};

//# sourceMappingURL=loader.es.js.map

;// ./Admin/Settings/Views/src/components/TranslationConfig.jsx
function TranslationConfig_typeof(o) { "@babel/helpers - typeof"; return TranslationConfig_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, TranslationConfig_typeof(o); }
function TranslationConfig_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return TranslationConfig_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (TranslationConfig_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, TranslationConfig_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, TranslationConfig_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), TranslationConfig_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", TranslationConfig_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), TranslationConfig_regeneratorDefine2(u), TranslationConfig_regeneratorDefine2(u, o, "Generator"), TranslationConfig_regeneratorDefine2(u, n, function () { return this; }), TranslationConfig_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (TranslationConfig_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function TranslationConfig_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } TranslationConfig_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { TranslationConfig_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, TranslationConfig_regeneratorDefine2(e, r, n, t); }
function TranslationConfig_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function TranslationConfig_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? TranslationConfig_ownKeys(Object(t), !0).forEach(function (r) { TranslationConfig_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : TranslationConfig_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function TranslationConfig_defineProperty(e, r, t) { return (r = TranslationConfig_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function TranslationConfig_toPropertyKey(t) { var i = TranslationConfig_toPrimitive(t, "string"); return "symbol" == TranslationConfig_typeof(i) ? i : i + ""; }
function TranslationConfig_toPrimitive(t, r) { if ("object" != TranslationConfig_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != TranslationConfig_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function TranslationConfig_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function TranslationConfig_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { TranslationConfig_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { TranslationConfig_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function TranslationConfig_slicedToArray(r, e) { return TranslationConfig_arrayWithHoles(r) || TranslationConfig_iterableToArrayLimit(r, e) || TranslationConfig_unsupportedIterableToArray(r, e) || TranslationConfig_nonIterableRest(); }
function TranslationConfig_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function TranslationConfig_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return TranslationConfig_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? TranslationConfig_arrayLikeToArray(r, a) : void 0; } }
function TranslationConfig_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function TranslationConfig_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function TranslationConfig_arrayWithHoles(r) { if (Array.isArray(r)) return r; }







var ChromeLocalAINotice = function ChromeLocalAINotice() {
  var _React$useState = external_React_default().useState(false),
    _React$useState2 = TranslationConfig_slicedToArray(_React$useState, 2),
    showBrowserNotice = _React$useState2[0],
    setShowBrowserNotice = _React$useState2[1];
  var _React$useState3 = external_React_default().useState(false),
    _React$useState4 = TranslationConfig_slicedToArray(_React$useState3, 2),
    showSecureNotice = _React$useState4[0],
    setShowSecureNotice = _React$useState4[1];
  var _React$useState5 = external_React_default().useState(false),
    _React$useState6 = TranslationConfig_slicedToArray(_React$useState5, 2),
    showApiNotice = _React$useState6[0],
    setShowApiNotice = _React$useState6[1];
  external_React_default().useEffect(function () {
    var _window, _window2, _window3, _window4, _window5, _window6, _window7, _window8, _window9, _navigator, _navigator2;
    var safeBrowser = ((_window = window) === null || _window === void 0 || (_window = _window.location) === null || _window === void 0 ? void 0 : _window.protocol) === "https:";
    var browserContentSecure = (_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.isSecureContext;
    // Secure connection + API availability check
    var apiAvailable = "translation" in ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.self) && "createTranslator" in ((_window4 = window) === null || _window4 === void 0 || (_window4 = _window4.self) === null || _window4 === void 0 ? void 0 : _window4.translation) || "ai" in ((_window5 = window) === null || _window5 === void 0 ? void 0 : _window5.self) && "translator" in ((_window6 = window) === null || _window6 === void 0 || (_window6 = _window6.self) === null || _window6 === void 0 ? void 0 : _window6.ai) || "Translator" in ((_window7 = window) === null || _window7 === void 0 ? void 0 : _window7.self) && "create" in ((_window8 = window) === null || _window8 === void 0 || (_window8 = _window8.self) === null || _window8 === void 0 ? void 0 : _window8.Translator);

    // Browser check (must be Chrome, not Edge or others)
    if (!((_window9 = window) !== null && _window9 !== void 0 && _window9.hasOwnProperty("chrome")) || !((_navigator = navigator) !== null && _navigator !== void 0 && (_navigator = _navigator.userAgent) !== null && _navigator !== void 0 && _navigator.includes("Chrome")) || (_navigator2 = navigator) !== null && _navigator2 !== void 0 && (_navigator2 = _navigator2.userAgent) !== null && _navigator2 !== void 0 && _navigator2.includes("Edg")) {
      setShowBrowserNotice(true);
    } else if (!apiAvailable && !safeBrowser && !browserContentSecure) {
      setShowSecureNotice(true);
    } else if (!apiAvailable) {
      setShowApiNotice(true);
    }
  }, []);
  if (!showBrowserNotice && !showSecureNotice && !showApiNotice) {
    return null; // no notice needed
  }
  var message = '';
  var heading = '';
  if (showBrowserNotice) {
    heading = (0,external_wp_i18n_namespaceObject.__)('⚠️ Important Notice: Browser Compatibility', 'linguator-multilingual-ai-translation');
    message = "<ul className=\"list-disc ml-5 mt-2\"><li>\n                ".concat(sprintf((0,external_wp_i18n_namespaceObject.__)('The %sTranslator API%s, which uses Chrome Local AI Models, is designed exclusively for use with the %sChrome browser%s.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>', '<strong>', '</strong>'), "\n              </li>\n              <li>\n                ").concat(sprintf((0,external_wp_i18n_namespaceObject.__)('If you are using a different browser (such as Edge, Firefox, or Safari), the API may not function correctly.', 'linguator-multilingual-ai-translation')), "\n              </li>\n              <li>\n                ").concat(sprintf((0,external_wp_i18n_namespaceObject.__)('Learn more in the %sofficial documentation%s.', 'linguator-multilingual-ai-translation'), '<a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank" rel="noreferrer" class="underline text-blue-600">', '</a>'), "\n              </li>\n      </ul>");
  } else if (showSecureNotice) {
    heading = (0,external_wp_i18n_namespaceObject.__)('⚠️ Important Notice: Secure Connection Required', 'linguator-multilingual-ai-translation');
    message = "<ul className=\"list-disc ml-5 mt-2\">\n              <li>\n                ".concat(sprintf((0,external_wp_i18n_namespaceObject.__)('The %sTranslator API%s requires a secure (HTTPS) connection to function properly.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>'), "\n              </li>\n              <li>\n                ").concat((0,external_wp_i18n_namespaceObject.__)('If you are on an insecure connection (HTTP), the API will not work.', 'linguator-multilingual-ai-translation'), "\n              </li>\n            </ul>\n            <p className=\"mt-2\">").concat((0,external_wp_i18n_namespaceObject.__)('👉 How to Fix This:', 'linguator-multilingual-ai-translation'), "</p>\n            <ol className=\"list-decimal ml-5 mt-2\">\n              <li>").concat(sprintf((0,external_wp_i18n_namespaceObject.__)('Switch to a secure connection by using %s.', 'linguator-multilingual-ai-translation'), '<strong><code>https://</code></strong>'), "\n              </li>\n              <li>\n                ").concat(sprintf((0,external_wp_i18n_namespaceObject.__)('Alternatively, add this URL to Chrome’s list of insecure origins treated as secure: %s.', 'linguator-multilingual-ai-translation'), '<strong><code>chrome://flags/#unsafely-treat-insecure-origin-as-secure</code></strong>'), "\n                <br />\n                ").concat((0,external_wp_i18n_namespaceObject.__)('Copy the URL and then open a new window and paste this URL to access the settings.', 'linguator-multilingual-ai-translation'), "\n              </li>\n            </ol>");
  } else if (showApiNotice) {
    heading = (0,external_wp_i18n_namespaceObject.__)('⚠️ Important Notice: API Availability', 'linguator-multilingual-ai-translation');
    message = "<ol>\n                    <li>".concat(sprintf((0,external_wp_i18n_namespaceObject.__)('Open this URL in a new Chrome tab: %s. Copy this URL and then open a new window and paste this URL to access the settings.', 'linguator-multilingual-ai-translation'), '<strong><code>chrome://flags/#translation-api</code></strong>'), "</li>\n                    <li>").concat(sprintf((0,external_wp_i18n_namespaceObject.__)('Ensure that the %sExperimental translation API%s option is set to <strong>Enabled</strong>.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>'), "</li>\n                    <li>").concat(sprintf((0,external_wp_i18n_namespaceObject.__)('After change the setting, Click on the %sRelaunch%s button to apply the changes.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>'), "</li>\n                    <li>").concat((0,external_wp_i18n_namespaceObject.__)('The Translator AI modal should now be enabled and ready for use.', 'linguator-multilingual-ai-translation'), "</li>\n                </ol>\n                <p>").concat(sprintf((0,external_wp_i18n_namespaceObject.__)('For more information, please refer to the %sdocumentation%s.', 'linguator-multilingual-ai-translation'), '<a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">', '</a>'), "</p>   \n                <p>").concat((0,external_wp_i18n_namespaceObject.__)('If the issue persists, please ensure that your browser is up to date and restart your browser.', 'linguator-multilingual-ai-translation'), "</p>\n                <p>").concat(sprintf((0,external_wp_i18n_namespaceObject.__)('If you continue to experience issues after following the above steps, please %sopen a support ticket%s with our team. We are here to help you resolve any problems and ensure a smooth translation experience.', 'linguator-multilingual-ai-translation'), '<a href="https://my.coolplugins.net/account/support-tickets/" target="_blank" rel="noopener">', '</a>'), "</p>");
  }
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "flex flex-col gap-4 p-6 rounded-lg",
    style: {
      border: "1px solid #e5e7eb",
      background: "#fff5f5",
      margin: "0 1.5rem 1.5rem 1.5rem"
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "text-red-600 text-sm leading-6"
  }, /*#__PURE__*/external_React_default().createElement("h3", {
    className: "font-semibold"
  }, heading), /*#__PURE__*/external_React_default().createElement("div", {
    dangerouslySetInnerHTML: {
      __html: message
    }
  })));
};
var TranslationConfig = function TranslationConfig(_ref) {
  var data = _ref.data,
    setData = _ref.setData;
  var aiTranslation = data === null || data === void 0 ? void 0 : data.ai_translation_configuration; //store the media option
  var provider = aiTranslation === null || aiTranslation === void 0 ? void 0 : aiTranslation.provider;
  var _useState = (0,external_React_namespaceObject.useState)(provider === null || provider === void 0 ? void 0 : provider.google),
    _useState2 = TranslationConfig_slicedToArray(_useState, 2),
    googleMachineTranslation = _useState2[0],
    setGoogleMachineTranslation = _useState2[1];
  var _useState3 = (0,external_React_namespaceObject.useState)(provider === null || provider === void 0 ? void 0 : provider.chrome_local_ai),
    _useState4 = TranslationConfig_slicedToArray(_useState3, 2),
    chromeLocalAITranslation = _useState4[0],
    setChromeLocalAITranslation = _useState4[1];
  var _useState5 = (0,external_React_namespaceObject.useState)({
      googleMachineTranslation: googleMachineTranslation,
      chromeLocalAITranslation: chromeLocalAITranslation
    }),
    _useState6 = TranslationConfig_slicedToArray(_useState5, 2),
    lastUpdatedValue = _useState6[0],
    setLastUpdatedValue = _useState6[1];
  var _useState7 = (0,external_React_namespaceObject.useState)(true),
    _useState8 = TranslationConfig_slicedToArray(_useState7, 2),
    handleButtonDisabled = _useState8[0],
    setHandleButtonDisabled = _useState8[1];
  (0,external_React_namespaceObject.useEffect)(function () {
    var sameChecker = {
      googleMachineTranslation: true,
      chromeLocalAITranslation: true
    };
    if (googleMachineTranslation !== (provider === null || provider === void 0 ? void 0 : provider.google)) {
      sameChecker.googleMachineTranslation = false;
    }
    if (chromeLocalAITranslation !== (provider === null || provider === void 0 ? void 0 : provider.chrome_local_ai)) {
      sameChecker.chromeLocalAITranslation = false;
    }
    var flag = true;
    for (var key in sameChecker) {
      if (!sameChecker[key]) {
        flag = false;
        setHandleButtonDisabled(false);
        break;
      }
    }
    if (flag) {
      setHandleButtonDisabled(true);
    }
  }, [chromeLocalAITranslation, googleMachineTranslation]);

  //Save Setting Function 
  function SaveSettings() {
    return _SaveSettings.apply(this, arguments);
  }
  function _SaveSettings() {
    _SaveSettings = TranslationConfig_asyncToGenerator(/*#__PURE__*/TranslationConfig_regenerator().m(function _callee() {
      var apiBody, response;
      return TranslationConfig_regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            try {
              apiBody = {
                ai_translation_configuration: {
                  provider: {
                    google: googleMachineTranslation,
                    chrome_local_ai: chromeLocalAITranslation
                  }
                }
              };
              setLastUpdatedValue({
                googleMachineTranslation: googleMachineTranslation,
                chromeLocalAITranslation: chromeLocalAITranslation
              });
              if (aiTranslation && (lastUpdatedValue.googleMachineTranslation !== googleMachineTranslation || lastUpdatedValue.chromeLocalAITranslation !== chromeLocalAITranslation)) {
                setData(function (prev) {
                  return TranslationConfig_objectSpread(TranslationConfig_objectSpread({}, prev), apiBody);
                });
              }
              //API Call
              response = external_wp_apiFetch_default()({
                path: 'lmat/v1/settings',
                method: 'POST',
                'headers': {
                  'Content-Type': 'application/json',
                  'X-WP-Nonce': getNonce()
                },
                body: JSON.stringify(apiBody)
              }).then(function (response) {
                setData(function (prev) {
                  return TranslationConfig_objectSpread(TranslationConfig_objectSpread({}, prev), response);
                });
              }).catch(function (error) {
                // Handle general API errors
                if (error !== null && error !== void 0 && error.message) {
                  throw new Error(error.message);
                }
                throw new Error((0,external_wp_i18n_namespaceObject.__)("Something went wrong", 'linguator-multilingual-ai-translation'));
              });
              toast.promise(response, {
                loading: (0,external_wp_i18n_namespaceObject.__)('Saving Settings', 'linguator-multilingual-ai-translation'),
                success: (0,external_wp_i18n_namespaceObject.__)('Settings Saved', 'linguator-multilingual-ai-translation'),
                error: function error(_error) {
                  return _error.message;
                }
              });
              setHandleButtonDisabled(true);
            } catch (error) {
              // Handle domain validation errors
              if (error.message.includes((0,external_wp_i18n_namespaceObject.__)("Linguator was unable to access", "linguator-multilingual-ai-translation"))) {
                toast.error(error.message);
              } else {
                toast.error(error.message || (0,external_wp_i18n_namespaceObject.__)("Something went wrong", "linguator-multilingual-ai-translation"));
              }
            }
          case 1:
            return _context.a(2);
        }
      }, _callee);
    }));
    return _SaveSettings.apply(this, arguments);
  }
  return /*#__PURE__*/external_React_default().createElement(S, {
    className: "bg-white p-10 rounded-lg",
    cols: "1",
    containerType: "grid"
  }, /*#__PURE__*/external_React_default().createElement(S, {
    className: "flex items-center"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex w-full justify-between px-4 gap-6"
  }, /*#__PURE__*/external_React_default().createElement("h1", {
    className: "font-bold"
  }, (0,external_wp_i18n_namespaceObject.__)('Translation Settings', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement(R, {
    disabled: handleButtonDisabled,
    className: "",
    iconPosition: "left",
    size: "md",
    tag: "button",
    type: "button",
    onClick: SaveSettings,
    variant: "primary"
  }, (0,external_wp_i18n_namespaceObject.__)('Save Settings', 'linguator-multilingual-ai-translation')))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "p-6 rounded-lg",
    style: {
      border: "1px solid #e5e7eb"
    }
  }, /*#__PURE__*/external_React_default().createElement(label_es_c, {
    size: "md",
    className: "font-bold flex items-center gap-2"
  }, /*#__PURE__*/external_React_default().createElement(Languages, {
    className: "flex-shrink-0 size-5 text-icon-secondary"
  }), (0,external_wp_i18n_namespaceObject.__)('Service Provider', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement(label_es_c, {
    variant: "help"
  }, (0,external_wp_i18n_namespaceObject.__)('Select at least one translation service provider below. You can enable multiple providers and choose the one that best fits your needs.', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("div", {
    className: "flex flex-col gap-2",
    style: {
      marginTop: "20px"
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    style: {
      backgroundColor: "#fbfbfb"
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "switcher p-6 rounded-lg"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement("h3", {
    className: "flex items-center gap-2"
  }, (0,external_wp_i18n_namespaceObject.__)('Google Machine Translation', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("p", null, (0,external_wp_i18n_namespaceObject.__)('Google Machine Translation uses the Google Translate API to translate text.', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex items-center justify-end",
    style: {
      paddingRight: '30%'
    }
  }, /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Switch Element",
    id: "google-machine-translation",
    onChange: function onChange() {
      setGoogleMachineTranslation(!googleMachineTranslation);
    },
    value: googleMachineTranslation,
    size: "sm"
  })))), /*#__PURE__*/external_React_default().createElement("div", {
    style: {
      backgroundColor: "#fbfbfb"
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "switcher p-6 rounded-lg"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement("h3", {
    className: "flex items-center gap-2"
  }, (0,external_wp_i18n_namespaceObject.__)('Chrome Local AI Translation', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("p", null, (0,external_wp_i18n_namespaceObject.__)('Chrome Local AI Translation uses Chrome Local AI API to translate text.', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex items-center justify-end",
    style: {
      paddingRight: '30%'
    }
  }, /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Switch Element",
    id: "chrome-local-ai-translation",
    onChange: function onChange() {
      setChromeLocalAITranslation(!chromeLocalAITranslation);
    },
    value: chromeLocalAITranslation,
    size: "sm"
  }))), chromeLocalAITranslation && /*#__PURE__*/external_React_default().createElement(ChromeLocalAINotice, null)))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement(S, {
    className: "flex items-center justify-end"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex gap-6"
  }, /*#__PURE__*/external_React_default().createElement(R, {
    disabled: handleButtonDisabled,
    className: "",
    iconPosition: "left",
    size: "md",
    tag: "button",
    type: "button",
    onClick: SaveSettings,
    variant: "primary"
  }, (0,external_wp_i18n_namespaceObject.__)('Save Settings', 'linguator-multilingual-ai-translation')))));
};
/* harmony default export */ const components_TranslationConfig = (TranslationConfig);
;// ./node_modules/lucide-react/dist/esm/icons/settings.js
/**
 * @license lucide-react v0.524.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const settings_iconNode = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon_createLucideIcon("settings", settings_iconNode);


//# sourceMappingURL=settings.js.map

;// ./Settings/Views/src/components/Switcher.jsx
function Switcher_typeof(o) { "@babel/helpers - typeof"; return Switcher_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Switcher_typeof(o); }
function Switcher_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return Switcher_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (Switcher_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, Switcher_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, Switcher_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), Switcher_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", Switcher_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), Switcher_regeneratorDefine2(u), Switcher_regeneratorDefine2(u, o, "Generator"), Switcher_regeneratorDefine2(u, n, function () { return this; }), Switcher_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (Switcher_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function Switcher_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } Switcher_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { Switcher_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, Switcher_regeneratorDefine2(e, r, n, t); }
function Switcher_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Switcher_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Switcher_ownKeys(Object(t), !0).forEach(function (r) { Switcher_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Switcher_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function Switcher_defineProperty(e, r, t) { return (r = Switcher_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Switcher_toPropertyKey(t) { var i = Switcher_toPrimitive(t, "string"); return "symbol" == Switcher_typeof(i) ? i : i + ""; }
function Switcher_toPrimitive(t, r) { if ("object" != Switcher_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Switcher_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Switcher_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function Switcher_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { Switcher_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { Switcher_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function Switcher_slicedToArray(r, e) { return Switcher_arrayWithHoles(r) || Switcher_iterableToArrayLimit(r, e) || Switcher_unsupportedIterableToArray(r, e) || Switcher_nonIterableRest(); }
function Switcher_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function Switcher_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return Switcher_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Switcher_arrayLikeToArray(r, a) : void 0; } }
function Switcher_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function Switcher_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function Switcher_arrayWithHoles(r) { if (Array.isArray(r)) return r; }







var Switcher = function Switcher(_ref) {
  var data = _ref.data,
    setData = _ref.setData;
  var switcherSettings = data === null || data === void 0 ? void 0 : data.switcher_configuration; //store the switcher option
  var widgets = switcherSettings === null || switcherSettings === void 0 ? void 0 : switcherSettings.widgets;
  var _useState = (0,external_React_namespaceObject.useState)(widgets === null || widgets === void 0 ? void 0 : widgets.default),
    _useState2 = Switcher_slicedToArray(_useState, 2),
    defaultWidget = _useState2[0],
    setDefaultWidget = _useState2[1];
  var _useState3 = (0,external_React_namespaceObject.useState)(widgets === null || widgets === void 0 ? void 0 : widgets.block),
    _useState4 = Switcher_slicedToArray(_useState3, 2),
    blockWidget = _useState4[0],
    setBlockWidget = _useState4[1];
  var _useState5 = (0,external_React_namespaceObject.useState)(widgets === null || widgets === void 0 ? void 0 : widgets.elementor),
    _useState6 = Switcher_slicedToArray(_useState5, 2),
    elementorWidget = _useState6[0],
    setElementorWidget = _useState6[1];
  var _useState7 = (0,external_React_namespaceObject.useState)({
      defaultWidget: defaultWidget,
      blockWidget: blockWidget,
      elementorWidget: elementorWidget
    }),
    _useState8 = Switcher_slicedToArray(_useState7, 2),
    lastUpdatedValue = _useState8[0],
    setLastUpdatedValue = _useState8[1];
  var _useState9 = (0,external_React_namespaceObject.useState)(true),
    _useState0 = Switcher_slicedToArray(_useState9, 2),
    handleButtonDisabled = _useState0[0],
    setHandleButtonDisabled = _useState0[1];
  (0,external_React_namespaceObject.useEffect)(function () {
    var sameChecker = {
      defaultWidget: true,
      blockWidget: true,
      elementorWidget: true
    };
    if (defaultWidget !== (widgets === null || widgets === void 0 ? void 0 : widgets.default)) {
      sameChecker.defaultWidget = false;
    }
    if (blockWidget !== (widgets === null || widgets === void 0 ? void 0 : widgets.block)) {
      sameChecker.blockWidget = false;
    }
    if (elementorWidget !== (widgets === null || widgets === void 0 ? void 0 : widgets.elementor)) {
      sameChecker.elementorWidget = false;
    }
    var flag = true;
    for (var key in sameChecker) {
      if (!sameChecker[key]) {
        flag = false;
        setHandleButtonDisabled(false);
        break;
      }
    }
    if (flag) {
      setHandleButtonDisabled(true);
    }
  }, [defaultWidget, blockWidget, elementorWidget]);

  //Save Setting Function 
  function SaveSettings() {
    return _SaveSettings.apply(this, arguments);
  }
  function _SaveSettings() {
    _SaveSettings = Switcher_asyncToGenerator(/*#__PURE__*/Switcher_regenerator().m(function _callee() {
      var apiBody, response;
      return Switcher_regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            try {
              apiBody = {
                switcher_configuration: {
                  widgets: {
                    default: defaultWidget,
                    block: blockWidget,
                    elementor: elementorWidget
                  }
                }
              };
              setLastUpdatedValue({
                defaultWidget: defaultWidget,
                blockWidget: blockWidget,
                elementorWidget: elementorWidget
              });
              if (switcherSettings && (lastUpdatedValue.defaultWidget !== defaultWidget || lastUpdatedValue.blockWidget !== blockWidget || lastUpdatedValue.elementorWidget !== elementorWidget)) {
                setData(function (prev) {
                  return Switcher_objectSpread(Switcher_objectSpread({}, prev), apiBody);
                });
              }
              //API Call
              response = external_wp_apiFetch_default()({
                path: 'lmat/v1/settings',
                method: 'POST',
                'headers': {
                  'Content-Type': 'application/json',
                  'X-WP-Nonce': getNonce()
                },
                body: JSON.stringify(apiBody)
              }).then(function (response) {
                setData(function (prev) {
                  return Switcher_objectSpread(Switcher_objectSpread({}, prev), response);
                });
              }).catch(function (error) {
                // Handle general API errors
                if (error !== null && error !== void 0 && error.message) {
                  throw new Error(error.message);
                }
                throw new Error((0,external_wp_i18n_namespaceObject.__)("Something went wrong", 'linguator-multilingual-ai-translation'));
              });
              toast.promise(response, {
                loading: (0,external_wp_i18n_namespaceObject.__)('Saving Settings', 'linguator-multilingual-ai-translation'),
                success: (0,external_wp_i18n_namespaceObject.__)('Settings Saved', 'linguator-multilingual-ai-translation'),
                error: function error(_error) {
                  return _error.message;
                }
              });
              setHandleButtonDisabled(true);
            } catch (error) {
              // Handle domain validation errors
              if (error.message.includes((0,external_wp_i18n_namespaceObject.__)("Linguator was unable to access", "linguator-multilingual-ai-translation"))) {
                toast.error(error.message);
              } else {
                toast.error(error.message || (0,external_wp_i18n_namespaceObject.__)("Something went wrong", "linguator-multilingual-ai-translation"));
              }
            }
          case 1:
            return _context.a(2);
        }
      }, _callee);
    }));
    return _SaveSettings.apply(this, arguments);
  }
  return /*#__PURE__*/external_React_default().createElement(S, {
    className: "bg-white p-10 rounded-lg",
    cols: "1",
    containerType: "grid"
  }, /*#__PURE__*/external_React_default().createElement(S, {
    className: "flex items-center"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex w-full justify-between px-4 gap-6"
  }, /*#__PURE__*/external_React_default().createElement("h1", {
    className: "font-bold"
  }, (0,external_wp_i18n_namespaceObject.__)('Switcher Settings', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement(R, {
    disabled: handleButtonDisabled,
    className: "",
    iconPosition: "left",
    size: "md",
    tag: "button",
    type: "button",
    onClick: SaveSettings,
    variant: "primary"
  }, (0,external_wp_i18n_namespaceObject.__)('Save Settings', 'linguator-multilingual-ai-translation')))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "p-6 rounded-lg",
    style: {
      border: "1px solid #e5e7eb"
    }
  }, /*#__PURE__*/external_React_default().createElement(label_es_c, {
    size: "md",
    className: "font-bold flex items-center gap-2"
  }, /*#__PURE__*/external_React_default().createElement(Settings, {
    className: "flex-shrink-0 size-5 text-icon-secondary"
  }), (0,external_wp_i18n_namespaceObject.__)('Widget Types', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement(label_es_c, {
    variant: "help"
  }, (0,external_wp_i18n_namespaceObject.__)('Enable or disable different types of language switcher widgets. You can enable multiple widget types to provide different options for displaying the language switcher.', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("div", {
    className: "flex flex-col gap-2",
    style: {
      marginTop: "20px"
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    style: {
      backgroundColor: "#fbfbfb"
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "switcher p-6 rounded-lg"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement("h3", {
    className: "flex items-center gap-2"
  }, (0,external_wp_i18n_namespaceObject.__)('Default Widget', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("p", null, (0,external_wp_i18n_namespaceObject.__)('Standard language switcher widget that can be added to widget areas and sidebars.', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex items-center justify-end",
    style: {
      paddingRight: '30%'
    }
  }, /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Switch Element",
    id: "default-widget",
    onChange: function onChange() {
      setDefaultWidget(!defaultWidget);
    },
    value: defaultWidget,
    size: "sm"
  })))), /*#__PURE__*/external_React_default().createElement("div", {
    style: {
      backgroundColor: "#fbfbfb"
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "switcher p-6 rounded-lg"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement("h3", {
    className: "flex items-center gap-2"
  }, (0,external_wp_i18n_namespaceObject.__)('Block Widget', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("p", null, (0,external_wp_i18n_namespaceObject.__)('Gutenberg block widget for the block editor, compatible with modern WordPress themes.', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex items-center justify-end",
    style: {
      paddingRight: '30%'
    }
  }, /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Switch Element",
    id: "block-widget",
    onChange: function onChange() {
      setBlockWidget(!blockWidget);
    },
    value: blockWidget,
    size: "sm"
  })))), /*#__PURE__*/external_React_default().createElement("div", {
    style: {
      backgroundColor: "#fbfbfb"
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "switcher p-6 rounded-lg"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, null, /*#__PURE__*/external_React_default().createElement("h3", {
    className: "flex items-center gap-2"
  }, (0,external_wp_i18n_namespaceObject.__)('Elementor Widget', 'linguator-multilingual-ai-translation')), /*#__PURE__*/external_React_default().createElement("p", null, (0,external_wp_i18n_namespaceObject.__)('Specialized widget for Elementor page builder with enhanced styling and customization options.', 'linguator-multilingual-ai-translation'))), /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex items-center justify-end",
    style: {
      paddingRight: '30%'
    }
  }, /*#__PURE__*/external_React_default().createElement(switch_es_$, {
    "aria-label": "Switch Element",
    id: "elementor-widget",
    onChange: function onChange() {
      setElementorWidget(!elementorWidget);
    },
    value: elementorWidget,
    size: "sm"
  })))))), /*#__PURE__*/external_React_default().createElement("hr", {
    className: "w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle"
  }), /*#__PURE__*/external_React_default().createElement(S, {
    className: "flex items-center justify-end"
  }, /*#__PURE__*/external_React_default().createElement(S.Item, {
    className: "flex gap-6"
  }, /*#__PURE__*/external_React_default().createElement(R, {
    disabled: handleButtonDisabled,
    className: "",
    iconPosition: "left",
    size: "md",
    tag: "button",
    type: "button",
    onClick: SaveSettings,
    variant: "primary"
  }, (0,external_wp_i18n_namespaceObject.__)('Save Settings', 'linguator-multilingual-ai-translation')))));
};
/* harmony default export */ const components_Switcher = (Switcher);
;// ./Settings/Views/src/components/MainComponent.jsx
function MainComponent_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return MainComponent_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (MainComponent_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, MainComponent_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, MainComponent_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), MainComponent_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", MainComponent_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), MainComponent_regeneratorDefine2(u), MainComponent_regeneratorDefine2(u, o, "Generator"), MainComponent_regeneratorDefine2(u, n, function () { return this; }), MainComponent_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (MainComponent_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function MainComponent_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } MainComponent_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { MainComponent_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, MainComponent_regeneratorDefine2(e, r, n, t); }
function MainComponent_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function MainComponent_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { MainComponent_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { MainComponent_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function MainComponent_slicedToArray(r, e) { return MainComponent_arrayWithHoles(r) || MainComponent_iterableToArrayLimit(r, e) || MainComponent_unsupportedIterableToArray(r, e) || MainComponent_nonIterableRest(); }
function MainComponent_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function MainComponent_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return MainComponent_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? MainComponent_arrayLikeToArray(r, a) : void 0; } }
function MainComponent_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function MainComponent_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function MainComponent_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
//This page is the main ruter from where which tab->Components is mapped










//Component mapper for settings page
var ComponentSelector = function ComponentSelector(_ref) {
  var currentPage = _ref.currentPage,
    data = _ref.data,
    setData = _ref.setData;
  if (currentPage === 'general') return /*#__PURE__*/external_React_default().createElement(components_General, {
    data: data,
    setData: setData
  });
  if (currentPage === 'translation') return /*#__PURE__*/external_React_default().createElement(components_TranslationConfig, {
    data: data,
    setData: setData
  });
  if (currentPage === 'switcher') return /*#__PURE__*/external_React_default().createElement(components_Switcher, {
    data: data,
    setData: setData
  });
};
var MainComponent = function MainComponent(_ref2) {
  var currentPage = _ref2.currentPage;
  var _React$useState = external_React_default().useState({}),
    _React$useState2 = MainComponent_slicedToArray(_React$useState, 2),
    data = _React$useState2[0],
    setData = _React$useState2[1]; //General Settings data
  var _React$useState3 = external_React_default().useState(true),
    _React$useState4 = MainComponent_slicedToArray(_React$useState3, 2),
    loading = _React$useState4[0],
    setLoading = _React$useState4[1]; //Loading state tracker
  external_React_default().useEffect(function () {
    function serverCall() {
      return _serverCall.apply(this, arguments);
    }
    function _serverCall() {
      _serverCall = MainComponent_asyncToGenerator(/*#__PURE__*/MainComponent_regenerator().m(function _callee() {
        var responseData;
        return MainComponent_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return external_wp_apiFetch_default()({
                path: 'lmat/v1/settings',
                method: 'GET',
                'headers': {
                  'Content-Type': 'application/json',
                  'X-WP-Nonce': getNonce()
                }
              });
            case 1:
              responseData = _context.v;
              setData(responseData);
              setLoading(false);
            case 2:
              return _context.a(2);
          }
        }, _callee);
      }));
      return _serverCall.apply(this, arguments);
    }
    serverCall();
  }, []);
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "md:flex gap-8"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "md:w-[75%]"
  }, loading ? /*#__PURE__*/external_React_default().createElement("div", {
    className: "flex justify-center gap-4 items-center min-h-[100vh]"
  }, /*#__PURE__*/external_React_default().createElement("h1", null, /*#__PURE__*/external_React_default().createElement(loader_es_d, {
    className: "",
    icon: /*#__PURE__*/external_React_default().createElement(LoaderPinwheel, {
      className: "animate-spin"
    }),
    size: "md",
    variant: "primary"
  })), " ", /*#__PURE__*/external_React_default().createElement("h1", {
    className: "m-0"
  }, (0,external_wp_i18n_namespaceObject.__)("Loading", "linguator-multilingual-ai-translation"))) : /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, /*#__PURE__*/external_React_default().createElement(ComponentSelector, {
    currentPage: currentPage,
    data: data,
    setData: setData
  }))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "md:w-[25%] mt-4 w-full "
  }, /*#__PURE__*/external_React_default().createElement(components_Sidebar, null)));
};
/* harmony default export */ const components_MainComponent = (MainComponent);
;// ./Admin/Settings/Views/src/pages/SettingPage.jsx
function SettingPage_slicedToArray(r, e) { return SettingPage_arrayWithHoles(r) || SettingPage_iterableToArrayLimit(r, e) || SettingPage_unsupportedIterableToArray(r, e) || SettingPage_nonIterableRest(); }
function SettingPage_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function SettingPage_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return SettingPage_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? SettingPage_arrayLikeToArray(r, a) : void 0; } }
function SettingPage_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function SettingPage_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function SettingPage_arrayWithHoles(r) { if (Array.isArray(r)) return r; }




var getCurrentTab = function getCurrentTab() {
  var url = new URL(window.location);
  var tab = url.searchParams.get("tab");
  if (tab && '' !== tab) {
    return tab;
  }
  return 'general';
};
var SettingPage = function SettingPage() {
  var _React$useState = external_React_default().useState(getCurrentTab()),
    _React$useState2 = SettingPage_slicedToArray(_React$useState, 2),
    currentPage = _React$useState2[0],
    setCurrentPage = _React$useState2[1];
  var updateTabParameter = function updateTabParameter(newValue) {
    var url = new URL(window.location);

    // Check if "tab" exists
    if (url.searchParams.has("tab")) {
      // Update its value
      url.searchParams.set("tab", newValue);
    } else {
      // Add it if missing
      url.searchParams.append("tab", newValue);
    }

    // Push the updated URL without reloading
    window.history.replaceState({}, '', url);
  };
  var handleTabClick = function handleTabClick(e) {
    var tabBtn = e.target.classList.contains('lmat-settings-header-tab') ? e.target : e.target.closest('.lmat-settings-header-tab');
    var activeTab = document.querySelector('.lmat-settings-header-tab.active');
    if (tabBtn.classList.contains('active')) {
      return;
    }
    activeTab && activeTab.classList.remove('active');
    tabBtn.classList.add('active');
    var tab = tabBtn.dataset.tab;
    updateTabParameter(tab);
    setCurrentPage(tab);
  };
  (0,external_React_namespaceObject.useEffect)(function () {
    var tabs = document.querySelectorAll('.lmat-settings-header-tab:not([data-link="true"])');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', handleTabClick);
    });
    return function () {
      tabs.forEach(function (tab) {
        tab.removeEventListener('click', handleTabClick);
      });
    };
  }, []);
  return /*#__PURE__*/external_React_default().createElement("div", null, /*#__PURE__*/external_React_default().createElement(Toaster, {
    richColors: true,
    position: "top-right"
  }), /*#__PURE__*/external_React_default().createElement(components_MainComponent, {
    currentPage: currentPage
  }));
};
/* harmony default export */ const pages_SettingPage = (SettingPage);
;// external ["wp","domReady"]
const external_wp_domReady_namespaceObject = window["wp"]["domReady"];
// EXTERNAL MODULE: ./node_modules/react-dom/client.js
var client = __webpack_require__(338);
;// ./Admin/Settings/Views/src/settings.js




//Settings Page Component
var SettingsPage = function SettingsPage() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(pages_SettingPage, null));
};
external_wp_domReady_namespaceObject(function () {
  var element = document.getElementById('lmat-settings');
  if (element) {
    var root = (0,client/* createRoot */.H)(element);
    root.render(/*#__PURE__*/React.createElement(SettingsPage, null));
  }
});
/******/ })()
;