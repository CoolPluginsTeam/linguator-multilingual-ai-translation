<?php
/**
 * Loads the setup wizard.
 *
 * @package Linguator
 */
namespace Linguator\Modules\Wizard;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly
}

require_once __DIR__ . '/wizard.php';

use Linguator\Admin\Controllers\Linguator_Admin_Base;
use Linguator\Modules\Wizard\Linguator_Wizard;

if ( $linguator instanceof Linguator_Admin_Base ) {
	$linguator->wizard = new Linguator_Wizard( $linguator );
}
