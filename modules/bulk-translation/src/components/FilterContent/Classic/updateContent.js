import {selectTranslatedContent} from '../../../ReduxStore/features/selectors.js';
import {store} from '../../../ReduxStore/store.js';

/**
 * @param {Object} source
 * @param {Object} translation
 * @returns {Object}
 */
const updateClassicContent=async ({source, lang, serviceProvider, postId})=>{

    const getTransaltedValue=(key)=>{
        const stateValue=selectTranslatedContent(store.getState(), postId, key, lang, serviceProvider);
        
        return stateValue;
    }

    const loopCallback=async (callback, loop, index)=>{
        await callback(loop[index], index);

        index++;

        if(index < loop.length){
            await loopCallback(callback, loop, index);
        }
    }

    function splitContentWithDynamicBreaks(content) {
        const result = [];
        const regex = /(\r\n|\r|\n)/g;

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(content)) !== null) {
            // Push the content before the line break
            if (match.index > lastIndex) {
                result.push(content.slice(lastIndex, match.index));
            }

            // Escape line break and wrap with marker
            const escapedBreak = match[0];

            result.push(`lmat_bulk_content__skip_${escapedBreak}_lmat_bulk_content_`);

            lastIndex = regex.lastIndex;
        }

        // Push remaining content after the last match
        if (lastIndex < content.length) {
            result.push(content.slice(lastIndex));
        }

        return result;
    }

    /**
     * @param {Object} source
     * @param {Object} translation
     */
    const updateTitle=async (source, value)=>{
        if(value && '' !== value){
            source.title=await getTransaltedValue('title');
        }
    }

    /**
     * Updates the post content based on translation.
     */
    const updatePostContent = async ({content}) => {
        const arrContent = splitContentWithDynamicBreaks(content);

        const strings = [];

        const settingsItemsLoop=async(text,index)=>{
            const entity=(/^&[a-zA-Z0-9#]+;$/.test(text));
            const htmlTag = /^<\/?\s*[a-zA-Z0-9#]+\s*\/?>$/.test(text);
            const isEmptyHtmlTag = /^<\s*\/?\s*[a-zA-Z0-9#]+\s*><\/\s*\/?\s*[a-zA-Z0-9#]+\s*>$/.test(text);
            const blockCommentTag = /<!--[\s\S]*?-->/g.test(text) && text.indexOf('<!--') < text.indexOf('-->');

            const plainText=!entity && !htmlTag && !isEmptyHtmlTag && !blockCommentTag; 

            if(text !== '' && !text.includes('lmat_bulk_content__skip_') && plainText){
                const uniqueKey = 'content_classic_index_' + index;
                const stateValue=selectTranslatedContent(store.getState(), postId, uniqueKey, lang, serviceProvider);

                strings.push(stateValue);
            } else if (text.includes('lmat_bulk_content__skip_')) {
                const escapedBreak = text.replace('lmat_bulk_content__skip_', '').replace('_lmat_bulk_content_', '');
                strings.push(escapedBreak);
            } else {
                strings.push(text);
            }
        }

        if(arrContent.length > 0){
            await loopCallback(settingsItemsLoop, arrContent, 0);
        }

        source.content= strings.join('');
    }

    await updateTitle(source, source.title);
    await updatePostContent({content: source.content});

    return source;
}

export default updateClassicContent;
