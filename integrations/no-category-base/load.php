<?php
/**
 * Loads the integration with No Category Base (WPML).
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

require_once __DIR__ . '/no-category-base.php';

use Linguator\Integrations\no_category_base\LMAT_No_Category_Base;
use Linguator\Integrations\LMAT_Integrations;

LMAT_Integrations::instance()->no_category_base = new LMAT_No_Category_Base();
LMAT_Integrations::instance()->no_category_base->init();
