import FilterClassicContent from './Classic/index.js';
import FilterElementorContent from './Elementor/index.js';
import FilterGutenbergContent from './Gutenberg/index.js';

import updateClassicContent from './Classic/updateContent.js';
import updateElementorContent from './Elementor/updateContent.js';
import updateGutenbergContent from './Gutenberg/updateContent.js';

import Provider from '../translateProvider/index.js';

import {selectSourceEntries, selectServiceProvider} from '../../ReduxStore/features/selectors.js';

import {store} from '../../ReduxStore/store.js';


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
