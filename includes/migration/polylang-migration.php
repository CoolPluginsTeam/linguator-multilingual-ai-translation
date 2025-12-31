<?php
/**
 * Polylang to Linguator Migration Class
 *
 * @package Linguator
 */

namespace Linguator\Includes\Migration;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Linguator\Includes\Models\Languages;
use Linguator\Includes\Options\Options;
use WP_Error;

/**
 * Handles migration from Polylang to Linguator
 */
class Polylang_Migration {

	/**
	 * Reference to Linguator model
	 *
	 * @var object
	 */
	private $model;

	/**
	 * Reference to Linguator options
	 *
	 * @var Options
	 */
	private $options;

	/**
	 * Constructor
	 *
	 * @param object $model Reference to Linguator model.
	 * @param Options $options Reference to Linguator options.
	 */
	public function __construct( $model, Options $options ) {
		$this->model   = $model;
		$this->options = $options;
	}

	/**
	 * Check if Polylang is installed and has data
	 *
	 * @return array|false Returns migration info if Polylang is detected, false otherwise.
	 */
	public function detect_polylang() {
		global $wpdb;

		// Check if Polylang data exists in database (works even if plugin is deactivated)
		// Check for 'language' taxonomy terms directly in database
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$polylang_languages_count = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->term_taxonomy} WHERE taxonomy = %s",
				'language'
			)
		);

		// Get Polylang settings first to check if Polylang was ever used
		$polylang_options = get_option( 'polylang', array() );
		
		// If no languages found, check if Polylang was ever installed by checking for settings
		if ( empty( $polylang_languages_count ) || 0 === (int) $polylang_languages_count ) {
			// If no languages and no settings, Polylang was never used
			if ( empty( $polylang_options ) ) {
				return false;
			}
			// Settings exist but no languages - still show migration option for settings
			$polylang_languages_count = 0;
		}

		// Try to get languages using get_terms if taxonomy is registered (Polylang is active)
		$polylang_languages = array();
		if ( taxonomy_exists( 'language' ) ) {
			$polylang_languages = get_terms(
				array(
					'taxonomy'   => 'language',
					'hide_empty' => false,
				)
			);
			if ( is_wp_error( $polylang_languages ) ) {
				$polylang_languages = array();
			}
		}

		// Use database count if get_terms didn't work
		if ( empty( $polylang_languages ) && $polylang_languages_count > 0 ) {
			// Get language count from database
			$polylang_languages_count = (int) $polylang_languages_count;
		} else {
			$polylang_languages_count = is_array( $polylang_languages ) ? count( $polylang_languages ) : 0;
		}

		// If no languages found and no settings, return false
		// But if settings exist, we should still show migration option
		if ( empty( $polylang_languages_count ) && empty( $polylang_options ) ) {
			return false;
		}

		// Count translation links - check database directly since taxonomies might not be registered
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$post_translations_count = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->term_taxonomy} WHERE taxonomy = %s",
				'post_translations'
			)
		);

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$term_translations_count = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->term_taxonomy} WHERE taxonomy = %s",
				'term_translations'
			)
		);

		// Count static strings translations
		// Polylang stores strings in term meta _pll_strings_translations on language terms
		$strings_count = 0;
		if ( ! empty( $polylang_languages ) ) {
			foreach ( $polylang_languages as $lang ) {
				$strings = get_term_meta( $lang->term_id, '_pll_strings_translations', true );
				if ( ! empty( $strings ) && is_array( $strings ) ) {
					$strings_count += count( $strings );
				}
			}
		} elseif ( $polylang_languages_count > 0 ) {
			// Query database directly if languages aren't loaded
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
			$language_terms = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT t.term_id 
					FROM {$wpdb->terms} t
					INNER JOIN {$wpdb->term_taxonomy} tt ON t.term_id = tt.term_id
					WHERE tt.taxonomy = %s",
					'language'
				)
			);
			if ( ! empty( $language_terms ) ) {
				foreach ( $language_terms as $lang_term ) {
					$strings = get_term_meta( $lang_term->term_id, '_pll_strings_translations', true );
					if ( ! empty( $strings ) && is_array( $strings ) ) {
						$strings_count += count( $strings );
					}
				}
			}
		}

		return array(
			'has_polylang'          => true,
			'languages_count'      => $polylang_languages_count,
			'post_translations'     => $post_translations_count,
			'term_translations'     => $term_translations_count,
			'strings_count'        => $strings_count,
			'has_settings'         => ! empty( $polylang_options ),
		);
	}

	/**
	 * Migrate languages from Polylang to Linguator
	 *
	 * @return array Migration result.
	 */
	public function migrate_languages() {
		global $wpdb;
		
		$results = array(
			'success' => true,
			'migrated' => 0,
			'errors' => array(),
		);

		// Get Polylang languages - query database directly if taxonomy not registered
		$polylang_languages = array();
		if ( taxonomy_exists( 'language' ) ) {
			$polylang_languages = get_terms(
				array(
					'taxonomy'   => 'language',
					'hide_empty' => false,
				)
			);
			if ( is_wp_error( $polylang_languages ) ) {
				$polylang_languages = array();
			}
		}

		// If get_terms didn't work, query database directly
		if ( empty( $polylang_languages ) ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
			$language_terms = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT t.term_id, t.name, t.slug, tt.description 
					FROM {$wpdb->terms} t
					INNER JOIN {$wpdb->term_taxonomy} tt ON t.term_id = tt.term_id
					WHERE tt.taxonomy = %s",
					'language'
				)
			);

			if ( ! empty( $language_terms ) ) {
				// Convert to term objects
				foreach ( $language_terms as $term_data ) {
					$term = new \WP_Term( (object) array(
						'term_id'     => $term_data->term_id,
						'name'        => $term_data->name,
						'slug'        => $term_data->slug,
						'description' => $term_data->description,
						'taxonomy'     => 'language',
					) );
					$polylang_languages[] = $term;
				}
			}
		}

		if ( empty( $polylang_languages ) ) {
			$results['success'] = false;
			$results['errors'][] = __( 'No Polylang languages found.', 'linguator-multilingual-ai-translation' );
			return $results;
		}

		// Get existing Linguator languages to avoid duplicates
		$existing_languages = $this->model->languages->get_list();
		$existing_slugs = array();
		foreach ( $existing_languages as $lang ) {
			$existing_slugs[] = $lang->slug;
		}

		$default_lang_set = false;

		foreach ( $polylang_languages as $pll_lang ) {
			// Parse language metadata from description
			$lang_data = maybe_unserialize( $pll_lang->description );
			if ( ! is_array( $lang_data ) ) {
				$lang_data = array();
			}

			// Extract language properties
			$locale = isset( $lang_data['locale'] ) ? $lang_data['locale'] : $pll_lang->slug;
			$rtl    = isset( $lang_data['rtl'] ) ? (bool) $lang_data['rtl'] : false;
			$flag   = isset( $lang_data['flag_code'] ) ? $lang_data['flag_code'] : ( isset( $lang_data['flag'] ) ? $lang_data['flag'] : '' );

			// Skip if language already exists
			if ( in_array( $pll_lang->slug, $existing_slugs, true ) ) {
				continue;
			}

			// Add language to Linguator
			$result = $this->model->languages->add(
				array(
					'name'       => $pll_lang->name,
					'slug'       => $pll_lang->slug,
					'locale'     => $locale,
					'rtl'        => $rtl,
					'flag'       => $flag,
					'term_group' => isset( $pll_lang->term_group ) ? (int) $pll_lang->term_group : 0,
				)
			);

			if ( is_wp_error( $result ) ) {
				$results['errors'][] = sprintf(
					/* translators: %s: Language name */
					__( 'Failed to migrate language: %s', 'linguator-multilingual-ai-translation' ),
					$pll_lang->name
				);
				$results['success'] = false;
			} else {
				$results['migrated']++;

				// Set default language if not set yet
				if ( ! $default_lang_set ) {
					$polylang_options = get_option( 'polylang', array() );
					if ( ! empty( $polylang_options['default_lang'] ) && $polylang_options['default_lang'] === $pll_lang->slug ) {
						$this->options->set( 'default_lang', $pll_lang->slug );
						$default_lang_set = true;
					} elseif ( empty( $this->options['default_lang'] ) ) {
						// If no default is set in Polylang, use the first migrated language
						$this->options->set( 'default_lang', $pll_lang->slug );
						$default_lang_set = true;
					}
				}
			}
		}

		return $results;
	}

	/**
	 * Migrate individual post and term language assignments
	 *
	 * @return array Migration result.
	 */
	public function migrate_language_assignments() {
		global $wpdb;
		
		$results = array(
			'success' => true,
			'posts_assigned' => 0,
			'terms_assigned' => 0,
			'errors' => array(),
		);

		// Migrate post language assignments
		// Get all posts that have a language assigned in Polylang
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$posts_with_language = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT DISTINCT p.ID, t.slug as lang_slug
				FROM {$wpdb->posts} p
				INNER JOIN {$wpdb->term_relationships} tr ON p.ID = tr.object_id
				INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
				INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
				WHERE tt.taxonomy = %s
				AND p.post_status != 'auto-draft'",
				'language'
			)
		);

		if ( ! empty( $posts_with_language ) ) {
			foreach ( $posts_with_language as $post_data ) {
				$post_id = (int) $post_data->ID;
				$lang_slug = $post_data->lang_slug;
				
				// Check if this language exists in Linguator
				$lmat_lang = $this->model->languages->get( $lang_slug );
				if ( $lmat_lang ) {
					// Check if post already has a language assigned in Linguator
					$existing_lang = $this->model->post->get_language( $post_id );
					if ( ! $existing_lang ) {
						// Set the language for this post
						$this->model->post->set_language( $post_id, $lmat_lang );
						$results['posts_assigned']++;
					}
				}
			}
		}

		// Migrate term language assignments
		// In Polylang, terms are assigned to the 'language' taxonomy via term_relationships
		// The object_id in term_relationships is the term_taxonomy_id of the term being assigned
		// The term_taxonomy_id in term_relationships is the term_taxonomy_id of the language term
		// Note: We need to get terms that are NOT in translation groups separately
		// Terms in translation groups will get their language from migrate_translations()
		
		// First, get all terms that are in translation groups (they'll be handled in migrate_translations)
		$terms_in_translations = array();
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$term_translation_terms = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT tt.description 
				FROM {$wpdb->term_taxonomy} tt
				WHERE tt.taxonomy = %s",
				'term_translations'
			)
		);
		
		if ( ! empty( $term_translation_terms ) ) {
			foreach ( $term_translation_terms as $trans_term ) {
				$translations = maybe_unserialize( $trans_term->description );
				if ( is_array( $translations ) ) {
					$terms_in_translations = array_merge( $terms_in_translations, array_values( $translations ) );
				}
			}
		}
		$terms_in_translations = array_map( 'intval', $terms_in_translations );
		
		// Now get terms that have languages assigned but are NOT in translation groups
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$term_languages = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT DISTINCT tt.term_id, lang_t.slug as lang_slug, tt.taxonomy
				FROM {$wpdb->term_taxonomy} tt
				INNER JOIN {$wpdb->term_relationships} tr ON tt.term_taxonomy_id = tr.object_id
				INNER JOIN {$wpdb->term_taxonomy} lang_tt ON tr.term_taxonomy_id = lang_tt.term_taxonomy_id
				INNER JOIN {$wpdb->terms} lang_t ON lang_tt.term_id = lang_t.term_id
				WHERE lang_tt.taxonomy = %s
				AND tt.taxonomy NOT IN (%s, %s, %s)",
				'language',
				'language',
				'post_translations',
				'term_translations'
			)
		);

		if ( ! empty( $term_languages ) ) {
			foreach ( $term_languages as $term_data ) {
				$term_id = (int) $term_data->term_id;
				$lang_slug = $term_data->lang_slug;
				
				// Skip terms that are in translation groups (they'll be handled in migrate_translations)
				if ( in_array( $term_id, $terms_in_translations, true ) ) {
					continue;
				}
				
				// Check if this language exists in Linguator
				$lmat_lang = $this->model->languages->get( $lang_slug );
				if ( $lmat_lang ) {
					// Check if term already has a language assigned in Linguator
					$existing_lang = $this->model->term->get_language( $term_id );
					if ( ! $existing_lang ) {
						// Set the language for this term
						$this->model->term->set_language( $term_id, $lmat_lang );
						$results['terms_assigned']++;
					}
				}
			}
		}

		return $results;
	}

	/**
	 * Migrate translation links from Polylang to Linguator
	 *
	 * @return array Migration result.
	 */
	public function migrate_translations() {
		global $wpdb;
		
		$results = array(
			'success' => true,
			'post_translations' => 0,
			'term_translations' => 0,
			'errors' => array(),
		);

		// Migrate post translations - query database directly if taxonomy not registered
		$post_translations = array();
		if ( taxonomy_exists( 'post_translations' ) ) {
			$post_translations = get_terms(
				array(
					'taxonomy'   => 'post_translations',
					'hide_empty' => false,
				)
			);
			if ( is_wp_error( $post_translations ) ) {
				$post_translations = array();
			}
		}

		// If get_terms didn't work, query database directly
		if ( empty( $post_translations ) ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
			$translation_terms = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT t.term_id, tt.description 
					FROM {$wpdb->terms} t
					INNER JOIN {$wpdb->term_taxonomy} tt ON t.term_id = tt.term_id
					WHERE tt.taxonomy = %s",
					'post_translations'
				)
			);

			if ( ! empty( $translation_terms ) ) {
				foreach ( $translation_terms as $term_data ) {
					$term = new \WP_Term( (object) array(
						'term_id'     => $term_data->term_id,
						'description' => $term_data->description,
						'taxonomy'     => 'post_translations',
					) );
					$post_translations[] = $term;
				}
			}
		}

		if ( ! empty( $post_translations ) ) {
			foreach ( $post_translations as $translation_term ) {
				$translations = maybe_unserialize( $translation_term->description );
				if ( ! is_array( $translations ) ) {
					continue;
				}

				// Convert Polylang language slugs to Linguator language slugs
				$lmat_translations = array();
				foreach ( $translations as $lang_slug => $post_id ) {
					// Check if this language exists in Linguator
					$lmat_lang = $this->model->languages->get( $lang_slug );
					if ( $lmat_lang ) {
						$lmat_translations[ $lang_slug ] = (int) $post_id;
					}
				}

				if ( count( $lmat_translations ) > 1 ) {
					// Get the first post ID to create translation group
					$first_post_id = reset( $lmat_translations );
					
					// Save translations for the first post
					$this->model->post->save_translations( $first_post_id, $lmat_translations );
					$results['post_translations']++;
				}
			}
		}

		// Migrate term translations - query database directly if taxonomy not registered
		$term_translations = array();
		if ( taxonomy_exists( 'term_translations' ) ) {
			$term_translations = get_terms(
				array(
					'taxonomy'   => 'term_translations',
					'hide_empty' => false,
				)
			);
			if ( is_wp_error( $term_translations ) ) {
				$term_translations = array();
			}
		}

		// If get_terms didn't work, query database directly
		if ( empty( $term_translations ) ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
			$translation_terms = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT t.term_id, tt.description 
					FROM {$wpdb->terms} t
					INNER JOIN {$wpdb->term_taxonomy} tt ON t.term_id = tt.term_id
					WHERE tt.taxonomy = %s",
					'term_translations'
				)
			);

			if ( ! empty( $translation_terms ) ) {
				foreach ( $translation_terms as $term_data ) {
					$term = new \WP_Term( (object) array(
						'term_id'     => $term_data->term_id,
						'description' => $term_data->description,
						'taxonomy'     => 'term_translations',
					) );
					$term_translations[] = $term;
				}
			}
		}

		if ( ! empty( $term_translations ) ) {
			foreach ( $term_translations as $translation_term ) {
				$translations = maybe_unserialize( $translation_term->description );
				if ( ! is_array( $translations ) ) {
					continue;
				}

				// Convert Polylang language slugs to Linguator language slugs
				$lmat_translations = array();
				foreach ( $translations as $lang_slug => $term_id ) {
					// Check if this language exists in Linguator
					$lmat_lang = $this->model->languages->get( $lang_slug );
					if ( $lmat_lang ) {
						$term_id = (int) $term_id;
						
						// Ensure the term has the CORRECT language assigned before saving translations
						// This is required by save_translations() which validates that all terms have languages
						// We force the language assignment here to ensure it matches the translation data
						$existing_lang = $this->model->term->get_language( $term_id );
						if ( ! $existing_lang || $existing_lang->slug !== $lang_slug ) {
							// Assign the correct language to this term (from the translation data)
							$this->model->term->set_language( $term_id, $lmat_lang );
						}
						
						$lmat_translations[ $lang_slug ] = $term_id;
					}
				}

				if ( count( $lmat_translations ) > 1 ) {
					// Get the first term ID to create translation group
					$first_term_id = reset( $lmat_translations );
					
					// Verify the first term has a language (required by save_translations)
					$first_lang = $this->model->term->get_language( $first_term_id );
					if ( ! $first_lang ) {
						// Get the language slug from the translations array
						$first_lang_slug = array_search( $first_term_id, $lmat_translations );
						if ( $first_lang_slug ) {
							$first_lang_obj = $this->model->languages->get( $first_lang_slug );
							if ( $first_lang_obj ) {
								$this->model->term->set_language( $first_term_id, $first_lang_obj );
							}
						}
					}
					
					// Save translations for the first term
					// This will link all terms in the translation group
					$saved_translations = $this->model->term->save_translations( $first_term_id, $lmat_translations );
					
					if ( ! empty( $saved_translations ) ) {
						$results['term_translations']++;
					} else {
						$results['errors'][] = sprintf(
							/* translators: %d: Term ID */
							__( 'Failed to save translations for term ID %d', 'linguator-multilingual-ai-translation' ),
							$first_term_id
						);
						$results['success'] = false;
					}
				}
			}
		}

		return $results;
	}

	/**
	 * Migrate settings from Polylang to Linguator
	 *
	 * @return array Migration result.
	 */
	public function migrate_settings() {
		$results = array(
			'success' => true,
			'migrated' => array(),
			'errors' => array(),
		);

		$polylang_options = get_option( 'polylang', array() );
		if ( empty( $polylang_options ) || ! is_array( $polylang_options ) ) {
			return $results;
		}

		// Ensure options are registered
		do_action( 'lmat_init_options_for_blog', $this->options, get_current_blog_id() );

		// Map Polylang settings to Linguator settings
		// All settings use the same key names in both plugins
		$settings_map = array(
			// URL modifications
			'force_lang'       => 'force_lang',        // How language is determined (0=content, 1=directory, 2=subdomain, 3=domain)
			'domains'          => 'domains',           // Domain mapping per language
			'hide_default'     => 'hide_default',      // Hide language code for default language
			'rewrite'          => 'rewrite',            // Remove /language/ in pretty permalinks
			'redirect_lang'    => 'redirect_lang',     // Redirect to language
			// Browser detection
			'browser'          => 'browser',            // Detect browser language
			// Media
			'media_support'    => 'media_support',      // Translate media
			// Custom post types and taxonomies
			'post_types'       => 'post_types',         // Translatable post types
			'taxonomies'       => 'taxonomies',         // Translatable taxonomies
			// Synchronization
			'sync'             => 'sync',               // Synchronization settings
			// Navigation menus
			'nav_menus'        => 'nav_menus',          // Navigation menu locations per language
			// Default language (migrated separately in migrate_languages, but included here for completeness)
			'default_lang'     => 'default_lang',       // Default language slug
		);

		foreach ( $settings_map as $pll_key => $lmat_key ) {
			if ( ! isset( $polylang_options[ $pll_key ] ) ) {
				continue;
			}
			
			$value = $polylang_options[ $pll_key ];
			
			// Skip null values
			if ( null === $value ) {
				continue;
			}
			
			// For default_lang, only migrate if not already set (it's set during language migration)
			if ( 'default_lang' === $lmat_key && ! empty( $this->options[ $lmat_key ] ) ) {
				continue;
			}
			
			// Check if setting already exists in Linguator
			$existing_value = $this->options->get( $lmat_key );
			
			// For boolean settings (browser, media_support, hide_default, redirect_lang, rewrite)
			// Always migrate if they exist in Polylang, even if false
			$boolean_settings = array( 'browser', 'media_support', 'hide_default', 'redirect_lang', 'rewrite' );
			$should_migrate = false;
			
			if ( in_array( $lmat_key, $boolean_settings, true ) ) {
				// Always migrate boolean settings from Polylang
				$should_migrate = true;
			} elseif ( empty( $existing_value ) || ( is_array( $existing_value ) && empty( $existing_value ) ) ) {
				// For other settings, migrate if Linguator doesn't have a value
				$should_migrate = true;
			}
			
			if ( ! $should_migrate ) {
				continue;
			}
			
			// Convert language slugs in settings if needed
			if ( is_array( $value ) ) {
				$value = $this->convert_language_slugs_in_array( $value );
				// Skip if array became empty after conversion (unless it's a boolean-like array)
				if ( empty( $value ) && ! in_array( $lmat_key, array( 'sync', 'post_types', 'taxonomies' ), true ) ) {
					continue;
				}
			}
			
			// Special handling for certain settings
			if ( 'force_lang' === $lmat_key ) {
				// Ensure force_lang is a valid integer (0, 1, 2, or 3)
				$value = (int) $value;
				if ( ! in_array( $value, array( 0, 1, 2, 3 ), true ) ) {
					$value = 1; // Default to directory mode
				}
			} elseif ( in_array( $lmat_key, $boolean_settings, true ) ) {
				// Ensure boolean settings are actual booleans
				$value = (bool) $value;
			} elseif ( 'domains' === $lmat_key && is_array( $value ) ) {
				// Domains should be an associative array with language slugs as keys
				// Already handled by convert_language_slugs_in_array
			} elseif ( in_array( $lmat_key, array( 'post_types', 'taxonomies', 'sync' ), true ) && ! is_array( $value ) ) {
				// These should be arrays
				if ( empty( $value ) ) {
					$value = array();
				} else {
					// Convert to array if it's a string or other type
					$value = (array) $value;
				}
			}
			
			// Check if option exists before trying to set it
			if ( ! $this->options->has( $lmat_key ) ) {
				$results['errors'][] = sprintf(
					/* translators: %s: Setting key */
					__( 'Setting %s is not registered in Linguator', 'linguator-multilingual-ai-translation' ),
					$lmat_key
				);
				$results['success'] = false;
				continue;
			}
			
			$result = $this->options->set( $lmat_key, $value );
			if ( ! $result->has_errors() ) {
				$results['migrated'][] = $lmat_key;
			} else {
				// Get error messages for debugging
				$error_messages = $result->get_error_messages();
				$error_message = ! empty( $error_messages ) ? implode( ', ', $error_messages ) : '';
				$results['errors'][] = sprintf(
					/* translators: %1$s: Setting key, %2$s: Error message */
					__( 'Failed to migrate setting: %1$s%2$s', 'linguator-multilingual-ai-translation' ),
					$lmat_key,
					$error_message ? ' (' . $error_message . ')' : ''
				);
				$results['success'] = false;
			}
		}

		// Save all modified options
		if ( ! empty( $results['migrated'] ) ) {
			$this->options->save();
		}

		return $results;
	}

	/**
	 * Convert language slugs in an array (for settings migration)
	 *
	 * @param array $array Array that may contain language slugs.
	 * @return array Converted array.
	 */
	private function convert_language_slugs_in_array( $array ) {
		foreach ( $array as $key => $value ) {
			if ( is_array( $value ) ) {
				$array[ $key ] = $this->convert_language_slugs_in_array( $value );
			} elseif ( is_string( $key ) ) {
				// Check if key is a language slug
				$lmat_lang = $this->model->languages->get( $key );
				if ( ! $lmat_lang ) {
					// Key might be a Polylang slug that doesn't exist in Linguator, skip it
					unset( $array[ $key ] );
				}
			}
		}
		return $array;
	}

	/**
	 * Migrate static strings translations from Polylang to Linguator
	 *
	 * @return array Migration result.
	 */
	public function migrate_strings() {
		global $wpdb;
		
		$results = array(
			'success' => true,
			'strings_migrated' => 0,
			'languages_processed' => 0,
			'errors' => array(),
		);

		// Get all Polylang languages
		$polylang_languages = array();
		if ( taxonomy_exists( 'language' ) ) {
			$polylang_languages = get_terms(
				array(
					'taxonomy'   => 'language',
					'hide_empty' => false,
				)
			);
			if ( is_wp_error( $polylang_languages ) ) {
				$polylang_languages = array();
			}
		}

		// If get_terms didn't work, query database directly
		if ( empty( $polylang_languages ) ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
			$language_terms = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT t.term_id, t.name, t.slug, tt.description 
					FROM {$wpdb->terms} t
					INNER JOIN {$wpdb->term_taxonomy} tt ON t.term_id = tt.term_id
					WHERE tt.taxonomy = %s",
					'language'
				)
			);

			if ( ! empty( $language_terms ) ) {
				foreach ( $language_terms as $term_data ) {
					$term = new \WP_Term( (object) array(
						'term_id'     => $term_data->term_id,
						'name'        => $term_data->name,
						'slug'        => $term_data->slug,
						'description' => $term_data->description,
						'taxonomy'     => 'language',
					) );
					$polylang_languages[] = $term;
				}
			}
		}

		if ( empty( $polylang_languages ) ) {
			return $results;
		}

		// Migrate strings for each language
		foreach ( $polylang_languages as $pll_lang ) {
			// Get Polylang strings for this language
			$pll_strings = get_term_meta( $pll_lang->term_id, '_pll_strings_translations', true );
			
			if ( empty( $pll_strings ) || ! is_array( $pll_strings ) ) {
				continue;
			}

			// Find the corresponding Linguator language
			$lmat_lang = $this->model->languages->get( $pll_lang->slug );
			if ( ! $lmat_lang ) {
				$results['errors'][] = sprintf(
					/* translators: %s: Language slug */
					__( 'Linguator language not found for Polylang language: %s', 'linguator-multilingual-ai-translation' ),
					$pll_lang->slug
				);
				$results['success'] = false;
				continue;
			}

			// Get existing Linguator strings for this language
			$lmat_strings = get_term_meta( $lmat_lang->term_id, '_lmat_strings_translations', true );
			if ( ! is_array( $lmat_strings ) ) {
				$lmat_strings = array();
			}

			// Merge Polylang strings with existing Linguator strings
			// Use original string as key to avoid duplicates
			$strings_map = array();
			foreach ( $lmat_strings as $string_pair ) {
				if ( is_array( $string_pair ) && isset( $string_pair[0] ) ) {
					$strings_map[ $string_pair[0] ] = $string_pair;
				}
			}

			// Add Polylang strings (will overwrite if duplicate)
			$strings_added = 0;
			foreach ( $pll_strings as $string_pair ) {
				if ( ! is_array( $string_pair ) || ! isset( $string_pair[0] ) || ! isset( $string_pair[1] ) ) {
					continue;
				}
				
				$original = wp_unslash( $string_pair[0] );
				$translation = wp_unslash( $string_pair[1] );
				
				// Skip empty strings
				if ( '' === $original || '' === $translation ) {
					continue;
				}

				// Add or update the string translation
				$strings_map[ $original ] = array( $original, $translation );
				$strings_added++;
			}

			// Convert back to array format and save
			$merged_strings = array_values( $strings_map );
			
			// Update term meta with merged strings
			// Note: update_term_meta returns false if value is unchanged, so we always try to update
			// and then verify by reading back the value
			update_term_meta( $lmat_lang->term_id, '_lmat_strings_translations', $merged_strings );
			
			// Verify the update was successful by reading the stored value
			// update_term_meta can return false if value is unchanged, so we verify by reading
			$stored_meta = get_term_meta( $lmat_lang->term_id, '_lmat_strings_translations', true );
			
			// Verify the update was successful
			if ( is_array( $stored_meta ) && ! empty( $stored_meta ) ) {
				// Check if at least the expected strings are stored
				$stored_count = count( $stored_meta );
				$expected_count = count( $merged_strings );
				
				// If we have strings stored (even if count doesn't match exactly due to merging),
				// consider it successful if we have at least as many as we tried to add
				if ( $stored_count >= $expected_count || ( $stored_count > 0 && $strings_added > 0 ) ) {
					$results['strings_migrated'] += $strings_added;
					$results['languages_processed']++;
				} else {
					$results['errors'][] = sprintf(
						/* translators: %1$s: Language slug, %2$d: Stored count, %3$d: Expected count */
						__( 'Failed to save strings for language: %1$s (stored: %2$d, expected: %3$d)', 'linguator-multilingual-ai-translation' ),
						$lmat_lang->slug,
						$stored_count,
						$expected_count
					);
					$results['success'] = false;
				}
			} else {
				$results['errors'][] = sprintf(
					/* translators: %s: Language slug */
					__( 'Failed to save strings for language: %s (no strings stored)', 'linguator-multilingual-ai-translation' ),
					$lmat_lang->slug
				);
				$results['success'] = false;
			}
		}

		// Clear cache after migration
		if ( $results['strings_migrated'] > 0 ) {
			// Clear Linguator strings cache
			if ( class_exists( '\Linguator\Includes\Helpers\LMAT_Cache' ) ) {
				$cache = new \Linguator\Includes\Helpers\LMAT_Cache();
				foreach ( $polylang_languages as $pll_lang ) {
					$lmat_lang = $this->model->languages->get( $pll_lang->slug );
					if ( $lmat_lang ) {
						$cache->clean( $lmat_lang->slug );
					}
				}
			}
		}

		return $results;
	}

	/**
	 * Migrate navigation menu language switcher items from Polylang to Linguator
	 *
	 * @return array Migration result.
	 */
	/**
	 * Migrate navigation menu language switcher items from Polylang to Linguator
	 *
	 * @param bool $dry_run If true, do not perform DB updates; return planned changes.
	 * @return array Migration result.
	 */
	public function migrate_menu_switchers( $dry_run = false ) {
		global $wpdb;
		
		$results = array(
			'success' => true,
			'menu_items_migrated' => 0,
			'planned' => array(),
			'errors' => array(),
		);

		// Find nav menu items that either use the Polylang switcher URL
		// or that have Polylang menu-item meta. Some installs store the switcher
		// in `_pll_menu_item` without using the `_menu_item_url = '#pll_switcher'` marker,
		// so check for either condition.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$menu_items = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT DISTINCT p.ID
				FROM {$wpdb->posts} p
				LEFT JOIN {$wpdb->postmeta} pm_url ON p.ID = pm_url.post_id AND pm_url.meta_key = %s
				LEFT JOIN {$wpdb->postmeta} pm_pll ON p.ID = pm_pll.post_id AND pm_pll.meta_key = %s
				WHERE p.post_type = %s
				AND ( pm_url.meta_value = %s OR pm_pll.meta_id IS NOT NULL )",
				'_menu_item_url',
				'_pll_menu_item',
				'nav_menu_item',
				'#pll_switcher'
			)
		);
		
		if ( empty( $menu_items ) ) {
			return $results;
		}

		foreach ( $menu_items as $item ) {
			$menu_item_id = (int) $item->ID;

			// If dry run, collect planned actions instead of performing them.
			if ( $dry_run ) {
				$results['planned'][] = array(
					'menu_item_id' => $menu_item_id,
					'set_url'      => '#lmat_switcher',
					'migrate_meta' => get_post_meta( $menu_item_id, '_pll_menu_item', true ),
				);
				$results['menu_items_migrated']++;
				continue;
			}

			// Update the URL from #pll_switcher to #lmat_switcher.
			// Try update_post_meta first; if it fails (rare), try add_post_meta as a fallback.
			$update_url = update_post_meta( $menu_item_id, '_menu_item_url', '#lmat_switcher' );
			if ( false === $update_url ) {
				// Try to add the meta if update failed (covers some edge cases)
				add_post_meta( $menu_item_id, '_menu_item_url', '#lmat_switcher', true );
			}

			// Verify the URL was written (update_post_meta can return false if value didn't change)
			$current_url = get_post_meta( $menu_item_id, '_menu_item_url', true );
			if ( $current_url !== '#lmat_switcher' ) {
				$results['errors'][] = sprintf(
					/* translators: %d: Menu item ID */
					__( 'Failed to update URL for menu item ID %d', 'linguator-multilingual-ai-translation' ),
					$menu_item_id
				);
				$results['success'] = false;
				continue;
			}

			// Migrate menu item options from _pll_menu_item to _lmat_menu_item
			$pll_options = get_post_meta( $menu_item_id, '_pll_menu_item', true );

			if ( ! empty( $pll_options ) && is_array( $pll_options ) ) {
				// Update meta key from _pll_menu_item to _lmat_menu_item
				update_post_meta( $menu_item_id, '_lmat_menu_item', $pll_options );

				// Verify the meta was written (update_post_meta may return false if unchanged)
				$stored_meta = get_post_meta( $menu_item_id, '_lmat_menu_item', true );
				if ( empty( $stored_meta ) || ! is_array( $stored_meta ) ) {
					$results['errors'][] = sprintf(
						/* translators: %d: Menu item ID */
						__( 'Failed to migrate options for menu item ID %d', 'linguator-multilingual-ai-translation' ),
						$menu_item_id
					);
					$results['success'] = false;
					continue;
				}
			} else {
				// If no options exist, create default options for Linguator
				$default_options = array(
					'hide_if_no_translation' => 0,
					'hide_current' => 0,
					'force_home' => 0,
					'show_flags' => 0,
					'show_names' => 1,
					'dropdown' => 0,
				);
				update_post_meta( $menu_item_id, '_lmat_menu_item', $default_options );

				// verify default meta saved
				$stored_default = get_post_meta( $menu_item_id, '_lmat_menu_item', true );
				if ( empty( $stored_default ) || ! is_array( $stored_default ) ) {
					$results['errors'][] = sprintf(
						/* translators: %d: Menu item ID */
						__( 'Failed to set default options for menu item ID %d', 'linguator-multilingual-ai-translation' ),
						$menu_item_id
					);
					$results['success'] = false;
					continue;
				}
			}

			// Update menu item title to Linguator's default if needed
			$menu_item_title = get_post_meta( $menu_item_id, '_menu_item_title', true );
			if ( empty( $menu_item_title ) ) {
				update_post_meta( $menu_item_id, '_menu_item_title', __( 'Languages', 'linguator-multilingual-ai-translation' ) );

				// verify title set
				$stored_title = get_post_meta( $menu_item_id, '_menu_item_title', true );
				if ( empty( $stored_title ) ) {
					$results['errors'][] = sprintf(
						/* translators: %d: Menu item ID */
						__( 'Failed to set menu item title for menu item ID %d', 'linguator-multilingual-ai-translation' ),
						$menu_item_id
					);
					$results['success'] = false;
					continue;
				}
			}

			$results['menu_items_migrated']++;
		}

		return $results;
	}

	/**
	 * Perform complete migration from Polylang to Linguator
	 *
	 * @param bool $migrate_languages Whether to migrate languages.
	 * @param bool $migrate_translations Whether to migrate translation links.
	 * @param bool $migrate_settings Whether to migrate settings.
	 * @param bool $migrate_strings Whether to migrate static strings.
	 * @return array Complete migration result.
	 */
	public function migrate_all( $migrate_languages = true, $migrate_translations = true, $migrate_settings = true, $migrate_strings = true ) {
		$results = array(
			'success' => true,
			'languages' => array(),
			'language_assignments' => array(),
			'translations' => array(),
			'settings' => array(),
			'strings' => array(),
			'menu_switchers' => array(),
			'errors' => array(),
		);

		if ( $migrate_languages ) {
			$lang_results = $this->migrate_languages();
			$results['languages'] = $lang_results;
			if ( ! $lang_results['success'] ) {
				$results['success'] = false;
			}
			$results['errors'] = array_merge( $results['errors'], $lang_results['errors'] );
		}

		// Always migrate language assignments after languages are migrated
		// This ensures posts/pages/terms have their correct language assigned
		if ( $migrate_languages && $results['success'] ) {
			$assignments_results = $this->migrate_language_assignments();
			$results['language_assignments'] = $assignments_results;
			if ( ! $assignments_results['success'] ) {
				$results['success'] = false;
			}
			$results['errors'] = array_merge( $results['errors'], $assignments_results['errors'] );
		}

		if ( $migrate_translations && $results['success'] ) {
			$trans_results = $this->migrate_translations();
			$results['translations'] = $trans_results;
			if ( ! $trans_results['success'] ) {
				$results['success'] = false;
			}
			$results['errors'] = array_merge( $results['errors'], $trans_results['errors'] );
		}

		if ( $migrate_settings && $results['success'] ) {
			$settings_results = $this->migrate_settings();
			$results['settings'] = $settings_results;
			if ( ! $settings_results['success'] ) {
				$results['success'] = false;
			}
			$results['errors'] = array_merge( $results['errors'], $settings_results['errors'] );
		}

		if ( $migrate_strings && $results['success'] ) {
			$strings_results = $this->migrate_strings();
			$results['strings'] = $strings_results;
			if ( ! $strings_results['success'] ) {
				$results['success'] = false;
			}
			$results['errors'] = array_merge( $results['errors'], $strings_results['errors'] );
		}

		// Migrate menu switchers after translations are migrated
		// Menu items are independent so attempt migration regardless of previous step results.
		$menu_switchers_results = $this->migrate_menu_switchers();
		$results['menu_switchers'] = $menu_switchers_results;
		if ( ! $menu_switchers_results['success'] ) {		
			$results['success'] = false;
		}
		$results['errors'] = array_merge( $results['errors'], $menu_switchers_results['errors'] );

		// Clear caches after migration
		if ( $results['success'] ) {
			$this->model->languages->clean_cache();
			delete_option( 'rewrite_rules' );
		}

		return $results;
	}
}

