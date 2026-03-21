<?php
/**
 * Loads the integration with Yet Another Related Posts Plugin.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/yarpp.php';

use Linguator\Integrations\yarpp\Linguator_Yarpp;
use Linguator\Integrations\Linguator_Integrations;

add_action(
	'plugins_loaded',
	function () {
		if ( defined( 'YARPP_VERSION' ) ) {
			add_action( 'init', array( Linguator_Integrations::instance()->yarpp = new Linguator_Yarpp(), 'init' ) );
		}
	},
	0
);
