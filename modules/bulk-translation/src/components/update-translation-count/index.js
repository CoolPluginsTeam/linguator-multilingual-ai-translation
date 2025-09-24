import {updateCountInfo, updateTranslatePostInfo} from '../../redux-store/features/actions.js';
import {store} from '../../redux-store/store.js';

const updateTranslationCount=({postId,key,lang, storeDispatch})=>{
    const sourceText=store.getState().translatedContent[postId][key]?.source;

    if(sourceText){
        const stringCount = typeof sourceText === 'string' ? sourceText.split(/(?<=[.!?]+)\s+/).length : 0;
        const wordCount = typeof sourceText === 'string' ? sourceText.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length : 0;
        const characterCount = typeof sourceText === 'string' ? sourceText.length : 0;

        const previousPostInfo=store.getState().translatePostInfo[postId+'_'+lang];
        const previousStringCount=previousPostInfo?.stringsTranslated || 0;
        const previousCharacterCount=previousPostInfo?.charactersTranslated || 0;
        const previousWordCount=previousPostInfo?.wordsTranslated || 0;

        storeDispatch(updateTranslatePostInfo({[postId+'_'+lang]: {
            stringsTranslated: previousStringCount + stringCount,
            charactersTranslated: previousCharacterCount + characterCount,
            wordsTranslated: previousWordCount + wordCount,
        }}));

        storeDispatch(updateCountInfo({
            stringsTranslated: store.getState().countInfo.stringsTranslated + stringCount,
            charactersTranslated: store.getState().countInfo.charactersTranslated + characterCount,
        }));
    }
}


export default updateTranslationCount;