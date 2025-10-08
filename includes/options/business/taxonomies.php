<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class defining taxonomies list option.
 *
 *  
 */
class Taxonomies extends Abstract_Object_Types {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'taxonomies'
	 */
	public static function key(): string {
		return 'taxonomies';
	}

	/**
	 * Returns non-core taxonomies.
	 *
	 *  
	 *
	 * @return string[] Object type names list.
	 *
	 * @phpstan-return array<non-falsy-string>
	 */
	protected function get_object_types(): array {
		$public_taxonomies = get_taxonomies( array( '_builtin' => false ) );
		/** @phpstan-var array<non-falsy-string> */
		return array_diff( $public_taxonomies, get_taxonomies( array( '_lmat' => true ) ) );
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'List of taxonomies to translate.', 'linguator-multilingual-ai-translation' );
	}
}
