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

		// Get all objects of specified types using WordPress functions
		$all_objects = array();
		
		if ( $db['table'] === $wpdb->posts ) {
			// For posts
			$posts = get_posts( array(
				'post_type'      => $args,
				'post_status'    => 'any',
				'numberposts'    => $limit >= 1 ? $limit : -1,
				'fields'         => 'ids',
				'suppress_filters' => false,
			) );
			$all_objects = $posts;
		} elseif ( $db['table'] === $wpdb->terms ) {
			// For terms - get terms from taxonomies specified in $args
			foreach ( $args as $taxonomy ) {
				$terms = get_terms( array(
					'taxonomy'   => $taxonomy,
					'hide_empty' => false,
					'fields'     => 'ids',
					'number'     => $limit >= 1 ? $limit : 0,
				) );
				if ( ! is_wp_error( $terms ) ) {
					$all_objects = array_merge( $all_objects, $terms );
				}
			}
		}
		
		// Get objects that DO have language assignments
		$objects_with_language = array();
		foreach ( $all_objects as $object_id ) {
			$object_terms = wp_get_object_terms( $object_id, 'lmat_language', array( 'fields' => 'tt_ids' ) );
			if ( ! is_wp_error( $object_terms ) && ! empty( $object_terms ) ) {
				// Check if any of the assigned language terms match our language_ids
				if ( array_intersect( $object_terms, $language_ids ) ) {
					$objects_with_language[] = $object_id;
				}
			}
		}
		
		// Return objects that DON'T have language assignments
		$objects_without_language = array_diff( $all_objects, $objects_with_language );
		
		return array_values( $objects_without_language );
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
