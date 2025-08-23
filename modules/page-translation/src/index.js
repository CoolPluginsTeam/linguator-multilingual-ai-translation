import SettingModal from './popupSettingModal/index.js';
import './global-store/index.js';
import { useEffect, useState } from 'react';
import GutenbergPostFetch from './FetchPost/Gutenberg/index.js';
import UpdateGutenbergPage from './createTranslatedPost/Gutenberg/index.js';
// import ProVersionNotice from './component/ProVersionNotice/index.js';
import Notice from './component/Notice/index.js';
import { select } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';
import './index.scss';

// Elementor post fetch and update page
import ElementorPostFetch from './FetchPost/Elementor/index.js';
import ElementorUpdatePage from './createTranslatedPost/Elementor/index.js';

import ReactDOM from "react-dom/client";

const editorType = window.lmatPageTranslationGlobal.editor_type;

const init = () => {
  let lmatMachineTranslateModals = new Array();
  const lmatMachineTranslateSettingModalWrp = '<!-- The Modal --><div id="lmat-page-translation-setting-modal"></div>';
  const lmatMachineTranslateStringModalWrp = '<div id="lmat_page_translation_strings_model" class="modal lmat_page_translation_custom_model"></div>';

  lmatMachineTranslateModals.push(lmatMachineTranslateSettingModalWrp, lmatMachineTranslateStringModalWrp);

  lmatMachineTranslateModals.forEach(modal => {
    document.body.insertAdjacentHTML('beforeend', modal);
  });
}

const StringModalBodyNotice = () => {

  const notices = [];

  if (editorType === 'gutenberg') {

    const postMetaSync = lmatPageTranslationGlobal.postMetaSync === 'true';

    if (postMetaSync) {
      notices.push({
        className: 'lmat-page-translation-notice lmat-page-translation-notice-warning', message: <p>
          {__('For accurate custom field translations, please disable the Custom Fields synchronization in ', 'autopoly-ai-translation-for-polylang')}
          <a
            href={`${lmatPageTranslationGlobal.admin_url}admin.php?page=mlang_settings`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {__('Polylang settings', 'autopoly-ai-translation-for-polylang')}
          </a>
          {__('. This may affect linked posts or pages.', 'autopoly-ai-translation-for-polylang')}
        </p>
      });
    }

    const blockRules = select('block-lmatMachineTranslate/translate').getBlockRules();

    if (!blockRules.LmatBlockParseRules || Object.keys(blockRules.LmatBlockParseRules).length === 0) {
      notices.push({ className: 'lmat-page-translation-notice lmat-page-translation-notice-error', message: <p>{__('No block rules were found. It appears that the block-rules.JSON file could not be fetched, possibly because it is blocked by your server settings. Please check your server configuration to resolve this issue.', 'autopoly-ai-translation-for-polylang')}</p> });
    }
  }

  const noticeLength = notices.length;

  if (notices.length > 0) {
    return notices.map((notice, index) => <Notice className={notice.className} key={index} lastNotice={index === noticeLength - 1}>{notice.message}</Notice>);
  }

  return;
}


const App = () => {
  const [pageTranslate, setPageTranslate] = useState(false);
  const targetLang = window.lmatPageTranslationGlobal.target_lang;
  const postId = window.lmatPageTranslationGlobal.parent_post_id;
  const currentPostId = window.lmatPageTranslationGlobal.current_post_id;
  const postType = window.lmatPageTranslationGlobal.post_type;
  let translatePost, fetchPost, translateWrpSelector;
  const sourceLang = window.lmatPageTranslationGlobal.source_lang;

  // Elementor post fetch and update page
  if (editorType === 'elementor') {
    translateWrpSelector = 'button.lmat-page-translation-button[name="lmat_page_translation_meta_box_translate"]';
    translatePost = ElementorUpdatePage;
    fetchPost = ElementorPostFetch;
  } else if (editorType === 'gutenberg') {
    translateWrpSelector = 'input#lmat-page-translation-button[name="lmat_page_translation_meta_box_translate"]';
    translatePost = UpdateGutenbergPage;
    fetchPost = GutenbergPostFetch;
  }

  const [postDataFetchStatus, setPostDataFetchStatus] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchPostData = async (data) => {
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

      totalStringCount += stringCount
      totalCharacterCount += characterCount;
      totalWordCount += wordCount;
    });

    wp.data.dispatch('block-lmatMachineTranslate/translate').translationInfo({ sourceStringCount: totalStringCount, sourceWordCount: totalWordCount, sourceCharacterCount: totalCharacterCount });
  }

  const updatePostDataFetch = (status) => {
    setPostDataFetchStatus(status);
    setLoading(false);
  }

  const handlePageTranslate = (status) => {
    setPageTranslate(status);
  };

  useEffect(() => {
    if (pageTranslate) {
      const metaFieldBtn = document.querySelector(translateWrpSelector);
      if (metaFieldBtn) {
        metaFieldBtn.disabled = true;
        metaFieldBtn.value = __("Already Translated", 'autopoly-ai-translation-for-polylang');
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

  return (
    <>
      {!pageTranslate && sourceLang && '' !== sourceLang && <SettingModal contentLoading={loading} updatePostDataFetch={updatePostDataFetch} postDataFetchStatus={postDataFetchStatus} pageTranslate={handlePageTranslate} postId={postId} currentPostId={currentPostId} targetLang={targetLang} postType={postType} fetchPostData={fetchPostData} translatePost={translatePost} translateWrpSelector={translateWrpSelector} stringModalBodyNotice={StringModalBodyNotice} />}
    </>
  );
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
        <p>${sprintf(__("Would you like to duplicate your original %s content and have it automatically translated into %s?", 'autopoly-ai-translation-for-polylang'), postType, targetLangName)}</p>
        <div>
          <div data-value="yes">${__("Yes", 'autopoly-ai-translation-for-polylang')}</div>
          <div data-value="no">${__("No", 'autopoly-ai-translation-for-polylang')}</div>
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
    $e.internal('document/save/set-is-modified', { status: true });

    if ('' === window.lmatPageTranslationGlobal.elementorData || window.lmatPageTranslationGlobal.elementorData.length < 1 || elementor.elements.length < 1) {
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation is not available because there is no Elementor data.');
      return;
    }
    
    // Append app root wrapper in body
    init();

    const root = ReactDOM.createRoot(document.getElementById('lmat-page-translation-setting-modal'));
    root.render(<App />);
  }

}

if (editorType === 'gutenberg') {
  // Render App
  window.addEventListener('load', () => {
    
    // Append app root wrapper in body
    init();

    const sourceLang = window.lmatPageTranslationGlobal.source_lang

    if (sourceLang && '' !== sourceLang) {
      insertMessagePopup();
    }

    const root = ReactDOM.createRoot(document.getElementById('lmat-page-translation-setting-modal'));
    root.render(<App />);
  });
}

// Elementor translate button append
if (editorType === 'elementor') {
  jQuery(window).on('elementor:init', function () {
    elementor.on('document:loaded', appendElementorTranslateBtn);
  });
}
