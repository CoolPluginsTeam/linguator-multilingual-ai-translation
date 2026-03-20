<?php
/**
 * Loads the integration with Aqua Resizer.
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/aqua-resizer.php';

use Linguator\Integrations\aqua_resizer\Linguator_Aqua_Resizer;
use Linguator\Integrations\Linguator_Integrations;

Linguator_Integrations::instance()->aq_resizer = new Linguator_Aqua_Resizer();
Linguator_Integrations::instance()->aq_resizer->init();
