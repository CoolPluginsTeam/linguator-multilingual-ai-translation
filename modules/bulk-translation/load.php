<?php
/**
 * Loads the setup wizard.
 *
 * @package Linguator
 */
namespace Linguator\Modules\Bulk_Translation;

use Linguator\Admin\Controllers\Linguator_Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly
}

if ( $linguator->model->has_languages() ) {
	class_exists( Linguator_Bulk_Translation::class ) && new Linguator_Bulk_Translation();
}
