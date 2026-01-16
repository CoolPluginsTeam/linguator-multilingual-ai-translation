import { select } from '@wordpress/data';
import YoastSeoFields from '../../component/translate-seo-fields/yoast-seo-fields.js';
import RankMathSeo from '../../component/translate-seo-fields/rank-math-seo.js';
import SeoPressFields from '../../component/translate-seo-fields/seo-press.js';
import translatedMetaFields from '../meta-fields/index.js';

/**
 * Updates WPBakery Page Builder content with translations.
 * Handles both frontend and backend editors.
 * 
 * @param {Object} props - Properties containing post content and service info
 */
const updateWPBakeryPage = ({ postContent, modalClose, service }) => {
    const postID = lmatPageTranslationGlobal.current_post_id;
    const AllowedMetaFields = select('block-lmatPageTranslation/translate').getAllowedMetaFields();
    /**
     * Translate WPBakery content by replacing [lmat_val] tagged tokens with translations.
     * The PHP filters wrap translatable content in [lmat_val id="token"]content[/lmat_val] tags.
     * We extract translations and replace the tokens.
     * 
     * @param {string} content - The post content with [lmat_val] tags
     * @returns {string} - Content with translated values
     */
    const translateLmatValTags = (content) => {
        if (!content || content.trim() === '') {
            return content;
        }

        // Pattern to match [lmat_val id="token"]content[/lmat_val]
        // The token format is: ___LMAT_{md5_hash}___
        const lmatValRegex = /\[lmat_val[^\]]*?id=["'](___LMAT_[a-f0-9]{32}___)["'][^\]]*?\](.*?)\[\/lmat_val\]/gis;

        let translatedContent = content;
        let index = 0;

        // Find all [lmat_val] tags and replace tokens with translations
        let match;
        const replacements = [];

        while ((match = lmatValRegex.exec(content)) !== null) {
            const token = match[1]; // The unique token ID
            const sourceText = match[2]; // The original content

            // Skip empty content
            if (!sourceText || sourceText.trim() === '') {
                continue;
            }

            // Create the same unique key used during storage
            const uniqueKey = `wpbakery_lmat_val_${index}_${token}`;
            
            // Get the translated value from the store
            const translatedValue = select('block-lmatPageTranslation/translate')
                .getTranslatedString('content', sourceText, uniqueKey, service);

            // Store replacement: replace the token in shortcode attributes with translated value
            if (translatedValue) {
                replacements.push({
                    token: token,
                    translatedValue: translatedValue
                });
            }
            
            index++;
        }

        // Apply all token replacements
        replacements.forEach(replacement => {
            // Replace the token in shortcode attributes with the translated value
            // The token appears in format: attribute="___LMAT_hash___"
            const tokenRegex = new RegExp(replacement.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            translatedContent = translatedContent.replace(tokenRegex, replacement.translatedValue);
        });

        // Remove all remaining [lmat_val] tags (cleanup)
        translatedContent = translatedContent.replace(/\[lmat_val[^\]]*?\].*?\[\/lmat_val\]/gis, '');

        return translatedContent;
    };

    /**
     * Update post title with translation.
     */
    const updateTitle = () => {
        if (!postContent.title || postContent.title.trim() === '') {
            return;
        }

        const translatedTitle = select('block-lmatPageTranslation/translate')
            .getTranslatedString('title', postContent.title, null, service);

        if (!translatedTitle || translatedTitle.trim() === '') {
            return;
        }

        // Update title input field
        const titleInput = document.querySelector('input#title[name="post_title"]');
        if (titleInput) {
            titleInput.value = translatedTitle;
        }

        // Hide title label
        const titleLabel = document.querySelector('#titlediv label');
        if (titleLabel) {
            titleLabel.classList.add('screen-reader-text');
        }
    };

    /**
     * Update post slug with translation.
     */
    const updateSlug = () => {
        if (!postContent.slug_name || postContent.slug_name.trim() === '') {
            return;
        }

        let translatedSlug = '';

        if (lmatPageTranslationGlobal.slug_translation_option === 'slug_translate') {
            translatedSlug = select('block-lmatPageTranslation/translate')
                .getTranslatedString('slug', postContent.slug_name, null, service);
        } else if (lmatPageTranslationGlobal.slug_translation_option === 'slug_keep') {
            translatedSlug = lmatPageTranslationGlobal.slug_name;
        }

        if (!translatedSlug || translatedSlug.trim() === '') {
            return;
        }

        // Update slug input
        const slugInput = document.querySelector('input#post_name[name="post_name"]');
        if (slugInput) {
            slugInput.value = translatedSlug;
        }

        // Hide slug label
        const slugLabel = document.querySelector('#slugdiv label');
        if (slugLabel) {
            slugLabel.classList.add('screen-reader-text');
        }
    };

    /**
     * Update excerpt with translation.
     */
    const updateExcerpt = () => {
        if (!postContent.excerpt || postContent.excerpt.trim() === '') {
            return;
        }

        const translatedExcerpt = select('block-lmatPageTranslation/translate')
            .getTranslatedString('excerpt', postContent.excerpt, null, service);

        if (!translatedExcerpt || translatedExcerpt.trim() === '') {
            return;
        }

        // Update excerpt textarea
        const excerptTextarea = document.querySelector('textarea#excerpt');
        if (excerptTextarea) {
            excerptTextarea.value = translatedExcerpt;
        }

        // Update TinyMCE editor if exists (for WooCommerce products)
        if (lmatPageTranslationGlobal.post_type === 'product' && window.tinymce) {
            const excerptEditor = tinymce.get('excerpt');
            if (excerptEditor) {
                excerptEditor.setContent(translatedExcerpt);
            }
        }
    };

    /**
     * Update SEO meta fields (Yoast, RankMath, SEOPress).
     */
    const updateMetaFields = () => {
        const metaFieldsData = postContent.metaFields;

        if (!metaFieldsData) {
            return;
        }

        Object.keys(metaFieldsData).forEach(key => {
            if (!Object.keys(AllowedMetaFields).includes(key)) {
                return;
            }

            const translatedValue = select('block-lmatPageTranslation/translate')
                .getTranslatedString('metaFields', metaFieldsData[key], key, service);

            // Update based on SEO plugin
            if (key.startsWith('_yoast_wpseo_') && AllowedMetaFields[key].inputType === 'string') {
                YoastSeoFields({ key: key, value: translatedValue });
            } else if (key.startsWith('rank_math_') && AllowedMetaFields[key].inputType === 'string') {
                RankMathSeo({ key: key, value: translatedValue });
            } else if (key.startsWith('_seopress_') && AllowedMetaFields[key].inputType === 'string') {
                SeoPressFields({ key: key, value: translatedValue });
            }
        });
    };

    /**
     * Update ACF fields with translations.
     */
    const updateACFFields = () => {
        const metaFieldsData = postContent.metaFields;

        if (!window.acf || !metaFieldsData) {
            return;
        }

        acf.getFields().forEach(field => {
            const fieldData = JSON.parse(JSON.stringify({
                key: field.data.key,
                type: field.data.type,
                name: field.data.name
            }));

            // Handle repeater fields
            if (field.$el && field.$el.closest('.acf-field.acf-field-repeater').length > 0) {
                const rowId = field.$el.closest('.acf-row').data('id');
                const repeaterItemName = field.$el.closest('.acf-field.acf-field-repeater').data('name');

                if (rowId && rowId !== '') {
                    const index = rowId.replace('row-', '');
                    fieldData.name = repeaterItemName + '_' + index + '_' + fieldData.name;
                }
            }

            if (field.data && field.data.key && Object.keys(AllowedMetaFields).includes(fieldData.name)) {
                const sourceValue = metaFieldsData[field.data.name] ? metaFieldsData[field.data.name] : field.val();

                const translatedValue = select('block-lmatPageTranslation/translate')
                    .getTranslatedString('metaFields', sourceValue, fieldData.name, service);

                // Handle WYSIWYG fields
                if (field.data.type === 'wysiwyg' && window.tinymce) {
                    const editorId = field.data.id;
                    const tinymceContent = translatedValue.replace(/(\r\n\r\n|\r\n)/g, '</p><p>');

                    const editor = tinymce.get(editorId);
                    if (editor) {
                        editor.setContent(tinymceContent);
                    }

                    const textarea = document.querySelector(`textarea#${editorId}`);
                    if (textarea) {
                        textarea.value = translatedValue;
                    }
                } else {
                    field.val(translatedValue);
                }
            }
        });
    };

    /**
     * Update WPBakery content in the editor.
     * This updates the actual content in the WordPress editor (TinyMCE or Text mode)
     * and refreshes the WPBakery backend editor if it's active.
     */
    const updateWPBakeryContent = () => {
        if (!postContent.content || postContent.content.trim() === '') {
            return;
        }

        // Translate content by replacing [lmat_val] tokens with translations
        let translatedContent = translateLmatValTags(postContent.content);

        // Update in WordPress editor
        const contentWrapper = document.querySelector('#wp-content-wrap');
        if (contentWrapper) {
            // Switch to HTML mode to update raw content
            const htmlButton = contentWrapper.querySelector('.wp-switch-editor.switch-html');
            const visualButton = contentWrapper.querySelector('.wp-switch-editor.switch-tmce');
            
            if (htmlButton) {
                htmlButton.click();
                
                const textarea = document.querySelector('textarea#content');
                if (textarea) {
                    textarea.value = translatedContent;
                }

                // Switch back to visual mode
                if (visualButton) {
                    setTimeout(() => {
                        visualButton.click();
                    }, 100);
                }
            } else if (window.tinymce && tinymce.get('content')) {
                // Directly update TinyMCE if HTML mode not available
                tinymce.get('content').setContent(translatedContent);
            }
        }

        // Update textarea as fallback
        const contentTextarea = document.querySelector('textarea#content');
        if (contentTextarea) {
            contentTextarea.value = translatedContent;
        }

        // Update WPBakery Backend Editor if it's active
        updateWPBakeryBackendEditor();
    };

    /**
     * Update the WPBakery backend editor with translated content.
     * This triggers WPBakery to reload and display the updated shortcodes.
     * 
     * @param {string} content - The translated content with WPBakery shortcodes
     */
    const updateWPBakeryBackendEditor = (content) => {
        const savebtn= document.getElementById('save-post');
        if (savebtn) {
            savebtn.click();
        }
        
    };

    /**
     * Save meta fields via AJAX (if sync is disabled).
     */
    const saveMetaFields = async () => {
        if (!lmatPageTranslationGlobal.update_post_meta_fields || !lmatPageTranslationGlobal.post_meta_fields_key) {
            return;
        }

        const requestBody = {
            action: lmatPageTranslationGlobal.update_post_meta_fields,
            post_id: postID,
            meta_fields: JSON.stringify(translatedMetaFields(postContent.metaFields, service)),
            post_meta_fields_key: lmatPageTranslationGlobal.post_meta_fields_key
        };

        try {
            const response = await fetch(lmatPageTranslationGlobal.ajax_url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json',
                },
                body: new URLSearchParams(requestBody)
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('Meta fields saved successfully');
            } else {
                console.error('Failed to save meta fields:', data);
            }
        } catch (error) {
            console.error('Error saving meta fields:', error);
        }
    };

    /**
     * Update translation status via AJAX.
     */
    const saveTranslationStatus = async () => {
        const requestBody = {
            action: lmatPageTranslationGlobal.action_update_status || 'lmat_update_classic_translate_status',
            post_id: postID,
            status: 'completed',
            lmat_classic_translate_nonce: lmatPageTranslationGlobal.classic_status_key
        };

        try {
            const response = await fetch(lmatPageTranslationGlobal.ajax_url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json',
                },
                body: new URLSearchParams(requestBody)
            });
            
            const data = await response.json();
            
            if (data.success) {
                const translateButton = document.querySelector('button#lmat-page-translation-button[name="lmat_page_translation_meta_box_translate"]');
                if (translateButton) {
                    translateButton.setAttribute('title', 'Translation process completed successfully.');
                    translateButton.disabled = true;
                }
                console.log('WPBakery translation status updated successfully');
            } else {
                console.error('Failed to update translation status:', data);
            }
        } catch (error) {
            console.error('Error updating translation status:', error);
        }
    };

    // Execute translation updates
    try {
        // Update title
        updateTitle();

        // Update slug
        updateSlug();

        // Update excerpt
        updateExcerpt();

        // Update WPBakery content
        updateWPBakeryContent();

        // Update meta fields if sync is disabled
        if (lmatPageTranslationGlobal.postMetaSync === 'false') {
            updateMetaFields();
            updateACFFields();
        }

        // Save meta fields and update status via AJAX
        setTimeout(async () => {
            // Save meta fields first (if sync is disabled)
            if (lmatPageTranslationGlobal.postMetaSync === 'false') {
                await saveMetaFields();
            }
            
            // Then update translation status
            await saveTranslationStatus();
            
            // Close modal
            modalClose();
        }, 500);

    } catch (error) {
        console.error('Error during WPBakery translation:', error);
        modalClose();
    }
};

export default updateWPBakeryPage;
