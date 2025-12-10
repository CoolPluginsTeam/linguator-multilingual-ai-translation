<?php
/**
 * Menu Sync Integration
 * 
 * Loads and initializes the menu sync feature
 * 
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Load the menu sync class
require_once LINGUATOR_DIR . '/admin/controllers/admin-menu-sync.php';

// Initialize menu sync on admin_init
add_action( 'admin_init', function() {
	// Only load in admin
	if ( ! is_admin() ) {
		return;
	}

	// Get Linguator instance
	$linguator = LMAT();
	
	if ( ! $linguator || ! isset( $linguator->model ) ) {
		return;
	}

	// Initialize menu sync
	new \Linguator\Admin\Controllers\LMAT_Admin_Menu_Sync( $linguator );
}, 20 ); // Priority 20 to ensure Linguator is fully loaded
