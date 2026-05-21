import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Add language list button to Elementor top menu
 */
const addLanguageListButton = () => {
  // Check if button already exists
  if (jQuery('.lmat-language-list-button').length > 0) {
    return;
  }

  // Get the target language and flag from post data
  let targetFlagUrl = '';
  let targetLang = '';
  
  // Try to get from global object first
  if (window.lmatPageTranslationGlobal?.target_lang && window.lmatPageTranslationGlobal?.languageObject) {
    targetLang = window.lmatPageTranslationGlobal.target_lang;
    const languageObject = window.lmatPageTranslationGlobal.languageObject;
    targetFlagUrl = languageObject[targetLang] ? languageObject[targetLang].flag : '';
  } else {
    // Get from post data via REST API
    const postId = elementor.config?.document?.id || elementor.config?.post?.id;
    if (postId) {
      // Fetch language information from REST API
      apiFetch( { path: `/lmat/v1/post-language/${postId}` } )
        .then( data => {
          targetLang = data.language;
          targetFlagUrl = data.flag_url;

          // Update the button with the flag.
          // Use DOM construction instead of HTML string concatenation.
          const $button = jQuery('.lmat-language-list-button');
          if ( $button.length > 0 && targetFlagUrl ) {
            $button.empty().append(
              jQuery('<img/>', { src: targetFlagUrl, alt: targetLang })
            );
          }
        } )
        .catch( () => {
          targetLang = 'en';
          targetFlagUrl = `${elementor.config?.urls?.assets || ''}flags/en.svg`;
        } );
    }
  }
  
  // Create the button element.
  // Avoid embedding REST-provided values in raw HTML strings.
  const buttonElement = jQuery(
    '<button type="button" class="lmat-language-list-button elementor-button" title="Open Language List"></button>'
  );
  if ( targetFlagUrl ) {
    buttonElement.append(jQuery('<img/>', { src: targetFlagUrl, alt: targetLang }));
  } else {
    buttonElement.append(jQuery(document.createTextNode('Languages')));
  }

  // Find Elementor top bar and add button
  const topBar = jQuery('.MuiButtonGroup-root.MuiButtonGroup-contained').parent();
  if (topBar.length > 0) {
    topBar.prepend(buttonElement);
    
    // Add click handler to open language panel
    buttonElement.on('click', function() {
      // Open the language panel by navigating to the page settings
      if (typeof $e !== 'undefined' && $e.run) {
        // Use the Elementor command runner to execute the page-settings command
        $e.run('panel/page-settings');
        // Then trigger click on the language panel section
        setTimeout(() => {
          const languageSection = jQuery('.elementor-control-lmat_language_panel_controls');
          if (languageSection.length > 0) {
            buttonElement.toggleClass('panel-active');
            languageSection.trigger('click');
          }
        }, 200);
      }
    });
  }
};

/**
 * Elementor language list button append
 */
const appendElementorLanguageListBtn = () => {
  // Add language list button to top menu
  addLanguageListButton();
};

// Initialize when Elementor is ready
if (typeof elementor !== 'undefined') {
  jQuery(window).on('elementor:init', function () {
    elementor.on('document:loaded', appendElementorLanguageListBtn);
  });
} else {
  // Fallback for when Elementor is already loaded
  jQuery(document).ready(function() {
    if (typeof elementor !== 'undefined') {
      elementor.on('document:loaded', appendElementorLanguageListBtn);
    }
  });
}

export default {
  addLanguageListButton,
  appendElementorLanguageListBtn
};
