/**
 * Post Editor sidebar bootstrap
 */

import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { PanelBody, SelectControl, TextControl, Flex, FlexItem, Icon, ExternalLink } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { Plus, Pencil } from 'lucide-react';

const SIDEBAR_NAME = 'lmat-post-sidebar';

const LanguageIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 2a8 8 0 0 1 7.75 6h-3.2a9.9 9.9 0 0 0-2.01-3.61A7.94 7.94 0 0 1 12 4Zm-2.54 2.05A7.88 7.88 0 0 1 12 6c.38 0 .76.03 1.13.08A7.9 7.9 0 0 1 15.2 10H8.8a7.9 7.9 0 0 1 1.66-3.95ZM4.25 12a8 8 0 0 1 1.2-4h3.2A9.9 9.9 0 0 0 6.64 12Zm3.35 2h8.8a7.9 7.9 0 0 1-2.07 3.92A8.02 8.02 0 0 1 5.45 14ZM12 20a8 8 0 0 1-7.75-6h3.2a9.9 9.9 0 0 0 2.01 3.61A7.94 7.94 0 0 1 12 20Zm2.36-2.05A7.88 7.88 0 0 1 12 18c-.38 0-.76-.03-1.13-.08A7.9 7.9 0 0 1 8.8 14h6.4a7.9 7.9 0 0 1-1.66 3.95Z"/>
        <path fill="currentColor" d="M19 7h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 0 0 0 2h1.59a6.5 6.5 0 0 1-2.43 3.5 1 1 0 1 0 1.19 1.6A8.5 8.5 0 0 0 16 9h1v1a1 1 0 0 0 2 0V9h1a1 1 0 0 0 0-2Z"/>
    </svg>
);

const getSettings = () => {
    // Provided by PHP in Abstract_Screen::enqueue via wp_add_inline_script
    // Inline script declares: let lmat_block_editor_plugin_settings = {...}
    // Top-level 'let' is not a window property; read the lexical global if present.
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
                        onChange={ () => {} }
                        help={ undefined }
                        options={ options.map( ( opt ) => ( { label: opt.label, value: opt.value } ) ) }
                        // Keep read-only for now; changing language requires server actions.
                        disabled
                    />
                </FlexItem>
            </Flex>
        </PanelBody>
    );
};

const TranslationRow = ( { row } ) => {
    const { lang, translated_post, links } = row;
    const title = translated_post?.title || '';
    const hasEdit = !! links?.edit_link;
    const hasAdd = !! links?.add_link;
    return (
        <Flex align="center" style={ { marginBottom: 8 } }>
            <FlexItem>
                { lang?.flag_url ? (
                    <img src={ lang.flag_url } alt={ lang?.name || '' } style={ { width: 18, height: 12 } } />
                ) : null }
            </FlexItem>
            <FlexItem style={ { flex: 1 } }>
                <TextControl value={ title } onChange={ () => {} } placeholder={ __( 'title', 'linguator-multilingual-ai-translation' ) } />
            </FlexItem>
            <FlexItem>
                { hasEdit ? (
                    <a href={ links.edit_link } aria-label={ __( 'Edit translation', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8 } }>
                        <Pencil />
                    </a>
                ) : null }
                { ! hasEdit && hasAdd ? (
                    <a href={ links.add_link } aria-label={ __( 'Add translation', 'linguator-multilingual-ai-translation' ) } style={ { marginLeft: 8 } }>
                        <Plus />
                    </a>
                ) : null }
            </FlexItem>
        </Flex>
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

registerPlugin( SIDEBAR_NAME, { render: Sidebar, icon: LanguageIcon } );


