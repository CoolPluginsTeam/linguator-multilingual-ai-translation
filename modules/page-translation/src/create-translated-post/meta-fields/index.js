import { select } from "@wordpress/data";

const translatedMetaFields = (sourceMetaFields, service) => {

    const AllowedMetaFields = select('block-lmatPageTranslation/translate').getAllowedMetaFields();
    const metaFields = sourceMetaFields;

    const updateFieldOnPage=(key, value, sourceValue)=>{
        const selectors=[`[data-depend-id="${key}"]`, `[name="${key}"]`, `[id="${key}"]`];

        selectors.forEach(selector=>{
            const fields=document.querySelectorAll(selector+':not([type="button"]):not([type="checkbox"]):not([type="radio"])');

            fields.forEach(field=>{
                if(field){
                    if(field.value === sourceValue){
                        field.value=value;
                        return;
                    }else{
                        const allInputs=field.querySelectorAll('input:not([type="button"])');
                        allInputs.forEach(input=>{
                            if(input.value === sourceValue){
                                input.value=value;
                                return;
                            }
                        });
    
                        const allTextareas=field.querySelectorAll('textarea');
                        allTextareas.forEach(textarea=>{
                            if(textarea.value === sourceValue){
                                textarea.value=value;
                                return;
                            }
                        });
                    }
                }
            });
            
        });
        
    }

    const translateObjectMetaFields = (keys, value) => {
        Object.keys(value).forEach(key => {
            const keyArr = [...keys, key];
            const uniqueKey = keyArr.join('_lmat_page_translation_');
            if(typeof value[key] === 'string'){
                const translatedValue = select('block-lmatPageTranslation/translate').getTranslatedString('metaFields', value[key], uniqueKey, service);
                let currentObject = metaFields;
                if(translatedValue && '' !== translatedValue){
                    keyArr.forEach((key, index) => {

                        if(index === keyArr.length - 1){
                            updateFieldOnPage(keyArr.join('_'), translatedValue, value[key]);
                            updateFieldOnPage(key, translatedValue, value[key]);
                            currentObject[key] = translatedValue;
                            return;
                        }

                        if(currentObject.hasOwnProperty(key)){
                            currentObject = currentObject[key];
                        }else{
                            currentObject[key] = {};
                            currentObject = currentObject[key];
                        }
                    });
                }
            }
            if(typeof value[key] === 'object' && Object.keys(value[key]).length > 0){
                metaFields[uniqueKey] = translateObjectMetaFields(keyArr, value[key]);
            }
        });
    }

    if (sourceMetaFields && Object.keys(sourceMetaFields).length > 0) {
        Object.keys(sourceMetaFields).forEach(key => {
            if (typeof sourceMetaFields[key] === 'object' && Object.keys(sourceMetaFields[key]).length > 0) {
                translateObjectMetaFields([key], sourceMetaFields[key]);
            } else if(typeof sourceMetaFields[key] === 'string'){
                if (AllowedMetaFields[key] && AllowedMetaFields[key].status) {
                    const sourceValue = sourceMetaFields[key];
                    const translatedValue = select('block-lmatPageTranslation/translate').getTranslatedString('metaFields', sourceValue, key, service);

                    if (translatedValue && '' !== translatedValue) {
                        updateFieldOnPage(key, translatedValue, sourceValue);
                        metaFields[key] = translatedValue;
                    }
                }
            }
        });
    }

    return metaFields;
}

export default translatedMetaFields;