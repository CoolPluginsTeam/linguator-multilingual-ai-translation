<?php
/**
 * Loads the site health.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

use Linguator\Admin\Controllers\Linguator_Admin;



if ( $linguator instanceof Linguator_Admin && $linguator->model->has_languages() ) {
	$linguator->site_health = new Linguator_Admin_Site_Health( $linguator );
}
