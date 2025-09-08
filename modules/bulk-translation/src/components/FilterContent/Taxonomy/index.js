import FilterClassicContent from '../Classic/index.js';


/**
 * @param {Object} content
 * @param {string} service
 * @returns {string}
 */
const FilterTaxonomyContent = async ({content, service, postId, storeDispatch, filterHtmlContent}) => {
    return await FilterClassicContent({content, service, postId, storeDispatch, filterHtmlContent});
}

export default FilterTaxonomyContent;
