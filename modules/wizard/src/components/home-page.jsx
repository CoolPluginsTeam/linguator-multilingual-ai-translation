import React, { useState } from 'react'
import SetupContinueButton, { SetupBackButton } from './setup-continue-button'
import { setupContext } from '../pages/setup-page'
import { __, sprintf } from '@wordpress/i18n'
import { RenderedLanguage } from './languages'
import { Star } from 'lucide-react'
import apiFetch from '@wordpress/api-fetch'

const HomePage = () => {
  const { setSetupProgress, selectedLanguageData, homePageLanguage, setHomePageLangauge,showHomePage,setShowHomePage,setupSteps, setSetupSteps } = React.useContext(setupContext) //getting the context 
  const lmat_setup_data = window.lmat_setup //get the localized setup data
  const home_page_language = lmat_setup_data.home_page_data.static_page_language? lmat_setup_data.home_page_data.static_page_language :homePageLanguage[0];
  //conditional select if the user have not translated the static home page then the selected language of untranslated content on the languages page will show up or the user selected language
  let homePageShowLanguage = lmat_setup_data.home_page_data.static_page_languages && lmat_setup_data.home_page_data.static_page_languages?.length > 0 ? lmat_setup_data.home_page_data.static_page_languages : homePageLanguage;
  const [isLoading, setIsLoading] = useState(false) //loading state
  const [error, setError] = useState(null) //error state
  const [continueLoader, setContinueLoader] = useState(false) //continue button

  //function to make api call to translate the static page to all languages
  const createHomePageTranslations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Filter languages that need translation
      const languagesToTranslate = selectedLanguageData.filter(
        lang => !lmat_setup_data.home_page_data.static_page_languages.find(
          existingLang => existingLang.locale === lang.locale
        )
      )

      if (languagesToTranslate.length === 0) {
        return true
      }

      const response = await apiFetch({
        path: '/lmat/v1/languages/create-home-page-translation',
        method: 'POST',
        data: {
          source_id: lmat_setup_data.home_page_data.static_page.ID,
          languages: languagesToTranslate,
          title: lmat_setup_data.home_page_data.static_page.post_title
        }
      })

      if (!response.success) {
        throw new Error('Failed to create translations')
      }
      setShowHomePage("");
      setSetupSteps(setupSteps.filter((steps)=>steps.value !== "home_page"))

      return true
    } catch (err) {
      setError(err.message || 'Failed to create translations')
      return false
    } finally {
      setIsLoading(false)
    }
  }


  //handle back button dynamically
  const handleBack = () => {
    if (lmat_setup_data.media == "1") {
      setSetupProgress("media")
      localStorage.setItem("setupProgress", "media");
    } else {
      setSetupProgress("url")
      localStorage.setItem("setupProgress", "url");
    }
  }

  //handle the save button
  const handleSave = async () => {
    setContinueLoader(true)
    const success = await createHomePageTranslations()
    if (success) {
      setSetupProgress("translation_configuration")
      localStorage.setItem("setupProgress", "translation_configuration");
    }
    setContinueLoader(false)
  }

  return (
    <div className='mx-auto max-w-[600px] p-10 min-h-[40vh] bg-white shadow-sm flex flex-col'>
      <div>
        <h2>{__('Home Page', 'linguator-multilingual-ai-translation')}</h2>
        <p className='m-0 text-sm/6'>{__('You defined this page as your static homepage: ', 'linguator-multilingual-ai-translation')}{lmat_setup_data.home_page_data.static_page.post_title}</p>
        <p className='m-0 text-sm/6 flex items-center gap-2'>{__('Its language is : ', 'linguator-multilingual-ai-translation')}{<RenderedLanguage languageName={home_page_language?.name} languageFlag={home_page_language?.flag} flagUrl={true} languageLocale={home_page_language?.locale} />}</p>
        <p className='m-0 text-sm/6'>{__('For your site to work correctly, this page must be translated in all available languages.', 'linguator-multilingual-ai-translation')}</p>
        <p className='text-sm/6'>{__('After the pages is created, it is up to you to put the translated content in each page linked to each language.', 'linguator-multilingual-ai-translation')}</p>

        <h4 className='mb-0 mt-5' style={{paddingBottom: "6px"}}>{__('Your static homepage is already translated in', 'linguator-multilingual-ai-translation')}</h4>
        {
          homePageShowLanguage.map((language, index) => {
            // Check if this language is also selected as default in current setup
            const isCurrentlySelectedDefault = selectedLanguageData.find(
              selected => selected.locale === language.locale && selected.is_default
            );
            
            return (
              <p className='m-0 flex items-center gap-2' key={index} style={{paddingBottom: "4px"}}>
                <RenderedLanguage languageName={language?.name} languageFlag={language?.flag} flagUrl={true} languageLocale={language?.locale} />
                {
                  isCurrentlySelectedDefault &&
                  <span className='flex items-center'>
                    ★ (Default Language)
                  </span>
                }
              </p>
            )
          })
        }

        <h4 className='mb-0 mt-5' style={{paddingBottom: "6px"}}>{__('We are going to prepare this page in', 'linguator-multilingual-ai-translation')}</h4>
        <div className='mb-5'>
          {
            selectedLanguageData.map((language, index) => (
              !homePageShowLanguage.find((language) => language?.locale === selectedLanguageData[index]?.locale) &&
              <div className='flex gap-6 items-center' key={index} style={{paddingBottom: "6px"}}>
                <RenderedLanguage languageName={language?.name} languageFlag={language?.flag} flagUrl={true} languageLocale={language?.locale} />
                {
                  language.is_default &&
                  <span className='flex items-center'>
                    ★ (Default Language)
                  </span>
                }
              </div>
            ))
          }
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className='flex justify-between' style={{ marginTop: "14px" }}>
        <SetupBackButton handleClick={handleBack} disabled={isLoading} />
        {
          continueLoader ?
            <SetupContinueButton SaveSettings={() => { }} >
              <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>
              Loading...
            </SetupContinueButton>
            :
            <SetupContinueButton
              SaveSettings={handleSave}
              disabled={isLoading}
              loading={isLoading}
            />
        }

      </div>
    </div>
  )
}

export default HomePage