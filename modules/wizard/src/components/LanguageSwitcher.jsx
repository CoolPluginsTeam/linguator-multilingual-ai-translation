import React from 'react'
import { setupContext } from "../pages/SetupPage"
import { sprintf,__ } from '@wordpress/i18n'
import { Switch } from '@bsf/force-ui'
import { toast } from 'sonner'
import SetupContinueButton, { SetupBackButton } from './SetupContinueButton'
const LanguageSwitcher = () => {
    const { setupProgress, setSetupProgress, data, setData } = React.useContext(setupContext) // get the context
    const [defaultWidget,setDefaultWidget] = React.useState(false);
    const [blockEditor,setBlockEditor] = React.useState(false);
    const [elementorWidget,setElementorWidget] = React.useState(false);
    function saveLanguageSwitcherSettings(){

    }
  return (
    <div className='mx-auto p-10 max-w-[600px] min-h-[40vh] bg-white shadow-sm flex flex-col'>
            <div className='flex-grow'>
                <h2>{__('Language Switcher Widget Configuration', 'linguator-multilingual-ai-translation')}</h2>
                <p className='text-justify text-sm/6'>{__('Linguator allows you to choose which language switcher should be displayed to users.', 'linguator-multilingual-ai-translation')}</p>

                <div className='flex flex-col gap-4'>
                <div className='flex justify-between items-center p-6 rounded-lg' style={{ border: "1px solid #e5e7eb", marginBottom: "10px" }}>
                    <p className="text-sm/6">{__('Default Widget', 'linguator-multilingual-ai-translation')}</p>
                    <Switch
                        aria-label="Default Widget"
                        id="default-widget"
                        onChange={() => { setDefaultWidget(!defaultWidget) }}
                        value={defaultWidget}
                        size="sm"
                    />
                </div>
                <div className='p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                    <div className='flex justify-between items-center'>
                    <p className="text-sm/6">{__('Block Widget', 'linguator-multilingual-ai-translation')}</p>
                    <Switch
                        aria-label="Block Widget"
                        id="block-widget"
                        onChange={() => { setBlockEditor(!blockEditor) }}
                        value={blockEditor}
                        size="sm"
                        />
                    </div>
                </div>
                <div className='p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                    <div className='flex justify-between items-center'>
                    <p className="text-sm/6">{__('Elementor Widget', 'linguator-multilingual-ai-translation')}</p>
                    <Switch
                        aria-label="Elementor Widget"
                        id="elementor-widget"
                        onChange={() => { setElementorWidget(!elementorWidget) }}
                        value={elementorWidget}
                        size="sm"
                        />
                    </div>
                </div>
                </div>
            </div>
            <div className='flex justify-between ' style={{ marginTop: "14px" }}>
                <SetupBackButton handleClick={() => { setSetupProgress("url"); localStorage.setItem("setupProgress", "url"); }} />
                <SetupContinueButton SaveSettings={saveLanguageSwitcherSettings} />
            </div>
        </div>
  )
}

export default LanguageSwitcher