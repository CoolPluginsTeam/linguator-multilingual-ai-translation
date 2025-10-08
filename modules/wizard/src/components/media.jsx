import { Switch } from "@bsf/force-ui"
import apiFetch from "@wordpress/api-fetch"
import React from 'react'
import { toast } from 'sonner'
import { setupContext } from '../pages/setup-page'
import { getNonce } from '../../../../admin/settings/views/src/utils'
import SetupContinueButton, { SetupBackButton } from './setup-continue-button'
import { __, sprintf } from '@wordpress/i18n'
const Media = () => {
    const { setupProgress, setSetupProgress, data, setData } = React.useContext(setupContext) // get the context
    const [media, setMedia] = React.useState(data.media_support) //store the media option

    //function to handle save button in the media page
    async function saveMedia() {
        try {
            //handle if there are changes then make api call and save to databse or else no api call
            if (media != data.media_support) {
                const mediaResponse = await apiFetch({
                    path: 'lmat/v1/settings',
                    method: 'POST',
                    'headers': {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': getNonce()
                    },
                    body: JSON.stringify({
                        media_support: media
                    })
                })
                setData(mediaResponse)
            }
            //Dynamically move to next page

            setSetupProgress("translation_configuration")
            localStorage.setItem("setupProgress", "translation_configuration");
        } catch (error) {
            toast.error(__("Please try again later", "linguator-multilingual-ai-translation"))
        }
    }
    return (
        <div className='mx-auto p-10 max-w-[600px] min-h-[40vh] bg-white shadow-sm flex flex-col'>
            <div className='flex-grow'>
                <h2>{__('Media', 'linguator-multilingual-ai-translation')}</h2>
                <p className='text-justify text-sm/6'>{__('Linguator lets you translate media details like the title, alt text, caption, and description. The file isn’t duplicated, but you’ll see a separate entry for each language in the media library. When adding media to a post, you’ll only see options in that post’s language.', 'linguator-multilingual-ai-translation')}</p>
                <p className='text-justify text-sm/6'>{__('Turn on media translation if you need to translate the title, alt text, caption, or description. If not, you can leave it off.', 'linguator-multilingual-ai-translation')}</p>

                <div className='flex justify-between items-center p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                    <p className="text-sm/6">{__('Allow Linguator to translate media', 'linguator-multilingual-ai-translation')}</p>
                    <Switch
                        aria-label="Media Element"
                        id="media-content"
                        onChange={() => { setMedia(!media) }}
                        value={media}
                        size="sm"
                    />
                </div>
            </div>
            <div className='flex justify-between ' style={{ marginTop: "14px" }}>
                <SetupBackButton handleClick={() => { setSetupProgress("url"); localStorage.setItem("setupProgress", "url"); }} />
                <SetupContinueButton SaveSettings={saveMedia} />
            </div>

        </div>
    )
}

export default Media