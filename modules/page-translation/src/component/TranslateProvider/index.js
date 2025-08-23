import GoogleTranslater from "./google/index.js";

import { sprintf, __ } from "@wordpress/i18n";

/**
 * Provides translation services using Yandex Translate.
 */
export default (props) => {
    props=props || {};
    const { Service = false, openErrorModalHandler=()=>{} } = props;
    const adminUrl = window.lmatPageTranslationGlobal.admin_url;
    const assetsUrl = window.lmatPageTranslationGlobal.lmat_url+'Admin/Assets/images/';
    const errorIcon = assetsUrl + 'error-icon.svg';

    const Services = {
        google: {
            Provider: GoogleTranslater,
            title: "Google Translate",
            SettingBtnText: "Translate",
            serviceLabel: "Google Translate",
            Docs: "https://docs.coolplugins.net/doc/google-translate-for-polylang/?utm_source=atfpp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_google",
            heading: __("Choose Language", 'linguator-multilingual-ai-translation'),
            BetaEnabled: false,
            ButtonDisabled: props.googleButtonDisabled,
            ErrorMessage: props.googleButtonDisabled ? <div className="lmat-provider-error button button-primary" onClick={() => openErrorModalHandler("google")}><img src={errorIcon} alt="error" /> {__('View Error', 'linguator-multilingual-ai-translation')}</div> : <></>,
            Logo: 'google.png'
        },
        localAiTranslator: {
            title: "Chrome Built-in AI",
            SettingBtnText: "Translate",
            serviceLabel: "Chrome AI Translator",
            heading: sprintf(__("Translate Using %s", 'autopoly-ai-translation-for-polylang'), "Chrome built-in API"),
            Docs: "https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=lmat_page_translation_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_chrome",
            BetaEnabled: true,  
            ButtonDisabled: true,
            ErrorMessage: true ? <div className="lmat-page-translation-provider-disabled button button-primary">{__('Upcoming Feature', 'autopoly-ai-translation-for-polylang')}</div> : <></>,
            Logo: 'chrome.png'
        }
    };

    if (!Service) {
        return Services;
    }
    return Services[Service];
};
