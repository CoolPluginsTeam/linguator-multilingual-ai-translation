import {updateTranslatedContent} from '../../ReduxStore/features/actions.js';
import updateTranslationCount from '../updateTranslationCount/index.js';

const storeTranslateString=(postId, uniqueKey, key, value, provider, lang, storeDispatch)=>{
    updateTranslationCount({postId, key: uniqueKey, lang, storeDispatch});
    storeDispatch(updateTranslatedContent({postId, uniqueKey, key, provider,value}));
}

export default storeTranslateString;
