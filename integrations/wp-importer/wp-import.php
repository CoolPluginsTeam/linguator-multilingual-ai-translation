<?php
/**
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * A class to import languages and translations information form a WXR file
 *
 *  
 */
class LMAT_WP_Import extends WP_Import {
	/**
	 * Stores post_translations terms.
	 *
	 * @var array
	 */
	public $post_translations = array();

	/**
	 * Overrides WP_Import::process_terms to remap terms translations.
	 *
	 *  
	 */
	public function process_terms() {
		$term_translations = array();

		// Store this for future usage as parent function unsets $this->terms.
		foreach ( $this->terms as $term ) {
			if ( 'lmat_post_translations' == $term['term_taxonomy'] ) {
				$this->post_translations[] = $term;
			}
			if ( 'lmat_term_translations' == $term['term_taxonomy'] ) {
				$term_translations[] = $term;
			}
		}

		parent::process_terms();

		// First reset the core terms cache as WordPress Importer calls wp_suspend_cache_invalidation( true );
		wp_cache_set( 'last_changed', microtime(), 'terms' );

		// Assign the default language in case the importer created the first language.
		if ( empty( LMAT()->options['default_lang'] ) ) {
			$languages = get_terms( array( 'taxonomy' => 'lmat_language', 'hide_empty' => false, 'orderby' => 'term_id' ) );
			$default_lang = reset( $languages );
			LMAT()->options['default_lang'] = $default_lang->slug;
		}

		// Clean languages cache in case some of them were created during import.
		LMAT()->model->clean_languages_cache();

		$this->remap_terms_relations( $term_translations );
		$this->remap_translations( $term_translations, $this->processed_terms );
	}

	/**
	 * Overrides WP_Import::process_post to remap posts translations
	 * Also merges strings translations from the WXR file to the existing ones
	 *
	 *  
	 */
	public function process_posts() {
		$menu_items = $mo_posts = array();

		// Store this for future usage as parent function unset $this->posts
		foreach ( $this->posts as $post ) {
			if ( 'nav_menu_item' == $post['post_type'] ) {
				$menu_items[] = $post;
			}

			if ( 0 === strpos( $post['post_title'], 'linguator_mo_' ) ) {
				$mo_posts[] = $post;
			}
		}

		if ( ! empty( $mo_posts ) ) {
			new LMAT_MO(); // Just to register the linguator_mo post type before processing posts
		}

		parent::process_posts();

		LMAT()->model->clean_languages_cache(); // To update the posts count in ( cached ) languages list

		$this->remap_translations( $this->post_translations, $this->processed_posts );
		unset( $this->post_translations );

		// Language switcher menu items
		foreach ( $menu_items as $item ) {
			foreach ( $item['postmeta'] as $meta ) {
				if ( '_lmat_menu_item' == $meta['key'] ) {
					update_post_meta( $this->processed_menu_items[ $item['post_id'] ], '_lmat_menu_item', maybe_unserialize( $meta['value'] ) );
				}
			}
		}

		// Merge strings translations
		foreach ( $mo_posts as $post ) {
			$lang_id = (int) substr( $post['post_title'], 12 );

			if ( ! empty( $this->processed_terms[ $lang_id ] ) ) {
				if ( $strings = maybe_unserialize( $post['post_content'] ) ) {
					$mo = new LMAT_MO();
					$mo->import_from_db( $this->processed_terms[ $lang_id ] );
					foreach ( $strings as $msg ) {
						$mo->add_entry_or_merge( $mo->make_entry( $msg[0], $msg[1] ) );
					}
					$mo->export_to_db( $this->processed_terms[ $lang_id ] );
				}
			}
			// Delete the now useless imported post
			wp_delete_post( $this->processed_posts[ $post['post_id'] ], true );
		}
	}

	/**
	 * Remaps terms languages
	 *
	 *  
	 *
	 * @param array $terms array of terms in 'lmat_term_translations' taxonomy
	 */
	protected function remap_terms_relations( &$terms ) {
		$term_relationships = array();

		foreach ( $terms as $term ) {
			$translations = maybe_unserialize( $term['term_description'] );
			foreach ( $translations as $slug => $old_id ) {
				if ( $old_id && ! empty( $this->processed_terms[ $old_id ] ) && $lang = LMAT()->model->get_language( $slug ) ) {
					$object_id = $this->processed_terms[ $old_id ];
					
					// Language relationship.
					$lang_term = $lang->get_tax_prop( 'lmat_term_language', 'term_id' );
					if ( $lang_term ) {
						$term_relationships[ $object_id ]['lmat_term_language'][] = $lang_term;
					}

					// Translation relationship.
					$translation_term_id = $this->processed_terms[ $term['term_id'] ];
					if ( $translation_term_id ) {
						$term_relationships[ $object_id ]['lmat_term_translations'][] = $translation_term_id;
					}
				}
			}
		}

		// Set term relationships using wp_set_object_terms.
		foreach ( $term_relationships as $object_id => $taxonomies ) {
			foreach ( $taxonomies as $taxonomy => $term_ids ) {
				// Get existing terms to append to them instead of replacing
				$existing_terms = wp_get_object_terms( $object_id, $taxonomy, array( 'fields' => 'ids' ) );
				$all_terms = array_unique( array_merge( $existing_terms, $term_ids ) );
				
				$result = wp_set_object_terms( $object_id, $all_terms, $taxonomy, false );
				
				if ( is_wp_error( $result ) ) {
					if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
						// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- Legitimate error logging for import failures, only when debug logging is enabled
						error_log( sprintf( 'Linguator Import: Failed to set %s terms for object %d: %s', $taxonomy, $object_id, $result->get_error_message() ) );
					}
				}
			}
		}
	}

	/**
	 * Remaps translations for both posts and terms
	 *
	 *  
	 *
	 * @param array $terms array of terms in 'lmat_post_translations' or 'lmat_term_translations' taxonomies
	 * @param array $processed_objects array of posts or terms processed by WordPress Importer
	 */
	protected function remap_translations( &$terms, &$processed_objects ) {
		global $wpdb;

		$u = array();

		foreach ( $terms as $term ) {
			$translations = maybe_unserialize( $term['term_description'] );
			$new_translations = array();

			foreach ( $translations as $slug => $old_id ) {
				if ( $old_id && ! empty( $processed_objects[ $old_id ] ) ) {
					$new_translations[ $slug ] = $processed_objects[ $old_id ];
				}
			}

			if ( ! empty( $new_translations ) ) {
				$u['case'][] = array( $this->processed_terms[ $term['term_id'] ], maybe_serialize( $new_translations ) );
				$u['in'][] = (int) $this->processed_terms[ $term['term_id'] ];
			}
		}

		if ( ! empty( $u ) ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.NoCaching -- Direct DB query is intentionally used here to efficiently update term descriptions in bulk. No performant or reliable WordPress API alternative exists for this operation. This approach is required for correct translations remapping during import migrations.
			$wpdb->query(
				$wpdb->prepare(
					sprintf(
						"UPDATE {$wpdb->term_taxonomy}
						SET description = ( CASE term_id %s END )
						WHERE term_id IN (%s)",
						implode( ' ', array_fill( 0, count( $u['case'] ), 'WHEN %d THEN %s' ) ),
						implode( ',', array_fill( 0, count( $u['in'] ), '%d' ) )
					),
					array_merge( array_merge( ...$u['case'] ), $u['in'] )
				)
			);
		}
	}
}
