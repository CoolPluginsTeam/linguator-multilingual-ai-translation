import { Container, Button } from "@bsf/force-ui"
import { __ } from '@wordpress/i18n';

const Sidebar = () => {
  // Get LocoAI plugin status from localized script data
  const locoaiStatus = window.lmat_settings?.locoai_plugin_status || { status: 'not_installed' };

  return (
    <>
      <div className='w-full'>
        <div className='w-full flex flex-col gap-8 rounded-lg'>
          <Container className='flex flex-col p-6  bg-white border border-gray-200 rounded-lg shadow-sm'>
            <Container.Item>
              <h2 className='text-lg font-semibold text-gray-900 mb-2'>{__('Auto Translation Status', 'linguator-multilingual-ai-translation')}</h2>
              <Container.Item className=''>
                <h1 className='text-3xl font-bold text-gray-900 m-0'>0</h1>
                <p className='text-sm text-gray-600 m-0'>{__('Total Characters Translated!', 'linguator-multilingual-ai-translation')}</p>
              </Container.Item>
            </Container.Item>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle my-1" />
            <Container.Item className='w-full'>
              <Container.Item className='flex flex-col gap-1'>
                <div className='flex justify-between items-center'>
                  <h4 className='text-sm text-gray-700 m-0'>{__('Total Strings', 'linguator-multilingual-ai-translation')}</h4>
                  <p className='text-sm font-medium text-gray-900 m-0'>0</p>
                </div>
                <div className='flex justify-between items-center'>
                  <h4 className='text-sm text-gray-700 m-0'>{__('Total Pages / Posts', 'linguator-multilingual-ai-translation')}</h4>
                  <p className='text-sm font-medium text-gray-900 m-0'>0</p>
                </div>
                <div className='flex justify-between items-center'>
                  <h4 className='text-sm text-gray-700 m-0'>{__('Time Taken', 'linguator-multilingual-ai-translation')}</h4>
                  <p className='text-sm font-medium text-gray-900 m-0'>0</p>
                </div>
              </Container.Item>
            </Container.Item>
          </Container>
          {
            locoaiStatus.status !== 'active' ? (

              <div className=' p-6 bg-white border border-gray-200 rounded-lg shadow-sm'>
                <h2>{__('Automatically Translate Plugins & Themes', 'linguator-multilingual-ai-translation')}</h2>
                <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle my-1" />
                <Container.Item className='flex'>
                  <div className='w-[70%]'>
                    <h4>{__('LocoAI - Auto Translation for Loco Translate', 'linguator-multilingual-ai-translation')}</h4>
                    <a target="_blank" href="plugin-install.php?s=locoai&tab=search&type=term">
                    <Button
                      className=""
                      iconPosition="left"
                      size="md"
                      tag="button"
                      type="button"
                      variant="primary"
                    >
                      {__('INSTALL', 'linguator-multilingual-ai-translation')}
                    </Button>
                    </a>
                  </div>
                  <div className='w-[30%] flex items-center object-contain p-2'>
                    <a href='plugin-install.php?s=locoai&tab=search&type=term' target="_blank"><img className="w-auto max-h-24  " src={`${window.lmat_settings_logo_data.logoUrl}loco.png`} alt="Loco translate logo" /></a>
                  </div>
                  <div></div>
                </Container.Item>
              </div>

            ) : null
          }
          <Container className='bg-white flex flex-col gap-4 p-6 shadow-sm rounded-lg'>
            <div>
              <h2><a className="no-underline text-black" target="_blank" href="https://wordpress.org/support/plugin/linguator-multilingual-ai-translation/reviews/#new-post">{__('Rate Us ⭐⭐⭐⭐⭐', 'linguator-multilingual-ai-translation')}</a></h2>
              <p>{__("We'd love your feedback! Hope this addon made auto-translations easier for you.", 'linguator-multilingual-ai-translation')}</p>
              <a target="_blank" href="https://wordpress.org/support/plugin/linguator-multilingual-ai-translation/reviews/#new-post">{__('Submit a Review →', 'linguator-multilingual-ai-translation')}</a>
            </div>
          </Container>
        </div>

      </div>
    </>
  )
}

export default Sidebar