import React from 'react'
import { setupContext } from "../pages/SetupPage"
import { sprintf, __ } from '@wordpress/i18n'
import { Switch } from '@bsf/force-ui'
import { toast } from 'sonner'
import { languageSwitcherOptions } from '../utils'
import apiFetch from "@wordpress/api-fetch"
import { getNonce } from '../utils'
import SetupContinueButton, { SetupBackButton } from './SetupContinueButton'
const LanguageSwitcher = () => {
    const { setupProgress, setSetupProgress, data, setData } = React.useContext(setupContext) // get the context
    const [selectedLanguageSwitchers, setSelectedLanguageSwitchers] = React.useState(data.lmat_language_switcher_options || ['default']);
     //Handle Checkboxes of Language Switcher
    const handleLanguageSwitcherChange = (switcher) => {
        setSelectedLanguageSwitchers(prev => {
            if (prev.includes(switcher)) {
                return prev.filter(item => item !== switcher);
            } else {
                return [...prev, switcher];
            }
        });
    };
    function saveLanguageSwitcherSettings() {
        try {
            let apiBody = {
                lmat_language_switcher_options : selectedLanguageSwitchers
            }

            const response = apiFetch({
                path: 'lmat/v1/settings',
                method: 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': getNonce()
                },
                body: JSON.stringify(apiBody)
            }).then((response) => {
                    setData(prev => ({ ...prev, ...response }))
                    //Dynamically move to next page
            setSetupProgress("ready")
            localStorage.setItem("setupProgress", "ready");
                })

        } catch (error) {
            toast.error(error.message || __("Something went wrong", "linguator-multilingual-ai-translation"));
        }
    }
    return (
        <div className='mx-auto p-10 max-w-[600px] min-h-[40vh] bg-white shadow-sm flex flex-col'>
            <div className='flex-grow'>
                <h2>{__('Language Switcher Widget Configuration', 'linguator-multilingual-ai-translation')}</h2>
                <p className='text-justify text-sm/6'>{__('Linguator allows you to choose which language switcher should be displayed to users.', 'linguator-multilingual-ai-translation')}</p>

                <div className='flex flex-col gap-4'>
                    {
                        languageSwitcherOptions.map((switcher, index) => (
                            <div key={index} className='p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                                <div className='flex justify-between items-center'>
                                    <p className="text-sm/6">{__(switcher.label, 'linguator-multilingual-ai-translation')}</p>
                                    <Switch
                                        aria-label={`Switch for ${switcher.label}`}
                                        id={`lmat_language_switcher_${switcher.value}`}
                                        onChange={() => handleLanguageSwitcherChange(switcher.value)}
                                        size="sm"
                                        value={selectedLanguageSwitchers.includes(switcher.value)}
                                    />
                                </div>
                            </div>
                        ))
                    }
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