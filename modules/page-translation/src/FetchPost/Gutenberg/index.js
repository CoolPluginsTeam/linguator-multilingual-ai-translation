import GutenbergBlockSaveSource from "../../storeSourceString/Gutenberg/index.js";
import { dispatch, select } from "@wordpress/data";
import { parse } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

import AllowedMetaFields from "../../AllowedMetafileds.js";

const GutenbergPostFetch = async (props) => {
    const apiUrl = lmatPageTranslationGlobal.ajax_url;
    let blockRules = wp.data.select('block-lmatPageTranslation/translate').getBlockRules() || {};
    const apiController = [];

    const destroyHandler = () => {
        apiController.forEach(controller => {
            controller.abort('Modal Closed');
        });
    }

    props.updateDestroyHandler(() => {
        destroyHandler();
    });

    // Update allowed meta fields
    const updateAllowedMetaFields = (data) => {
        dispatch('block-lmatPageTranslation/translate').allowedMetaFields(data);
    }

    // Update ACF fields allowed meta fields
    const AcfFields = () =>{
        const postMetaSync = lmatPageTranslationGlobal.postMetaSync === 'true';

        if(window.acf && !postMetaSync){
            const allowedTypes = ['text', 'textarea', 'wysiwyg'];
            acf.getFields().forEach(field => {
                if(field.data && allowedTypes.includes(field.data.type)){

                    const fieldData=JSON.parse(JSON.stringify({key: field.data.key, type: field.data.type}));

                    if(field.$el && field.$el.closest('.acf-field.acf-field-repeater') && field.$el.closest('.acf-field.acf-field-repeater').length > 0){
                        const rowId=field.$el.closest('.acf-row').data('id');

                        if(rowId && '' !== rowId){
                            const index=rowId.replace('row-', '');
                        
                            fieldData.key=fieldData.key+'_'+index;
                        }
                    }

                    updateAllowedMetaFields({id: fieldData.key, type: fieldData.type});
                }
            });
        }
    }

    // Update allowed meta fields
    Object.keys(AllowedMetaFields).forEach(key => {
        updateAllowedMetaFields({ id: key, type: AllowedMetaFields[key].type });
    });

    // Update ACF fields allowed meta fields
    AcfFields();

    const BlockParseFetch = async () => {

        if (blockRules && blockRules.LmatBlockParseRules && Object.keys(blockRules.LmatBlockParseRules).length > 0) {
            return;
        }

        const blockRulesApiSendData = {
            lmat_fetch_block_rules_key: lmatPageTranslationGlobal.fetchBlockRulesNonce,
            action: lmatPageTranslationGlobal.action_block_rules
        };


        const rulesController = new AbortController();
        apiController.push(rulesController);
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(blockRulesApiSendData),
            signal: rulesController.signal,
        })
            .then(response => response.json())
            .then(data => {
                blockRules = JSON.parse(data.data.blockRules);
                dispatch('block-lmatPageTranslation/translate').setBlockRules(blockRules);

            })
            .catch(error => {
                console.error('Error fetching post content:', error);
            });
    }

    await BlockParseFetch();

    const ContentFetch = async () => {
        const contentExists = select('block-lmatPageTranslation/translate').getTranslationEntry();

        if ((contentExists && contentExists.length > 0) || Object.keys(blockRules).length === 0) {
            return;
        }

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

        const contentController = new AbortController();
        apiController.push(contentController);

        /**
         * useEffect hook to fetch post data from the specified API endpoint.
         * Parses the response data and updates the state accordingly.
         * Handles errors in fetching post content.
         */
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(apiSendData),
            signal: contentController.signal,
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
    }

    await ContentFetch();
};

export default GutenbergPostFetch;