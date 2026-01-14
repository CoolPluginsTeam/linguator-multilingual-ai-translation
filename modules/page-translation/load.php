<?php
/**
 * Loads the setup wizard.
 *
 * @package Linguator
 */
namespace Linguator\Modules\Page_Translation;
use Linguator\Admin\Controllers\LMAT_Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly
}


if ( file_exists( __DIR__ . '/src/create-translated-post/wpbakery/load.php' ) ) {
	require_once __DIR__ . '/src/create-translated-post/wpbakery/load.php';
}

if ( $linguator->model->has_languages() ) {
    class_exists(LMAT_Page_Translation::class) && new LMAT_Page_Translation($linguator);
}
