import React from 'react'
import { Select, Button } from '@bsf/force-ui'
import { __, sprintf } from '@wordpress/i18n'
import { setupContext } from '../pages/setup-page'
import SetupContinueButton from './setup-continue-button'
import { handle } from '@wordpress/icons'
import { getNonce } from '../utils'
import apiFetch from '@wordpress/api-fetch'
import { toast } from 'sonner'
import { RenderedLanguage } from './languages'
const Default = () => {
  const { setupProgress, setSetupProgress, selectedLanguageData, setSelectedLanguageData, data, setData, showUntranslatedContent, setShowUntranslatedContent, lmat_all_languages } = React.useContext(setupContext) //get context
  
  // Ensure selectedLanguageData is always an array
  const languagesArray = Array.isArray(selectedLanguageData) ? selectedLanguageData : [];
  
  const [defaultLanguage, setDefaultLanguage] = React.useState(languagesArray.find((lang) => lang.locale?.toLowerCase() === data.default_lang) || languagesArray.find((language) => language.is_default) || null)
  let [validLanguages, setValidLanguages] = React.useState(languagesArray.length > 0 ? languagesArray : lmat_all_languages.filter((language) => (language?.name && language?.flag)))
  const originalListLanguages = React.useRef(languagesArray.length > 0 ? languagesArray : lmat_all_languages.filter((language) => (language?.name && language?.flag)))
  const [defaultLoader, setDefaultLoader] = React.useState(false)
  const previousDefaultLanguage = React.useRef(defaultLanguage)
  async function saveDefault() {
    setDefaultLoader(true)
    try {
      if (defaultLanguage === null) {
        throw new Error(__('Please select a default language', 'linguator-multilingual-ai-translation'))
      }
      
      let updatedLanguages = languagesArray;
      
      // First, handle the default language change if needed
      if (previousDefaultLanguage.current !== defaultLanguage) {
        if (languagesArray.length > 0) {
          // Update existing languages - set new default
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
          
          // Get updated languages list from server
          const languageResponse = await apiFetch({
            path: 'lmat/v1/languages',
            method: 'GET',
            'headers': {
              'Content-Type': 'application/json',
              'X-WP-Nonce': getNonce()
            }
          })
          
          // Ensure the response is an array
          updatedLanguages = Array.isArray(languageResponse) ? languageResponse : []
          setSelectedLanguageData(updatedLanguages)
          setData(response)
        } else {
          // No existing languages - create the first one
          const apiBody = { ...defaultLanguage, slug: defaultLanguage.code }
          const languageResponse = await apiFetch({
            path: 'lmat/v1/languages',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': getNonce()
            },
            body: JSON.stringify(apiBody)
          })
          
          // Ensure the response is an array
          updatedLanguages = Array.isArray(languageResponse) ? languageResponse : [languageResponse]
          setSelectedLanguageData(updatedLanguages)
        }
      }
      
      // Then, handle untranslated content assignment if needed
      if (showUntranslatedContent == "1") {
        // Find the language object from the updated languages array
        const languageToAssign = updatedLanguages.find((language) => language.locale === defaultLanguage.locale)
        
        if (languageToAssign) {
          await apiFetch({
            path: 'lmat/v1/languages/assign-language',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': getNonce()
            },
            body: JSON.stringify(languageToAssign)
          })
        }
      }
      
      handleNavigate()
      setShowUntranslatedContent("")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setDefaultLoader(false)
    }
  }
  function handleNavigate() {
    setSetupProgress("languages")
    localStorage.setItem("setupProgress", "languages");
  }
  return (
    <div className='mx-auto p-10 max-w-[600px] min-h-[40vh] bg-white shadow-sm flex flex-col'>
      <div className='flex-grow'>
        <div className='flex-grow'>
          <h2>{__('Default Language', 'linguator-multilingual-ai-translation')}</h2>
          <p className='m-0 text-sm/6'>{__('Set your website’s default language here.', 'linguator-multilingual-ai-translation')}</p>
          <p className='m-0 text-sm/6'>{__('This language will be shown to visitors if their preferred language isn’t available.', 'linguator-multilingual-ai-translation')}</p>
          <Select
            combobox
            onChange={(value) => setDefaultLanguage(value)}
            searchFn={(query) => {
              // Always filter from the original full list to avoid getting stuck
              const filtered = originalListLanguages.current.filter(lang =>
                (lang.name.toLowerCase().includes(query.toLowerCase()) || lang.locale.toLowerCase().includes(query.toLowerCase()) || lang.label.toLowerCase().includes(query.toLowerCase()))
              );
              setValidLanguages(filtered);
            }}
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
                validLanguages.map((language, index) => (
                  <Select.Option
                    key={index}
                    value={language}
                  >
                    {
                      language?.name && language?.flag &&
                      <RenderedLanguage languageName={language?.name} languageFlag={language?.flag} flagUrl={true} languageLocale={language?.locale} />
                    }
                  </Select.Option>
                ))
              }
            </Select.Options>
          </Select>
        </div>
      </div>
      <div className='flex justify-end pt-5'>
        {
          defaultLoader ?
            <SetupContinueButton SaveSettings={() => { }} >
              <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>
              Loading...
            </SetupContinueButton>
            :
            <SetupContinueButton SaveSettings={saveDefault} >{__('Continue', 'linguator-multilingual-ai-translation')}</SetupContinueButton>
        }
      </div>

    </div>
  )
}

export default Default