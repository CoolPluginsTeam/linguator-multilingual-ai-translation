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

use Linguator\Admin\Controllers\LMAT_Admin_Base;
use Linguator\Modules\Wizard\LMAT_Wizard;

if ( $linguator instanceof LMAT_Admin_Base ) {
	$linguator->wizard = new LMAT_Wizard( $linguator );
}
