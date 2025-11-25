<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Includes\Options\Abstract_Option;
use Linguator\Includes\Options\Options;

/**
 * Class defining the first activation option.
 *
 *  
 */
class First_Activation extends Abstract_Option {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'first_activation'
	 */
	public static function key(): string {
		return 'first_activation';
	}

	/**
	 * Returns the default value.
	 *
	 *  
	 *
	 * @return int
	 *
	 * @phpstan-return int<0, max>
	 */
	protected function get_default() {
		return time();
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 *  
	 *
	 * @return array Partial schema.
	 *
	 * @phpstan-return array{type: 'integer', minimum: 0, maximum: int<0, max>, readonly: true}
	 */
	protected function get_data_structure(): array {
		return array(
			'type'     => 'integer',
			'minimum'  => 0,
			'maximum'  => PHP_INT_MAX,
			'readonly' => true,
		);
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Time of first activation of Linguator.', 'linguator-multilingual-ai-translation' );
	}

	/**
	 * Appends the current state of the first activation option to the site health information array.
	 *
	 * @since 0.0.8
	 *
	 * @param Options $options Instance of the Options class used to retrieve configuration settings.
	 *
	 * @return array The updated site health information array including first activation date.
	 */
	public function get_site_health_info( Options $options ): array { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		return $this->format_single_value_for_site_health_info( wp_date( get_option( 'date_format' ), $this->get() ) );
	}
}
