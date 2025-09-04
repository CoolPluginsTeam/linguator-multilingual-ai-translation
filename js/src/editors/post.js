/**
 * Post Editor sidebar bootstrap
 */

import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { PanelBody, SelectControl, TextControl, Flex, FlexItem, Icon, ExternalLink } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { Plus, Pencil } from 'lucide-react';
import LinguatorIcon from '@linguator-menu-icon.svg';

const SIDEBAR_NAME = 'lmat-post-sidebar';

const LanguageIcon = () => <LinguatorIcon width="20" height="20" style={{ display: 'block' }} />;

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


