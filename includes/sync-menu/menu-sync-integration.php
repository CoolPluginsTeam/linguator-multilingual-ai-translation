<?php
/**
 * Menu Sync Integration
 * 
 * Loads and initializes the menu sync feature with security restrictions:
 * - AJAX handler registered on admin_init (required for AJAX requests to work)
 * - UI components loaded ONLY on the Appearance → Menus page
 * - AJAX handler includes referer check to ensure requests come from menu page
 * 
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register AJAX handler early so it's available for AJAX requests
 * The handler itself includes security checks (nonce + referer)
 */
add_action( 'admin_init', function() {

	
	// Only register AJAX handler, no UI loading
	// Check if this is an AJAX request OR if we're on the menu page
	$is_ajax = defined( 'DOING_AJAX' ) && DOING_AJAX;
	$is_menu_page = isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], 'nav-menus.php' ) !== false;
	
	if ( ! $is_ajax && ! $is_menu_page ) {
		return; // Not AJAX and not menu page, skip
	}
	
	
	// Get Linguator instance
	$linguator = LMAT();
	
	if ( ! $linguator || ! isset( $linguator->model ) || ! isset( $linguator->options ) ) {
		return;
	}
	
	// Check if menu sync visibility is enabled
	$menu_sync_enabled = $linguator->options->get( 'menu_sync_visibility' );
	
	if ( ! $menu_sync_enabled ) {
		return;
	}
	
	// Check user capability
	if ( ! current_user_can( 'edit_theme_options' ) ) {
		return;
	}

	// Initialize menu sync with AJAX-only mode (registers handler but no UI)
	new \Linguator\Admin\Controllers\LMAT_Admin_Menu_Sync( $linguator, true );
}, 5 );

/**
 * Load UI components only on the Appearance → Menus page
 */
add_action( 'load-nav-menus.php', function() {
	// Get Linguator instance
	$linguator = LMAT();
	
	if ( ! $linguator || ! isset( $linguator->model ) || ! isset( $linguator->options ) ) {
		return;
	}
	
	// Check if menu sync visibility is enabled
	$menu_sync_enabled = $linguator->options->get( 'menu_sync_visibility' );
	
	if ( ! $menu_sync_enabled ) {
		return;
	}
	
	// Check user capability
	if ( ! current_user_can( 'edit_theme_options' ) ) {
		return;
	}

	// Initialize menu sync with full UI (enqueues scripts and styles)
	new \Linguator\Admin\Controllers\LMAT_Admin_Menu_Sync( $linguator, false );
} );
