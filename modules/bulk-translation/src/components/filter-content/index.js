import FilterClassicContent from './classic/index.js';
import FilterElementorContent from './elementor/index.js';
import FilterGutenbergContent from './gutenberg/index.js';

import updateClassicContent from './classic/update-content.js';
import updateElementorContent from './elementor/update-content.js';
import updateGutenbergContent from './gutenberg/update-content.js';

import Provider from '../translate-provider/index.js';

import {selectSourceEntries, selectServiceProvider} from '../../redux-store/features/selectors.js';

import {store} from '../../redux-store/store.js';


const filterContent = ({content, editorType, service, postId, storeDispatch, blockParseRules=null, metaFields=null}) => {
    const filters={     
        'classic':FilterClassicContent,
        'elementor':FilterElementorContent,
        'block':FilterGutenbergContent,
    }

    const data={content, service, postId, storeDispatch};
    data.filterHtmlContent=Provider({Service: service}).filterHtmlContent;

    if(blockParseRules){
        data.blockParseRules=blockParseRules;
    }

    if(filters[editorType]){
        return filters[editorType](data);
    }

    return content;
}

const updateFilterContent=async ({source, postId, lang, editorType})=>{
    const updateContens={
        'classic':updateClassicContent,
        'elementor':updateElementorContent,
        'block':updateGutenbergContent,
    }

    const serviceProvider=selectServiceProvider(store.getState());

    const translatedContent=selectSourceEntries(store.getState(), postId);

    return await updateContens[editorType]({source, lang, translatedContent, serviceProvider, postId});
}

export {filterContent, updateFilterContent};
