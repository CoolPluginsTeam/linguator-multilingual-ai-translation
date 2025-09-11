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
 * Class defining the "Determine how the current language is defined" option.
 *
 * @since 1.0.0
 */
class Force_Lang extends Abstract_Option {
	/**
	 * Returns option key.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 *
	 * @phpstan-return 'force_lang'
	 */
	public static function key(): string {
		return 'force_lang';
	}

	/**
	 * Returns the default value.
	 *
	 * @since 1.0.0
	 *
	 * @return int
	 */
	protected function get_default() {
		return 1;
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 * @since 1.0.0
	 *
	 * @return array Partial schema.
	 *
	 * @phpstan-return array{type: 'integer', enum: list<0|1|2|3>|list<1|2|3>}
	 */
	protected function get_data_structure(): array {
		return array(
			'type' => 'integer',
			'enum' => 'yes' === get_option( 'lmat_language_from_content_available' ) ? array( 0, 1, 2, 3 ) : array( 1, 2, 3 ),
		);
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'Determine how the current language is defined.', 'linguator-multilingual-ai-translation' );
	}
}
