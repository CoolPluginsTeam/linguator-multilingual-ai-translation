import {selectTranslatedContent} from '../../../ReduxStore/features/selectors.js';
import {store} from '../../../ReduxStore/store.js';

const updateElementorContent = async ({source, lang, translatedContent, serviceProvider, postId}) => {

    /**
    * @param {Object} Object
    * @param {string} key
    * @param {string} translateValue
    * @returns {boolean}
    */
    const replaceValue = (Object, key, translateValue) => {
        if (Object && Object[key] && Object[key].trim() !== '') {
            Object[key] = translateValue;

            return true;
        }

        return false;
    }

    const getTransaltedValue=(key)=>{
        const stateValue=selectTranslatedContent(store.getState(), postId, key, lang, serviceProvider);
        return stateValue;
    }

    /**
     * @param {Object} source
     * @param {Object} translation
     */
    const updateTitle=(source, value)=>{
        if(value && '' !== value){
            source.title=getTransaltedValue('title');
        }
    }

    /**
     * @param {Object} source
     * @param {Object} translation
     */
    const updateContent = (source, translation) => {
        Object.keys(translation).forEach(key=>{
            const keys=key.split('_lmat_bulk_content__');
            if(keys[0] === 'title'){
                updateTitle(source, translation[keys[0]]);
            }else if(keys[0] === 'content'){
                let keyArray=keys;

                let currentElement = source.content;
                const translateValue = getTransaltedValue(key);
                let parentElement = null;
                let parentKey = null;

                keyArray=keyArray.slice(1);

                keyArray.forEach(key => {
                    parentElement = currentElement;
                    parentKey = key;
                    currentElement = currentElement[key];
                });

                if (parentElement && parentKey) {
                    replaceValue(parentElement, parentKey, translateValue)
                }
            }
        });
    }

    updateContent(source, translatedContent);

    return source;
}

export default updateElementorContent;
