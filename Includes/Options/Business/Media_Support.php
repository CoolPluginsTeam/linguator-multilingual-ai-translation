<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Includes\Options\Primitive\Abstract_Boolean;



/**
 * Class defining the "Translate media" boolean option.
 *
 * @since 1.0.0
 */
class Media_Support extends Abstract_Boolean {
	/**
	 * Returns option key.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 *
	 * @phpstan-return 'media_support'
	 */
	public static function key(): string {
		return 'media_support';
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return sprintf(
			/* translators: %1$s and %2$s are "true/false" values. */
			__( 'Translate media: %1$s to translate, %2$s otherwise.', 'linguator-multilingual-ai-translation' ),
			'`true`',
			'`false`'
		);
	}
}
