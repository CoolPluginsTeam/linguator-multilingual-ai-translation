<?php
/**
 * Menu Sync Integration
 * 
 * Loads and initializes the menu sync feature
 * - AJAX handler registered on admin_init (available for all admin AJAX requests)
 * - UI components loaded only on the menus page (load-nav-menus.php)
 * 
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register AJAX handler on admin_init so it's available for AJAX requests
 * for AJAX requests only when the Appearance → Menus page is loaded
 */
add_action( 'admin_init', function() {
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

	// Initialize menu sync with AJAX-only mode (doesn't enqueue scripts)
	new \Linguator\Admin\Controllers\LMAT_Admin_Menu_Sync( $linguator, true );
}, 5 );

/**
 * Load UI components on the menus page
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

	// Initialize menu sync with full UI (enqueues scripts)
	new \Linguator\Admin\Controllers\LMAT_Admin_Menu_Sync( $linguator, false );
} );
