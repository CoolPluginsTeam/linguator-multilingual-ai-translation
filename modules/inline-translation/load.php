<?php
/**
 * Loads the setup wizard.
 *
 * @package Linguator
 */
namespace Linguator\Modules\Inline_Translation;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly
}

if ( $linguator->model->has_languages() ) {
    class_exists(LMAT_Inline_Translation::class) && new LMAT_Inline_Translation();
}
