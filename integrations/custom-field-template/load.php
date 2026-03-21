<?php
/**
 * Loads the integration with Custom Field Template.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/cft.php';

use Linguator\Integrations\custom_field_template\Linguator_Cft;
use Linguator\Integrations\Linguator_Integrations;

add_action(
	'plugins_loaded',
	function () {
		if ( defined( 'CFT_VERSION' ) ) {
			Linguator_Integrations::instance()->cft = new Linguator_Cft();
			Linguator_Integrations::instance()->cft->init();
		}
	},
	0
);
