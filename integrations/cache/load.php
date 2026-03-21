<?php
/**
 * Loads the integration with cache plugins.
 *
 * @package Linguator
 */
namespace Linguator\Integrations\cache;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}
use Linguator\Includes\Helpers\Linguator_Cache;
use Linguator\Integrations\cache\Linguator_Cache_Compat;
use Linguator\Integrations\Linguator_Integrations;


add_action(
	'plugins_loaded',
	function () {
		if ( linguator_is_cache_active() ) {
			add_action( 'lmat_init', array( Linguator_Integrations::instance()->cache_compat = new Linguator_Cache_Compat(), 'init' ) );
		}
	},
	0
);
