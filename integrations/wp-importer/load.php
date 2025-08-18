<?php
/**
 * Loads the integration with WordPress Importer.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/wordpress-importer.php';

use Linguator\Integrations\wp_importer\LMAT_WordPress_Importer;
use Linguator\Integrations\LMAT_Integrations;


LMAT_Integrations::instance()->wp_importer = new LMAT_WordPress_Importer();
