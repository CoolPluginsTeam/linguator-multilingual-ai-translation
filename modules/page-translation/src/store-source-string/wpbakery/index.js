import { dispatch } from "@wordpress/data";

/**
 * Store WPBakery source strings for translation.
 * Extracts translatable content from WPBakery shortcodes.
 * 
 * @param {Object} post_data - Post data containing WPBakery content
 */
const WPBakerySaveSource = (post_data) => {

    /**
     * Extract and store [lmat_val] tagged content from WPBakery shortcodes.
     * These tags are added by the PHP wpbakery.php filter during content processing.
     * 
     * @param {string} content - WPBakery content with [lmat_val] tags
     */
    const extractLmatValTags = (content) => {
        if (!content || content.trim() === '') {
            return;
        }

        // Pattern to match [lmat_val id="token"]content[/lmat_val]
        // The token format is: ___LMAT_{md5_hash}___
        const lmatValRegex = /\[lmat_val[^\]]*?id=["'](___LMAT_[a-f0-9]{32}___)["'][^\]]*?\](.*?)\[\/lmat_val\]/gis;

        let match;
        let index = 0;

        while ((match = lmatValRegex.exec(content)) !== null) {
            const token = match[1]; // The unique token ID
            const sourceText = match[2]; // The translatable content

            // Skip empty content
            if (!sourceText || sourceText.trim() === '') {
                continue;
            }

            // Create a unique key combining index and token for better tracking
            const uniqueKey = `wpbakery_lmat_val_${index}_${token}`;
            
            // Store the source string in the global store
            dispatch('block-lmatPageTranslation/translate').contentSaveSource(uniqueKey, sourceText);
            
            index++;
        }
    };

    /**
     * Extract translatable content from shortcode attributes.
     * Handles decoded WPBakery attributes (title, text, heading, etc.)
     * 
     * @param {string} content - WPBakery shortcode content
     */
    const extractShortcodeAttributes = (content) => {
        if (!content || content.trim() === '') {
            return;
        }

        // Translatable attributes in WPBakery
        const translatableAttributes = ['title', 'text', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'heading', 'btn_title', 'p', 'div'];
        
        let attributeIndex = 0;

        // Process each vc_ shortcode
        const shortcodeRegex = /\[vc_[\w-]+[^\]]*?\]/g;
        let shortcodeMatch;

        while ((shortcodeMatch = shortcodeRegex.exec(content)) !== null) {
            const shortcode = shortcodeMatch[0];

            // Extract attributes from this shortcode
            translatableAttributes.forEach(attrName => {
                const attrRegex = new RegExp(`${attrName}=["']([^"']+)["']`, 'gi');
                let attrMatch;

                while ((attrMatch = attrRegex.exec(shortcode)) !== null) {
                    const value = attrMatch[1];

                    // Skip empty values, tokens, and protected content
                    if (!value || value.trim() === '' || value.includes('___LMAT_')) {
                        continue;
                    }

                    // Create unique key
                    const uniqueKey = `wpbakery_attr_${attributeIndex}_${attrName}`;
                    
                    // Store the source string
                    dispatch('block-lmatPageTranslation/translate').contentSaveSource(uniqueKey, value);
                    
                    attributeIndex++;
                }
            });
        }
    };

    /**
     * Extract content between shortcode tags.
     * Example: [vc_column_text]Content here[/vc_column_text]
     * 
     * @param {string} content - WPBakery content
     */
    const extractShortcodeContent = (content) => {
        if (!content || content.trim() === '') {
            return;
        }

        let contentIndex = 0;

        // Match shortcodes with content between tags
        const contentRegex = /\[vc_[\w-]+[^\]]*?\]([\s\S]*?)\[\/vc_[\w-]+\]/g;
        let match;

        while ((match = contentRegex.exec(content)) !== null) {
            const innerContent = match[1];

            // Skip empty content
            if (!innerContent || innerContent.trim() === '') {
                continue;
            }

            // Skip if content contains nested shortcodes or lmat_val tags (handled separately)
            if (innerContent.includes('[vc_') || innerContent.includes('[lmat_val')) {
                continue;
            }

            // Skip HTML-only content (no translatable text)
            const textContent = innerContent.replace(/<[^>]+>/g, '').trim();
            if (!textContent) {
                continue;
            }

            // Create unique key
            const uniqueKey = `wpbakery_content_${contentIndex}`;
            
            // Store the source string
            dispatch('block-lmatPageTranslation/translate').contentSaveSource(uniqueKey, innerContent);
            
            contentIndex++;
        }
    };

    /**
     * Process all post data fields.
     */
    Object.keys(post_data).forEach(key => {
        if (key === 'content') {
            // Primary method: Extract [lmat_val] tagged content
            // This is the main approach for WPBakery as the PHP filters add these tags
            extractLmatValTags(post_data[key]);

            // Fallback methods: Extract from shortcodes directly
            // extractShortcodeAttributes(post_data[key]);
            // extractShortcodeContent(post_data[key]);
            
        } else if (['title', 'excerpt'].includes(key)) {
            // Store title and excerpt
            if (post_data[key] && post_data[key].trim() !== '') {
                const action = `${key}SaveSource`;
                dispatch('block-lmatPageTranslation/translate')[action](post_data[key]);
            }
        } else if (key === 'slug_name' && lmatPageTranslationGlobal.slug_translation_option === 'slug_translate') {
            // Store slug for translation
            if (post_data[key] && post_data[key].trim() !== '') {
                dispatch('block-lmatPageTranslation/translate').slugSaveSource(post_data[key]);
            }
        }
    });
};

export default WPBakerySaveSource;
