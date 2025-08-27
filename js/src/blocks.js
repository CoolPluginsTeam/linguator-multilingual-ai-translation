/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { Fragment } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { 
    PanelBody, 
    ToggleControl, 
    Disabled 
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { mapBlock } from '@wordpress/blocks';

/**
 * Translation icon - translation Dashicon.
 */
const TranslationIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 7H9.49c-.63 0-1.25.11-1.85.32-.62.23-1.19.58-1.69 1.04-.65.6-1.15 1.38-1.44 2.26-.52 1.58-.52 3.22 0 4.8H5.99c.28-.88.78-1.66 1.44-2.26.5-.46 1.07-.81 1.69-1.04.6-.21 1.22-.32 1.85-.32H11V7zm8 0h-1.5c.28-.88.78-1.66 1.44-2.26.5-.46 1.07-.81 1.69-1.04.6-.21 1.22-.32 1.85-.32H20V7h-1zm-8 6h1.5c-.28.88-.78 1.66-1.44 2.26-.5.46-1.07.81-1.69 1.04-.6.21-1.22.32-1.85.32H11v-3.62zm8 0H19v3.62c-.63 0-1.25-.11-1.85-.32-.62-.23-1.19-.58-1.69-1.04-.65-.6-1.15-1.38-1.44-2.26z"/>
    </svg>
);

/**
 * Language switcher block edit.
 */

// Debug: Log that the blocks script is loading
console.log('Linguator: blocks.js is executing');


// Get the settings from PHP
console.log('Linguator: Checking for lmat_block_editor_blocks_settings...', typeof lmat_block_editor_blocks_settings);
const i18nAttributeStrings = lmat_block_editor_blocks_settings;

function createLanguageSwitcherEdit(props) {
    const createToggleAttribute = function (propName) {
        return () => {
            const value = props.attributes[propName];
            const { setAttributes } = props;
            setAttributes({ [propName]: !value });
        };
    };

    const toggleDropdown = createToggleAttribute('dropdown');
    const toggleShowNames = createToggleAttribute('show_names');
    const toggleShowFlags = createToggleAttribute('show_flags');
    const toggleForceHome = createToggleAttribute('force_home');
    const toggleHideCurrent = createToggleAttribute('hide_current');
    const toggleHideIfNoTranslation = createToggleAttribute('hide_if_no_translation');

    const {
        dropdown,
        show_names,
        show_flags,
        force_home,
        hide_current,
        hide_if_no_translation
    } = props.attributes;

    function ToggleControlDropdown() {
        return (
            <ToggleControl
                label={i18nAttributeStrings.dropdown}
                checked={dropdown}
                onChange={toggleDropdown}
            />
        );
    }

    function ToggleControlShowNames() {
        return (
            <ToggleControl
                label={i18nAttributeStrings.show_names}
                checked={show_names}
                onChange={toggleShowNames}
            />
        );
    }

    function ToggleControlShowFlags() {
        return (
            <ToggleControl
                label={i18nAttributeStrings.show_flags}
                checked={show_flags}
                onChange={toggleShowFlags}
            />
        );
    }

    function ToggleControlForceHome() {
        return (
            <ToggleControl
                label={i18nAttributeStrings.force_home}
                checked={force_home}
                onChange={toggleForceHome}
            />
        );
    }

    function ToggleControlHideCurrent() {
        return (
            <ToggleControl
                label={i18nAttributeStrings.hide_current}
                checked={hide_current}
                onChange={toggleHideCurrent}
            />
        );
    }

    function ToggleControlHideIfNoTranslations() {
        return (
            <ToggleControl
                label={i18nAttributeStrings.hide_if_no_translation}
                checked={hide_if_no_translation}
                onChange={toggleHideIfNoTranslation}
            />
        );
    }

    return {
        ToggleControlDropdown,
        ToggleControlShowNames,
        ToggleControlShowFlags,
        ToggleControlForceHome,
        ToggleControlHideCurrent,
        ToggleControlHideIfNoTranslations
    };
}

/**
 * Register language switcher block.
 */

const blockTitle = __('Language switcher', 'linguator-multilingual-ai-translation');
const descriptionTitle = __('Add a language switcher to allow your visitors to select their preferred language.', 'linguator-multilingual-ai-translation');
const panelTitle = __('Language switcher settings', 'linguator-multilingual-ai-translation');

// Use WordPress's official domReady function instead of custom timing
const initializeBlocks = () => {
    console.log('Linguator: Initializing blocks using domReady approach');
    
    // Try using wp.blocks.registerBlockType directly instead of the imported function
    const registerBlockTypeFn = wp.blocks.registerBlockType;
    console.log('Linguator: Direct wp.blocks.registerBlockType available:', typeof registerBlockTypeFn);

    // Register the Language Switcher block as first level block in Block Editor.
console.log('Linguator: Attempting to register linguator/language-switcher block');

// Block registration system confirmed working

// Now try the real block with detailed parameter logging
console.log('Linguator: Block title:', blockTitle);
console.log('Linguator: Block description:', descriptionTitle);
console.log('Linguator: Block icon:', TranslationIcon);

const blockConfig = {
    title: blockTitle,
    description: descriptionTitle,
    icon: TranslationIcon,
    category: 'widgets',
    example: {},
    attributes: {
        dropdown: {
            type: 'boolean',
            default: false
        },
        show_names: {
            type: 'boolean',
            default: true
        },
        show_flags: {
            type: 'boolean',
            default: false
        },
        force_home: {
            type: 'boolean',
            default: false
        },
        hide_current: {
            type: 'boolean',
            default: false
        },
        hide_if_no_translation: {
            type: 'boolean',
            default: false
        }
    },
    edit: (props) => {
        const { dropdown } = props.attributes;
        const {
            ToggleControlDropdown,
            ToggleControlShowNames,
            ToggleControlShowFlags,
            ToggleControlForceHome,
            ToggleControlHideCurrent,
            ToggleControlHideIfNoTranslations
        } = createLanguageSwitcherEdit(props);

        // Simple placeholder preview instead of ServerSideRender to avoid REST API errors
        const blockProps = useBlockProps();
        
        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={panelTitle}>
                        <ToggleControlDropdown />
                        {!dropdown && <ToggleControlShowNames />}
                        {!dropdown && <ToggleControlShowFlags />}
                        <ToggleControlForceHome />
                        {!dropdown && <ToggleControlHideCurrent />}
                        <ToggleControlHideIfNoTranslations />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <div style={{ 
                        padding: '16px', 
                        backgroundColor: '#f0f0f0', 
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }}>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                            🌐 Language Switcher
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            {dropdown ? 'Dropdown Mode' : 'List Mode'} • 
                            Preview will show on frontend
                        </div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                            Configure options in the sidebar →
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    },
    save: () => {
        return null; // Server-side rendered
    }
};

console.log('Linguator: Full block config:', blockConfig);

try {
    // The block is already registered on the PHP side, we just need to add the edit component
    const existingBlock = wp.blocks.getBlockType('linguator/language-switcher');
    if (existingBlock) {
        console.log('Linguator: ✓ linguator/language-switcher already registered via PHP:', existingBlock);
        
        // Add the edit component to the existing block registration
        wp.hooks.addFilter(
            'blocks.registerBlockType',
            'linguator/language-switcher-edit',
            (settings, name) => {
                if (name === 'linguator/language-switcher') {
                    console.log('Linguator: Adding edit component to existing block registration');
                    return {
                        ...settings,
                        edit: blockConfig.edit,
                        icon: blockConfig.icon,
                        title: blockTitle,
                        description: descriptionTitle,
                    };
                }
                return settings;
            }
        );
    } else {
        console.log('Linguator: PHP registration not found, registering via JavaScript as fallback');
        wp.blocks.registerBlockType('linguator/language-switcher', blockConfig);
    }

    console.log('Linguator: linguator/language-switcher configuration completed');
} catch (error) {
    console.error('Linguator: Error configuring linguator/language-switcher block:', error);
}

// Register the Language Switcher block as child block of core/navigation block.
const navigationLanguageSwitcherName = 'linguator/navigation-language-switcher';
console.log('Linguator: Attempting to register', navigationLanguageSwitcherName, 'block');

try {
    wp.blocks.registerBlockType(navigationLanguageSwitcherName, {
    title: blockTitle,
    description: descriptionTitle,
    icon: TranslationIcon,
    category: 'design',
    parent: ['core/navigation'],
    usesContext: [
        'textColor',
        'customTextColor',
        'backgroundColor',
        'customBackgroundColor',
        'overlayTextColor',
        'customOverlayTextColor',
        'overlayBackgroundColor',
        'customOverlayBackgroundColor',
        'fontSize',
        'customFontSize',
        'showSubmenuIcon',
        'maxNestingLevel',
        'openSubmenusOnClick',
        'style',
        'isResponsive'
    ],
    example: {},
    edit: (props) => {
        const { dropdown } = props.attributes;
        const { showSubmenuIcon, openSubmenusOnClick } = props.context;
        const {
            ToggleControlDropdown,
            ToggleControlShowNames,
            ToggleControlShowFlags,
            ToggleControlForceHome,
            ToggleControlHideCurrent,
            ToggleControlHideIfNoTranslations
        } = createLanguageSwitcherEdit(props);

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={panelTitle}>
                        <ToggleControlDropdown />
                        <ToggleControlShowNames />
                        <ToggleControlShowFlags />
                        <ToggleControlForceHome />
                        {!dropdown && <ToggleControlHideCurrent />}
                        <ToggleControlHideIfNoTranslations />
                    </PanelBody>
                </InspectorControls>
                <Disabled>
                    <div className="wp-block-navigation-item">
                        <ServerSideRender
                            block="linguator/navigation-language-switcher"
                            attributes={props.attributes}
                        />
                        {showSubmenuIcon && (
                            <button className="wp-block-navigation-submenu__toggle">
                                <span className="screen-reader-text">
                                    {__('Open menu', 'linguator-multilingual-ai-translation')}
                                </span>
                            </button>
                        )}
                    </div>
                </Disabled>
            </Fragment>
        );
    },
    save: () => {
        return null; // Server-side rendered
    }
});

    console.log('Linguator: navigation-language-switcher block registration completed');
    
    // Verify registration
    const navRegisteredBlock = wp.blocks.getBlockType(navigationLanguageSwitcherName);
    if (navRegisteredBlock) {
        console.log('Linguator: ✓', navigationLanguageSwitcherName, 'found in registry:', navRegisteredBlock);
    } else {
        console.error('Linguator: ✗', navigationLanguageSwitcherName, 'NOT found in registry after registration');
    }
} catch (error) {
    console.error('Linguator: Error registering', navigationLanguageSwitcherName, 'block:', error);
}

// Final verification - list all registered blocks with 'linguator' in the name
console.log('Linguator: Final check - all registered Linguator blocks:');
const allBlocks = wp.blocks.getBlockTypes();
const linguatorBlocks = allBlocks.filter(block => block.name.includes('linguator'));
console.log('Linguator: Found', linguatorBlocks.length, 'Linguator blocks:', linguatorBlocks.map(b => b.name));

// Check available categories
console.log('Linguator: Available block categories:', wp.blocks.getCategories());

// Check if there are any allowed_block_types restrictions
if (wp.data && wp.data.select && wp.data.select('core/blocks')) {
    try {
        const allowedBlockTypes = wp.data.select('core/block-editor').getSettings().allowedBlockTypes;
        console.log('Linguator: Allowed block types:', allowedBlockTypes);
    } catch (e) {
        console.log('Linguator: Could not check allowed block types:', e.message);
    }
}

    // Additional debugging: Check WordPress version and block editor status
    console.log('Linguator: WordPress globals available:', {
        wp: typeof wp,
        'wp.blocks': typeof wp.blocks,
        'wp.element': typeof wp.element,
        'wp.components': typeof wp.components,
        registerBlockType: typeof registerBlockType
    });

    // Try to get any registration errors from WordPress
    if (wp.data && wp.data.select) {
        try {
            const notices = wp.data.select('core/notices').getNotices();
            const errors = notices.filter(notice => notice.status === 'error');
            if (errors.length > 0) {
                console.log('Linguator: WordPress notices/errors:', errors);
            }
        } catch (e) {
            console.log('Linguator: Could not check WordPress notices');
        }
    }
};

// Start initialization using WordPress's domReady function
console.log('Linguator: Starting initialization...');

// Use WordPress domReady for proper timing
if (wp && wp.domReady) {
    console.log('Linguator: Using wp.domReady for initialization');
    wp.domReady(initializeBlocks);
} else {
    console.log('Linguator: wp.domReady not available, falling back to DOMContentLoaded');
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBlocks);
    } else {
        initializeBlocks();
    }
}

/**
 * Navigation menu item conversion filters
 */

// Helper function to check if a block should be converted to language switcher
const blocksFilter = (block, menuItem) => {
    if (menuItem && menuItem.type === 'pll_switcher') {
        return {
            ...block,
            name: navigationLanguageSwitcherName,
            attributes: {
                ...block.attributes,
                dropdown: menuItem.dropdown || false,
                show_names: menuItem.show_names !== undefined ? menuItem.show_names : true,
                show_flags: menuItem.show_flags !== undefined ? menuItem.show_flags : false,
                force_home: menuItem.force_home !== undefined ? menuItem.force_home : false,
                hide_current: menuItem.hide_current !== undefined ? menuItem.hide_current : false,
                hide_if_no_translation: menuItem.hide_if_no_translation !== undefined ? menuItem.hide_if_no_translation : false
            }
        };
    }
    return block;
};

// Helper function to map block tree
const mapBlockTree = (blocks, menuItems, mapping, filter) => {
    return blocks.map(block => {
        const menuItem = menuItems.find(item => mapping[item.ID] === block.clientId);
        const filteredBlock = filter(block, menuItem);
        
        if (filteredBlock.innerBlocks && filteredBlock.innerBlocks.length > 0) {
            filteredBlock.innerBlocks = mapBlockTree(filteredBlock.innerBlocks, menuItems, mapping, filter);
        }
        
        return filteredBlock;
    });
};

// Main filter function for menu items to blocks conversion
const menuItemsToBlocksFilter = (blocks, menuItems) => ({
    ...blocks,
    innerBlocks: mapBlockTree(blocks.innerBlocks, menuItems, blocks.mapping, blocksFilter)
});

// Hook to the classic menu conversion to core/navigation block
addFilter('blocks.navigation.__unstableMenuItemsToBlocks', 'linguator/include-language-switcher', menuItemsToBlocksFilter);
