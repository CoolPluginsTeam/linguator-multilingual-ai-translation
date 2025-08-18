<?php
/**
 * Loads the integration with WP Sweep.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/wp-sweep.php';

use Linguator\Integrations\wp_sweep\LMAT_WP_Sweep;
use Linguator\Integrations\LMAT_Integrations;

add_action(
	'plugins_loaded',
	function () {
		if ( defined( 'WP_SWEEP_VERSION' ) ) {
			LMAT_Integrations::instance()->wp_sweep = new LMAT_WP_Sweep();
			LMAT_Integrations::instance()->wp_sweep->init();
		}
	},
	0
);
