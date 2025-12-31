import { store } from "../../redux-store/store.js";
import { selectTranslatePostInfo } from "../../redux-store/features/selectors.js";
import { translateFieldNameSort } from "../../helper/index.js";
import { selectTargetContent } from "../../redux-store/features/selectors.js";
import updateMetafieldsKeys from "./update-metafields-keys.js";

const reTranslate = ({ postId, targetLang, availableContentTypes, reTranslationKeys, reTranslationStatus, reTranslateMetaKeys }) => {

    const reTranslationFieldMatch = (old_keys, reTranslationFieldTypes) => {
        return old_keys.join('_') === reTranslationFieldTypes.join('_');
    }

    const reTranslationData = selectTranslatePostInfo(store.getState())?.[postId + '_' + targetLang]?.Retranslate;
    
    const Retranslate = reTranslationData?.status === true;

    let reTranslationFieldTypes = [];

    if (Retranslate && reTranslationData?.reTranslateContent && Object.keys(reTranslationData?.reTranslateContent).length > 0) {
        reTranslationFieldTypes = translateFieldNameSort(Object.keys(reTranslationData?.reTranslateContent));
    }

    const data = {
        reUpdate: false,
        targetContent: false,
        reTranslateKeys: [],
        reTranslateMetaKeys: [],
        status: false
    }

    let updateMetaFieldsKeys=[];

    if(reTranslationKeys && reTranslationKeys.length < 1){
        reTranslationKeys=availableContentTypes;
    }

    if(Retranslate && reTranslationData && reTranslationData.reTranslateContent && reTranslationData.reTranslateContent.metaFields === true && reTranslationData.reTranslateContent.metaFieldsData){
        updateMetaFieldsKeys=updateMetafieldsKeys({metaFields: reTranslationData.reTranslateContent.metaFieldsData});
    }

    if(Retranslate && (!reTranslationFieldMatch(reTranslationKeys, reTranslationFieldTypes) || (!reTranslationFieldTypes.metaFields || reTranslationFieldTypes.metaFields && !reTranslationFieldMatch(reTranslationKeys, updateMetaFieldsKeys)))){

        data.reUpdate = true;
        data.status = true;
        data.reTranslateKeys = reTranslationFieldTypes;
        data.reTranslateMetaKeys = updateMetaFieldsKeys;

        data.targetContent = selectTargetContent(store.getState(), postId, reTranslationFieldTypes, data.reTranslateMetaKeys);

    }else if(!Retranslate && reTranslationStatus && !reTranslationFieldMatch(reTranslationKeys, availableContentTypes)){
        data.reUpdate = true;
        data.status = false;
        data.reTranslateKeys = [];
        data.reTranslateMetaKeys = [];
        data.targetContent = selectTargetContent(store.getState(), postId, availableContentTypes);
    }

    return data;
}

export default reTranslate;