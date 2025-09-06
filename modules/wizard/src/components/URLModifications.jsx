import React from 'react'
import { Badge, Accordion, Button, Checkbox, Container, Input, Label, RadioButton, Switch } from '@bsf/force-ui'
import { __, sprintf } from '@wordpress/i18n'
import { setupContext } from '../pages/SetupPage'
import { toast } from 'sonner'
import apiFetch from '@wordpress/api-fetch'
import { getNonce } from '../utils'
import SetupContinueButton, { SetupBackButton } from './SetupContinueButton'
const URLModifications = () => {
  const { loading, setupProgress, setSetupProgress, data, setData } = React.useContext(setupContext) // get the context
  const [forceLang, setForceLang] = React.useState(data.force_lang)
  const [hideDefault, setHideDefault] = React.useState(data.hide_default)
  const [rewrite, setRewrite] = React.useState(data.rewrite)
  const [domains, setDomains] = React.useState([])
  const [urlLoader, setUrlLoader] = React.useState(false)
  const currentDomain = window.lmat_setup.home_url; // Fetch the current domain of website
  React.useEffect(() => {

    let newDomains = window.lmat_setup.languages.map((item) => {
      const code = item.slug;
      return {
        value: data?.domains?.[code] || "",
        name: `${item.name}-${item.locale}`,
        code: code
      };
    });
    setDomains(newDomains);
  }, [data]);

  async function saveUrl() {
    setUrlLoader(true)
    try {
      if ((forceLang !== data.force_lang || hideDefault !== data.hide_default || rewrite !== data.rewrite) && forceLang !== 3) {
        let apiBody;
        if (forceLang === 3) {
          let final_domain = {};
          domains.forEach(domain => {
            if (domain.value.includes("http://") || domain.value.includes("https://")) {
              final_domain[domain.code] = domain.value;
            } else {
              throw new Error(__("Please enter valid URLs", "linguator-multilingual-ai-translation"))
            }

          });
          //API Body
          apiBody = {
            hide_default: hideDefault,
            browser: forceLang === 3 ? false : true,
            force_lang: forceLang,
            rewrite: rewrite,
            domains: final_domain,
          }
        } else {
          apiBody = {
            hide_default: hideDefault,
            browser: forceLang === 3 ? false : true,
            force_lang: forceLang,
            rewrite: rewrite,
          }
        }
        //API Call
        const response = await apiFetch({
          path: 'lmat/v1/settings',
          method: 'POST',
          'headers': {
            'Content-Type': 'application/json',
            'X-WP-Nonce': getNonce()
          },
          body: JSON.stringify(apiBody)
        })
        setData(prev => ({ ...prev, ...response }))
        handleNavigate()
      } else {
        handleNavigate()
      }
    } catch (error) {
      if (error.message.includes(__("Please enter valid URLs", "linguator-multilingual-ai-translation"))) {
        toast.warning(error.message)
      } else if (error.message.includes(__("Linguator was unable to access", "linguator-multilingual-ai-translation"))) {
        toast.error(error.message)
      }
      else {
        toast.error(__("Something went wrong", "linguator-multilingual-ai-translation"))
      }
    } finally {
      setUrlLoader(false)
    }

  }

  function handleNavigate() {
    if (window.lmat_setup.media == "1") {
      setSetupProgress("media")
      localStorage.setItem("setupProgress", "media");
    }
    else if (window.lmat_setup.home_page == "1") {
      setSetupProgress("home_page")
      localStorage.setItem("setupProgress", "home_page");
    } else {
      setSetupProgress("translation_configuration")
      localStorage.setItem("setupProgress", "translation_configuration");
    }
  }

  //label and descriptions of URL modifications
  const urlCheckboxes = [{
    description: sprintf(__('Example1: %s/en/my-post', 'linguator-multilingual-ai-translation'), currentDomain),
    description2: sprintf(__('Example2: %s/hi/my-post', 'linguator-multilingual-ai-translation'), currentDomain),
    heading: __("Different languages in directories", 'linguator-multilingual-ai-translation'),
    value: 1
  }, {

    description: sprintf(__('Example1: %sen.%s/my-post', 'linguator-multilingual-ai-translation'), currentDomain.match(/^https?:\/\//)[0], currentDomain.replace(/^https?:\/\//, '')),
    description2: sprintf(__('Example2: %shi.%s/my-post', 'linguator-multilingual-ai-translation'), currentDomain.match(/^https?:\/\//)[0], currentDomain.replace(/^https?:\/\//, '')),
    heading: __("The language is set from the subdomain name ", 'linguator-multilingual-ai-translation'),
    value: 2
  }, {
    description: '',
    description2: '',
    heading: __("A different domain per language", 'linguator-multilingual-ai-translation'),
    value: 3
  }]

  const directoryNamesLinks = [{
    description: sprintf(__('Example: %s/en/', 'linguator-multilingual-ai-translation'), currentDomain),
    heading: __("Remove /language/ in pretty permalinks", 'linguator-multilingual-ai-translation'),
    value: true
  }, {
    description: sprintf(__('Example: %s/language/en', 'linguator-multilingual-ai-translation'), currentDomain),
    heading: __("Keep /language/ in pretty permalinks", 'linguator-multilingual-ai-translation'),
    value: false
  },]
  return (
    <>

      {
        loading ?
          <>Loading...</>
          :
          <div className='mx-auto p-10 max-w-[600px] min-h-[40vh] bg-white shadow-sm flex flex-col'>
            <div className='flex-grow'>
              <h2>{__("Format your site's URL", 'linguator-multilingual-ai-translation')}</h2>
              <p className='text-justify text-sm/6'>{__('Linguator lets you display different languages using domains, directories, or URL parameters, while all content is managed in a single WordPress database. This gives visitors a seamless multilingual experience.', 'linguator-multilingual-ai-translation')}</p>
              <div className='flex justify-between items-center p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                <Container >
                  <Container.Item>
                    <RadioButton.Group
                      columns={1}
                      size="sm">
                      <RadioButton.Button
                        badgeItem={<Badge className="mr-2" size="sm" type="rounded" variant="green" />}
                        label={{
                          description: (
                            <>
                              {urlCheckboxes[0].description}
                              {urlCheckboxes[0].description2 && (
                                <>
                                  <br />
                                  {urlCheckboxes[0].description2}
                                </>
                              )}
                            </>
                          ),
                          heading: urlCheckboxes[0].heading
                        }}
                        reversePosition={true}
                        value={urlCheckboxes[0].value}
                        checked={forceLang === urlCheckboxes[0].value}
                        onChange={() => {
                          setForceLang(urlCheckboxes[0].value);
                        }}
                      />
                      <div style={{paddingLeft: '33px'}}>
                      {
                        forceLang === 1 &&
                        <Checkbox
                          label={{
                            heading: __('Hide URL language information for default language', 'linguator-multilingual-ai-translation')
                          }}
                          size="sm"
                          className='cursor-pointer'
                          checked={hideDefault}
                          onChange={() => {
                            setHideDefault(!hideDefault);
                          }}
                        />
                      }
                      {
                      forceLang === 1 &&
                      <RadioButton.Group
                        columns={1}
                        size="sm">
                        {
                          directoryNamesLinks.map((checkbox, index) => (
                            <RadioButton.Button
                              badgeItem={<Badge className="mr-2" size="sm" type="rounded" variant="green" />}
                              label={{
                                description: checkbox.description,
                                heading: checkbox.heading
                              }}
                              reversePosition={true}
                              value={checkbox.value}
                              key={index}
                              checked={rewrite === checkbox.value}
                              onChange={() => {
                                setRewrite(checkbox.value);
                              }}
                            />
                          ))
                        }
                      </RadioButton.Group>
                    }
                      </div>
                      <RadioButton.Button
                        badgeItem={<Badge className="mr-2" size="sm" type="rounded" variant="green" />}
                        label={{
                          description: (
                            <>
                              {urlCheckboxes[1].description}
                              {urlCheckboxes[1].description2 && (
                                <>
                                  <br />
                                  {urlCheckboxes[1].description2}
                                </>
                              )}
                            </>
                          ),
                          heading: urlCheckboxes[1].heading
                        }}
                        reversePosition={true}
                        value={urlCheckboxes[1].value}
                        checked={forceLang === urlCheckboxes[1].value}
                        onChange={() => {
                          setForceLang(urlCheckboxes[1].value);
                        }}
                      />
                      <div style={{paddingLeft: '33px'}}>
                      {
                        forceLang === 2 &&
                        <Checkbox
                          label={{
                            heading: __('Hide URL language information for default language', 'linguator-multilingual-ai-translation')
                          }}
                          size="sm"
                          className='cursor-pointer'
                          checked={hideDefault}
                          onChange={() => {
                            setHideDefault(!hideDefault);
                          }}
                        />
                      }
                      </div>
                      <RadioButton.Button
                        badgeItem={<Badge className="mr-2" size="sm" type="rounded" variant="green" />}
                        label={{
                          description: (
                            <>
                              {urlCheckboxes[2].description}
                              {urlCheckboxes[2].description2 && (
                                <>
                                  <br />
                                  {urlCheckboxes[2].description2}
                                </>
                              )}
                            </>
                          ),
                          heading: urlCheckboxes[2].heading
                        }}
                        reversePosition={true}
                        value={urlCheckboxes[2].value}
                        checked={forceLang === urlCheckboxes[2].value}
                        onChange={() => {
                          setForceLang(urlCheckboxes[2].value);
                        }}
                      />
                     <div style={{paddingLeft: '33px'}}>
                     {
                      forceLang === 3 &&
                      <div className='flex flex-col gap-4'>
                        {
                          domains.map((domain, index) => (
                            <Container.Item key={index}>
                              <Label size='sm' className='font-semibold'>
                                {domain.name}<span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                aria-label="Text Input"
                                id={`input-element-${index}`}
                                size="sm"
                                type="text"
                                value={domain.value}
                                onChange={(value) => {
                                  const updatedDomains = domains.map((d, i) => {
                                    if (index === i) {
                                      return { ...d, value: value };
                                    }
                                    return d;
                                  });
                                  setDomains(updatedDomains);
                                }}
                              />
                            </Container.Item>
                          ))
                        }
                      </div>
                    }
                     </div>
                    </RadioButton.Group>
                  </Container.Item>
                </Container>
              </div>
            </div>
            <div className='flex justify-between ' style={{ marginTop: "14px" }}>
              <SetupBackButton handleClick={() => { setSetupProgress("default"); localStorage.setItem("setupProgress", "default") }} />
              {
                urlLoader ?
                  <SetupContinueButton SaveSettings={() => { }} >
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                    Loading...
                  </SetupContinueButton>
                  :
                  <SetupContinueButton SaveSettings={saveUrl} />
              }
            </div>

          </div>
      }
    </>
  )
}

export default URLModifications