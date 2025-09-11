<?php
namespace Linguator\Includes\Options\Primitive;
/**
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Includes\Options\Abstract_Option;



/**
 * Class defining single string option.
 *
 * @since 1.0.0
 */
abstract class Abstract_String extends Abstract_Option {
	/**
	 * Returns the default value.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function get_default() {
		return '';
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 * @since 1.0.0
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
}
