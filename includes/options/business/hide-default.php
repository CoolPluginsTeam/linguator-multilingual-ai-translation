<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Options\Primitive\Abstract_Boolean;
use Linguator\Includes\Options\Options;

/**
 * Class defining the "Display/Hide URL language information for default language" boolean option.
 * /!\ Sanitization depends on `force_lang`: this option must be set AFTER `force_lang`.
 *
 *  
 */
class Hide_Default extends Abstract_Boolean {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'hide_default'
	 */
	public static function key(): string {
		return 'hide_default';
	}

	/**
	 * Returns the default value.
	 *
	 *  
	 *
	 * @return bool
	 */
	protected function get_default() {
		return true;
	}

	/**
	 * Sanitizes option's value.
	 * Can populate the `$errors` property with blocking and non-blocking errors: in case of non-blocking errors,
	 * the value is sanitized and can be stored.
	 *
	 *  
	 *
	 * @param bool    $value   Value to sanitize.
	 * @param Options $options All options.
	 * @return bool|WP_Error The sanitized value. An instance of `WP_Error` in case of blocking error.
	 */
	protected function sanitize( $value, Options $options ) {
		if ( 3 === $options->get( 'force_lang' ) ) {
			return false;
		}

		/** @var bool|WP_Error */
		return parent::sanitize( $value, $options );
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return sprintf(
			/* translators: %1$s and %2$s are "true/false" values. */
			__( 'Remove the language code in URL for the default language: %1$s to hide, %2$s to display.', 'linguator-multilingual-ai-translation' ),
			'`true`',
			'`false`'
		);
	}

	/**
	 * Appends the current state of the hide default option to the site health information array.
	 *
	 * @since 0.0.8
	 *
	 * @param Options $options Instance of the Options class used to retrieve configuration settings.
	 *
	 * @return array The updated site health information array including hide default status.
	 */
	public function get_site_health_info( Options $options ): array { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( $this->get() ) {
			$value = '1: ' . __( 'Hide URL language information for default language', 'linguator-multilingual-ai-translation' );
		} else {
			$value = '0: ' . __( 'Display URL language information for default language', 'linguator-multilingual-ai-translation' );
		}

		return $this->format_single_value_for_site_health_info( $value );
	}
}
