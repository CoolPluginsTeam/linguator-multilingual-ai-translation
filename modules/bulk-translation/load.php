<?php
/**
 * Loads the setup wizard.
 *
 * @package Linguator
 */
namespace Linguator\modules\Bulk_Translation;
use Linguator\Admin\Controllers\LMAT_Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly
}

if ( $linguator->model->has_languages() ) {
    class_exists(LMAT_Bulk_Translation::class) && new LMAT_Bulk_Translation();
}
