import { dispatch } from "@wordpress/data";
import AllowedMetaFields from "../../AllowedMetafileds.js";
import ElementorSaveSource from "../../storeSourceString/Elementor/index.js";

// Update allowed meta fields
const updateAllowedMetaFields = (data) => {
    dispatch('block-lmatPageTranslation/translate').allowedMetaFields(data);
}

const fetchPostContent = async (props) => {
    const elementorPostData = lmatPageTranslationGlobal.elementorData && typeof lmatPageTranslationGlobal.elementorData === 'string' ? JSON.parse(lmatPageTranslationGlobal.elementorData) : lmatPageTranslationGlobal.elementorData;
    const metaFields=lmatPageTranslationGlobal?.metaFields;

    const content={
        widgetsContent:elementorPostData,
        metaFields:metaFields
    }

    
    // Update allowed meta fields
    Object.keys(AllowedMetaFields).forEach(key => {
        updateAllowedMetaFields({id: key, type: AllowedMetaFields[key].type});
    });
    
    ElementorSaveSource(content);
    
    props.refPostData(content);
    props.updatePostDataFetch(true);
}

export default fetchPostContent;