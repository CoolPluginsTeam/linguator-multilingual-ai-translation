<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Options\Abstract_Option;

/**
 * Class defining static strings visibility option.
 *
 * @since 1.0.0
 */
class Static_Strings_Visibility extends Abstract_Option {
	/**
	 * Returns option key.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 *
	 * @phpstan-return 'static_strings_visibility'
	 */
	public static function key(): string {
		return 'static_strings_visibility';
	}

	/**
	 * Returns the default value.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	protected function get_default() {
		return false; // Hidden by default
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 * @since 1.0.0
	 *
	 * @return array Partial schema.
	 */
	protected function get_data_structure(): array {
		return array(
			'type' => 'boolean',
		);
	}

	/**
	 * Sanitizes option's value.
	 * Can populate the `$errors` property with blocking and non-blocking errors: in case of non-blocking errors,
	 * the value is sanitized and can be stored.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed   $value   Value to sanitize.
	 * @param Options $options All options.
	 * @return bool|WP_Error The sanitized value. An instance of `WP_Error` in case of blocking error.
	 */
	protected function sanitize( $value, \Linguator\Includes\Options\Options $options ) {
		return filter_var( $value, FILTER_VALIDATE_BOOLEAN );
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Show or hide the Static Strings tab in the admin menu.', 'linguator-multilingual-ai-translation' );
	}
}
