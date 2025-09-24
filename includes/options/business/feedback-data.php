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
 * Class defining the "Usage Data Sharing" boolean option.
 *
 *  
 */
class Feedback_Data extends Abstract_Boolean {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'lmat_feedback_data'
	 */
	public static function key(): string {
		return 'lmat_feedback_data';
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
			__( 'Enable usage data sharing: %1$s to enable, %2$s to disable.', 'linguator-multilingual-ai-translation' ),
			'`true`',
			'`false`'
		);
	}
}
