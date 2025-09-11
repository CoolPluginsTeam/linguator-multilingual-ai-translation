import React from 'react';
import filterContent from '../../../../../page-translation/src/component/filter-target-content/index.js';
import extractInnerContent from '../extarct-inner-content/index.js';
import storeSourceString from '../../store-source-string/index.js';

const FilterElementorContent = async({content, service, postId, storeDispatch, filterHtmlContent}) => {
    const translateContentObject={};

    const loopCallback=async (callback, loop, index)=>{
        await callback(loop[index], index);

        index++;

        if(index < loop.length){
            await loopCallback(callback, loop, index);
        }
    }

    const translateContent=async (ids,value)=>{
        if(typeof value === 'string' && value.trim() !== '' && ids.length > 0){
            const uniqueKey = ids.join('_lmat_bulk_content_temp_');
            let stringContent=value;

            if(filterHtmlContent){
                let reactElement=filterContent({content: value, service, contentKey: uniqueKey, skipTags:['script', 'style']});
                stringContent=await extractInnerContent(reactElement);
                reactElement=null;
            }
            
            
            storeSourceString(postId, uniqueKey, value, stringContent, storeDispatch);
            if(stringContent && '' !== stringContent){  
                translateContentObject[uniqueKey]=stringContent;
            }
        }
    }
    // Define a list of properties to exclude
    const cssProperties = [
        'content_width', 'title_size', 'font_size', 'margin', 'padding', 'background', 'border', 'color', 'text_align',
        'font_weight', 'font_family', 'line_height', 'letter_spacing', 'text_transform', 'border_radius', 'box_shadow',
        'opacity', 'width', 'height', 'display', 'position', 'z_index', 'visibility', 'align', 'max_width', 'content_typography_typography', 'flex_justify_content', 'title_color', 'description_color', 'email_content'
    ];

    const substringsToCheck = ['title', 'description', 'editor', 'text', 'content', 'label'];

    const storeWidgetStrings = async(element, index, ids=[]) => {
        const settings = element.settings;
        ids.push(index);

        // Check if settings is an object
        if (typeof settings === 'object' && settings !== null && Object.keys(settings).length > 0) {
            // Define the substrings to check for translatable content

            const keysLoop=async (key, index)=>{
                if (cssProperties.some(substring => key.toLowerCase().includes(substring))) {
                    return; // Skip this property and continue to the next one
                }

                if (substringsToCheck.some(substring => key.toLowerCase().includes(substring)) &&
                    typeof settings[key] === 'string' && settings[key].trim() !== '') {
                    await translateContent([...ids, 'settings', key],settings[key]);
                }

                if(Array.isArray(settings[key]) && settings[key].length > 0){
                    const settingsLoop=async(item, index)=>{
                        if(typeof item === 'object' && item !== null){
                            const settingsItemsLoop=async (repeaterKey)=>{

                                if (cssProperties.includes(repeaterKey.toLowerCase())) {
                                    return; // Skip this property
                                }

                                if(substringsToCheck.some(substring => repeaterKey.toLowerCase().includes(substring)) &&
                                    typeof item[repeaterKey] === 'string' && item[repeaterKey].trim() !== '') {
                                    await translateContent([...ids, 'settings', key, index, repeaterKey],item[repeaterKey]);
                                }
                            }

                            await loopCallback(settingsItemsLoop, Object.keys(item), 0);
                        }
                    }

                    await loopCallback(settingsLoop, settings[key], 0);
                }
            }
    
            await loopCallback(keysLoop, Object.keys(settings), 0);
        }

        // If there are nested elements, process them recursively
        if (element.elements && Array.isArray(element.elements) && element.elements.length > 0) {
            const runLoop=async (childElement, index)=>{
                await storeWidgetStrings(childElement, index, [...ids, 'elements']);
            }

            await loopCallback(runLoop, element.elements, 0);
        }
    }

    if(content && content.length > 0){
        const runLoop=async (element, index)=>{
            await storeWidgetStrings(element, index, ['content']);
        }

        await loopCallback(runLoop, content, 0);
    }
}

export default FilterElementorContent;
