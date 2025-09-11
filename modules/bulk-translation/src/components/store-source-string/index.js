import {updateSourceContent, updateTargetContent, updateParentPostsInfo} from '../../redux-store/features/actions.js';
import { store } from '../../redux-store/store.js';

const storeSourceString=(postId, uniqueKey, value, targetContent, storeDispatch)=>{
    storeDispatch(updateSourceContent({postId, uniqueKey, value}));
    storeDispatch(updateTargetContent({postId, uniqueKey, value: targetContent}));

    const previousParentPostsInfo=store.getState().parentPostsInfo[postId];
    
    const charactersCount=(previousParentPostsInfo?.charactersCount || 0) + value.length;
    const wordsCount=(previousParentPostsInfo?.wordsCount || 0) + value.split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
    const stringsCount=(previousParentPostsInfo?.stringsCount || 0) + value.split(/(?<=[.!?]+)\s+/).length;

    storeDispatch(updateParentPostsInfo({postId, data: {charactersCount, wordsCount, stringsCount}}));
}

export default storeSourceString;
