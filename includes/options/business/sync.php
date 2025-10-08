<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use NOOP_Translations;
use Linguator\Modules\sync\LMAT_Settings_Sync;
use Linguator\Includes\Options\Primitive\Abstract_List;



/**
 * Class defining synchronization settings list option.
 *
 *  
 *
 * @phpstan-import-type SchemaType from Linguator\Includes\Options\Abstract_Option
 */
class Sync extends Abstract_List {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'sync'
	 */
	public static function key(): string {
		return 'sync';
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
		if ( empty( $this->get() ) ) {
			$value = '0: ' . __( 'Synchronization disabled', 'linguator-multilingual-ai-translation' );
		} else {
			$value = implode( ', ', $this->get() );
			}

		return $this->get_site_health_info( $info, $value, self::key() );
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 *  
	 *
	 * @return array Partial schema.
	 *
	 * @phpstan-return array{type: 'array', items: array{type: SchemaType, enum: non-empty-list<non-falsy-string>}}
	 */
	protected function get_data_structure(): array {
		$GLOBALS['l10n']['linguator-multilingual-ai-translation'] = new NOOP_Translations(); // Prevents loading the translations too early.
		$enum = array_keys( LMAT_Settings_Sync::list_metas_to_sync() );
		unset( $GLOBALS['l10n']['linguator-multilingual-ai-translation'] );

		return array(
			'type'  => 'array',
			'items' => array(
				'type' => $this->get_type(),
				'enum' => $enum,
			),
		);
	}

	/**
	 * Returns the description used in the JSON schema.
	 *
	 *  
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'List of data to synchronize.', 'linguator-multilingual-ai-translation' );
	}
}
