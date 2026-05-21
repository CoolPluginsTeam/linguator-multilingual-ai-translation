<?php
/**
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

add_action(
	'lmat_init',
	function ( $linguator ) {

		if ( $linguator->model->has_languages() && linguator_use_block_editor_plugin() ) {
			// Only register blocks if 'block' switcher is enabled
			if ( linguator_is_switcher_type_enabled( 'block' ) ) {
				$linguator->switcher_block   = ( new \Linguator\Modules\Blocks\Linguator_Language_Switcher_Block( $linguator ) )->init();
				$linguator->navigation_block = ( new \Linguator\Modules\Blocks\Linguator_Navigation_Language_Switcher_Block( $linguator ) )->init();
			}
		}
	}
);