import { ProgressSteps, Topbar } from "@bsf/force-ui"
import React from 'react'
// import DefaultLanguage from './DefaultLanguage'
import Languages from './languages'
import Ready from './ready'
import { sprintf,__ } from '@wordpress/i18n'
import { BadgeCheck } from 'lucide-react'
import { setupContext } from '../pages/setup-page'
import Media from './media'
import Default from "./default"
import URLModifications from "./url-modifications"
import AiTranslation from "./ai-translation"
import LanguageSwitcher from "./language-switcher"

//Component router for setup 
const SetupFileRouting = () => {

    const {setupProgress} = React.useContext(setupContext)

    if (setupProgress === "languages") return <Languages  />
    else if(setupProgress === "default") return <Default/>
    else if(setupProgress === "url") return <URLModifications/>
    else if (setupProgress === "media") return <Media  />
    else if (setupProgress === "ready") return <Ready />
    else if (setupProgress === "translation_configuration") return <AiTranslation />
    else if(setupProgress === "language_switcher") return <LanguageSwitcher/>
}
const SetupProgress = ({lmat_setup_data}) => {
    const {setupProgress,setSetupProgress,setupSteps, setSetupSteps} = React.useContext(setupContext) //get the context

    //creating steps according to scenerios to show and hide which tabs of setup
    React.useEffect(()=>{
        let step = 1;
        let temp_setupSetups = [{
            label: __("Languages","linguator-multilingual-ai-translation"),
            value: "languages",
            visible: true,
            step: step++
        }]

        temp_setupSetups.push({
            label: __("Default","linguator-multilingual-ai-translation"),
            value: "default",
            visible: true,
            step:step++
        })

        temp_setupSetups.push({
            label: __("URL","linguator-multilingual-ai-translation"),
            value: "url",
            visible: true,
            step:step++
        })
        if(window.lmat_setup.media == "1"){
            temp_setupSetups.push({
                label: __("Media","linguator-multilingual-ai-translation"),
                value: "media",
                visible: true,
                step: step++
            })
        
        }
        // if(lmat_setup_data.untranslated_contents == "1"){
        //     temp_setupSetups.push({
        //         label: __("Content","linguator-multilingual-ai-translation"),
        //         value: "content",
        //         visible: true,
        //         step: step++
        //     })
        // }
        
        temp_setupSetups.push({
            label: __("AI Translation","linguator-multilingual-ai-translation"),
            value: "translation_configuration",
            visible: true,
            step: step++
        })

        temp_setupSetups.push({
            label: __("Switcher","linguator-multilingual-ai-translation"),
            value: "language_switcher",
            visible: true,
            step: step++
        })
        temp_setupSetups.push({
            label: __("Ready","linguator-multilingual-ai-translation"),
            value: "ready",
            visible: true,
            step:step++
        })

        setSetupSteps(temp_setupSetups)
        
    },[setupProgress])
    //get admin url
    let currentDomain = lmat_setup_data.admin_url;
    return (
        <div className="bg-background-secondary w-full pb-10">
            <Topbar className="bg-background-secondary">
                <Topbar.Middle>
                    <Topbar.Item>
                        <ProgressSteps
                            completedIcon={<BadgeCheck className='text-green-500' />}
                            completedVariant="icon"
                            currentStep={setupSteps.find((steps)=>steps.value===setupProgress)?.step}
                            size="md"
                            type="inline"
                            variant="number"
                        >
                            {
                                setupSteps.map((step, index) => (
                                        step.visible && <ProgressSteps.Step className="z-0" labelText={step.label} key={index} onClick={()=>{if(setupSteps.find((steps)=>steps.value===setupProgress)?.step>index+1){setSetupProgress(step.value);localStorage.setItem("setupProgress",step.value)}}}  completedVariant="icon" completedIcon={<BadgeCheck />} />

                                ))
                            }
                        </ProgressSteps>
                    </Topbar.Item>
                </Topbar.Middle>
            </Topbar>
            <div>
                <SetupFileRouting />
            </div>
            {setupProgress != "ready" &&
                <div className='text-center text-sm' style={{marginTop:"14px"}}>
                    <a style={{ color: "gray" }} className='' onClick={()=>localStorage.removeItem("setupProgress")} href={`${currentDomain}/admin.php?page=lmat`}>{__("Skip","linguator-multilingual-ai-translation")}</a>
                </div>
            }
        </div>
    )
}

export default SetupProgress