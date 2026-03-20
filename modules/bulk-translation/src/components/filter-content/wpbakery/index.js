import storeSourceString from '../../store-source-string/index.js';

/**
 * Filter WPBakery Page Builder content for bulk translation.
 * Extracts [lmat_val] tagged strings from WPBakery shortcodes.
 * 
 * The PHP wpbakery.php filters (decode_wpbakery_shortcodes and expose_translatable_attributes)
 * wrap translatable content in [lmat_val id="token"]content[/lmat_val] tags.
 * We need to extract and store these for translation.
 * 
 * @param {Object} params - Filter parameters
 * @param {string} params.content - WPBakery content with [lmat_val] tags
 * @param {string} params.service - Translation service provider
 * @param {number} params.postId - Post ID
 * @param {Function} params.storeDispatch - Redux store dispatch function
 * @returns {string} - The content (unchanged)
 */
const FilterWPBakeryContent = async ({content, service, postId, storeDispatch}) => {
    
    /**
     * Extract and store [lmat_val] tagged content from WPBakery shortcodes.
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
            // This must match the key used in update-content.js
            const uniqueKey = `wpbakery_lmat_val_${index}_${token}`;
            
            // Store the source string in the store
            // No need for filterHtmlContent since WPBakery content is already properly formatted
            storeSourceString(postId, uniqueKey, sourceText, sourceText, storeDispatch);
            
            index++;
        }
    };

    // Extract [lmat_val] tagged content
    extractLmatValTags(content);
    
    // Return the content unchanged (it will be processed during update)
    return content;
}

export default FilterWPBakeryContent;
