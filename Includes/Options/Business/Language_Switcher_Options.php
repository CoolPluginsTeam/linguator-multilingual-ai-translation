<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Options\Primitive\Abstract_List;

/**
 * Class defining language switcher options list.
 *
 * @since 1.0.0
 */
class Language_Switcher_Options extends Abstract_List {
	/**
	 * Returns option key.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 *
	 * @phpstan-return 'lmat_language_switcher_options'
	 */
	public static function key(): string {
		return 'lmat_language_switcher_options';
	}

	/**
	 * Returns the default value.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	protected function get_default() {
		return array( 'default' );
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'List of enabled language switcher types.', 'linguator-multilingual-ai-translation' );
	}
}
