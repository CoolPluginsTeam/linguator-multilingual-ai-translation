import { Button } from '@bsf/force-ui'
import React from 'react'
import { __, sprintf } from '@wordpress/i18n'

const Ready = () => {

  //content for page
  let nextSteps = [ {
    title: __('NEXT STEP', 'linguator-multilingual-ai-translation'),
    header: __('Translate some pages', 'linguator-multilingual-ai-translation'),
    body: __("You're ready to translate the posts on your website.", 'linguator-multilingual-ai-translation'),
    button: __('View Pages', 'linguator-multilingual-ai-translation'),
    variant: 'outline'
  }]

  //get admin url
  let currentDomain = window.lmat_setup.admin_url;
  return (
    <div className='mx-auto max-w-[600px] min-h-[40vh] bg-white shadow-lg p-10 flex flex-col gap-6'>
      <h2 className='m-0'>{__("You're ready to translate your contents!", 'linguator-multilingual-ai-translation')}</h2>
      <div>
                  <p className='m-0 text-sm/6' style={{ color: "#6b7280" }}>{__("You're now able to translate your contents such as posts, pages, categories and tags. You can learn how to use Linguator by reading the documentation.", 'linguator-multilingual-ai-translation')}</p>
      </div>
      <table className='ready-table'>
        <tbody>
          {
            nextSteps.map((step, index) => (
              <tr key={index} className="ready-table-data">
                <td >
                  <h6 className='m-0'>{step.title}</h6>
                  <h3 className='m-0'>{step.header}</h3>
                  <div className='flex gap-4 items-center justify-between'>
                    <p style={{ color: "#6b7280" }} className='text-justify w-[60%] text-sm/6'>{step.body}</p>
                    <div>
                      <a href={`${currentDomain}edit.php?post_type=page`}>
                        <Button
                          className=""
                          iconPosition="left"
                          size="sm"
                          tag="button"
                          type="button"
                          onClick={() => { }}
                          variant={step.variant}
                        >
                          {step.button}
                        </Button>
                      </a>

                    </div>
                  </div>
                </td>
              </tr>
            ))
          }
          <tr className="ready-table-data">
            <td >
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube-nocookie.com/embed/PnI49VIB48w?si=UPOQ45CbbE6-pm2t" 
                title="YouTube video player" 
                frameBorder="0" 
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen>
              </iframe>
            </td>
          </tr>
          <tr className="ready-table-data">
            <td >
              <a style={{ color: "gray" }} className='' href={currentDomain}>
                <Button
                  className=""
                  iconPosition="left"
                  size="sm"
                  onClick={() => { localStorage.removeItem("setupProgress") }}
                  tag="button"
                  type="button"
                  variant="outline"
                >
                  {__('Return to Dashboard', 'linguator-multilingual-ai-translation')}
                </Button>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Ready