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
 *  
 */
class Media_Support extends Abstract_Boolean {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'media_support'
	 */
	public static function key(): string {
		return 'media_support';
	}

	/**
	 * Adds information to the site health info array.
	 *
	 *
	 * @param array   $info    The current site health information.
	 * @param Options $options An instance of the Options class providing additional configuration.
	 *
	 * @return array The updated site health information.
	 */
	public function add_to_site_health_info( array $info, Options $options ): array { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		if ( $this->get() ) {
			$value = '1: ' . __( 'The media are translated', 'linguator-multilingual-ai-translation' );
		} else {
			$value = '0: ' . __( 'The media are not translated', 'linguator-multilingual-ai-translation' );
		}

		return $this->get_site_health_info( $info, $value, self::key() );
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
			__( 'Translate media: %1$s to translate, %2$s otherwise.', 'linguator-multilingual-ai-translation' ),
			'`true`',
			'`false`'
		);
	}
}
