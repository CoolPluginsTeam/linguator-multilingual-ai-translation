const FilterTargetContent = (props) => {
    const skipTags = props.skipTags || [];
    const OpenSpanPlaceholder = '#lmat_page_translation_open_translate_span#';
    const CloseSpanPlaceholder = '#lmat_page_translation_close_translate_span#';
    const OpenTempTagPlaceholder = '#lmat_page_translation_temp_tag_open#';
    const CloseTempTagPlaceholder = '#lmat_page_translation_temp_tag_close#';
    const LessThanSymbol = '#lmat_page_translation_less_then_symbol#';
    const GreaterThanSymbol = '#lmat_page_translation_greater_then_symbol#';

    function fixHtmlTags(content) {
        if (typeof content !== 'string' || !content.trim()) return content;

        const tagRegex = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
        const stack = [];
        let result = '';
        let lastIndex = 0;
        let match;

        while ((match = tagRegex.exec(content)) !== null) {
            const [fullMatch, tagName] = match;
            const isClosingTag = fullMatch.startsWith('</');
            const currentIndex = match.index;

            // Append content before this tag
            if (currentIndex > lastIndex) {
                result += content.slice(lastIndex, currentIndex);
            }

            if (!isClosingTag) {
                // Opening tag: push to stack
                stack.push({ tag: tagName });
                result += fullMatch;
            } else {
                // Closing tag
                const openIndex = stack.findIndex(t => t.tag === tagName);
                if (openIndex !== -1) {
                    // Match found: remove opening from stack
                    stack.splice(openIndex, 1);
                    result += fullMatch;
                } else {
                    // No opening tag: insert missing opening tag before closing
                    result += `${OpenTempTagPlaceholder}<${tagName}>${CloseTempTagPlaceholder}` + fullMatch;
                }
            }

            lastIndex = tagRegex.lastIndex;
        }

        // Append any remaining content after last tag
        if (lastIndex < content.length) {
            result += content.slice(lastIndex);
        }

        // Add missing closing tags at the end
        for (let i = stack.length - 1; i >= 0; i--) {
            const { tag } = stack[i];
            result += `${OpenTempTagPlaceholder}</${tag}>${CloseTempTagPlaceholder}`;
        }

        // Clear references to free memory (optional in GC-based engines, but helpful)
        match = null;
        stack.length = 0;
        content = null;

        return result;
    }

    /**
     * Wraps the first element and its matching closing tag with translation spans.
     * If no elements are found, returns the original HTML.
     * @param {string} html - The HTML string to process.
     * @returns {string} The modified HTML string with wrapped translation spans.
     */
    const wrapFirstAndMatchingClosingTag = (html) => {
        // Create a temporary element to parse the HTML string
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // Get the first element
        const firstElement = tempElement.firstElementChild;

        if (!firstElement) {
            return html; // If no elements, return the original HTML
        }


        let childNodes = firstElement.childNodes;
        let childNodesLength = childNodes.length;
        if (childNodesLength > 0) {
            // Sort so that nodeType 3 (Text nodes) come first
            childNodes = Array.from(childNodes).sort((a, b) => (a.nodeType === 3 ? -1 : b.nodeType === 3 ? 1 : 0));
            for (let i = 0; i < childNodesLength; i++) {
                let element = childNodes[i];

                if (element.nodeType === 3) {
                    let textContent = element.textContent.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, (match) => `${OpenSpanPlaceholder}${match}${CloseSpanPlaceholder}`);

                    element.textContent = textContent;
                }
                else if (element.nodeType === 8) {
                    // let textContent = `<!--${element.textContent}-->`;
                    element.textContent = element.textContent;
                }
                else {
                    let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
                    element.outerHTML = filterContent;
                }
            }
        }

        // Get the opening tag of the first element
        // const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
        let firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
        
        const pattern = new RegExp(
            `${OpenSpanPlaceholder}|${CloseSpanPlaceholder}`,
            'g'
        );

        firstElementOpeningTag = firstElementOpeningTag.replace(pattern, '');

        // Check if the first element has a corresponding closing tag
        const openTagName = firstElement.tagName.toLowerCase();
        const closingTagName = new RegExp(`<\/${openTagName}>`, 'i');

        // Check if the inner HTML contains the corresponding closing tag
        const closingTagMatch = firstElement.outerHTML.match(closingTagName);

        // Wrap the style element
        if (firstElementOpeningTag === '<style>') {
            let wrappedFirstTag = `${OpenSpanPlaceholder}${firstElement.outerHTML}${CloseSpanPlaceholder}`;
            return wrappedFirstTag;
        }

        let firstElementHtml = firstElement.innerHTML;

        firstElementHtml = firstElementHtml.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, (match) => `${OpenSpanPlaceholder}${match}${CloseSpanPlaceholder}`);

        firstElement.innerHTML = '';
        let closeTag = '';
        let openTag = '';
        let filterContent = '';

        openTag = `${OpenSpanPlaceholder}${firstElementOpeningTag}${CloseSpanPlaceholder}`;
        if (closingTagMatch) {
            closeTag = `${OpenSpanPlaceholder}</${openTagName}>${CloseSpanPlaceholder}`;
        }

        if (skipTags.includes(openTagName)) {
            // Remove the custom span markers from the HTML if the tag is in skipTags
            const pattern = new RegExp(
                `${OpenSpanPlaceholder}|${CloseSpanPlaceholder}`,
                'g'
            );

            firstElementHtml = firstElementHtml.replace(pattern, '');
            firstElementHtml = `${OpenSpanPlaceholder}${firstElementHtml}${CloseSpanPlaceholder}`;
        }

        if ('' !== firstElementHtml) {
            if ('' !== openTag) {
                filterContent = openTag + firstElementHtml;
            }
            if ('' !== closeTag) {
                filterContent += closeTag;
            }
        } else {
            filterContent = openTag + closeTag;
        }

        firstElement.outerHTML = filterContent;

        // Return the modified HTML
        return tempElement.innerHTML;
    }

    /**
     * Splits the content string based on a specific pattern.
     * @param {string} string - The content string to split.
     * @returns {Array} An array of strings after splitting based on the pattern.
     */
    const splitContent = (string) => {
        const pattern = new RegExp(
            `(${OpenSpanPlaceholder}[\\s\\S]*?${CloseSpanPlaceholder})|'`,
        );

        const matches = string.split(pattern).filter(Boolean);

        // Remove empty strings from the result
        const output = matches.filter(match => match.trim() !== '');

        return output;
    }

    /**
     * Filters the SEO content.
     * @param {string} content - The SEO content to filter.
     * @returns {string} The filtered SEO content.
     */
    const filterSeoContent = (content) => {
        const regex = /(%{1,2}[a-zA-Z0-9_]+%{0,2})/g;

        // Replace placeholders with wrapped spans
        const output = content.replace(regex, (match) => {
            return `${OpenSpanPlaceholder}${match}${CloseSpanPlaceholder}`;
        });

        return output;
    }

    /**
     * Checks if the HTML is empty or has an unclosed tag.
     * @param {string} html - The HTML string to check.
     * @returns {boolean} True if the HTML is empty or has an unclosed tag, false otherwise.
     */
    const isEmptyOrUnclosedTag = (html) => {
        // Clean up whitespace
        html = html.trim();

        // Regex that matches:
        // 1️⃣ Single open tag only (<div>, <table>, <span class="x">, etc.)
        // 2️⃣ Empty tag (<div></div>, <table></table>, etc.)
        // 3️⃣ Ignores self-closing tags like <img />, <br />, etc.
        const regex = /^<([a-z][a-z0-9]*)\b[^>]*>(\s*(?:<!--.*?-->\s*)*<\/\1>)?$/i;

        // Test and return true/false
        return regex.test(html);
    }

    /**
     * Synchronizes the TR and TD tags from the first string to the second string.
     * @param {string} str1 - The first string to synchronize.
     * @param {string} str2 - The second string to synchronize.
     * @returns {string} The synchronized string.
     */
    const syncTRTDFromFirstToSecond = (str1, str2) => {
        str1 = str1.trim();

        // 1️⃣ Check if first string has any tr or td
        if (!/<\/?(tr|td|th)\b[^>]*>/i.test(str1)) {
            return str2; // no tr/td → skip
        }

        // 2️⃣ Skip if second string already contains tr or td
        if (/<\/?(tr|td|th)\b[^>]*>/i.test(str2)) {
            return str2;
        }

        str2 = str2.trim();

        // 3️⃣ Extract tags (if present)
        const startTagMatch = str1.match(/^<(tr|td|th)\b[^>]*>/i);     // opening tag at start
        const endTagMatch = str1.match(/<\/(tr|td|th)>\s*$/i);        // closing tag at end

        // 4️⃣ Build new string using only what exists
        let newString = str2;

        if (startTagMatch) {
            newString = `${OpenSpanPlaceholder}${startTagMatch[0]}${CloseSpanPlaceholder}` + newString;
        }

        if (endTagMatch) {
            newString = newString + `${OpenSpanPlaceholder}${endTagMatch[0]}${CloseSpanPlaceholder}`;
        }

        return newString;
    }

    /**
     * Replaces the inner text of HTML elements with span elements for translation.
     * @param {string} string - The HTML content string to process.
     * @returns {Array} An array of strings after splitting based on the pattern.
     */
    const filterSourceData = (string) => {

        const isSeoContent = /^(_yoast_wpseo_|rank_math_|_seopress_)/.test(props.contentKey.trim());
        if (isSeoContent) {
            string = filterSeoContent(string);
        }

        // Filter shortcode content
        const shortcodePattern = /\[(.*?)\]/g;
        const shortcodeMatches = typeof string === 'string' ? string.match(shortcodePattern) : false;

        if (shortcodeMatches) {
            string = string.replace(shortcodePattern, (match) => `${OpenSpanPlaceholder}${match}${CloseSpanPlaceholder}`);
        }

        function replaceInnerTextWithSpan(doc) {
            let childElements = doc.childNodes;

            const childElementsReplace = (index) => {
                if (childElements.length > index) {
                    let element = childElements[index];
                    let textNode = null;

                    if (element.nodeType === 3) {
                        const textContent = element.textContent.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, (match) => `${OpenSpanPlaceholder}${match}${CloseSpanPlaceholder}`);

                        textNode = document.createTextNode(textContent);
                    } else if (element.nodeType === 8) {
                        textNode = document.createTextNode(`${OpenSpanPlaceholder}<!--${element.textContent}-->${CloseSpanPlaceholder}`);
                    } else if (element.nodeType === 1) {
                        const childNodes = element.childNodes;

                        const trimmed = element.outerHTML.trim();

                        // Match the outer opening tag dynamically
                        const match = trimmed.match(/^<([a-zA-Z0-9]+)(\s[^>]*)?>/i);
                        if (!match) return trimmed; // no valid HTML tag found

                        const tagName = match[1];
                        const attrs = match[2] || "";

                        const hasClosingTag = new RegExp(`<\\/${tagName}>\\s*$`, "i").test(trimmed);

                        if (childNodes.length > 0) {
                            replaceInnerTextWithSpan(element);
                        }

                        let filterHtml = `${OpenSpanPlaceholder}${LessThanSymbol}${tagName}${attrs}${GreaterThanSymbol}${CloseSpanPlaceholder}${element.innerHTML}`;

                        if (hasClosingTag) {
                            filterHtml += `${OpenSpanPlaceholder}${LessThanSymbol}/${tagName}${GreaterThanSymbol}${CloseSpanPlaceholder}`;
                        }

                        textNode = document.createTextNode(filterHtml);

                    } else {
                        let filterHtml = element.outerHTML;

                        filterHtml = filterHtml.replace(
                            /<!--([\s\S]*?)-->/g,
                            (match, inner) => `${OpenSpanPlaceholder}${match}${CloseSpanPlaceholder}`
                        );

                        let filterContent = wrapFirstAndMatchingClosingTag(filterHtml);

                        textNode = document.createTextNode(filterContent);
                    }

                    element.replaceWith(textNode);

                    index++;
                    childElementsReplace(index);
                }
            }

            childElementsReplace(0);
            return doc;
        }

        let content = string;

        
        if (isEmptyOrUnclosedTag(string)) {
            content = string.replace(/<([a-z][a-z0-9]*)\b[^>]*>(\s*(?:<!--.*?-->\s*)*<\/\1>)?/gi, (match) => `${OpenSpanPlaceholder}${match}${CloseSpanPlaceholder}`);
        } else {
            const tempElement = document.createElement('div');
            tempElement.innerHTML = fixHtmlTags(string);
            replaceInnerTextWithSpan(tempElement);
            
            
            content = tempElement.innerText;

            content = content.replace(new RegExp(LessThanSymbol, 'g'), '<').replace(new RegExp(GreaterThanSymbol, 'g'), '>');

            content = syncTRTDFromFirstToSecond(string, content);
        }
        
        // remoove all the ${OpenTempTagPlaceholder} and ${CloseTempTagPlaceholder}
        const tempTagPattern = new RegExp(
            `${OpenTempTagPlaceholder}([\\s\\S]*?)(${CloseTempTagPlaceholder})`,
            'g'
        );
        
        content = content.replace(tempTagPattern, '');


        return splitContent(content);
    }

    /**
     * The content to be filtered based on the service type.
     * If the service is 'localAiTranslator' or 'google', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
     */
    const content = ['localAiTranslator', 'google'].includes(props.service) ? filterSourceData(props.content) : props.content;

    /**
     * Regular expression pattern to match the span elements that should not be translated.
     */
    const notTranslatePattern = new RegExp(
        `${OpenSpanPlaceholder}[\\s\\S]*?${CloseSpanPlaceholder}`
    );

    /**
     * Regular expression pattern to replace the placeholder span elements.
     */
    const replacePlaceholderPattern = new RegExp(
        `${OpenSpanPlaceholder}|${CloseSpanPlaceholder}`,
        'g'
    );


    const filterContent = content => {
        const updatedContent = content.replace(replacePlaceholderPattern, '');
        return updatedContent;
    }

    return (
        <>
            {['localAiTranslator', 'google'].includes(props.service) ?
                content.map((data, index) => {
                    const notTranslate = notTranslatePattern.test(data);
                    if (notTranslate) {
                        return <span key={index} className="notranslate lmat-page-translation-notraslate-tag" translate="no">{filterContent(data)}</span>;
                    } else {
                        return data;
                    }
                })
                : content}
        </>
    );
}

export default FilterTargetContent;