import FilterClassicContent from '../classic/index.js';


/**
 * @param {Object} content
 * @param {string} service
 * @returns {string}
 */
const FilterTaxonomyContent = async ({content, service, postId, storeDispatch, filterHtmlContent}) => {
    const postMetaSync = lmatBulkTranslationGlobal.postMetaSync === 'true' && lmatBulkTranslationGlobal.taxonomy_page !== 'taxonomy';

    if(postMetaSync){
        return content;
    }

    return await FilterClassicContent({content, service, postId, storeDispatch, filterHtmlContent});
}

export default FilterTaxonomyContent;
