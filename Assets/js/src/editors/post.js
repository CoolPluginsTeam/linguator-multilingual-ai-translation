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


