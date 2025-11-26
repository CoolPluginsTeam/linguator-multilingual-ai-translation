<?php
namespace Linguator\Includes\Options\Primitive;
/**
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Options\Abstract_Option;
use Linguator\Includes\Options\Options;

/**
 * Class defining single string option.
 *
 *  
 */
abstract class Abstract_String extends Abstract_Option {
	/**
	 * Returns the default value.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_default() {
		return '';
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 *  
	 *
	 * @return array Partial schema.
	 *
	 * @phpstan-return array{type: 'string'}
	 */
	protected function get_data_structure(): array {
		return array(
			'type' => 'string',
		);
	}

	/**
	 * Appends the current state of the string option to the site health information array.
	 *
	 * @since 0.0.8
	 *
	 * @param Options $options Instance of the Options class used to retrieve configuration settings.
	 *
	 * @return array The updated site health information array including string value.
	 */
	public function get_site_health_info( Options $options ): array { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		return $this->format_single_value_for_site_health_info( $this->get() );
	}
}
