<?php
/**
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}
// Load Elementor compatibility
if ( lmat_is_plugin_active( 'elementor/elementor.php' ) ) {
	require_once __DIR__ . '/elementor.php';
	require_once __DIR__ . '/lmat-template-translation.php';
	new Linguator\Integrations\elementor\LMAT_Elementor();
	new Linguator\Integrations\elementor\LMAT_Template_Translation();
	$linguator = get_option( 'linguator' );
	// Only load Elementor widget if 'elementor' switcher is enabled
	if ( $linguator['lmat_language_switcher_options'] && in_array( 'elementor', $linguator['lmat_language_switcher_options'] ) ) {
		require_once __DIR__ . '/lmat-register-widget.php';
		new Linguator\Integrations\elementor\LMAT_Register_Widget();
	}
}