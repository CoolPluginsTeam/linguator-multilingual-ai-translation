import { store } from '../ReduxStore/store.js';

export const updateTranslateData = ({ provider, sourceLang, targetLang, parentPostId, currentPostId, editorType, updateTranslateDataNonce, extraData={} }) => {
    if(!updateTranslateDataNonce || !currentPostId || !parentPostId || !provider || !sourceLang || !targetLang || !editorType) return;

    const parentPostInfo = store.getState().parentPostsInfo[parentPostId];
    const translateData = store.getState().translatePostInfo[parentPostId+'_'+targetLang];


    const totalStringCount = translateData.stringsTranslated || 0;
    const totalWordCount = translateData.wordsTranslated || 0;
    const totalCharacterCount = translateData.charactersTranslated || 0;
    const timeTaken = (translateData.duration || 0) / 1000;
    const sourceWordCount = parentPostInfo.wordsCount || 0;
    const sourceCharacterCount = parentPostInfo.charactersCount || 0;
    const sourceStringCount = parentPostInfo.stringsCount || 0;
    const date = new Date().toISOString();

    const data = { provider, totalStringCount, totalWordCount, totalCharacterCount, editorType, date, sourceStringCount, sourceWordCount, sourceCharacterCount, sourceLang, targetLang, timeTaken, action: lmatBulkTranslationGlobal.update_translate_data, update_translation_key: updateTranslateDataNonce, post_id: currentPostId, ajax_url: lmatBulkTranslationGlobal.ajax_url, extraData: JSON.stringify(extraData) };

    fetch(lmatBulkTranslationGlobal.ajax_url, {
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