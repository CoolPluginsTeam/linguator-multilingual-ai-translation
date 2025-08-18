<?php
/**
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

use Linguator\Includes\Services\Links\LMAT_Links_Abstract_Domain;



if ( $linguator->model->has_languages() ) {
	if ( $linguator->links_model instanceof LMAT_Links_Abstract_Domain ) {
		$linguator->sitemaps = new LMAT_Sitemaps_Domain( $linguator );
	} else {
		$linguator->sitemaps = new LMAT_Sitemaps( $linguator );
	}
	$linguator->sitemaps->init();
}
