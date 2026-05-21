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
    class_exists(Linguator_Inline_Translation::class) && new Linguator_Inline_Translation();
}
