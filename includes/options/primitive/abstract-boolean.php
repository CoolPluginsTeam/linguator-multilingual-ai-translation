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
 * Class defining single boolean option.
 * Note that for historic reason, boolean are stored as 0 or 1.
 *
 *  
 */
abstract class Abstract_Boolean extends Abstract_Option {
	/**
	 * Returns the default value.
	 *
	 *  
	 *
	 * @return bool
	 */
	protected function get_default() {
		return false;
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 *  
	 *
	 * @return array Partial schema.
	 *
	 * @phpstan-return array{type: 'boolean'}
	 */
	protected function get_data_structure(): array {
		return array(
			'type' => 'boolean',
		);
	}
}
