<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class defining post types list option.
 *
 *  
 */
class Post_Types extends Abstract_Object_Types {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'post_types'
	 */
	public static function key(): string {
		return 'post_types';
	}

	/**
	 * Returns non-core post types.
	 *
	 *  
	 *
	 * @return string[] Object type names list.
	 *
	 * @phpstan-return array<non-falsy-string>
	 */
	protected function get_object_types(): array {
		/** @phpstan-var array<non-falsy-string> */
		return get_post_types( array( '_builtin' => false ) );
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'List of post types to translate.', 'linguator-multilingual-ai-translation' );
	}
}
