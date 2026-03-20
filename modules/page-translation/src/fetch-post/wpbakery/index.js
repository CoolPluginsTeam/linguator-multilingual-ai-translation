import { select, dispatch } from "@wordpress/data";
import WPBakerySaveSource from "../../store-source-string/wpbakery/index.js";

/**
 * Fetch WPBakery post content from the server.
 * Retrieves post data and stores source strings for translation.
 * 
 * @param {Object} props - Component props containing post info and callbacks
 */
const WPBakeryPostFetch = async (props) => {
    const apiUrl = lmatPageTranslationGlobal.ajax_url;
    const apiController = [];

    /**
     * Abort all pending API requests when modal is closed.
     */
    const destroyHandler = () => {
        apiController.forEach(controller => {
            controller.abort('Modal Closed');
        });
    }

    props.updateDestroyHandler(() => {
        destroyHandler();
    });

    /**
     * Fetch WPBakery content from server.
     * The content is already processed by PHP filters:
     * - Base64 decoded
     * - Translatable attributes wrapped in [lmat_val] tags
     */
    const ContentFetch = async () => {

        const contentFetchStatus = select('block-lmatPageTranslation/translate').contentFetchStatus();
        if (contentFetchStatus) {
            return;
        }

        /**
         * Prepare data for API request.
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
         * Fetch post data from WordPress via AJAX.
         * The server applies WPBakery-specific filters:
         * - decode_wpbakery_shortcodes (priority 10)
         * - expose_translatable_attributes (priority 20)
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

                const contentFetchStatus = select('block-lmatPageTranslation/translate').contentFetchStatus();
                
                if (contentFetchStatus) {
                    return;
                }

                const post_data = data.data;
                
                // Store WPBakery source strings
                WPBakerySaveSource(post_data);
                
                // Pass data to parent component
                props.refPostData(post_data);
                props.updatePostDataFetch(true);
                
                // Mark content as fetched
                dispatch('block-lmatPageTranslation/translate').contentFetchStatus(true);
            })
            .catch(error => {
                console.error('Error fetching WPBakery post content:', error);
            });
    }

    await ContentFetch();
};

export default WPBakeryPostFetch;
