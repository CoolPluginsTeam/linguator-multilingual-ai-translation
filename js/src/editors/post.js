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
import { Plus, Pencil } from 'lucide-react';

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
                        <img src={ lang.flag_url } alt={ lang?.name || '' } className="flag" style={ { marginRight: 8 } } />
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
                <FlexItem style={{paddingTop:'8px'}}>
                    { lang?.flag_url ? (
                        <img src={ lang.flag_url } alt={ lang?.name || '' } style={ { width: 18, height: 12 } } />
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
                                    : __( 'Type a title to create/update this translation (auto-saves).', 'linguator-multilingual-ai-translation' )
                                  )
                                : __( 'Existing title. Use the Edit button to modify content.', 'linguator-multilingual-ai-translation' )
                        }
                    />
                </FlexItem>
                <FlexItem style={{paddingTop:'8px'}}>
                    { hasEdit ? (
                        <a href={ links.edit_link } aria-label={ __( 'Edit translation', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8,height: "100%",width: "100%",display: "flex",alignItems: "center",justifyContent: "center" } }>
                            <Pencil />
                        </a>
                    ) : null }
                    { ! hasEdit && (
                        selectedSuggestion ? (
                            <button onClick={ linkSelected } aria-label={ __( 'Link existing page', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8, background: 'transparent', border: 0, padding: 0, cursor: 'pointer' } }>
                                <Plus />
                            </button>
                        ) : (
                            hasAdd ? (
                                (title || '').trim().length > 0 ? (
                                    <button onClick={ createFromTyped } aria-label={ __( 'Create translation from typed title', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8, background: 'transparent', border: 0, padding: 0, cursor: 'pointer' } }>
                                        <Plus />
                                    </button>
                                ) : (
                                    <a href={ links.add_link } aria-label={ __( 'Add translation', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8,height: "100%",width: "100%",display: "flex",alignItems: "center",justifyContent: "center" } }>
                                        <Plus />
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
            <PluginSidebar name={ SIDEBAR_NAME } title={ __( 'Languages', 'linguator-multilingual-ai-translation' ) }>
                <LanguageSection lang={ lang } allLanguages={ translations } />
                <TranslationsSection translations={ translations } />
            </PluginSidebar>
        </>
    );
};

// Small pinned icon that shows the current page language flag in the editor header.
const FlagPin = () => {
    const settings = getSettings();
    const lang = settings?.lang || null;
    return (
        <>
            <PluginSidebar name={ 'lmat-flag-pin' } title={ __( 'Language', 'linguator-multilingual-ai-translation' ) }>
                <div style={{ padding: 12 }}>
                    { lang?.flag_url ? (
                        <img src={ lang.flag_url } alt={ lang?.name || '' } style={{ width: 24, height: 16, marginRight: 8 }} />
                    ) : null }
                    <div>{ lang?.name || '' }</div>
                </div>
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

registerPlugin( SIDEBAR_NAME, { render: Sidebar, icon: <svg 
    xmlns="http://www.w3.org/2000/svg" 
    xmlSpace="preserve" 
    style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: 2
    }} 
    viewBox="0 0 44 44"
    width="20"
    height="20"
>
    <path d="M31.81 18.162v5.274c0 2.39-1.94 4.33-4.329 4.33H15.585a4.33 4.33 0 0 1-4.329-4.33v-5.274a4.33 4.33 0 0 1 4.329-4.329h11.896a4.33 4.33 0 0 1 4.329 4.329m-2.25 2.637a4.336 4.336 0 0 0-4.334-4.334H17.84a4.336 4.336 0 0 0-4.334 4.334 4.336 4.336 0 0 0 4.334 4.334h7.386a4.336 4.336 0 0 0 4.334-4.334"/>
    <ellipse cx="11.256" cy="20.799" rx="1.435" ry="2.689"/>
    <ellipse cx="31.81" cy="20.799" rx="1.435" ry="2.689"/>
    <circle cx="17.684" cy="20.799" r="2.258"/>
    <circle cx="25.382" cy="20.799" r="2.258"/>
    <path d="m21.854 10.289-1.402 5.157 1.366-.018 1.414-4.996z"/>
    <path d="M22.678 9.158a1.644 1.644 0 0 1 1.161 2.011 1.643 1.643 0 1 1-1.161-2.011"/>
    <path d="M27.347 42.27c-1.85.519-3.8.796-5.814.796C9.649 43.066 0 33.417 0 21.533S9.649 0 21.533 0s21.533 9.649 21.533 21.533c0 2.517-.433 4.934-1.228 7.181h-2.251a19.4 19.4 0 0 0 1.372-7.181c0-10.722-8.704-19.427-19.426-19.427S2.106 10.811 2.106 21.533s8.705 19.426 19.427 19.426c2.045 0 4.016-.316 5.868-.903z"/>
    <path d="M28.655 29.976h5.857a43 43 0 0 0-.589-1.765l2.144-.435q.526 1.395.799 2.2h5.339v1.892h-2.081q-1.058 3.181-3.048 5.374 2.159 1.492 5.325 2.277-1.163 1.416-1.541 2.06-3.202-1.072-5.437-2.831-2.25 1.696-5.521 2.915a22 22 0 0 0-1.402-2.032q3.147-.981 5.269-2.424-2.018-2.249-2.858-5.339h-2.256zm9.087 1.892h-4.666a9.9 9.9 0 0 0 2.34 3.973 9.6 9.6 0 0 0 2.326-3.973" style={{fillRule: "nonzero"}}/>
</svg> } );

// Register the pinned language flag button (appears in the header toolbar)
registerPlugin( 'lmat-flag-pin', { render: FlagPin, icon: FlagIcon } );
