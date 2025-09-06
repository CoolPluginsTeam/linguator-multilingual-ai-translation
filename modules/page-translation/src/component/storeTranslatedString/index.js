import { dispatch, select } from '@wordpress/data';

/**
 * Saves the translation data by updating the translation content based on the provided translate object and data.
 * @param {Object} translateData - The data containing translation information.
 */
const SaveTranslation = ({type, key, translateContent, source, provider, AllowedMetaFields}) => {
    if (['title', 'excerpt'].includes(type)) {
        const action = `${type}SaveTranslate`;
        dispatch('block-lmatPageTranslation/translate')[action](translateContent, provider);
    } else if (['metaFields'].includes(type)) {

        if(Object.keys(AllowedMetaFields).includes(key)){
            dispatch('block-lmatPageTranslation/translate').metaFieldsSaveTranslate(key, translateContent, source, provider);
        }
    } else {
        dispatch('block-lmatPageTranslation/translate').contentSaveTranslate(key, translateContent, source, provider);
    }
}

export default SaveTranslation;