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

use Linguator\Integrations\wp_importer\Linguator_WordPress_Importer;
use Linguator\Integrations\Linguator_Integrations;


Linguator_Integrations::instance()->wp_importer = new Linguator_WordPress_Importer();
