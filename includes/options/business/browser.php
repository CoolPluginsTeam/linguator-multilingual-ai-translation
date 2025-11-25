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
 * Class defining the "Detect browser language" boolean option.
 * /!\ Sanitization depends on `force_lang`: this option must be set AFTER `force_lang`.
 *
 *  
 */
class Browser extends Abstract_Boolean {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'browser'
	 */
	public static function key(): string {
		return 'browser';
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
		if ( 3 === $options->get( 'force_lang' ) && ! class_exists( 'LMAT_Xdata_Domain', true ) ) {
			// Cannot share cookies between domains.
			return false;
		}

		/** @var bool|WP_Error */
		$value = parent::sanitize( $value, $options );
		return $value;
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
			__( 'Detect preferred browser language on front page: %1$s to detect, %2$s to not detect.', 'linguator-multilingual-ai-translation' ),
			'`true`',
			'`false`'
		);
	}

	/**
	 * Appends the current state of the browser language detection option to the site health information array.
	 *
	 * @since 0.0.8
	 *
	 * @param Options $options Instance of the Options class used to retrieve configuration settings.
	 *
	 * @return array The updated site health information array including browser language detection status.
	 */
	public function get_site_health_info( Options $options ): array { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( ! $this->get() ) {
			$value = '0: ' . __( 'Detect browser language deactivated', 'linguator-multilingual-ai-translation' );
		} else {
			$value = '1: ' . __( 'Detect browser language activated', 'linguator-multilingual-ai-translation' );
		}

		return $this->format_single_value_for_site_health_info( $value );
	}
}
