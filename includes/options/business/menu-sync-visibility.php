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
 * Class defining menu sync visibility option.
 *
 *  
 */
class Menu_Sync_Visibility extends Abstract_Option {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'menu_sync_visibility'
	 */
	public static function key(): string {
		return 'menu_sync_visibility';
	}

	/**
	 * Returns the default value.
	 *
	 *  
	 *
	 * @return bool
	 */
	protected function get_default() {
		return false; // Hidden by default
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 *  
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
	 *  
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
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Enable or disable the Menu Sync feature.', 'linguator-multilingual-ai-translation' );
	}
}

