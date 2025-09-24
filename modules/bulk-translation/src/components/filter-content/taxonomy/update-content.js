import updateClassicContent from '../classic/update-content.js';

/**
 * @param {Object} source
 * @param {Object} translation
 * @returns {Object}
 */
const updateTaxonomyContent=async ({source, lang, serviceProvider, postId})=>{

    const postMetaSync = lmatBulkTranslationGlobal.postMetaSync === 'true' && lmatBulkTranslationGlobal.taxonomy_page !== 'taxonomy';
    
    if(postMetaSync){
        return source;
    }

    return await updateClassicContent({source, lang, serviceProvider, postId});
}

export default updateTaxonomyContent;
