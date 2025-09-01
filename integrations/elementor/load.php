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
	require_once __DIR__ . '/lmat-register-widget.php';
	require_once __DIR__ . '/lmat-template-translation.php';
	new Linguator\Integrations\elementor\LMAT_Elementor();
	new Linguator\Integrations\elementor\LMAT_Register_Widget();
	new Linguator\Integrations\elementor\LMAT_Template_Translation();
}