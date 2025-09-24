import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Container, Input, Label, RadioButton, Switch, Badge } from '@bsf/force-ui'
import { Languages, Post } from 'lucide-react';
import { __ } from '@wordpress/i18n'
import { FcGoogle } from "react-icons/fc";
import apiFetch from "@wordpress/api-fetch"
import { getNonce } from '../utils'
import { toast } from 'sonner'
import { ChromeIcon } from '../../../../../assets/logo/chrome';
import { GoogleIcon } from '../../../../../assets/logo/google';



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
            style={{ border: "1px solid #e5e7eb", background: "#fff5f5", margin: "0 1.5rem 1.5rem 1.5rem" }}
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
    const [bulkTranslationPostStatus, setBulkTranslationPostStatus] = useState(aiTranslation?.bulk_translation_post_status || 'draft')
    const [slugTranslationOption, setSlugTranslationOption] = useState(aiTranslation?.slug_translation_option || 'title_translate')
    const [handleButtonDisabled, setHandleButtonDisabled] = useState(true)

    useEffect(() => {
        let sameChecker = {
            googleMachineTranslation: true,
            chromeLocalAITranslation: true,
            bulkTranslationPostStatus: true,
            slugTranslationOption: true,
        }

        if (googleMachineTranslation !== provider?.google) {
            sameChecker.googleMachineTranslation = false

        }

        if (chromeLocalAITranslation !== provider?.chrome_local_ai) {
            sameChecker.chromeLocalAITranslation = false
        }

        if (bulkTranslationPostStatus !== aiTranslation?.bulk_translation_post_status) {
            sameChecker.bulkTranslationPostStatus = false
        }

        if (slugTranslationOption !== aiTranslation?.slug_translation_option) {
            sameChecker.slugTranslationOption = false
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
    }, [chromeLocalAITranslation, googleMachineTranslation, bulkTranslationPostStatus, slugTranslationOption])


    //Save Setting Function 
    async function SaveSettings() {
        try {
            let apiBody;

            apiBody = {
                ai_translation_configuration: {
                    provider: {
                        google: googleMachineTranslation,
                        chrome_local_ai: chromeLocalAITranslation,
                    },
                    bulk_translation_post_status: bulkTranslationPostStatus,
                    slug_translation_option: slugTranslationOption
                }
            }

            setLastUpdatedValue({ googleMachineTranslation, chromeLocalAITranslation, bulkTranslationPostStatus, slugTranslationOption })
            if (aiTranslation && (lastUpdatedValue.googleMachineTranslation !== googleMachineTranslation || lastUpdatedValue.chromeLocalAITranslation !== chromeLocalAITranslation || lastUpdatedValue.bulkTranslationPostStatus !== bulkTranslationPostStatus || lastUpdatedValue.slugTranslationOption !== slugTranslationOption)) {
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

    const postStatusOptions = [
        {
            heading: __('Published', 'linguator-multilingual-ai-translation'),
            value: 'publish'
        },
        {
            heading: __('Draft', 'linguator-multilingual-ai-translation'),
            value: 'draft'
        }
    ]

    const slugTranslationOptions = [
        {
            heading: __('Title Translate', 'linguator-multilingual-ai-translation'),
            value: 'title_translate'
        },
        {
            heading: __('Slug Translate', 'linguator-multilingual-ai-translation'),
            value: 'slug_translate'
        },
        {
            heading: __('Keep Slug Original', 'linguator-multilingual-ai-translation'),
            value: 'slug_keep'
        }
    ]

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
                                <GoogleIcon className='w-5 h-5'/>
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
                    <div style={{ backgroundColor: "#fbfbfb" }}>
                        <div className='switcher p-6 rounded-lg'>
                            <Container.Item >
                                <h3 className='flex items-center gap-2'>
                                    <ChromeIcon className="w-5 h-5"/>
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
                </div>
            </Container.Item>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
            <Container.Item>
                <Label size='md' className='font-bold flex items-center gap-2'>
                    {/* <Post className="flex-shrink-0 size-5 text-icon-secondary" /> */}
                    {__('Bulk Translation default Post Status', 'linguator-multilingual-ai-translation')}
                </Label>
                <Label variant='help'>
                    {__('This is the default post status for bulk translation.', 'linguator-multilingual-ai-translation')}
                </Label>
                <div style={{ marginTop: "20px" }}>
                    <div className='flex items-center gap-0 flex-wrap'>
                        {postStatusOptions.map((postStatus) => (
                            <div key={postStatus.value} className='flex items-center gap-2 m-width-1/2 align-middle mr-7'>
                                <Label className='text-sm pr-12 align-middle relative' htmlFor={postStatus.value}><p>{postStatus.heading}</p>
                                <label className='absolute mr-0.5 right-3 flex items-center cursor-pointer rounded-full gap-2' htmlFor={postStatus.value}>
                                    <span className='relative p-0.5'>
                                        <input type="radio" className="peer flex relative cursor-pointer appearance-none transition-all m-0 before:content-[''] checked:before:content-[''] checked:before:hidden before:hidden !border-1.5 border-solid rounded-full border-border-strong hover:border-border-interactive checked:border-border-interactive bg-white checked:bg-toggle-on checked:hover:bg-toggle-on-hover checked:hover:border-toggle-on-hover focus:ring-2 focus:ring-offset-2 focus:ring-focus size-4" name="bulkTranslationPostStatus" value={postStatus.value} id={postStatus.value} onChange={() => {
                                            setBulkTranslationPostStatus(postStatus.value)
                                        }} checked={bulkTranslationPostStatus === postStatus.value} />
                                        <span className="inline-flex items-center absolute top-2/4 not-rtl:left-2/4 rtl:right-2/4 -translate-y-2/4 -translate-x-2/4 opacity-0 transition-opacity peer-checked:opacity-100 text-white"><div className="rounded-full bg-current size-1.5"></div></span>
                                    </span>
                                </label>
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </Container.Item>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
            <Container.Item>
                <Label size='md' className='font-bold flex items-center gap-2'>
                    {__('Slug Translation Option', 'linguator-multilingual-ai-translation')}
                </Label>
                <Label variant='help'>{__('This is the option for slug translation.', 'linguator-multilingual-ai-translation')}</Label>
                <div style={{ marginTop: "20px" }}>
                    <div className='flex items-center gap-0 flex-wrap'>
                    {slugTranslationOptions.map((slugOption) => (
                            <div key={slugOption.value} className='flex items-center gap-2 m-width-1/2 align-middle mr-7'>
                                <Label className='text-sm pr-12 align-middle relative' htmlFor={slugOption.value}><p>{slugOption.heading}</p>
                                <label className='absolute mr-0.5 right-3 flex items-center cursor-pointer rounded-full gap-2' htmlFor={slugOption.value}>
                                    <span className='relative p-0.5'>
                                        <input type="radio" className="peer flex relative cursor-pointer appearance-none transition-all m-0 before:content-[''] checked:before:content-[''] checked:before:hidden before:hidden !border-1.5 border-solid rounded-full border-border-strong hover:border-border-interactive checked:border-border-interactive bg-white checked:bg-toggle-on checked:hover:bg-toggle-on-hover checked:hover:border-toggle-on-hover focus:ring-2 focus:ring-offset-2 focus:ring-focus size-4" name="slugTranslationOption" value={slugOption.value} id={slugOption.value} onChange={() => {
                                            setSlugTranslationOption(slugOption.value)
                                        }} checked={slugTranslationOption === slugOption.value} />
                                        <span className="inline-flex items-center absolute top-2/4 not-rtl:left-2/4 rtl:right-2/4 -translate-y-2/4 -translate-x-2/4 opacity-0 transition-opacity peer-checked:opacity-100 text-white"><div className="rounded-full bg-current size-1.5"></div></span>
                                    </span>
                                </label>
                                </Label>
                            </div>
                        ))}
                        
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