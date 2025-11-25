/**
 * Retrieves the translation entries from the given state.
 *
 * This function extracts translation entries for the title, excerpt, meta fields, and content
 * from the provided state object and returns them as an array of translation entry objects.
 *
 * @param {Object} state - The state object containing translation data.
 * @param {Object} state.title - The title object containing source and target translations.
 * @param {Object} state.excerpt - The excerpt object containing source and target translations.
 * @param {Object} state.metaFields - An object containing meta field translations, where each key is a meta field ID.
 * @param {Object} state.content - An object containing content translations, where each key is a content ID.
 * @returns {Array<Object>} An array of translation entry objects, each containing the following properties:
 *   @property {string} id - The identifier of the translation entry.
 *   @property {string} source - The source text of the translation entry.
 *   @property {string} type - The type of the translation entry (e.g., 'title', 'excerpt', 'metaFields', 'content').
 *   @property {string} translatedData - The target text of the translation entry (default is an empty string if not provided).
 */
export const getTranslationEntries = (state) => {
    // Initialize an empty array to hold translation entries
    const translateEntry = new Array;

    if (state.title && state.title.source) {
        const titleData={
            id: 'title', // Identifier for the entry
            source: state.title.source, // Source text for the title
            type: 'title', // Type of the entry
            translatedData: (state.title.translatedData || {}), // translated text for the title, defaulting to an empty string if not provided
        }

        if(state.title && state.title.filteredString && state.title.filteredString !== ''){
            titleData.filteredString = state.title.filteredString;
        }

        // Push the title translation entry into the array
        translateEntry.push(titleData);
    }

    if (state.excerpt && state.excerpt.source) {
        const excerptData={
            id: 'excerpt', // Identifier for the entry
            source: state.excerpt.source, // Source text for the excerpt
            type: 'excerpt', // Type of the entry
            translatedData: (state.excerpt.translatedData || {}), // translated text for the excerpt, defaulting to an empty string if not provided
        }

        if(state.excerpt && state.excerpt.filteredString && state.excerpt.filteredString !== ''){
            excerptData.filteredString = state.excerpt.filteredString;
        }

        // Push the excerpt translation entry into the array
        translateEntry.push(excerptData);
    }

    if (state.slug && state.slug.source) {
        const slugData={
            id: 'slug', // Identifier for the entry
            source: state.slug.source, // Source text for the slug
            type: 'slug', // Type of the entry
            translatedData: (state.slug.translatedData || {}), // translated text for the slug, defaulting to an empty string if not provided
        }

        if(state.slug && state.slug.filteredString && state.slug.filteredString !== ''){
            slugData.filteredString = state.slug.filteredString;
        }

        // Push the slug translation entry into the array
        translateEntry.push(slugData);
    }

    // Iterate over the metaFields object keys and push each translation entry into the array
    Object.keys(state.metaFields).map(key => {
        const metaFieldsData={
            type: 'metaFields', // Type of the entry
            id: key, // Identifier for the meta field
            source: state.metaFields[key].source, // Source text for the meta field
            translatedData: (state.metaFields[key].translatedData || {}), // translated text for the meta field, defaulting to an empty string if not provided
        }

        if(state.metaFields && state.metaFields[key] && state.metaFields[key].filteredString && state.metaFields[key].filteredString !== ''){
            metaFieldsData.filteredString = state.metaFields[key].filteredString;
        }

        translateEntry.push(metaFieldsData);
    });

    // Iterate over the content object keys and push each translation entry into the array
    Object.keys(state.content).map(key => {
        const contentData={
            type: 'content', // Type of the entry
            id: key, // Identifier for the content
            source: state.content[key].source, // Source text for the content
            translatedData: (state.content[key].translatedData || {}), // translated text for the content, defaulting to an empty string if not provided
        }

        if(state.content && state.content[key] && state.content[key].filteredString && state.content[key].filteredString !== ''){
            contentData.filteredString = state.content[key].filteredString;
        }

        translateEntry.push(contentData);
    });

    // Return the array of translation entries
    return translateEntry;
};

export const getTranslationEntry = (state, data) => {
    
    if(['title', 'excerpt', 'slug'].includes(data.type)){
        return state[data.type] || false;
    }

    if(data.type && data.id && state[data.type] && state[data.type][data.id]){
        return state[data.type][data.id] || false;
    }
    
    return false; 
}

/**
 * Retrieves the block rules from the given state.
 * @param {Object} state - The state object containing translation data.
 * @returns {Object} The block rules data.
 */
export const getBlockRules = (state) => {
    return state.blockRules;
}

/**
 * Retrieves the translated string from the given state.
 *
 * This function extracts the translated string for a given type (title, excerpt, metaFields, or content)
 * from the provided state object and returns it.
 *
 * @param {Object} state - The state object containing translation data.
 * @param {string} type - The type of the translation entry (e.g., 'title', 'excerpt', 'metaFields', 'content').
 * @param {string} source - The source text of the translation entry.
 * @param {string} id - The identifier of the translation entry (optional, used for metaFields and content).
 * @param {string} provider - The provider of the translation (optional, used for metaFields and content).
 * @returns {string} The translated string for the given type and source, or the original source text if no translation is found.
 */
export const getTranslatedString = (state, type, source, id = null, provider = null) => {

    // Check if the type is 'title' or 'excerpt' and if the source matches
    if (['title', 'excerpt'].includes(type) && state[type].source === source && state[type].translatedData && state[type].translatedData[provider]) {
        return state[type]?.translatedData[provider] || state[type]?.source; // Return the translatedData if it matches
    }
    else if (type === 'slug' && state.slug.source === source && state.slug.translatedData && state.slug.translatedData[provider]) {
        return undefined !== state.slug?.translatedData[provider] ? state.slug?.translatedData[provider] : state.slug?.source; // Return the translatedData if it matches
    }
    // Check if the type is 'metaFields' and if the source matches
    else if (type === 'metaFields' && state.metaFields && state.metaFields[id] && state.metaFields[id].source === source && state.metaFields[id].translatedData && state.metaFields[id].translatedData[provider]) {
        // Return the target text if it exists, otherwise return the source text
        return undefined !== state.metaFields[id]?.translatedData[provider] ? state.metaFields[id]?.translatedData[provider] : state.metaFields[id]?.source;
    }
    // Check if the type is 'content' and if the source matches
    else if (type === 'content' && state.content && state.content[id] && state.content[id].source === source && state.content[id].translatedData && state.content[id].translatedData[provider]) {
        // Return the target text if it exists, otherwise return the source text
        return undefined !== state.content[id]?.translatedData[provider] ? state.content[id]?.translatedData[provider] : state.content[id]?.source;
    }
    // If no matches, return the original source text
    return source;
}

/**
 * Retrieves the translation info from the given state.
 * @param {Object} state - The state object containing translation data.
 * @returns {Object} The translation info.
 */
export const getTranslationInfo = (state) => {
    return {
        sourceStringCount: state?.translationInfo?.sourceStringCount || 0,
        sourceWordCount: state?.translationInfo?.sourceWordCount || 0,
        sourceCharacterCount: state?.translationInfo?.sourceCharacterCount || 0,
        translateData: state?.translationInfo?.translateData || {}
    };
}

/** 
 * Retrieves the allowed meta fields from the given state.
 * @param {Object} state - The state object containing translation data.
 * @returns {Object} The allowed meta fields.
 */
export const getAllowedMetaFields = (state) => {
    return state.allowedMetaFields || {};
}

export const contentFetchStatus = (state) => {
    return state.contentFetchStatus;
}