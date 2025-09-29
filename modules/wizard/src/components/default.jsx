import React from 'react'
import { Select, Button } from '@bsf/force-ui'
import { __, sprintf } from '@wordpress/i18n'
import { setupContext } from '../pages/setup-page'
import SetupContinueButton, { SetupBackButton } from './setup-continue-button'
import { handle } from '@wordpress/icons'
import { getNonce } from '../utils'
import apiFetch from '@wordpress/api-fetch'
import { toast } from 'sonner'
import { RenderedLanguage } from './languages'
const Default = () => {
  const { setupProgress, setSetupProgress, selectedLanguageData,setSelectedLanguageData, data, setData, showUntranslatedContent, setShowUntranslatedContent } = React.useContext(setupContext) //get context
  const [defaultLanguage, setDefaultLanguage] = React.useState(selectedLanguageData.find((lang) => lang.locale?.toLowerCase() === data.default_lang) || selectedLanguageData.find((language) => language.is_default) || null)
  const [contentSelectedLanguage, setContentSelectedLanguage] = React.useState(selectedLanguageData.find((language) => language.is_default));
  const [defaultLoader,setDefaultLoader] = React.useState(false)
  const previousDefaultLanguage = React.useRef(defaultLanguage)
  async function saveDefault() {
    setDefaultLoader(true)
    try {
      if (defaultLanguage === null) {
        throw new Error(__('Please select a default language', 'linguator-multilingual-ai-translation'))
      }
      if (previousDefaultLanguage.current !== defaultLanguage) {
        const apiBody = {
          default_lang: defaultLanguage.slug
        }
        const response = await apiFetch({
          path: 'lmat/v1/settings',
          method: 'POST',
          'headers': {
            'Content-Type': 'application/json',
            'X-WP-Nonce': getNonce()
          },
          body: JSON.stringify(apiBody)
        })
        const languageResponse = await apiFetch({
          path: 'lmat/v1/languages',
          method: 'GET',
          'headers': {
            'Content-Type': 'application/json',
            'X-WP-Nonce': getNonce()
          }
        })
        setSelectedLanguageData(languageResponse)
        setData(response)
      }
      if (showUntranslatedContent == "1") {
        await apiFetch({
          path: 'lmat/v1/languages/assign-language',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': getNonce()
          },
          body: JSON.stringify(contentSelectedLanguage)
        })
      }
      handleNavigate()

      setShowUntranslatedContent("")
    } catch (error) {
      toast.error(error.message)
    }finally{
      setDefaultLoader(false)
    }
  }
  function handleNavigate() {
    setSetupProgress("url")
    localStorage.setItem("setupProgress", "url");
  }
  return (
    <div className='mx-auto p-10 max-w-[600px] min-h-[40vh] bg-white shadow-sm flex flex-col'>
      <div className='flex-grow'>
        <div className='flex-grow'>
          <h2>{__('Default Language', 'linguator-multilingual-ai-translation')}</h2>
          <p className='m-0 text-sm/6'>{__('Set your website’s default language here.', 'linguator-multilingual-ai-translation')}</p>
          <p className='m-0 text-sm/6'>{__('This language will be shown to visitors if their preferred language isn’t available.', 'linguator-multilingual-ai-translation')}</p>
          <p className='m-0 text-sm/6 mb-4'>{__('You can change the default anytime in the settings.', 'linguator-multilingual-ai-translation')}</p>
          <Select
            onChange={(value) => setDefaultLanguage(value)}
            value={defaultLanguage}
            size="md"
            by="locale"
          >
            <Select.Button
              label={__("Choose the language to be assigned", 'linguator-multilingual-ai-translation')}
              placeholder={__("Select an option", 'linguator-multilingual-ai-translation')}
              render={() => <RenderedLanguage languageName={defaultLanguage?.name} languageFlag={defaultLanguage?.flag} flagUrl={true} languageLocale={defaultLanguage?.locale} />}
            />
            <Select.Options>
              {
                selectedLanguageData?.length > 0 && selectedLanguageData.map((language, index) => (
                  <Select.Option
                    key={index}
                    value={language}
                  >
                    <RenderedLanguage languageName={language?.name} languageFlag={language?.flag} flagUrl={true} languageLocale={language?.locale} />
                  </Select.Option>
                ))
              }
            </Select.Options>
          </Select>
        </div>

        {
          showUntranslatedContent == "1" &&
          <div className='flex-grow'>
            <h2>{__('Content without language', 'linguator-multilingual-ai-translation')}</h2>
            <p className='m-0 text-sm/6'>{__('There are posts, pages, categories or tags without language.', 'linguator-multilingual-ai-translation')}</p>
            <p className='m-0 text-sm/6'>{__('For your site to work correctly, you need to assign a language to all your contents.', 'linguator-multilingual-ai-translation')}</p>
            <p className='mt-0 text-sm/6 mb-4'>{__('The selected language below will be applied to all your content without an assigned language.', 'linguator-multilingual-ai-translation')}</p>
            <Select
              onChange={(value) => setContentSelectedLanguage(value)}
              value={contentSelectedLanguage}
              size="md"
              by="locale"
            >
              <Select.Button
                label={__("Choose the language to be assigned", 'linguator-multilingual-ai-translation')}
                placeholder={__("Select an option", 'linguator-multilingual-ai-translation')}
                render={() => <RenderedLanguage languageName={contentSelectedLanguage?.name} languageFlag={contentSelectedLanguage?.flag} flagUrl={true} languageLocale={contentSelectedLanguage?.locale} />}
              />
              <Select.Options>
                {
                  selectedLanguageData?.length > 0 && selectedLanguageData.map((language, index) => (
                    <Select.Option
                      key={index}
                      value={language}
                    >
                      <RenderedLanguage languageName={language?.name} languageFlag={language?.flag} flagUrl={true} languageLocale={language?.locale} />
                    </Select.Option>
                  ))
                }
              </Select.Options>
            </Select>
          </div>
        }
      </div>
      <div className='flex justify-between ' style={{ marginTop: "14px" }}>
        <SetupBackButton handleClick={() => {setSetupProgress("languages");localStorage.setItem("setupProgress", "languages")}} />
          {
          defaultLoader?
            <SetupContinueButton SaveSettings={() => { }} >
              <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>
              Loading...
            </SetupContinueButton>
            :
            <SetupContinueButton SaveSettings={saveDefault} />
        }
        
      </div>

    </div>
  )
}

export default Default