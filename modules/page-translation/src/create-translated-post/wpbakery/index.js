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
     * Extract and translate WPBakery shortcode attributes.
     * Finds translatable attributes and prepares translations.
     * 
     * @param {string} content - The post content with WPBakery shortcodes
     * @returns {string} - Content with translated attributes
     */
    const translateShortcodeAttributes = (content) => {
        if (!content || content.trim() === '') {
            return content;
        }

        // Translatable attributes in WPBakery shortcodes
        const translatableAttributes = ['title', 'text', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'heading', 'btn_title', 'p', 'div'];
        
        // Counter for unique keys
        let attributeIndex = 0;

        // Process each vc_ shortcode
        const updatedContent = content.replace(/(\[vc_[\w-]+)([^\]]*?)(\])/g, (match, tagStart, attributes, tagEnd) => {
            let updatedAttributes = attributes;

            // Find and translate each translatable attribute
            translatableAttributes.forEach(attrName => {
                const attrRegex = new RegExp(`(${attrName})=(["\'])([^"\']*?)\\2`, 'g');
                
                updatedAttributes = updatedAttributes.replace(attrRegex, (attrMatch, attr, quote, value) => {
                    // Skip empty values
                    if (!value || value.trim() === '') {
                        return attrMatch;
                    }

                    // Create unique key for this attribute
                    const uniqueKey = `wpbakery_attr_${attributeIndex}_${attr}`;
                    attributeIndex++;

                    // Get translation from store
                    const translatedValue = select('block-lmatPageTranslation/translate')
                        .getTranslatedString('content', value, uniqueKey, service);

                    // Return updated attribute with translated value
                    return `${attr}=${quote}${translatedValue}${quote}`;
                });
            });

            return tagStart + updatedAttributes + tagEnd;
        });

        return updatedContent;
    };

    /**
     * Extract and translate content between shortcode tags.
     * Handles content like: [vc_column_text]Content here[/vc_column_text]
     * 
     * @param {string} content - The post content
     * @returns {string} - Content with translated inner content
     */
    const translateShortcodeContent = (content) => {
        if (!content || content.trim() === '') {
            return content;
        }

        let contentIndex = 0;

        // Match shortcodes with content between tags
        // Pattern: [shortcode]content[/shortcode]
        const updatedContent = content.replace(/(\[vc_[\w-]+[^\]]*?\])([\s\S]*?)(\[\/vc_[\w-]+\])/g, 
            (match, openTag, innerContent, closeTag) => {
                // Skip if content is empty or only whitespace
                if (!innerContent || innerContent.trim() === '') {
                    return match;
                }

                // Skip if content contains nested shortcodes (will be handled recursively)
                if (innerContent.includes('[vc_')) {
                    return match;
                }

                // Skip HTML-only content (no translatable text)
                const textContent = innerContent.replace(/<[^>]+>/g, '').trim();
                if (!textContent) {
                    return match;
                }

                // Create unique key
                const uniqueKey = `wpbakery_content_${contentIndex}`;
                contentIndex++;

                // Get translation
                const translatedContent = select('block-lmatPageTranslation/translate')
                    .getTranslatedString('content', innerContent, uniqueKey, service);

                return openTag + translatedContent + closeTag;
            }
        );

        return updatedContent;
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
     * This updates the actual content in the WordPress editor (TinyMCE or Text mode).
     */
    const updateWPBakeryContent = () => {
        if (!postContent.content || postContent.content.trim() === '') {
            return;
        }

        let translatedContent = postContent.content;

        // First pass: Translate shortcode attributes
        translatedContent = translateShortcodeAttributes(translatedContent);

        // Second pass: Translate content between shortcode tags
        translatedContent = translateShortcodeContent(translatedContent);

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
    };

    /**
     * Save translated content and meta fields via AJAX.
     */
    const saveTranslatedContent = () => {
        const requestBody = {
            action: lmatPageTranslationGlobal.update_classic_translate_status || 'lmat_update_classic_translate_status',
            post_id: postID,
            status: 'completed',
            lmat_page_translation_nonce: lmatPageTranslationGlobal.ajax_nonce
        };

        // Add slug if translation is enabled
        if (postContent.slug_name && postContent.slug_name.trim() !== '') {
            if (lmatPageTranslationGlobal.slug_translation_option === 'slug_translate') {
                const translatedSlug = select('block-lmatPageTranslation/translate')
                    .getTranslatedString('slug', postContent.slug_name, null, service);
                
                if (translatedSlug && translatedSlug.trim() !== '') {
                    requestBody.post_name = translatedSlug;
                }
            }
        }

        // Add meta fields if sync is disabled
        if (lmatPageTranslationGlobal.postMetaSync === 'false') {
            requestBody.meta_fields = JSON.stringify(translatedMetaFields(postContent.metaFields, service));
        }

        fetch(lmatPageTranslationGlobal.ajax_url, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const translateButton = document.querySelector('.lmat-page-translation-button[name="lmat_page_translation_meta_box_translate"]');
                if (translateButton) {
                    translateButton.setAttribute('title', 'Translation process completed successfully.');
                }
                console.log('WPBakery translation completed successfully');
            } else {
                console.error('Failed to save WPBakery translation:', data.data);
            }

            modalClose();
        })
        .catch(error => {
            modalClose();
            console.error('Error saving WPBakery translation:', error);
        });
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

        // Save everything via AJAX
        setTimeout(() => {
            saveTranslatedContent();
        }, 500);

    } catch (error) {
        console.error('Error during WPBakery translation:', error);
        modalClose();
    }
};

export default updateWPBakeryPage;
