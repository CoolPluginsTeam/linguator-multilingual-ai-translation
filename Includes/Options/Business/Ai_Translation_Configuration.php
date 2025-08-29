<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Options\Abstract_Option;
use Linguator\Includes\Options\Options;

/**
 * Class defining post types list option.
 *
 * @since 1.0.0
 */
class Ai_Translation_Configuration extends Abstract_Option {
	/**
	 * Returns option key.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 *
	 * @phpstan-return 'post_types'
	 */
	public static function key(): string {
		return 'ai_translation_configuration';
	}

    /**
     * Returns the default value.
     *
     * @since 1.0.0
     *
     * @return array
     */
    protected function get_default() {
        $data= array(
            'provider' => array(
                'chrome_local_ai' => true,
                'google_machine_translation' => false,
            ),
        );

        $data = (object) $data;

        return $data;
    }

    /**
     * Returns the JSON schema part specific to this option.
     *
     * @since 1.0.0
     *
     * @return array Partial schema.
     */
    protected function get_data_structure(): array {
        return array(
            'type' => 'object',
            'properties' => array(
                'provider' => array('type' => 'object', 'properties' => array('chrome_local_ai'=>array('type' => 'boolean'), 'google'=>array('type' => 'boolean'))),
            ),
        );
    }

    
	/**
	 * Sanitizes option's value.
	 * Can populate the `$errors` property with blocking and non-blocking errors: in case of non-blocking errors,
	 * the value is sanitized and can be stored.
	 *
	 * @since 1.0.0
	 *
	 * @param array   $value   Value to sanitize.
	 * @param Options $options All options.
	 * @return array|WP_Error The sanitized value. An instance of `WP_Error` in case of blocking error.
	 *
	 * @phpstan-return DomainsValue|WP_Error
	 */
	protected function sanitize( $value, Options $options ) {
        $filtered_value = array();
        $data_structure=self::get_data_structure();
        $provider_data=array_keys($data_structure['properties']['provider']['properties']);

        
        if(isset($value['provider'])){
            $filtered_value['provider'] = array();
            foreach($value['provider'] as $key => $value){

                if(in_array($key, $provider_data)){
                    $filtered_value['provider'][$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                }
            }
        }

        return $filtered_value;
    }

	/**
	 * Returns the description used in the JSON schema.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'List of post types to translate.', 'linguator-multilingual-ai-translation' );
	}
}
