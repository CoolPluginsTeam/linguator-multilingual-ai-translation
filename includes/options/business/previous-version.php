<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

use Linguator\Includes\Options\Options;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class defining the "previous version" option.
 *
 *  
 */
class Previous_Version extends Version {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'previous_version'
	 */
	public static function key(): string {
		return 'previous_version';
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( "Linguator's previous version.", 'linguator-multilingual-ai-translation' );
	}

	/**
	 * Appends the current state of the previous version option to the site health information array.
	 *
	 * @since 0.0.8
	 *
	 * @param Options $options Instance of the Options class used to retrieve configuration settings.
	 *
	 * @return array The updated site health information array including previous version status.
	 */
	public function get_site_health_info( Options $options ): array { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( ! $this->get() ) {
			return $this->format_single_value_for_site_health_info( __( 'This is the first activation', 'linguator-multilingual-ai-translation' ) );
		}

		return parent::get_site_health_info( $options );
	}
}
