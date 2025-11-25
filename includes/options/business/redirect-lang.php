<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use WP_Error;
use Linguator\Includes\Options\Primitive\Abstract_Boolean;
use Linguator\Includes\Options\Options;

/**
 * Class defining the "Remove the page name or page id from the URL of the front page" boolean option.
 *
 *  
 */
class Redirect_Lang extends Abstract_Boolean {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'redirect_lang'
	 */
	public static function key(): string {
		return 'redirect_lang';
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
			__( 'Remove the page name or page ID from the URL of the front page: %1$s to remove, %2$s to keep.', 'linguator-multilingual-ai-translation' ),
			'`true`',
			'`false`'
		);
	}

	/**
	 * Appends the current state of the redirect lang option to the site health information array.
	 *
	 * @since 0.0.8
	 *
	 * @param Options $options Instance of the Options class used to retrieve configuration settings.
	 *
	 * @return array The updated site health information array including redirect lang status.
	 */
	public function get_site_health_info( Options $options ): array { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( $this->get() ) {
			$value = '1: ' . __( 'The front page URL contains the language code instead of the page name or page id', 'linguator-multilingual-ai-translation' );
		} else {
			$value = '0: ' . __( 'The front page URL contains the page name or page id instead of the language code', 'linguator-multilingual-ai-translation' );
		}

		return $this->format_single_value_for_site_health_info( $value );
	}
}
