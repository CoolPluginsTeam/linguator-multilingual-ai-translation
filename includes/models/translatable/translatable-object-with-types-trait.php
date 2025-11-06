<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models\Translatable;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Trait to use for objects that can have one or more types.
 * This must be used with {@see LMAT_Translatable_Object_With_Types_Interface}.
 *
 *  
 */
trait LMAT_Translatable_Object_With_Types_Trait {

	/**
	 * Fetches the IDs of the objects without language.
	 *
	 *  
	 *
	 * @param int[] $language_ids List of language `term_taxonomy_id`.
	 * @param int   $limit        Max number of objects to return. `-1` to return all of them.
	 * @param array $args         An array of translated object types.
	 * @return string[]
	 *
	 * @phpstan-param array<positive-int> $language_ids
	 * @phpstan-param -1|positive-int $limit
	 * @phpstan-param array<string> $args
	 */
	protected function get_raw_objects_with_no_lang( array $language_ids, $limit, array $args = array() ) {
		global $wpdb;

		if ( empty( $args ) ) {
			$args = $this->get_translated_object_types();
		}

		$db = $this->get_db_infos();

		// For terms, we need to handle taxonomy filtering properly
		if ( isset( $db['type_column'] ) && $db['table'] === $wpdb->term_taxonomy ) {
			// For terms - use SQL query with taxonomy filtering
			// Escape column and table names
			$id_column = esc_sql( $db['id_column'] );
			$table = esc_sql( $db['table'] );
			$type_column = esc_sql( $db['type_column'] );
			
			// Build taxonomy placeholders
			$taxonomy_placeholders = implode( ',', array_fill( 0, count( $args ), '%s' ) );
			$language_placeholders = implode( ',', array_fill( 0, count( $language_ids ), '%d' ) );
			
			// Build the query with column names directly inserted (already escaped)
			$query = sprintf(
				"SELECT `%s` FROM `%s`
				WHERE `%s` IN (%s)
				AND `%s` NOT IN (
					SELECT object_id FROM {$wpdb->term_relationships} WHERE term_taxonomy_id IN (%s)
				)
				LIMIT %d",
				$id_column,
				$table,
				$type_column,
				$taxonomy_placeholders,
				$id_column,
				$language_placeholders,
				$limit >= 1 ? $limit : 4294967295
			);
			
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.NoCaching -- Direct DB query is required here because WordPress core does not provide an efficient or native way to fetch all objects (posts/terms/etc) that do NOT have a language assigned (i.e., not related to any language term_taxonomy_id) in bulk. This negative relationship cannot be expressed using get_terms()/wp_get_object_terms(), especially when type filtering is needed. Using a raw query here ensures both performance and compatibility.
			return $wpdb->get_col(
				$wpdb->prepare(
					$query,
					array_merge( $args, $language_ids )
				)
			);
		}
		
		// Fallback to base implementation for posts and other types
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.NoCaching -- Direct DB query is required here because WordPress core does not provide an efficient or native way to fetch all objects (posts/terms/etc) that do NOT have a language assigned (i.e., not related to any language term_taxonomy_id) in bulk. This negative relationship cannot be expressed using get_terms()/wp_get_object_terms(), especially when type filtering is needed. Using a raw query here ensures both performance and compatibility.
		return $wpdb->get_col(
			$wpdb->prepare(
				sprintf(
					"SELECT %%i FROM %%i
					WHERE %%i NOT IN (
						SELECT object_id FROM {$wpdb->term_relationships} WHERE term_taxonomy_id IN (%s)
					)
					LIMIT %%d",
					implode( ',', array_fill( 0, count( $language_ids ), '%d' ) )
				),
				array_merge(
					array( $db['id_column'], $db['table'], $db['id_column'] ),
					$language_ids,
					array( $limit >= 1 ? $limit : 4294967295 )
				)
			)
		);
	}

	/**
	 * Returns true if Linguator manages languages for this object type.
	 *
	 *  
	 *
	 * @param string|string[] $object_type Object type (taxonomy name) name or array of object type names.
	 * @return bool
	 *
	 * @phpstan-param non-empty-string|non-empty-string[] $object_type
	 */
	public function is_translated_object_type( $object_type ) {
		$object_types = $this->get_translated_object_types( false );
		return ! empty( array_intersect( (array) $object_type, $object_types ) );
	}
}
