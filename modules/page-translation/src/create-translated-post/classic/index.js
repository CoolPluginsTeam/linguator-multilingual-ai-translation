import { dispatch, select } from '@wordpress/data';
import YoastSeoFields from '../../component/translate-seo-fields/yoast-seo-fields.js';
import RankMathSeo from '../../component/translate-seo-fields/rank-math-seo.js';
import SeoPressFields from '../../component/translate-seo-fields/seo-press.js'
import translatedMetaFields from '../meta-fields/index.js';

/**
 * Translates the post content and updates the post title, excerpt, and content.
 * 
 * @param {Object} props - The properties containing post content, translation function, and block rules.
 */
const UpdateClassicPage = (props) => {
    const { modalClose, postContent, service } = props;
    const AllowedMetaFields = select('block-lmatPageTranslation/translate').getAllowedMetaFields();

    /**
     * Updates the post title and excerpt text based on translation.
     */
    const postDataUpdate = () => {

        if(lmatPageTranslationGlobal.slug_translation_option === 'slug_translate' || lmatPageTranslationGlobal.slug_translation_option === 'slug_keep'){
            let translateContent = '';
            if(lmatPageTranslationGlobal.slug_translation_option === 'slug_translate'){
                translateContent = select('block-lmatPageTranslation/translate').getTranslatedString('slug', postContent.slug_name, null, service);
            }

            if(lmatPageTranslationGlobal.slug_translation_option === 'slug_keep'){
                translateContent = lmatPageTranslationGlobal.slug_name;
            }

            const slugBox = document.querySelector('#slugdiv');
            const slugInput = slugBox?.querySelector('input#post_name[name="post_name"]');
            const slugLabel=slugBox?.querySelector('label');

            if(slugInput) {
                slugInput.value = translateContent;
            }

            if(slugLabel) {
                slugLabel.classList.add('screen-reader-text');
            }
        }

        if(postContent.title && postContent.title.trim() !== '') {
            const translateContent = select('block-lmatPageTranslation/translate').getTranslatedString('title', postContent.title, null, service);
            const titleBox = document.querySelector('#titlediv');
            const titleInput = titleBox?.querySelector('input#title[name="post_title"]');
            const titleLabel=titleBox?.querySelector('label');

            if(titleInput) {
                titleInput.value = translateContent;
            }

            if(titleLabel) {
                titleLabel.classList.add('screen-reader-text');
            }
        }

        if(postContent.excerpt && postContent.excerpt.trim() !== '') { 
            const translateContent = select('block-lmatPageTranslation/translate').getTranslatedString('excerpt', postContent.excerpt, null, service);
            const excerptBox = document.querySelector('#postexcerpt.postbox textarea#excerpt');
            if(excerptBox) {
                excerptBox.value = translateContent;
            }

            if(lmatPageTranslationGlobal.post_type =='product' && window.tinymce){
                const excerptTinymce = tinymce.get('excerpt');
                
                if(excerptTinymce) {
                    excerptTinymce.setContent(translateContent);
                }
            }
        }

    }

    const updateMetaFieldsTable = () =>{
        const customStuff=document.querySelector('#postcustomstuff');

        const inputFields=customStuff?.querySelectorAll('tbody#the-list td.left input[type="text"][value]');

        if(inputFields && inputFields.length > 0){
            const inputFieldsArray=Array.from(inputFields);

            inputFieldsArray.forEach(inputField => {
                const value=inputField?.value;

                if(value && '' !== value && Object.keys(AllowedMetaFields).includes(value)){
                    let metaId=inputField?.closest('tr').id;
                    metaId=metaId.replace('meta-', '');

                    if(metaId && '' !== metaId){
                        const valueInputField=document.querySelector(`#meta-${metaId}-value[name="meta[${metaId}][value]"]`);
                    
                        if(valueInputField && valueInputField.value ){
                            const translatedValue=select('block-lmatPageTranslation/translate').getTranslatedString('metaFields', valueInputField.value, value, service);
                            if(translatedValue && '' !== translatedValue){
                                valueInputField.value=translatedValue;
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Updates the post meta fields based on translation.
     */
    const postMetaFieldsUpdate = () => {
        const metaFieldsData = postContent.metaFields;

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
                }
            };
        });
    }

    /**
     * Updates the post ACF fields based on translation.
     */
    const postAcfFieldsUpdate = () => {
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
                    
                        fieldData.name=repeaterItemName+'_'+index+'_'+fieldData.name;
                        repeaterField = true;
                    }

                }

               if(field.data && field.data.key && Object.keys(AllowedMetaFields).includes(fieldData.name)){
                   const fieldName = field.data.name;
                   const inputType = field.data.type;

                   const sourceValue = metaFieldsData[fieldName]? metaFieldsData[fieldName] : field?.val();

                    const translatedMetaFields = select('block-lmatPageTranslation/translate').getTranslatedString('metaFields', sourceValue, fieldData.name, service);

                    if('wysiwyg' === inputType && window.tinymce){
                        const editorId = field.data.id;
                        tinymce.get(editorId)?.setContent(translatedMetaFields);
                    }else{
                        field.val(translatedMetaFields);
                    }
               }
            });
        }
    }

    function splitContentWithDynamicBreaks(content) {
        const result = [];
        const regex = /(\r\n|\r|\n)/g;

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(content)) !== null) {
            // Push the content before the line break
            if (match.index > lastIndex) {
                result.push(content.slice(lastIndex, match.index));
            }

            // Escape line break and wrap with marker
            const escapedBreak = match[0];

            result.push(`lmat_skip_content_open_${escapedBreak}_lmat_skip_content_end`);

            lastIndex = regex.lastIndex;
        }

        // Push remaining content after the last match
        if (lastIndex < content.length) {
            result.push(content.slice(lastIndex));
        }

        return result;
    }

    /**
     * Updates the post content based on translation.
     */
    const postContentUpdate = () => {
        const arrContent = splitContentWithDynamicBreaks(postContent.content);

        const strings = [];

        arrContent.forEach((text, index) => {
            const entity=(/^&[a-zA-Z0-9#]+;$/.test(text));
            const htmlTag = /^<\/?\s*[a-zA-Z0-9#]+\s*\/?>$/.test(text);
            const isEmptyHtmlTag = /^<\s*\/?\s*[a-zA-Z0-9#]+\s*><\/\s*\/?\s*[a-zA-Z0-9#]+\s*>$/.test(text);
            const blockCommentTag = /<!--[\s\S]*?-->/g.test(text) && text.indexOf('<!--') < text.indexOf('-->');

            const plainText=!entity && !htmlTag && !isEmptyHtmlTag && !blockCommentTag; 

            if(text !== '' && !text.includes('lmat_skip_content_open_') && plainText){
                const uniqueKey = 'classic_index_' + index;
                const translatedText = select('block-lmatPageTranslation/translate').getTranslatedString('content', text, uniqueKey, service);
                strings.push(translatedText);
            } else if (text.includes('lmat_skip_content_open_')) {
                const escapedBreak = text.replace('lmat_skip_content_open_', '').replace('_lmat_skip_content_end', '');
                strings.push(escapedBreak);
            } else {
                strings.push(text);
            }
        });

        const content = strings.join('');

        const tabWrapper = document.querySelector('#wp-content-wrap .wp-editor-tabs');
        if (tabWrapper) {
            const htmlButton = tabWrapper?.querySelector('.wp-switch-editor.switch-html');
            const tinymceButton = tabWrapper?.querySelector('.wp-switch-editor.switch-tmce');
            if (htmlButton) {
                htmlButton.click();
                const textArea = document.querySelector('textarea#content');
                if (textArea) {
                    textArea.value = content;
                }

                if (tinymceButton) {
                    tinymceButton.click();
                    return;
                }
            }

            if (tinymceButton && window.tinymce) {
                tinymceButton.click();
                tinymce.get('content')?.setContent(content);
                return;
            }
        }

        if (window.tinymce &&tinymce.get('content')) {
            tinymce.get('content')?.setContent(content);
        }
    }

    const updatePostMetaFields = () => {
        const ajaxUrl=window.lmatPageTranslationGlobal.ajax_url;
        const postId=window.lmatPageTranslationGlobal.current_post_id;
        const nonce=window.lmatPageTranslationGlobal.post_meta_fields_key;
        const action=window.lmatPageTranslationGlobal.update_post_meta_fields;
        
        if(!postId || !nonce || !action){
            return;
        }

        const requestBody={
            action: action,
            post_id: postId,
            meta_fields: JSON.stringify(translatedMetaFields(postContent.metaFields, service)),
            post_meta_fields_key: nonce
        }
        
        fetch(ajaxUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(requestBody)
        })
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error('Error:', error); 
        });
    }

    /**
     * Updates the translate status.
     */
    const updateTranslateStatus = () => {
        const ajaxUrl=window.lmatPageTranslationGlobal.ajax_url;
        const postId=window.lmatPageTranslationGlobal.current_post_id;
        const nonce=window.lmatPageTranslationGlobal.classic_status_key;
        const action=window.lmatPageTranslationGlobal.action_update_status;

        const requestBody={
            action: action,
            post_id: postId,
            status: 'completed',
            update_translation_status_key: nonce
        }

        fetch(ajaxUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(requestBody)
        })
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error('Error:', error); 
        });
    }

    // Update post title and excerpt text
    postDataUpdate();

    // Update post seo & acf fields on page
    if(lmatPageTranslationGlobal.postMetaSync === 'false'){
        // Update post meta fields
        postMetaFieldsUpdate();

        // Update post ACF fields
        postAcfFieldsUpdate();

        // Update metaFields classic editor custom fields table for prevent overwrite issue.
        updateMetaFieldsTable();
    }

    // Update post content
    postContentUpdate();

    // Close string modal box
    setTimeout(() => {
        modalClose();
    }, 500);

    // Update all translation supported post meta fields using ajax request
    if(lmatPageTranslationGlobal.postMetaSync === 'false'){
        updatePostMetaFields();
    }

    // Update translate status
    updateTranslateStatus();
}

export default UpdateClassicPage;