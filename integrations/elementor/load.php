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
	new Linguator\Integrations\elementor\LMAT_Elementor();
}