import { select, dispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import ClassicSaveSource from "../../store-source-string/classic/index.js";

const ClassicPostFetch = async (props) => {
    const apiUrl = lmatPageTranslationGlobal.ajax_url;
    const apiController = [];

    const destroyHandler = () => {
        apiController.forEach(controller => {
            controller.abort('Modal Closed');
        });
    }

    props.updateDestroyHandler(() => {
        destroyHandler();
    });

    const ContentFetch = async () => {

        const contentFetchStatus = select('block-lmatPageTranslation/translate').contentFetchStatus();
        if (contentFetchStatus) {
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

                const contentFetchStatus = select('block-lmatPageTranslation/translate').contentFetchStatus();
                
                if (contentFetchStatus) {
                    return;
                }

                const post_data = data.data;
                ClassicSaveSource(post_data);
                props.refPostData(post_data);
                props.updatePostDataFetch(true);
                dispatch('block-lmatPageTranslation/translate').contentFetchStatus(true);
            })
            .catch(error => {
                console.error('Error fetching post content:', error);
            });
    }

    await ContentFetch();
};

export default ClassicPostFetch;
