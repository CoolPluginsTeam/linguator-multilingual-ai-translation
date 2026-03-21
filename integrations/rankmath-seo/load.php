<?php
/**
 * Loads the integration with Rank Math SEO.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/rankmath-lmat.php';

use Linguator\Integrations\RankMath\Linguator_RankMath;
use Linguator\Integrations\Linguator_Integrations;

add_action(
	'plugins_loaded',
	function () {
		if ( defined( 'RANK_MATH_VERSION' ) ) {
			add_action( 'lmat_init', array( Linguator_Integrations::instance()->rankmath = new Linguator_RankMath(), 'init' ) );
		}
	},
	0
);

