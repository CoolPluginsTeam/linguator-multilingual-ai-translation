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

use Linguator\Integrations\wp_sweep\Linguator_WP_Sweep;
use Linguator\Integrations\Linguator_Integrations;

add_action(
	'plugins_loaded',
	function () {
		if ( defined( 'WP_SWEEP_VERSION' ) ) {
			Linguator_Integrations::instance()->wp_sweep = new Linguator_WP_Sweep();
			Linguator_Integrations::instance()->wp_sweep->init();
		}
	},
	0
);
