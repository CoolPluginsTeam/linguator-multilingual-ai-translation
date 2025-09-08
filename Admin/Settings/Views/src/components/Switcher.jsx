import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Container, Input, Label, RadioButton, Switch } from '@bsf/force-ui'
import { Settings } from 'lucide-react';
import { __ } from '@wordpress/i18n'
import apiFetch from "@wordpress/api-fetch"
import { getNonce } from '../utils'
import { toast } from 'sonner'

const Switcher = ({ data, setData }) => {

    const switcherSettings = data?.switcher_configuration; //store the switcher option
    const widgets = switcherSettings?.widgets;
    const [defaultWidget, setDefaultWidget] = useState(widgets?.default)
    const [blockWidget, setBlockWidget] = useState(widgets?.block)
    const [elementorWidget, setElementorWidget] = useState(widgets?.elementor)
    const [lastUpdatedValue, setLastUpdatedValue] = useState({ defaultWidget, blockWidget, elementorWidget })
    const [handleButtonDisabled, setHandleButtonDisabled] = useState(true)

    useEffect(() => {
        let sameChecker = {
            defaultWidget: true,
            blockWidget: true,
            elementorWidget: true,
        }

        if (defaultWidget !== widgets?.default) {
            sameChecker.defaultWidget = false
        }

        if (blockWidget !== widgets?.block) {
            sameChecker.blockWidget = false
        }

        if (elementorWidget !== widgets?.elementor) {
            sameChecker.elementorWidget = false
        }

        let flag = true;
        for (const key in sameChecker) {
            if (!sameChecker[key]) {
                flag = false;
                setHandleButtonDisabled(false)
                break;
            }
        }
        if (flag) {
            setHandleButtonDisabled(true)
        }
    }, [defaultWidget, blockWidget, elementorWidget])


    //Save Setting Function 
    async function SaveSettings() {
        try {
            let apiBody;

            apiBody = {
                switcher_configuration: {
                    widgets: {
                        default: defaultWidget,
                        block: blockWidget,
                        elementor: elementorWidget
                    }
                }
            }

            setLastUpdatedValue({ defaultWidget, blockWidget, elementorWidget })
            if (switcherSettings && (lastUpdatedValue.defaultWidget !== defaultWidget || lastUpdatedValue.blockWidget !== blockWidget || lastUpdatedValue.elementorWidget !== elementorWidget)) {
                setData(prev => ({
                    ...prev,
                    ...apiBody
                }))
            }
            //API Call
            const response = apiFetch({
                path: 'lmat/v1/settings',
                method: 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': getNonce()
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    setData(prev => ({ ...prev, ...response }))
                })
                .catch(error => {
                    // Handle general API errors
                    if (error?.message) {
                        throw new Error(error.message);
                    }
                    throw new Error(__("Something went wrong", 'linguator-multilingual-ai-translation'));
                });

            toast.promise(response, {
                loading: __('Saving Settings', 'linguator-multilingual-ai-translation'),
                success: __('Settings Saved', 'linguator-multilingual-ai-translation'),
                error: (error) => error.message
            })
            setHandleButtonDisabled(true)

        } catch (error) {
            // Handle domain validation errors
            if (error.message.includes(__("Linguator was unable to access", "linguator-multilingual-ai-translation"))) {
                toast.error(error.message);
            } else {
                toast.error(error.message || __("Something went wrong", "linguator-multilingual-ai-translation"));
            }
        }
    }

    return (
        <Container className='bg-white p-10 rounded-lg' cols="1" containerType='grid'>
            <Container className='flex items-center'>
                <Container.Item className='flex w-full justify-between px-4 gap-6'>
                    <h1 className='font-bold'>{__('Switcher Settings', 'linguator-multilingual-ai-translation')}</h1>
                    <Button
                        disabled={handleButtonDisabled}
                        className=""
                        iconPosition="left"
                        size="md"
                        tag="button"
                        type="button"
                        onClick={SaveSettings}
                        variant="primary"
                    >
                        {__('Save Settings', 'linguator-multilingual-ai-translation')}
                    </Button>
                </Container.Item>
            </Container>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
            <Container.Item className='p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                <Label size='md' className='font-bold flex items-center gap-2'>
                    <Settings className="flex-shrink-0 size-5 text-icon-secondary" />
                    {__('Widget Types', 'linguator-multilingual-ai-translation')}
                </Label>
                <Label variant='help'>
                    {__('Enable or disable different types of language switcher widgets. You can enable multiple widget types to provide different options for displaying the language switcher.', 'linguator-multilingual-ai-translation')}
                </Label>
                <div className='flex flex-col gap-2' style={{ marginTop: "20px" }}>
                    <div style={{backgroundColor: "#fbfbfb"}}>
                    <div className='switcher p-6 rounded-lg'>
                        <Container.Item>
                            <h3 className='flex items-center gap-2'>
                                {__('Default Widget', 'linguator-multilingual-ai-translation')}
                            </h3>
                            <p>
                                {__('Standard language switcher widget that can be added to widget areas and sidebars.', 'linguator-multilingual-ai-translation')}
                            </p>
                        </Container.Item>
                        <Container.Item className='flex items-center justify-end' style={{ paddingRight: '30%' }}>
                            <Switch
                                aria-label="Switch Element"
                                id="default-widget"
                                onChange={() => {
                                    setDefaultWidget(!defaultWidget)
                                }}
                                value={defaultWidget}
                                size="sm"
                            />
                        </Container.Item>
                    </div>
                    </div>
                    <div style={{backgroundColor: "#fbfbfb"}}>
                        <div className='switcher p-6 rounded-lg'>
                            <Container.Item >
                                <h3 className='flex items-center gap-2'>
                                    {__('Block Widget', 'linguator-multilingual-ai-translation')}
                                </h3>
                                <p>
                                    {__('Gutenberg block widget for the block editor, compatible with modern WordPress themes.', 'linguator-multilingual-ai-translation')}
                                </p>
                            </Container.Item>
                            <Container.Item className='flex items-center justify-end' style={{ paddingRight: '30%' }}>
                                <Switch
                                    aria-label="Switch Element"
                                    id="block-widget"
                                    onChange={() => {
                                        setBlockWidget(!blockWidget)
                                    }}
                                    value={blockWidget}
                                    size="sm"
                                />
                            </Container.Item>
                        </div>
                    </div>
                    <div style={{backgroundColor: "#fbfbfb"}}>
                        <div className='switcher p-6 rounded-lg'>
                            <Container.Item >
                                <h3 className='flex items-center gap-2'>
                                    {__('Elementor Widget', 'linguator-multilingual-ai-translation')}
                                </h3>
                                <p>
                                    {__('Specialized widget for Elementor page builder with enhanced styling and customization options.', 'linguator-multilingual-ai-translation')}
                                </p>
                            </Container.Item>
                            <Container.Item className='flex items-center justify-end' style={{ paddingRight: '30%' }}>
                                <Switch
                                    aria-label="Switch Element"
                                    id="elementor-widget"
                                    onChange={() => {
                                        setElementorWidget(!elementorWidget)
                                    }}
                                    value={elementorWidget}
                                    size="sm"
                                />
                            </Container.Item>
                        </div>
                    </div>
                </div>
            </Container.Item>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
            <Container className='flex items-center justify-end'>
                <Container.Item className='flex gap-6'>
                    <Button
                        disabled={handleButtonDisabled}
                        className=""
                        iconPosition="left"
                        size="md"
                        tag="button"
                        type="button"
                        onClick={SaveSettings}
                        variant="primary"
                    >
                        {__('Save Settings', 'linguator-multilingual-ai-translation')}
                    </Button>

                </Container.Item>
            </Container>
        </Container>
    )
}

export default Switcher;