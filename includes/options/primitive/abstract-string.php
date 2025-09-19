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
}
