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

use Linguator\Integrations\aqua_resizer\LMAT_Aqua_Resizer;
use Linguator\Integrations\LMAT_Integrations;

LMAT_Integrations::instance()->aq_resizer = new LMAT_Aqua_Resizer();
LMAT_Integrations::instance()->aq_resizer->init();
