// import YandexTranslater from "./yandex";
import localAiTranslator from "./local-ai/index.js";
import GoogleTranslater from "./google/index.js";
import AiLlmBulkTranslator from "./ai-llm/index.js";
import { sprintf, __ } from "@wordpress/i18n";
import { ChromeIcon } from "../../../../../assets/logo/chrome.js";
import { GoogleIcon } from "../../../../../assets/logo/google.js";
import { AnthropicIcon } from "../../../../../assets/logo/anthropic.js";
import { GeminiIcon } from "../../../../../assets/logo/gemini.js";
import { OpenAIIcon } from "../../../../../assets/logo/openai.js";
/**
 * Provides translation services using Yandex Translate.
 */
export default (props) => {
    props=props || {};
    const { Service = false, openErrorModalHandler=()=>{}, prefix='' } = props;
    const adminUrl = window.lmatBulkTranslationGlobal.admin_url;
    const assetsUrl = window.lmatBulkTranslationGlobal.lmat_url+'admin/assets/images/';
    const errorIcon = assetsUrl + 'error-icon.svg';
    const providers=window.lmatBulkTranslationGlobal.providers;

    const Services = {
        // yandex: {
        google: {
            Provider: GoogleTranslater,
            title: "Google Translate",
            SettingBtnText: "Translate",
            serviceLabel: "Google Translate",
            Docs: "https://docs.coolplugins.net/doc/google-translate-for-polylang/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=docs&utm_content=bulk_translate_google",
            heading: __("Choose Language", 'linguator-multilingual-ai-translation'),
            BetaEnabled: false,
            ButtonDisabled: props.googleButtonDisabled,
            ErrorMessage: props.googleButtonDisabled ? <div className={`${prefix}-provider-error button button-primary`} onClick={() => openErrorModalHandler(props.googleButtonDisabled)}><img src={errorIcon} alt="error" /> {__('View Error.', 'linguator-multilingual-ai-translation')}</div> : <></>,
            Logo: <GoogleIcon className="icon-size" />,
            filterHtmlContent: true
        },
        localAiTranslator: {
            Provider: localAiTranslator,
            title: "Chrome Built-in AI",
            SettingBtnText: "Translate",
            serviceLabel: "Chrome AI Translator",
            heading: sprintf(__("Translate Using %s", 'linguator-multilingual-ai-translation'), "Chrome built-in API"),
            Docs: "https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=docs&utm_content=bulk_translate_chrome",
            BetaEnabled: true,
            ButtonDisabled: props.localAiTranslatorButtonDisabled,
            ErrorMessage: props.localAiTranslatorButtonDisabled ? <div className={`${prefix}-provider-error button button-primary`} onClick={() => openErrorModalHandler(props.localAiTranslatorButtonDisabled)}><img src={errorIcon} alt="error" /> {__('View Error', 'linguator-multilingual-ai-translation')}</div> : <></>,
            Logo: <ChromeIcon className="icon-size"  />,
            filterHtmlContent: true
        },
        openai: {
            Provider: AiLlmBulkTranslator,
            title: "OpenAI",
            SettingBtnText: window.lmatBulkTranslationGlobal.api_keys_status?.openai ? "Translate" : "Add API Key",
            serviceLabel: "OpenAI",
            heading: __("Translate Using OpenAI", "linguator-multilingual-ai-translation"),
            Docs: "https://docs.coolplugins.net/doc/openai-translation-polylang/?utm_source=twlmat_plugin&utm_medium=inside&utm_campaign=docs",
            BetaEnabled: false,
            ButtonDisabled: !window.lmatBulkTranslationGlobal.api_keys_status?.openai,
            ErrorMessage: !window.lmatBulkTranslationGlobal.api_keys_status?.openai ? <a href={`${window.lmatBulkTranslationGlobal.admin_url}admin.php?page=lmat_settings&tab=api-keys`} target="_blank" className={`${prefix}-provider-error button button-primary`}>{__('Add API Key', 'linguator-multilingual-ai-translation')}</a> : <></>,
            Logo: <OpenAIIcon className="icon-size" />,
            filterHtmlContent: true
        },
        anthropic: {
            Provider: AiLlmBulkTranslator,
            title: "Anthropic",
            SettingBtnText: window.lmatBulkTranslationGlobal.api_keys_status?.anthropic ? "Translate" : "Add API Key",
            serviceLabel: "Anthropic",
            heading: __("Translate Using Anthropic", "linguator-multilingual-ai-translation"),
            Docs: "https://docs.coolplugins.net/doc/anthropic-translation-polylang/?utm_source=twlmat_plugin&utm_medium=inside&utm_campaign=docs",
            BetaEnabled: false,
            ButtonDisabled: !window.lmatBulkTranslationGlobal.api_keys_status?.anthropic,
            ErrorMessage: !window.lmatBulkTranslationGlobal.api_keys_status?.anthropic ? <a href={`${window.lmatBulkTranslationGlobal.admin_url}admin.php?page=lmat_settings&tab=api-keys`} target="_blank" className={`${prefix}-provider-error button button-primary`}>{__('Add API Key', 'linguator-multilingual-ai-translation')}</a> : <></>,
            Logo: <AnthropicIcon className="icon-size" />,
            filterHtmlContent: true
        },
        gemini: {
            Provider: AiLlmBulkTranslator,
            title: "Google Gemini",
            SettingBtnText: window.lmatBulkTranslationGlobal.api_keys_status?.gemini ? "Translate" : "Add API Key",
            serviceLabel: "Gemini",
            heading: __("Translate Using Gemini", "linguator-multilingual-ai-translation"),
            Docs: "https://docs.coolplugins.net/doc/gemini-translation-polylang/?utm_source=twlmat_plugin&utm_medium=inside&utm_campaign=docs",
            BetaEnabled: false,
            ButtonDisabled: !window.lmatBulkTranslationGlobal.api_keys_status?.gemini,
            ErrorMessage: !window.lmatBulkTranslationGlobal.api_keys_status?.gemini ? <a href={`${window.lmatBulkTranslationGlobal.admin_url}admin.php?page=lmat_settings&tab=api-keys`} target="_blank" className={`${prefix}-provider-error button button-primary`}>{__('Add API Key', 'linguator-multilingual-ai-translation')}</a> : <></>,
            Logo: <GeminiIcon className="icon-size" />,
            filterHtmlContent: true
        }
    };

    const validServices={};

    providers.forEach((provider) => {
        if (Services[provider]) {
            validServices[provider] = Services[provider];
        }
    });

    if (!Service) {
        return validServices;
    }

    return validServices[Service];
};
