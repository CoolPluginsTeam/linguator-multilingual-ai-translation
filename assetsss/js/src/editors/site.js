/**
 * Site Editor sidebar bootstrap
 */

import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-site';

const SIDEBAR_NAME = 'lmat-site-sidebar';

const Sidebar = () => {
    return (
        <>
            <PluginSidebarMoreMenuItem target={ SIDEBAR_NAME }>
                { __( 'Languages', 'linguator-multilingual-ai-translation' ) }
            </PluginSidebarMoreMenuItem>
            <PluginSidebar name={ SIDEBAR_NAME } title={ __( 'Languages', 'linguator-multilingual-ai-translation' ) }>
                <div className="lmat-sidebar-section">
                    <p>{ __( 'Linguator sidebar (Site Editor)', 'linguator-multilingual-ai-translation' ) }</p>
                </div>
            </PluginSidebar>
        </>
    );
};

registerPlugin( SIDEBAR_NAME, { render: Sidebar } );


