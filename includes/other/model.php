<?php
/**
 * @package Linguator
 */
namespace Linguator\Includes\Other;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Includes\Models\Languages;
use Linguator\Includes\Models\Post_Types;
use Linguator\Includes\Models\Taxonomies;
use Linguator\Includes\Options\Options;

// Link model classes
use Linguator\Includes\Services\Links\LMAT_Links_Model;
use Linguator\Includes\Services\Links\LMAT_Links_Default;
use Linguator\Includes\Services\Links\LMAT_Links_Directory;
use Linguator\Includes\Services\Links\LMAT_Links_Subdomain;
use Linguator\Includes\Services\Links\LMAT_Links_Domain;
use Linguator\Includes\Helpers\LMAT_Format_Util;
use Linguator\Includes\Helpers\LMAT_Cache;
use Linguator\Includes\Models\Translatable\LMAT_Translatable_Object;
use Linguator\Includes\Models\Translatable\LMAT_Translatable_Objects;
use Linguator\Includes\Models\Translated\LMAT_Translated_Post;
use Linguator\Includes\Models\Translated\LMAT_Translated_Term;



/**
 * Setups the language and translations model based on WordPress taxonomies.
 *
 *  
 *
 * @method bool               has_languages()                                     Checks if there are languages or not. See `Model\Languages::has()`.
 * @method array              get_languages_list(array $args = array())           Returns the list of available languages. See `Model\Languages::get_list()`.
 * @method bool               are_languages_ready()                               Tells if get_languages_list() can be used. See `Model\Languages::are_ready()`.
 * @method void               set_languages_ready()                               Sets the internal property `$languages_ready` to `true`, telling that get_languages_list() can be used. See `Model\Languages::set_ready()`.
 * @method LMAT_Language|false get_language(mixed $value)                          Returns the language by its term_id, tl_term_id, slug or locale. See `Model\Languages::get()`.
 * @method true|WP_Error      add_language(array $args)                           Adds a new language and creates a default category for this language. See `Model\Languages::add()`.
 * @method bool               delete_language(int $lang_id)                       Deletes a language. See `Model\Languages::delete()`.
 * @method true|WP_Error      update_language(array $args)                        Updates language properties. See `Model\Languages::update()`.
 * @method LMAT_Language|false get_default_language()                              Returns the default language. See `Model\Languages::get_default()`.
 * @method void               update_default_lang(string $slug)                   Updates the default language. See `Model\Languages::update_default()`.
 * @method void               maybe_create_language_terms()                       Maybe adds the missing language terms for 3rd party language taxonomies. See `Model\Languages::maybe_create_terms()`.
 * @method string[]           get_translated_post_types(bool $filter = true)      Returns post types that need to be translated. See `Model\Post_Types::get_translated()`.
 * @method bool               is_translated_post_type(string|string[] $post_type) Returns true if Linguator manages languages and translations for this post type. See `Model\Post_Types::is_translated()`.
 * @method string[]           get_translated_taxonomies(bool $filter = true)      Returns taxonomies that need to be translated. See `Model\Taxonomies::get_translated()`.
 * @method bool               is_translated_taxonomy(string|string[] $tax)        Returns true if Linguator manages languages and translations for this taxonomy. See `Model\Taxonomies::is_translated()`.
 * @method string[]           get_filtered_taxonomies(bool $filter = true)        Return taxonomies that need to be filtered (post_format like). See `Model\Taxonomies::get_filtered()`.
 * @method bool               is_filtered_taxonomy(string|string[] $tax)          Returns true if Linguator filters this taxonomy per language. See `Model\Taxonomies::is_filtered()`.
 * @method string[]           get_filtered_taxonomies_query_vars()                Returns the query vars of all filtered taxonomies. See `Model\Taxonomies::get_filtered_query_vars()`.
 */
class LMAT_Model {
	/**
	 * Internal non persistent cache object.
	 *
	 * @var LMAT_Cache<mixed>
	 */
	public $cache;

	/**
	 * Stores the plugin options.
	 *
	 * @var Options
	 */
	public $options;

	/**
	 * Translatable objects registry.
	 *
	 *  
	 *
	 * @var LMAT_Translatable_Objects
	 */
	public $translatable_objects;

	/**
	 * Translated post model.
	 *
	 * @var LMAT_Translated_Post
	 */
	public $post;

	/**
	 * Translated term model.
	 *
	 * @var LMAT_Translated_Term
	 */
	public $term;

	/**
	 * Model for the languages.
	 *
	 * @var Languages
	 */
	public $languages;

	/**
	 * Model for taxonomies translated by Linguator.
	 *
	 * @var Post_Types
	 */
	public $post_types;

	/**
	 * Model for taxonomies filtered/translated by Linguator.
	 *
	 * @var Taxonomies
	 */
	public $taxonomies;

	/**
	 * Constructor.
	 * Setups translated objects sub models.
	 * Setups filters and actions.
	 *
	 *  
	 *   Type of parameter `$options` changed from `array` to `Options`.
	 *
	 * @param Options $options Linguator options.
	 */
	public function __construct( Options &$options ) {
		$this->options              = &$options;
		$this->cache                = new LMAT_Cache();
		$this->translatable_objects = new LMAT_Translatable_Objects();
		$this->languages            = new Languages( $this->options, $this->translatable_objects, $this->cache );

		$this->post = $this->translatable_objects->register( new LMAT_Translated_Post( $this ) ); // Translated post sub model.
		$this->term = $this->translatable_objects->register( new LMAT_Translated_Term( $this ) ); // Translated term sub model.

		$this->post_types = new Post_Types( $this->post );
		$this->taxonomies = new Taxonomies( $this->term );

		// We need to clean languages cache when editing a language and when modifying the permalink structure.
		add_action( 'edited_term_taxonomy', array( $this, 'clean_languages_cache' ), 10, 2 );
		add_action( 'update_option_permalink_structure', array( $this, 'clean_languages_cache' ) );
		add_action( 'update_option_siteurl', array( $this, 'clean_languages_cache' ) );
		add_action( 'update_option_home', array( $this, 'clean_languages_cache' ) );

		add_filter( 'get_terms_args', array( $this, 'get_terms_args' ) );

		// Just in case someone would like to display the language description ;).
		add_filter( 'language_description', '__return_empty_string' );
	}

	/**
	 *
	 *  
	 *
	 * @param string $name      Name of the method being called.
	 * @param array  $arguments Enumerated array containing the parameters passed to the method.
	 * @return mixed
	 */
	public function __call( string $name, array $arguments ) {
		$methods = array(
			// Languages.
			'has_languages'               => array( $this->languages, 'has' ),
			'get_languages_list'          => array( $this->languages, 'get_list' ),
			'are_languages_ready'         => array( $this->languages, 'are_ready' ),
			'set_languages_ready'         => array( $this->languages, 'set_ready' ),
			'get_language'                => array( $this->languages, 'get' ),
			'add_language'                => array( $this->languages, 'add' ),
			'delete_language'             => array( $this->languages, 'delete' ),
			'update_language'             => array( $this->languages, 'update' ),
			'get_default_language'        => array( $this->languages, 'get_default' ),
			'update_default_lang'         => array( $this->languages, 'update_default' ),
			'maybe_create_language_terms' => array( $this->languages, 'maybe_create_terms' ),
			// Post types.
			'get_translated_post_types' => array( $this->post_types, 'get_translated' ),
			'is_translated_post_type'   => array( $this->post_types, 'is_translated' ),
			// Taxonomies.
			'get_translated_taxonomies'          => array( $this->taxonomies, 'get_translated' ),
			'is_translated_taxonomy'             => array( $this->taxonomies, 'is_translated' ),
			'get_filtered_taxonomies'            => array( $this->taxonomies, 'get_filtered' ),
			'is_filtered_taxonomy'               => array( $this->taxonomies, 'is_filtered' ),
			'get_filtered_taxonomies_query_vars' => array( $this->taxonomies, 'get_filtered_query_vars' ),
		);

		if ( isset( $methods[ $name ] ) ) {
			return call_user_func_array( $methods[ $name ], $arguments );
		}

		$debug = debug_backtrace( DEBUG_BACKTRACE_IGNORE_ARGS ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions
		trigger_error( // phpcs:ignore WordPress.PHP.DevelopmentFunctions
			sprintf(
				'Call to undefined function LMAT()->model->%1$s() in %2$s on line %3$s' . "\nError handler",
				esc_html( $name ),
				esc_html( $debug[0]['file'] ?? '' ),
				absint( $debug[0]['line'] ?? 0 )
			),
			E_USER_ERROR
		);
	}

	/**
	 * Cleans language cache
	 * can be called directly with no parameter
	 * called by the 'edited_term_taxonomy' filter with 2 parameters when count needs to be updated
	 *
	 *  
	 *
	 * @param int    $term     not used
	 * @param string $taxonomy taxonomy name
	 * @return void
	 */
	public function clean_languages_cache( $term = 0, $taxonomy = null ): void {
		if ( empty( $taxonomy ) || 'lmat_language' === $taxonomy ) {
			$this->languages->clean_cache();
		}
	}

	/**
	 * Don't query term metas when only our taxonomies are queried
	 *
	 *  
	 *
	 * @param array $args WP_Term_Query arguments
	 * @return array
	 */
	public function get_terms_args( $args ) {
		$taxonomies = $this->translatable_objects->get_taxonomy_names();

		if ( isset( $args['taxonomy'] ) && ! array_diff( (array) $args['taxonomy'], $taxonomies ) ) {
			$args['update_term_meta_cache'] = false;
		}
		return $args;
	}

	/**
	 * Adds terms clauses to the term query to filter them by languages.
	 *
	 *  
	 *
	 * @param string[]           $clauses The list of sql clauses in terms query.
	 * @param LMAT_Language|false $lang    LMAT_Language object.
	 * @return string[]                   Modified list of clauses.
	 */
	public function terms_clauses( $clauses, $lang ) {
		if ( ! empty( $lang ) && false === strpos( $clauses['join'], 'lmat_tr' ) ) {
			$clauses['join'] .= $this->term->join_clause();
			$clauses['where'] .= $this->term->where_clause( $lang );
		}
		return $clauses;
	}

	/**
	 * It is possible to have several terms with the same name in the same taxonomy ( one per language )
	 * but the native term_exists() will return true even if only one exists.
	 * So here the function adds the language parameter.
	 *
	 *  
	 *
	 * @param string              $term_name The term name.
	 * @param string              $taxonomy  Taxonomy name.
	 * @param int                 $parent    Parent term id.
	 * @param string|LMAT_Language $language  The language slug or object.
	 * @return int The `term_id` of the found term. 0 otherwise.
	 *
	 * @phpstan-return int<0, max>
	 */
	public function term_exists( $term_name, $taxonomy, $parent, $language ): int {
		global $wpdb;

		$language = $this->languages->get( $language );
		if ( empty( $language ) ) {
			return 0;
		}

		$term_name = trim( wp_unslash( $term_name ) );
		$term_name = _wp_specialchars( $term_name );

		// Use WordPress functions to find terms by name, taxonomy, and parent
		$args = array(
			'taxonomy'   => $taxonomy,
			'name'       => $term_name,
			'hide_empty' => false,
			'fields'     => 'ids',
		);

		if ( $parent > 0 ) {
			$args['parent'] = $parent;
		}

		$terms = get_terms( $args );

		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			return 0;
		}

		// Filter terms by language using WordPress functions
		foreach ( $terms as $term_id ) {
			$term_languages = wp_get_object_terms( $term_id, 'lmat_language', array( 'fields' => 'slugs' ) );
			
			if ( ! is_wp_error( $term_languages ) && in_array( $language->slug, $term_languages, true ) ) {
				return (int) $term_id;
			}
		}

		return 0;
	}

	/**
	 * Checks if a term slug exists in a given language, taxonomy, hierarchy.
	 *
	 *  
	 *
	 * @param string              $slug     The term slug to test.
	 * @param string|LMAT_Language $language The language slug or object.
	 * @param string              $taxonomy Optional taxonomy name.
	 * @param int                 $parent   Optional parent term id.
	 * @return int The `term_id` of the found term. 0 otherwise.
	 */
	public function term_exists_by_slug( $slug, $language, $taxonomy = '', $parent = 0 ): int {
		global $wpdb;

		$language = $this->languages->get( $language );
		if ( empty( $language ) ) {
			return 0;
		}

		// Use WordPress functions to find terms by slug, taxonomy, and parent
		$args = array(
			'slug'       => $slug,
			'hide_empty' => false,
			'fields'     => 'ids',
		);

		if ( ! empty( $taxonomy ) ) {
			$args['taxonomy'] = $taxonomy;
		}

		if ( $parent > 0 ) {
			$args['parent'] = $parent;
		}

		$terms = get_terms( $args );

		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			return 0;
		}

		// Filter terms by language using WordPress functions
		foreach ( $terms as $term_id ) {
			$term_languages = wp_get_object_terms( $term_id, 'lmat_language', array( 'fields' => 'slugs' ) );
			
			if ( ! is_wp_error( $term_languages ) && in_array( $language->slug, $term_languages, true ) ) {
				return (int) $term_id;
			}
		}

		return 0;
	}

	/**
	 * Returns the number of posts per language in a date, author or post type archive.
	 *
	 *  
	 *
	 * @param LMAT_Language $lang LMAT_Language instance.
	 * @param array        $q    {
	 *   WP_Query arguments:
	 *
	 *   @type string|string[] $post_type   Post type or array of post types.
	 *   @type int             $m           Combination YearMonth. Accepts any four-digit year and month.
	 *   @type int             $year        Four-digit year.
	 *   @type int             $monthnum    Two-digit month.
	 *   @type int             $day         Day of the month.
	 *   @type int             $author      Author id.
	 *   @type string          $author_name User 'user_nicename'.
	 *   @type string          $post_format Post format.
	 *   @type string          $post_status Post status.
	 * }
	 * @return int
	 *
	 * @phpstan-param array{
	 *     post_type?: non-falsy-string|array<non-falsy-string>,
	 *     post_status?: non-falsy-string,
	 *     m?: numeric-string,
	 *     year?: positive-int,
	 *     monthnum?: int<1, 12>,
	 *     day?: int<1, 31>,
	 *     author?: int<1, max>,
	 *     author_name?: non-falsy-string,
	 *     post_format?: non-falsy-string
	 * } $q
	 * @phpstan-return int<0, max>
	 */
	public function count_posts( $lang, $q = array() ): int {
		global $wpdb;

		$q = array_merge( array( 'post_type' => 'post', 'post_status' => 'publish' ), $q );

		if ( ! is_array( $q['post_type'] ) ) {
			$q['post_type'] = array( $q['post_type'] );
		}

		foreach ( $q['post_type'] as $key => $type ) {
			if ( ! post_type_exists( $type ) ) {
				unset( $q['post_type'][ $key ] );
			}
		}

		if ( empty( $q['post_type'] ) ) {
			$q['post_type'] = array( 'post' ); // We *need* a post type.
		}

		$cache_key = $this->cache->get_unique_key( 'lmat_count_posts_', $q );
		$counts    = wp_cache_get( $cache_key, 'counts' );

		if ( ! is_array( $counts ) ) {
			$counts = array();
			
			// Build base query args using WordPress functions
			$base_args = array(
				'post_type'      => $q['post_type'],
				'post_status'    => $q['post_status'],
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'suppress_filters' => false,
			);

			// Handle date filtering
			if ( ! empty( $q['m'] ) ) {
				$q['m'] = '' . preg_replace( '|[^0-9]|', '', $q['m'] );
				$base_args['year'] = substr( $q['m'], 0, 4 );
				if ( strlen( $q['m'] ) > 5 ) {
					$base_args['monthnum'] = substr( $q['m'], 4, 2 );
				}
				if ( strlen( $q['m'] ) > 7 ) {
					$base_args['day'] = substr( $q['m'], 6, 2 );
				}
			}

			if ( ! empty( $q['year'] ) ) {
				$base_args['year'] = $q['year'];
			}

			if ( ! empty( $q['monthnum'] ) ) {
				$base_args['monthnum'] = $q['monthnum'];
			}

			if ( ! empty( $q['day'] ) ) {
				$base_args['day'] = $q['day'];
			}

			// Handle author filtering
			if ( ! empty( $q['author_name'] ) ) {
				$author = get_user_by( 'slug', sanitize_title_for_query( $q['author_name'] ) );
				if ( $author ) {
					$q['author'] = $author->ID;
				}
			}

			if ( ! empty( $q['author'] ) ) {
				$base_args['author'] = $q['author'];
			}

			// Handle filtered taxonomies (post_format, etc.)
			$tax_queries = array();
			foreach ( $this->taxonomies->get_filtered_query_vars() as $tax_qv ) {
				if ( ! empty( $q[ $tax_qv ] ) ) {
					$tax_queries[] = array(
						'taxonomy' => $tax_qv === 'post_format' ? 'post_format' : $tax_qv,
						'field'    => 'slug',
						'terms'    => $q[ $tax_qv ],
					);
				}
			}

			if ( ! empty( $tax_queries ) ) {
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- Necessary for filtering posts by taxonomy terms
				$base_args['tax_query'] = $tax_queries;
			}

			// Get counts for each language
			foreach ( $this->languages->get_list() as $language ) {
				$args = $base_args;
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- Required for language-specific post counting in multilingual plugin
				$args['tax_query'][] = array(
					'taxonomy' => 'lmat_language',
					'field'    => 'term_id',
					'terms'    => $language->get_tax_prop( 'lmat_language', 'term_id' ),
				);

				$query = new \WP_Query( $args );
				$counts[ $language->get_tax_prop( 'lmat_language', 'term_taxonomy_id' ) ] = $query->found_posts;
			}

			wp_cache_set( $cache_key, $counts, 'counts' );
		}
		
		$term_taxonomy_id = $lang->get_tax_prop( 'lmat_language', 'term_taxonomy_id' );
		return empty( $counts[ $term_taxonomy_id ] ) ? 0 : $counts[ $term_taxonomy_id ];
	}

	/**
	 * Setup the links model based on options.
	 *
	 *  
	 *
	 * @return LMAT_Links_Model
	 */
	public function get_links_model(): LMAT_Links_Model {
		$c = array( 'Directory', 'Directory', 'Subdomain', 'Domain' );
		$class = get_option( 'permalink_structure' ) ? 'LMAT_Links_' . $c[ $this->options['force_lang'] ] : 'LMAT_Links_Default';

		/**
		 * Filters the links model class to use.
		 * /!\ this filter is fired *before* the $linguator object is available.
		 *
		 *  
		 *
		 * @param string $class A class name: LMAT_Links_Default, LMAT_Links_Directory, LMAT_Links_Subdomain, LMAT_Links_Domain.
		 */
		$class = apply_filters( 'lmat_links_model', $class );

		// Handle namespace resolution for dynamic class instantiation
		switch ( $class ) {
			case 'LMAT_Links_Default':
				$class = LMAT_Links_Default::class;
				break;
			case 'LMAT_Links_Directory':
				$class = LMAT_Links_Directory::class;
				break;
			case 'LMAT_Links_Subdomain':
				$class = LMAT_Links_Subdomain::class;
				break;
			case 'LMAT_Links_Domain':
				$class = LMAT_Links_Domain::class;
				break;
		}

		return new $class( $this );
	}

	/**
	 * Returns a list of object IDs without language (used in settings and wizard).
	 *
	 *  
	 *   Added the `$limit` parameter.
	 *   Added the `$types` parameter.
	 *
	 * @param int      $limit Optional. Max number of IDs to return. Defaults to -1 (no limit).
	 * @param string[] $types Optional. Types to handle (@see LMAT_Translatable_Object::get_type()). Defaults to
	 *                        an empty array (all types).
	 * @return int[][]|false {
	 *     IDs of objects without language.
	 *
	 *     @type int[] $posts Array of post ids.
	 *     @type int[] $terms Array of term ids.
	 * }
	 *
	 * @phpstan-param -1|positive-int $limit
	 */
	public function get_objects_with_no_lang( $limit = -1, array $types = array() ) {
		/**
		 * Filters the max number of IDs to return when searching objects with no language.
		 * This filter can be used to decrease the memory usage in case the number of objects
		 * without language is too big. Using a negative value is equivalent to have no limit.
		 *
		 *  
		 *   Added the `$types` parameter.
		 *
		 * @param int      $limit Max number of IDs to retrieve from the database.
		 * @param string[] $types Types to handle (@see LMAT_Translatable_Object::get_type()). An empty array means all
		 *                        types.
		 */
		$limit   = apply_filters( 'lmat_get_objects_with_no_lang_limit', $limit, $types );
		$limit   = $limit < 1 ? -1 : max( (int) $limit, 1 );
		$objects = array();

		foreach ( $this->translatable_objects as $type => $object ) {
			if ( ! empty( $types ) && ! in_array( $type, $types, true ) ) {
				continue;
			}

			$ids = $object->get_objects_with_no_lang( $limit );

			if ( empty( $ids ) ) {
				continue;
			}

			$objects[ "{$type}s" ] = $ids;
		}

		$objects = ! empty( $objects ) ? $objects : false;

		/**
		 * Filters the list of IDs of untranslated objects.
		 *
		 *  
		 *   Added the `$limit` and `$types` parameters.
		 *
		 * @param int[][]|false $objects List of lists of object IDs, `false` if no IDs found.
		 * @param int           $limit   Max number of IDs to retrieve from the database.
		 * @param string[]      $types   Types to handle (@see LMAT_Translatable_Object::get_type()). An empty array
		 *                               means all types.
		 */
		return apply_filters( 'lmat_get_objects_with_no_lang', $objects, $limit, $types );
	}

	/**
	 * Returns ids of post without language.
	 *
	 *  
	 *
	 * @param string|string[] $post_types A translated post type or an array of translated post types.
	 * @param int             $limit      Max number of objects to return. `-1` to return all of them.
	 * @return int[]
	 *
	 * @phpstan-param -1|positive-int $limit
	 * @phpstan-return list<positive-int>
	 */
	public function get_posts_with_no_lang( $post_types, $limit ): array {
		return $this->translatable_objects->get( 'post' )->get_objects_with_no_lang( $limit, (array) $post_types );
	}

	/**
	 * Returns ids of terms without language.
	 *
	 *  
	 *
	 * @param string|string[] $taxonomies A translated taxonomy or an array of taxonomies post types.
	 * @param int             $limit      Max number of objects to return. `-1` to return all of them.
	 * @return int[]
	 *
	 * @phpstan-param -1|positive-int $limit
	 * @phpstan-return list<positive-int>
	 */
	public function get_terms_with_no_lang( $taxonomies, $limit ): array {
		return $this->translatable_objects->get( 'term' )->get_objects_with_no_lang( $limit, (array) $taxonomies );
	}

	/**
	 * Assigns the default language to objects in mass.
	 *
	 *  
	 *
	 * @param LMAT_Language|null $lang  Optional. The language to assign to objects. Defaults to `null` (default language).
	 * @param string[]          $types Optional. Types to handle (@see LMAT_Translatable_Object::get_type()). Defaults
	 *                                 to an empty array (all types).
	 * @return void
	 */
	public function set_language_in_mass( $lang = null, array $types = array() ): void {
		if ( ! $lang instanceof LMAT_Language ) {
			$lang = $this->languages->get_default();

			if ( empty( $lang ) ) {
				return;
			}
		}

		// 1000 is an arbitrary value that will be filtered by `lmat_get_objects_with_no_lang_limit`.
		$nolang = $this->get_objects_with_no_lang( 1000, $types );

		if ( empty( $nolang ) ) {
			return;
		}

		/**
		 * Keep track of types where we set the language:
		 * those are types where we may have more items to process if we have more than 1000 items in total.
		 * This will prevent unnecessary SQL queries in the next recursion: if we have 0 items in this recursion for
		 * a type, we'll still have 0 in the next one, no need for a new query.
		 */
		$types_with_objects = array();

		foreach ( $this->translatable_objects as $type => $object ) {
			if ( empty( $nolang[ "{$type}s" ] ) ) {
				continue;
			}

			if ( ! empty( $types ) && ! in_array( $type, $types, true ) ) {
				continue;
			}

			$object->set_language_in_mass( $nolang[ "{$type}s" ], $lang );
			$types_with_objects[] = $type;
		}

		if ( empty( $types_with_objects ) ) {
			return;
		}

		$this->set_language_in_mass( $lang, $types_with_objects );
	}
}

