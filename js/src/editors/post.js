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

// const LanguageIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 44 44"><path d="M31.81 18.162v5.274c0 2.39-1.94 4.33-4.329 4.33H15.585a4.33 4.33 0 0 1-4.329-4.33v-5.274a4.33 4.33 0 0 1 4.329-4.329h11.896a4.33 4.33 0 0 1 4.329 4.329m-2.25 2.637a4.336 4.336 0 0 0-4.334-4.334H17.84a4.336 4.336 0 0 0-4.334 4.334 4.336 4.336 0 0 0 4.334 4.334h7.386a4.336 4.336 0 0 0 4.334-4.334"/><ellipse cx="11.256" cy="20.799" rx="1.435" ry="2.689"/><ellipse cx="31.81" cy="20.799" rx="1.435" ry="2.689"/><circle cx="17.684" cy="20.799" r="2.258"/><circle cx="25.382" cy="20.799" r="2.258"/><path d="m21.854 10.289-1.402 5.157 1.366-.018 1.414-4.996z"/><path d="M22.678 9.158a1.644 1.644 0 0 1 1.161 2.011 1.643 1.643 0 1 1-1.161-2.011"/><path d="M27.347 42.27c-1.85.519-3.8.796-5.814.796C9.649 43.066 0 33.417 0 21.533S9.649 0 21.533 0s21.533 9.649 21.533 21.533c0 2.517-.433 4.934-1.228 7.181h-2.251a19.4 19.4 0 0 0 1.372-7.181c0-10.722-8.704-19.427-19.426-19.427S2.106 10.811 2.106 21.533s8.705 19.426 19.427 19.426c2.045 0 4.016-.316 5.868-.903z"/><path d="M28.655 29.976h5.857a43 43 0 0 0-.589-1.765l2.144-.435q.526 1.395.799 2.2h5.339v1.892h-2.081q-1.058 3.181-3.048 5.374 2.159 1.492 5.325 2.277-1.163 1.416-1.541 2.06-3.202-1.072-5.437-2.831-2.25 1.696-5.521 2.915a22 22 0 0 0-1.402-2.032q3.147-.981 5.269-2.424-2.018-2.249-2.858-5.339h-2.256zm9.087 1.892h-4.666a9.9 9.9 0 0 0 2.34 3.973 9.6 9.6 0 0 0 2.326-3.973" style="fill-rule:nonzero"/></svg>
// );

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


