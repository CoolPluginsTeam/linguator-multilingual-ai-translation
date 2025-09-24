import {selectTranslatedContent} from '../../../redux-store/features/selectors.js';
import {store} from '../../../redux-store/store.js';
import updateMetaFields from '../metaFields/update-meta-fields.js';

const updateElementorContent = async ({source, lang, translatedContent, serviceProvider, postId}) => {

    /**
    * @param {Object} Object
    * @param {string} key
    * @param {string} translateValue
    * @returns {boolean}
    */
    const replaceValue = (Object, key, translateValue) => {
        if (Object && Object[key] && typeof Object[key] === 'string' && Object[key].trim() !== '') {
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
     * @param {string} value
     */
    const updateTitle=(source, value)=>{
        if(value && '' !== value){
            source.title=getTransaltedValue('title');
        }
    }

    /**
     * @param {Object} source
     * @param {string} value
     */
    const updatePostName=(source, value)=>{
        if(value && '' !== value){
            source.post_name=getTransaltedValue('post_name');
        }
    }

    const updateExcerpt=(source, value)=>{
        if(value && '' !== value){
            source.excerpt=getTransaltedValue('excerpt');
        }
    }

    /**
     * @param {Object} source
     * @param {Object} translation
     */
    const updateContent = (source, translation) => {
        Object.keys(translation).forEach(key=>{
            const keys=key.split('_lmat_bulk_content_temp_');
            if(keys[0] === 'title'){
                updateTitle(source, translation[keys[0]]);
            }else if(keys[0] === 'post_name'){
                updatePostName(source, translation[keys[0]]);
            }else if(keys[0] === 'excerpt'){
                updateExcerpt(source, translation[keys[0]]);
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

    if("false" === lmatBulkTranslationGlobal.postMetaSync && source.metaFields && Object.keys(source.metaFields).length > 0){
        source.metaFields=updateMetaFields(source.metaFields, lang, serviceProvider, postId);
      }

    return source;
}

export default updateElementorContent;
