<?php
/**
 * Loads the setup wizard.
 *
 * @package Linguator
 */
namespace Linguator\modules\Page_Translation;
use Linguator\Admin\Controllers\LMAT_Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly
}

if ( $linguator->model->has_languages() ) {
    class_exists(LMAT_Page_Translation::class) && new LMAT_Page_Translation($linguator);
}
