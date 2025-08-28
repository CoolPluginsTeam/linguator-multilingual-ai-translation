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
		error_log("has language".print_r($linguator->model->has_languages(),true));
		error_log("use block editor".print_r(lmat_use_block_editor_plugin(),true));
		if ( $linguator->model->has_languages() && lmat_use_block_editor_plugin() ) {
			error_log("load blocks");
			$linguator->switcher_block   = ( new \Linguator\Modules\Blocks\LMAT_Language_Switcher_Block( $linguator ) )->init();
			$linguator->navigation_block = ( new \Linguator\Modules\Blocks\LMAT_Navigation_Language_Switcher_Block( $linguator ) )->init();
		}
	}
);