import React from 'react';
import filterContent from '../../../../../page-translation/src/component/FilterTargetContent/index.js';
import extractInnerContent from '../extarct-inner-content/index.js';
import storeSourceString from '../../store-source-string/index.js';


/**
 * @param {Object} content
 * @param {string} service
 * @returns {string}
 */
const FilterClassicContent = async ({content, service, postId, storeDispatch, filterHtmlContent}) => {
    
    const loopCallback=async (callback, loop, index)=>{
        await callback(loop[index], index);

        index++;

        if(index < loop.length){
            await loopCallback(callback, loop, index);
        }
    }

    const splitContentWithDynamicBreaks = (content) => {
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
      
          result.push(`lmat_bulk_content_temp_${escapedBreak}_lmat_bulk_content_temp`);
      
          lastIndex = regex.lastIndex;
        }
      
        // Push remaining content after the last match
        if (lastIndex < content.length) {
          result.push(content.slice(lastIndex));
        }
      
        return result;
      }

    const fitlerWysiwygContent = async ({content, service}) => {
        const arrContent = splitContentWithDynamicBreaks(content);

        const settingsItemsLoop=async(text,index)=>{
            const entity=(/^&[a-zA-Z0-9#]+;$/.test(text));
            const htmlTag = /^<\/?\s*[a-zA-Z0-9#]+\s*\/?>$/.test(text);
            const isEmptyHtmlTag = /^<\s*\/?\s*[a-zA-Z0-9#]+\s*><\/\s*\/?\s*[a-zA-Z0-9#]+\s*>$/.test(text);
            const blockCommentTag = /<!--[\s\S]*?-->/g.test(text) && text.indexOf('<!--') < text.indexOf('-->');

            const plainText=!entity && !htmlTag && !isEmptyHtmlTag && !blockCommentTag; 

            if(text !== '' && !text.includes('lmat_bulk_content_temp_') && plainText){
                let stringContent=text;

                if(filterHtmlContent){
                    let reactElement=filterContent({content: text, service, contentKey: 'content_classic_index_'+index, skipTags:[]});
                    stringContent=await extractInnerContent(reactElement);
                    reactElement=null;
                }

                storeSourceString(postId, 'content_classic_index_'+index, text, stringContent, storeDispatch);
            }
        }

        if(arrContent.length > 0){
            await loopCallback(settingsItemsLoop, arrContent, 0);
        }
    }

    await fitlerWysiwygContent({content, service});
}

export default FilterClassicContent;
