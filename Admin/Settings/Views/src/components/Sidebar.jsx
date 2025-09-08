import { Container } from "@bsf/force-ui"
import { __ } from '@wordpress/i18n';

const Sidebar = () => {
  // Get LocoAI plugin status from localized script data
  const locoaiStatus = window.lmat_settings?.locoai_plugin_status || { status: 'not_installed' };
  
  // Determine button text and behavior based on plugin status
  const getButtonConfig = () => {
    switch (locoaiStatus.status) {
      case 'active':
        return {
          text: __('ACTIVATED', 'linguator-multilingual-ai-translation'),
          href: 'plugins.php',
          className: 'button button-secondary',
          disabled: false,
          target: '_self'
        };
      case 'installed':
        return {
          text: __('ACTIVATE', 'linguator-multilingual-ai-translation'),
          href: `plugins.php?_wpnonce=${window.lmat_settings?.activate_nonce || ''}&action=activate&plugin=automatic-translator-addon-for-loco-translate/automatic-translator-addon-for-loco-translate.php`,
          className: 'button button-primary',
          disabled: false,
          target: '_self'
        };
      default:
        return {
          text: __('INSTALL', 'linguator-multilingual-ai-translation'),
          href: 'plugin-install.php?s=locoai&tab=search&type=term',
          className: 'button button-primary',
          disabled: false,
          target: '_blank'
        };
    }
  };
  
  const buttonConfig = getButtonConfig();
  
  return (
    <div className='w-full'>
        <div className='w-full rounded-lg'>
          <Container className='flex flex-col p-6  bg-white border border-gray-200 rounded-lg shadow-sm'>
            <Container.Item>
              <h2 className='text-lg font-semibold text-gray-900 mb-2'>{__('Auto Translation Status', 'linguator-multilingual-ai-translation')}</h2>
              <Container.Item className=''>
                <h1 className='text-3xl font-bold text-gray-900 m-0'>0</h1>
                <p className='text-sm text-gray-600 m-0'>{__('Total Characters Translated!', 'linguator-multilingual-ai-translation')}</p>
              </Container.Item>
            </Container.Item>
             <hr className="w-full border-b-0 border-x-0 border-t border-solid border-gray-400 my-1" />
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
          <div className=' p-6'>
            <h2>{__('Automatically Translate Plugins & Themes', 'linguator-multilingual-ai-translation')}</h2>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-gray-400 my-1" />
            <Container.Item className='flex'>
              <div className='w-[70%]'>
                <h4>{__('LocoAI - Auto Translation for Loco Translate', 'linguator-multilingual-ai-translation')}</h4>
                <p>{__('Loco Addon to translate plugins and themes', 'linguator-multilingual-ai-translation')}</p>
                <a 
                  href={buttonConfig.href} 
                  target={buttonConfig.target} 
                  className={buttonConfig.className}
                  {...(buttonConfig.disabled && { disabled: true })}
                >
                  {buttonConfig.text}
                </a>
              </div>
              <div className='w-[30%] flex items-center object-contain p-2'>
                <a href='plugin-install.php?s=locoai&tab=search&type=term' target="_blank"><img className="w-full h-auto  " src={`${window.lmat_settings_logo_data.logoUrl}loco.png`} alt="Loco translate logo" /></a>
              </div>
              <div></div>
            </Container.Item>
          </div>
        </div>
    </div>
  )
}

export default Sidebar