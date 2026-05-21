<?php
/**
 * Loads the module for general synchronization such as metas and taxonomies.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly
}

use Linguator\Admin\Controllers\Linguator_Admin_Base;



if ( $linguator->model->has_languages() ) {
	if ( $linguator instanceof Linguator_Admin_Base ) {
		$linguator->sync = new Linguator_Admin_Sync( $linguator );
	} else {
		$linguator->sync = new Linguator_Sync( $linguator );
	}

	add_filter(
		'lmat_settings_modules',
		function ( $modules ) {
			$modules[] = 'Linguator_Settings_Sync';
			return $modules;
		}
	);
}
