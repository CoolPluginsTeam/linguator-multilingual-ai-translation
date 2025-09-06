import {filterContent, updateFilterContent} from './components/FilterContent/index.js';
import { updatePendingPosts, unsetPendingPost, updateCompletedPosts, updateTranslatePostInfo, updateCountInfo, updateSourceContent, updateParentPostsInfo, updateTargetContent, updateTargetLanguages, updateBlockParseRules } from './ReduxStore/features/actions.js';
import { store } from './ReduxStore/store.js';
import { __ } from '@wordpress/i18n';
import Provider from './components/translateProvider/index.js';
import { updateTranslateData } from './helper/index.js';

const initBulkTranslate=async (postKeys=[], nonce, storeDispatch, prefix, updateDestoryHandler)=>{

    const pendingPosts=store.getState().pendingPosts;

    if(pendingPosts.length < 1){
        return;
    }

    let modalClosed=false;

    updateDestoryHandler(
        () => {
            modalClosed=true;
        }
    )

    const translatePost=async (index) => {
        const postId=postKeys[index];
    
        if(!postId || modalClosed){
            return;
        }
    
        const postContent=store.getState().parentPostsInfo[postId];
     
        if(postContent){
            const {originalContent: {title, content}, languages, editorType, sourceLanguage} = postContent;
            
            if(!languages || languages.length === 0){
                console.log(`All target languages for post ${postId} already exist. Skipping translation.`);
                return;
            }
        
            if(!['classic', 'block', 'elementor'].includes(editorType)){
                for(const lang of languages){   
                    storeDispatch(unsetPendingPost(postId+'_'+lang));
                    storeDispatch(updateProgressStatus(100 / pendingPosts.length));
                    storeDispatch(updateTranslatePostInfo({[postId+'_'+lang]: {status: 'error', messageClass: 'error', errorMessage: __('This post editor type is not supported for translation', 'linguator-multilingual-ai-translation')}}));
                }
            }

            // Deep clone the content object to avoid mutating the original reference
            const source = { title: title, content: JSON.parse(JSON.stringify(content)) };

             await translateContent({sourceLang: sourceLanguage, targetLangs: languages, totalPosts: pendingPosts.length,storeDispatch,prefix, postId, source, editorType, createTranslatePostNonce: nonce, updateDestoryHandler});
        }
    
        index++;
    
        if(index > postKeys.length-1 || modalClosed){
            return;
        }

        await translatePost(index);
    }

    await translatePost(0);
}

const translateContent=async ({sourceLang, targetLangs, totalPosts, storeDispatch, postId, prefix, source, editorType, createTranslatePostNonce, updateDestoryHandler})=>{

    const activeProvider=store.getState().serviceProvider;
    const providerDetails=Provider({Service: activeProvider});

    if(providerDetails && providerDetails.Provider){
        const provider=new providerDetails.Provider({sourceLang, targetLangs, totalPosts,storeDispatch, postId, createTranslatePostNonce, updateContent: async (lang)=>
            { await updateContent({source, postId, sourceLang, lang, editorType, createTranslatePostNonce , storeDispatch})}, prefix, updateDestoryHandler});

        await provider.initTranslation();
    }
}

export const updateContent=async ({source, postId, sourceLang, lang, editorType, createTranslatePostNonce, storeDispatch})=>{

    const service=store.getState().serviceProvider;

    const deepCloneSource=JSON.parse(JSON.stringify(source));
    const updateContent=await updateFilterContent({source: deepCloneSource,postId, lang, editorType, service});

    const bulkTranslateRouteUrl = lmatBulkTranslationGlobal.bulkTranslateRouteUrl;
    const nonce = lmatBulkTranslationGlobal.nonce;

    storeDispatch(updateTranslatePostInfo({[postId+'_'+lang]: { status: 'in-progress', messageClass: 'in-progress'}}));
    
    await fetch(bulkTranslateRouteUrl + `/${postId}:create-translate-post`, {
        method: 'POST',
        body: new URLSearchParams({
            post_id: postId,
            target_language: lang,
            editor_type: editorType,
            post_title: updateContent.title || '',
            post_content: updateContent.content ? JSON.stringify(updateContent.content) : '',
            post_meta_fields: updateContent.metaFields ? JSON.stringify(updateContent.metaFields) : '',
            privateKey: createTranslatePostNonce,
            source_language: sourceLang,
        }),
        headers: {
            'X-WP-Nonce': nonce,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        }
    }).then(async response=>{
        const data=await response.json();
        
        let updateData={};
        
        if(data.success && data.data.post_id){

            updateTranslateData({provider: service, sourceLang, targetLang: lang, currentPostId: data.data.post_id, parentPostId: postId, editorType, updateTranslateDataNonce: data?.data?.update_translate_data_nonce});

            data.data.post_title = '' === data.data.post_title ? __('N/A', 'linguator-multilingual-ai-translation') : data.data.post_title;
            updateData={targetPostId: data.data.post_id, targetPostTitle: data.data.post_title, targetLanguage: lang, postLink: data.data.post_link, postEditLink: data.data.post_edit_link, status: 'completed', messageClass: 'success'};
            storeDispatch(updateCountInfo({postsTranslated: store.getState().countInfo.postsTranslated+1}));
        }else{
            if(data.data && data.data.error){
                let errorHtml='Error Code:' + (data.data.status);

                if(typeof data.data.error === 'string'){
                    errorHtml+='<br>Error Message:' + data.data.error + '(' + data.data.error + ')';
                }
    
                if(typeof data.data.error === 'object'){
                    errorHtml+='<br>Error Message:' + JSON.stringify(data.data.error);
                }

                updateData={status: 'error', messageClass: 'error', errorMessage: __('Post not created. Please try again.', 'linguator-multilingual-ai-translation'), errorHtml: '<div class="lmat-error-html">'+errorHtml+'</div>'};
            }else if(data.code && data.message){
                updateData={status: 'error', messageClass: 'error', errorMessage: __('Post not created. Please try again.', 'linguator-multilingual-ai-translation'), errorHtml: '<div class="lmat-error-html">'+data.message+'</div>'};
            }else if(!data.success || data.data){
                updateData={status: 'error', messageClass: 'error', errorMessage: __('Post not created. Please try again.', 'linguator-multilingual-ai-translation'), errorHtml: '<div class="lmat-error-html">'+data.data+'</div>'};
            }else if(!data.data.post_id){
                updateData={status: 'error', messageClass: 'error', errorMessage: __('Post not created. Please try again.', 'linguator-multilingual-ai-translation'), errorHtml: '<div class="lmat-error-html">'+data.data+'</div>'};
            }else if(typeof data === 'string'){
                updateData={status: 'error', messageClass: 'error', errorMessage: __('Post not created. Please try again.', 'linguator-multilingual-ai-translation'), errorHtml: '<div class="lmat-error-html">'+data+'</div>'};
            }
        }
        
        storeDispatch(unsetPendingPost(postId+'_'+lang));
        storeDispatch(updateCompletedPosts([postId+'_'+lang]));
        storeDispatch(updateTranslatePostInfo({[postId+'_'+lang]: updateData}));

    }).catch(error=>{
        console.log(error);
        storeDispatch(unsetPendingPost(postId+'_'+lang));
        storeDispatch(updateCompletedPosts([postId+'_'+lang]));
        let errorHtml=error;

        if(error.message){
            errorHtml=error.message;
        }

        if(error.data && error.data.status){
            errorHtml='Error Code:' + (error.data.status);

            if(typeof error.data.error === 'string'){
                errorHtml+='<br>Error Message:' + error.data.error;
            }

            if(typeof error.data.error === 'object'){
                errorHtml+='<br>Error Message:' + JSON.stringify(error.data.error);
            }
        }

        storeDispatch(updateTranslatePostInfo({[postId+'_'+lang]: { status: 'error', messageClass: 'error', errorMessage: __('Post not created. Please try again.', 'linguator-multilingual-ai-translation'), errorHtml: '<div class="lmat-error-html">'+errorHtml+'</div>'}}));
    })
}

const bulkTranslateEntries = async ({ids, langs, storeDispatch}) => {
    
    const bulkTranslateRouteUrl = lmatBulkTranslationGlobal.bulkTranslateRouteUrl;
    const bulkTranslatePrivateKey = lmatBulkTranslationGlobal.bulkTranslatePrivateKey;
    const nonce = lmatBulkTranslationGlobal.nonce;
    let storeParseBlockRules=false;

    const untranslatedPosts=await fetch(bulkTranslateRouteUrl + '/local-ai:bulk-translate-entries', {
        method: 'POST',
        body: new URLSearchParams({
            ids: JSON.stringify(ids),
            lang: JSON.stringify(langs),
            privateKey: bulkTranslatePrivateKey,
        }),
        headers: {
            'X-WP-Nonce': nonce,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        }
    })

    const untranslatedPostsData=await untranslatedPosts.json();

    if(!untranslatedPostsData.success && !untranslatedPostsData.code && untranslatedPostsData.data && untranslatedPostsData.data.message){
        return {success: false, message: untranslatedPostsData.data.message};
    }else if(!untranslatedPostsData.success && !untranslatedPostsData.message && untranslatedPostsData.data.error){
        return {success: false, message: JSON.stringify(untranslatedPostsData.data.error)};
    }else if(!untranslatedPostsData.success && untranslatedPostsData.message && untranslatedPostsData.data.trace && untranslatedPostsData.data.message){
        // trace key aur uska data hatao, phir pura object stringify karo
        if (untranslatedPostsData.data && untranslatedPostsData.data.trace) {
            delete untranslatedPostsData.data.trace;
        }
        return {success: false, message: JSON.stringify(untranslatedPostsData.data)};
    }else if(!untranslatedPostsData.success && untranslatedPostsData.message){
        return {success: false, message: untranslatedPostsData.message};
    }

    if(!untranslatedPostsData || !untranslatedPostsData.success || !untranslatedPostsData.data || !untranslatedPostsData.data.posts || !untranslatedPostsData.data.CreateTranslatePostNonce){   
        return;
    }

    const posts=untranslatedPostsData.data.posts;

    const postKeys=Object.keys(posts);

    if(postKeys.length > 0){
        const postIdExist=new Array();
        const existsPostInPendingPosts=Object.keys(store.getState().translatePostInfo);

        postKeys.forEach(postId=>{
           const languages=posts[postId].languages;
           const parentPostTitle=posts[postId].title;

           if(languages && languages.length > 0){
                languages.forEach(language=>{

                    if(existsPostInPendingPosts.includes(postId+'_'+language)){
                        return;
                    }

                    let firstPostLanguage=false;

                    if(!postIdExist.includes(postId) && !existsPostInPendingPosts.includes(postId+'_'+language)){
                        postIdExist.push(postId);
                        firstPostLanguage=true;
                    }

                    const flagUrl=lmatBulkTranslationGlobal.languageObject[language].flag;
                    const languageName=lmatBulkTranslationGlobal.languageObject[language].name;
                    storeDispatch(updatePendingPosts([postId+'_'+language]));
                    storeDispatch(updateTranslatePostInfo({[postId+'_'+language]: {parentPostId: postId, targetPostId: null, targetLanguage: language, postLink: null, status: 'pending', parentPostTitle, firstPostLanguage, flagUrl, languageName, messageClass: 'warning'}}));
                });
           }
        });

        const storeSourceContent=async(index, translatePostsCount)=>{

            const postId=postKeys[index];
            const activeProvider=store.getState().serviceProvider;

            const {title, content, languages, editor_type , metaFields=null, sourceLanguage} = posts[postId];
            
            if(languages && languages.length > 0){
                storeDispatch(updateTargetLanguages({lang: languages}));

                const data={content, editorType:editor_type, metaFields, service: activeProvider, postId, storeDispatch};
                if(editor_type === 'block'){
                    data.blockParseRules=JSON.parse(untranslatedPostsData?.data?.blockParseRules);

                    if(!storeParseBlockRules){
                        storeDispatch(updateBlockParseRules(JSON.parse(untranslatedPostsData?.data?.blockParseRules)));
                        storeParseBlockRules=true;
                    }
                }
            
                await filterContent(data);
            
                if(['classic', 'block', 'elementor'].includes(editor_type)){
                    if(title && title.trim() !== ''){
                        storeDispatch(updateSourceContent({postId, uniqueKey: 'title', value: title}));
                        storeDispatch(updateTargetContent({postId, uniqueKey: 'title', value: title}));
                    }

                    const previousParentPostsInfo=store.getState().parentPostsInfo[postId];
                    
                    const charactersCount=(previousParentPostsInfo?.charactersCount || 0) + title.length;
                    const wordsCount=(previousParentPostsInfo?.wordsCount || 0) + title.split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
                    const stringsCount=(previousParentPostsInfo?.stringsCount || 0) + title.split(/(?<=[.!?]+)\s+/).length;
                                   
                    storeDispatch(updateParentPostsInfo({postId, data: {editorType: editor_type, originalContent: {title, content}, languages, sourceLanguage, charactersCount, wordsCount, stringsCount}}));
                    storeDispatch(updateCountInfo({totalPosts: store.getState().countInfo.totalPosts+languages.length}));
                }
            

            }else{
                console.log(`All target languages for post ${postId} already exist. Skipping translation.`);
            }
            
            index++;
            if(index > postKeys.length-1){
                return;
            }

            await storeSourceContent(index, translatePostsCount);
        }

        const translatePostsCount=store.getState().pendingPosts.length;

        await storeSourceContent(0, translatePostsCount);

        return {postKeys, nonce: untranslatedPostsData.data.CreateTranslatePostNonce};
    }
}

export {bulkTranslateEntries, initBulkTranslate};
