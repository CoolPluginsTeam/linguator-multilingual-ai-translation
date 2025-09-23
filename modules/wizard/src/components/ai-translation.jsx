import { setupContext } from "../pages/setup-page"
import SetupContinueButton, { SetupBackButton } from './setup-continue-button'
import { getNonce } from '../utils'
import apiFetch from '@wordpress/api-fetch'
import { toast } from 'sonner'
import { __, sprintf } from '@wordpress/i18n'
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { Switch } from '@bsf/force-ui'
import {ChromeIcon} from "../../../../assets/logo/chrome"



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
      }else if (!apiAvailable && !safeBrowser && !browserContentSecure) {
        setShowSecureNotice(true);
      }else if(!apiAvailable){
        setShowApiNotice(true);
      }
    }, []);
  
    if (!showBrowserNotice && !showSecureNotice && !showApiNotice) {
      return null; // no notice needed
    }
  
    let message='';
    let heading='';

    if(showBrowserNotice){
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
    }else if(showSecureNotice){
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
    }else if(showApiNotice){
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
        style={{ border: "1px solid #e5e7eb", background: "#fff5f5" }}
      >
        <div className="text-red-600 text-sm leading-6">
          <h3 className="font-semibold">{heading}</h3>
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </div>
      </div>
    );
};

const AiTranslation = () => {
    const { setSetupProgress, data, setData, showHomePage } = React.useContext(setupContext) // get the context
    const aiTranslation = data?.ai_translation_configuration; //store the media option
    const provider = aiTranslation?.provider;
    const [googleMachineTranslation, setGoogleMachineTranslation] = React.useState(provider?.google)
    const [chromeLocalAITranslation, setChromeLocalAITranslation] = React.useState(provider?.chrome_local_ai)
    const [lastUpdatedValue, setLastUpdatedValue] = React.useState({googleMachineTranslation,chromeLocalAITranslation})

    const handleBack = () => {
      if (showHomePage == "1") {
        setSetupProgress("home_page")
        localStorage.setItem("setupProgress", "home_page");
    }else if (window.lmat_setup.media == "1") {
        setSetupProgress("media")
        localStorage.setItem("setupProgress", "media");
      } else {
        setSetupProgress("url")
        localStorage.setItem("setupProgress", "url");
      }
    }
    //function to handle save button in the media page
    async function saveAITranslation() {
        try {
            //handle if there are changes then make api call and save to databse or else no api call
            if (aiTranslation && (lastUpdatedValue.googleMachineTranslation !== googleMachineTranslation || lastUpdatedValue.chromeLocalAITranslation !== chromeLocalAITranslation)) {
                const AITranslationResponse = await apiFetch({
                    path: 'lmat/v1/settings',
                    method: 'POST',
                    'headers': {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': getNonce()
                    },
                    body: JSON.stringify({
                        ai_translation_configuration: {
                            provider: {
                                chrome_local_ai: chromeLocalAITranslation,
                                google: googleMachineTranslation
                            }
                        }
                    })
                })
                setLastUpdatedValue({googleMachineTranslation,chromeLocalAITranslation})
                setData(AITranslationResponse)
            }

            //Dynamically move to next page
            setSetupProgress("language_switcher")
            localStorage.setItem("setupProgress", "language_switcher");
        } catch (error) {
            toast.error(__("Please try again later", "linguator-multilingual-ai-translation"))
        }
    }

    return (
        <div className='mx-auto p-10 max-w-[600px] min-h-[40vh] bg-white shadow-sm flex flex-col'>
            <div className='flex-grow'>
                <h2>{__('Translation Configuration', 'linguator-multilingual-ai-translation')}</h2>
                <p className='text-justify text-sm/6'>{__('Linguator lets you translate content using AI. You can translate the content of your website using AI.', 'linguator-multilingual-ai-translation')}</p>
                <p className='text-justify text-sm/6'>{__('Turn on AI translation if you need to translate the content of your website using AI. If not, you can leave it off.', 'linguator-multilingual-ai-translation')}</p>

                <div className='flex justify-between items-center p-6 rounded-lg' style={{ border: "1px solid #e5e7eb", marginBottom: "10px" }}>
                    <div className="flex items-center  gap-2">
                      <FcGoogle className='size-5' />
                      <p className="text-sm/6">{__('Google Machine Translation', 'linguator-multilingual-ai-translation')}</p>
                    </div>
                    <Switch
                        aria-label="Google Machine Translation"
                        id="google-machine-translation"
                        onChange={() => { setGoogleMachineTranslation(!googleMachineTranslation) }}
                        value={googleMachineTranslation}
                        size="sm"
                    />
                </div>
                <div className='p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                    <div className='flex justify-between items-center'>
                    <div className="flex items-center  gap-2">
                      <ChromeIcon className="w-4 h-4" />
                      <p className="text-sm/6">{__('Chrome Local AI Translation', 'linguator-multilingual-ai-translation')}</p>
                    </div>
                    <Switch
                        aria-label="Chrome Local AI Translation"
                        id="chrome-local-ai-translation"
                        onChange={() => { setChromeLocalAITranslation(!chromeLocalAITranslation) }}
                        value={chromeLocalAITranslation}
                        size="sm"
                        />
                    </div>
                    {chromeLocalAITranslation && <ChromeLocalAINotice />}
                </div>
            </div>
            <div className='flex justify-between ' style={{ marginTop: "14px" }}>
                <SetupBackButton handleClick={handleBack} />
                <SetupContinueButton SaveSettings={saveAITranslation} />
            </div>
        </div>
    )
}

export default AiTranslation;