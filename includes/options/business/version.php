<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}



use Linguator\Includes\Options\Primitive\Abstract_String;


/**
 * Class defining the "version" option.
 *
 *  
 */
class Version extends Abstract_String {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'version'
	 */
	public static function key(): string {
		return 'version';
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( "Linguator's version.", 'linguator-multilingual-ai-translation' );
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 *  
	 *
	 * @return array Partial schema.
	 *
	 * @phpstan-return array{type: 'string', readonly: true, readonly: true}
	 */
	protected function get_data_structure(): array {
		return array_merge( parent::get_data_structure(), array( 'readonly' => true ) );
	}
}
