<?php
/**
 * Loads the integration with WordPress MU Domain Mapping.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/domain-mapping.php';

use Linguator\Integrations\domain_mapping\LMAT_Domain_Mapping;
use Linguator\Integrations\LMAT_Integrations;

LMAT_Integrations::instance()->dm = new LMAT_Domain_Mapping();
