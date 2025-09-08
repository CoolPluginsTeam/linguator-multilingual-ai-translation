import updateClassicContent from '../Classic/updateContent.js';

/**
 * @param {Object} source
 * @param {Object} translation
 * @returns {Object}
 */
const updateTaxonomyContent=async ({source, lang, serviceProvider, postId})=>{
    return await updateClassicContent({source, lang, serviceProvider, postId});
}

export default updateTaxonomyContent;
