import { select } from '@wordpress/data';

export const updateTranslateData = ({ provider, sourceLang, targetLang, postId }) => {
    const translateData = select('block-lmatPageTranslation/translate').getTranslationInfo();
    const totalStringCount = translateData.translateData?.[provider]?.targetStringCount || 0;
    const totalWordCount = translateData.translateData?.[provider]?.targetWordCount || 0;
    const totalCharacterCount = translateData.translateData?.[provider]?.targetCharacterCount || 0;
    const timeTaken = translateData.translateData?.[provider]?.timeTaken || 0;
    const sourceWordCount = translateData?.sourceWordCount || 0;
    const sourceCharacterCount = translateData?.sourceCharacterCount || 0;
    const sourceStringCount = translateData?.sourceStringCount || 0;
    const editorType = lmatPageTranslationGlobal.editor_type;
    const date = new Date().toISOString();

    const data = { provider, totalStringCount, totalWordCount, totalCharacterCount, editorType, date, sourceStringCount, sourceWordCount, sourceCharacterCount, sourceLang, targetLang, timeTaken, action: lmatPageTranslationGlobal.update_translate_data, update_translation_key: lmatPageTranslationGlobal.update_translation_check, post_id: postId };

    fetch(lmatPageTranslationGlobal.ajax_url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        },
        body: new URLSearchParams(data)
    }).then(response => response.json()).then(data => {
        console.log(data.data.message);
    }).catch(error => {
        console.error(error);
    });
}