<?php
/**
 * Loads the integration with Jetpack.
 * Works for Twenty Fourteen featured content too.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/jetpack.php';
require_once __DIR__ . '/featured-content.php';

use Linguator\Integrations\jetpack\LMAT_Jetpack;
use Linguator\Integrations\jetpack\LMAT_Featured_Content;
use Linguator\Integrations\LMAT_Integrations;

LMAT_Integrations::instance()->jetpack = new LMAT_Jetpack(); // Must be loaded before the plugin is active.
add_action( 'lmat_init', array( LMAT_Integrations::instance()->featured_content = new LMAT_Featured_Content(), 'init' ) );
