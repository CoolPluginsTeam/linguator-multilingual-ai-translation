import { setupContext } from "../pages/SetupPage"
import SetupContinueButton, { SetupBackButton } from './SetupContinueButton'
import { getNonce } from '../utils'
import apiFetch from '@wordpress/api-fetch'
import { toast } from 'sonner'
import { __, sprintf } from '@wordpress/i18n'
import React from 'react'
import { Switch } from '@bsf/force-ui'

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
  
    return (
      <div
        className="flex flex-col gap-4 p-6 rounded-lg"
        style={{ border: "1px solid #e5e7eb", background: "#fff5f5" }}
      >
        {showBrowserNotice && (
          <div className="text-red-600 text-sm leading-6">
            <h3 className="font-semibold">{__('⚠️ Important Notice: Browser Compatibility', 'linguator-multilingual-ai-translation')}</h3>
            <ul className="list-disc ml-5 mt-2">
              <li>
                {sprintf(__('The <strong>Translator API</strong>, which uses Chrome Local AI Models, is designed exclusively for use with the <strong>Google Chrome browser</strong>.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>', '<strong>', '</strong>')}
              </li>
              <li>
                {sprintf(__('If you are using a different browser (such as Edge, Firefox, or Safari), the API may not function correctly.', 'linguator-multilingual-ai-translation'))}
              </li>
              <li>
                {sprintf(__('Learn more in the <a href="%s" target="_blank" rel="noreferrer" class="underline text-blue-600">official documentation</a>.', 'linguator-multilingual-ai-translation'), 'https://developer.chrome.com/docs/ai/translator-api')}
              </li>
            </ul>
          </div>
        )}
  
        {showSecureNotice && (
          <div className="text-red-600 text-sm leading-6">
            <h3 className="font-semibold">⚠️ Important Notice: Secure Connection Required</h3>
            <ul className="list-disc ml-5 mt-2">
              <li>
                {sprintf(__('The <strong>Translator API</strong> requires a secure (HTTPS) connection to function properly.', 'linguator-multilingual-ai-translation'), '<strong>', '</strong>')}
              </li>
              <li>
                {__('If you are on an insecure connection (HTTP), the API will not work.', 'linguator-multilingual-ai-translation')}
              </li>
            </ul>
            <p className="mt-2">{__('👉 How to Fix This:', 'linguator-multilingual-ai-translation')}</p>
            <ol className="list-decimal ml-5 mt-2">
              <li>{sprintf(__('Switch to a secure connection by using %shttps://%s.', 'linguator-multilingual-ai-translation'), '<code>', '</code>')}
              </li>
              <li>
                {sprintf(__('Alternatively, add this URL to Chrome’s list of insecure origins treated as secure: %schrome://flags/#unsafely-treat-insecure-origin-as-secure%s.', 'linguator-multilingual-ai-translation'), '<code>', '</code>')}
                <br />
                {sprintf(__('Copy and paste this link into your Chrome address bar: %schrome://flags/#unsafely-treat-insecure-origin-as-secure%s.', 'linguator-multilingual-ai-translation'), '<code>', '</code>')}
                <br />
                {__('Click on the URL to copy it, then open a new window and paste this URL to access the settings.', 'linguator-multilingual-ai-translation')}
              </li>
            </ol>
          </div>
        )}

        {showApiNotice && (
          <div className="text-red-600 text-sm leading-6">
            <h3 className="font-semibold">⚠️ Important Notice: API Availability</h3>
            <p>{__('The Translator API is not available in your browser. Please try again with a different browser.', 'linguator-multilingual-ai-translation')}</p>
            <p>{sprintf(__('Learn more in the <a href="%s" target="_blank" rel="noreferrer" class="underline text-blue-600">official documentation</a>.', 'linguator-multilingual-ai-translation'), 'https://developer.chrome.com/docs/ai/translator-api')}</p>
          </div>
        )}
      </div>
    );
};

const AiTranslation = () => {
    const { setSetupProgress, data, setData } = React.useContext(setupContext) // get the context
    const aiTranslation = data?.ai_translation_configuration; //store the media option
    const provider = aiTranslation?.provider;
    const [googleMachineTranslation, setGoogleMachineTranslation] = React.useState(provider?.google)
    const [chromeLocalAITranslation, setChromeLocalAITranslation] = React.useState(provider?.chrome_local_ai)
    const [lastUpdatedValue, setLastUpdatedValue] = React.useState({googleMachineTranslation,chromeLocalAITranslation})

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
                                google_machine_translation: googleMachineTranslation
                            }
                        }
                    })
                })
                setLastUpdatedValue({googleMachineTranslation,chromeLocalAITranslation})
                setData(AITranslationResponse)
            }

            //Dynamically move to next page
            setSetupProgress("ready")
            localStorage.setItem("setupProgress", "ready");
        } catch (error) {
            toast.error(__("Please try again later", "linguator-multilingual-ai-translation"))
        }
    }
    return (
        <div className='mx-auto p-10 max-w-[600px] min-h-[40vh] bg-white shadow-sm flex flex-col'>
            <div className='flex-grow'>
                <h2>{__('AI Translation', 'linguator-multilingual-ai-translation')}</h2>
                <p className='text-justify text-sm/6'>{__('Linguator lets you translate content using AI. You can translate the content of your website using AI. You can translate the content of your website using AI.', 'linguator-multilingual-ai-translation')}</p>
                <p className='text-justify text-sm/6'>{__('Turn on AI translation if you need to translate the content of your website using AI. If not, you can leave it off.', 'linguator-multilingual-ai-translation')}</p>

                <div className='flex justify-between items-center p-6 rounded-lg' style={{ border: "1px solid #e5e7eb", marginBottom: "10px" }}>
                    <p className="text-sm/6">{__('Enable Chrome Local AI Translation', 'linguator-multilingual-ai-translation')}</p>
                    <Switch
                        aria-label="AI Translation"
                        id="google-machine-translation"
                        onChange={() => { setGoogleMachineTranslation(!googleMachineTranslation) }}
                        value={googleMachineTranslation}
                        size="sm"
                    />
                </div>
                <div className='flex justify-between items-center p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                    <p className="text-sm/6">{__('Enable Google Machine Translation', 'linguator-multilingual-ai-translation')}</p>
                    <Switch
                        aria-label="AI Translation"
                        id="chrome-local-ai-translation"
                        onChange={() => { setChromeLocalAITranslation(!chromeLocalAITranslation) }}
                        value={chromeLocalAITranslation}
                        size="sm"
                    />
                    {chromeLocalAITranslation && <ChromeLocalAINotice />}
                </div>
            </div>
            <div className='flex justify-between ' style={{ marginTop: "14px" }}>
                <SetupBackButton handleClick={() => { setSetupProgress("url"); localStorage.setItem("setupProgress", "url"); }} />
                <SetupContinueButton SaveSettings={saveAITranslation} />
            </div>
        </div>
    )
}

export default AiTranslation;