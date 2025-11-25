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
 * Class defining the "Remove /language/ in pretty permalinks" boolean option.
 *
 *  
 */
class Rewrite extends Abstract_Boolean {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'rewrite'
	 */
	public static function key(): string {
		return 'rewrite';
	}

	/**
	 * Appends the current state of the rewrite option to the site health information array.
	 *
	 * @since 0.0.8
	 *
	 * @param Options $options Instance of the Options class used to retrieve configuration settings.
	 *
	 * @return array The updated site health information array including rewrite status.
	 */
	public function get_site_health_info( Options $options ): array { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( $this->get() ) {
			$value = '1: ' . sprintf(
				/* translators: %s is a URL slug: `/language/`. */
				__( 'Remove %s in pretty permalinks', 'linguator-multilingual-ai-translation' ),
				'`/language/`'
			);
		} else {
			$value = '0: ' . sprintf(
				/* translators: %s is a URL slug: `/language/`. */
				__( 'Keep %s in pretty permalinks', 'linguator-multilingual-ai-translation' ),
				'`/language/`'
			);
		}

		return $this->format_single_value_for_site_health_info( $value );
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
	 * Returns the description used in the JSON schema.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return sprintf(
			/* translators: %1$s is a URL slug: `/language/`. %2$s and %3$s are "true/false" values. */
			__( 'Remove %1$s in pretty permalinks: %2$s to remove, %3$s to keep.', 'linguator-multilingual-ai-translation' ),
			'`/language/`',
			'`true`',
			'`false`'
		);
	}
}
