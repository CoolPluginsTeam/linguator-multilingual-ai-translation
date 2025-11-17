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
		$translations_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_translations_table ) ) === $icl_translations_table;
		$languages_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_languages_table ) ) === $icl_languages_table;

		if ( ! $translations_table_exists || ! $languages_table_exists ) {
			return false;
		}

		// Count active languages
		$wpml_languages_count = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$icl_languages_table} WHERE active = 1"
		);

		// Get WPML settings
		$wpml_settings = get_option( 'icl_sitepress_settings', array() );

		// If no languages found and no settings, return false
		if ( empty( $wpml_languages_count ) && empty( $wpml_settings ) ) {
			return false;
		}

		// Count post translations (grouped by trid)
		$post_translations_count = (int) $wpdb->get_var(
			"SELECT COUNT(DISTINCT trid) 
			FROM {$icl_translations_table} 
			WHERE element_type LIKE 'post_%' 
			AND trid IS NOT NULL 
			AND trid > 0"
		);

		// Count term translations (grouped by trid)
		$term_translations_count = (int) $wpdb->get_var(
			"SELECT COUNT(DISTINCT trid) 
			FROM {$icl_translations_table} 
			WHERE element_type LIKE 'tax_%' 
			AND trid IS NOT NULL 
			AND trid > 0"
		);

		// Count posts with language assignments
		$posts_count = (int) $wpdb->get_var(
			"SELECT COUNT(DISTINCT element_id) 
			FROM {$icl_translations_table} 
			WHERE element_type LIKE 'post_%'"
		);

		// Count strings translations (if WPML String Translation is active)
		$strings_count = 0;
		$icl_strings_table = $wpdb->prefix . 'icl_string_translations';
		$strings_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_strings_table ) ) === $icl_strings_table;
		if ( $strings_table_exists ) {
			$strings_count = (int) $wpdb->get_var(
				"SELECT COUNT(*) FROM {$icl_strings_table} WHERE value IS NOT NULL AND value != ''"
			);
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
		$wpml_languages = $wpdb->get_results(
			"SELECT * FROM {$icl_languages_table} WHERE active = 1 ORDER BY id ASC"
		);

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
				
				if ( ! is_wp_error( $update_result ) ) {
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
	public function migrate_language_assignments() {
		global $wpdb;

		$results = array(
			'success' => true,
			'posts_assigned' => 0,
			'terms_assigned' => 0,
			'errors' => array(),
		);

		$icl_translations_table = $wpdb->prefix . 'icl_translations';

		// Migrate post language assignments
		$posts_with_language = $wpdb->get_results(
			"SELECT DISTINCT element_id, language_code 
			FROM {$icl_translations_table} 
			WHERE element_type LIKE 'post_%' 
			AND element_id IS NOT NULL"
		);

		if ( ! empty( $posts_with_language ) ) {
			foreach ( $posts_with_language as $post_data ) {
				$post_id = (int) $post_data->element_id;
				$lang_code = $post_data->language_code;

				// Check if this language exists in Linguator
				$lmat_lang = $this->model->languages->get( $lang_code );
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
		// In WPML, terms are stored with element_type like 'tax_category', 'tax_post_tag', etc.
		// The element_id is the term_taxonomy_id, not the term_id
		$terms_with_language = $wpdb->get_results(
			"SELECT DISTINCT t.term_id, icl.language_code
			FROM {$icl_translations_table} icl
			INNER JOIN {$wpdb->term_taxonomy} tt ON icl.element_id = tt.term_taxonomy_id
			INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
			WHERE icl.element_type LIKE 'tax_%'
			AND icl.element_id IS NOT NULL"
		);

		if ( ! empty( $terms_with_language ) ) {
			foreach ( $terms_with_language as $term_data ) {
				$term_id = (int) $term_data->term_id;
				$lang_code = $term_data->language_code;

				// Check if this language exists in Linguator
				$lmat_lang = $this->model->languages->get( $lang_code );
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

		// Migrate post translations
		// Group by trid to get translation groups
		$post_translation_groups = $wpdb->get_results(
			"SELECT trid, GROUP_CONCAT(CONCAT(language_code, ':', element_id) SEPARATOR '|') as translations
			FROM {$icl_translations_table}
			WHERE element_type LIKE 'post_%'
			AND trid IS NOT NULL
			AND trid > 0
			GROUP BY trid
			HAVING COUNT(*) > 1"
		);

		if ( ! empty( $post_translation_groups ) ) {
			foreach ( $post_translation_groups as $group ) {
				// Parse translations: "en:123|fr:456|de:789"
				$translations_parts = explode( '|', $group->translations );
				$lmat_translations = array();

				foreach ( $translations_parts as $part ) {
					list( $lang_code, $post_id ) = explode( ':', $part, 2 );
					$post_id = (int) $post_id;

					// Check if this language exists in Linguator
					$lmat_lang = $this->model->languages->get( $lang_code );
					if ( $lmat_lang ) {
						$lmat_translations[ $lang_code ] = $post_id;
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

		// Migrate term translations
		// Group by trid to get translation groups
		$term_translation_groups = $wpdb->get_results(
			"SELECT trid, GROUP_CONCAT(CONCAT(icl.language_code, ':', t.term_id) SEPARATOR '|') as translations
			FROM {$icl_translations_table} icl
			INNER JOIN {$wpdb->term_taxonomy} tt ON icl.element_id = tt.term_taxonomy_id
			INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
			WHERE icl.element_type LIKE 'tax_%'
			AND icl.trid IS NOT NULL
			AND icl.trid > 0
			GROUP BY icl.trid
			HAVING COUNT(*) > 1"
		);

		if ( ! empty( $term_translation_groups ) ) {
			foreach ( $term_translation_groups as $group ) {
				// Parse translations: "en:123|fr:456|de:789"
				$translations_parts = explode( '|', $group->translations );
				$lmat_translations = array();

				foreach ( $translations_parts as $part ) {
					list( $lang_code, $term_id ) = explode( ':', $part, 2 );
					$term_id = (int) $term_id;

					// Check if this language exists in Linguator
					$lmat_lang = $this->model->languages->get( $lang_code );
					if ( $lmat_lang ) {
						// Ensure the term has the CORRECT language assigned before saving translations
						$existing_lang = $this->model->term->get_language( $term_id );
						if ( ! $existing_lang || $existing_lang->slug !== $lang_code ) {
							// Assign the correct language to this term
							$this->model->term->set_language( $term_id, $lmat_lang );
						}

						$lmat_translations[ $lang_code ] = $term_id;
					}
				}

				if ( count( $lmat_translations ) > 1 ) {
					// Get the first term ID to create translation group
					$first_term_id = reset( $lmat_translations );

					// Verify the first term has a language
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
				$domains = $this->convert_language_slugs_in_array( $domains );
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
	private function convert_language_slugs_in_array( $array ) {
		foreach ( $array as $key => $value ) {
			if ( is_array( $value ) ) {
				$array[ $key ] = $this->convert_language_slugs_in_array( $value );
			} elseif ( is_string( $key ) ) {
				// Check if key is a language slug
				$lmat_lang = $this->model->languages->get( $key );
				if ( ! $lmat_lang ) {
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
		$strings_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_strings_table ) ) === $icl_strings_table;
		$translations_table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $icl_string_translations_table ) ) === $icl_string_translations_table;

		if ( ! $strings_table_exists || ! $translations_table_exists ) {
			return $results;
		}

		// Get all WPML languages
		$wpml_languages = $wpdb->get_results(
			"SELECT code FROM {$wpdb->prefix}icl_languages WHERE active = 1"
		);

		if ( empty( $wpml_languages ) ) {
			return $results;
		}

		// Get all strings with their translations
		$strings_data = $wpdb->get_results(
			"SELECT s.id, s.name, s.value as original, s.context,
				st.language, st.value as translation, st.status
			FROM {$icl_strings_table} s
			LEFT JOIN {$icl_string_translations_table} st ON s.id = st.string_id
			WHERE st.value IS NOT NULL AND st.value != '' AND st.status = 10
			ORDER BY s.id, st.language"
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
				$original = wp_unslash( $string_pair['original'] );
				$translation = wp_unslash( $string_pair['translation'] );

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
			update_term_meta( $lmat_lang->term_id, '_lmat_strings_translations', $merged_strings );

			// Verify the update was successful
			$stored_meta = get_term_meta( $lmat_lang->term_id, '_lmat_strings_translations', true );

			if ( is_array( $stored_meta ) && ! empty( $stored_meta ) ) {
				$stored_count = count( $stored_meta );
				$expected_count = count( $merged_strings );

				if ( $stored_count >= $expected_count || ( $stored_count > 0 && $strings_added > 0 ) ) {
					$results['strings_migrated'] += $strings_added;
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
			} else {
				$results['errors'][] = sprintf(
					/* translators: %s: Language code */
					__( 'Failed to save strings for language: %s (no strings stored)', 'linguator-multilingual-ai-translation' ),
					$lmat_lang->slug
				);
				$results['success'] = false;
			}
		}

		// Clear cache after migration
		if ( $results['strings_migrated'] > 0 ) {
			if ( class_exists( '\Linguator\Includes\Helpers\LMAT_Cache' ) ) {
				$cache = new \Linguator\Includes\Helpers\LMAT_Cache();
				foreach ( $wpml_languages as $wpml_lang ) {
					$lmat_lang = $this->model->languages->get( $wpml_lang->code );
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

		// Clear caches after migration
		if ( $results['success'] ) {
			$this->model->languages->clean_cache();
			delete_option( 'rewrite_rules' );
		}

		return $results;
	}
}

