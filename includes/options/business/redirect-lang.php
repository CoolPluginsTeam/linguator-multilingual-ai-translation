<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use WP_Error;
use Linguator\Includes\Options\Primitive\Abstract_Boolean;
use Linguator\Includes\Options\Options;



/**
 * Class defining the "Remove the page name or page id from the URL of the front page" boolean option.
 *
 *  
 */
class Redirect_Lang extends Abstract_Boolean {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'redirect_lang'
	 */
	public static function key(): string {
		return 'redirect_lang';
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return sprintf(
			/* translators: %1$s and %2$s are "true/false" values. */
			__( 'Remove the page name or page ID from the URL of the front page: %1$s to remove, %2$s to keep.', 'linguator-multilingual-ai-translation' ),
			'`true`',
			'`false`'
		);
	}
}
