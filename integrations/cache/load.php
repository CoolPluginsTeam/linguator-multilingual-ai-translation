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
use Linguator\Includes\Helpers\LMAT_Cache;
use Linguator\Integrations\cache\LMAT_Cache_Compat;
use Linguator\Integrations\LMAT_Integrations;


add_action(
	'plugins_loaded',
	function () {
		if ( lmat_is_cache_active() ) {
			add_action( 'lmat_init', array( LMAT_Integrations::instance()->cache_compat = new LMAT_Cache_Compat(), 'init' ) );
		}
	},
	0
);
