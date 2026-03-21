import {selectTranslatedContent} from '../../../redux-store/features/selectors.js';
import {store} from '../../../redux-store/store.js';
import updateMetaFields from '../metaFields/update-meta-fields.js';

/**
 * Update WPBakery content with translations.
 * Replaces [lmat_val] tokens with their translated values.
 * 
 * @param {Object} params - Update parameters
 * @param {Object} params.source - Source content data
 * @param {string} params.lang - Target language
 * @param {Object} params.translatedContent - Translated content from store
 * @param {string} params.serviceProvider - Translation service provider
 * @param {number} params.postId - Post ID
 * @returns {Object} - Updated source with translations
 */
const updateWPBakeryContent = async ({source, lang, translatedContent, serviceProvider, postId}) => {

    const getTranslatedValue = (key) => {
        const stateValue = selectTranslatedContent(store.getState(), postId, key, lang, serviceProvider);
        return stateValue;
    }

    /**
     * Restore protected attributes that were tokenized to prevent translation.
     * Protected attributes are ID-based values that should never be translated.
     * 
     * @param {string} content - Content with protected tokens
     * @returns {string} Content with protected attributes restored
     */
    const restoreProtectedAttributes = (content) => {
        if (!content || !content.includes('___LMAT_PROTECTED_')) {
            return content;
        }

        // Pattern: ___LMAT_PROTECTED_{base64}___
        // Base64 strings can contain A-Z, a-z, 0-9, +, /, and = (for padding)
        // Handle both complete tokens (___LMAT_PROTECTED_...___) and potentially truncated ones
        const protectedRegex = /___LMAT_PROTECTED_([A-Za-z0-9+\/=]+)(?:___|__|$)/g;
        
        return content.replace(protectedRegex, (match, encodedValue) => {
            try {
                // Decode the base64 value
                // In browser, we use atob() for base64 decoding
                const decoded = atob(encodedValue);
                return decoded || '';
            } catch (e) {
                // If decoding fails, return empty string to remove the broken token
                console.warn('Failed to decode protected attribute:', encodedValue);
                return '';
            }
        });
    };

    /**
     * Process WPBakery content with [lmat_val] tags.
     * Replaces tokens with their translations and removes lmat_val wrappers.
     */
    const processWPBakeryContent = (content) => {
        // Pattern to match [lmat_val id="token"]content[/lmat_val]
        // The token format is: ___LMAT_{md5_hash}___
        const lmatValRegex = /\[lmat_val[^\]]*?id=["'](___LMAT_[a-f0-9]{32}___)["'][^\]]*?\](.*?)\[\/lmat_val\]/gis;

        let translatedContent = content;
        let index = 0;

        // Find all [lmat_val] tags and process them
        let match;
        const directReplacements = []; // For content without separate tokens
        const tokenReplacements = [];   // For tokens in attributes

        while ((match = lmatValRegex.exec(content)) !== null) {
            const fullMatch = match[0]; // The entire [lmat_val]...[/lmat_val]
            const token = match[1]; // The unique token ID
            const sourceText = match[2]; // The original content

            // Skip empty content
            if (!sourceText || sourceText.trim() === '') {
                continue;
            }

            // Create the same unique key used during storage
            const uniqueKey = `wpbakery_lmat_val_${index}_${token}`;
            
            // Get the translated value from the store
            const translatedValue = getTranslatedValue(uniqueKey);

            if (translatedValue) {
                // Check if the token exists elsewhere in the content (not just in the lmat_val tag)
                const contentWithoutThisTag = content.replace(fullMatch, '');
                const tokenExistsSeparately = contentWithoutThisTag.includes(token);
                
                if (tokenExistsSeparately) {
                    // Pattern 1: Token is used in an attribute - replace token and remove wrapper later
                    tokenReplacements.push({
                        token: token,
                        translatedValue: translatedValue
                    });
                } else {
                    // Pattern 2: Direct content wrapping - replace the entire lmat_val tag
                    directReplacements.push({
                        fullMatch: fullMatch,
                        translatedValue: translatedValue
                    });
                }
            }
            
            index++;
        }

        // Apply direct replacements first (Pattern 2)
        directReplacements.forEach(replacement => {
            translatedContent = translatedContent.replace(replacement.fullMatch, replacement.translatedValue);
        });

        // Apply token replacements (Pattern 1)
        tokenReplacements.forEach(replacement => {
            const tokenRegex = new RegExp(replacement.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            translatedContent = translatedContent.replace(tokenRegex, replacement.translatedValue);
        });

        // Remove any remaining [lmat_val] tags (cleanup for Pattern 1)
        translatedContent = translatedContent.replace(/\s*\[lmat_val[^\]]*?\].*?\[\/lmat_val\]/gis, '');

        // Restore protected attributes (like image IDs) that were tokenized
        translatedContent = restoreProtectedAttributes(translatedContent);

        return translatedContent;
    };

    /**
     * Update title with translation.
     */
    const updateTitle = async (source, value) => {
        if (value && '' !== value) {
            source.title = await getTranslatedValue('title');
        }
    }

    /**
     * Update post name (slug) with translation.
     */
    const updatePostName = async (source, value) => {
        if (value && '' !== value) {
            source.post_name = await getTranslatedValue('post_name');
        }
    }

    /**
     * Update excerpt with translation.
     */
    const updateExcerpt = async (source, value) => {
        if (value && '' !== value) {
            source.excerpt = await getTranslatedValue('excerpt');
        }
    }

    /**
     * Update WPBakery content with translations.
     */
    const updatePostContent = async ({content}) => {
        source.content = processWPBakeryContent(content);
    }

    // Update all fields
    await updateTitle(source, source.title);
    await updatePostName(source, source.post_name);
    await updateExcerpt(source, source.excerpt);
    await updatePostContent({content: source.content});

    // Update meta fields if needed
    if ("false" === lmatBulkTranslationGlobal.postMetaSync && source.metaFields && Object.keys(source.metaFields).length > 0) {
        source.metaFields = updateMetaFields(source.metaFields, lang, serviceProvider, postId);
    }

    return source;
}

export default updateWPBakeryContent;
