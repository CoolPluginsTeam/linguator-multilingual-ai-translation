/**
 * Post Editor sidebar bootstrap
 */

import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import {
    PanelBody,
    SelectControl,
    TextControl,
    Flex,
    FlexItem,
    Icon,
    ExternalLink,
    Spinner,
    Notice
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useMemo, useState, useRef, useCallback } from '@wordpress/element';
import { select } from '@wordpress/data';
import { CirclePlus, SquarePen } from 'lucide-react';

const SIDEBAR_NAME = 'lmat-post-sidebar';

/**
 * Simple debounce hook
 */
const useDebouncedCallback = (callback, delay = 2000) => {
    const timer = useRef(null);
    const cbRef = useRef(callback);
    cbRef.current = callback;

    const debounced = useCallback((...args) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            cbRef.current(...args);
        }, delay);
    }, [delay]);

    // optional: clear on unmount
    const cancel = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, []);

    return [debounced, cancel];
};

const getSettings = () => {
    // Provided by PHP in Abstract_Screen::enqueue via wp_add_inline_script
    try {
        // eslint-disable-next-line no-undef
        if ( typeof lmat_block_editor_plugin_settings !== 'undefined' ) {
            // eslint-disable-next-line no-undef
            return lmat_block_editor_plugin_settings;
        }
    } catch (e) {}
    if ( typeof window !== 'undefined' && window.lmat_block_editor_plugin_settings ) {
        return window.lmat_block_editor_plugin_settings;
    }
    return { lang: null, translations_table: {} };
};

const LanguageSection = ( { lang, allLanguages } ) => {
    const options = useMemo( () => {
        const list = [];
        if ( lang ) {
            list.push( { label: lang.name, value: lang.slug, flag_url: lang.flag_url } );
        }
        Object.values( allLanguages ).forEach( ( row ) => {
            list.push( { label: row.lang.name, value: row.lang.slug, flag_url: row.lang.flag_url } );
        } );
        return list;
    }, [ lang, allLanguages ] );

    return (
        <PanelBody title={ __( 'Language', 'linguator-multilingual-ai-translation' ) } initialOpen >
            <Flex align="center">
                <FlexItem>
                    { lang?.flag_url ? (
                        <img src={ lang.flag_url } alt={ lang?.name || '' } className="flag" style={ { marginRight: 8, width: 20, height: 14 } } />
                    ) : null }
                </FlexItem>
                <FlexItem style={ { flex: 1 } }>
                    <SelectControl
                        label={ undefined }
                        value={ lang?.slug || '' }
                        onChange={ ( value ) => {
                            // If selecting the current language, do nothing.
                            if ( ! value || ( lang && value === lang.slug ) ) {
                                return;
                            }
                            // Look up the selected language row in translations table
                            const selected = allLanguages?.[ value ];
                            if ( selected && selected.links ) {
                                const target = selected.links.edit_link || selected.links.add_link;
                                if ( target ) {
                                    window.location.href = target;
                                }
                            }
                        } }
                        help={ undefined }
                        options={ options.map( ( opt ) => ( { label: opt.label, value: opt.value } ) ) }
                        // Changing language navigates to the corresponding edit/add page.
                    />
                </FlexItem>
            </Flex>
        </PanelBody>
    );
};

const TranslationRow = ( { row } ) => {
    const { lang, translated_post, links } = row;
    const initialTitle = translated_post?.title || '';
    const [title, setTitle] = useState(initialTitle);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [allPages, setAllPages] = useState([]);
    const [loadingPages, setLoadingPages] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [linking, setLinking] = useState(false);

    const editable = !initialTitle; // editable only if there is no value initially

    // Debounced save
    const [debouncedSave] = useDebouncedCallback(async (nextTitle) => {
        // Guard: don’t send empty or whitespace-only titles
        const clean = (nextTitle || '').trim();
        if (!clean) return;

        try {
            setSaving(true);
            setError('');

            // Example payload — adjust to match your PHP route/handler.
            // Expect your server to create/update a placeholder translation record’s title.
            await apiFetch({
                path: '/lmat/v1/translation-title',
                method: 'POST',
                data: {
                    postId: translated_post?.id || null, // if you have it
                    lang: lang?.slug,
                    title: clean,
                },
            });

            setSaving(false);
        } catch (e) {
            setSaving(false);
            setError( __( 'Failed to save title. Please try again.', 'linguator-multilingual-ai-translation' ) );
            // Optional: console.error(e);
        }
    }, 2000);

    const hasEdit = !! links?.edit_link;
    const hasAdd = !! links?.add_link;

    const loadAllPages = useCallback(async () => {
        if (loadingPages || allPages.length > 0) return;
        try {
            setLoadingPages(true);
            const pages = await apiFetch({ path: '/lmat/v1/languages/utils/get_all_pages_data' });
            setAllPages(Array.isArray(pages) ? pages : []);
        } catch (e) {
            // ignore
        } finally {
            setLoadingPages(false);
        }
    }, [loadingPages, allPages.length]);

    const computeSuggestions = useCallback((query) => {
        const q = (query || '').trim().toLowerCase();
        if (!q) return [];
        return allPages.filter((p) => {
            const sameLang = p?.language?.slug === lang?.slug;
            const unlinked = !p?.is_linked;
            const matches = (p?.title || '').toLowerCase().includes(q) || (p?.slug || '').toLowerCase().includes(q);
            return sameLang && unlinked && matches;
        }).slice(0, 10);
    }, [allPages, lang?.slug]);

    const handleTitleChange = (val) => {
        setTitle(val);
        setSelectedSuggestion(null);
        if (editable) {
            if (val && val.trim().length > 1) {
                if (allPages.length === 0) {
                    loadAllPages().then(() => {
                        setSuggestions(computeSuggestions(val));
                    });
                } else {
                    setSuggestions(computeSuggestions(val));
                }
            } else {
                setSuggestions([]);
            }
        }
    };

    const linkSelected = async (e) => {
        e.preventDefault();
        if (!selectedSuggestion) return;
        try {
            setLinking(true);
            setError('');
            const postId = select('core/editor')?.getCurrentPostId?.();
            await apiFetch({
                path: '/lmat/v1/languages/link-translation',
                method: 'POST',
                data: {
                    source_id: postId,
                    target_id: selectedSuggestion.ID,
                    target_lang: lang?.slug,
                },
            });
            window.location.reload();
        } catch (e) {
            setError( __( 'Failed to link page. Please try again.', 'linguator-multilingual-ai-translation' ) );
        } finally {
            setLinking(false);
        }
    };

    const createFromTyped = async (e) => {
        e.preventDefault();
        const clean = (title || '').trim();
        if (!clean) {
            // Fallback: if no title, navigate to add page
            if (links?.add_link) {
                window.location.href = links.add_link;
            }
            return;
        }
        try {
            setLinking(true);
            setError('');
            const postId = select('core/editor')?.getCurrentPostId?.();
            const postType = select('core/editor')?.getCurrentPostType?.();
            await apiFetch({
                path: '/lmat/v1/languages/create-translation',
                method: 'POST',
                data: {
                    source_id: postId,
                    target_lang: lang?.slug,
                    title: clean,
                    post_type: postType || 'page',
                },
            });
            // Refresh to reflect new translation and show Edit icon
            window.location.reload();
        } catch (e) {
            setError( __( 'Failed to create page. Please try again.', 'linguator-multilingual-ai-translation' ) );
        } finally {
            setLinking(false);
        }
    };

    return (
        <div style={{ marginBottom: 12 }}>
            <Flex align="center" style={ { marginBottom: 8, alignItems: 'start' } }>
                <FlexItem style={{paddingTop:'14px'}}>
                    { lang?.flag_url ? (
                        <img src={ lang.flag_url } alt={ lang?.name || '' } style={ { width: 20, height: 14 } } />
                    ) : null }
                </FlexItem>
                <FlexItem style={ { flex: 1,padding:'0px' } }>
                    <TextControl
                        value={ title }
                        onChange={ handleTitleChange }
                        placeholder={ __( 'title', 'linguator-multilingual-ai-translation' ) }
                        readOnly={ !editable }
                        disabled={ !editable }
                        help={
                            editable
                                ? ( saving
                                    ? __( 'Saving…', 'linguator-multilingual-ai-translation' )
                                    : __( 'Type title to save translation.', 'linguator-multilingual-ai-translation' )
                                  )
                                : __( 'Modify title via Edit.', 'linguator-multilingual-ai-translation' )
                        }
                    />
                </FlexItem>
                <FlexItem style={{paddingTop:'14px'}}>
                    { hasEdit ? (
                        <a href={ links.edit_link } aria-label={ __( 'Edit translation', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8,height: "100%",width: "100%",display: "flex",alignItems: "center",justifyContent: "center" } }>
                            <SquarePen size={20} />
                        </a>
                    ) : null }
                    { ! hasEdit && (
                        selectedSuggestion ? (
                            <button onClick={ linkSelected } aria-label={ __( 'Link existing page', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8, background: 'transparent', border: 0, padding: 0, cursor: 'pointer' } }>
                                <CirclePlus size={20} />
                            </button>
                        ) : (
                            hasAdd ? (
                                (title || '').trim().length > 0 ? (
                                    <button onClick={ createFromTyped } aria-label={ __( 'Create translation from typed title', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8, background: 'transparent', border: 0, padding: 0, cursor: 'pointer' } }>
                                        <CirclePlus size={20} />
                                    </button>
                                ) : (
                                    <a href={ links.add_link } aria-label={ __( 'Add translation', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8,height: "100%",width: "100%",display: "flex",alignItems: "center",justifyContent: "center" } }>
                                        <CirclePlus size={20} />
                                    </a>
                                )
                            ) : null
                        )
                    ) }
                    { saving || linking ? <Spinner style={{ marginLeft: 8 }} /> : null }
                </FlexItem>
            </Flex>
            { editable && suggestions.length > 0 ? (
                <div style={{ marginTop: 4 }}>
                    { suggestions.map((s) => (
                        <div key={ s.ID } style={{ padding: '4px 6px', cursor: 'pointer', background: selectedSuggestion?.ID === s.ID ? '#eef' : 'transparent' }}
                            onClick={() => setSelectedSuggestion(s)}
                            onMouseEnter={() => setSelectedSuggestion(s)}
                        >
                            { s.title } ({ s.slug })
                        </div>
                    )) }
                </div>
            ) : null }
            { error ? (
                <Notice status="error" isDismissible={ false }>
                    { error }
                </Notice>
            ) : null }
        </div>
    );
};

const TranslationsSection = ( { translations } ) => {
    const rows = Object.values( translations );
    return (
        <PanelBody title={ __( 'Translations', 'linguator-multilingual-ai-translation' ) } initialOpen >
            { rows.map( ( row ) => (
                <TranslationRow key={ row.lang.slug } row={ row } />
            ) ) }
        </PanelBody>
    );
};

const Sidebar = () => {
    const settings = getSettings();
    const lang = settings?.lang || null;
    const translations = settings?.translations_table || {};

    return (
        <>
            <PluginSidebarMoreMenuItem target={ SIDEBAR_NAME }>
                { __( 'Linguator', 'linguator-multilingual-ai-translation' ) }
            </PluginSidebarMoreMenuItem>
            <PluginSidebar name={ SIDEBAR_NAME } title={ __( 'Linguator', 'linguator-multilingual-ai-translation' ) }>
                <LanguageSection lang={ lang } allLanguages={ translations } />
                <TranslationsSection translations={ translations } />
            </PluginSidebar>
        </>
    );
};

// Compute a dynamic icon element for the flag pin
const FlagIcon = (() => {
    const settings = getSettings();
    const lang = settings?.lang || null;
    if ( lang?.flag_url ) {
        return <img src={ lang.flag_url } alt={ lang?.name || '' } style={{ width: 16, height: 11 }} />;
    }
    return <svg width="16" height="11" viewBox="0 0 16 11"><rect width="16" height="11" fill="#ddd"/></svg>;
})();

registerPlugin( SIDEBAR_NAME, { render: Sidebar, icon: FlagIcon } );


// Auto-open sidebar logic using editor ready event
const { subscribe } = wp.data;

// Check for lang parameter and auto-open sidebar
const params = new URLSearchParams(window.location.search);
const hasLangParam = params.has('lang') || params.has('new_lang');

if (hasLangParam) {
    let unsubscribe = null;
    let attempts = 0;
    const maxAttempts = 50;
    let sidebarOpened = false;
    
    const tryOpenSidebar = () => {
        attempts++;
        
        if (sidebarOpened) {
            return true;
        }
        
        try {
            const editPostStore = wp.data.select('core/edit-post');
            const editPostDispatch = wp.data.dispatch('core/edit-post');
            
            if (!editPostStore || !editPostDispatch) {
                return false;
            }
            
            // Try modern interface store if edit-post doesn't work
            const interfaceStore = wp.data.select('core/interface');
            const interfaceDispatch = wp.data.dispatch('core/interface');
            
            const target = `plugin-sidebar/${SIDEBAR_NAME}`;
            
            // Try multiple approaches to open the sidebar
            let openSuccess = false;
            
            // Method 1: Standard openGeneralSidebar
            if (typeof editPostDispatch.openGeneralSidebar === 'function') {
                try {
                    // Close any existing sidebar first
                    if (typeof editPostDispatch.closeGeneralSidebar === 'function') {
                        editPostDispatch.closeGeneralSidebar();
                    }
                    
                    // Close inserter if open
                    if (typeof editPostDispatch.setIsInserterOpened === 'function') {
                        editPostDispatch.setIsInserterOpened(false);
                    }
                    
                    editPostDispatch.openGeneralSidebar(target);
                    openSuccess = true;
                } catch (e) {
                    // Silent error handling
                }
            }
            
            // Method 2: Try interface store approach
            if (!openSuccess && interfaceDispatch && typeof interfaceDispatch.enableComplementaryArea === 'function') {
                try {
                    // First ensure the sidebar is enabled at the interface level
                    if (typeof interfaceDispatch.enableComplementaryArea === 'function') {
                        interfaceDispatch.enableComplementaryArea('core/edit-post', target);
                    }
                    
                    // Also try to set the pinned state if available
                    if (typeof interfaceDispatch.pinItem === 'function') {
                        interfaceDispatch.pinItem('core/edit-post', target);
                    }
                    
                    openSuccess = true;
                } catch (e) {
                    // Silent error handling
                }
            }
            
            // Method 2.5: Try to ensure the sidebar panel itself is open
            if (interfaceDispatch) {
                try {
                    // Try to enable the complementary area first
                    if (typeof interfaceDispatch.setDefaultComplementaryArea === 'function') {
                        interfaceDispatch.setDefaultComplementaryArea('core/edit-post', target);
                    }
                    
                    // Try to set the sidebar as active
                    if (typeof interfaceDispatch.setActiveComplementaryArea === 'function') {
                        interfaceDispatch.setActiveComplementaryArea('core/edit-post', target);
                    }
                } catch (e) {
                    // Silent error handling
                }
            }
            
            // Method 3: Try direct edit-post enableComplementaryArea
            if (!openSuccess && typeof editPostDispatch.enableComplementaryArea === 'function') {
                try {
                    editPostDispatch.enableComplementaryArea('core/edit-post', target);
                    openSuccess = true;
                } catch (e) {
                    // Silent error handling
                }
            }
            
            if (openSuccess) {
                // Verify if it worked after a delay
                setTimeout(() => {
                    let currentSidebar = null;
                    
                    // Check multiple ways to see if sidebar is open
                    if (editPostStore.getActiveComplementaryArea) {
                        currentSidebar = editPostStore.getActiveComplementaryArea('core/edit-post');
                    }
                    
                    if (!currentSidebar && interfaceStore && interfaceStore.getActiveComplementaryArea) {
                        currentSidebar = interfaceStore.getActiveComplementaryArea('core/edit-post');
                    }
                    
                    if (currentSidebar === target) {
                        // Even though API says it's open, let's ensure the visual sidebar is actually visible
                        setTimeout(() => {
                            // Check if sidebar panel is actually visible
                            const sidebarPanel = document.querySelector('.interface-complementary-area, .edit-post-sidebar, .components-panel');
                            const sidebarContainer = document.querySelector('.interface-interface-skeleton__sidebar, .edit-post-layout__sidebar');
                            
                            if (sidebarPanel) {
                                const isVisible = sidebarPanel.offsetParent !== null && !sidebarPanel.hidden;
                                
                                if (!isVisible) {
                                    // Force sidebar panel visibility
                                    sidebarPanel.style.display = 'block';
                                    sidebarPanel.style.visibility = 'visible';
                                    sidebarPanel.style.opacity = '1';
                                    sidebarPanel.hidden = false;
                                    
                                    if (sidebarContainer) {
                                        sidebarContainer.style.display = 'block';
                                        sidebarContainer.style.visibility = 'visible';
                                        sidebarContainer.style.width = '280px';
                                    }
                                }
                            }
                            
                            // Also try to click the sidebar toggle button if sidebar is still not visible
                            setTimeout(() => {
                                const sidebarToggle = document.querySelector('button[aria-label*="Settings"], .edit-post-header__settings button, button[data-label*="Settings"]');
                                const sidebarStillHidden = !document.querySelector('.interface-complementary-area:not([hidden])');
                                
                                if (sidebarToggle && sidebarStillHidden) {
                                    sidebarToggle.click();
                                    
                                    // Then try to click our specific sidebar tab
                                    setTimeout(() => {
                                        const linguatorTab = document.querySelector('button[aria-label*="Linguator"], .components-button[aria-label*="Linguator"]');
                                        if (linguatorTab) {
                                            linguatorTab.click();
                                        }
                                    }, 300);
                                }
                            }, 200);
                        }, 100);
                        
                        sidebarOpened = true;
                        if (unsubscribe) {
                            unsubscribe();
                            unsubscribe = null;
                        }
                    } else {
                        // Try DOM-based verification
                        const sidebarElement = document.querySelector(`[data-sidebar="${SIDEBAR_NAME}"], .${SIDEBAR_NAME}`);
                        if (sidebarElement && sidebarElement.offsetParent !== null) {
                            sidebarOpened = true;
                            if (unsubscribe) {
                                unsubscribe();
                                unsubscribe = null;
                            }
                        }
                    }
                }, 500);
                
                return sidebarOpened;
            } else {
                // As a last resort, try to find and click the sidebar button in DOM
                setTimeout(() => {
                    const sidebarButton = document.querySelector(`button[aria-label*="Linguator"], button[data-label*="Linguator"], [data-sidebar="${SIDEBAR_NAME}"]`);
                    if (sidebarButton) {
                        sidebarButton.click();
                        
                        // Check if it worked
                        setTimeout(() => {
                            const sidebarElement = document.querySelector('.interface-complementary-area');
                            const isVisible = sidebarElement && sidebarElement.offsetParent !== null;
                            
                            if (isVisible) {
                                sidebarOpened = true;
                                if (unsubscribe) {
                                    unsubscribe();
                                    unsubscribe = null;
                                }
                            }
                        }, 300);
                    }
                }, 500);
            }
        } catch (e) {
            // Silent error handling
        }
        
        if (attempts >= maxAttempts) {
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
        }
        
        return false;
    };
    
    // Wait for editor to be ready before trying
    const waitForEditor = () => {
        // Try immediately first
        if (tryOpenSidebar()) {
            return;
        }
        
        // If immediate attempt fails, subscribe to store changes
        unsubscribe = subscribe(() => {
            if (!sidebarOpened && attempts < maxAttempts) {
                tryOpenSidebar();
            }
        });
        
        // Also try with regular intervals as a fallback
        const intervalAttempts = setInterval(() => {
            if (sidebarOpened || attempts >= maxAttempts) {
                clearInterval(intervalAttempts);
                return;
            }
            
            tryOpenSidebar();
        }, 1000); // Try every second
        
        // Cleanup after maximum time
        setTimeout(() => {
            if (intervalAttempts) {
                clearInterval(intervalAttempts);
            }
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
            // Cleanup completed
        }, 30000); // Give up after 30 seconds
    };
    
    // Start the process after a small delay to ensure everything is loaded
    setTimeout(waitForEditor, 500);
}