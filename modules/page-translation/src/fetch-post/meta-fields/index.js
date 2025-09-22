import { dispatch, select } from "@wordpress/data";

const MetaFieldsFetch = async (props) => {
    const apiUrl = window?.lmatPageTranslationGlobal?.ajax_url;
    const apiController = [];

    const contentFetchStatus = select('block-lmatPageTranslation/translate').contentFetchStatus();
    if (contentFetchStatus) {
        return;
    }

    const destroyHandler = () => {
        apiController.forEach(controller => {   
            controller.abort('Modal Closed');
        });
    }

    props.updateDestroyHandler(() => {
        destroyHandler();
    });

    const storeMetaFields=({key, value, type, status, allowedMetaFields})=>{
        // Check if value is not a date or timestamp like 03/16/2023 6:02 AM
        // Simple regex to match MM/DD/YYYY and optional time
        const dateTimeRegex = /^\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?$/i;
        const digitsWithSymbols = /^[0-9.\- _#!$%^&*()+~`]+$/;

        if (dateTimeRegex.test(value)) {
            // If value is a date or timestamp, skip saving as translatable string
            return;
        }

        if (digitsWithSymbols.test(value)) {
            // If value is a number, skip saving as translatable string
            return;
        }
        
        dispatch('block-lmatPageTranslation/translate').allowedMetaFields({ id: key, type, status});
        dispatch('block-lmatPageTranslation/translate').metaFieldsSaveSource(key, value);
    }
    
    const getMetaFields = async () => {
        const action=window?.lmatPageTranslationGlobal?.get_meta_fields;
        const meta_fields_key=window?.lmatPageTranslationGlobal?.meta_fields_key;
        const postId=parseInt(props.postId);

        if(!action || !meta_fields_key || !postId){
            return;
        }

        const allowedCustomFieldsController = new AbortController();
        apiController.push(allowedCustomFieldsController);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            body: new URLSearchParams({
                action,
                meta_fields_key,
                postId: postId
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            signal: allowedCustomFieldsController.signal,
        });
    
        const data = await response.json();
        const metaFields = data?.data?.metaFields;
        const allowedMetaFields = data?.data?.allowedMetaFields;
    
        if(metaFields && Object.keys(metaFields).length > 0){
            Object.keys(metaFields).forEach(key => {
                if(allowedMetaFields[key] && allowedMetaFields[key].status){
                    if(typeof metaFields[key] === 'string'){
                        const value=metaFields[key];

                        // Store meta fields
                        storeMetaFields({key, value, type: allowedMetaFields[key].type, status: allowedMetaFields[key].status, allowedMetaFields});
                    }else if(typeof metaFields[key] === 'object' && Object.keys(metaFields[key]).length > 0){
                        // Store object meta fields
                        storeObjectMetaFields([key], metaFields[key], allowedMetaFields);
                    }
                }
            });
        }

        props.refPostData({'metaFields': metaFields});
    }

    const storeObjectMetaFields = (keys, value, allowedMetaFields) => {
        Object.keys(value).forEach(key => {
            const keyArr=[...keys, key];
            const uniqueKey = keyArr.join('_lmat_page_translation_');
            if(typeof value[key] === 'string'){
                const metaValue=value[key];
               
                // Store meta fields
                storeMetaFields({key: uniqueKey, value: metaValue, type: 'string', status: allowedMetaFields[keys[0]].status, allowedMetaFields});
            }else if(typeof value[key] === 'object' && Object.keys(value[key]).length > 0){
                // Store object meta fields
                storeObjectMetaFields(keyArr, value[key], allowedMetaFields);
            }
        });
    }
    
    if("false" === window?.lmatPageTranslationGlobal?.postMetaSync){
        await getMetaFields();
    }
}

export default MetaFieldsFetch;