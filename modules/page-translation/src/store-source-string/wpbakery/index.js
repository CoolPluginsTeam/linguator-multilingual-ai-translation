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
     * Process all post data fields.
     */
    Object.keys(post_data).forEach(key => {
        if (key === 'content') {
            // Extract [lmat_val] tagged content added by PHP filters
            extractLmatValTags(post_data[key]);
            
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
