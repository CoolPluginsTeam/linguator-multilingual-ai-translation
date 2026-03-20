import FilterClassicContent from './classic/index.js';
import FilterElementorContent from './elementor/index.js';
import FilterGutenbergContent from './gutenberg/index.js';
import FilterTaxonomyContent from './taxonomy/index.js';
import FilterWPBakeryContent from './wpbakery/index.js';
import FilterMetaFields from './metaFields/index.js';

import updateClassicContent from './classic/update-content.js';
import updateElementorContent from './elementor/update-content.js';
import updateGutenbergContent from './gutenberg/update-content.js';
import updateTaxonomyContent from './taxonomy/update-content.js';
import updateWPBakeryContent from './wpbakery/update-content.js';

import Provider from '../translate-provider/index.js';

import {selectSourceEntries, selectServiceProvider} from '../../redux-store/features/selectors.js';

import {store} from '../../redux-store/store.js';

/**
 * @param {Object} content The content to filter
 * @param {string} editorType The editor type
 * @param {string} service The service provider
 * @param {string} postId The post ID
 * @param {Object} storeDispatch The store dispatch
 * @param {Object} blockParseRules The block parse rules
 * @param {Object} metaFields The meta fields
 * @param {Object} allowedMetaFields The allowed meta fields
 * @returns {Object} The filtered content
 */
const filterContent =async ({content, editorType, service, postId, storeDispatch, blockParseRules=null, metaFields=null, allowedMetaFields=null, sourceLanguage=null}) => {

    // Check if this is WPBakery content (contains [lmat_val] tags)
    const isWPBakeryContent = typeof content === 'string' && content.includes('[lmat_val');
    
    const filters={     
        'classic': isWPBakeryContent ? FilterWPBakeryContent : FilterClassicContent,
        'elementor':FilterElementorContent,
        'block':FilterGutenbergContent,
        'taxonomy':FilterTaxonomyContent,
    }

    const data={content, service, postId, storeDispatch, sourceLanguage};
    data.filterHtmlContent=Provider({Service: service}).filterHtmlContent;

    if(blockParseRules){
        data.blockParseRules=blockParseRules;
    }

    if(metaFields && Object.keys(metaFields).length > 0){
        await FilterMetaFields({service, postId, storeDispatch, metaFields, allowedMetaFields, filterHtmlContent: data.filterHtmlContent, sourceLanguage});
    }

    if(filters[editorType]){
        return await filters[editorType](data);
    }

    return content;
}

const updateFilterContent=async ({source, postId, lang, editorType})=>{
    // Check if this is WPBakery content (contains [lmat_val] tags)
    const isWPBakeryContent = typeof source.content === 'string' && source.content.includes('[lmat_val');
    
    const updateContens={
        'classic': isWPBakeryContent ? updateWPBakeryContent : updateClassicContent,
        'elementor':updateElementorContent,
        'block':updateGutenbergContent,
        'taxonomy':updateTaxonomyContent,
    }

    const serviceProvider=selectServiceProvider(store.getState());

    const translatedContent=selectSourceEntries(store.getState(), postId);

    return await updateContens[editorType]({source, lang, translatedContent, serviceProvider, postId});
}

export {filterContent, updateFilterContent};
