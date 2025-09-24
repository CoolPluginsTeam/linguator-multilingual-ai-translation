//Genral Tab Body

import { Badge, Accordion, Button, Checkbox, Container, Input, Label, RadioButton, Switch } from '@bsf/force-ui'
import apiFetch from "@wordpress/api-fetch"
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'; // importing toaster and toast for notification purpose
import { synchronizations } from '../utils'
import { getNonce } from '../utils'
import { Link, Globe, Focus, Milestone, RefreshCcw, Share2, Settings2 } from 'lucide-react';
import { __, sprintf } from '@wordpress/i18n';

const General = ({ data, setData }) => {

    const [browser, setBrowser] = useState(data.browser); //For Detect Browser Language
    const [mediaSupport, setMediaSupport] = useState(data.media_support); // For Media
    const [hideDefault, setHideDefault] = useState(data.hide_default); //For Hide URL language in URL modifications
    const [forceLang, setForceLang] = useState(data.force_lang); // Main Radio Options for URL modifications
    const [rewrite, setRewrite] = useState(data.rewrite); // if the first option is selected then for that radio options
    const [domains, setDomains] = useState([]) // if 3rd option is selected then for that url inputs
    const currentDomain = window.lmat_settings.home_url; // Fetch the current domain of website
    const [AvailablePostTypes, setAvailablePostTypes] = useState([]); // Available Custom Post Types
    const [AvailableTaxonomies, setAvailableTaxonomies] = useState([]); // Available Custom Taxonomies
    const [selectedSynchronization, setSelectedSyncronization] = useState(data.sync); // Selected Synchronization options
    const [selectedPostTypes, setSelectedPostTypes] = useState(data.post_types); // Selected Custom Post Types
    const [selectedTaxonomies, setSelectedTaxonomies] = useState(data.taxonomies); //Selected Custom Taxonomies
    const disabledPostTypes= data.disabled_post_types || []; //Disabled Post Types (programmatically active)
    const [handleButtonDisabled, setHandleButtonDisabled] = useState(true)
    const [selectAllSync,setSelectAllSync] = useState(false);
    const [selectAllPostTypes, setSelectAllPostTypes] = useState(false);
    const [selectAllTaxonomies, setSelectAllTaxonomies] = useState(false);
    const previousDomains = React.useRef([])
    const [lmatFeedbackData, setLmatFeedbackData] = useState(data.lmat_feedback_data !== undefined ? data.lmat_feedback_data : false); // For Usage Data Sharing
    const [selectedLanguageSwitchers, setSelectedLanguageSwitchers] = useState(data.lmat_language_switcher_options || ['default']); // Selected Language Switcher options
    const [showTerms, setShowTerms] = useState(false); // For showing/hiding terms box
    const [staticStringsVisibility, setStaticStringsVisibility] = useState(data.static_strings_visibility !== undefined ? data.static_strings_visibility : false); // For Static Strings tab visibility


    //make the Domains in a suitable way to view
    useEffect(() => {
        let newDomains = window.lmat_settings.languages.map((item) => {
            const code = item.slug;
            return {
                value: data.domains[code] || "",
                name: `${item.name}-${item.locale}`,
                code: code
            };
        });
        setDomains(newDomains);
        previousDomains.current = newDomains;
    }, []);
    useEffect(() => {
        let sameChecker = {
            browser: true,
            mediaSupport: true,
            hideDefault: true,
            forceLang: true,
            rewrite: true,
            domains: true,
            selectedSynchronization: true,
            selectedPostTypes: true,
            selectedTaxonomies: true,
            selectedLanguageSwitchers: true,
            staticStringsVisibility: true
        }
        
        // Only include lmatFeedbackData in the checker if the setting is available
        if (data.lmat_feedback_data !== undefined) {
            sameChecker.lmatFeedbackData = true;
        }
        if (forceLang !== data.force_lang) {
            sameChecker.forceLang = false

        }

        if (hideDefault !== data.hide_default) {
            sameChecker.hideDefault = false
        }

        if (browser !== data.browser) {
            sameChecker.browser = false

        }

        if (data.lmat_feedback_data !== undefined && lmatFeedbackData !== data.lmat_feedback_data) {
            sameChecker.lmatFeedbackData = false
        }

        if (rewrite !== data.rewrite) {
            sameChecker.rewrite = false
        }


        if (mediaSupport !== data.media_support) {
            sameChecker.mediaSupport = false
        }

        if (staticStringsVisibility !== data.static_strings_visibility) {
            sameChecker.staticStringsVisibility = false
        }
        for (const value of previousDomains.current) {
            if (!domains.includes(value) || previousDomains.current.length != domains.length) {
                sameChecker.domains = false
                break;
            }
        }
        if (data.post_types.length != selectedPostTypes.length) {
            sameChecker.selectedPostTypes = false
        } else {
            for (const value of data.post_types) {
                if (!selectedPostTypes.includes(value)) {
                    sameChecker.selectedPostTypes = false
                    break;
                }
            }
        }


        if (data.taxonomies.length != selectedTaxonomies.length) {
            sameChecker.selectedTaxonomies = false
        } else {
            for (const value of data.taxonomies) {
                if (!selectedTaxonomies.includes(value)) {
                    sameChecker.selectedTaxonomies = false
                    break;
                }
            }
        }


        if (data.sync.length != selectedSynchronization.length) {
            sameChecker.selectedSynchronization = false
        } else {
            for (const value of data.sync) {
                if (!selectedSynchronization.includes(value)) {
                    sameChecker.selectedSynchronization = false
                    break;
                }
            }
        }

        if (data.lmat_language_switcher_options && data.lmat_language_switcher_options.length != selectedLanguageSwitchers.length) {
            sameChecker.selectedLanguageSwitchers = false
        } else if (data.lmat_language_switcher_options) {
            for (const value of data.lmat_language_switcher_options) {
                if (!selectedLanguageSwitchers.includes(value)) {
                    sameChecker.selectedLanguageSwitchers = false
                    break;
                }
            }
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
    }, [browser, mediaSupport, hideDefault, forceLang, rewrite, domains, selectedSynchronization, selectedPostTypes, selectedTaxonomies, lmatFeedbackData, selectedLanguageSwitchers, staticStringsVisibility])

    //Make the post types and taxonomies from  posttype->posttype_name   to {value: postype ,label:posttype_name (posttype)}
    useEffect(() => {
        const newAvailableTaxonomies = Object.keys(data.available_taxonomies).map(key => ({
            value: data.available_taxonomies[key].taxonomy_key,
            label: data.available_taxonomies[key].taxonomy_name + " ( " + data.available_taxonomies[key].taxonomy_key + " )"
        }));
        setAvailableTaxonomies(newAvailableTaxonomies);

        const newAvailablePostTypes = data.available_post_types.map(post_type => ({
            value: post_type.post_type_key,
            label: post_type.post_type_name + " ( " + post_type.post_type_key + " )"
        }));
        setAvailablePostTypes(newAvailablePostTypes);
    }, [data.taxonomies, data.post_types]);

    //Handle checkboxes of PostType
    const handlePostTypeChange = (postType) => {
        setHandleButtonDisabled(false)
        setSelectedPostTypes(prev => {
            if (prev.includes(postType)) {
                return prev.filter(item => item !== postType);
            } else {
                return [...prev, postType];
            }
        });

    };

    //Handle Checkboxes of taxonomies
    const handleTaxonomyChange = (taxonomy) => {
        setHandleButtonDisabled(false)
        setSelectedTaxonomies(prev => {
            if (prev.includes(taxonomy)) {
                return prev.filter(item => item !== taxonomy);
            } else {
                return [...prev, taxonomy];
            }
        });

    };

    //Handle Checkboxes of Synchronization
    const handleSynchronizationChange = (synchronization) => {
        setHandleButtonDisabled(false)
        setSelectedSyncronization(prev => {
            if (prev.includes(synchronization)) {
                return prev.filter(item => item !== synchronization);
            } else {
                return [...prev, synchronization];
            }
        });

    };



    //Handle Select All Sync
    const handleSelectAllSync = () => {
        setHandleButtonDisabled(false);
        if (selectAllSync) {
            // Deselect all
            setSelectedSyncronization([]);
            setSelectAllSync(false);
        } else {
            // Select all
            const allSyncValues = synchronizations.map(sync => sync.value);
            setSelectedSyncronization(allSyncValues);
            setSelectAllSync(true);
        }
    };

    // Update selectAllSync state when individual sync items change
    React.useEffect(() => {
        const allSyncValues = synchronizations.map(sync => sync.value);
        const allSelected = allSyncValues.every(value => selectedSynchronization.includes(value));
        setSelectAllSync(allSelected && selectedSynchronization.length > 0);
    }, [selectedSynchronization]);

    //Handle Select All Post Types
    const handleSelectAllPostTypes = () => {
        setHandleButtonDisabled(false);
        if (selectAllPostTypes) {
            // Deselect all (except disabled ones)
            const enabledPostTypes = selectedPostTypes.filter(postType => {
                const isDisabled = Array.isArray(disabledPostTypes) && disabledPostTypes.some(disabledType => {
                    const postTypeKey = typeof disabledType === 'object' ? disabledType.post_type_key : disabledType;
                    return postTypeKey === postType;
                });
                return isDisabled;
            });
            setSelectedPostTypes(enabledPostTypes);
            setSelectAllPostTypes(false);
        } else {
            // Select all
            const allPostTypeValues = AvailablePostTypes.map(postType => postType.value);
            setSelectedPostTypes(allPostTypeValues);
            setSelectAllPostTypes(true);
        }
    };

    // Update selectAllPostTypes state when individual post type items change
    React.useEffect(() => {
        if (AvailablePostTypes.length > 0) {
            const enabledPostTypes = AvailablePostTypes.filter(postType => {
                const isDisabled = Array.isArray(disabledPostTypes) && disabledPostTypes.some(disabledType => {
                    const postTypeKey = typeof disabledType === 'object' ? disabledType.post_type_key : disabledType;
                    return postTypeKey === postType.value;
                });
                return !isDisabled;
            });
            const enabledPostTypeValues = enabledPostTypes.map(postType => postType.value);
            const allEnabledSelected = enabledPostTypeValues.every(value => selectedPostTypes.includes(value));
            setSelectAllPostTypes(allEnabledSelected && enabledPostTypeValues.length > 0);
        }
    }, [selectedPostTypes, AvailablePostTypes]);

    //Handle Select All Taxonomies
    const handleSelectAllTaxonomies = () => {
        setHandleButtonDisabled(false);
        if (selectAllTaxonomies) {
            // Deselect all
            setSelectedTaxonomies([]);
            setSelectAllTaxonomies(false);
        } else {
            // Select all
            const allTaxonomyValues = AvailableTaxonomies.map(taxonomy => taxonomy.value);
            setSelectedTaxonomies(allTaxonomyValues);
            setSelectAllTaxonomies(true);
        }
    };

    // Update selectAllTaxonomies state when individual taxonomy items change
    React.useEffect(() => {
        if (AvailableTaxonomies.length > 0) {
            const allTaxonomyValues = AvailableTaxonomies.map(taxonomy => taxonomy.value);
            const allSelected = allTaxonomyValues.every(value => selectedTaxonomies.includes(value));
            setSelectAllTaxonomies(allSelected && selectedTaxonomies.length > 0);
        }
    }, [selectedTaxonomies, AvailableTaxonomies]);

    // Handle terms box visibility
    const handleTermsToggle = (e) => {
        e.preventDefault();
        setShowTerms(!showTerms);
    };

    //Save Setting Function 
    async function SaveSettings() {
        try {
            let reloadCheck = false;
            if(staticStringsVisibility != data.static_strings_visibility){
                reloadCheck = true
            }
            let apiBody;
            if (forceLang === 3) {
                let final_domain = {};
                let used_hosts = [];
                
                // Validate domains before processing
                for (const domain of domains) {
                    // Check if domain is empty
                    if (!domain.value || domain.value.trim() === '') {
                        throw new Error(__("Domain URL is required for all languages", "linguator-multilingual-ai-translation"));
                    }
                    
                    // Check if domain has proper protocol
                    if (!domain.value.includes("http://") && !domain.value.includes("https://")) {
                        throw new Error(__("Please enter valid URLs with http:// or https://", "linguator-multilingual-ai-translation"));
                    }
                    final_domain[domain.code] = domain.value;
                    
                }
                //API Body
                apiBody = {
                    hide_default: hideDefault,
                    browser: forceLang === 3 ? false : browser,
                    media_support: mediaSupport,
                    force_lang: forceLang,
                    rewrite: rewrite,
                    domains: final_domain,
                    sync: selectedSynchronization,
                    post_types: selectedPostTypes,
                    taxonomies: selectedTaxonomies,
                    static_strings_visibility: staticStringsVisibility,
                }
                
                
                
                // Only include lmat_feedback_data if the setting is available
                if (data.lmat_feedback_data !== undefined) {
                    apiBody.lmat_feedback_data = lmatFeedbackData;
                }
            } else {
                apiBody = {
                    hide_default: hideDefault,
                    browser: forceLang === 3 ? false : browser,
                    media_support: mediaSupport,
                    force_lang: forceLang,
                    rewrite: rewrite,
                    sync: selectedSynchronization,
                    post_types: selectedPostTypes,
                    taxonomies: selectedTaxonomies,
                    static_strings_visibility: staticStringsVisibility,
                }
                
                // Only include lmat_feedback_data if the setting is available
                if (data.lmat_feedback_data !== undefined) {
                    apiBody.lmat_feedback_data = lmatFeedbackData;
                }
            }
            setData(prev => ({
                ...prev,
                ...apiBody
            }))
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
                    if(reloadCheck){
                        window.location.reload();
                    }
                })
                .catch(error => {
                    // Handle domain validation errors from backend
                    if (error?.code && error?.code.includes('domain')) {
                        throw new Error(error.message);
                    }
                    if (error?.code === "missing_domains" || 
                        error?.code === "invalid_domain_format" || 
                        error?.code === "duplicate_domain" || 
                        error?.code === "empty_domain" || 
                        error?.code === "invalid_language" || 
                        error?.code === "missing_language_domain") {
                        throw new Error(error.message);
                    }
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
            if (error.message.includes(__("Please enter valid URLs", "linguator-multilingual-ai-translation")) ||
                error.message.includes(__("Domain URL is required", "linguator-multilingual-ai-translation")) ||
                error.message.includes(__("Invalid URL format", "linguator-multilingual-ai-translation")) ||
                error.message.includes(__("Invalid domain format", "linguator-multilingual-ai-translation")) ||
                error.message.includes(__("Duplicate domain host", "linguator-multilingual-ai-translation")) ||
                error.message.includes("domain") || error.message.includes("Domain")) {
                toast.error(error.message);
            } else if (error.message.includes(__("Linguator was unable to access", "linguator-multilingual-ai-translation"))) {
                toast.error(error.message);
            } else {
                toast.error(error.message || __("Something went wrong", "linguator-multilingual-ai-translation"));
            }
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
            <Container className='bg-white p-10 rounded-lg' cols="1" containerType='grid'>
                <Container className='flex items-center'>
                    <Container.Item className='flex w-full justify-between px-4 gap-6'>
                        <h1 className='font-bold'>General Settings</h1>
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
                {/* URL modifications section */}
                <Container cols="1" containerType='grid' className='border border-b-2' >
                    <Container.Item>
                        <Label size='md' className='font-bold flex items-center gap-2'>
                            <Link className="flex-shrink-0 size-5 text-icon-secondary" />
                            {__('Language URL format', 'linguator-multilingual-ai-translation')}
                        </Label>
                        <Label variant='help'>{__('Choose how to decide which language your visitors will see.', 'linguator-multilingual-ai-translation')}</Label>
                    </Container.Item>
                    <Container cols="2" containerType='grid'>
                        <Container.Item >
                            <RadioButton.Group
                                columns={1}
                                size="sm">
                                {
                                    urlCheckboxes.map((checkbox, index) => (
                                        <RadioButton.Button
                                            badgeItem={<Badge className="mr-2" size="sm" type="rounded" variant="green" />}
                                            label={{
                                                heading: checkbox.heading,
                                                description: (
                                                    <>
                                                        {checkbox.description}
                                                        {checkbox.description2 && (
                                                            <>
                                                                <br />
                                                                {checkbox.description2}
                                                            </>
                                                        )}
                                                    </>
                                                )
                                            }}
                                            reversePosition={true}
                                            value={checkbox.value}
                                            key={index}
                                            checked={forceLang === checkbox.value}
                                            onChange={() => {
                                                setForceLang(checkbox.value);
                                            }}
                                        />
                                    ))
                                }
                            </RadioButton.Group>
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
                        </Container.Item>
                        {/* Hide URL language information for default language */}
                        <Container.Item>
                            {
                                forceLang !== 3 &&
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
                            {/* Remove or Keep /language/ in pretty permalinks */}
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

                        </Container.Item>
                    </Container>

                </Container>
                <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
                {/* Custom Post Types section */}
                <Container cols="1" containerType='grid' >
                    <Container.Item className='switcher'>
                       <div>
                         <Label size='md' className='font-bold flex items-center gap-2'>
                            <Milestone className="flex-shrink-0 size-5 text-icon-secondary" />
                            {__('Custom Post Types', 'linguator-multilingual-ai-translation')}
                        </Label>
                        <p>{__("Choose the custom post types you want to enable for translation.For example, if you have a 'Portfolio' post type, check the box to enable it for translation.", 'linguator-multilingual-ai-translation')}</p>
                       </div>
                        {AvailablePostTypes.length > 0 && (
                            <div className='flex items-center justify-end gap-2' style={{paddingRight: '30%'}}>
                                <Label size='sm' className='cursor-pointer' htmlFor="select-all-post-types">
                                    {__('Select All', 'linguator-multilingual-ai-translation')}
                                </Label>
                                <Switch
                                    aria-label="Select All Post Types"
                                    id="select-all-post-types"
                                    value={selectAllPostTypes}
                                    onChange={handleSelectAllPostTypes}
                                    size="sm"
                                />
                            </div>
                        )}
                    </Container.Item>
                    <Container.Item className='flex gap-4 flex-wrap'>
                        {
                            AvailablePostTypes.length == 0 ?
                                <div style={{ color: "red" }}>
                                    {__('No Custom Post Types Available', 'linguator-multilingual-ai-translation')}
                                </div> :
                                <div className='flex gap-4 flex-wrap'>
                                    {
                                        AvailablePostTypes.map((postType, index) => {
                                            const isDisabled = Array.isArray(disabledPostTypes) && disabledPostTypes.some(disabledType => {
                                                // Handle both string and object formats
                                                const postTypeKey = typeof disabledType === 'object' ? disabledType.post_type_key : disabledType;
                                                return postTypeKey === postType.value;
                                            });
                                            return (
                                                <Checkbox
                                                    label={{
                                                        description: '',
                                                        heading: postType.label + (isDisabled ? ' (Programmatically Active)' : '')
                                                    }}
                                                    className={isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                                                    value={postType.value}
                                                    checked={isDisabled ? true : selectedPostTypes.includes(postType.value)}
                                                    disabled={isDisabled}
                                                    key={index}
                                                    size="sm"
                                                    onChange={() => handlePostTypeChange(postType.value)}
                                                />
                                            );
                                        })
                                    }
                                </div>
                        }
                    </Container.Item>
                </Container>
                <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
                {/* Custom Taxonomies section */}
                <Container cols="1" containerType='grid' >
                    <Container.Item className='switcher'>
                        <div>
                            <Label size='md' className='font-bold flex items-center gap-2'>
                            <Milestone className="flex-shrink-0 size-5 text-icon-secondary" />
                            {__('Custom Taxonomies', 'linguator-multilingual-ai-translation')}
                        </Label>
                        <p>{__('Choose the Custom Taxonomies you want to enable for translation', 'linguator-multilingual-ai-translation')}</p>
                        </div>
                        {AvailableTaxonomies.length > 0 && (
                            <div className='flex items-center justify-end gap-2' style={{paddingRight: '30%'}}>
                                <Label size='sm' className='cursor-pointer' htmlFor="select-all-taxonomies">
                                    {__('Select All', 'linguator-multilingual-ai-translation')}
                                </Label>
                                <Switch
                                    aria-label="Select All Taxonomies"
                                    id="select-all-taxonomies"
                                    value={selectAllTaxonomies}
                                    onChange={handleSelectAllTaxonomies}
                                    size="sm"
                                />
                            </div>
                        )}
                    </Container.Item>
                    <Container.Item className='flex gap-4 flex-wrap'>
                        {
                            AvailableTaxonomies.length == 0 ?
                                <div style={{ color: "red" }}>
                                    {__('No Custom Taxonomies Available', 'linguator-multilingual-ai-translation')}
                                </div> :
                                <div className='flex gap-4 flex-wrap'>
                                    {
                                        AvailableTaxonomies.map((taxonomy, index) => (
                                            <Checkbox
                                                label={{
                                                    description: '',
                                                    heading: taxonomy.label
                                                }}
                                                className='cursor-pointer'
                                                value={taxonomy.value}
                                                checked={selectedTaxonomies.includes(taxonomy.value)}
                                                key={index}
                                                size="sm"
                                                onChange={() => handleTaxonomyChange(taxonomy.value)}
                                            />
                                        ))
                                    }
                                </div>
                        }
                    </Container.Item>
                </Container>
                <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
                {/* Synchronization section */}
                <Container cols="1" containerType='grid' >
                    <Container.Item className='switcher'>
                        <div>
                        <Label size='md' className='font-bold flex items-center gap-2'>
                            <RefreshCcw className="flex-shrink-0 size-5 text-icon-secondary" />
                            {__('Synchronization', 'linguator-multilingual-ai-translation')}
                        </Label>
                        <p>{__('Choose synchronization options for translated content.', 'linguator-multilingual-ai-translation')}</p>
                        </div>
                        <div className='flex items-center justify-end  gap-2' style={{paddingRight: '30%'}}>
                            <Label size='sm' className='cursor-pointer' htmlFor="select-all-sync">
                                {__('Select All', 'linguator-multilingual-ai-translation')}
                            </Label>

                            <Switch
                                        aria-label="Select All Synchronization"
                                        id="select-all-sync"
                                        value={selectAllSync}
                                        onChange={handleSelectAllSync}
                                        size="sm"
                                    />
                            
                        </div>
                    </Container.Item>
                    <Container.Item className='flex gap-6 flex-wrap'>
                        {
                            synchronizations.map((synchronization, index) => (
                                <Checkbox
                                    label={{
                                        description: '',
                                        heading: synchronization.label
                                    }}
                                    className='cursor-pointer'
                                    value={synchronization.value}
                                    key={index}
                                    checked={selectedSynchronization.includes(synchronization.value)}
                                    size="sm"
                                    onChange={() => handleSynchronizationChange(synchronization.value)}
                                />
                            ))
                        }
                    </Container.Item>
                </Container>
                <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
                {/* Detect Browser Language section */}
                <div className='switcher'>
                    <Container.Item >
                        <h3 className='flex items-center gap-2'>
                            <Globe className="flex-shrink-0 size-5 text-icon-secondary" />
                            {__('Detect Browser Language', 'linguator-multilingual-ai-translation')}
                        </h3>
                        <p>
                            {__('When visitors open your homepage, Linguator sends them to their preferred language. To avoid issues, homepage caching is turned off for supported cache plugins.', 'linguator-multilingual-ai-translation')}
                        </p>
                    </Container.Item>
                    <Container.Item className='flex items-center justify-end' style={{paddingRight: '30%'}}>
                        {
                            forceLang === 3 ?
                                <Switch
                                    aria-label="Switch Element"
                                    id="browser-support"
                                    onChange={() => {
                                        setBrowser(!browser)

                                    }}
                                    disabled={true}
                                    value={browser}
                                    size="sm"
                                /> :
                                <Switch
                                    aria-label="Switch Element"
                                    id="browser-support"
                                    onChange={() => {
                                        setBrowser(!browser)
                                    }}
                                    value={browser}
                                    size="sm"
                                />
                        }
                    </Container.Item>
                </div>
                
                <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
                {/* Media section */}
                <div className='switcher'>
                    <Container.Item>
                        <h3 className='flex items-center gap-2'>
                            <Focus className="flex-shrink-0 size-5 text-icon-secondary" />
                            {__('Media', 'linguator-multilingual-ai-translation')}
                        </h3>
                        <p>
                            {__('Turn on media translation only if you need to translate titles, alt text, captions, or descriptions. The original file stays the same.', 'linguator-multilingual-ai-translation')}
                        </p>
                    </Container.Item>
                    <Container.Item className='flex items-center justify-end' style={{paddingRight: '30%'}}>
                        <Switch
                            aria-label="Switch Element"
                            id="media-support"
                            onChange={() => {
                                setMediaSupport(!mediaSupport)
                            }}
                            size="sm"
                            value={mediaSupport}
                        />
                    </Container.Item>
                </div>
                <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
                {/* Static Strings Tab section */}
                <div className='switcher'>
                    <Container.Item>
                        <h3 className='flex items-center gap-2'>
                            <Settings2 className="flex-shrink-0 size-5 text-icon-secondary" />
                            {__('Static Strings Tab', 'linguator-multilingual-ai-translation')}
                        </h3>
                        <p>
                            {__('Show or hide the Static Strings tab in the admin menu. This tab allows you to translate static strings from your theme and plugins.', 'linguator-multilingual-ai-translation')}
                        </p>
                    </Container.Item>
                    <Container.Item className='flex items-center justify-end' style={{paddingRight: '30%'}}>
                        <Switch
                            aria-label="Switch Element"
                            id="static-strings-visibility"
                            onChange={() => {
                                setStaticStringsVisibility(!staticStringsVisibility)
                            }}
                            size="sm"
                            value={staticStringsVisibility}
                        />
                    </Container.Item>
                </div>

                
                
                {data.lmat_feedback_data !== undefined && (
                    <>
                        <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
                        <div className='switcher'>
                            <Container.Item>
                                <h3 className='flex items-center gap-2'>
                                    <Share2 className="flex-shrink-0 size-5 text-icon-secondary" />
                                    {__('Usage Data Sharing', 'linguator-multilingual-ai-translation')}
                                </h3>
                                <div>
                                    <p>{__('Help us make this plugin more compatible with your site by sharing non-sensitive site data.', 'linguator-multilingual-ai-translation')}</p>
                                    <a href="#" className="lmat-see-terms" onClick={handleTermsToggle}>[{showTerms ? 'Hide terms' : 'See terms'}]</a>
                                    <div id="termsBox" className="lmat-terms-box" style={{display: showTerms ? 'block' : 'none', paddingLeft: '20px', marginTop: '10px', fontSize: '12px', color: '#999'}}>
                                        <p>{__("Opt in to receive email updates about security improvements, new features, helpful tutorials, and occasional special offers. We'll collect:", 'linguator-multilingual-ai-translation')} <a href='https://my.coolplugins.net/terms/usage-tracking/' target='_blank' rel="noopener noreferrer">Click Here</a></p>
                                        <ul style={{listStyleType: 'auto', paddingLeft: '20px'}}>
                                            <li>{__("Your website home URL and WordPress admin email.", 'linguator-multilingual-ai-translation')}</li>
                                            <li>{__("To check plugin compatibility, we will collect the following: list of active plugins and themes, server type, MySQL version, WordPress version, memory limit, site language and database prefix.", 'linguator-multilingual-ai-translation')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </Container.Item>
                            <Container.Item className='flex items-center justify-end' style={{paddingRight: '30%'}}>
                                <Switch
                                    aria-label="Switch Element"
                                    id="lmat_feedback_data"
                                    onChange={() => {
                                        
                                        setLmatFeedbackData(!lmatFeedbackData)
                                    }}
                                    size="sm"
                                    value={lmatFeedbackData}
                                />
                            </Container.Item>
                        </div>
                    </>
                )}
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
        </>
    )
}

export default General