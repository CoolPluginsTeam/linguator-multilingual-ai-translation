import GoogleTranslater from "./google/index.js";
import localAiTranslator from "./local-ai-translator/index.js";
import { sprintf, __ } from "@wordpress/i18n";
import { ChromeIcon } from "../../../../../assets/logo/chrome.js";
import { GoogleIcon } from "../../../../../assets/logo/google.js";

/**
 * Provides translation services using Yandex Translate.
 */
export default (props) => {
    props=props || {};
    const { Service = false, openErrorModalHandler=()=>{} } = props;
    const assetsUrl = window.lmatPageTranslationGlobal.lmat_url+'admin/assets/images/';
    const errorIcon = assetsUrl + 'error-icon.svg';
    const providers=window.lmatPageTranslationGlobal.providers;

    const Services = {
        google: {
            Provider: GoogleTranslater,
            title: "Google Translate",
            SettingBtnText: "Translate",
            serviceLabel: "Google Translate",
            Docs: "https://docs.coolplugins.net/doc/google-translate-for-polylang/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_google_pro",
            heading: __("Choose Language", 'linguator-multilingual-ai-translation'),
            BetaEnabled: false,
            ButtonDisabled: props.googleButtonDisabled,
            ErrorMessage: props.googleButtonDisabled ? <div className="lmat-page-translation-provider-error button button-primary" onClick={() => openErrorModalHandler("google")}><img src={errorIcon} alt="error" /> {__('View Error', 'linguator-multilingual-ai-translation')}</div> : <></>,
            Logo: <GoogleIcon className="icon-size"/>
        },
        localAiTranslator: {
            Provider: localAiTranslator,
            title: "Chrome Built-in AI",
            SettingBtnText: "Translate",
            serviceLabel: "Chrome AI Translator",
            heading: sprintf(__("Translate Using %s", "linguator-multilingual-ai-translation"), "Chrome built-in API"),
            Docs: "https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_chrome_pro",
            BetaEnabled: true,
            ButtonDisabled: props.localAiTranslatorButtonDisabled,
            ErrorMessage: props.localAiTranslatorButtonDisabled ? <div className="lmat-page-translation-provider-error button button-primary" onClick={() => openErrorModalHandler("localAiTranslator")}><img src={errorIcon} alt="error" /> {__('View Error', 'linguator-multilingual-ai-translation')}</div> : <></>,
            Logo: <ChromeIcon className="icon-size"/>
        }
    };

    const validServices={};

    providers.forEach(provider=>{
        validServices[provider]=Services[provider];
    });

    if (!Service) {
        return validServices;
    }

    return validServices[Service];
};
