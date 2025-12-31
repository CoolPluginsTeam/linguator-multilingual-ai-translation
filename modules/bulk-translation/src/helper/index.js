import { store } from '../redux-store/store.js';
import { availableContentTypes } from "../redux-store/features/selectors.js";
import reTranslate from "../components/re-transalte/index.js";

export const updateTranslateData = ({ provider, sourceLang, targetLang, parentPostId, currentPostId, editorType, updateTranslateDataNonce, extraData = {} }) => {
    if (!updateTranslateDataNonce || !currentPostId || !parentPostId || !provider || !sourceLang || !targetLang || !editorType) return;

    const parentPostInfo = store.getState().parentPostsInfo[parentPostId];
    const translateData = store.getState().translatePostInfo[parentPostId + '_' + targetLang];
    const reTranslationData = store.getState().translatePostInfo?.[parentPostId + '_' + targetLang]?.Retranslate;

    let sourceCount={
        wordsCount: parentPostInfo.wordsCount || 0,
        charactersCount: parentPostInfo.charactersCount || 0,
        stringsCount: parentPostInfo.stringsCount || 0
    }

    if(reTranslationData && reTranslationData.status === true){
        const availableFieldNames=translateFieldNameSort(availableContentTypes(store.getState(), parentPostId));
        const reTranslationData=reTranslate({ postId: parentPostId, targetLang, availableContentTypes: availableFieldNames, reTranslationKeys: [], reTranslationStatus: false, reTranslateMetaKeys: [] });

        if(reTranslationData && reTranslationData.status && reTranslationData.targetContent){
            sourceCount.wordsCount = 0;
            sourceCount.charactersCount = 0;
            sourceCount.stringsCount = 0;

            Object.values(reTranslationData.targetContent).forEach(content=>{
                const contentCounts = getContentCount(content);
                sourceCount.charactersCount += contentCounts.charactersCount;
                sourceCount.wordsCount += contentCounts.wordsCount;
                sourceCount.stringsCount += contentCounts.stringsCount;
            });
        }
    }

    const totalStringCount = translateData.stringsTranslated || 0;
    const totalWordCount = translateData.wordsTranslated || 0;
    const totalCharacterCount = translateData.charactersTranslated || 0;
    const timeTaken = (translateData.duration || 0) / 1000;
    const sourceWordCount = sourceCount.wordsCount;
    const sourceCharacterCount = sourceCount.charactersCount;
    const sourceStringCount = sourceCount.stringsCount;
    const date = new Date().toISOString();

    const data = { provider, totalStringCount, totalWordCount, totalCharacterCount, editorType, date, sourceStringCount, sourceWordCount, sourceCharacterCount, sourceLang, targetLang, timeTaken, action: lmatBulkTranslationGlobal.update_translate_data, update_translation_key: updateTranslateDataNonce, post_id: currentPostId, ajax_url: lmatBulkTranslationGlobal.ajax_url, extraData: JSON.stringify(extraData) };

    fetch(lmatBulkTranslationGlobal.ajax_url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        },
        body: new URLSearchParams(data)
    }).then().catch(error => {
        console.error(error);
    });
}

export const getContentCount=(content)=>{
    const data={charactersCount:0, wordsCount:0, stringsCount:0};

    if(content && content.trim() !== ''){
        data.charactersCount=typeof content === 'string' ? content.length : 0;
        data.wordsCount=typeof content === 'string' ? content.split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length : 0;
        data.stringsCount=typeof content === 'string' ? content.split(/(?<=[.!?]+)\s+/).length : 0;
    }

    return data;
}

export const translateFieldNameSort=(fieldNames=[])=>{

    if(!fieldNames || fieldNames.length === 0){
        return [];
    }

    const sortedFieldNames=['title', 'excerpt', 'content', 'metaFields'];

     return sortedFieldNames.filter(field =>
        fieldNames.includes(field)
    );
}

export const reTranslationFieldMatch=(old_keys, reTranslationFieldTypes)=>{
    return old_keys.join('_') === reTranslationFieldTypes.join('_');
}