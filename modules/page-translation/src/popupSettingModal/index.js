import ReactDOM from "react-dom/client";
import { useEffect, useState } from "@wordpress/element";
import PopStringModal from "../popupStringModal/index.js";
import googleLanguage from "../component/TranslateProvider/google/google-language.js";
import ChromeLocalAiTranslator from "../component/TranslateProvider/local-ai-translator/local-ai-translator.js";
import SettingModalHeader from "./header.js";
import SettingModalBody from "./body.js";
import SettingModalFooter from "./footer.js";
import { __ , sprintf } from "@wordpress/i18n";
import ErrorModalBox from "../component/ErrorModalBox/index.js";

const SettingModal = (props) => {
    const [targetBtn, setTargetBtn] = useState({});
    const [modalRender, setModalRender] = useState(0);
    const [settingVisibility, setSettingVisibility] = useState(false);
    const sourceLang = lmatPageTranslationGlobal.source_lang;
    const targetLang = props.targetLang;
    const sourceLangName = lmatPageTranslationGlobal.languageObject[sourceLang]['name'];
    const targetLangName = lmatPageTranslationGlobal.languageObject[targetLang]['name'];
    const imgFolder = lmatPageTranslationGlobal.lmat_url + 'Admin/Assets/images/';
    const googleSupport = googleLanguage().includes(targetLang === 'zh' ? lmatPageTranslationGlobal.languageObject['zh']?.locale.replace('_', '-') : targetLang);
    const [serviceModalErrors, setServiceModalErrors] = useState({});
    const [errorModalVisibility, setErrorModalVisibility] = useState(false);
    const [chromeAiBtnDisabled, setChromeAiBtnDisabled] = useState(false);

    const openModalOnLoadHandler = (e) => {
        e.preventDefault();
        const btnElement = e.target;
        const visibility = btnElement.dataset.value;

        if (visibility === 'yes') {
            setSettingVisibility(true);
        }

        btnElement.closest('#lmat-page-translation-modal-open-warning-wrapper').remove();
    }

    const closeErrorModal = () => {
        setErrorModalVisibility(false);
    }

    const openErrorModalHandler = (service) => {
        setSettingVisibility(false);
        setErrorModalVisibility(service);
    }

    /**
     * useEffect hook to set settingVisibility.
     * Triggers the setSettingVisibility only when user click on meta field Button.
    */
    useEffect(() => {
        const firstRenderBtns = document.querySelectorAll('#lmat-page-translation-modal-open-warning-wrapper .modal-content div[data-value]');
        const metaFieldBtn = document.querySelector(props.translateWrpSelector);

        if (metaFieldBtn) {
            metaFieldBtn.addEventListener('click', (e) => {
                e.preventDefault();
                setSettingVisibility(prev => !prev);
            });
        }

        firstRenderBtns.forEach(ele => {
            if (ele) {
                ele.addEventListener('click', openModalOnLoadHandler);
            }
        })
    }, [])

    /**
     * useEffect hook to check if the local AI translator is supported.
     */
    useEffect(() => {
        const languageSupportedStatus = async () => {
            const localAiTranslatorSupport = await ChromeLocalAiTranslator.languageSupportedStatus(sourceLang, targetLang, targetLangName, sourceLangName);
            const translateBtn = document.querySelector('.lmat-page-translation-service-btn#lmat-page-translation-localAiTranslator-btn');

            if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object' && translateBtn) {
                setChromeAiBtnDisabled(true);
    
                setServiceModalErrors(prev => ({ ...prev, localAiTranslator: {message: localAiTranslatorSupport, Title: __("Chrome AI Translator", 'linguator-multilingual-ai-translation')} }));
            }
        };
        if(settingVisibility){
            if(!googleSupport){
                setServiceModalErrors(prev => ({
                    ...prev,
                    google: {
                        message: "<p style={{ fontSize: '1rem', color: '#ff4646' }}>"+sprintf(
                            __("Google Translate does not support the target language: %s.", 'linguator-multilingual-ai-translation'),
                            "<strong>"+targetLangName+"</strong>"
                        )+"</p>",
                        Title: __("Google Translate", 'linguator-multilingual-ai-translation')
                    }
                }));
            }

            languageSupportedStatus();
        }
    }, [settingVisibility]);

    /**
     * useEffect hook to handle displaying the modal and rendering the PopStringModal component.
     */
    useEffect(() => {
        const btn = targetBtn;
        const service = btn.dataset && btn.dataset.service;
        const serviceLabel = btn.dataset && btn.dataset.serviceLabel;
        const postId = props.postId;

        const parentWrp = document.getElementById("lmat_page_translation_strings_model");

        if (parentWrp) {
            // Store root instance in a ref to avoid recreating it
            if (!parentWrp._reactRoot) {
                parentWrp._reactRoot = ReactDOM.createRoot(parentWrp);
            }

            if (modalRender) {
                parentWrp._reactRoot.render(<PopStringModal
                    currentPostId={props.currentPostId}
                    postId={postId}
                    service={service}
                    serviceLabel={serviceLabel}
                    sourceLang={sourceLang}
                    targetLang={targetLang}
                    modalRender={modalRender}
                    pageTranslate={props.pageTranslate}
                    postDataFetchStatus={props.postDataFetchStatus}
                    fetchPostData={props.fetchPostData}
                    translatePost={props.translatePost}
                    contentLoading={props.contentLoading}
                    updatePostDataFetch={props.updatePostDataFetch}
                    stringModalBodyNotice={props.stringModalBodyNotice}
                />);
            }
        }
    }, [props.postDataFetchStatus, modalRender]);

    /**
     * Function to handle fetching content based on the target button clicked.
     * Sets the target button and updates the fetch status to true.
     * @param {Event} e - The event object representing the button click.
     */
    const fetchContent = async (e) => {
        let targetElement = !e.target.classList.contains('lmat-page-translation-service-btn') ? e.target.closest('.lmat-page-translation-service-btn') : e.target;

        if (!targetElement) {
            return;
        }

        const dataService = targetElement.dataset && targetElement.dataset.service;
        setSettingVisibility(false);

        if (dataService === 'localAiTranslator') {
            const localAiTranslatorSupport = await ChromeLocalAiTranslator.languageSupportedStatus(sourceLang, targetLang, targetLangName);
            if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object') {
                return;
            }
        }
        
        setModalRender(prev => prev + 1);
        setTargetBtn(targetElement);
    };

    const handleSettingVisibility = (visibility) => {
        setSettingVisibility(visibility);
    }

    return (
        <>
            {errorModalVisibility && serviceModalErrors[errorModalVisibility] &&
                <ErrorModalBox onClose={closeErrorModal} {...serviceModalErrors[errorModalVisibility]}/>
            }
            {settingVisibility &&
                <div className="modal-container" style={{ display: settingVisibility ? 'flex' : 'none' }}>
                    <div className="lmat-page-translation-settings modal-content">
                        <SettingModalHeader
                            setSettingVisibility={handleSettingVisibility}
                            postType={props.postType}
                            sourceLangName={sourceLangName}
                            targetLangName={targetLangName}
                        />
                        <SettingModalBody
                            googleDisabled={!googleSupport}
                            fetchContent={fetchContent}
                            imgFolder={imgFolder}
                            targetLangName={targetLangName}
                            postType={props.postType}
                            sourceLangName={sourceLangName}
                            localAiTranslatorDisabled={chromeAiBtnDisabled}
                            openErrorModalHandler={openErrorModalHandler}
                        />
                        <SettingModalFooter
                            targetLangName={targetLangName}
                            postType={props.postType}
                            sourceLangName={sourceLangName}
                            setSettingVisibility={handleSettingVisibility}
                        />
                    </div>
                </div>
            }
        </>
    );
};

export default SettingModal;