<?php
/**
 * WPML to Linguator Migration Class
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
 * Handles migration from WPML to Linguator
 */
class WPML_Migration {

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
	 * Get flag code from Linguator's language data file
	 * Uses the same simple approach as wpml-to-polylang: lookup by locale
	 *
	 * @param string $language_code WPML language code (e.g., "en", "fr", "de").
	 * @param string $locale WPML locale (e.g., "en_US", "fr_FR", "de_DE").
	 * @return string Flag code if found and valid, empty string otherwise.
	 */
	private function get_flag_from_linguator_data( $language_code, $locale ) {
		if ( empty( $locale ) ) {
			return '';
		}

		// Load Linguator's language data file (same approach as wpml-to-polylang)
		if ( ! defined( 'LINGUATOR_DIR' ) ) {
			return '';
		}

		// Ensure proper path with trailing slash
		$languages_file = trailingslashit( LINGUATOR_DIR ) . 'admin/settings/controllers/languages.php';
		if ( ! file_exists( $languages_file ) ) {
			return '';
		}

		$predefined_languages = include $languages_file;
		if ( ! is_array( $predefined_languages ) || empty( $predefined_languages ) ) {
			return '';
		}

		$flag = '';

		// PRIORITY 1: Simple lookup by locale (same as wpml-to-polylang does)
		// e.g., "en_US" → "us", "fr_FR" → "fr", "de_DE" → "de"
		if ( isset( $predefined_languages[ $locale ]['flag'] ) && ! empty( $predefined_languages[ $locale ]['flag'] ) ) {
			$flag = $predefined_languages[ $locale ]['flag'];
		}

		// PRIORITY 2: If no flag found for exact locale, try to find any entry with same language code
		// Prioritize common locales (en_US, fr_FR, de_DE, etc.)
		if ( empty( $flag ) && ! empty( $language_code ) ) {
			$priority_locales = array();
			$other_locales = array();

			foreach ( $predefined_languages as $locale_key => $lang_info ) {
				if ( ! isset( $lang_info['code'] ) || $lang_info['code'] !== $language_code ) {
					continue;
				}

				if ( empty( $lang_info['flag'] ) ) {
					continue;
				}

				// Prioritize locales where lang part matches country part (en_US, fr_FR, de_DE)
				$locale_parts = explode( '_', $locale_key );
				if ( count( $locale_parts ) >= 2 ) {
					$lang_part = strtolower( $locale_parts[0] );
					$country_part = strtolower( $locale_parts[1] );
					if ( $lang_part === $country_part || $locale_key === 'en_US' ) {
						$priority_locales[] = $lang_info['flag'];
					} else {
						$other_locales[] = $lang_info['flag'];
					}
				} else {
					$other_locales[] = $lang_info['flag'];
				}
			}

			// Use priority locales first, then others
			if ( ! empty( $priority_locales ) ) {
				$flag = $priority_locales[0];
			} elseif ( ! empty( $other_locales ) ) {
				$flag = $other_locales[0];
			}
		}

		// PRIORITY 3: If still no flag, try extracting country code from locale
		// e.g., "en_US" → "us", "fr_CA" → "ca"
		if ( empty( $flag ) && strpos( $locale, '_' ) !== false ) {
			$locale_parts = explode( '_', $locale );
			if ( count( $locale_parts ) >= 2 ) {
				$country_code = strtolower( $locale_parts[1] );
				// Validate the country code exists as a flag file
				if ( defined( 'LINGUATOR_DIR' ) ) {
					$flag_path = trailingslashit( LINGUATOR_DIR ) . 'assets/flags/' . $country_code . '.svg';
					if ( is_readable( $flag_path ) ) {
						$flag = $country_code;
					}
				}
			}
		}

		// Return the flag (validation will be done by Linguator's language model)
		return $flag;
	}

	/**
	 * Check if WPML is installed and has data
	 *
	 * @return array|false Returns migration info if WPML is detected, false otherwise.
	 */
	public function detect_wpml() {
		global $wpdb;

		// Check if WPML tables exist
		$icl_translations_table = $wpdb->prefix . 'icl_translations';
		$icl_languages_table = $wpdb->prefix . 'icl_languages';
		
		// Check if tables exist
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$translations_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_translations_table ) ) === $icl_translations_table;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$languages_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_languages_table ) ) === $icl_languages_table;

		if ( ! $translations_table_exists || ! $languages_table_exists ) {
			return false;
		}

		// Count active languages
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$wpml_languages_count = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$icl_languages_table} WHERE active = %d",
				1
			)
		);
		// phpcs:enable

		// Get WPML settings
		$wpml_settings = get_option( 'icl_sitepress_settings', array() );

		// If no languages found and no settings, return false
		if ( empty( $wpml_languages_count ) && empty( $wpml_settings ) ) {
			return false;
		}

		// Count post translations (grouped by trid)
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$post_translations_count = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(DISTINCT trid) 
				FROM {$icl_translations_table} 
				WHERE element_type LIKE %s 
				AND trid IS NOT NULL 
				AND trid > %d",
				'post_%',
				0
			)
		);
		// phpcs:enable

		// Count term translations (grouped by trid)
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$term_translations_count = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(DISTINCT trid) 
				FROM {$icl_translations_table} 
				WHERE element_type LIKE %s 
				AND trid IS NOT NULL 
				AND trid > %d",
				'tax_%',
				0
			)
		);
		// phpcs:enable

		// Count posts with language assignments
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$posts_count = (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(DISTINCT element_id) 
				FROM {$icl_translations_table} 
				WHERE element_type LIKE %s",
				'post_%'
			)
		);
		// phpcs:enable

		// Count strings translations (if WPML String Translation is active)
		$strings_count = 0;
		$icl_strings_table = $wpdb->prefix . 'icl_string_translations';
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$strings_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_strings_table ) ) === $icl_strings_table;
		if ( $strings_table_exists ) {
			// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
			$strings_count = (int) $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM {$icl_strings_table} WHERE value IS NOT NULL AND value != %s",
					''
				)
			);
			// phpcs:enable
		}

		return array(
			'has_wpml'          => true,
			'languages_count'  => $wpml_languages_count,
			'post_translations' => $post_translations_count,
			'term_translations' => $term_translations_count,
			'posts_count'       => $posts_count,
			'strings_count'     => $strings_count,
			'has_settings'      => ! empty( $wpml_settings ),
		);
	}

	/**
	 * Migrate languages from WPML to Linguator
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

		$icl_languages_table = $wpdb->prefix . 'icl_languages';
		$icl_flags_table = $wpdb->prefix . 'icl_flags';

		// Get active WPML languages
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$wpml_languages = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$icl_languages_table} WHERE active = %d ORDER BY id ASC",
				1
			)
		);
		// phpcs:enable

		if ( empty( $wpml_languages ) ) {
			$results['success'] = false;
			$results['errors'][] = __( 'No WPML languages found.', 'linguator-multilingual-ai-translation' );
			return $results;
		}

		// Get existing Linguator languages to avoid duplicates
		$existing_languages = $this->model->languages->get_list();
		$existing_slugs = array();
		foreach ( $existing_languages as $lang ) {
			$existing_slugs[] = $lang->slug;
		}

		$default_lang_set = false;
		$wpml_settings = get_option( 'icl_sitepress_settings', array() );
		$default_lang_code = isset( $wpml_settings['default_language'] ) ? $wpml_settings['default_language'] : '';

		foreach ( $wpml_languages as $wpml_lang ) {
			// Check if language already exists
			$existing_lang = null;
			if ( in_array( $wpml_lang->code, $existing_slugs, true ) ) {
				// Language exists, get it to potentially update its flag
				$existing_lang = $this->model->languages->get( $wpml_lang->code );
			}

			// Get flag using Linguator's language data as the single source of truth
			// This method works universally for all languages by using Linguator's mapping
			$flag = $this->get_flag_from_linguator_data( $wpml_lang->code, $wpml_lang->default_locale );

			// Determine RTL
			// WPML doesn't store RTL in the database, it determines it based on language code
			// Default RTL languages in WPML: ar, he, fa, ku, ur
			$rtl_language_codes = array( 'ar', 'he', 'fa', 'ku', 'ur' );
			$rtl = in_array( $wpml_lang->code, $rtl_language_codes, true );

			// Validate required fields before attempting to add
			if ( empty( $wpml_lang->english_name ) ) {
				$results['errors'][] = sprintf(
					/* translators: %s: Language code */
					__( 'Failed to migrate language with code %s: missing language name', 'linguator-multilingual-ai-translation' ),
					$wpml_lang->code
				);
				$results['success'] = false;
				continue;
			}

			if ( empty( $wpml_lang->code ) ) {
				$results['errors'][] = sprintf(
					/* translators: %s: Language name */
					__( 'Failed to migrate language %s: missing language code', 'linguator-multilingual-ai-translation' ),
					$wpml_lang->english_name
				);
				$results['success'] = false;
				continue;
			}

			if ( empty( $wpml_lang->default_locale ) ) {
				$results['errors'][] = sprintf(
					/* translators: %1$s: Language name, %2$s: Language code */
					__( 'Failed to migrate language %1$s (%2$s): missing locale', 'linguator-multilingual-ai-translation' ),
					$wpml_lang->english_name,
					$wpml_lang->code
				);
				$results['success'] = false;
				continue;
			}

			// If language already exists, try to update its flag if we found one
			if ( $existing_lang && ! empty( $flag ) ) {
				// Always try to update flag if we found one (even if language already has a flag)
				$update_result = $this->model->languages->update(
					array(
						'lang_id' => $existing_lang->term_id,
						'flag'    => $flag,
					)
				);
				
				if ( ! is_wp_error( $update_result ) || ( is_wp_error( $update_result ) && ! $update_result->has_errors() ) ) {
					$results['migrated']++;
				} else {
					$error_messages = $update_result->get_error_messages();
					$error_message = ! empty( $error_messages ) ? ' (' . implode( ', ', $error_messages ) . ')' : '';
					$results['errors'][] = sprintf(
						/* translators: %1$s: Language name, %2$s: Error details */
						__( 'Failed to update flag for language: %1$s%2$s', 'linguator-multilingual-ai-translation' ),
						$wpml_lang->english_name,
						$error_message
					);
					$results['success'] = false;
				}
				continue;
			}
			
			// Skip if language already exists (and we didn't find a flag to update)
			if ( $existing_lang ) {
				continue;
			}
			
			// Prepare language data for Linguator
			$lang_data = array(
				'name'       => $wpml_lang->english_name,
				'slug'       => $wpml_lang->code,
				'locale'     => $wpml_lang->default_locale,
				'rtl'        => $rtl,
				'term_group' => 0,
			);
			
			// Only add flag if it's not empty (flags are optional)
			if ( ! empty( $flag ) ) {
				$lang_data['flag'] = $flag;
			}
			
			// Add language to Linguator
			$result = $this->model->languages->add( $lang_data );

			if ( is_wp_error( $result ) ) {
				// Get detailed error messages from WP_Error
				$error_messages = $result->get_error_messages();
				$error_message = ! empty( $error_messages ) ? ' (' . implode( ', ', $error_messages ) . ')' : '';
				
				$results['errors'][] = sprintf(
					/* translators: %1$s: Language name, %2$s: Error details */
					__( 'Failed to migrate language: %1$s%2$s', 'linguator-multilingual-ai-translation' ),
					$wpml_lang->english_name,
					$error_message
				);
				$results['success'] = false;
			} else {
				$results['migrated']++;

				// Set default language if not set yet
				if ( ! $default_lang_set ) {
					if ( ! empty( $default_lang_code ) && $default_lang_code === $wpml_lang->code ) {
						$this->options->set( 'default_lang', $wpml_lang->code );
						$default_lang_set = true;
					} elseif ( empty( $this->options['default_lang'] ) ) {
						// If no default is set in WPML, use the first migrated language
						$this->options->set( 'default_lang', $wpml_lang->code );
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
	public function linguator_migrate_language_assignments() {
		global $wpdb;

		$results = array(
			'success' => true,
			'posts_assigned' => 0,
			'terms_assigned' => 0,
			'errors' => array(),
		);

		$icl_translations_table = $wpdb->prefix . 'icl_translations';

		// ========== OPTIMIZE: Cache language objects to avoid repeated lookups ==========
		$language_cache = array();

		// Migrate post language assignments
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$posts_with_language = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT DISTINCT element_id, language_code 
				FROM {$icl_translations_table} 
				WHERE element_type LIKE %s 
				AND element_id IS NOT NULL",
				'post_%'
			)
		);
		// phpcs:enable

		if ( ! empty( $posts_with_language ) ) {
			// ========== OPTIMIZE: Bulk fetch existing post language assignments ==========
			$post_ids = array_map( function( $item ) {
				return (int) $item->element_id;
			}, $posts_with_language );
			
			$existing_post_languages = $this->linguator_get_existing_post_language_assignments( $post_ids );

			// ========== OPTIMIZE: Prepare language term IDs for bulk operations ==========
			$bulk_assignments = array();

			foreach ( $posts_with_language as $post_data ) {
				$post_id = (int) $post_data->element_id;
				$lang_code = $post_data->language_code;

				// Skip if post already has a language assigned
				if ( isset( $existing_post_languages[ $post_id ] ) ) {
					continue;
				}

				// Check if this language exists in Linguator (with caching)
				if ( ! isset( $language_cache[ $lang_code ] ) ) {
					$language_cache[ $lang_code ] = $this->model->languages->get( $lang_code );
				}

				$linguator_lang = $language_cache[ $lang_code ];
				if ( $linguator_lang ) {
					$lang_tt_id = $linguator_lang->get_tax_prop( 'lmat_language', 'term_taxonomy_id' );
					if ( $lang_tt_id ) {
						$bulk_assignments[] = array(
							'object_id' => $post_id,
							'term_taxonomy_id' => $lang_tt_id,
						);
					}
				}
			}

			// ========== BULK INSERT post language assignments ==========
			if ( ! empty( $bulk_assignments ) ) {
				$results['posts_assigned'] = $this->linguator_bulk_insert_term_relationships( $bulk_assignments );
				
				// Invalidate cache after bulk insert
				wp_cache_delete( 'last_changed', 'posts' );
			}
		}

		// Migrate term language assignments
		// In WPML, terms are stored with element_type like 'tax_category', 'tax_post_tag', etc.
		// The element_id is the term_taxonomy_id, not the term_id
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$terms_with_language = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT DISTINCT t.term_id, icl.language_code
				FROM {$icl_translations_table} icl
				INNER JOIN {$wpdb->term_taxonomy} tt ON icl.element_id = tt.term_taxonomy_id
				INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
				WHERE icl.element_type LIKE %s
				AND icl.element_id IS NOT NULL",
				'tax_%'
			)
		);
		// phpcs:enable

		if ( ! empty( $terms_with_language ) ) {
			// ========== OPTIMIZE: Bulk fetch existing term language assignments ==========
			$term_ids = array_map( function( $item ) {
				return (int) $item->term_id;
			}, $terms_with_language );
			
			$existing_term_languages = $this->linguator_get_existing_term_language_assignments( $term_ids );

			// ========== OPTIMIZE: Prepare term language assignments for bulk operations ==========
			$bulk_term_assignments = array();

			foreach ( $terms_with_language as $term_data ) {
				$term_id = (int) $term_data->term_id;
				$lang_code = $term_data->language_code;

				// Skip if term already has a language assigned
				if ( isset( $existing_term_languages[ $term_id ] ) ) {
					continue;
				}

				// Check if this language exists in Linguator (with caching)
				if ( ! isset( $language_cache[ $lang_code ] ) ) {
					$language_cache[ $lang_code ] = $this->model->languages->get( $lang_code );
				}

				$linguator_lang = $language_cache[ $lang_code ];
				if ( $linguator_lang ) {
					$lang_tt_id = $linguator_lang->get_tax_prop( 'lmat_term_language', 'term_taxonomy_id' );
					if ( $lang_tt_id ) {
						$bulk_term_assignments[] = array(
							'object_id' => $term_id,
							'term_taxonomy_id' => $lang_tt_id,
						);
					}
				}
			}

			// ========== BULK INSERT term language assignments ==========
			if ( ! empty( $bulk_term_assignments ) ) {
				$results['terms_assigned'] = $this->linguator_bulk_insert_term_relationships( $bulk_term_assignments );
				
				// Invalidate cache after bulk insert
				wp_cache_delete( 'last_changed', 'terms' );
			}
		}

		return $results;
	}

	/**
	 * Migrate translation links from WPML to Linguator
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

		$icl_translations_table = $wpdb->prefix . 'icl_translations';

		// ========== OPTIMIZE: Cache language objects to avoid repeated lookups ==========
		$language_cache = array();

		// Migrate post translations
		// Group by trid to get translation groups
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$post_translation_groups = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT trid, GROUP_CONCAT(CONCAT(language_code, ':', element_id) SEPARATOR '|') as translations
				FROM {$icl_translations_table}
				WHERE element_type LIKE %s
				AND trid IS NOT NULL
				AND trid > %d
				GROUP BY trid
				HAVING COUNT(*) > %d",
				'post_%',
				0,
				1
			)
		);
		// phpcs:enable

		if ( ! empty( $post_translation_groups ) ) {
			// Collect all translation groups and create them in bulk to reduce DB calls.
			$post_translation_sets = array();

			foreach ( $post_translation_groups as $group ) {
				// Parse translations: "en:123|fr:456|de:789"
				if ( empty( $group->translations ) || ! is_string( $group->translations ) ) {
					continue;
				}

				$translations_parts = explode( '|', $group->translations );
				$linguator_translations = array();

				foreach ( $translations_parts as $part ) {
					if ( false === strpos( $part, ':' ) ) {
						continue;
					}

					$pieces = explode( ':', $part, 2 );
					if ( count( $pieces ) < 2 ) {
						continue;
					}

					list( $lang_code, $post_id ) = $pieces;
					$post_id = (int) $post_id;

					// ========== OPTIMIZE: Use cached language lookup ==========
					if ( ! isset( $language_cache[ $lang_code ] ) ) {
						$language_cache[ $lang_code ] = $this->model->languages->get( $lang_code );
					}

					$linguator_lang = $language_cache[ $lang_code ];
					if ( $linguator_lang ) {
						$linguator_translations[ $lang_code ] = $post_id;
					}
				}

				if ( count( $linguator_translations ) > 1 ) {
					$post_translation_sets[] = $linguator_translations;
				}
			}

			if ( ! empty( $post_translation_sets ) ) {
				// Bulk-create all post translation groups using the optimized helper.
				$this->model->post->set_translation_in_mass( $post_translation_sets );
				$results['post_translations'] = count( $post_translation_sets );
			}
		}

		// Migrate term translations
		// Group by trid to get translation groups
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$term_translation_groups = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT trid, GROUP_CONCAT(CONCAT(icl.language_code, ':', t.term_id) SEPARATOR '|') as translations
				FROM {$icl_translations_table} icl
				INNER JOIN {$wpdb->term_taxonomy} tt ON icl.element_id = tt.term_taxonomy_id
				INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
				WHERE icl.element_type LIKE %s
				AND icl.trid IS NOT NULL
				AND icl.trid > %d
				GROUP BY icl.trid
				HAVING COUNT(*) > %d",
				'tax_%',
				0,
				1
			)
		);
		// phpcs:enable

		if ( ! empty( $term_translation_groups ) ) {
			// ========== OPTIMIZE: Pre-process all term-language pairs and bulk fetch existing assignments ==========
			$all_term_language_pairs = array();
			$all_term_ids = array();

			// First pass: collect all term IDs and their expected languages
			foreach ( $term_translation_groups as $group ) {
				if ( empty( $group->translations ) || ! is_string( $group->translations ) ) {
					continue;
				}

				$translations_parts = explode( '|', $group->translations );
				
				foreach ( $translations_parts as $part ) {
					if ( false === strpos( $part, ':' ) ) {
						continue;
					}

					$pieces = explode( ':', $part, 2 );
					if ( count( $pieces ) < 2 ) {
						continue;
					}

					list( $lang_code, $term_id ) = $pieces;
					$term_id = (int) $term_id;
					
					// Cache language lookup
					if ( ! isset( $language_cache[ $lang_code ] ) ) {
						$language_cache[ $lang_code ] = $this->model->languages->get( $lang_code );
					}
					
					if ( $language_cache[ $lang_code ] ) {
						$all_term_ids[] = $term_id;
						$all_term_language_pairs[ $term_id ] = $lang_code;
					}
				}
			}

			// ========== OPTIMIZE: Bulk fetch existing term language assignments ==========
			$existing_term_languages = array();
			if ( ! empty( $all_term_ids ) ) {
				$existing_term_languages = $this->linguator_get_existing_term_language_assignments( array_unique( $all_term_ids ) );
			}

			// ========== OPTIMIZE: Prepare bulk term language assignments for terms that need them ==========
			$bulk_term_language_assignments = array();

			foreach ( $all_term_language_pairs as $term_id => $expected_lang_code ) {
				$current_lang = isset( $existing_term_languages[ $term_id ] ) ? $existing_term_languages[ $term_id ] : null;
				
				// Only assign language if missing or incorrect
				if ( ! $current_lang || $current_lang !== $expected_lang_code ) {
					$linguator_lang = $language_cache[ $expected_lang_code ];
					if ( $linguator_lang ) {
						$lang_tt_id = $linguator_lang->get_tax_prop( 'lmat_term_language', 'term_taxonomy_id' );
						if ( $lang_tt_id ) {
							$bulk_term_language_assignments[] = array(
								'object_id' => $term_id,
								'term_taxonomy_id' => $lang_tt_id,
							);
						}
					}
				}
			}

			// ========== BULK INSERT: Assign all term languages at once ==========
			if ( ! empty( $bulk_term_language_assignments ) ) {
				$this->linguator_bulk_insert_term_relationships( $bulk_term_language_assignments );
				wp_cache_delete( 'last_changed', 'terms' );
			}

			// ========== Second pass: Collect translation groups (now that all languages are assigned) ==========
			$term_translation_sets = array();

			foreach ( $term_translation_groups as $group ) {
				// Parse translations: "en:123|fr:456|de:789"
				if ( empty( $group->translations ) || ! is_string( $group->translations ) ) {
					continue;
				}

				$translations_parts = explode( '|', $group->translations );
				$linguator_translations = array();

				foreach ( $translations_parts as $part ) {
					if ( false === strpos( $part, ':' ) ) {
						continue;
					}

					$pieces = explode( ':', $part, 2 );
					if ( count( $pieces ) < 2 ) {
						continue;
					}

					list( $lang_code, $term_id ) = $pieces;
					$term_id = (int) $term_id;

					// Use cached language (already fetched in first pass)
					$linguator_lang = isset( $language_cache[ $lang_code ] ) ? $language_cache[ $lang_code ] : null;
					if ( $linguator_lang ) {
						$linguator_translations[ $lang_code ] = $term_id;
					}
				}

				if ( count( $linguator_translations ) > 1 ) {
					$term_translation_sets[] = $linguator_translations;
				}
			}

			if ( ! empty( $term_translation_sets ) ) {
				// Bulk-create all term translation groups using the optimized helper.
				$this->model->term->set_translation_in_mass( $term_translation_sets );
				$results['term_translations'] = count( $term_translation_sets );
			}
		}

		return $results;
	}

	/**
	 * Migrate settings from WPML to Linguator
	 *
	 * @return array Migration result.
	 */
	public function migrate_settings() {
		$results = array(
			'success' => true,
			'migrated' => array(),
			'errors' => array(),
		);

		$wpml_settings = get_option( 'icl_sitepress_settings', array() );
		if ( empty( $wpml_settings ) || ! is_array( $wpml_settings ) ) {
			return $results;
		}

		// Ensure options are registered
		do_action( 'lmat_init_options_for_blog', $this->options, get_current_blog_id() );

		// Map WPML settings to Linguator settings
		$settings_map = array(
			// URL modifications
			'language_negotiation_type' => 'force_lang',  // 1=directory, 2=subdomain, 3=domain
			'urls'                      => 'domains',     // Domain mapping per language
			'urls_directory_for_default_language' => 'hide_default',  // Hide language code for default
			'remove_language_switcher'  => 'rewrite',     // Similar concept
			// Browser detection
			'browser_language_redirect' => 'browser',     // Detect browser language
			// Media
			'media_support'             => 'media_support',  // Translate media
			// Custom post types and taxonomies
			'custom_posts_sync_option'  => 'post_types',    // Translatable post types
			'taxonomies_sync_option'    => 'taxonomies',    // Translatable taxonomies
			// Synchronization
			'sync_page_ordering'         => 'sync',          // Some sync settings
			'sync_page_parent'           => 'sync',          // More sync settings
			'sync_page_template'         => 'sync',          // More sync settings
			'sync_comment_status'        => 'sync',          // More sync settings
			'sync_ping_status'           => 'sync',          // More sync settings
			'sync_sticky_flag'           => 'sync',          // More sync settings
			'sync_password'              => 'sync',          // More sync settings
			'sync_private_flag'          => 'sync',          // More sync settings
			'sync_post_format'           => 'sync',          // More sync settings
			'sync_delete'                => 'sync',          // More sync settings
			'sync_post_date'             => 'sync',          // More sync settings
			'sync_post_thumbnail'        => 'sync',          // More sync settings
			'sync_taxonomies'            => 'sync',          // More sync settings
			'sync_comments_on_duplicates' => 'sync',         // More sync settings
			'sync_post_taxonomies'       => 'sync',          // More sync settings
		);

		// Handle force_lang conversion
		if ( isset( $wpml_settings['language_negotiation_type'] ) ) {
			$wpml_negotiation = (int) $wpml_settings['language_negotiation_type'];
			// WPML: 1=directory, 2=subdomain, 3=domain
			// Linguator: 0=content, 1=directory, 2=subdomain, 3=domain
			// Map WPML 1 to Linguator 1, WPML 2 to Linguator 2, WPML 3 to Linguator 3
			$force_lang_value = ( $wpml_negotiation >= 1 && $wpml_negotiation <= 3 ) ? $wpml_negotiation : 1;
			$this->options->set( 'force_lang', $force_lang_value );
			$results['migrated'][] = 'force_lang';
		}

		// Handle domains
		if ( isset( $wpml_settings['urls'] ) && is_array( $wpml_settings['urls'] ) ) {
			$domains = array();
			foreach ( $wpml_settings['urls'] as $lang_code => $url_data ) {
				if ( is_array( $url_data ) && isset( $url_data['url'] ) ) {
					$domains[ $lang_code ] = $url_data['url'];
				} elseif ( is_string( $url_data ) ) {
					$domains[ $lang_code ] = $url_data;
				}
			}
			if ( ! empty( $domains ) ) {
				$domains = $this->linguator_convert_language_slugs_in_array( $domains );
				if ( ! empty( $domains ) ) {
					$this->options->set( 'domains', $domains );
					$results['migrated'][] = 'domains';
				}
			}
		}

		// Handle hide_default
		if ( isset( $wpml_settings['urls_directory_for_default_language'] ) ) {
			$hide_default = ! (bool) $wpml_settings['urls_directory_for_default_language'];
			$this->options->set( 'hide_default', $hide_default );
			$results['migrated'][] = 'hide_default';
		}

		// Handle browser detection
		if ( isset( $wpml_settings['browser_language_redirect'] ) ) {
			$this->options->set( 'browser', (bool) $wpml_settings['browser_language_redirect'] );
			$results['migrated'][] = 'browser';
		}

		// Handle media support
		if ( isset( $wpml_settings['media_support'] ) ) {
			$this->options->set( 'media_support', (bool) $wpml_settings['media_support'] );
			$results['migrated'][] = 'media_support';
		}

		// Handle post types
		if ( isset( $wpml_settings['custom_posts_sync_option'] ) && is_array( $wpml_settings['custom_posts_sync_option'] ) ) {
			$post_types = array();
			foreach ( $wpml_settings['custom_posts_sync_option'] as $post_type => $sync_option ) {
				// WPML: 0=not translatable, 1=translatable
				if ( 1 === (int) $sync_option ) {
					$post_types[] = $post_type;
				}
			}
			if ( ! empty( $post_types ) ) {
				$this->options->set( 'post_types', $post_types );
				$results['migrated'][] = 'post_types';
			}
		}

		// Handle taxonomies
		if ( isset( $wpml_settings['taxonomies_sync_option'] ) && is_array( $wpml_settings['taxonomies_sync_option'] ) ) {
			$taxonomies = array();
			foreach ( $wpml_settings['taxonomies_sync_option'] as $taxonomy => $sync_option ) {
				// WPML: 0=not translatable, 1=translatable
				if ( 1 === (int) $sync_option ) {
					$taxonomies[] = $taxonomy;
				}
			}
			if ( ! empty( $taxonomies ) ) {
				$this->options->set( 'taxonomies', $taxonomies );
				$results['migrated'][] = 'taxonomies';
			}
		}

		// Handle sync settings - combine multiple WPML sync options into Linguator's sync array
		$sync_settings = array();
		$sync_keys = array(
			'sync_page_ordering', 'sync_page_parent', 'sync_page_template',
			'sync_comment_status', 'sync_ping_status', 'sync_sticky_flag',
			'sync_password', 'sync_private_flag', 'sync_post_format',
			'sync_delete', 'sync_post_date', 'sync_post_thumbnail',
			'sync_taxonomies', 'sync_comments_on_duplicates', 'sync_post_taxonomies',
		);
		foreach ( $sync_keys as $sync_key ) {
			if ( isset( $wpml_settings[ $sync_key ] ) && 1 === (int) $wpml_settings[ $sync_key ] ) {
				$sync_settings[ $sync_key ] = true;
			}
		}
		if ( ! empty( $sync_settings ) ) {
			$existing_sync = $this->options->get( 'sync' );
			if ( ! is_array( $existing_sync ) ) {
				$existing_sync = array();
			}
			$sync_settings = array_merge( $existing_sync, $sync_settings );
			$this->options->set( 'sync', $sync_settings );
			$results['migrated'][] = 'sync';
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
	private function linguator_convert_language_slugs_in_array( $array ) {
		foreach ( $array as $key => $value ) {
			if ( is_array( $value ) ) {
				$array[ $key ] = $this->linguator_convert_language_slugs_in_array( $value );
			} elseif ( is_string( $key ) ) {
				// Check if key is a language slug
				$linguator_lang = $this->model->languages->get( $key );
				if ( ! $linguator_lang ) {
					// Key might be a WPML slug that doesn't exist in Linguator, skip it
					unset( $array[ $key ] );
				}
			}
		}
		return $array;
	}

	/**
	 * Migrate static strings translations from WPML to Linguator
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

		$icl_strings_table = $wpdb->prefix . 'icl_strings';
		$icl_string_translations_table = $wpdb->prefix . 'icl_string_translations';

		// Check if WPML String Translation tables exist
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$strings_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_strings_table ) ) === $icl_strings_table;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$translations_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_string_translations_table ) ) === $icl_string_translations_table;

		if ( ! $strings_table_exists || ! $translations_table_exists ) {
			return $results;
		}

		// Get all WPML languages
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
		$wpml_languages = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT code FROM {$wpdb->prefix}icl_languages WHERE active = %d",
				1
			)
		);

		if ( empty( $wpml_languages ) ) {
			return $results;
		}

		// Get all strings with their translations
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$strings_data = $wpdb->get_results(
			$wpdb->prepare(
				sprintf(
					"SELECT s.id, s.name, s.value as original, s.context,
					st.language, st.value as translation, st.status
					FROM {$icl_strings_table} s
					LEFT JOIN {$icl_string_translations_table} st ON s.id = st.string_id
					WHERE st.value IS NOT NULL AND st.value != '' AND st.status = 10 AND st.language IN (%s)
					ORDER BY s.id, st.language"
					, implode( ',', array_fill( 0, count( $wpml_languages ), '%s' ) )
				),
				$wpml_languages
			)
		);

		if ( empty( $strings_data ) ) {
			return $results;
		}

		// Group strings by language
		$strings_by_language = array();
		foreach ( $strings_data as $string_data ) {
			$lang_code = $string_data->language;
			if ( ! isset( $strings_by_language[ $lang_code ] ) ) {
				$strings_by_language[ $lang_code ] = array();
			}
			$strings_by_language[ $lang_code ][] = array(
				'original' => $string_data->original,
				'translation' => $string_data->translation,
			);
		}

		// Migrate strings for each language
		foreach ( $strings_by_language as $lang_code => $strings ) {
			// Find the corresponding Linguator language
			$lmat_lang = $this->model->languages->get( $lang_code );
			if ( ! $lmat_lang ) {
				$results['errors'][] = sprintf(
					/* translators: %s: Language code */
					__( 'Linguator language not found for WPML language: %s', 'linguator-multilingual-ai-translation' ),
					$lang_code
				);
				$results['success'] = false;
				continue;
			}

			// Get existing Linguator strings for this language
			$lmat_strings = get_term_meta( $lmat_lang->term_id, '_lmat_strings_translations', true );
			if ( ! is_array( $lmat_strings ) ) {
				$lmat_strings = array();
			}

			// Merge WPML strings with existing Linguator strings
			$strings_map = array();
			foreach ( $lmat_strings as $string_pair ) {
				if ( is_array( $string_pair ) && isset( $string_pair[0] ) ) {
					$strings_map[ $string_pair[0] ] = $string_pair;
				}
			}

			// Add WPML strings (will overwrite if duplicate)
			$strings_added = 0;
			foreach ( $strings as $string_pair ) {
				$original    = wp_unslash( $string_pair['original'] );
				$translation = wp_unslash( $string_pair['translation'] );

				// Skip empty strings
				if ( '' === $original || '' === $translation ) {
					continue;
				}

				// Add or update the string translation
				$strings_map[ $original ] = array( $original, $translation );
				$strings_added++;
			}

			// If there is nothing new to add for this language, skip quietly.
			if ( 0 === $strings_added && empty( $lmat_strings ) ) {
				continue;
			}

			// Convert back to array format and save
			$merged_strings = array_values( $strings_map );

			// Update term meta with merged strings
			update_term_meta( $lmat_lang->term_id, '_lmat_strings_translations', $merged_strings );

			// Verify the update was successful only when we actually attempted to add strings.
			$stored_meta = get_term_meta( $lmat_lang->term_id, '_lmat_strings_translations', true );

			if ( is_array( $stored_meta ) && ! empty( $stored_meta ) && $strings_added > 0 ) {
				$stored_count   = count( $stored_meta );
				$expected_count = count( $merged_strings );

				if ( $stored_count >= $expected_count ) {
					$results['strings_migrated']   += $strings_added;
					$results['languages_processed']++;
				} else {
					$results['errors'][] = sprintf(
						/* translators: %1$s: Language code, %2$d: Stored count, %3$d: Expected count */
						__( 'Failed to save strings for language: %1$s (stored: %2$d, expected: %3$d)', 'linguator-multilingual-ai-translation' ),
						$lmat_lang->slug,
						$stored_count,
						$expected_count
					);
					$results['success'] = false;
				}
			}
		}

		// Clear cache after migration
		if ( $results['strings_migrated'] > 0 ) {
			if ( class_exists( '\Linguator\Includes\Helpers\Linguator_Cache' ) ) {
				$cache = new \Linguator\Includes\Helpers\Linguator_Cache();
				foreach ( $wpml_languages as $wpml_lang ) {
					$lmat_lang = $this->model->languages->get( $wpml_lang );
					if ( $lmat_lang ) {
						$cache->clean( $lmat_lang->slug );
					}
				}
			}
		}

		return $results;
	}

	/**
	 * Perform complete migration from WPML to Linguator
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
		if ( $migrate_languages && $results['success'] ) {
			$assignments_results = $this->linguator_migrate_language_assignments();
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

		// Clear caches after migration
		if ( $results['success'] ) {
			$this->model->languages->clean_cache();
			delete_option( 'rewrite_rules' );
		}

		return $results;
	}

	/**
	 * Bulk fetch existing post language assignments
	 *
	 * @param array $post_ids Array of post IDs to check.
	 * @return array Associative array with post_id => language_slug.
	 */
	private function linguator_get_existing_post_language_assignments( $post_ids ) {
		global $wpdb;

		if ( empty( $post_ids ) ) {
			return array();
		}

		// Sanitize post IDs
		$post_ids = array_map( 'absint', $post_ids );
		$post_ids = array_filter( $post_ids );
		
		if ( empty( $post_ids ) ) {
			return array();
		}

		// Create placeholders for IN clause
		$placeholders = implode( ',', array_fill( 0, count( $post_ids ), '%d' ) );

		// Build query with placeholders
		$query = "SELECT tr.object_id, t.slug as lang_slug
			FROM {$wpdb->term_relationships} tr
			INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
			INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
			WHERE tt.taxonomy = %s
			AND tr.object_id IN ({$placeholders})";

		// Prepare arguments: taxonomy name first, then post IDs
		$prepare_args = array_merge( array( 'lmat_language' ), $post_ids );

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$results = $wpdb->get_results(
			// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			call_user_func_array( array( $wpdb, 'prepare' ), array_merge( array( $query ), $prepare_args ) )
		);
		// phpcs:enable

		$existing = array();
		if ( ! empty( $results ) ) {
			foreach ( $results as $row ) {
				$existing[ $row->object_id ] = $row->lang_slug;
			}
		}

		return $existing;
	}

	/**
	 * Bulk fetch existing term language assignments
	 *
	 * @param array $term_ids Array of term IDs to check.
	 * @return array Associative array with term_id => language_slug.
	 */
	private function linguator_get_existing_term_language_assignments( $term_ids ) {
		global $wpdb;

		if ( empty( $term_ids ) ) {
			return array();
		}

		// Sanitize term IDs
		$term_ids = array_map( 'absint', $term_ids );
		$term_ids = array_filter( $term_ids );
		
		if ( empty( $term_ids ) ) {
			return array();
		}

		// Create placeholders for IN clause
		$placeholders = implode( ',', array_fill( 0, count( $term_ids ), '%d' ) );

		// Build query with placeholders
		$query = "SELECT tr.object_id, t.slug as lang_slug
			FROM {$wpdb->term_relationships} tr
			INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
			INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
			WHERE tt.taxonomy = %s
			AND tr.object_id IN ({$placeholders})";

		// Prepare arguments: taxonomy name first, then term IDs
		$prepare_args = array_merge( array( 'lmat_term_language' ), $term_ids );

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare,PluginCheck.Security.DirectDB.UnescapedDBParameter
		$results = $wpdb->get_results(
			call_user_func_array( array( $wpdb, 'prepare' ), array_merge( array( $query ), $prepare_args ) )
		);
		// phpcs:enable

		$existing = array();
		if ( ! empty( $results ) ) {
			foreach ( $results as $row ) {
				$existing[ $row->object_id ] = $row->lang_slug;
			}
		}

		return $existing;
	}

	/**
	 * Bulk insert term relationships for language assignments
	 *
	 * @param array $assignments Array of assignments with 'object_id' and 'term_taxonomy_id'.
	 * @return int Number of rows inserted.
	 */
	private function linguator_bulk_insert_term_relationships( $assignments ) {
		global $wpdb;

		if ( empty( $assignments ) ) {
			return 0;
		}

		// Build VALUES clause for bulk insert
		$values = array();
		foreach ( $assignments as $assignment ) {
			$values[] = $wpdb->prepare(
				'(%d, %d, %d)',
				$assignment['object_id'],
				$assignment['term_taxonomy_id'],
				0 // term_order
			);
		}

		$values_string = implode( ', ', $values );

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$inserted = $wpdb->query(
			"INSERT IGNORE INTO {$wpdb->term_relationships} 
			(object_id, term_taxonomy_id, term_order) 
			VALUES {$values_string}"
		);
		// phpcs:enable

		// Update term counts for the affected taxonomies
		if ( $inserted > 0 ) {
			$term_taxonomy_ids = array_unique( array_column( $assignments, 'term_taxonomy_id' ) );
			
			if ( ! empty( $term_taxonomy_ids ) ) {
				$placeholders = implode( ',', array_fill( 0, count( $term_taxonomy_ids ), '%d' ) );
				
				// Get taxonomy names to determine if we're counting posts or terms
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
				$taxonomies = $wpdb->get_results(
					$wpdb->prepare(
						"SELECT DISTINCT term_taxonomy_id, taxonomy 
						FROM {$wpdb->term_taxonomy} 
						WHERE term_taxonomy_id IN ({$placeholders})",
						$term_taxonomy_ids
					)
				);
				// phpcs:enable
				
				// Separate post language taxonomies from term language taxonomies
				$post_lang_tt_ids = array();
				$term_lang_tt_ids = array();
				
				foreach ( $taxonomies as $tax ) {
					if ( 'lmat_language' === $tax->taxonomy ) {
						$post_lang_tt_ids[] = (int) $tax->term_taxonomy_id;
					} elseif ( 'lmat_term_language' === $tax->taxonomy ) {
						$term_lang_tt_ids[] = (int) $tax->term_taxonomy_id;
					}
				}
				
				// Update counts for post language taxonomies (exclude trashed posts)
				if ( ! empty( $post_lang_tt_ids ) ) {
					$post_placeholders = implode( ',', array_fill( 0, count( $post_lang_tt_ids ), '%d' ) );
					
					// Get all distinct post types that actually have language assignments
					// This ensures we count all custom post types, not just configured ones
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
					$post_types = $wpdb->get_col(
						$wpdb->prepare(
							"SELECT DISTINCT p.post_type
							FROM {$wpdb->term_relationships} tr
							INNER JOIN {$wpdb->posts} p
								ON p.ID = tr.object_id
							WHERE tr.term_taxonomy_id IN ({$post_placeholders})
							AND p.post_type != 'revision'
							AND p.post_type != 'nav_menu_item'",
							$post_lang_tt_ids
						)
					);
					// phpcs:enable
					
					// Ensure we have at least post and page
					if ( empty( $post_types ) ) {
						$post_types = array( 'post', 'page' );
					} else {
						$post_types = array_unique( array_merge( $post_types, array( 'post', 'page' ) ) );
					}
					
					$post_type_placeholders = implode( ',', array_fill( 0, count( $post_types ), '%s' ) );
					
					// Update counts excluding trashed posts and only counting published posts
					// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
					$wpdb->query(
						$wpdb->prepare(
							"UPDATE {$wpdb->term_taxonomy} tt
							LEFT JOIN (
								SELECT
									tr.term_taxonomy_id,
									COUNT(DISTINCT p.ID) AS count
								FROM {$wpdb->term_relationships} tr
								INNER JOIN {$wpdb->posts} p
									ON p.ID = tr.object_id
								LEFT JOIN {$wpdb->posts} pp
									ON p.post_parent = pp.ID
								WHERE
									(
										p.post_status = 'publish'
										OR (p.post_type = 'attachment' AND p.post_status = 'inherit' AND pp.post_status = 'publish' AND pp.post_type IN ({$post_type_placeholders}))
									)
									AND p.post_type IN ({$post_type_placeholders})
									AND tr.term_taxonomy_id IN ({$post_placeholders})
								GROUP BY tr.term_taxonomy_id
							) rel ON tt.term_taxonomy_id = rel.term_taxonomy_id
							SET tt.count = COALESCE(rel.count, 0)
							WHERE tt.term_taxonomy_id IN ({$post_placeholders})",
							array_merge(
								$post_types,           // for pp.post_type IN (...)
								$post_types,           // for post_type IN (...)
								$post_lang_tt_ids,     // for subquery IN (...)
								$post_lang_tt_ids      // for outer WHERE IN (...)
							)
						)
					);
					// phpcs:enable
				}
				
				// Update counts for term language taxonomies (count all relationships)
				if ( ! empty( $term_lang_tt_ids ) ) {
					$term_placeholders = implode( ',', array_fill( 0, count( $term_lang_tt_ids ), '%d' ) );
					
					// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
					$wpdb->query(
						$wpdb->prepare(
							"UPDATE {$wpdb->term_taxonomy} tt
							LEFT JOIN (
								SELECT term_taxonomy_id, COUNT(*) as count 
								FROM {$wpdb->term_relationships} 
								WHERE term_taxonomy_id IN ({$term_placeholders})
								GROUP BY term_taxonomy_id
							) tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
							SET tt.count = COALESCE(tr.count, 0)
							WHERE tt.term_taxonomy_id IN ({$term_placeholders})",
							...array_merge( $term_lang_tt_ids, $term_lang_tt_ids )
						)
					);
					// phpcs:enable
				}
			}
		}

		return $inserted ? $inserted : 0;
	}
}

