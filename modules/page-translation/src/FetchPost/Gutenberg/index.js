import GutenbergBlockSaveSource from "../../storeSourceString/Gutenberg/index.js";
import { dispatch } from "@wordpress/data";
import { parse } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

import AllowedMetaFields from "../../AllowedMetafileds.js";

const GutenbergPostFetch = async (props) => {
    const apiUrl = lmatPageTranslationGlobal.ajax_url;
    let blockRules = {};

    // Update allowed meta fields
    const updateAllowedMetaFields = (data) => {
        dispatch('block-lmatMachineTranslate/translate').allowedMetaFields(data);
    }

    // Update ACF fields allowed meta fields
    const AcfFields = () =>{
        const postMetaSync = lmatPageTranslationGlobal.postMetaSync === 'true';

        if(window.acf && !postMetaSync){
            const allowedTypes = ['text', 'textarea', 'wysiwyg'];
            acf.getFields().forEach(field => {
                if(field.data && allowedTypes.includes(field.data.type)){
                    updateAllowedMetaFields({id: field.data.key, type: field.data.type});
                }
            });
        }
    }

    // Update allowed meta fields
    Object.keys(AllowedMetaFields).forEach(key => {
        updateAllowedMetaFields({id: key, type: AllowedMetaFields[key].type});
    });

    // Update ACF fields allowed meta fields
    AcfFields();

    const blockRulesApiSendData = {
        lmat_fetch_block_rules_key: lmatPageTranslationGlobal.fetchBlockRulesNonce,
        action: lmatPageTranslationGlobal.action_block_rules
    };

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        },
        body: new URLSearchParams(blockRulesApiSendData)
    })
        .then(response => response.json())
        .then(data => {
            blockRules = JSON.parse(data.data.blockRules);
            dispatch('block-lmatMachineTranslate/translate').setBlockRules(blockRules);

        })
        .catch(error => {
            console.error('Error fetching post content:', error);
        });



    /**
     * Prepare data to send in API request.
     */
    const apiSendData = {
        postId: parseInt(props.postId),
        local: props.targetLang,
        current_local: props.sourceLang,
        lmat_page_translation_nonce: lmatPageTranslationGlobal.ajax_nonce,
        action: lmatPageTranslationGlobal.action_fetch
    };

    /**
     * useEffect hook to fetch post data from the specified API endpoint.
     * Parses the response data and updates the state accordingly.
     * Handles errors in fetching post content.
     */
    // useEffect(() => {
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        },
        body: new URLSearchParams(apiSendData)
    })
        .then(response => response.json())
        .then(data => {

            const post_data = data.data;

            if (post_data.content && post_data.content.trim() !== '') {
                post_data.content = parse(post_data.content);
            }

            GutenbergBlockSaveSource(post_data, blockRules);
            props.refPostData(post_data);
            props.updatePostDataFetch(true);
        })
        .catch(error => {
            console.error('Error fetching post content:', error);
        });
};

export default GutenbergPostFetch;