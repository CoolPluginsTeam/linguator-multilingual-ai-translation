import {updateSourceContent, updateTargetContent, updateParentPostsInfo} from '../../ReduxStore/features/actions.js';
import { store } from '../../ReduxStore/store.js';

const storeSourceString=(postId, uniqueKey, value, targetContent, storeDispatch)=>{
    storeDispatch(updateSourceContent({postId, uniqueKey, value}));
    storeDispatch(updateTargetContent({postId, uniqueKey, value: targetContent}));

    const previousParentPostsInfo=store.getState().parentPostsInfo[postId];
    
    const charactersCount=(previousParentPostsInfo?.charactersCount || 0) + value.length;
    const wordsCount=(previousParentPostsInfo?.wordsCount || 0) + (typeof value === 'string' ? value.split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length : 0);
    const stringsCount=(previousParentPostsInfo?.stringsCount || 0) + (typeof value === 'string' ? value.split(/(?<=[.!?]+)\s+/).length : 0);

    storeDispatch(updateParentPostsInfo({postId, data: {charactersCount, wordsCount, stringsCount}}));
}

export default storeSourceString;
