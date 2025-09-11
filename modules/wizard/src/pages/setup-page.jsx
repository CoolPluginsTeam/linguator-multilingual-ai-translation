import React from 'react'
import SetupProgress from '../components/SetupProgress'
import { LoaderPinwheel } from "lucide-react"
import { RenderedLanguage } from '../components/Languages'
import { Loader, Dialog, Button } from "@bsf/force-ui"
import apiFetch from "@wordpress/api-fetch"
import { __ } from '@wordpress/i18n'
import { getNonce } from '../../../../Admin/Settings/Views/src/utils'
import { Toaster, toast } from 'sonner'

export const setupContext = React.createContext(null)
const SetupPage = () => {
  const [setupSteps, setSetupSteps] = React.useState([])  // Initialize as empty array
  const [loading, setLoading] = React.useState(true) // Loader state tracker
  const [selectedLanguageData, setSelectedLanguageData] = React.useState(window.lmat_setup.languages) //Store Selected Language state in database
  const [selectedLanguage, setSelectedLanguage] = React.useState({ id: 'none', name: 'None', flag: null, locale: null }) //Selected Langugae from dropdown of Languages tab
  const [currentSelectedLanguage, setCurrentSelectedLanguage] = React.useState([]) //get the current selected language in the languages tab: it will be multiple language so its an array
  const [data, setData] = React.useState([]) // General Settings Data
  const [setupProgress, setSetupProgress] = React.useState("languages") //Track Setup Progress
  const [languageDialog, setLanguageDialog] = React.useState(false) // handle open and close of Language Dialog
  const [homePageLanguage, setHomePageLangauge] = React.useState([]) //carry the home page language
  const [LanguageLoader, setLanguageLoader] = React.useState(false) // Loader in the continue button on languages tab
  const lmat_setup_data = window.lmat_setup; //get the localized setup data
  const [showUntranslatedContent, setShowUntranslatedContent] = React.useState(lmat_setup_data.untranslated_contents) // state for the condotion weather to show or not the content without language in the Languages tab
  const [showHomePage,setShowHomePage] = React.useState(lmat_setup_data.home_page) //state for the condition weather to show home_page data or not
  const [languageDeleteConfirmer, setLanguageDeleteConfirmer] = React.useState(false)
  const [languageToDelete, setLanguageToDelete] = React.useState({ id: 'none', name: 'None', flag: null, locale: null })
  const [contentSelectedLanguage, setContentSelectedLanguage] = React.useState(null) // Add missing content selected language state
  const [languageAddLoader, setLanguageAddLoader] = React.useState(false)
  const [languageDeleteLoader, setLanguageDeleteLoader] = React.useState(false)

  //turning all languages into array format from object format
  let lmat_all_languages = [];
  for (const key in lmat_setup_data.all_languages) {
    lmat_all_languages.push(lmat_setup_data.all_languages[key])
  }
  lmat_all_languages = lmat_all_languages.sort((a, b) => {
    return a.code.localeCompare(b.code);
  });


  React.useEffect(() => {
    //Handle which tab to go according to reload and redirt from other page
    if (localStorage.getItem("setupProgress") && performance.getEntriesByType("navigation")[0].type === "reload") {
      let setup = localStorage.getItem("setupProgress")
      if (lmat_setup_data[setup] === "1") {
        setSetupProgress((localStorage.getItem("setupProgress")))
      } else if (localStorage.getItem("setupProgress") === "ready" || localStorage.getItem("setupProgress") === "default" || localStorage.getItem("setupProgress") === "url" || localStorage.getItem("setupProgress") === "translation_configuration") {
        setSetupProgress(localStorage.getItem("setupProgress"))
      }
      else {
        localStorage.setItem("setupProgress", "languages");
      }
    } else {
      const setupProgress=localStorage.getItem("setupProgress");

      if(setupProgress && setupProgress === 'translation_configuration'){
        setSetupProgress(setupProgress);
      }else{
        localStorage.setItem("setupProgress", "languages");
      }

    }


    async function serverCall() {


      //API call to get general settings data
      const responseData = await apiFetch({
        path: 'lmat/v1/settings',
        method: 'GET',
        'headers': {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce()
        }
      })

      setData(responseData)
      setLoading(false)

    }
    serverCall()
  }, [])

  //Handle Yes button on the Dialog Box
  const handleLanguageAdd = async () => {
    setLanguageAddLoader(true)
    try {
      let languageResponse = {
        created: [],
        errors: []
      }
      let apiBody = [];
      apiBody = [{ ...selectedLanguage, slug: selectedLanguage.code }]

      for (let apicalls = 0; apicalls < currentSelectedLanguage.length; apicalls++) {
        apiBody.push({ ...currentSelectedLanguage[apicalls], slug: currentSelectedLanguage[apicalls].code })
      }
      languageResponse = await apiFetch({
        path: 'lmat/v1/languages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce()
        },
        body: JSON.stringify(apiBody)
      })

      languageResponse.created.forEach((item) => {
        setSelectedLanguageData(prev => [...prev, item])
      })
      setCurrentSelectedLanguage([])

      if (languageResponse.created.length > 0) {
        languageResponse.created.forEach((item) => {
          toast.success(`${item.name} added successfully`)
        })
      }

      if (languageResponse.errors.length > 0) {
        languageResponse.errors.forEach((item) => {
          toast.error(`Please try again in some time to add ${item.language} `)
        })
      }

      setLanguageDialog(false)
      setSelectedLanguage({ id: 'none', name: __('None', 'linguator-multilingual-ai-translation'), flag: null, locale: null })
      setLanguageLoader(false)
      //Dynamic routing of next button accordingly
      handleNavigate()
      setLanguageAddLoader(false)

    } catch (error) {
      setLanguageAddLoader(false)
      setLanguageLoader(false)
      toast.error("please try again later")
    }
  }

  //Handle No button in the Dialog Box
  const handleLanguageDontAdd = async () => {
    setLanguageAddLoader(true)
    if (currentSelectedLanguage.length > 0) {
      try {
        let languageResponse = {
          created: [],
          errors: []
        }
        let apiBody = [];

        for (let apicalls = 0; apicalls < currentSelectedLanguage.length; apicalls++) {
          apiBody.push({ ...currentSelectedLanguage[apicalls], slug: currentSelectedLanguage[apicalls].code })
        }
        languageResponse = await apiFetch({
          path: 'lmat/v1/languages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': getNonce()
          },
          body: JSON.stringify(apiBody)
        })

        languageResponse.created.forEach((item) => {
          setSelectedLanguageData(prev => [...prev, item])
        })
        setCurrentSelectedLanguage([])

        if (languageResponse?.created?.length > 0) {
          let languagesSuccessToast = '';
          languageResponse.created.forEach((item) => {
            languagesSuccessToast += item?.name + ', ';
          })
          toast.success(`${languagesSuccessToast} added successfully`)
        }

        if (languageResponse?.errors?.length > 0) {
          let languagesErrorToast = '';
          languageResponse.errors.forEach((item) => {
            languagesErrorToast += item?.name + ', ';
          })
          throw new Error(`Please try again in some time to add ${languagesErrorToast} `)
        }

        setLanguageDialog(false)
        setSelectedLanguage({ id: 'none', name: __('None', 'linguator-multilingual-ai-translation'), flag: null, locale: null })
        setLanguageLoader(false)
        setShowUntranslatedContent("")
        handleNavigate()

        setLanguageLoader(false)
      } catch (error) {
        toast.error("please try again later");
      }
    }
    else if (selectedLanguageData.length > 0) {
      //Dynamic routing of next button accordingly
      setLanguageDialog(false)
      setSelectedLanguage({ id: 'none', name: __('None', 'linguator-multilingual-ai-translation'), flag: null, locale: null })
      setLanguageLoader(false)
      handleNavigate()
    } else {
      setLanguageLoader(false)
      toast.error("You need to add a language to continue")
    }
    setLanguageAddLoader(false)
  }

  function handleNavigate() {
    setSetupProgress("default")
    localStorage.setItem("setupProgress", "default");
  }

  async function handleLanguageDelete() {
    setLanguageDeleteLoader(true)
    try {
      const responseData = await apiFetch({
        path: 'lmat/v1/languages/' + languageToDelete.term_id,
        method: 'DELETE',
        'headers': {
          'Content-Type': 'application/json',
          'X-WP-Nonce': getNonce()
        }
      })
      let temp_selected_language = selectedLanguageData.filter((language) => language.term_id !== languageToDelete.term_id);
      setSelectedLanguageData(temp_selected_language)
      if (temp_selected_language.length === 0) {
        setShowUntranslatedContent("1")
      }
      toast.success(`${languageToDelete.name} deleted successfully`)
    } catch (error) {
      toast.error("please try again later")
    }
    setLanguageDeleteLoader(false)
    setLanguageDeleteConfirmer(false)

  }
  return (
    <setupContext.Provider value={{ setupSteps, setSetupSteps,loading, data, setData, selectedLanguageData, setSelectedLanguageData, setupProgress, setSetupProgress, setLanguageDialog, selectedLanguage, setSelectedLanguage, lmat_all_languages, currentSelectedLanguage, setCurrentSelectedLanguage, homePageLanguage, setHomePageLangauge, LanguageLoader, setLanguageLoader, showUntranslatedContent, setShowUntranslatedContent, languageDeleteConfirmer, setLanguageDeleteConfirmer, languageToDelete, setLanguageToDelete, contentSelectedLanguage, setContentSelectedLanguage,showHomePage,setShowHomePage }}>
      <div className='bg-background-secondary m-0 pt-4 setup-body'>
        <Dialog
          design="simple"
          exitOnEsc
          scrollLock
          open={languageDialog}
          setOpen={() => { }}
          trigger={<></>}
        >
          <Dialog.Backdrop />
          <Dialog.Panel>
            <Dialog.Header>
              <div className="flex items-center justify-between">
                <Dialog.Title>
                  {__("A language wasn't added.", "linguator-multilingual-ai-translation")}
                </Dialog.Title>
                <Dialog.CloseButton onClick={() => { setLanguageDialog(false); setLanguageLoader(false); setLanguageAddLoader(false) }} />
              </div>
              <Dialog.Description>
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <div className="m-0 text-text-secondary">
                <p> {__("You selected", "linguator-multilingual-ai-translation")} {selectedLanguage && <RenderedLanguage languageName={selectedLanguage.name} languageFlag={selectedLanguage.flag} flagUrl={false} languageLocale={selectedLanguage.locale} />}{__(", but you didn't add it to the list before continuing to the next step.", "linguator-multilingual-ai-translation")}</p>
                <p>{__("Do you want to add this language before continuing to the next step?", "linguator-multilingual-ai-translation")}</p>
                <ul>
                  <li>{__("Yes: add this language and continue to the next step", "linguator-multilingual-ai-translation")}</li>
                  {(selectedLanguageData.length > 0 || currentSelectedLanguage.length > 0) && <li>{__("No: don't add this language and continue to the next step", "linguator-multilingual-ai-translation")} </li>}
                  <li>{__("Ignore: stay at this step", "linguator-multilingual-ai-translation")}</li>
                  {selectedLanguageData.length === 0 && currentSelectedLanguage.length === 0 && <li>{__("Note: You cannot continue this page without adding a language")} </li>}
                </ul>
              </div>
            </Dialog.Body>
            <Dialog.Footer className='flex justify-end gap-3'>
              {
                languageAddLoader ?
                  <Button>
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                  </Button> :
                  <Button onClick={handleLanguageAdd}>
                    {__("Yes", "linguator-multilingual-ai-translation")}
                  </Button>
              }
              {
                (selectedLanguageData.length > 0 || currentSelectedLanguage.length > 0) &&
                <Button variant='outline' onClick={handleLanguageDontAdd}>
                  {__("No", "linguator-multilingual-ai-translation")}
                </Button>
              }
              <Button variant='secondary' onClick={() => { setLanguageDialog(false); setLanguageLoader(false); setLanguageAddLoader(false) }}>
                {__("Ignore", "linguator-multilingual-ai-translation")}
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
        <Dialog
          design="simple"
          exitOnEsc
          scrollLock
          open={languageDeleteConfirmer}
          setOpen={() => { }}
          trigger={<></>}
        >
          <Dialog.Backdrop />
          <Dialog.Panel>
            <Dialog.Header>
              <div className="flex items-center justify-between">
                <Dialog.Title>
                  {__("Delete Language", "linguator-multilingual-ai-translation")}
                </Dialog.Title>
                <Dialog.CloseButton onClick={() => { setLanguageDeleteConfirmer(false) }} />
              </div>
              <Dialog.Description>
                {__("On Confirmation, ", "linguator-multilingual-ai-translation")}<RenderedLanguage languageName={languageToDelete.name} languageFlag={languageToDelete.flag} flagUrl={true} languageLocale={languageToDelete.locale} /> {__(" will be deleted. ", "linguator-multilingual-ai-translation")}
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body className='flex justify-center items-center gap-3'>
              {
                languageDeleteLoader?
                <Button>
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                  </Button>:
                  <Button onClick={handleLanguageDelete}>
                {__("Yes", "linguator-multilingual-ai-translation")}
              </Button>
              }
              
              {
                <Button variant='outline' onClick={() => { setLanguageDeleteConfirmer(false); }}>
                  {__("No", "linguator-multilingual-ai-translation")}
                </Button>
              }
            </Dialog.Body>
            <Dialog.Footer className='flex justify-end gap-3'>

            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
        <Toaster richColors position="top-right" />
        {
          loading ?
            <div className='flex justify-center gap-4 items-center min-h-[100vh]'>
              <h1>
                <Loader
                  className=""
                  icon={<LoaderPinwheel className="animate-spin" />}
                  size="md"
                  variant="primary"
                /></h1> <h1 className='m-0'>{__("Loading", "linguator-multilingual-ai-translation")}</h1>
            </div> :
            <>
              <h1 style={{paddingTop: "30px"}} className='bg-background-secondary text-center m-0'>{__("Linguator - AI Multilingual Translation", "linguator-multilingual-ai-translation")}</h1>
              <SetupProgress lmat_setup_data={lmat_setup_data} />
            </>
        }

      </div>
    </setupContext.Provider>
  )
}

export default SetupPage