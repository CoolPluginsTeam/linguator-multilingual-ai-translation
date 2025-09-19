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
 * Class defining the "Remove /language/ in pretty permalinks" boolean option.
 *
 *  
 */
class Rewrite extends Abstract_Boolean {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'rewrite'
	 */
	public static function key(): string {
		return 'rewrite';
	}

	/**
	 * Returns the default value.
	 *
	 *  
	 *
	 * @return bool
	 */
	protected function get_default() {
		return true;
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
			/* translators: %1$s is a URL slug: `/language/`. %2$s and %3$s are "true/false" values. */
			__( 'Remove %1$s in pretty permalinks: %2$s to remove, %3$s to keep.', 'linguator-multilingual-ai-translation' ),
			'`/language/`',
			'`true`',
			'`false`'
		);
	}
}
