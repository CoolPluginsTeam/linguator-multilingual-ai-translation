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

use Linguator\Integrations\domain_mapping\Linguator_Domain_Mapping;
use Linguator\Integrations\Linguator_Integrations;

Linguator_Integrations::instance()->dm = new Linguator_Domain_Mapping();
