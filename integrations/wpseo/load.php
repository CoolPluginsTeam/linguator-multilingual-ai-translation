<?php
/**
 * Loads the integration with Yoast SEO.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/wpseo.php';

use Linguator\Integrations\wpseo\Linguator_WPSEO;
use Linguator\Integrations\Linguator_Integrations;

add_action(
	'plugins_loaded',
	function () {
		if ( defined( 'WPSEO_VERSION' ) ) {
			add_action( 'lmat_init', array( Linguator_Integrations::instance()->wpseo = new Linguator_WPSEO(), 'init' ) );
		}
	},
	0
);
