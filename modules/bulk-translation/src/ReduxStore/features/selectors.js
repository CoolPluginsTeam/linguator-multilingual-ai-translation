// selector.js — Pure selector functions
export const selectServiceProvider = (state) => state.serviceProvider;
export const selectPendingPosts = (state) => state.pendingPosts;
export const selectCompletedPosts = (state) => state.completedPosts;
export const selectTranslatePostInfo = (state) => state.translatePostInfo;
export const selectProgressStatus = (state) => state.progressStatus;
export const selectCountInfo = (state) => state.countInfo;
export const selectBlockParseRules = (state) => state.blockParseRules;
export const selectTranslatedContent=(state, postId, uniqueKey, key, provider)=>{
  return state.translatedContent[postId]?.[uniqueKey]?.translation?.[provider]?.[key] || state.translatedContent[postId]?.[uniqueKey]?.source;
}
export const selectSourceContent=(state, postId, uniqueKey)=>{
  return state.translatedContent[postId]?.[uniqueKey]?.source;
}

export const targetLanguages=state=>state.targetLanguages;

/**
 * @param {Object} state
 * @param {string} postId
 * @returns {Object}
 */
export const selectSourceEntries=(state, postId)=>{
  const source={};

  Object.keys(state.translatedContent[postId]).forEach(key=>{
      if(state.translatedContent[postId][key]?.source){
          source[key]=state.translatedContent[postId][key]?.source;
      }
  });

  return source;
}

export const selectTargetContent=(state, postId)=>{
    const filteredObject={};

    if(state.translatedContent[postId] && Object.keys(state.translatedContent[postId]).length > 0){
        Object.keys(state.translatedContent[postId]).forEach(key=>{
            if(state.translatedContent[postId][key]?.targetContent){
                filteredObject[key]=state.translatedContent[postId][key]?.targetContent;
            }
        });
    }


    return filteredObject;
}

export const selectTargetLanguages=(state, postId)=>{
  return state.parentPostsInfo[postId]?.languages;
}
