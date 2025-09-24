import { select, dispatch } from "@wordpress/data";

const ClassicSaveSource = (post_data) => {

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
      
          result.push(`lmat_skip_content_open_${escapedBreak}_lmat_skip_content_end`);
      
          lastIndex = regex.lastIndex;
        }
      
        // Push remaining content after the last match
        if (lastIndex < content.length) {
          result.push(content.slice(lastIndex));
        }
      
        return result;
      }

    const fitlerClassicContent = (content) => {
        const arrContent = splitContentWithDynamicBreaks(content);

        arrContent.forEach((text, index) => {
            const entity=(/^&[a-zA-Z0-9#]+;$/.test(text));
            const htmlTag = /^<\/?\s*[a-zA-Z0-9#]+\s*\/?>$/.test(text);
            const isEmptyHtmlTag = /^<\s*\/?\s*[a-zA-Z0-9#]+\s*><\/\s*\/?\s*[a-zA-Z0-9#]+\s*>$/.test(text);
            const blockCommentTag = /<!--[\s\S]*?-->/g.test(text) && text.indexOf('<!--') < text.indexOf('-->');

            const plainText=!entity && !htmlTag && !isEmptyHtmlTag && !blockCommentTag; 

            if(text !== '' && !text.includes('lmat_skip_content_open_') && plainText){
                dispatch('block-lmatPageTranslation/translate').contentSaveSource('classic_index_'+index, text);
            }
        });
    }

    Object.keys(post_data).forEach(key => {
        if (key === 'content') {
            fitlerClassicContent(post_data[key]);
        }else if(['title', 'excerpt'].includes(key)){
            if(post_data[key] && post_data[key].trim() !== ''){
                const action = `${key}SaveSource`;
                dispatch('block-lmatPageTranslation/translate')[action](post_data[key]);
            }
        }else if(key === 'slug_name' && lmatPageTranslationGlobal.slug_translation_option === 'slug_translate'){
            if(post_data[key] && post_data[key].trim() !== ''){
                dispatch('block-lmatPageTranslation/translate').slugSaveSource(post_data[key]);
            }
        }
    });
};

export default ClassicSaveSource;
