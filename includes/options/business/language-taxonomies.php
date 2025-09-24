<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class defining post types list option.
 *
 *  
 */
class Language_Taxonomies extends Abstract_Object_Types {
	/**
	 * Returns option key.
	 *
	 *  
	 *
	 * @return string
	 *
	 * @phpstan-return 'language_taxonomies'
	 */
	public static function key(): string {
		return 'language_taxonomies';
	}

	/**
	 * Returns language taxonomies, except the ones for posts and taxonomies.
	 *
	 *  
	 *
	 * @return string[] Object type names list.
	 *
	 * @phpstan-return array<non-falsy-string>
	 */
	protected function get_object_types(): array {
		/** @phpstan-var array<non-falsy-string> */
		return array_diff(
			LMAT()->model->translatable_objects->get_taxonomy_names( array( 'language' ) ),
			// Exclude the post and term language taxonomies from the list.
			array( LMAT()->model->post->get_tax_language(), LMAT()->model->term->get_tax_language() )
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
		return __( 'List of language taxonomies used for custom DB tables.', 'linguator-multilingual-ai-translation' );
	}
}
