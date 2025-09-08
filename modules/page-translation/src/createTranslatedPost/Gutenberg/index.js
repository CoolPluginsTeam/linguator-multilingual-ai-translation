import createBlocks from './createBlock.js';
import { dispatch, select } from '@wordpress/data';
import YoastSeoFields from '../../component/TranslateSeoFields/YoastSeoFields.js';
import RankMathSeo from '../../component/TranslateSeoFields/RankMathSeo.js';
import SeoPressFields from '../../component/TranslateSeoFields/SeoPress.js';

/**
 * Translates the post content and updates the post title, excerpt, and content.
 * 
 * @param {Object} props - The properties containing post content, translation function, and block rules.
 */
const translatePost = (props) => {
    const { editPost } = dispatch('core/editor');
    const { modalClose, postContent, service } = props;

    /**
     * Updates the post title and excerpt text based on translation.
     */
    const postDataUpdate = () => {
        const data = {};
        const editPostData = Object.keys(postContent).filter(key => ['title', 'excerpt'].includes(key));

        editPostData.forEach(key => {
            const sourceData = postContent[key];
            if (sourceData.trim() !== '') {
                const translateContent = select('block-lmatPageTranslation/translate').getTranslatedString(key, sourceData, null, service);

                data[key] = translateContent;
            }
        });

        editPost(data);

        if(lmatPageTranslationGlobal.slug_translation_option === 'slug_translate'){
            const slugData = select('block-lmatPageTranslation/translate').getTranslatedString('slug', postContent.slug_name, null, service);

            editPost({ slug: slugData });
        }

        if(lmatPageTranslationGlobal.slug_translation_option === 'slug_keep'){
            const slugData=lmatPageTranslationGlobal.slug_name;
            setTimeout(() => {
                editPost({ slug: slugData });
            }, 500);
        }
    }

    /**
     * Updates the post meta fields based on translation.
     */
    const postMetaFieldsUpdate = () => {
        const metaFieldsData = postContent.metaFields;
        const AllowedMetaFields = select('block-lmatPageTranslation/translate').getAllowedMetaFields();

        Object.keys(metaFieldsData).forEach(key => {
            // Update yoast seo meta fields
            if (Object.keys(AllowedMetaFields).includes(key)) {
                const translatedMetaFields = select('block-lmatPageTranslation/translate').getTranslatedString('metaFields', metaFieldsData[key][0], key, service);
                if (key.startsWith('_yoast_wpseo_') && AllowedMetaFields[key].inputType === 'string') {
                    YoastSeoFields({ key: key, value: translatedMetaFields });
                } else if (key.startsWith('rank_math_') && AllowedMetaFields[key].inputType === 'string') {
                    RankMathSeo({ key: key, value: translatedMetaFields });
                } else if (key.startsWith('_seopress_') && AllowedMetaFields[key].inputType === 'string') {
                    SeoPressFields({ key: key, value: translatedMetaFields });
                } else {
                    editPost({ meta: { [key]: translatedMetaFields } });
                }
            };
        });
    }

    /**
     * Updates the post ACF fields based on translation.
     */
    const postAcfFieldsUpdate = () => {
        const AllowedMetaFields = select('block-lmatPageTranslation/translate').getAllowedMetaFields();
        const metaFieldsData = postContent.metaFields;

        
        if (window.acf) {
            acf.getFields().forEach(field => {

                const fieldData=JSON.parse(JSON.stringify({key: field.data.key, type: field.data.type, name: field.data.name}));
                let repeaterField = false;
                // Update repeater fields
                if(field.$el && field.$el.closest('.acf-field.acf-field-repeater') && field.$el.closest('.acf-field.acf-field-repeater').length > 0){
                    const rowId=field.$el.closest('.acf-row').data('id');
                    const repeaterItemName=field.$el.closest('.acf-field.acf-field-repeater').data('name');

                    if(rowId && '' !== rowId){
                        const index=rowId.replace('row-', '');
                    
                        fieldData.key=fieldData.key+'_'+index;

                        fieldData.name=repeaterItemName+'_'+index+'_'+fieldData.name;
                        repeaterField = true;
                    }

                }

               if(field.data && field.data.key && Object.keys(AllowedMetaFields).includes(fieldData.key)){
                   const fieldKey = fieldData.key;
                   const fieldName = field.data.name;
                   const inputType = field.data.type;

                   const sourceValue = metaFieldsData[fieldName]? metaFieldsData[fieldName][0] : field?.val();

                    const translatedMetaFields = select('block-lmatPageTranslation/translate').getTranslatedString('metaFields', sourceValue, fieldKey, service);

                    if('wysiwyg' === inputType && tinymce){
                        const editorId = field.data.id;
                        tinymce.get(editorId)?.setContent(translatedMetaFields);
                    }else{
                        field.val(translatedMetaFields);
                    }
               }
            });
        }
    }

    /**
     * Updates the post content based on translation.
     */
    const postContentUpdate = () => {
        const postContentData = postContent.content;

        if (postContentData.length <= 0) {
            return;
        }

        Object.values(postContentData).forEach(block => {
            createBlocks(block, service);
        });
    }

    // Update post title and excerpt text
    postDataUpdate();
    // Update post meta fields
    postMetaFieldsUpdate();
    // Update post ACF fields
    postAcfFieldsUpdate();
    // Update post content
    postContentUpdate();
    // Close string modal box
    modalClose();
}

export default translatePost;