<?php
/**
 * Loads the integration with WPBakery Page Builder.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

// Load WPBakery Page Builder compatibility
if ( lmat_is_plugin_active( 'js_composer/js_composer.php' ) ) {
	require_once __DIR__ . '/wpbakery.php';
	new Linguator\Integrations\wpbakery\LMAT_WPBakery();
}

