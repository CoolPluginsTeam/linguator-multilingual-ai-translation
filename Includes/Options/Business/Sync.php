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
 * @since 1.0.0
 *
 * @phpstan-import-type SchemaType from Linguator\Includes\Options\Abstract_Option
 */
class Sync extends Abstract_List {
	/**
	 * Returns option key.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 *
	 * @phpstan-return 'sync'
	 */
	public static function key(): string {
		return 'sync';
	}

	/**
	 * Returns the JSON schema part specific to this option.
	 *
	 * @since 1.0.0
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
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'List of data to synchronize.', 'linguator-multilingual-ai-translation' );
	}
}
