/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// external ["wp","hooks"]
const external_wp_hooks_namespaceObject = window["wp"]["hooks"];
;// external ["wp","compose"]
const external_wp_compose_namespaceObject = window["wp"]["compose"];
;// external ["wp","i18n"]
const external_wp_i18n_namespaceObject = window["wp"]["i18n"];
;// external ["wp","blockEditor"]
const external_wp_blockEditor_namespaceObject = window["wp"]["blockEditor"];
;// external ["wp","components"]
const external_wp_components_namespaceObject = window["wp"]["components"];
;// ./assets/js/src/editors/widget.js
/**
 * Widgets Editor integrations
 */







// Attribute injection: add language choice attribute to all blocks.
var addLangChoiceAttribute = function addLangChoiceAttribute(settings, name) {
  if (!settings.attributes) {
    settings.attributes = {};
  }
  settings.attributes.lmatLang = {
    type: 'string',
    default: ''
  };
  return settings;
};
(0,external_wp_hooks_namespaceObject.addFilter)('blocks.registerBlockType', 'lmat/lang-choice', addLangChoiceAttribute);

// UI control: exposes attribute in InspectorControls.
var withInspectorControls = (0,external_wp_compose_namespaceObject.createHigherOrderComponent)(function (BlockEdit) {
  return function (props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var lmatLang = attributes.lmatLang;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BlockEdit, props), /*#__PURE__*/React.createElement(external_wp_blockEditor_namespaceObject.InspectorControls, null, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.PanelBody, {
      title: (0,external_wp_i18n_namespaceObject.__)('Language', 'linguator-multilingual-ai-translation')
    }, /*#__PURE__*/React.createElement(external_wp_components_namespaceObject.SelectControl, {
      label: (0,external_wp_i18n_namespaceObject.__)('Display in language', 'linguator-multilingual-ai-translation'),
      value: lmatLang,
      options: [{
        label: (0,external_wp_i18n_namespaceObject.__)('Any', 'linguator-multilingual-ai-translation'),
        value: ''
      },
      // Real options should be injected server-side/localized; placeholder values here.
      {
        label: 'en',
        value: 'en'
      }, {
        label: 'fr',
        value: 'fr'
      }, {
        label: 'de',
        value: 'de'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          lmatLang: value
        });
      }
    }))));
  };
}, 'withInspectorControls');
(0,external_wp_hooks_namespaceObject.addFilter)('editor.BlockEdit', 'lmat/lang-choice/controls', withInspectorControls);
/******/ })()
;