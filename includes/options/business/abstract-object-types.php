<?php

/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}



use Linguator\Includes\Options\Primitive\Abstract_List;
use Linguator\Includes\Options\Options;


/**
 * Class defining object types list option.
 *
 *  
 */
abstract class Abstract_Object_Types extends Abstract_List {
	/**
	 * Sanitizes option's value.
	 * Can return a `WP_Error` object in case of blocking sanitization error: the value must be rejected then.
	 *
	 *  
	 *
	 * @param array   $value   Value to filter.
	 * @param Options $options All options.
	 * @return array|WP_Error The sanitized value. An instance of `WP_Error` in case of blocking error.
	 *
	 * @phpstan-return list<non-falsy-string>|WP_Error
	 */
	protected function sanitize( $value, Options $options ) {
		$value = parent::sanitize( $value, $options );

		if ( is_wp_error( $value ) ) {
			// Blocking sanitization error.
			return $value;
		}

		/** @var array $value */
		return array_values( array_intersect( $value, $this->get_object_types() ) );
	}

	/**
	 * Returns non-core object types.
	 *
	 *  
	 *
	 * @return string[] Object type names list.
	 *
	 * @phpstan-return array<non-falsy-string>
	 */
	abstract protected function get_object_types(): array;
}
