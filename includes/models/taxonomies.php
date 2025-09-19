<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Includes\Models\Translated\LMAT_Translated_Term;



/**
 * Model for taxonomies filtered/translated by Linguator.
 *
 *  
 */
class Taxonomies {
	/**
	 * Translated term model.
	 *
	 * @var LMAT_Translated_Term
	 */
	public $translated_object;

	/**
	 * Constructor.
	 *
	 *  
	 *
	 * @param LMAT_Translated_Term $translated_object Terms model.
	 */
	public function __construct( LMAT_Translated_Term $translated_object ) {
		$this->translated_object = $translated_object;
	}

	/**
	 * Returns taxonomies that need to be translated.
	 * The taxonomies list is cached for better better performance.
	 * The method waits for 'after_setup_theme' to apply the cache
	 * to allow themes adding the filter in functions.php.
	 *
	 *  
	 *
	 * @param bool $filter True if we should return only valid registered taxonomies.
	 * @return string[] Array of registered taxonomy names for which Linguator manages languages and translations.
	 */
	public function get_translated( $filter = true ): array {
		return $this->translated_object->get_translated_object_types( $filter );
	}

	/**
	 * Returns true if Linguator manages languages and translations for this taxonomy.
	 *
	 *  
	 *
	 * @param string|string[] $tax Taxonomy name or array of taxonomy names.
	 * @return bool
	 */
	public function is_translated( $tax ): bool {
		if ( empty( array_filter( (array) $tax ) ) ) {
			return false;
		}

		/** @phpstan-var non-empty-array<non-empty-string>|non-empty-string $tax */
		return $this->translated_object->is_translated_object_type( $tax );
	}

	/**
	 * Return taxonomies that need to be filtered (post_format like).
	 *
	 *  
	 *
	 * @param bool $filter True if we should return only valid registered taxonomies.
	 * @return string[] Array of registered taxonomy names.
	 */
	public function get_filtered( $filter = true ): array {
		if ( did_action( 'after_setup_theme' ) ) {
			static $taxonomies = null;
		}

		if ( empty( $taxonomies ) ) {
			$taxonomies = array( 'post_format' => 'post_format' );

			/**
			 * Filters the list of taxonomies not translatable but filtered by language.
			 * Includes only the post format by default
			 * The filter must be added soon in the WordPress loading process:
			 * in a function hooked to ‘plugins_loaded’ or directly in functions.php for themes.
			 *
			 *  
			 *
			 * @param string[] $taxonomies  List of taxonomy names.
			 * @param bool     $is_settings True when displaying the list of custom taxonomies in Linguator settings.
			 */
			$taxonomies = apply_filters( 'lmat_filtered_taxonomies', $taxonomies, false );
		}

		return $filter ? array_intersect( $taxonomies, get_taxonomies() ) : $taxonomies;
	}

	/**
	 * Returns true if Linguator filters this taxonomy per language.
	 *
	 *  
	 *
	 * @param string|string[] $tax Taxonomy name or array of taxonomy names.
	 * @return bool
	 */
	public function is_filtered( $tax ): bool {
		$taxonomies = $this->get_filtered( false );
		return ( is_array( $tax ) && array_intersect( $tax, $taxonomies ) ) || in_array( $tax, $taxonomies );
	}

	/**
	 * Returns the query vars of all filtered taxonomies.
	 *
	 *
	 * @return string[]
	 */
	public function get_filtered_query_vars(): array {
		$query_vars = array();
		foreach ( $this->get_filtered() as $filtered_tax ) {
			$tax = get_taxonomy( $filtered_tax );
			if ( ! empty( $tax ) && is_string( $tax->query_var ) ) {
				$query_vars[] = $tax->query_var;
			}
		}
		return $query_vars;
	}
}
