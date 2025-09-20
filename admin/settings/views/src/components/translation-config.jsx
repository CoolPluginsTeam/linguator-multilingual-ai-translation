import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Container, Input, Label, RadioButton, Switch } from '@bsf/force-ui'
import { Languages } from 'lucide-react';
import { __ } from '@wordpress/i18n'
import { FcGoogle } from "react-icons/fc";
import apiFetch from "@wordpress/api-fetch"
import { getNonce } from '../utils'
import { toast } from 'sonner'

const ChromeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
        <defs>
            <linearGradient id="chrome-a" x1="3.2173" y1="15" x2="44.7812" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#d93025"/>
                <stop offset="1" stopColor="#ea4335"/>
            </linearGradient>
            <linearGradient id="chrome-b" x1="20.7219" y1="47.6791" x2="41.5039" y2="11.6837" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fcc934"/>
                <stop offset="1" stopColor="#fbbc04"/>
            </linearGradient>
            <linearGradient id="chrome-c" x1="26.5981" y1="46.5015" x2="5.8161" y2="10.506" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#1e8e3e"/>
                <stop offset="1" stopColor="#34a853"/>
            </linearGradient>
        </defs>
        <circle cx="24" cy="23.9947" r="12" fill="#fff"/>
        <path d="M3.2154,36A24,24,0,1,0,12,3.2154,24,24,0,0,0,3.2154,36ZM34.3923,18A12,12,0,1,1,18,13.6077,12,12,0,0,1,34.3923,18Z" fill="none"/>
        <path d="M24,12H44.7812a23.9939,23.9939,0,0,0-41.5639.0029L13.6079,30l.0093-.0024A11.9852,11.9852,0,0,1,24,12Z" fill="url(#chrome-a)"/>
        <circle cx="24" cy="24" r="9.5" fill="#1a73e8"/>
        <path d="M34.3913,30.0029,24.0007,48A23.994,23.994,0,0,0,44.78,12.0031H23.9989l-.0025.0093A11.985,11.985,0,0,1,34.3913,30.0029Z" fill="url(#chrome-b)"/>
        <path d="M13.6086,30.0031,3.218,12.006A23.994,23.994,0,0,0,24.0025,48L34.3931,30.0029l-.0067-.0068a11.9852,11.9852,0,0,1-20.7778.007Z" fill="url(#chrome-c)"/>
    </svg>
);

const ChromeLocalAINotice = () => {
    const [showBrowserNotice, setShowBrowserNotice] = React.useState(false);
    const [showSecureNotice, setShowSecureNotice] = React.useState(false);
    const [showApiNotice, setShowApiNotice] = React.useState(false);

    React.useEffect(() => {
        const safeBrowser = window?.location?.protocol === "https:";
        const browserContentSecure = window?.isSecureContext;
        // Secure connection + API availability check
        const apiAvailable =
            ("translation" in window?.self &&
                "createTranslator" in window?.self?.translation) ||
            ("ai" in window?.self && "translator" in window?.self?.ai) ||
            ("Translator" in window?.self && "create" in window?.self?.Translator);

        // Browser check (must be Chrome, not Edge or others)
        if (
            !window?.hasOwnProperty("chrome") ||
            !navigator?.userAgent?.includes("Chrome") ||
            navigator?.userAgent?.includes("Edg")
        ) {
            setShowBrowserNotice(true);
        } else if (!apiAvailable && !safeBrowser && !browserContentSecure) {
            setShowSecureNotice(true);
        } else if (!apiAvailable) {
            setShowApiNotice(true);
        }
    }, []);

    if (!showBrowserNotice && !showSecureNotice && !showApiNotice) {
        return null; // no notice needed
    }

    let message = '';
    let heading = '';

    if (showBrowserNotice) {
        heading = __('⚠️ Important Notice: Browser Compatibility', 'linguator-multilingual-ai-translation');
        message = `<ul className="list-disc ml-5 mt-2"><li>
                ${sprintf(__('The %sTranslator API%s, which uses Chrome Local AI Models, is designed exclusively for use with the %sChrome browser%s.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>', '<strong>', '</strong>')}
              </li>
              <li>
                ${sprintf(__('If you are using a different browser (such as Edge, Firefox, or Safari), the API may not function correctly.', 'linguator-multilingual-ai-translation'))}
              </li>
              <li>
                ${sprintf(__('Learn more in the %sofficial documentation%s.', 'linguator-multilingual-ai-translation'), '<a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank" rel="noreferrer" class="underline text-blue-600">', '</a>')}
              </li>
      </ul>`;
    } else if (showSecureNotice) {
        heading = __('⚠️ Important Notice: Secure Connection Required', 'linguator-multilingual-ai-translation');
        message = `<ul className="list-disc ml-5 mt-2">
              <li>
                ${sprintf(__('The %sTranslator API%s requires a secure (HTTPS) connection to function properly.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>')}
              </li>
              <li>
                ${__('If you are on an insecure connection (HTTP), the API will not work.', 'linguator-multilingual-ai-translation')}
              </li>
            </ul>
            <p className="mt-2">${__('👉 How to Fix This:', 'linguator-multilingual-ai-translation')}</p>
            <ol className="list-decimal ml-5 mt-2">
              <li>${sprintf(__('Switch to a secure connection by using %s.', 'linguator-multilingual-ai-translation'), '<strong><code>https://</code></strong>')}
              </li>
              <li>
                ${sprintf(__('Alternatively, add this URL to Chrome’s list of insecure origins treated as secure: %s.', 'linguator-multilingual-ai-translation'), '<strong><code>chrome://flags/#unsafely-treat-insecure-origin-as-secure</code></strong>')}
                <br />
                ${__('Copy the URL and then open a new window and paste this URL to access the settings.', 'linguator-multilingual-ai-translation')}
              </li>
            </ol>`;
    } else if (showApiNotice) {
        heading = __('⚠️ Important Notice: API Availability', 'linguator-multilingual-ai-translation');
        message = `<ol>
                    <li>${sprintf(__('Open this URL in a new Chrome tab: %s. Copy this URL and then open a new window and paste this URL to access the settings.', 'linguator-multilingual-ai-translation'), '<strong><code>chrome://flags/#translation-api</code></strong>')}</li>
                    <li>${sprintf(__('Ensure that the %sExperimental translation API%s option is set to <strong>Enabled</strong>.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>')}</li>
                    <li>${sprintf(__('After change the setting, Click on the %sRelaunch%s button to apply the changes.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>')}</li>
                    <li>${__('The Translator AI modal should now be enabled and ready for use.', 'linguator-multilingual-ai-translation')}</li>
                </ol>
                <p>${sprintf(__('For more information, please refer to the %sdocumentation%s.', 'linguator-multilingual-ai-translation'), '<a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">', '</a>')}</p>   
                <p>${__('If the issue persists, please ensure that your browser is up to date and restart your browser.', 'linguator-multilingual-ai-translation')}</p>
                <p>${sprintf(__('If you continue to experience issues after following the above steps, please %sopen a support ticket%s with our team. We are here to help you resolve any problems and ensure a smooth translation experience.', 'linguator-multilingual-ai-translation'), '<a href="https://my.coolplugins.net/account/support-tickets/" target="_blank" rel="noopener">', '</a>')}</p>`;
    }

    return (
        <div
            className="flex flex-col gap-4 p-6 rounded-lg"
            style={{ border: "1px solid #e5e7eb", background: "#fff5f5", margin: "0 1.5rem 1.5rem 1.5rem"}}
        >
            <div className="text-red-600 text-sm leading-6">
                <h3 className="font-semibold">{heading}</h3>
                <div dangerouslySetInnerHTML={{ __html: message }} />
            </div>
        </div>
    );
};

const TranslationConfig = ({ data, setData }) => {

    const aiTranslation = data?.ai_translation_configuration; //store the media option
    const provider = aiTranslation?.provider;
    const [googleMachineTranslation, setGoogleMachineTranslation] = useState(provider?.google)
    const [chromeLocalAITranslation, setChromeLocalAITranslation] = useState(provider?.chrome_local_ai)
    const [lastUpdatedValue, setLastUpdatedValue] = useState({ googleMachineTranslation, chromeLocalAITranslation })
    const [handleButtonDisabled, setHandleButtonDisabled] = useState(true)

    useEffect(() => {
        let sameChecker = {
            googleMachineTranslation: true,
            chromeLocalAITranslation: true,
        }

        if (googleMachineTranslation !== provider?.google) {
            sameChecker.googleMachineTranslation = false

        }

        if (chromeLocalAITranslation !== provider?.chrome_local_ai) {
            sameChecker.chromeLocalAITranslation = false
        }

        let flag = true;
        for (const key in sameChecker) {
            if (!sameChecker[key]) {
                flag = false;
                setHandleButtonDisabled(false)
                break;
            }
        }
        if (flag) {
            setHandleButtonDisabled(true)
        }
    }, [chromeLocalAITranslation, googleMachineTranslation])


    //Save Setting Function 
    async function SaveSettings() {
        try {
            let apiBody;

            apiBody = {
                ai_translation_configuration: {
                    provider: {
                        google: googleMachineTranslation,
                        chrome_local_ai: chromeLocalAITranslation
                    }
                }
            }

            setLastUpdatedValue({ googleMachineTranslation, chromeLocalAITranslation })
            if (aiTranslation && (lastUpdatedValue.googleMachineTranslation !== googleMachineTranslation || lastUpdatedValue.chromeLocalAITranslation !== chromeLocalAITranslation)) {
                setData(prev => ({
                    ...prev,
                    ...apiBody
                }))
            }
            //API Call
            const response = apiFetch({
                path: 'lmat/v1/settings',
                method: 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': getNonce()
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    setData(prev => ({ ...prev, ...response }))
                })
                .catch(error => {
                    // Handle general API errors
                    if (error?.message) {
                        throw new Error(error.message);
                    }
                    throw new Error(__("Something went wrong", 'linguator-multilingual-ai-translation'));
                });

            toast.promise(response, {
                loading: __('Saving Settings', 'linguator-multilingual-ai-translation'),
                success: __('Settings Saved', 'linguator-multilingual-ai-translation'),
                error: (error) => error.message
            })
            setHandleButtonDisabled(true)

        } catch (error) {
            // Handle domain validation errors
            if (error.message.includes(__("Linguator was unable to access", "linguator-multilingual-ai-translation"))) {
                toast.error(error.message);
            } else {
                toast.error(error.message || __("Something went wrong", "linguator-multilingual-ai-translation"));
            }
        }
    }

    return (
        <Container className='bg-white p-10 rounded-lg' cols="1" containerType='grid'>
            <Container className='flex items-center'>
                <Container.Item className='flex w-full justify-between px-4 gap-6'>
                    <h1 className='font-bold'>{__('Translation Settings', 'linguator-multilingual-ai-translation')}</h1>
                    <Button
                        disabled={handleButtonDisabled}
                        className=""
                        iconPosition="left"
                        size="md"
                        tag="button"
                        type="button"
                        onClick={SaveSettings}
                        variant="primary"
                    >
                        {__('Save Settings', 'linguator-multilingual-ai-translation')}
                    </Button>
                </Container.Item>
            </Container>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
            <Container.Item className='p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                <Label size='md' className='font-bold flex items-center gap-2'>
                    <Languages className="flex-shrink-0 size-5 text-icon-secondary" />
                    {__('Service Provider', 'linguator-multilingual-ai-translation')}
                </Label>
                <Label variant='help'>
                    {__('Select at least one translation service provider below. You can enable multiple providers and choose the one that best fits your needs.', 'linguator-multilingual-ai-translation')}
                </Label>
                <div className='flex flex-col gap-2' style={{ marginTop: "20px" }}>
                    <div style={{backgroundColor: "#fbfbfb"}}>
                    <div className='switcher p-6 rounded-lg'>
                        <Container.Item>
                            <h3 className='flex items-center gap-2'>
                                <FcGoogle className='w-5 h-5'/>
                                {__('Google Machine Translation', 'linguator-multilingual-ai-translation')}
                            </h3>
                            <p>
                                {__('Google Machine Translation uses the Google Translate API to translate text.', 'linguator-multilingual-ai-translation')}
                            </p>
                        </Container.Item>
                        <Container.Item className='flex items-center justify-end' style={{ paddingRight: '30%' }}>
                            <Switch
                                aria-label="Switch Element"
                                id="google-machine-translation"
                                onChange={() => {
                                    setGoogleMachineTranslation(!googleMachineTranslation)
                                }}
                                value={googleMachineTranslation}
                                size="sm"
                            />
                        </Container.Item>
                    </div>
                    </div>
                    <div style={{backgroundColor: "#fbfbfb"}}>
                        <div className='switcher p-6 rounded-lg'>
                            <Container.Item >
                                <h3 className='flex items-center gap-2'>
                                    <ChromeIcon />
                                    {__('Chrome Local AI Translation', 'linguator-multilingual-ai-translation')}
                                </h3>
                                <p>
                                    {__('Chrome Local AI Translation uses Chrome Local AI API to translate text.', 'linguator-multilingual-ai-translation')}
                                </p>
                            </Container.Item>
                            <Container.Item className='flex items-center justify-end' style={{ paddingRight: '30%' }}>
                                <Switch
                                    aria-label="Switch Element"
                                    id="chrome-local-ai-translation"
                                    onChange={() => {
                                        setChromeLocalAITranslation(!chromeLocalAITranslation)
                                    }}
                                    value={chromeLocalAITranslation}
                                    size="sm"
                                />
                            </Container.Item>
                        </div>
                        {chromeLocalAITranslation && <ChromeLocalAINotice />}
                    </div>
                </div>
            </Container.Item>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
            <Container className='flex items-center justify-end'>
                <Container.Item className='flex gap-6'>
                    <Button
                        disabled={handleButtonDisabled}
                        className=""
                        iconPosition="left"
                        size="md"
                        tag="button"
                        type="button"
                        onClick={SaveSettings}
                        variant="primary"
                    >
                        {__('Save Settings', 'linguator-multilingual-ai-translation')}
                    </Button>

                </Container.Item>
            </Container>
        </Container>
    )
}

export default TranslationConfig;