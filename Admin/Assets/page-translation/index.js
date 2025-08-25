/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./modules/page-translation/src/AllowedMetafileds.js":
/*!***********************************************************!*\
  !*** ./modules/page-translation/src/AllowedMetafileds.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const AllowedMetaFields = {
  '_yoast_wpseo_title': {
    type: 'string'
  },
  '_yoast_wpseo_focuskw': {
    type: 'string'
  },
  '_yoast_wpseo_metadesc': {
    type: 'string'
  },
  '_yoast_wpseo_bctitle': {
    type: 'string'
  },
  '_yoast_wpseo_opengraph-title': {
    type: 'string'
  },
  '_yoast_wpseo_opengraph-description': {
    type: 'string'
  },
  '_yoast_wpseo_twitter-title': {
    type: 'string'
  },
  '_yoast_wpseo_twitter-description': {
    type: 'string'
  },
  'rank_math_title': {
    type: 'string'
  },
  'rank_math_description': {
    type: 'string'
  },
  'rank_math_focus_keyword': {
    type: 'string'
  },
  'rank_math_facebook_title': {
    type: 'string'
  },
  'rank_math_facebook_description': {
    type: 'string'
  },
  'rank_math_twitter_title': {
    type: 'string'
  },
  'rank_math_twitter_description': {
    type: 'string'
  },
  'rank_math_breadcrumb_title': {
    type: 'string'
  },
  '_seopress_titles_title': {
    type: 'string'
  },
  '_seopress_titles_desc': {
    type: 'string'
  },
  '_seopress_social_fb_title': {
    type: 'string'
  },
  '_seopress_social_fb_desc': {
    type: 'string'
  },
  '_seopress_social_twitter_title': {
    type: 'string'
  },
  '_seopress_social_twitter_desc': {
    type: 'string'
  },
  '_seopress_analysis_target_kw': {
    type: 'string'
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AllowedMetaFields);

/***/ }),

/***/ "./modules/page-translation/src/FetchPost/Elementor/index.js":
/*!*******************************************************************!*\
  !*** ./modules/page-translation/src/FetchPost/Elementor/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _AllowedMetafileds_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../AllowedMetafileds.js */ "./modules/page-translation/src/AllowedMetafileds.js");
/* harmony import */ var _storeSourceString_Elementor_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../storeSourceString/Elementor/index.js */ "./modules/page-translation/src/storeSourceString/Elementor/index.js");




// Update allowed meta fields
const updateAllowedMetaFields = data => {
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-lmatMachineTranslate/translate').allowedMetaFields(data);
};
const fetchPostContent = async props => {
  const elementorPostData = lmatPageTranslationGlobal.elementorData && typeof lmatPageTranslationGlobal.elementorData === 'string' ? JSON.parse(lmatPageTranslationGlobal.elementorData) : lmatPageTranslationGlobal.elementorData;
  const metaFields = lmatPageTranslationGlobal?.metaFields;
  const content = {
    widgetsContent: elementorPostData,
    metaFields: metaFields
  };

  // Update allowed meta fields
  Object.keys(_AllowedMetafileds_js__WEBPACK_IMPORTED_MODULE_1__["default"]).forEach(key => {
    updateAllowedMetaFields({
      id: key,
      type: _AllowedMetafileds_js__WEBPACK_IMPORTED_MODULE_1__["default"][key].type
    });
  });
  (0,_storeSourceString_Elementor_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(content);
  props.refPostData(content);
  props.updatePostDataFetch(true);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchPostContent);

/***/ }),

/***/ "./modules/page-translation/src/FetchPost/Gutenberg/index.js":
/*!*******************************************************************!*\
  !*** ./modules/page-translation/src/FetchPost/Gutenberg/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _storeSourceString_Gutenberg_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../storeSourceString/Gutenberg/index.js */ "./modules/page-translation/src/storeSourceString/Gutenberg/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _AllowedMetafileds_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../AllowedMetafileds.js */ "./modules/page-translation/src/AllowedMetafileds.js");





const GutenbergPostFetch = async props => {
  const apiUrl = lmatPageTranslationGlobal.ajax_url;
  let blockRules = {};

  // Update allowed meta fields
  const updateAllowedMetaFields = data => {
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-lmatMachineTranslate/translate').allowedMetaFields(data);
  };

  // Update ACF fields allowed meta fields
  const AcfFields = () => {
    const postMetaSync = lmatPageTranslationGlobal.postMetaSync === 'true';
    if (window.acf && !postMetaSync) {
      const allowedTypes = ['text', 'textarea', 'wysiwyg'];
      acf.getFields().forEach(field => {
        if (field.data && allowedTypes.includes(field.data.type)) {
          updateAllowedMetaFields({
            id: field.data.key,
            type: field.data.type
          });
        }
      });
    }
  };

  // Update allowed meta fields
  Object.keys(_AllowedMetafileds_js__WEBPACK_IMPORTED_MODULE_4__["default"]).forEach(key => {
    updateAllowedMetaFields({
      id: key,
      type: _AllowedMetafileds_js__WEBPACK_IMPORTED_MODULE_4__["default"][key].type
    });
  });

  // Update ACF fields allowed meta fields
  AcfFields();
  const blockRulesApiSendData = {
    lmat_fetch_block_rules_key: lmatPageTranslationGlobal.fetchBlockRulesNonce,
    action: lmatPageTranslationGlobal.action_block_rules
  };
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(blockRulesApiSendData)
  }).then(response => response.json()).then(data => {
    blockRules = JSON.parse(data.data.blockRules);
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-lmatMachineTranslate/translate').setBlockRules(blockRules);
  }).catch(error => {
    console.error('Error fetching post content:', error);
  });

  /**
   * Prepare data to send in API request.
   */
  const apiSendData = {
    postId: parseInt(props.postId),
    local: props.targetLang,
    current_local: props.sourceLang,
    lmat_page_translation_nonce: lmatPageTranslationGlobal.ajax_nonce,
    action: lmatPageTranslationGlobal.action_fetch
  };

  /**
   * useEffect hook to fetch post data from the specified API endpoint.
   * Parses the response data and updates the state accordingly.
   * Handles errors in fetching post content.
   */
  // useEffect(() => {
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(apiSendData)
  }).then(response => response.json()).then(data => {
    const post_data = data.data;
    if (post_data.content && post_data.content.trim() !== '') {
      post_data.content = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.parse)(post_data.content);
    }
    (0,_storeSourceString_Gutenberg_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(post_data, blockRules);
    props.refPostData(post_data);
    props.updatePostDataFetch(true);
  }).catch(error => {
    console.error('Error fetching post content:', error);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GutenbergPostFetch);

/***/ }),

/***/ "./modules/page-translation/src/component/CopyClipboard/index.js":
/*!***********************************************************************!*\
  !*** ./modules/page-translation/src/component/CopyClipboard/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const CopyClipboard = async ({
  text = false,
  startCopyStatus = () => {},
  endCopyStatus = () => {}
}) => {
  if (!text || text === "") return;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback method if Clipboard API is not supported
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      if (document.execCommand) {
        document.execCommand('copy');
      }
      document.body.removeChild(textArea);
    }
    startCopyStatus();
    setTimeout(() => endCopyStatus(), 800); // Reset to "Copy" after 2 seconds
  } catch (err) {
    console.error('Error copying text to clipboard:', err);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CopyClipboard);

/***/ }),

/***/ "./modules/page-translation/src/component/ErrorModalBox/index.js":
/*!***********************************************************************!*\
  !*** ./modules/page-translation/src/component/ErrorModalBox/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CopyClipboard_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../CopyClipboard/index.js */ "./modules/page-translation/src/component/CopyClipboard/index.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");



const ErrorModalBox = ({
  message,
  onClose,
  Title
}) => {
  let dummyElement = jQuery('<div>').append(message);
  const stringifiedMessage = dummyElement.html();
  dummyElement.remove();
  dummyElement = null;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const clipboardElements = document.querySelectorAll('.chrome-ai-translator-flags');
    if (clipboardElements.length > 0) {
      clipboardElements.forEach(element => {
        element.classList.add('lmat-page-translation-tooltip-element');
        element.addEventListener('click', e => {
          e.preventDefault();
          const toolTipExists = element.querySelector('.lmat-page-translation-tooltip');
          if (toolTipExists) {
            return;
          }
          let toolTipElement = document.createElement('span');
          toolTipElement.textContent = "Text to be copied.";
          toolTipElement.className = 'lmat-page-translation-tooltip';
          element.appendChild(toolTipElement);
          (0,_CopyClipboard_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
            text: element.getAttribute('data-clipboard-text'),
            startCopyStatus: () => {
              toolTipElement.classList.add('lmat-page-translation-tooltip-active');
            },
            endCopyStatus: () => {
              setTimeout(() => {
                toolTipElement.remove();
              }, 800);
            }
          });
        });
      });
      return () => {
        clipboardElements.forEach(element => {
          element.removeEventListener('click', () => {});
        });
      };
    }
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "lmat-page-translation-error-modal-box-container",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "lmat-page-translation-error-modal-box",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "lmat-page-translation-error-modal-box-header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "lmat-page-translation-error-modal-box-close",
          onClick: onClose,
          children: "\xD7"
        }), Title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
          children: Title
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "lmat-page-translation-error-modal-box-body",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          dangerouslySetInnerHTML: {
            __html: stringifiedMessage
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "lmat-page-translation-error-modal-box-footer",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          className: "lmat-page-translation-error-modal-box-close button button-primary",
          onClick: onClose,
          children: "Close"
        })
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorModalBox);

/***/ }),

/***/ "./modules/page-translation/src/component/FilterNestedAttr/index.js":
/*!**************************************************************************!*\
  !*** ./modules/page-translation/src/component/FilterNestedAttr/index.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const FilterBlockNestedAttr = (idsArr, attrObj, blockAttr, callBack) => {
  /**
   * Iterates over the keys of the filter object and calls saveTranslatedAttr for each key.
   * 
   * @param {Array} idArr - The array of IDs.
   * @param {Object} filterObj - The filter object to iterate over.
   */
  const childAttr = (idArr, filterObj) => {
    Object.keys(filterObj).map(key => {
      let filterObjType = filterObj;
      filterObjType = filterObjType[key];
      const newIdArr = new Array(...idArr, key);
      callBack(newIdArr, filterObjType);
    });
  };

  /**
   * Handles the attributes that are arrays and objects by recursively calling saveTranslatedAttr.
   * 
   * @param {Array} idArr - The array of IDs.
   * @param {Array} attrFilter - The filter attribute array.
   */
  const childAttrArray = (idArr, attrFilter) => {
    const newIdArr = new Array(...idArr);
    let dynamicBlockAttr = blockAttr;
    newIdArr.forEach(key => {
      dynamicBlockAttr = dynamicBlockAttr[key];
    });
    if ([null, undefined].includes(dynamicBlockAttr)) {
      return;
    }
    if (Object.getPrototypeOf(dynamicBlockAttr) === Object.prototype) {
      childAttr(idArr, attrFilter[0]);
      return;
    }
    if (Object.getPrototypeOf(dynamicBlockAttr) === Array.prototype) {
      dynamicBlockAttr.forEach((_, index) => {
        const nestedId = new Array();
        newIdArr.forEach(key => {
          nestedId.push(key);
        });
        nestedId.push(index);
        callBack(nestedId, attrFilter[0]);
      });
    }
    if (typeof dynamicBlockAttr === 'object') {
      childAttr(idArr, attrFilter[0]);
      return;
    }
  };
  const typeCheck = () => {
    if (Object.getPrototypeOf(attrObj) === Array.prototype) {
      childAttrArray(idsArr, attrObj);
    } else if (Object.getPrototypeOf(attrObj) === Object.prototype) {
      childAttr(idsArr, attrObj);
    }
  };
  typeCheck();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FilterBlockNestedAttr);

/***/ }),

/***/ "./modules/page-translation/src/component/FilterTargetContent/index.js":
/*!*****************************************************************************!*\
  !*** ./modules/page-translation/src/component/FilterTargetContent/index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");

const FilterTargetContent = props => {
  const skipTags = props.skipTags || [];
  function fixHtmlTags(content) {
    if (typeof content !== 'string' || !content.trim()) return content;
    const tagRegex = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
    const stack = [];
    let result = '';
    let lastIndex = 0;
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
      const [fullMatch, tagName] = match;
      const isClosingTag = fullMatch.startsWith('</');
      const currentIndex = match.index;

      // Append content before this tag
      if (currentIndex > lastIndex) {
        result += content.slice(lastIndex, currentIndex);
      }
      if (!isClosingTag) {
        // Opening tag: push to stack
        stack.push({
          tag: tagName
        });
        result += fullMatch;
      } else {
        // Closing tag
        const openIndex = stack.findIndex(t => t.tag === tagName);
        if (openIndex !== -1) {
          // Match found: remove opening from stack
          stack.splice(openIndex, 1);
          result += fullMatch;
        } else {
          // No opening tag: insert missing opening tag before closing
          result += `#lmat_page_translation_temp_tag_open#<${tagName}>#lmat_page_translation_temp_tag_close#` + fullMatch;
        }
      }
      lastIndex = tagRegex.lastIndex;
    }

    // Append any remaining content after last tag
    if (lastIndex < content.length) {
      result += content.slice(lastIndex);
    }

    // Add missing closing tags at the end
    for (let i = stack.length - 1; i >= 0; i--) {
      const {
        tag
      } = stack[i];
      result += `#lmat_page_translation_temp_tag_open#</${tag}>#lmat_page_translation_temp_tag_close#`;
    }

    // Clear references to free memory (optional in GC-based engines, but helpful)
    match = null;
    stack.length = 0;
    content = null;
    return result;
  }

  /**
   * Wraps the first element and its matching closing tag with translation spans.
   * If no elements are found, returns the original HTML.
   * @param {string} html - The HTML string to process.
   * @returns {string} The modified HTML string with wrapped translation spans.
   */
  const wrapFirstAndMatchingClosingTag = html => {
    // Create a temporary element to parse the HTML string
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    // Get the first element
    const firstElement = tempElement.firstElementChild;
    if (!firstElement) {
      return html; // If no elements, return the original HTML
    }
    let childNodes = firstElement.childNodes;
    let childNodesLength = childNodes.length;
    if (childNodesLength > 0) {
      // Sort so that nodeType 3 (Text nodes) come first
      childNodes = Array.from(childNodes).sort((a, b) => a.nodeType === 3 ? -1 : b.nodeType === 3 ? 1 : 0);
      for (let i = 0; i < childNodesLength; i++) {
        let element = childNodes[i];
        if (element.nodeType === 3) {
          let textContent = element.textContent.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, match => `#lmat_page_translation_open_translate_span#${match}#lmat_page_translation_close_translate_span#`);
          element.textContent = textContent;
        } else if (element.nodeType === 8) {
          let textContent = `<!--${element.textContent}-->`;
          element.textContent = textContent;
        } else {
          let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
          element.outerHTML = filterContent;
        }
      }
    }

    // Get the opening tag of the first element
    // const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
    let firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
    firstElementOpeningTag = firstElementOpeningTag.replace(/#lmat_page_translation_open_translate_span#|#lmat_page_translation_close_translate_span#/g, '');

    // Check if the first element has a corresponding closing tag
    const openTagName = firstElement.tagName.toLowerCase();
    const closingTagName = new RegExp(`<\/${openTagName}>`, 'i');

    // Check if the inner HTML contains the corresponding closing tag
    const closingTagMatch = firstElement.outerHTML.match(closingTagName);

    // Wrap the style element
    if (firstElementOpeningTag === '<style>') {
      let wrappedFirstTag = `#lmat_page_translation_open_translate_span#${firstElement.outerHTML}#lmat_page_translation_close_translate_span#`;
      return wrappedFirstTag;
    }
    let firstElementHtml = firstElement.innerHTML;
    firstElementHtml = firstElementHtml.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, match => `#lmat_page_translation_open_translate_span#${match}#lmat_page_translation_close_translate_span#`);
    firstElement.innerHTML = '';
    let closeTag = '';
    let openTag = '';
    let filterContent = '';
    openTag = `#lmat_page_translation_open_translate_span#${firstElementOpeningTag}#lmat_page_translation_close_translate_span#`;
    if (closingTagMatch) {
      closeTag = `#lmat_page_translation_open_translate_span#</${openTagName}>#lmat_page_translation_close_translate_span#`;
    }
    if (skipTags.includes(openTagName)) {
      // Remove the custom span markers from the HTML if the tag is in skipTags
      firstElementHtml = firstElementHtml.replace(/#lmat_page_translation_open_translate_span#|#lmat_page_translation_close_translate_span#/g, '');
      firstElementHtml = "#lmat_page_translation_open_translate_span#" + firstElementHtml + "#lmat_page_translation_close_translate_span#";
    }
    if ('' !== firstElementHtml) {
      if ('' !== openTag) {
        filterContent = openTag + firstElementHtml;
      }
      if ('' !== closeTag) {
        filterContent += closeTag;
      }
    } else {
      filterContent = openTag + closeTag;
    }
    firstElement.outerHTML = filterContent;

    // Return the modified HTML
    return tempElement.innerHTML;
  };

  /**
   * Splits the content string based on a specific pattern.
   * @param {string} string - The content string to split.
   * @returns {Array} An array of strings after splitting based on the pattern.
   */
  const splitContent = string => {
    const pattern = /(#lmat_page_translation_open_translate_span#.*?#lmat_page_translation_close_translate_span#)|'/;
    const matches = string.split(pattern).filter(Boolean);

    // Remove empty strings from the result
    const output = matches.filter(match => match.trim() !== '');
    return output;
  };

  /**
   * Filters the SEO content.
   * @param {string} content - The SEO content to filter.
   * @returns {string} The filtered SEO content.
   */
  const filterSeoContent = content => {
    const regex = /(%{1,2}[a-zA-Z0-9_]+%{0,2})/g;

    // Replace placeholders with wrapped spans
    const output = content.replace(regex, match => {
      return `#lmat_page_translation_open_translate_span#${match}#lmat_page_translation_close_translate_span#`;
    });
    return output;
  };

  /**
   * Replaces the inner text of HTML elements with span elements for translation.
   * @param {string} string - The HTML content string to process.
   * @returns {Array} An array of strings after splitting based on the pattern.
   */
  const filterSourceData = string => {
    const isSeoContent = /^(_yoast_wpseo_|rank_math_|_seopress_)/.test(props.contentKey.trim());
    if (isSeoContent) {
      string = filterSeoContent(string);
    }

    // Filter shortcode content
    const shortcodePattern = /\[(.*?)\]/g;
    const shortcodeMatches = string.match(shortcodePattern);
    if (shortcodeMatches) {
      string = string.replace(shortcodePattern, match => `#lmat_page_translation_open_translate_span#${match}#lmat_page_translation_close_translate_span#`);
    }
    function replaceInnerTextWithSpan(doc) {
      let childElements = doc.childNodes;
      const childElementsReplace = index => {
        if (childElements.length > index) {
          let element = childElements[index];
          let textNode = null;
          if (element.nodeType === 3) {
            const textContent = element.textContent.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, match => `#lmat_page_translation_open_translate_span#${match}#lmat_page_translation_close_translate_span#`);
            textNode = document.createTextNode(textContent);
          } else if (element.nodeType === 8) {
            textNode = document.createTextNode(`<!--${element.textContent}-->`);
          } else {
            let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
            textNode = document.createTextNode(filterContent);
          }
          element.replaceWith(textNode);
          index++;
          childElementsReplace(index);
        }
      };
      childElementsReplace(0);
      return doc;
    }
    const tempElement = document.createElement('div');
    tempElement.innerHTML = fixHtmlTags(string);
    replaceInnerTextWithSpan(tempElement);
    let content = tempElement.innerText;

    // remoove all the #lmat_page_translation_temp_tag_open# and #lmat_page_translation_open_translate_span#
    content = content.replace(/#lmat_page_translation_temp_tag_open#([\s\S]*?)#lmat_page_translation_temp_tag_close#/g, '');
    return splitContent(content);
  };

  /**
   * The content to be filtered based on the service type.
   * If the service is 'yandex', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
   */
  const content = ['yandex', 'localAiTranslator', 'google'].includes(props.service) ? filterSourceData(props.content) : props.content;

  /**
   * Regular expression pattern to match the span elements that should not be translated.
   */
  const notTranslatePattern = /#lmat_page_translation_open_translate_span#[\s\S]*?#lmat_page_translation_close_translate_span#/;

  /**
   * Regular expression pattern to replace the placeholder span elements.
   */
  const replacePlaceholderPattern = /#lmat_page_translation_open_translate_span#|#lmat_page_translation_close_translate_span#/g;
  const filterContent = content => {
    const updatedContent = content.replace(replacePlaceholderPattern, '');
    return updatedContent;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: ['yandex', 'localAiTranslator', 'google'].includes(props.service) ? content.map((data, index) => {
      const notTranslate = notTranslatePattern.test(data);
      if (notTranslate) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
          className: "notranslate lmat-page-translation-notraslate-tag",
          translate: "no",
          children: filterContent(data)
        }, index);
      } else {
        return data;
      }
    }) : content
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FilterTargetContent);

/***/ }),

/***/ "./modules/page-translation/src/component/FormateNumberCount/index.js":
/*!****************************************************************************!*\
  !*** ./modules/page-translation/src/component/FormateNumberCount/index.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const FormatNumberCount = ({
  number
}) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormatNumberCount);

/***/ }),

/***/ "./modules/page-translation/src/component/Notice/index.js":
/*!****************************************************************!*\
  !*** ./modules/page-translation/src/component/Notice/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");


const Notice = props => {
  const updateNoticeWrapperHeight = () => {
    const parentNoticeWrapper = document.querySelector('.lmat-page-translation-body-notice-wrapper');
    if (parentNoticeWrapper) {
      const height = parentNoticeWrapper.offsetHeight + parentNoticeWrapper.offsetTop;
      parentNoticeWrapper.closest('.modal-body').style.setProperty('--lmat-page-translation-notice-wrapper-height', `${height}px`);
    }
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (props.lastNotice) {
      updateNoticeWrapperHeight();
      window.addEventListener('resize', updateNoticeWrapperHeight);
    }
    return () => {
      window.removeEventListener('resize', updateNoticeWrapperHeight);
    };
  }, [props.lastNotice]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: props.className,
    children: props.children
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Notice);

/***/ }),

/***/ "./modules/page-translation/src/component/ProgressBar/index.js":
/*!*********************************************************************!*\
  !*** ./modules/page-translation/src/component/ProgressBar/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Adds a progress bar to the container.
 * 
 * @param {HTMLElement} container - The container element for translation.
 */
const AddProgressBar = provider => {
  const progressBarSelector = "#lmat_page_translation_strings_model .lmat_page_translation_translate_progress";
  if (!document.querySelector(`#lmat-page-translation-${provider}-progress-bar`)) {
    const progressBar = jQuery(`
            <div id="lmat-page-translation-${provider}-progress-bar" class="lmat-page-translation-translate-progress-bar">
                <div class="${provider}-translator_progress_bar" style="background-color: #f3f3f3;border-radius: 10px;overflow: hidden;margin: 1.5rem auto; width: 50%;">
                <div class="${provider}-translator_progress" style="overflow: hidden;transition: width .2s ease-in-out; border-radius: 10px;text-align: center;width: 0%;height: 20px;box-sizing: border-box;background-color: #4caf50; color: #fff; font-weight: 600;"></div>
                </div>
                <div style="display:none; color: white;" class="${provider}-translator-strings-count hidden">
                    Wahooo! You have saved your valuable time via auto translating 
                    <strong class="totalChars"></strong> characters using 
                    <strong>
                        ${provider} Translator
                    </strong>
                </div>
            </div>
        `);
    jQuery(progressBarSelector).append(progressBar); // Append the progress bar to the specified selector
  } else {
    jQuery(`.${provider}-translator_progress`).css('width', '0%');
    jQuery(`.${provider}-translator-strings-count`).hide();
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AddProgressBar);

/***/ }),

/***/ "./modules/page-translation/src/component/ProgressBar/showStringCount.js":
/*!*******************************************************************************!*\
  !*** ./modules/page-translation/src/component/ProgressBar/showStringCount.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _FormateNumberCount_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../FormateNumberCount/index.js */ "./modules/page-translation/src/component/FormateNumberCount/index.js");


const ShowStringCount = (provider, status = 'none', characterCount = false) => {
  if (false === characterCount) {
    characterCount = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-lmatMachineTranslate/translate').getTranslationInfo().sourceCharacterCount;
  }
  const stringCount = document.querySelector(`.${provider}-translator-strings-count`);
  if (stringCount) {
    stringCount.style.display = status;
    stringCount.querySelector('.totalChars').textContent = (0,_FormateNumberCount_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
      number: characterCount
    });
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShowStringCount);

/***/ }),

/***/ "./modules/page-translation/src/component/StoreTimeTaken/index.js":
/*!************************************************************************!*\
  !*** ./modules/page-translation/src/component/StoreTimeTaken/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");

const StoreTimeTaken = ({
  prefix = false,
  start = false,
  end = false,
  translateStatus = false
}) => {
  const timeTaken = (end - start) / 1000; // Convert milliseconds to seconds
  const data = {};
  if (prefix) {
    data.provider = prefix;
    if (start && end) {
      const oldTimeTaken = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-lmatMachineTranslate/translate').getTranslationInfo().translateData[prefix]?.timeTaken || 0;
      data.timeTaken = timeTaken + oldTimeTaken;
    }
    if (translateStatus) {
      data.translateStatus = true;
    }
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-lmatMachineTranslate/translate').translationInfo(data);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StoreTimeTaken);

/***/ }),

/***/ "./modules/page-translation/src/component/TranslateProvider/google/google-language.js":
/*!********************************************************************************************!*\
  !*** ./modules/page-translation/src/component/TranslateProvider/google/google-language.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  const languages = ["ab", "ace", "ach", "aa", "af", "sq", "alz", "am", "ar", "hy", "as", "av", "awa", "ay", "az", "ban", "bal", "bm", "bci", "ba", "eu", "btx", "bts", "bbc", "be", "bem", "bn", "bew", "bho", "bik", "bs", "br", "bg", "bua", "yue", "ca", "ceb", "ch", "ce", "ny", "zh-CN", "zh-TW", "chk", "cv", "co", "crh", "crh-Latn", "hr", "cs", "da", "fa-AF", "dv", "din", "doi", "dov", "nl", "dyu", "dz", "en", "eo", "et", "ee", "fo", "fj", "tl", "fi", "fon", "fr", "fr-CA", "fy", "fur", "ff", "gaa", "gl", "ka", "de", "el", "gn", "gu", "ht", "cnh", "ha", "haw", "iw", "hil", "hi", "hmn", "hu", "hrx", "iba", "is", "ig", "ilo", "id", "iu-Latn", "iu", "ga", "it", "jam", "ja", "jw", "kac", "kl", "kn", "kr", "pam", "kk", "kha", "km", "cgg", "kg", "rw", "ktu", "trp", "kv", "gom", "ko", "kri", "ku", "ckb", "ky", "lo", "ltg", "la", "lv", "lij", "li", "ln", "lt", "lmo", "lg", "luo", "lb", "mk", "mad", "mai", "mak", "mg", "ms", "ms-Arab", "ml", "mt", "mam", "gv", "mi", "mr", "mh", "mwr", "mfe", "chm", "mni-Mtei", "min", "lus", "mn", "my", "nhe", "ndc-ZW", "nr", "new", "ne", "bm-Nkoo", "no", "nus", "oc", "or", "om", "os", "pag", "pap", "ps", "fa", "pl", "pt", "pt-PT", "pa", "pa-Arab", "qu", "kek", "rom", "ro", "rn", "ru", "se", "sm", "sg", "sa", "sat-Latn", "sat", "gd", "nso", "sr", "st", "crs", "shn", "sn", "scn", "szl", "sd", "si", "sk", "sl", "so", "es", "su", "sus", "sw", "ss", "sv", "ty", "tg", "ber-Latn", "ber", "ta", "tt", "te", "tet", "th", "bo", "ti", "tiv", "tpi", "to", "lua", "ts", "tn", "tcy", "tum", "tr", "tk", "tyv", "ak", "udm", "uk", "ur", "ug", "uz", "ve", "vec", "vi", "war", "cy", "wo", "xh", "sah", "yi", "yo", "yua", "zap", "zu"];
  return languages;
});

/***/ }),

/***/ "./modules/page-translation/src/component/TranslateProvider/google/index.js":
/*!**********************************************************************************!*\
  !*** ./modules/page-translation/src/component/TranslateProvider/google/index.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stringModalScroll_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../stringModalScroll/index.js */ "./modules/page-translation/src/component/stringModalScroll/index.js");


/**
 * Initializes Google Translate functionality on specific elements based on provided data.
 * @param {Object} data - The data containing source and target languages.
 */
const GoogleTranslater = data => {
  const {
    sourceLang,
    targetLang,
    ID,
    translateStatusHandler,
    modalRenderId
  } = data;
  let lang = targetLang;
  let srcLang = sourceLang;
  if (lang === 'zh') {
    lang = lmatPageTranslationGlobal.languageObject['zh']?.locale.replace('_', '-');
  }
  if (srcLang === 'zh') {
    srcLang = lmatPageTranslationGlobal.languageObject['zh']?.locale.replace('_', '-');
  }
  new google.translate.TranslateElement({
    pageLanguage: srcLang,
    includedLanguages: lang,
    defaultLanguage: srcLang,
    multilanguagePage: true,
    autoDisplay: false
  }, ID);
  const element = document.querySelector(`#${ID}`);
  if (element) {
    const translateElement = element.children;
    if (translateElement.length <= 0) {
      Object.values(google?.translate?.TranslateElement()).map(item => {
        if (item instanceof HTMLElement && item.id === 'atfp_google_translate_element') {
          element.replaceWith(item);
        }
      });
    }
  }
  document.querySelector(`#${ID}`).addEventListener('change', () => {
    (0,_stringModalScroll_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(translateStatusHandler, 'google', modalRenderId);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GoogleTranslater);

/***/ }),

/***/ "./modules/page-translation/src/component/TranslateProvider/index.js":
/*!***************************************************************************!*\
  !*** ./modules/page-translation/src/component/TranslateProvider/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _google_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./google/index.js */ "./modules/page-translation/src/component/TranslateProvider/google/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");



/**
 * Provides translation services using Yandex Translate.
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (props => {
  props = props || {};
  const {
    Service = false,
    openErrorModalHandler = () => {}
  } = props;
  const adminUrl = window.lmatPageTranslationGlobal.admin_url;
  const assetsUrl = window.lmatPageTranslationGlobal.lmat_url + 'Admin/Assets/images/';
  const errorIcon = assetsUrl + 'error-icon.svg';
  const Services = {
    google: {
      Provider: _google_index_js__WEBPACK_IMPORTED_MODULE_0__["default"],
      title: "Google Translate",
      SettingBtnText: "Translate",
      serviceLabel: "Google Translate",
      Docs: "https://docs.coolplugins.net/doc/google-translate-for-polylang/?utm_source=atfpp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_google",
      heading: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Choose Language", 'linguator-multilingual-ai-translation'),
      BetaEnabled: false,
      ButtonDisabled: props.googleButtonDisabled,
      ErrorMessage: props.googleButtonDisabled ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "lmat-provider-error button button-primary",
        onClick: () => openErrorModalHandler("google"),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
          src: errorIcon,
          alt: "error"
        }), " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('View Error', 'linguator-multilingual-ai-translation')]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {}),
      Logo: 'google.png'
    },
    localAiTranslator: {
      title: "Chrome Built-in AI",
      SettingBtnText: "Translate",
      serviceLabel: "Chrome AI Translator",
      heading: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Translate Using %s", 'autopoly-ai-translation-for-polylang'), "Chrome built-in API"),
      Docs: "https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=lmat_page_translation_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_chrome",
      BetaEnabled: true,
      ButtonDisabled: true,
      ErrorMessage:  true ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "lmat-page-translation-provider-disabled button button-primary",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Upcoming Feature', 'autopoly-ai-translation-for-polylang')
      }) : /*#__PURE__*/0,
      Logo: 'chrome.png'
    }
  };
  if (!Service) {
    return Services;
  }
  return Services[Service];
});

/***/ }),

/***/ "./modules/page-translation/src/component/TranslateSeoFields/RankMathSeo.js":
/*!**********************************************************************************!*\
  !*** ./modules/page-translation/src/component/TranslateSeoFields/RankMathSeo.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");

const RankMathSeo = props => {
  if (!(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("rank-math")) {
    return;
  }
  const {
    updateKeywords,
    updateTitle,
    updateDescription,
    updateBreadcrumbTitle,
    updateFacebookTitle,
    updateFacebookDescription,
    updateTwitterTitle,
    updateTwitterDescription
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("rank-math");
  const {
    key,
    value
  } = props;
  switch (key) {
    case 'rank_math_focus_keyword':
      if (updateKeywords) {
        updateKeywords(value);
      }
      break;
    case 'rank_math_title':
      if (updateTitle) {
        updateTitle(value);
      }
      break;
    case 'rank_math_description':
      if (updateDescription) {
        updateDescription(value);
      }
      break;
    case 'rank_math_breadcrumb_title':
      if (updateBreadcrumbTitle) {
        updateBreadcrumbTitle(value);
      }
      break;
    case 'rank_math_facebook_title':
      if (updateFacebookTitle) {
        updateFacebookTitle(value);
      }
      break;
    case 'rank_math_facebook_description':
      if (updateFacebookDescription) {
        updateFacebookDescription(value);
      }
      break;
    case 'rank_math_twitter_title':
      if (updateTwitterTitle) {
        updateTwitterTitle(value);
      }
      break;
    case 'rank_math_twitter_description':
      if (updateTwitterDescription) {
        updateTwitterDescription(value);
      }
      break;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RankMathSeo);

/***/ }),

/***/ "./modules/page-translation/src/component/TranslateSeoFields/SeoPress.js":
/*!*******************************************************************************!*\
  !*** ./modules/page-translation/src/component/TranslateSeoFields/SeoPress.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const SeoPressFields = async props => {
  const {
    key,
    value
  } = props;
  const inputId = key.replace(/^_/, '') + '_meta';
  if (!document.querySelector('#' + inputId)) {
    return;
  }
  switch (key) {
    case '_seopress_titles_title':
    case '_seopress_titles_desc':
    case '_seopress_social_fb_title':
    case '_seopress_social_fb_desc':
    case '_seopress_social_twitter_title':
    case '_seopress_social_twitter_desc':
      jQuery(`#${inputId}`).val(value);
      jQuery(`#${inputId}`).trigger('change');
      break;
    case '_seopress_analysis_target_kw':
      if (window.target_kw && window.target_kw instanceof window.Tagify && window.target_kw.DOM.originalInput.id === inputId) {
        window.target_kw.addTags(value);
      } else {
        jQuery('#' + inputId).val(value);
        jQuery('#' + inputId).trigger('change');
      }
      break;
    default:
      break;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SeoPressFields);

/***/ }),

/***/ "./modules/page-translation/src/component/TranslateSeoFields/YoastSeoFields.js":
/*!*************************************************************************************!*\
  !*** ./modules/page-translation/src/component/TranslateSeoFields/YoastSeoFields.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");

const YoastSeoFields = props => {
  if (!(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("yoast-seo/editor")) {
    return;
  }
  const {
    updateData,
    setFocusKeyword,
    setBreadcrumbsTitle,
    setFacebookPreviewTitle,
    setFacebookPreviewDescription,
    setTwitterPreviewTitle,
    setTwitterPreviewDescription
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("yoast-seo/editor");
  const {
    key,
    value
  } = props;
  switch (key) {
    case "_yoast_wpseo_focuskw":
      if (setFocusKeyword) {
        setFocusKeyword(value);
      }
      break;
    case "_yoast_wpseo_title":
      if (updateData) {
        updateData({
          title: value
        });
      }
      break;
    case "_yoast_wpseo_metadesc":
      if (updateData) {
        updateData({
          description: value
        });
      }
      break;
    case "_yoast_wpseo_bctitle":
      if (setBreadcrumbsTitle) {
        setBreadcrumbsTitle(value);
      }
      break;
    case "_yoast_wpseo_opengraph-title":
      if (setFacebookPreviewTitle) {
        setFacebookPreviewTitle(value);
      }
      break;
    case "_yoast_wpseo_opengraph-description":
      if (setFacebookPreviewDescription) {
        setFacebookPreviewDescription(value);
      }
      break;
    case "_yoast_wpseo_twitter-title":
      if (setTwitterPreviewTitle) {
        setTwitterPreviewTitle(value);
      }
      break;
    case "_yoast_wpseo_twitter-description":
      if (setTwitterPreviewDescription) {
        setTwitterPreviewDescription(value);
      }
      break;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastSeoFields);

/***/ }),

/***/ "./modules/page-translation/src/component/storeTranslatedString/index.js":
/*!*******************************************************************************!*\
  !*** ./modules/page-translation/src/component/storeTranslatedString/index.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");


/**
 * Saves the translation data by updating the translation content based on the provided translate object and data.
 * @param {Object} translateData - The data containing translation information.
 */
const SaveTranslation = ({
  type,
  key,
  translateContent,
  source,
  provider,
  AllowedMetaFields
}) => {
  if (['title', 'excerpt'].includes(type)) {
    const action = `${type}SaveTranslate`;
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-lmatMachineTranslate/translate')[action](translateContent, provider);
  } else if (['metaFields'].includes(type)) {
    if (Object.keys(AllowedMetaFields).includes(key)) {
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-lmatMachineTranslate/translate').metaFieldsSaveTranslate(key, translateContent, source, provider);
    }
  } else {
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-lmatMachineTranslate/translate').contentSaveTranslate(key, translateContent, source, provider);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SaveTranslation);

/***/ }),

/***/ "./modules/page-translation/src/component/stringModalScroll/index.js":
/*!***************************************************************************!*\
  !*** ./modules/page-translation/src/component/stringModalScroll/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _storeTranslatedString_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storeTranslatedString/index.js */ "./modules/page-translation/src/component/storeTranslatedString/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _StoreTimeTaken_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../StoreTimeTaken/index.js */ "./modules/page-translation/src/component/StoreTimeTaken/index.js");
/* harmony import */ var _ProgressBar_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ProgressBar/index.js */ "./modules/page-translation/src/component/ProgressBar/index.js");
/* harmony import */ var _ProgressBar_showStringCount_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ProgressBar/showStringCount.js */ "./modules/page-translation/src/component/ProgressBar/showStringCount.js");






/**
 * Handles the scrolling animation of a specified element.
 * 
 * @param {Object} props - The properties for the scroll animation.
 * @param {HTMLElement} props.element - The element to be scrolled.
 * @param {number} props.scrollSpeed - The duration of the scroll animation in milliseconds.
 */
const ScrollAnimation = props => {
  const {
    element,
    scrollSpeed,
    provider
  } = props;
  if (element.scrollHeight - element.offsetHeight <= 0) {
    return;
  }
  const progressBar = jQuery(`.${provider}-translator_progress_bar`);
  let startTime = null;
  let startScrollTop = element.scrollTop;
  const animateScroll = () => {
    const scrollHeight = element.scrollHeight - element.offsetHeight + 100;
    const currentTime = performance.now();
    const duration = scrollSpeed;
    const scrollTarget = scrollHeight + 2000;
    if (!startTime) {
      startTime = currentTime;
    }
    const progress = (currentTime - startTime) / duration;
    const scrollPosition = startScrollTop + (scrollTarget - startScrollTop) * progress;
    var scrollTop = element.scrollTop;
    var currentScrollHeight = element.scrollHeight;
    var clientHeight = element.clientHeight;
    var scrollPercentage = scrollTop / (currentScrollHeight - clientHeight) * 100;
    progressBar.find(`.${provider}-translator_progress`).css('width', scrollPercentage + '%');
    let percentage = (Math.round(scrollPercentage * 10) / 10).toFixed(1);
    percentage = Math.min(percentage, 100).toString();
    progressBar.find(`.${provider}-translator_progress`).text(percentage + '%');
    if (scrollPosition > scrollHeight) {
      (0,_ProgressBar_showStringCount_js__WEBPACK_IMPORTED_MODULE_4__["default"])(provider, 'block');
      return; // Stop animate scroll
    }
    element.scrollTop = scrollPosition;
    if (scrollPosition < scrollHeight) {
      setTimeout(animateScroll, 16);
    }
  };
  animateScroll();
};

/**
 * Updates the translated content in the string container based on the provided translation object.
 */
const updateTranslatedContent = ({
  provider,
  startTime,
  endTime
}) => {
  const container = document.getElementById("lmat_page_translation_strings_model");
  const stringContainer = container.querySelector('.lmat_page_translation_string_container');
  const translatedData = stringContainer.querySelectorAll('td.translate[data-string-type]:not([data-translate-status="translated"])');
  const totalTranslatedData = translatedData.length;
  const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-lmatMachineTranslate/translate').getAllowedMetaFields();
  translatedData.forEach((ele, index) => {
    const translatedText = ele.innerText;
    const key = ele.dataset.key;
    const type = ele.dataset.stringType;
    const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;
    (0,_storeTranslatedString_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
      type: type,
      key: key,
      translateContent: translatedText,
      source: sourceText,
      provider: provider,
      AllowedMetaFields
    });
    const translationEntry = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-lmatMachineTranslate/translate').getTranslationInfo().translateData[provider];
    const previousTargetStringCount = translationEntry && translationEntry.targetStringCount ? translationEntry.targetStringCount : 0;
    const previousTargetWordCount = translationEntry && translationEntry.targetWordCount ? translationEntry.targetWordCount : 0;
    const previousTargetCharacterCount = translationEntry && translationEntry.targetCharacterCount ? translationEntry.targetCharacterCount : 0;
    if (translatedText.trim() !== '' && translatedText.trim().length > 0) {
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-lmatMachineTranslate/translate').translationInfo({
        targetStringCount: previousTargetStringCount + sourceText.trim().split(/(?<=[.!?]+)\s+/).length,
        targetWordCount: previousTargetWordCount + sourceText.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length,
        targetCharacterCount: previousTargetCharacterCount + sourceText.trim().length,
        provider: provider
      });
    }
    if (index === totalTranslatedData - 1) {
      jQuery(`.${provider}-translator_progress`).css('width', '100%');
      (0,_ProgressBar_showStringCount_js__WEBPACK_IMPORTED_MODULE_4__["default"])(provider, 'block');
      (0,_StoreTimeTaken_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
        prefix: provider,
        start: startTime,
        end: endTime,
        translateStatus: true
      });
    }
  });
};

/**
 * Handles the completion of the translation process by enabling the save button,
 * updating the UI, and stopping the translation progress.
 * 
 * @param {HTMLElement} container - The container element for translation.
 * @param {number} startTime - The start time of the translation.
 * @param {number} endTime - The end time of the translation.
 * @param {Function} translateStatus - The function to call when the translation is complete.
 */
const onCompleteTranslation = ({
  container,
  provider,
  startTime,
  endTime,
  translateStatus,
  modalRenderId
}) => {
  const conainer = document.querySelector(`#lmat-page-translation-${provider}-strings-modal.modal-container[data-render-id="${modalRenderId}"]`);
  if (!conainer) {
    return;
  }
  container.querySelector(".lmat_page_translation_translate_progress").style.display = "none";
  container.querySelector(".lmat_page_translation_string_container").style.animation = "none";
  document.body.style.top = '0';
  const saveButton = container.querySelector('button.save_it');
  saveButton.removeAttribute('disabled');
  saveButton.classList.add('translated');
  saveButton.classList.remove('notranslate');
  updateTranslatedContent({
    provider,
    startTime,
    endTime
  });
  translateStatus(false);
};

/**
 * Automatically scrolls the string container and triggers the completion callback
 * when the bottom is reached or certain conditions are met.
 * 
 * @param {Function} translateStatus - Callback function to execute when translation is deemed complete.
 * @param {string} provider - The provider of the translation.
 */
const ModalStringScroll = (translateStatus, provider, modalRenderId) => {
  const startTime = new Date().getTime();
  let translateComplete = false;
  (0,_ProgressBar_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(provider);
  const container = document.getElementById("lmat_page_translation_strings_model");
  const stringContainer = container.querySelector('.lmat_page_translation_string_container');
  stringContainer.scrollTop = 0;
  const scrollHeight = stringContainer.scrollHeight;
  if (scrollHeight !== undefined && scrollHeight > 100) {
    document.querySelector(".lmat_page_translation_translate_progress").style.display = "block";
    setTimeout(() => {
      const scrollSpeed = Math.ceil(scrollHeight / stringContainer?.offsetHeight) * 2000;
      ScrollAnimation({
        element: stringContainer,
        scrollSpeed: scrollSpeed,
        provider: provider
      });
    }, 2000);
    stringContainer.addEventListener('scroll', () => {
      var isScrolledToBottom = stringContainer.scrollTop + stringContainer.clientHeight + 50 >= stringContainer.scrollHeight;
      if (isScrolledToBottom && !translateComplete) {
        const endTime = new Date().getTime();
        setTimeout(() => {
          onCompleteTranslation({
            container,
            provider,
            startTime,
            endTime,
            translateStatus,
            modalRenderId
          });
        }, 4000);
        translateComplete = true;
      }
    });
    if (stringContainer.clientHeight + 10 >= scrollHeight) {
      jQuery(`.${provider}-translator_progress`).css('width', '100%');
      jQuery(`.${provider}-translator_progress`).text('100%');
      (0,_ProgressBar_showStringCount_js__WEBPACK_IMPORTED_MODULE_4__["default"])(provider, 'block');
      const endTime = new Date().getTime();
      setTimeout(() => {
        onCompleteTranslation({
          container,
          provider,
          startTime,
          endTime,
          translateStatus,
          modalRenderId
        });
      }, 4000);
    }
  } else {
    jQuery(`.${provider}-translator_progress`).css('width', '100%');
    jQuery(`.${provider}-translator_progress`).text('100%');
    (0,_ProgressBar_showStringCount_js__WEBPACK_IMPORTED_MODULE_4__["default"])(provider, 'block');
    const endTime = new Date().getTime();
    setTimeout(() => {
      onCompleteTranslation({
        container,
        provider,
        startTime,
        endTime,
        translateStatus,
        modalRenderId
      });
    }, 4000);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModalStringScroll);

/***/ }),

/***/ "./modules/page-translation/src/createTranslatedPost/Elementor/index.js":
/*!******************************************************************************!*\
  !*** ./modules/page-translation/src/createTranslatedPost/Elementor/index.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _component_TranslateSeoFields_YoastSeoFields_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../component/TranslateSeoFields/YoastSeoFields.js */ "./modules/page-translation/src/component/TranslateSeoFields/YoastSeoFields.js");
/* harmony import */ var _component_TranslateSeoFields_RankMathSeo_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../component/TranslateSeoFields/RankMathSeo.js */ "./modules/page-translation/src/component/TranslateSeoFields/RankMathSeo.js");




// Update widget content with translations
const lmatMachineTranslateUpdateWidgetContent = translations => {
  translations.forEach(translation => {
    // Find the model by ID using the lmatMachineTranslateFindModelById function
    const model = lmatMachineTranslateFindModelById(elementor.elements.models, translation.ID);
    if (model) {
      const settings = model.get('settings');

      // Check for normal fields (title, text, editor, etc.)
      if (settings.get(translation.key)) {
        settings.set(translation.key, translation.translatedContent); // Set the translated content
      }

      // Handle repeater fields (if any)
      const repeaterMatch = translation.key.match(/(.+)\[(\d+)\]\.(.+)/);
      if (repeaterMatch) {
        const [_, repeaterKey, index, subKey] = repeaterMatch;
        const repeaterArray = settings.get(repeaterKey);
        if (Array.isArray(repeaterArray.models) && repeaterArray.models[index]) {
          let repeaterModel = repeaterArray.models[index];
          let repeaterAttribute = repeaterModel.attributes;
          repeaterAttribute[subKey] = translation.translatedContent;
          settings.set(repeaterKey, repeaterArray); // Set the updated array back to settings
        }
      }
    }
  });

  // After updating content, ensure that the changes are saved or published
  $e.internal('document/save/set-is-modified', {
    status: true
  });
};
const lmatMachineTranslateUpdateMetaFields = (metaFields, service) => {
  const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-lmatMachineTranslate/translate').getAllowedMetaFields();
  Object.keys(metaFields).forEach(key => {
    // Update yoast seo meta fields
    if (Object.keys(AllowedMetaFields).includes(key)) {
      const translatedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-lmatMachineTranslate/translate').getTranslatedString('metaFields', metaFields[key][0], key, service);
      if (key.startsWith('_yoast_wpseo_') && AllowedMetaFields[key].inputType === 'string') {
        (0,_component_TranslateSeoFields_YoastSeoFields_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
          key: key,
          value: translatedMetaFields
        });
      } else if (key.startsWith('rank_math_') && AllowedMetaFields[key].inputType === 'string') {
        (0,_component_TranslateSeoFields_RankMathSeo_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
          key: key,
          value: translatedMetaFields
        });
      } else if (key.startsWith('_seopress_') && AllowedMetaFields[key].inputType === 'string') {
        elementor?.settings?.page?.model?.setExternalChange(key, translatedMetaFields);
      }
    }
    ;
  });
};

// Find Elementor model by ID
const lmatMachineTranslateFindModelById = (elements, id) => {
  for (const model of elements) {
    if (model.get('id') === id) {
      return model;
    }
    const nestedElements = model.get('elements').models;
    const foundModel = lmatMachineTranslateFindModelById(nestedElements, id);
    if (foundModel) {
      return foundModel;
    }
  }
  return null;
};
const updateElementorPage = ({
  postContent,
  modalClose,
  service
}) => {
  const postID = elementor.config.document.id;

  // Collect translated content
  const translations = [];

  // Define a list of properties to exclude
  const cssProperties = ['content_width', 'title_size', 'font_size', 'margin', 'padding', 'background', 'border', 'color', 'text_align', 'font_weight', 'font_family', 'line_height', 'letter_spacing', 'text_transform', 'border_radius', 'box_shadow', 'opacity', 'width', 'height', 'display', 'position', 'z_index', 'visibility', 'align', 'max_width', 'content_typography_typography', 'flex_justify_content', 'title_color', 'description_color', 'email_content'];
  const storeSourceStrings = (element, index, ids = []) => {
    const widgetId = element.id;
    const settings = element.settings;
    ids.push(index);

    // Check if settings is an object
    if (typeof settings === 'object' && settings !== null) {
      // Define the substrings to check for translatable content
      const substringsToCheck = ['title', 'description', 'editor', 'text', 'content', 'label'];

      // Iterate through the keys in settings
      Object.keys(settings).forEach(key => {
        // Skip keys that are CSS properties
        if (cssProperties.some(substring => key.toLowerCase().includes(substring))) {
          return; // Skip this property and continue to the next one
        }

        // Check if the key includes any of the specified substrings
        if (substringsToCheck.some(substring => key.toLowerCase().includes(substring)) && typeof settings[key] === 'string' && settings[key].trim() !== '') {
          const uniqueKey = ids.join('_lmat_page_translation_') + '_lmat_page_translation_settings_lmat_page_translation_' + key;
          const translatedData = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-lmatMachineTranslate/translate').getTranslatedString('content', settings[key], uniqueKey, service);
          translations.push({
            ID: widgetId,
            key: key,
            translatedContent: translatedData
          });
        }

        // Check for arrays (possible repeater fields) within settings
        if (Array.isArray(settings[key])) {
          settings[key].forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              // Check for translatable content in repeater fields
              Object.keys(item).forEach(repeaterKey => {
                // Skip if it's a CSS-related property
                if (cssProperties.includes(repeaterKey.toLowerCase())) {
                  return; // Skip this property
                }
                if (substringsToCheck.some(substring => repeaterKey.toLowerCase().includes(substring)) && typeof item[repeaterKey] === 'string' && item[repeaterKey].trim() !== '') {
                  const fieldKey = `${key}[${index}].${repeaterKey}`;
                  const uniqueKey = ids.join('_lmat_page_translation_') + '_lmat_page_translation_settings_lmat_page_translation_' + key + '_lmat_page_translation_' + index + '_lmat_page_translation_' + repeaterKey;
                  const translatedData = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-lmatMachineTranslate/translate').getTranslatedString('content', item[repeaterKey], uniqueKey, service);
                  translations.push({
                    ID: widgetId,
                    key: fieldKey,
                    translatedContent: translatedData
                  });
                }
              });
            }
          });
        }
      });
    }

    // If there are nested elements, process them recursively
    if (element.elements && Array.isArray(element.elements)) {
      element.elements.forEach((nestedElement, index) => {
        storeSourceStrings(nestedElement, index, [...ids, 'elements']);
      });
    }
  };
  postContent.widgetsContent.map((widget, index) => storeSourceStrings(widget, index, []));

  // Update widget content with translations
  lmatMachineTranslateUpdateWidgetContent(translations);

  // Update Meta Fields
  lmatMachineTranslateUpdateMetaFields(postContent.metaFields, service);
  const replaceSourceString = () => {
    const elementorData = lmatPageTranslationGlobal.elementorData;
    const translateStrings = wp.data.select('block-lmatMachineTranslate/translate').getTranslationEntry();
    translateStrings.forEach(translation => {
      const sourceString = translation.source;
      const ids = translation.id;
      const translatedContent = translation.translatedData;
      const type = translation.type;
      if (!sourceString || '' === sourceString && 'content' !== type) {
        return;
      }
      const keyArray = ids.split('_lmat_page_translation_');
      const translateValue = translatedContent[service];
      let parentElement = null;
      let parentKey = null;
      let currentElement = elementorData;
      keyArray.forEach(key => {
        parentElement = currentElement;
        parentKey = key;
        currentElement = currentElement[key];
      });
      if (parentElement && parentKey && parentElement[parentKey] && parentElement[parentKey] === sourceString) {
        parentElement[parentKey] = translateValue;
      }
    });
    return elementorData;
  };
  const elementorData = replaceSourceString();
  fetch(lmatPageTranslationGlobal.ajax_url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      action: lmatPageTranslationGlobal.update_elementor_data,
      post_id: postID,
      elementor_data: JSON.stringify(elementorData),
      lmat_page_translation_nonce: lmatPageTranslationGlobal.ajax_nonce
    })
  }).then(response => response.json()).then(data => {
    if (data.success) {
      const translateButton = document.querySelector('.lmat-page-translation-button[name="lmat_page_translation_meta_box_translate"]');
      if (translateButton) {
        translateButton.setAttribute('title', 'Translation process completed successfully.');
      }
      elementor.reloadPreview();
    } else {
      console.error('Failed to update Elementor data:', data.data);
    }
    elementor.reloadPreview();
    modalClose();
  }).catch(error => {
    elementor.reloadPreview();
    modalClose();
    console.error('Error updating Elementor data:', error);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (updateElementorPage);

/***/ }),

/***/ "./modules/page-translation/src/createTranslatedPost/Gutenberg/createBlock.js":
/*!************************************************************************************!*\
  !*** ./modules/page-translation/src/createTranslatedPost/Gutenberg/createBlock.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_FilterNestedAttr_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component/FilterNestedAttr/index.js */ "./modules/page-translation/src/component/FilterNestedAttr/index.js");


/**
 * Filters and translates attributes of a block based on provided rules.
 * 
 * @param {Object} block - The block to filter and translate attributes for.
 * @param {Object} blockParseRules - The rules for parsing the block.
 * @returns {Object} The updated block with translated attributes.
 */
const filterTranslateAttr = (block, blockParseRules, service) => {
  const {
    select
  } = wp.data;
  const filterAttrArr = Object.values(blockParseRules);
  const blockAttr = block.attributes;
  const blockId = block.clientId;

  // Function to update a nested attribute in the block
  const updateNestedAttribute = (obj, path, value) => {
    const newObj = {
      ...obj
    };
    let current = newObj;
    for (let i = 0; i < path.length - 1; i++) {
      if (Object.getPrototypeOf(current[path[i]]) === Array.prototype) {
        current[path[i]] = [...current[path[i]]];
      } else {
        current[path[i]] = {
          ...current[path[i]]
        }; // Create a shallow copy
      }
      current = current[path[i]];
    }
    if (current[path[path.length - 1]] instanceof wp.richText.RichTextData) {
      current[path[path.length - 1]] = value.replace(/(?<!\\)"|\\"/g, "'");
    } else {
      current[path[path.length - 1]] = value;
    }
    return newObj;
  };

  /**
   * Updates translated attributes based on provided ID array and filter attribute object.
   * 
   * @param {Array} idArr - The array of IDs to update attributes for.
   * @param {Object|Array} filterAttrObj - The filter attribute object to apply.
   */
  const updateTranslatedAttr = (idArr, filterAttrObj) => {
    if (true === filterAttrObj) {
      const newIdArr = new Array(...idArr);
      const childIdArr = new Array();
      let dynamicBlockAttr = blockAttr;
      let uniqueId = blockId;
      newIdArr.forEach(key => {
        childIdArr.push(key);
        uniqueId += `lmatMachineTranslate${key}`;
        dynamicBlockAttr = dynamicBlockAttr[key];
      });
      let blockAttrContent = dynamicBlockAttr;
      if (blockAttrContent instanceof wp.richText.RichTextData) {
        blockAttrContent = blockAttrContent.originalHTML;
      }
      if (undefined !== blockAttrContent && blockAttrContent.trim() !== '') {
        let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');
        let translateContent = '';
        if (!/[\p{L}\p{N}]/gu.test(blockAttrContent)) {
          translateContent = blockAttrContent;
        } else {
          translateContent = select('block-lmatMachineTranslate/translate').getTranslatedString('content', blockAttrContent, filterKey, service);
        }
        block.attributes = updateNestedAttribute(block.attributes, newIdArr, translateContent);
      }
      return;
    }
    (0,_component_FilterNestedAttr_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(idArr, filterAttrObj, blockAttr, updateTranslatedAttr);
  };
  filterAttrArr.forEach(data => {
    Object.keys(data).forEach(key => {
      const idArr = new Array(key);
      updateTranslatedAttr(idArr, data[key]);
    });
  });
  return block;
};

/**
 * Creates a translated block based on the provided block, child block, translate handler, and block rules.
 * If the block name is included in the block rules, it filters and translates the attributes accordingly.
 * 
 * @param {Object} block - The block to create a translated version of.
 * @param {Array} childBlock - The child blocks associated with the main block.
 * @param {Object} blockRules - The rules for translating blocks.
 * @param {String} service - The service to use for translation.
 * @returns {Object} The newly created translated block.
 */
const createTranslatedBlock = (block, childBlock, blockRules, service) => {
  const {
    createBlock
  } = wp.blocks;
  const {
    name: blockName,
    attributes
  } = block;
  const blockTranslateName = Object.keys(blockRules.LmatBlockParseRules);
  let attribute = {
    ...attributes
  };
  let translatedBlock = block;
  let newBlock = '';
  if (blockTranslateName.includes(block.name)) {
    translatedBlock = filterTranslateAttr(block, blockRules['LmatBlockParseRules'][block.name], service);
    attribute = translatedBlock.attributes;
  }
  newBlock = createBlock(blockName, attribute, childBlock);
  return newBlock;
};

/**
 * Creates a child block recursively by translating each inner block based on the provided block, translate handler, and block rules.
 * 
 * @param {Object} block - The block to create a child block for.
 * @param {Object} blockRules - The rules for translating blocks.
 * @returns {Object} The newly created translated child block.
 */
const cretaeChildBlock = (block, blockRules, service) => {
  let childBlock = block.innerBlocks.map(block => {
    if (block.name) {
      const childBlock = cretaeChildBlock(block, blockRules, service);
      return childBlock;
    }
  });
  const newBlock = createTranslatedBlock(block, childBlock, blockRules, service);
  return newBlock;
};

/**
 * Creates the main blocks based on the provided block, translate handler, and block rules.
 * If the block name exists, it creates the main block along with its child blocks and inserts it into the block editor.
 * 
 * @param {Object} block - The main block to create.
 * @param {Object} blockRules - The rules for translating blocks.
 */
const createBlocks = (block, service) => {
  const {
    select
  } = wp.data;
  const blockRules = select('block-lmatMachineTranslate/translate').getBlockRules();
  const {
    dispatch
  } = wp.data;
  const {
    name: blockName
  } = block;
  // Create the main block
  if (blockName) {
    let childBlock = block.innerBlocks.map(block => {
      if (block.name) {
        return cretaeChildBlock(block, blockRules, service);
      }
    });
    const parentBlock = createTranslatedBlock(block, childBlock, blockRules, service);
    dispatch('core/block-editor').insertBlock(parentBlock);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createBlocks);

/***/ }),

/***/ "./modules/page-translation/src/createTranslatedPost/Gutenberg/index.js":
/*!******************************************************************************!*\
  !*** ./modules/page-translation/src/createTranslatedPost/Gutenberg/index.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createBlock_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createBlock.js */ "./modules/page-translation/src/createTranslatedPost/Gutenberg/createBlock.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _component_TranslateSeoFields_YoastSeoFields_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../component/TranslateSeoFields/YoastSeoFields.js */ "./modules/page-translation/src/component/TranslateSeoFields/YoastSeoFields.js");
/* harmony import */ var _component_TranslateSeoFields_RankMathSeo_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../component/TranslateSeoFields/RankMathSeo.js */ "./modules/page-translation/src/component/TranslateSeoFields/RankMathSeo.js");
/* harmony import */ var _component_TranslateSeoFields_SeoPress_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../component/TranslateSeoFields/SeoPress.js */ "./modules/page-translation/src/component/TranslateSeoFields/SeoPress.js");






/**
 * Translates the post content and updates the post title, excerpt, and content.
 * 
 * @param {Object} props - The properties containing post content, translation function, and block rules.
 */
const translatePost = props => {
  const {
    editPost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('core/editor');
  const {
    modalClose,
    postContent,
    service
  } = props;

  /**
   * Updates the post title and excerpt text based on translation.
   */
  const postDataUpdate = () => {
    const data = {};
    const editPostData = Object.keys(postContent).filter(key => ['title', 'excerpt'].includes(key));
    editPostData.forEach(key => {
      const sourceData = postContent[key];
      if (sourceData.trim() !== '') {
        const translateContent = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-lmatMachineTranslate/translate').getTranslatedString(key, sourceData, null, service);
        data[key] = translateContent;
      }
    });
    editPost(data);
  };

  /**
   * Updates the post meta fields based on translation.
   */
  const postMetaFieldsUpdate = () => {
    const metaFieldsData = postContent.metaFields;
    const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-lmatMachineTranslate/translate').getAllowedMetaFields();
    Object.keys(metaFieldsData).forEach(key => {
      // Update yoast seo meta fields
      if (Object.keys(AllowedMetaFields).includes(key)) {
        const translatedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-lmatMachineTranslate/translate').getTranslatedString('metaFields', metaFieldsData[key][0], key, service);
        if (key.startsWith('_yoast_wpseo_') && AllowedMetaFields[key].inputType === 'string') {
          (0,_component_TranslateSeoFields_YoastSeoFields_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
            key: key,
            value: translatedMetaFields
          });
        } else if (key.startsWith('rank_math_') && AllowedMetaFields[key].inputType === 'string') {
          (0,_component_TranslateSeoFields_RankMathSeo_js__WEBPACK_IMPORTED_MODULE_3__["default"])({
            key: key,
            value: translatedMetaFields
          });
        } else if (key.startsWith('_seopress_') && AllowedMetaFields[key].inputType === 'string') {
          (0,_component_TranslateSeoFields_SeoPress_js__WEBPACK_IMPORTED_MODULE_4__["default"])({
            key: key,
            value: translatedMetaFields
          });
        } else {
          editPost({
            meta: {
              [key]: translatedMetaFields
            }
          });
        }
      }
      ;
    });
  };

  /**
   * Updates the post ACF fields based on translation.
   */
  const postAcfFieldsUpdate = () => {
    const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-lmatMachineTranslate/translate').getAllowedMetaFields();
    const metaFieldsData = postContent.metaFields;
    if (window.acf) {
      acf.getFields().forEach(field => {
        if (field.data && field.data.key && Object.keys(AllowedMetaFields).includes(field.data.key)) {
          const acfFieldObj = acf.getField(field.data.key);
          const fieldKey = field.data.key;
          const fieldName = field.data.name;
          const inputType = acfFieldObj.data.type;
          const sourceValue = metaFieldsData[fieldName] ? metaFieldsData[fieldName][0] : acf.getField(fieldKey)?.val();
          const translatedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-lmatMachineTranslate/translate').getTranslatedString('metaFields', sourceValue, fieldKey, service);
          if ('wysiwyg' === inputType && tinymce) {
            const editorId = acfFieldObj.data.id;
            tinymce.get(editorId)?.setContent(translatedMetaFields);
          } else {
            acf.getField(fieldKey)?.val(translatedMetaFields);
          }
        }
      });
    }
  };

  /**
   * Updates the post content based on translation.
   */
  const postContentUpdate = () => {
    const postContentData = postContent.content;
    if (postContentData.length <= 0) {
      return;
    }
    Object.values(postContentData).forEach(block => {
      (0,_createBlock_js__WEBPACK_IMPORTED_MODULE_0__["default"])(block, service);
    });
  };

  // Update post title and excerpt text
  postDataUpdate();
  // Update post meta fields
  postMetaFieldsUpdate();
  // Update post ACF fields
  postAcfFieldsUpdate();
  // Update post content
  postContentUpdate();
  // Close string modal box
  modalClose();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (translatePost);

/***/ }),

/***/ "./modules/page-translation/src/global-store/actions.js":
/*!**************************************************************!*\
  !*** ./modules/page-translation/src/global-store/actions.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allowedMetaFields: () => (/* binding */ allowedMetaFields),
/* harmony export */   contentSaveSource: () => (/* binding */ contentSaveSource),
/* harmony export */   contentSaveTranslate: () => (/* binding */ contentSaveTranslate),
/* harmony export */   excerptSaveSource: () => (/* binding */ excerptSaveSource),
/* harmony export */   excerptSaveTranslate: () => (/* binding */ excerptSaveTranslate),
/* harmony export */   metaFieldsSaveSource: () => (/* binding */ metaFieldsSaveSource),
/* harmony export */   metaFieldsSaveTranslate: () => (/* binding */ metaFieldsSaveTranslate),
/* harmony export */   setBlockRules: () => (/* binding */ setBlockRules),
/* harmony export */   titleSaveSource: () => (/* binding */ titleSaveSource),
/* harmony export */   titleSaveTranslate: () => (/* binding */ titleSaveTranslate),
/* harmony export */   translationInfo: () => (/* binding */ translationInfo)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./modules/page-translation/src/global-store/types.js");
 // Importing action types from the types module

/**
 * Action creator for saving the source title.
 * @param {string} data - The source title to be saved.
 * @returns {Object} The action object containing the type and text.
 */
const titleSaveSource = data => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].sourceTitle,
    // Action type for saving the source title
    text: data // The source title text
  };
};

/**
 * Action creator for saving the translated title.
 * @param {string} data - The translated title to be saved.
 * @param {string} provider - The provider of the translated title.
 * @returns {Object} The action object containing the type, text, and provider.
 */
const titleSaveTranslate = (data, provider) => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedTitle,
    // Action type for saving the translated title
    text: data,
    // The translated title text
    provider: provider // The provider of the translated title
  };
};

/**
 * Action creator for saving the source excerpt.
 * @param {string} data - The source excerpt to be saved.
 * @returns {Object} The action object containing the type and text.
 */
const excerptSaveSource = data => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].sourceExcerpt,
    // Action type for saving the source excerpt
    text: data // The source excerpt text
  };
};

/**
 * Action creator for saving the translated excerpt.
 * @param {string} data - The translated excerpt to be saved.
 * @param {string} provider - The provider of the translated excerpt.
 * @returns {Object} The action object containing the type, text, and provider.
 */
const excerptSaveTranslate = (data, provider) => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedExcerpt,
    // Action type for saving the translated excerpt
    text: data,
    // The translated excerpt text
    provider: provider // The provider of the translated excerpt
  };
};

/**
 * Action creator for saving the source content.
 * @param {string} id - The identifier for the content.
 * @param {string} data - The source content to be saved.
 * @returns {Object} The action object containing the type, text, and id.
 */
const contentSaveSource = (id, data) => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].sourceContent,
    // Action type for saving the source content
    text: data,
    // The source content text
    id: id // The identifier for the content
  };
};

/**
 * Action creator for saving the translated content.
 * @param {string} id - The identifier for the content.
 * @param {string} data - The translated content to be saved.
 * @param {string} source - The source of the translated content.
 * @param {string} provider - The provider of the translated content.
 * @returns {Object} The action object containing the type, text, id, source, and provider.
 */
const contentSaveTranslate = (id, data, source, provider) => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedContent,
    // Action type for saving the translated content
    text: data,
    // The translated content text
    id: id,
    // The identifier for the content
    source: source,
    // The source of the translated content
    provider: provider // The provider of the translated content
  };
};

/**
 * Action creator for saving the source meta fields.
 * @param {string} id - The identifier for the meta fields.
 * @param {Object} data - The source meta fields to be saved.
 * @returns {Object} The action object containing the type, text, and id.
 */
const metaFieldsSaveSource = (id, data) => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].sourceMetaFields,
    // Action type for saving the source meta fields
    text: data,
    // The source meta fields text
    id: id // The identifier for the meta fields
  };
};

/**
 * Action creator for saving the translated meta fields.
 * @param {string} id - The identifier for the meta fields.
 * @param {Object} data - The translated meta fields to be saved.
 * @param {string} source - The source of the translated meta fields.
 * @param {string} provider - The provider of the translated meta fields.
 * @returns {Object} The action object containing the type, text, id, source, and provider.
 */
const metaFieldsSaveTranslate = (id, data, source, provider) => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedMetaFields,
    // Action type for saving the translated meta fields
    text: data,
    // The translated meta fields text
    id: id,
    // The identifier for the meta fields
    source: source,
    // The source of the translated meta fields
    provider: provider // The provider of the translated meta fields
  };
};

/**
 * Action creator for saving the block rules.
 * @param {Object} data - The block rules to be saved.
 * @returns {Object} The action object containing the type and data.
 */
const setBlockRules = data => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].setBlockRules,
    // Action type for saving the block rules
    data: data // The block rules data
  };
};

/**
 * Action creator for saving the translation info.
 * @param {Object} data - The translation info to be saved.
 * @returns {Object} The action object containing the type and data.
 */
const translationInfo = ({
  sourceStringCount = null,
  sourceWordCount = null,
  sourceCharacterCount = null,
  timeTaken = null,
  provider = null,
  targetStringCount = null,
  targetWordCount = null,
  targetCharacterCount = null,
  translateStatus = null
}) => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].translationInfo,
    // Action type for saving the translation info
    sourceStringCount: sourceStringCount,
    sourceWordCount: sourceWordCount,
    sourceCharacterCount: sourceCharacterCount,
    // The character count
    timeTaken: timeTaken,
    // The time taken
    targetStringCount: targetStringCount,
    targetWordCount: targetWordCount,
    targetCharacterCount: targetCharacterCount,
    provider: provider,
    // The provider
    translateStatus: translateStatus // The translate status
  };
};

/**
 * Action creator for saving the allowed meta fields.
 * @param {Object} data - The allowed meta fields to be saved.
 * @returns {Object} The action object containing the type and data.
 */
const allowedMetaFields = ({
  id,
  type
}) => {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].allowedMetaFields,
    id: id,
    inputType: type
  };
};

/***/ }),

/***/ "./modules/page-translation/src/global-store/index.js":
/*!************************************************************!*\
  !*** ./modules/page-translation/src/global-store/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reducer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reducer.js */ "./modules/page-translation/src/global-store/reducer.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions.js */ "./modules/page-translation/src/global-store/actions.js");
/* harmony import */ var _selectors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors.js */ "./modules/page-translation/src/global-store/selectors.js");
/**
 * This module sets up a Redux store for the automatic translation block.
 * It imports the necessary reducer, actions, and selectors, and then
 * creates and registers the Redux store with the WordPress data system.
 */

// Import the reducer function from the reducer module, which handles state changes.


// Import all action creators from the actions module, which define how to interact with the store.


// Import all selector functions from the selectors module, which allow us to retrieve specific pieces of state.


// Destructure the createReduxStore and register functions from the wp.data object provided by WordPress.
const {
  createReduxStore,
  register
} = wp.data;

// Create a Redux store named 'block-lmatMachineTranslate/translate' with the specified reducer, actions, and selectors.
const store = createReduxStore('block-lmatMachineTranslate/translate', {
  reducer: _reducer_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  // The reducer function to manage state updates.
  actions: _actions_js__WEBPACK_IMPORTED_MODULE_1__,
  // The action creators for dispatching actions to the store.
  selectors: _selectors_js__WEBPACK_IMPORTED_MODULE_2__ // The selectors for accessing specific state values.
});

// Register the created store with the WordPress data system, making it available for use in the application.
register(store);

/***/ }),

/***/ "./modules/page-translation/src/global-store/reducer.js":
/*!**************************************************************!*\
  !*** ./modules/page-translation/src/global-store/reducer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./modules/page-translation/src/global-store/types.js");
 // Importing action types from the types module

/**
 * The default state for the translation reducer.
 * This state holds the initial values for title, excerpt, content, and metaFields.
 * 
 * @type {Object}
 * @property {Object} title - Contains source and target translations for the title.
 * @property {Object} excerpt - Contains source and target translations for the excerpt.
 * @property {Array} content - An array holding content translations.
 * @property {Object} metaFields - Contains source and target translations for meta fields.
 */
const TranslateDefaultState = {
  title: {},
  // Initial state for title translations
  excerpt: {},
  // Initial state for excerpt translations
  content: [],
  // Initial state for content translations
  metaFields: {},
  // Initial state for meta field translations
  allowedMetaFields: {} // Initial state for allowed meta fields
};

/**
 * The reducer function for handling translation actions.
 * This function updates the state based on the action type received.
 * 
 * @param {Object} state - The current state of the reducer.
 * @param {Object} action - The action dispatched to the reducer.
 * @returns {Object} The new state after applying the action.
 */
const reducer = (state = TranslateDefaultState, action) => {
  switch (action.type) {
    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].sourceTitle:
      // Action to save the source title
      // Check if the action text contains any letters or numbers
      if (/[\p{L}\p{N}]/gu.test(action.text)) {
        // Update the state with the new source title
        return {
          ...state,
          title: {
            ...state.title,
            source: action.text
          }
        };
      }
      return state;
    // Return the current state if no valid text

    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedTitle:
      // Action to save the translated title
      // Update the state with the new target title
      return {
        ...state,
        title: {
          ...state.title,
          translatedData: {
            ...(state.title.translatedData || []),
            [action.provider]: action.text
          }
        }
      };
    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].sourceExcerpt:
      // Action to save the source excerpt
      // Check if the action text contains any letters or numbers
      if (/[\p{L}\p{N}]/gu.test(action.text)) {
        // Update the state with the new source excerpt
        return {
          ...state,
          excerpt: {
            ...state.excerpt,
            source: action.text
          }
        };
      }
      return state;
    // Return the current state if no valid text

    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedExcerpt:
      // Action to save the translated excerpt
      // Update the state with the new target excerpt
      return {
        ...state,
        excerpt: {
          ...state.excerpt,
          translatedData: {
            ...(state.excerpt.translatedData || []),
            [action.provider]: action.text
          }
        }
      };
    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].sourceContent:
      // Action to save the source content
      // Check if the action text contains any letters or numbers
      if (/[\p{L}\p{N}]/gu.test(action.text)) {
        // Update the state with the new source content for the specific ID
        return {
          ...state,
          content: {
            ...state.content,
            [action.id]: {
              ...(state.content[action.id] || []),
              source: action.text
            }
          }
        };
      }
      return state;
    // Return the current state if no valid text

    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedContent:
      // Action to save the translated content
      // Check if the source of the content matches the action source
      if (state.content[action.id].source === action.source) {
        // Update the state with the new target content for the specific ID
        return {
          ...state,
          content: {
            ...state.content,
            [action.id]: {
              ...(state.content[action.id] || []),
              translatedData: {
                ...(state.content[action.id].translatedData || []),
                [action.provider]: action.text
              }
            }
          }
        };
      }
      return state;
    // Return the current state if no match

    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].sourceMetaFields:
      // Action to save the source meta fields
      // Check if the action text contains any letters or numbers
      if (/[\p{L}\p{N}]/gu.test(action.text)) {
        // Update the state with the new source meta field for the specific ID
        return {
          ...state,
          metaFields: {
            ...state.metaFields,
            [action.id]: {
              ...(state.metaFields[action.id] || []),
              source: action.text
            }
          }
        };
      }
      return state;
    // Return the current state if no valid text

    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedMetaFields:
      // Action to save the translated meta fields
      // Update the state with the new target meta field for the specific ID
      return {
        ...state,
        metaFields: {
          ...state.metaFields,
          [action.id]: {
            ...(state.metaFields[action.id] || []),
            translatedData: {
              ...(state.metaFields[action.id].translatedData || []),
              [action.provider]: action.text
            }
          }
        }
      };
    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].setBlockRules:
      // Action to save the block rules
      // Update the state with the new block rules
      return {
        ...state,
        blockRules: action.data
      };
    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].translationInfo:
      // Action to save the translation info
      // Update the state with the new translation info
      const data = {};

      // Source String Count
      action.sourceStringCount && (data.sourceStringCount = action.sourceStringCount);
      // Source Word Count
      action.sourceWordCount && (data.sourceWordCount = action.sourceWordCount);
      // Source Character Count
      action.sourceCharacterCount && (data.sourceCharacterCount = action.sourceCharacterCount);

      // Save the translation info like target word count, target character count, translate status, time taken
      if ((action.targetWordCount || action.targetCharacterCount || action.translateStatus || action.timeTaken) && action.provider) {
        data.translateData = {
          ...(state.translationInfo?.translateData || {}),
          [action.provider]: {
            // If the provider already exists, update the existing provider data    
            ...(state.translationInfo?.translateData?.[action.provider] || {}),
            // Update the source string count
            ...(action.targetStringCount && {
              targetStringCount: action.targetStringCount
            }),
            // Update the target word count, target character count, translate status, time taken
            ...(action.targetWordCount && {
              targetWordCount: action.targetWordCount
            }),
            // Update the target character count
            ...(action.targetCharacterCount && {
              targetCharacterCount: action.targetCharacterCount
            }),
            // Update the translate status
            ...(action.translateStatus && {
              translateStatus: action.translateStatus
            }),
            // Update the time taken
            ...(action.timeTaken && {
              timeTaken: action.timeTaken
            })
          }
        };
      }
      return {
        ...state,
        translationInfo: {
          ...state.translationInfo,
          ...data
        }
      };
    case _types_js__WEBPACK_IMPORTED_MODULE_0__["default"].allowedMetaFields:
      // Action to save the allowed meta fields
      // Update the state with the new allowed meta fields
      return {
        ...state,
        allowedMetaFields: {
          ...state.allowedMetaFields,
          [action.id]: {
            ...(state.allowedMetaFields[action.id] || []),
            inputType: action.inputType
          }
        }
      };
    default:
      // If the action type does not match any case
      return state;
    // Return the current state unchanged
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reducer); // Exporting the reducer as the default export

/***/ }),

/***/ "./modules/page-translation/src/global-store/selectors.js":
/*!****************************************************************!*\
  !*** ./modules/page-translation/src/global-store/selectors.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAllowedMetaFields: () => (/* binding */ getAllowedMetaFields),
/* harmony export */   getBlockRules: () => (/* binding */ getBlockRules),
/* harmony export */   getTranslatedString: () => (/* binding */ getTranslatedString),
/* harmony export */   getTranslationEntry: () => (/* binding */ getTranslationEntry),
/* harmony export */   getTranslationInfo: () => (/* binding */ getTranslationInfo)
/* harmony export */ });
/**
 * Retrieves the translation entries from the given state.
 *
 * This function extracts translation entries for the title, excerpt, meta fields, and content
 * from the provided state object and returns them as an array of translation entry objects.
 *
 * @param {Object} state - The state object containing translation data.
 * @param {Object} state.title - The title object containing source and target translations.
 * @param {Object} state.excerpt - The excerpt object containing source and target translations.
 * @param {Object} state.metaFields - An object containing meta field translations, where each key is a meta field ID.
 * @param {Object} state.content - An object containing content translations, where each key is a content ID.
 * @returns {Array<Object>} An array of translation entry objects, each containing the following properties:
 *   @property {string} id - The identifier of the translation entry.
 *   @property {string} source - The source text of the translation entry.
 *   @property {string} type - The type of the translation entry (e.g., 'title', 'excerpt', 'metaFields', 'content').
 *   @property {string} translatedData - The target text of the translation entry (default is an empty string if not provided).
 */
const getTranslationEntry = state => {
  // Initialize an empty array to hold translation entries
  const translateEntry = new Array();
  if (state.title.source) {
    // Push the title translation entry into the array
    translateEntry.push({
      id: 'title',
      // Identifier for the entry
      source: state.title.source,
      // Source text for the title
      type: 'title',
      // Type of the entry
      translatedData: state.title.translatedData || {} // translated text for the title, defaulting to an empty string if not provided
    });
  }
  if (state.excerpt.source) {
    // Push the excerpt translation entry into the array
    translateEntry.push({
      id: 'excerpt',
      // Identifier for the entry
      source: state.excerpt.source,
      // Source text for the excerpt
      type: 'excerpt',
      // Type of the entry
      translatedData: state.excerpt.translatedData || {} // translated text for the excerpt, defaulting to an empty string if not provided
    });
  }

  // Iterate over the metaFields object keys and push each translation entry into the array
  Object.keys(state.metaFields).map(key => {
    translateEntry.push({
      type: 'metaFields',
      // Type of the entry
      id: key,
      // Identifier for the meta field
      source: state.metaFields[key].source,
      // Source text for the meta field
      translatedData: state.metaFields[key].translatedData || {} // translated text for the meta field, defaulting to an empty string if not provided
    });
  });

  // Iterate over the content object keys and push each translation entry into the array
  Object.keys(state.content).map(key => {
    translateEntry.push({
      type: 'content',
      // Type of the entry
      id: key,
      // Identifier for the content
      source: state.content[key].source,
      // Source text for the content
      translatedData: state.content[key].translatedData || {} // translated text for the content, defaulting to an empty string if not provided
    });
  });

  // Return the array of translation entries
  return translateEntry;
};

/**
 * Retrieves the block rules from the given state.
 * @param {Object} state - The state object containing translation data.
 * @returns {Object} The block rules data.
 */
const getBlockRules = state => {
  return state.blockRules;
};

/**
 * Retrieves the translated string from the given state.
 *
 * This function extracts the translated string for a given type (title, excerpt, metaFields, or content)
 * from the provided state object and returns it.
 *
 * @param {Object} state - The state object containing translation data.
 * @param {string} type - The type of the translation entry (e.g., 'title', 'excerpt', 'metaFields', 'content').
 * @param {string} source - The source text of the translation entry.
 * @param {string} id - The identifier of the translation entry (optional, used for metaFields and content).
 * @param {string} provider - The provider of the translation (optional, used for metaFields and content).
 * @returns {string} The translated string for the given type and source, or the original source text if no translation is found.
 */
const getTranslatedString = (state, type, source, id = null, provider = null) => {
  // Check if the type is 'title' or 'excerpt' and if the source matches
  if (['title', 'excerpt'].includes(type) && state[type].source === source && state[type].translatedData && state[type].translatedData[provider]) {
    return state[type]?.translatedData[provider] || state[type]?.source; // Return the translatedData if it matches
  }
  // Check if the type is 'metaFields' and if the source matches
  else if (type === 'metaFields' && state.metaFields && state.metaFields[id] && state.metaFields[id].source === source && state.metaFields[id].translatedData && state.metaFields[id].translatedData[provider]) {
    // Return the target text if it exists, otherwise return the source text
    return undefined !== state.metaFields[id]?.translatedData[provider] ? state.metaFields[id]?.translatedData[provider] : state.metaFields[id]?.source;
  }
  // Check if the type is 'content' and if the source matches
  else if (type === 'content' && state.content && state.content[id] && state.content[id].source === source && state.content[id].translatedData && state.content[id].translatedData[provider]) {
    // Return the target text if it exists, otherwise return the source text
    return undefined !== state.content[id]?.translatedData[provider] ? state.content[id]?.translatedData[provider] : state.content[id]?.source;
  }
  // If no matches, return the original source text
  return source;
};

/**
 * Retrieves the translation info from the given state.
 * @param {Object} state - The state object containing translation data.
 * @returns {Object} The translation info.
 */
const getTranslationInfo = state => {
  return {
    sourceStringCount: state?.translationInfo?.sourceStringCount || 0,
    sourceWordCount: state?.translationInfo?.sourceWordCount || 0,
    sourceCharacterCount: state?.translationInfo?.sourceCharacterCount || 0,
    translateData: state?.translationInfo?.translateData || {}
  };
};

/** 
 * Retrieves the allowed meta fields from the given state.
 * @param {Object} state - The state object containing translation data.
 * @returns {Object} The allowed meta fields.
 */
const getAllowedMetaFields = state => {
  return state.allowedMetaFields || {};
};

/***/ }),

/***/ "./modules/page-translation/src/global-store/types.js":
/*!************************************************************!*\
  !*** ./modules/page-translation/src/global-store/types.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * LmatMachineTranslateActionTypes is an object that defines the action types used in the 
 * automatic translation feature of the application. Each property in this 
 * object corresponds to a specific action that can be dispatched to the 
 * global store, allowing the application to manage the state related to 
 * source and translated content effectively.
 */
const LmatMachineTranslateActionTypes = {
  // Action type for saving the title of the source content
  sourceTitle: 'SAVE_SOURCE_TITLE',
  // Action type for saving the title of the translated content
  traslatedTitle: 'SAVE_TRANSLATE_TITLE',
  // Action type for saving the excerpt of the source content
  sourceExcerpt: 'SAVE_SOURCE_EXCERPT',
  // Action type for saving the excerpt of the translated content
  traslatedExcerpt: 'SAVE_TRANSLATE_EXCERPT',
  // Action type for saving the main content of the source
  sourceContent: 'SAVE_SOURCE_CONTENT',
  // Action type for saving the main content of the translated content
  traslatedContent: 'SAVE_TRANSLATE_CONTENT',
  // Action type for saving the meta fields of the source content
  sourceMetaFields: 'SAVE_SOURCE_META_FIELDS',
  // Action type for saving the meta fields of the translated content
  traslatedMetaFields: 'SAVE_TRANSLATE_META_FIELDS',
  // Action type for saving the block rules
  setBlockRules: 'SET_BLOCK_RULES',
  // Action type for saving the translatio info of the translated content
  translationInfo: 'SAVE_TRANSLATE_INFO',
  // Action type for saving the allowed meta fields
  allowedMetaFields: 'ALLOWED_META_FIELDS'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LmatMachineTranslateActionTypes);

/***/ }),

/***/ "./modules/page-translation/src/helper/index.js":
/*!******************************************************!*\
  !*** ./modules/page-translation/src/helper/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateTranslateData: () => (/* binding */ updateTranslateData)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");

const updateTranslateData = ({
  provider,
  sourceLang,
  targetLang,
  postId
}) => {
  const translateData = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-lmatMachineTranslate/translate').getTranslationInfo();
  const totalStringCount = translateData.translateData?.[provider]?.targetStringCount || 0;
  const totalWordCount = translateData.translateData?.[provider]?.targetWordCount || 0;
  const totalCharacterCount = translateData.translateData?.[provider]?.targetCharacterCount || 0;
  const timeTaken = translateData.translateData?.[provider]?.timeTaken || 0;
  const sourceWordCount = translateData?.sourceWordCount || 0;
  const sourceCharacterCount = translateData?.sourceCharacterCount || 0;
  const sourceStringCount = translateData?.sourceStringCount || 0;
  const editorType = lmatPageTranslationGlobal.editor_type;
  const date = new Date().toISOString();
  const data = {
    provider,
    totalStringCount,
    totalWordCount,
    totalCharacterCount,
    editorType,
    date,
    sourceStringCount,
    sourceWordCount,
    sourceCharacterCount,
    sourceLang,
    targetLang,
    timeTaken,
    action: lmatPageTranslationGlobal.update_translate_data,
    update_translation_key: lmatPageTranslationGlobal.update_translation_check,
    post_id: postId
  };
  fetch(lmatPageTranslationGlobal.ajax_url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(data)
  }).then(response => response.json()).then(data => {
    console.log(data.data.message);
  }).catch(error => {
    console.error(error);
  });
};

/***/ }),

/***/ "./modules/page-translation/src/index.css":
/*!************************************************!*\
  !*** ./modules/page-translation/src/index.css ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./modules/page-translation/src/popupSettingModal/body.js":
/*!****************************************************************!*\
  !*** ./modules/page-translation/src/popupSettingModal/body.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _providers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./providers.js */ "./modules/page-translation/src/popupSettingModal/providers.js");
/* harmony import */ var _component_TranslateProvider_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component/TranslateProvider/index.js */ "./modules/page-translation/src/component/TranslateProvider/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");




const SettingModalBody = props => {
  const ServiceProviders = (0,_component_TranslateProvider_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "lmat-page-translation-setting-modal-body",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "lmat-page-translation-setting-modal-notice-wrapper"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("table", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("thead", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("th", {
            children: "Name"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("th", {
            children: "Translate"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("th", {
            children: "Docs"
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("tbody", {
        children: Object.keys(ServiceProviders).map(provider => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_providers_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
          ...props,
          Service: provider
        }, provider))
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingModalBody);

/***/ }),

/***/ "./modules/page-translation/src/popupSettingModal/footer.js":
/*!******************************************************************!*\
  !*** ./modules/page-translation/src/popupSettingModal/footer.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");


const SettingModalFooter = props => {
  const {
    targetLangName,
    postType,
    sourceLangName,
    setSettingVisibility
  } = props;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "modal-footer",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "lmat-page-translation-error-message",
      style: {
        marginBottom: '.5rem'
      },
      children: sprintf((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("This will replace your current %(postType)s with a %(target)s translation of the original %(source)s content.", 'automatic-translations-for-polylang-pro'), {
        postType: postType,
        source: sourceLangName,
        target: targetLangName
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
      className: "lmat-page-translation-setting-close button button-primary",
      onClick: () => setSettingVisibility(false),
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Close", 'automatic-translations-for-polylang-pro')
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingModalFooter);

/***/ }),

/***/ "./modules/page-translation/src/popupSettingModal/header.js":
/*!******************************************************************!*\
  !*** ./modules/page-translation/src/popupSettingModal/header.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");


const SettingModalHeader = ({
  setSettingVisibility
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "modal-header",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Step 1 - Select Translation Provider", 'automatic-translations-for-polylang-pro')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "close",
      onClick: () => setSettingVisibility(false),
      children: "\xD7"
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingModalHeader);

/***/ }),

/***/ "./modules/page-translation/src/popupSettingModal/index.js":
/*!*****************************************************************!*\
  !*** ./modules/page-translation/src/popupSettingModal/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _popupStringModal_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../popupStringModal/index.js */ "./modules/page-translation/src/popupStringModal/index.js");
/* harmony import */ var _component_TranslateProvider_google_google_language_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component/TranslateProvider/google/google-language.js */ "./modules/page-translation/src/component/TranslateProvider/google/google-language.js");
/* harmony import */ var _header_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./header.js */ "./modules/page-translation/src/popupSettingModal/header.js");
/* harmony import */ var _body_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./body.js */ "./modules/page-translation/src/popupSettingModal/body.js");
/* harmony import */ var _footer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./footer.js */ "./modules/page-translation/src/popupSettingModal/footer.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _component_ErrorModalBox_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../component/ErrorModalBox/index.js */ "./modules/page-translation/src/component/ErrorModalBox/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");










const SettingModal = props => {
  const [targetBtn, setTargetBtn] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [modalRender, setModalRender] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
  const [settingVisibility, setSettingVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const sourceLang = lmatPageTranslationGlobal.source_lang;
  const targetLang = props.targetLang;
  const sourceLangName = lmatPageTranslationGlobal.languageObject[sourceLang]['name'];
  const targetLangName = lmatPageTranslationGlobal.languageObject[targetLang]['name'];
  const imgFolder = lmatPageTranslationGlobal.lmat_url + 'Admin/Assets/images/';
  const googleSupport = (0,_component_TranslateProvider_google_google_language_js__WEBPACK_IMPORTED_MODULE_3__["default"])().includes(targetLang === 'zh' ? lmatPageTranslationGlobal.languageObject['zh']?.locale.replace('_', '-') : targetLang);
  const [serviceModalErrors, setServiceModalErrors] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [errorModalVisibility, setErrorModalVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [chromeAiBtnDisabled, setChromeAiBtnDisabled] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const openModalOnLoadHandler = e => {
    e.preventDefault();
    const btnElement = e.target;
    const visibility = btnElement.dataset.value;
    if (visibility === 'yes') {
      setSettingVisibility(true);
    }
    btnElement.closest('#lmat-page-translation-modal-open-warning-wrapper').remove();
  };
  const closeErrorModal = () => {
    setErrorModalVisibility(false);
  };
  const openErrorModalHandler = service => {
    setSettingVisibility(false);
    setErrorModalVisibility(service);
  };

  /**
   * useEffect hook to set settingVisibility.
   * Triggers the setSettingVisibility only when user click on meta field Button.
  */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const firstRenderBtns = document.querySelectorAll('#lmat-page-translation-modal-open-warning-wrapper .modal-content div[data-value]');
    const metaFieldBtn = document.querySelector(props.translateWrpSelector);
    if (metaFieldBtn) {
      metaFieldBtn.addEventListener('click', e => {
        e.preventDefault();
        setSettingVisibility(prev => !prev);
      });
    }
    firstRenderBtns.forEach(ele => {
      if (ele) {
        ele.addEventListener('click', openModalOnLoadHandler);
      }
    });
  }, []);

  /**
   * useEffect hook to check if the local AI translator is supported.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (settingVisibility) {
      if (!googleSupport) {
        setServiceModalErrors(prev => ({
          ...prev,
          google: {
            message: "<p style={{ fontSize: '1rem', color: '#ff4646' }}>" + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)("Google Translate does not support the target language: %s.", 'linguator-multilingual-ai-translation'), "<strong>" + targetLangName + "</strong>") + "</p>",
            Title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)("Google Translate", 'linguator-multilingual-ai-translation')
          }
        }));
      }
    }
  }, [settingVisibility]);

  /**
   * useEffect hook to handle displaying the modal and rendering the PopStringModal component.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const btn = targetBtn;
    const service = btn.dataset && btn.dataset.service;
    const serviceLabel = btn.dataset && btn.dataset.serviceLabel;
    const postId = props.postId;
    const parentWrp = document.getElementById("lmat_page_translation_strings_model");
    if (parentWrp) {
      // Store root instance in a ref to avoid recreating it
      if (!parentWrp._reactRoot) {
        parentWrp._reactRoot = react_dom_client__WEBPACK_IMPORTED_MODULE_0__.createRoot(parentWrp);
      }
      if (modalRender) {
        parentWrp._reactRoot.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_popupStringModal_index_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
          currentPostId: props.currentPostId,
          postId: postId,
          service: service,
          serviceLabel: serviceLabel,
          sourceLang: sourceLang,
          targetLang: targetLang,
          modalRender: modalRender,
          pageTranslate: props.pageTranslate,
          postDataFetchStatus: props.postDataFetchStatus,
          fetchPostData: props.fetchPostData,
          translatePost: props.translatePost,
          contentLoading: props.contentLoading,
          updatePostDataFetch: props.updatePostDataFetch,
          stringModalBodyNotice: props.stringModalBodyNotice
        }));
      }
    }
  }, [props.postDataFetchStatus, modalRender]);

  /**
   * Function to handle fetching content based on the target button clicked.
   * Sets the target button and updates the fetch status to true.
   * @param {Event} e - The event object representing the button click.
   */
  const fetchContent = async e => {
    let targetElement = !e.target.classList.contains('lmat-page-translation-service-btn') ? e.target.closest('.lmat-page-translation-service-btn') : e.target;
    if (!targetElement) {
      return;
    }
    setSettingVisibility(false);
    setModalRender(prev => prev + 1);
    setTargetBtn(targetElement);
  };
  const handleSettingVisibility = visibility => {
    setSettingVisibility(visibility);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
    children: [errorModalVisibility && serviceModalErrors[errorModalVisibility] && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_component_ErrorModalBox_index_js__WEBPACK_IMPORTED_MODULE_8__["default"], {
      onClose: closeErrorModal,
      ...serviceModalErrors[errorModalVisibility]
    }), settingVisibility && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "modal-container",
      style: {
        display: settingVisibility ? 'flex' : 'none'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "lmat-page-translation-settings modal-content",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_header_js__WEBPACK_IMPORTED_MODULE_4__["default"], {
          setSettingVisibility: handleSettingVisibility,
          postType: props.postType,
          sourceLangName: sourceLangName,
          targetLangName: targetLangName
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_body_js__WEBPACK_IMPORTED_MODULE_5__["default"], {
          googleDisabled: !googleSupport,
          fetchContent: fetchContent,
          imgFolder: imgFolder,
          targetLangName: targetLangName,
          postType: props.postType,
          sourceLangName: sourceLangName,
          openErrorModalHandler: openErrorModalHandler
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_footer_js__WEBPACK_IMPORTED_MODULE_6__["default"], {
          targetLangName: targetLangName,
          postType: props.postType,
          sourceLangName: sourceLangName,
          setSettingVisibility: handleSettingVisibility
        })]
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingModal);

/***/ }),

/***/ "./modules/page-translation/src/popupSettingModal/providers.js":
/*!*********************************************************************!*\
  !*** ./modules/page-translation/src/popupSettingModal/providers.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_TranslateProvider_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/TranslateProvider/index.js */ "./modules/page-translation/src/component/TranslateProvider/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");


const Providers = props => {
  const service = props.Service;
  const buttonDisable = props[service + "Disabled"];
  const ActiveService = (0,_component_TranslateProvider_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    Service: service,
    [service + "ButtonDisabled"]: buttonDisable,
    openErrorModalHandler: props.openErrorModalHandler
  });
  const serviceId = service.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const btnId = `lmat-page-translation-${serviceId}-btn`;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("td", {
      className: "lmat-page-translation-provider-name",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
        src: `${props.imgFolder}${ActiveService.Logo}`,
        alt: ActiveService.title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        children: ActiveService.title
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
      children: ActiveService.ButtonDisabled ? ActiveService.ErrorMessage : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        id: btnId,
        onClick: props.fetchContent,
        className: "lmat-page-translation-service-btn button button-primary",
        "data-service": service,
        "data-service-label": ActiveService.ServiceLabel,
        children: ActiveService.SettingBtnText
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
        href: ActiveService.Docs,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "lmat-page-translation-doc-icon",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg", {
          width: "9",
          height: "12",
          viewBox: "0 0 9 12",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
            d: "M2.17607 6.20533H6.82393V5.53867H2.17607V6.20533ZM2.17607 8.05133H6.82393V7.38467H2.17607V8.05133ZM2.17607 9.898H4.89536V9.23133H2.17607V9.898ZM1.03821 12C0.7425 12 0.495643 11.8973 0.297643 11.692C0.0996427 11.4867 0.000428571 11.2304 0 10.9233V1.07667C0 0.77 0.0992142 0.514 0.297643 0.308667C0.496071 0.103333 0.743143 0.000444444 1.03886 0H6.10714L9 3V10.9233C9 11.23 8.901 11.4862 8.703 11.692C8.505 11.8978 8.25771 12.0004 7.96114 12H1.03821ZM5.78571 3.33333V0.666667H1.03886C0.939857 0.666667 0.849 0.709333 0.766286 0.794666C0.683571 0.88 0.642429 0.974 0.642857 1.07667V10.9233C0.642857 11.0256 0.684 11.1196 0.766286 11.2053C0.848571 11.2911 0.939214 11.3338 1.03821 11.3333H7.96179C8.06036 11.3333 8.151 11.2907 8.23371 11.2053C8.31643 11.12 8.35757 11.0258 8.35714 10.9227V3.33333H5.78571Z",
            fill: "#6F6F6F"
          })
        })
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Providers);

/***/ }),

/***/ "./modules/page-translation/src/popupStringModal/body.js":
/*!***************************************************************!*\
  !*** ./modules/page-translation/src/popupStringModal/body.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _component_FilterTargetContent_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component/FilterTargetContent/index.js */ "./modules/page-translation/src/component/FilterTargetContent/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _component_TranslateProvider_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../component/TranslateProvider/index.js */ "./modules/page-translation/src/component/TranslateProvider/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");







const StringPopUpBody = props => {
  const {
    service: service
  } = props;
  const translateContent = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.select)("block-lmatMachineTranslate/translate").getTranslationEntry();
  const StringModalBodyNotice = props.stringModalBodyNotice;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (['yandex', 'google'].includes(props.service)) {
      document.documentElement.setAttribute('translate', 'no');
      document.body.classList.add('notranslate');
    }

    /**
     * Calls the translate service provider based on the service type.
     * For example, it can call services like yandex Translate.
    */
    const service = props.service;
    const id = `lmat_page_translation_${service}_translate_element`;
    const translateContent = wp.data.select('block-lmatMachineTranslate/translate').getTranslationEntry();
    if (translateContent.length > 0 && props.postDataFetchStatus) {
      const ServiceSetting = (0,_component_TranslateProvider_index_js__WEBPACK_IMPORTED_MODULE_5__["default"])({
        Service: service
      });
      ServiceSetting.Provider({
        sourceLang: props.sourceLang,
        targetLang: props.targetLang,
        translateStatusHandler: props.translateStatusHandler,
        ID: id,
        translateStatus: props.translateStatus,
        modalRenderId: props.modalRender,
        destroyUpdateHandler: props.updateDestroyHandler
      });
    }
  }, [props.modalRender, props.postDataFetchStatus]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: "modal-body",
    children: translateContent.length > 0 && props.postDataFetchStatus ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [StringModalBodyNotice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "lmat-page-translation-body-notice-wrapper",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(StringModalBodyNotice, {})
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "lmat_page_translation_translate_progress",
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Automatic translation is in progress....", 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("br", {}), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("It will take few minutes, enjoy ☕ coffee in this time!", 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("br", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("br", {}), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Please do not leave this window or browser tab while translation is in progress...", 'autopoly-ai-translation-for-polylang')]
      }, props.modalRender), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: `translator-widget ${service}`,
        style: {
          display: 'flex'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("h3", {
          className: "choose-lang",
          children: [(0,_component_TranslateProvider_index_js__WEBPACK_IMPORTED_MODULE_5__["default"])({
            Service: props.service
          }).heading, " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
            className: "dashicons-before dashicons-translation"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: `lmat_page_translation_translate_element_wrapper ${props.translateStatus ? 'translate-completed' : ''}`,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            id: `lmat_page_translation_${props.service}_translate_element`
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "lmat_page_translation_string_container",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("table", {
          className: "scrolldown",
          id: "stringTemplate",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("thead", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("tr", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                className: "notranslate",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("S.No", 'autopoly-ai-translation-for-polylang')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                className: "notranslate",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Source Text", 'autopoly-ai-translation-for-polylang')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
                className: "notranslate",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Translation", 'autopoly-ai-translation-for-polylang')
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("tbody", {
            children: props.postDataFetchStatus && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
              children: translateContent.map((data, index) => {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
                  children: undefined !== data.source && data.source.trim() !== '' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("tr", {
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                        children: index + 1
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                        "data-source": "source_text",
                        children: data.source
                      }), !props.translatePendingStatus ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                        className: "translate",
                        "data-translate-status": "translated",
                        "data-key": data.id,
                        "data-string-type": data.type,
                        children: data.translatedData[props.service]
                      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                        className: "translate",
                        translate: "yes",
                        "data-key": data.id,
                        "data-string-type": data.type,
                        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_component_FilterTargetContent_index_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
                          service: props.service,
                          content: data.source,
                          contentKey: data.id
                        })
                      })]
                    }, index + 'tr' + props.translatePendingStatus)
                  })
                }, index + props.translatePendingStatus);
              })
            })
          })]
        })
      })]
    }) : props.postDataFetchStatus ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No strings are available for translation', 'autopoly-ai-translation-for-polylang')
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "lmat-page-translation-skeleton-loader-wrapper",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "translate-widget",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "lmat-page-translation-skeleton-loader-mini"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "lmat-page-translation-skeleton-loader-mini"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("table", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("thead", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("tr", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
              className: "notranslate",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("S.No", 'autopoly-ai-translation-for-polylang')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
              className: "notranslate",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Source Text", 'autopoly-ai-translation-for-polylang')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("th", {
              className: "notranslate",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Translation", 'autopoly-ai-translation-for-polylang')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("tbody", {
          children: [...Array(10)].map((_, index) => {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("tr", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "lmat-page-translation-skeleton-loader-mini"
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "lmat-page-translation-skeleton-loader-mini"
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("td", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                  className: "lmat-page-translation-skeleton-loader-mini"
                })
              })]
            }, index);
          })
        })]
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpBody);

/***/ }),

/***/ "./modules/page-translation/src/popupStringModal/footer.js":
/*!*****************************************************************!*\
  !*** ./modules/page-translation/src/popupStringModal/footer.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _notice_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notice.js */ "./modules/page-translation/src/popupStringModal/notice.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _component_FormateNumberCount_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component/FormateNumberCount/index.js */ "./modules/page-translation/src/component/FormateNumberCount/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");




const StringPopUpFooter = props => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "modal-footer",
    children: [!props.translatePendingStatus && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_notice_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
      className: "lmat_page_translation_string_count",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Wahooo! You have saved your valuable time via auto translating', 'autopoly-ai-translation-for-polylang'), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_component_FormateNumberCount_index_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
            number: props.characterCount
          })
        }), " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('characters using', 'autopoly-ai-translation-for-polylang'), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
          children: props.serviceLabel
        }), ".", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please share your feedback —', 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
          href: "https://wordpress.org/support/plugin/automatic-translations-for-polylang/reviews/#new-post",
          target: "_blank",
          rel: "noopener",
          style: {
            color: 'yellow'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('leave a quick review', 'autopoly-ai-translation-for-polylang')
        }), "!"]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "save_btn_cont",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
        className: "notranslate save_it button button-primary",
        disabled: props.translatePendingStatus,
        onClick: props.updatePostData,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Update Content", 'autopoly-ai-translation-for-polylang')
      })
    })]
  }, props.modalRender);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpFooter);

/***/ }),

/***/ "./modules/page-translation/src/popupStringModal/header.js":
/*!*****************************************************************!*\
  !*** ./modules/page-translation/src/popupStringModal/header.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");


const StringPopUpHeader = props => {
  /**
   * Function to close the popup modal.
   */
  const closeModal = () => {
    props.setPopupVisibility(false);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "modal-header",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "close",
      onClick: closeModal,
      children: "\xD7"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
      className: "notranslate",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Step 2 - Start Automatic Translation Process", 'autopoly-ai-translation-for-polylang')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "save_btn_cont",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        className: "notranslate save_it button button-primary",
        disabled: props.translatePendingStatus,
        onClick: props.updatePostData,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Update Content", 'autopoly-ai-translation-for-polylang')
      })
    })]
  }, props.modalRender);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpHeader);

/***/ }),

/***/ "./modules/page-translation/src/popupStringModal/index.js":
/*!****************************************************************!*\
  !*** ./modules/page-translation/src/popupStringModal/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _helper_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper/index.js */ "./modules/page-translation/src/helper/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _header_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./header.js */ "./modules/page-translation/src/popupStringModal/header.js");
/* harmony import */ var _body_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./body.js */ "./modules/page-translation/src/popupStringModal/body.js");
/* harmony import */ var _footer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./footer.js */ "./modules/page-translation/src/popupStringModal/footer.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");







const popStringModal = props => {
  let selectedService = props.service;
  const translateData = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('block-lmatMachineTranslate/translate').getTranslationInfo().translateData[selectedService] || false;
  const translateStatus = translateData?.translateStatus || false;
  const [popupVisibility, setPopupVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [refPostData, setRefPostData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [translatePending, setTranslatePending] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [characterCount, setCharacterCount] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(translateData?.targetCharacterCount || 0);
  const [onDestroy, setOnDestroy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const updateDestroyHandler = callback => {
    setOnDestroy(prev => [...prev, callback]);
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!popupVisibility) {
      if (onDestroy.length > 0) {
        onDestroy.forEach(callback => {
          if (typeof callback === 'function') {
            callback();
          }
        });
      }
    }
  }, [popupVisibility, onDestroy]);

  /**
   * Returns the label for the service provider.
   * @returns {string} The label for the service provider.
   */
  const serviceLabel = () => {
    const serviceProvider = props.service;
    if (serviceProvider === 'localAiTranslator') {
      return 'Chrome AI Translator';
    } else {
      return serviceProvider.replace(/^\w/, c => c.toUpperCase()) + ' Translate';
    }
  };

  /**
   * Fetches the post data.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!props.postDataFetchStatus) {
      props.fetchPostData({
        postId: props.postId,
        sourceLang: props.sourceLang,
        targetLang: props.targetLang,
        updatePostDataFetch: props.updatePostDataFetch,
        refPostData: data => setRefPostData(data),
        updateDestroyHandler: updateDestroyHandler
      });
    }
  }, [props.postDataFetchStatus, props.modalRender]);

  /**
   * Updates the post content data.
   * @param {string} data - The data to set as the post content.
   */
  const updatePostContentHandler = data => {
    setRefPostData(data);
  };

  /**
   * Updates the fetch state.
   * @param {boolean} state - The state to update the fetch with.
   */
  const setPopupVisibilityHandler = state => {
    if (props.service === 'yandex') {
      document.querySelector('#lmat_page_translation_yandex_translate_element #yt-widget .yt-button__icon.yt-button__icon_type_right')?.click();
    }
    setTranslatePending(true);
    setPopupVisibility(false);
  };
  const translateStatusHandler = status => {
    let service = props.service;
    const characterCount = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('block-lmatMachineTranslate/translate').getTranslationInfo().translateData[service]?.targetCharacterCount || 0;
    setCharacterCount(characterCount);
    setTranslatePending(status);
  };
  const updatePostDataHandler = () => {
    const postContent = refPostData;
    const modalClose = () => setPopupVisibility(false);
    let service = props.service;
    props.translatePost({
      postContent: postContent,
      modalClose: modalClose,
      service: service
    });
    props.pageTranslate(true);
    (0,_helper_index_js__WEBPACK_IMPORTED_MODULE_1__.updateTranslateData)({
      provider: service,
      sourceLang: props.sourceLang,
      targetLang: props.targetLang,
      postId: props.currentPostId
    });
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setPopupVisibility(true);
    if (translateStatus) {
      setCharacterCount(translateData?.targetCharacterCount || 0);
      setTranslatePending(false);
    }
    setTimeout(() => {
      const stringModal = document.querySelector('.lmat_page_translation_string_container');
      if (stringModal) {
        stringModal.scrollTop = 0;
      }
      ;
    });
  }, [props.modalRender]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [" ", popupVisibility && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      id: `lmat-page-translation-${props.service}-strings-modal`,
      className: "modal-container",
      style: {
        display: popupVisibility ? 'flex' : 'none'
      },
      "data-render-id": props.modalRender,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "modal-content",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_header_js__WEBPACK_IMPORTED_MODULE_3__["default"], {
          modalRender: props.modalRender,
          setPopupVisibility: setPopupVisibilityHandler,
          postContent: refPostData,
          translatePendingStatus: translatePending,
          pageTranslate: props.pageTranslate,
          service: props.service,
          serviceLabel: serviceLabel(),
          updatePostData: updatePostDataHandler,
          characterCount: characterCount
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_body_js__WEBPACK_IMPORTED_MODULE_4__["default"], {
          ...props,
          updatePostContent: updatePostContentHandler,
          contentLoading: props.contentLoading,
          postDataFetchStatus: props.postDataFetchStatus,
          translatePendingStatus: translatePending,
          service: props.service,
          sourceLang: props.sourceLang,
          targetLang: props.targetLang,
          translateStatusHandler: translateStatusHandler,
          modalRender: props.modalRender,
          translateStatus: translateStatus,
          stringModalBodyNotice: props.stringModalBodyNotice,
          updateDestroyHandler: updateDestroyHandler
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_footer_js__WEBPACK_IMPORTED_MODULE_5__["default"], {
          modalRender: props.modalRender,
          setPopupVisibility: setPopupVisibilityHandler,
          postContent: refPostData,
          translatePendingStatus: translatePending,
          pageTranslate: props.pageTranslate,
          service: props.service,
          serviceLabel: serviceLabel(),
          updatePostData: updatePostDataHandler,
          characterCount: characterCount
        })]
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (popStringModal);

/***/ }),

/***/ "./modules/page-translation/src/popupStringModal/notice.js":
/*!*****************************************************************!*\
  !*** ./modules/page-translation/src/popupStringModal/notice.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");

const StringPopUpNotice = props => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: `notice inline notice-info is-dismissible ${props.className}`,
    children: Array.isArray(props.children) ? props.children.join(' ') : props.children
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpNotice);

/***/ }),

/***/ "./modules/page-translation/src/storeSourceString/Elementor/index.js":
/*!***************************************************************************!*\
  !*** ./modules/page-translation/src/storeSourceString/Elementor/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");

const ElementorSaveSource = content => {
  const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-lmatMachineTranslate/translate').getAllowedMetaFields();
  const storeMetaFields = metaFields => {
    Object.keys(metaFields).forEach(metaKey => {
      if (Object.keys(AllowedMetaFields).includes(metaKey) && AllowedMetaFields[metaKey].inputType === 'string') {
        if ('' !== metaFields[metaKey][0] && undefined !== metaFields[metaKey][0]) {
          (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-lmatMachineTranslate/translate').metaFieldsSaveSource(metaKey, metaFields[metaKey][0]);
        }
      }
    });
  };
  const loopCallback = (callback, loop, index) => {
    callback(loop[index], index);
    index++;
    if (index < loop.length) {
      loopCallback(callback, loop, index);
    }
  };
  const translateContent = (ids, value) => {
    if (typeof value === 'string' && value.trim() !== '' && ids.length > 0) {
      const uniqueKey = ids.join('_lmat_page_translation_');
      if (value && '' !== value) {
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-lmatMachineTranslate/translate').contentSaveSource(uniqueKey, value);
      }
    }
  };

  // Define a list of properties to exclude
  const cssProperties = ['content_width', 'title_size', 'font_size', 'margin', 'padding', 'background', 'border', 'color', 'text_align', 'font_weight', 'font_family', 'line_height', 'letter_spacing', 'text_transform', 'border_radius', 'box_shadow', 'opacity', 'width', 'height', 'display', 'position', 'z_index', 'visibility', 'align', 'max_width', 'content_typography_typography', 'flex_justify_content', 'title_color', 'description_color', 'email_content'];
  const substringsToCheck = ['title', 'description', 'editor', 'text', 'content', 'label'];
  const storeWidgetStrings = (element, index, ids = []) => {
    const settings = element.settings;
    ids.push(index);

    // Check if settings is an object
    if (typeof settings === 'object' && settings !== null && Object.keys(settings).length > 0) {
      // Define the substrings to check for translatable content

      const keysLoop = (key, index) => {
        if (cssProperties.some(substring => key.toLowerCase().includes(substring))) {
          return; // Skip this property and continue to the next one
        }
        if (substringsToCheck.some(substring => key.toLowerCase().includes(substring)) && typeof settings[key] === 'string' && settings[key].trim() !== '') {
          translateContent([...ids, 'settings', key], settings[key]);
        }
        if (Array.isArray(settings[key]) && settings[key].length > 0) {
          const settingsLoop = (item, index) => {
            if (typeof item === 'object' && item !== null) {
              const settingsItemsLoop = repeaterKey => {
                if (cssProperties.includes(repeaterKey.toLowerCase())) {
                  return; // Skip this property
                }
                if (substringsToCheck.some(substring => repeaterKey.toLowerCase().includes(substring)) && typeof item[repeaterKey] === 'string' && item[repeaterKey].trim() !== '') {
                  translateContent([...ids, 'settings', key, index, repeaterKey], item[repeaterKey]);
                }
              };
              loopCallback(settingsItemsLoop, Object.keys(item), 0);
            }
          };
          loopCallback(settingsLoop, settings[key], 0);
        }
      };
      loopCallback(keysLoop, Object.keys(settings), 0);
    }

    // If there are nested elements, process them recursively
    if (element.elements && Array.isArray(element.elements) && element.elements.length > 0) {
      const runLoop = (childElement, index) => {
        storeWidgetStrings(childElement, index, [...ids, 'elements']);
      };
      loopCallback(runLoop, element.elements, 0);
    }
  };
  if (content.widgetsContent && content.widgetsContent.length > 0) {
    const runLoop = (element, index) => {
      storeWidgetStrings(element, index, []);
    };
    loopCallback(runLoop, content.widgetsContent, 0);
  }
  storeMetaFields(content.metaFields);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ElementorSaveSource);

/***/ }),

/***/ "./modules/page-translation/src/storeSourceString/Gutenberg/index.js":
/*!***************************************************************************!*\
  !*** ./modules/page-translation/src/storeSourceString/Gutenberg/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_FilterNestedAttr_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component/FilterNestedAttr/index.js */ "./modules/page-translation/src/component/FilterNestedAttr/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");



/**
 * Filters and translates attributes of a block.
 * 
 * @param {string} blockId - The ID of the block.
 * @param {Object} blockAttr - The attributes of the block.
 * @param {Object} filterAttr - The attributes to filter.
 */
const filterTranslateAttr = (blockId, blockAttr, filterAttr) => {
  const filterAttrArr = Object.values(filterAttr);

  /**
   * Saves translated attributes based on the provided ID array and filter attribute object.
   * 
   * @param {Array} idArr - The array of IDs.
   * @param {Object} filterAttrObj - The filter attribute object.
   */
  const saveTranslatedAttr = (idArr, filterAttrObj) => {
    if (true === filterAttrObj) {
      const newIdArr = new Array(...idArr);
      const childIdArr = new Array();
      let dynamicBlockAttr = blockAttr;
      let uniqueId = blockId;
      newIdArr.forEach(key => {
        childIdArr.push(key);
        uniqueId += `lmatMachineTranslate${key}`;
        dynamicBlockAttr = dynamicBlockAttr[key];
      });
      let blockAttrContent = dynamicBlockAttr;
      if (blockAttrContent instanceof wp.richText.RichTextData) {
        blockAttrContent = blockAttrContent.originalHTML;
      }
      if (undefined !== blockAttrContent && blockAttrContent.trim() !== '') {
        let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');
        if (!/[\p{L}\p{N}]/gu.test(blockAttrContent)) {
          return false;
        }
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-lmatMachineTranslate/translate').contentSaveSource(filterKey, blockAttrContent);
      }
      return;
    }
    (0,_component_FilterNestedAttr_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(idArr, filterAttrObj, blockAttr, saveTranslatedAttr);
  };
  filterAttrArr.forEach(data => {
    Object.keys(data).forEach(key => {
      const idArr = new Array(key);
      saveTranslatedAttr(idArr, data[key]);
    });
  });
};
/**
 * Retrieves the translation string for a block based on block rules and applies translation.
 * 
 * @param {Object} block - The block to translate.
 * @param {Object} blockRules - The rules for translating the block.
 */
const getTranslateString = (block, blockRules) => {
  const blockTranslateName = Object.keys(blockRules.LmatBlockParseRules);
  if (!blockTranslateName.includes(block.name)) {
    return;
  }
  filterTranslateAttr(block.clientId, block.attributes, blockRules['LmatBlockParseRules'][block.name]);
};

/**
 * Recursively processes child block attributes for translation.
 * 
 * @param {Array} blocks - The array of blocks to translate.
 * @param {Object} blockRules - The rules for translating the blocks.
 */
const childBlockAttributesContent = (blocks, blockRules) => {
  blocks.forEach(block => {
    getTranslateString(block, blockRules);
    if (block.innerBlocks) {
      childBlockAttributesContent(block.innerBlocks, blockRules);
    }
  });
};

/**
 * Processes the attributes of a block for translation.
 * 
 * @param {Object} parseBlock - The block to parse for translation.
 * @param {Object} blockRules - The rules for translating the block.
 */
const blockAttributeContent = (parseBlock, blockRules) => {
  Object.values(parseBlock).forEach(block => {
    getTranslateString(block, blockRules);
    if (block.innerBlocks) {
      childBlockAttributesContent(block.innerBlocks, blockRules);
    }
  });
};

/**
 * Saves the translation for a block based on its attributes.
 * 
 * @param {Object} block - The block to save translation for.
 * @param {Object} blockRules - The rules for translating the block.
 */
const GutenbergBlockSaveSource = (block, blockRules) => {
  const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-lmatMachineTranslate/translate').getAllowedMetaFields();
  Object.keys(block).forEach(key => {
    if (key === 'content') {
      blockAttributeContent(block[key], blockRules);
    } else if (key === 'metaFields') {
      Object.keys(block[key]).forEach(metaKey => {
        // Store meta fields
        if (Object.keys(AllowedMetaFields).includes(metaKey) && AllowedMetaFields[metaKey].inputType === 'string') {
          if ('' !== block[key][metaKey][0] && undefined !== block[key][metaKey][0]) {
            (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-lmatMachineTranslate/translate').metaFieldsSaveSource(metaKey, block[key][metaKey][0]);
          }
        }
      });

      // Store ACF fields
      if (window.acf) {
        acf.getFields().forEach(field => {
          if (field.data && AllowedMetaFields[field.data.key]) {
            const name = field.data.name;
            const currentValue = acf.getField(field.data.key)?.val();
            if (block[key] && block[key][name]) {
              if ('' !== block[key][name] && undefined !== block[key][name]) {
                (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-lmatMachineTranslate/translate').metaFieldsSaveSource(field.data.key, block[key][name][0]);
              }
            } else if (currentValue && '' !== currentValue && undefined !== currentValue) {
              (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-lmatMachineTranslate/translate').metaFieldsSaveSource(field.data.key, currentValue);
            }
          }
        });
      }
    } else if (['title', 'excerpt'].includes(key)) {
      if (block[key] && block[key].trim() !== '') {
        const action = `${key}SaveSource`;
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-lmatMachineTranslate/translate')[action](block[key]);
      }
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GutenbergBlockSaveSource);

/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************************************!*\
  !*** ./modules/page-translation/src/index.js ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popupSettingModal_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popupSettingModal/index.js */ "./modules/page-translation/src/popupSettingModal/index.js");
/* harmony import */ var _global_store_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global-store/index.js */ "./modules/page-translation/src/global-store/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _FetchPost_Gutenberg_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FetchPost/Gutenberg/index.js */ "./modules/page-translation/src/FetchPost/Gutenberg/index.js");
/* harmony import */ var _createTranslatedPost_Gutenberg_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createTranslatedPost/Gutenberg/index.js */ "./modules/page-translation/src/createTranslatedPost/Gutenberg/index.js");
/* harmony import */ var _component_Notice_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./component/Notice/index.js */ "./modules/page-translation/src/component/Notice/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./index.css */ "./modules/page-translation/src/index.css");
/* harmony import */ var _FetchPost_Elementor_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./FetchPost/Elementor/index.js */ "./modules/page-translation/src/FetchPost/Elementor/index.js");
/* harmony import */ var _createTranslatedPost_Elementor_index_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createTranslatedPost/Elementor/index.js */ "./modules/page-translation/src/createTranslatedPost/Elementor/index.js");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");





// import ProVersionNotice from './component/ProVersionNotice/index.js';





// Elementor post fetch and update page




const editorType = window.lmatPageTranslationGlobal.editor_type;
const init = () => {
  let lmatMachineTranslateModals = new Array();
  const lmatMachineTranslateSettingModalWrp = '<!-- The Modal --><div id="lmat-page-translation-setting-modal"></div>';
  const lmatMachineTranslateStringModalWrp = '<div id="lmat_page_translation_strings_model" class="modal lmat_page_translation_custom_model"></div>';
  lmatMachineTranslateModals.push(lmatMachineTranslateSettingModalWrp, lmatMachineTranslateStringModalWrp);
  lmatMachineTranslateModals.forEach(modal => {
    document.body.insertAdjacentHTML('beforeend', modal);
  });
};
const StringModalBodyNotice = () => {
  const notices = [];
  if (editorType === 'gutenberg') {
    const postMetaSync = lmatPageTranslationGlobal.postMetaSync === 'true';
    if (postMetaSync) {
      notices.push({
        className: 'lmat-page-translation-notice lmat-page-translation-notice-warning',
        message: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("p", {
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('For accurate custom field translations, please disable the Custom Fields synchronization in ', 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("a", {
            href: `${lmatPageTranslationGlobal.admin_url}admin.php?page=mlang_settings`,
            target: "_blank",
            rel: "noopener noreferrer",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Polylang settings', 'autopoly-ai-translation-for-polylang')
          }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('. This may affect linked posts or pages.', 'autopoly-ai-translation-for-polylang')]
        })
      });
    }
    const blockRules = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.select)('block-lmatMachineTranslate/translate').getBlockRules();
    if (!blockRules.LmatBlockParseRules || Object.keys(blockRules.LmatBlockParseRules).length === 0) {
      notices.push({
        className: 'lmat-page-translation-notice lmat-page-translation-notice-error',
        message: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('No block rules were found. It appears that the block-rules.JSON file could not be fetched, possibly because it is blocked by your server settings. Please check your server configuration to resolve this issue.', 'autopoly-ai-translation-for-polylang')
        })
      });
    }
  }
  const noticeLength = notices.length;
  if (notices.length > 0) {
    return notices.map((notice, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_component_Notice_index_js__WEBPACK_IMPORTED_MODULE_5__["default"], {
      className: notice.className,
      lastNotice: index === noticeLength - 1,
      children: notice.message
    }, index));
  }
  return;
};
const App = () => {
  const [pageTranslate, setPageTranslate] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const targetLang = window.lmatPageTranslationGlobal.target_lang;
  const postId = window.lmatPageTranslationGlobal.parent_post_id;
  const currentPostId = window.lmatPageTranslationGlobal.current_post_id;
  const postType = window.lmatPageTranslationGlobal.post_type;
  let translatePost, fetchPost, translateWrpSelector;
  const sourceLang = window.lmatPageTranslationGlobal.source_lang;

  // Elementor post fetch and update page
  if (editorType === 'elementor') {
    translateWrpSelector = 'button.lmat-page-translation-button[name="lmat_page_translation_meta_box_translate"]';
    translatePost = _createTranslatedPost_Elementor_index_js__WEBPACK_IMPORTED_MODULE_10__["default"];
    fetchPost = _FetchPost_Elementor_index_js__WEBPACK_IMPORTED_MODULE_9__["default"];
  } else if (editorType === 'gutenberg') {
    translateWrpSelector = 'input#lmat-page-translation-button[name="lmat_page_translation_meta_box_translate"]';
    translatePost = _createTranslatedPost_Gutenberg_index_js__WEBPACK_IMPORTED_MODULE_4__["default"];
    fetchPost = _FetchPost_Gutenberg_index_js__WEBPACK_IMPORTED_MODULE_3__["default"];
  }
  const [postDataFetchStatus, setPostDataFetchStatus] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
  const fetchPostData = async data => {
    await fetchPost(data);
    const allEntries = wp.data.select('block-lmatMachineTranslate/translate').getTranslationEntry();
    let totalStringCount = 0;
    let totalCharacterCount = 0;
    let totalWordCount = 0;
    allEntries.map(entries => {
      const source = entries.source ? entries.source : '';
      const stringCount = source.split(/(?<=[.!?]+)\s+/).length;
      const wordCount = source.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
      const characterCount = source.length;
      totalStringCount += stringCount;
      totalCharacterCount += characterCount;
      totalWordCount += wordCount;
    });
    wp.data.dispatch('block-lmatMachineTranslate/translate').translationInfo({
      sourceStringCount: totalStringCount,
      sourceWordCount: totalWordCount,
      sourceCharacterCount: totalCharacterCount
    });
  };
  const updatePostDataFetch = status => {
    setPostDataFetchStatus(status);
    setLoading(false);
  };
  const handlePageTranslate = status => {
    setPageTranslate(status);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (pageTranslate) {
      const metaFieldBtn = document.querySelector(translateWrpSelector);
      if (metaFieldBtn) {
        metaFieldBtn.disabled = true;
        metaFieldBtn.value = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)("Already Translated", 'autopoly-ai-translation-for-polylang');
      }
    }
  }, [pageTranslate]);
  if (!sourceLang || '' === sourceLang) {
    const metaFieldBtn = document.querySelector(translateWrpSelector);
    if (metaFieldBtn) {
      metaFieldBtn.title = `Parent ${window.lmatPageTranslationGlobal.post_type} may be deleted.`;
      metaFieldBtn.disabled = true;
    }
    return;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.Fragment, {
    children: !pageTranslate && sourceLang && '' !== sourceLang && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_popupSettingModal_index_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
      contentLoading: loading,
      updatePostDataFetch: updatePostDataFetch,
      postDataFetchStatus: postDataFetchStatus,
      pageTranslate: handlePageTranslate,
      postId: postId,
      currentPostId: currentPostId,
      targetLang: targetLang,
      postType: postType,
      fetchPostData: fetchPostData,
      translatePost: translatePost,
      translateWrpSelector: translateWrpSelector,
      stringModalBodyNotice: StringModalBodyNotice
    })
  });
};

/**
 * Creates a message popup based on the post type and target language.
 * @returns {HTMLElement} The created message popup element.
 */
const createMessagePopup = () => {
  const postType = window.lmatPageTranslationGlobal.post_type;
  const targetLang = window.lmatPageTranslationGlobal.target_lang;
  const targetLangName = lmatPageTranslationGlobal.languageObject[targetLang]['name'];
  const messagePopup = document.createElement('div');
  messagePopup.id = 'lmat-page-translation-modal-open-warning-wrapper';
  messagePopup.innerHTML = `
    <div class="modal-container" style="display: flex">
      <div class="modal-content">
        <p>${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)("Would you like to duplicate your original %s content and have it automatically translated into %s?", 'autopoly-ai-translation-for-polylang'), postType, targetLangName)}</p>
        <div>
          <div data-value="yes">${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)("Yes", 'autopoly-ai-translation-for-polylang')}</div>
          <div data-value="no">${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)("No", 'autopoly-ai-translation-for-polylang')}</div>
        </div>
      </div>
    </div>`;
  return messagePopup;
};

/**
 * Inserts the message popup into the DOM.
 */
const insertMessagePopup = () => {
  const targetElement = document.getElementById('lmat-page-translation-setting-modal');
  const messagePopup = createMessagePopup();
  document.body.insertBefore(messagePopup, targetElement);
};

/**
 * Elementor translate button append
 */
const appendElementorTranslateBtn = () => {
  const translateButtonGroup = jQuery('.MuiButtonGroup-root.MuiButtonGroup-contained').parent();
  const buttonElement = jQuery(translateButtonGroup).find('.elementor-button.lmat-page-translation-button');
  if (translateButtonGroup.length > 0 && buttonElement.length === 0) {
    const buttonHtml = '<button class="elementor-button lmat-page-translation-button" name="lmat_page_translation_meta_box_translate">Translate</button>';
    const buttonElement = jQuery(buttonHtml);
    translateButtonGroup.prepend(buttonElement);
    $e.internal('document/save/set-is-modified', {
      status: true
    });
    if ('' === window.lmatPageTranslationGlobal.elementorData || window.lmatPageTranslationGlobal.elementorData.length < 1 || elementor.elements.length < 1) {
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation is not available because there is no Elementor data.');
      return;
    }

    // Append app root wrapper in body
    init();
    const root = react_dom_client__WEBPACK_IMPORTED_MODULE_11__.createRoot(document.getElementById('lmat-page-translation-setting-modal'));
    root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(App, {}));
  }
};
if (editorType === 'gutenberg') {
  // Render App
  window.addEventListener('load', () => {
    // Append app root wrapper in body
    init();
    const sourceLang = window.lmatPageTranslationGlobal.source_lang;
    if (sourceLang && '' !== sourceLang) {
      insertMessagePopup();
    }
    const root = react_dom_client__WEBPACK_IMPORTED_MODULE_11__.createRoot(document.getElementById('lmat-page-translation-setting-modal'));
    root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(App, {}));
  });
}

// Elementor translate button append
if (editorType === 'elementor') {
  jQuery(window).on('elementor:init', function () {
    elementor.on('document:loaded', appendElementorTranslateBtn);
  });
}
})();

/******/ })()
;
//# sourceMappingURL=index.js.map