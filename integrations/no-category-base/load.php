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

use Linguator\Integrations\no_category_base\Linguator_No_Category_Base;
use Linguator\Integrations\Linguator_Integrations;

Linguator_Integrations::instance()->no_category_base = new Linguator_No_Category_Base();
Linguator_Integrations::instance()->no_category_base->init();
