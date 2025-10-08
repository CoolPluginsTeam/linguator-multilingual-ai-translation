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
}
