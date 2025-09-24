<?php
/**
 * @package Linguator
 */

use Linguator\Modules\Editors\Screens\Post;
use Linguator\Modules\Editors\Screens\Site;
use Linguator\Modules\Editors\Screens\Widget;
use Linguator\Modules\Editors\Filter_Preload_Paths;
use Linguator\Admin\Controllers\LMAT_Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

add_action(
	'lmat_init',
	function ( $linguator ) {
		if (
			$linguator->model->languages->has()
			&& $linguator instanceof LMAT_Admin
			&& lmat_use_block_editor_plugin()
		) {
			$linguator->site_editor   = ( new Site( $linguator ) )->init();
			$linguator->post_editor   = ( new Post( $linguator ) )->init();
			$linguator->widget_editor = ( new Widget( $linguator ) )->init();
			$linguator->filter_path   = ( new Filter_Preload_Paths( $linguator ) )->init();
		}
	}
);
