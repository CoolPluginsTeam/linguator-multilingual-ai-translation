<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Models\Translated;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Includes\Options\Options;
use Linguator\Includes\Models\Translatable\LMAT_Translatable_Object_With_Types_Interface;
use Linguator\Includes\Models\Translatable\LMAT_Translatable_Object_With_Types_Trait;
use Linguator\Includes\Other\LMAT_Model;
use Linguator\Includes\Other\LMAT_Language;
use Linguator\Includes\Other\LMAT_Switch_Language;
use WP_Error;
use WP_Post;



/**
 * Sets the posts languages and translations model up.
 *
 *  
 *
 * @phpstan-import-type DBInfoWithType from LMAT_Translatable_Object_With_Types_Interface
 */
class LMAT_Translated_Post extends LMAT_Translated_Object implements LMAT_Translatable_Object_With_Types_Interface {

	/**
	 * Taxonomy name for the languages.
	 *
	 * @var string
	 *
	 * @phpstan-var non-empty-string
	 */
	protected $tax_language = 'lmat_language';

	/**
	 * Identifier that must be unique for each type of content.
	 * Also used when checking capabilities.
	 *
	 * @var string
	 *
	 * @phpstan-var non-empty-string
	 */
	protected $type = 'post';

	/**
	 * Identifier for each type of content to used for cache type.
	 *
	 * @var string
	 *
	 * @phpstan-var non-empty-string
	 */
	protected $cache_type = 'posts';

	/**
	 * Taxonomy name for the translation groups.
	 *
	 * @var string
	 *
	 * @phpstan-var non-empty-string
	 */
	protected $tax_translations = 'lmat_post_translations';

	/**
	 * Constructor.
	 *
	 *  
	 *
	 * @param LMAT_Model $model Instance of `LMAT_Model`.
	 */
	public function __construct( LMAT_Model $model ) {
		parent::__construct( $model );

		$this->init();
	}

	/**
	 * Registers the language taxonomy.
	 *
	 *  
	 *   Protected and renamed from `register_taxonomy()`.
	 *
	 * @return void
	 */
	protected function register_language_taxonomy(): void {
		register_taxonomy(
			$this->tax_language,
			(array) $this->get_translated_object_types(),
			array(
				'public'             => false,
				'show_ui'            => false, // Hide the taxonomy on admin side, needed for WP 4.4.x.
				'show_in_nav_menus'  => false, // No metabox for nav menus, needed for WP 4.4.x.
				'publicly_queryable' => true, // Since WP 4.5.
				'query_var'          => 'lmat_lang', // See `add_language_taxonomy_query_var()`.
				'rewrite'            => false, // Rewrite rules are added through filters when needed.
				'_lmat'               => true, // Linguator taxonomy.
			)
		);

		add_action( 'setup_theme', array( $this, 'add_language_taxonomy_query_var' ) );
	}

	/**
	 * Adds the language query var once the global `$wp` is available.
	 *
	 *  
	 * @see WP_Taxonomy::add_rewrite_rules()
	 *
	 * @return void
	 */
	public function add_language_taxonomy_query_var(): void {
		$GLOBALS['wp']->add_query_var( 'lmat_lang' );
	}

	/**
	 * Adds hooks.
	 *
	 *  
	 *
	 * @return static
	 */
	public function init() {
		// Setups post types to translate.
		add_action( 'registered_post_type', array( $this, 'registered_post_type' ) );

		// Forces updating posts cache.
		add_action( 'pre_get_posts', array( $this, 'pre_get_posts' ) );
		return parent::init();
	}

	/**
	 * Deletes a translation of a post.
	 *
	 *  
	 *
	 * @param int $id Post ID.
	 * @return void
	 */
	public function delete_translation( $id ) {
		$id = $this->sanitize_int_id( $id );

		if ( empty( $id ) ) {
			return;
		}

		parent::delete_translation( $id );
		wp_set_object_terms( $id, array(), $this->tax_translations );
	}

	/**
	 * Returns object types (post types) that need to be translated.
	 * The post types list is cached for better performance.
	 * The method waits for 'after_setup_theme' to apply the cache to allow themes adding the filter in functions.php.
	 *
	 *  
	 *
	 * @param bool $filter True if we should return only valid registered object types.
	 * @return string[] Object type names for which Linguator manages languages.
	 *
	 * @phpstan-return array<non-empty-string, non-empty-string>
	 */
	public function get_translated_object_types( $filter = true ) {
		$post_types = $this->cache->get( 'post_types' );

		if ( false === $post_types ) {
			$post_types = array( 'post' => 'post', 'page' => 'page', 'wp_block' => 'wp_block' );

			if ( ! empty( $this->options['post_types'] ) ) {
				$post_types = array_merge( $post_types, array_combine( $this->options['post_types'], $this->options['post_types'] ) );
			}

			if ( empty( $this->options['media_support'] ) ) {
				// In case the post type attachment is stored in the option.
				unset( $post_types['attachment'] );
			} else {
				$post_types['attachment'] = 'attachment';
			}

			/**
			 * Filters the list of post types available for translation.
			 * The default are post types which have the parameter ‘public’ set to true.
			 * The filter must be added soon in the WordPress loading process:
			 * in a function hooked to ‘plugins_loaded’ or directly in functions.php for themes.
			 *
			 *  
			 *
			 * @param string[] $post_types  List of post type names (as array keys and values).
			 * @param bool     $is_settings True when displaying the list of custom post types in Linguator settings.
			 */
			$post_types = (array) apply_filters( 'lmat_get_post_types', $post_types, false );

			if ( did_action( 'after_setup_theme' ) && ! doing_action( 'switch_blog' ) ) {
				$this->cache->set( 'post_types', $post_types );
			}
		}

		/** @var array<non-empty-string, non-empty-string> $post_types */
		return $filter ? array_intersect( $post_types, get_post_types() ) : $post_types;
	}

	/**
	 * Returns true if Linguator manages languages for this object type.
	 *
	 *  
	 *
	 * @param string|string[] $object_type Object type (post type) name or array of object type names.
	 * @return bool
	 *
	 * @phpstan-param non-empty-string|non-empty-string[] $object_type
	 */
	public function is_translated_object_type( $object_type ) {
		$post_types = $this->get_translated_object_types( false );
		return ( is_array( $object_type ) && array_intersect( $object_type, $post_types ) ) || in_array( $object_type, $post_types ) || ( 'any' === $object_type && ! empty( $post_types ) );
	}

	/**
	 * Checks if registered post type must be translated.
	 *
	 *  
	 *
	 * @param string $post_type Post type name.
	 * @return void
	 *
	 * @phpstan-param non-empty-string $post_type
	 */
	public function registered_post_type( $post_type ) {
		if ( $this->is_translated_object_type( $post_type ) ) {
			register_taxonomy_for_object_type( $this->tax_language, $post_type );
			register_taxonomy_for_object_type( $this->tax_translations, $post_type );
		}
	}

	/**
	 * Forces calling 'update_object_term_cache' when querying posts or pages.
	 * This is especially useful for nav menus with a lot of pages as, without doing this,
	 * we would have one query per page in the menu to get the page language for the permalink.
	 *
	 *  
	 *
	 * @param WP_Query $query Reference to the query object.
	 * @return void
	 */
	public function pre_get_posts( $query ) {
		if ( ! empty( $query->query['post_type'] ) && $this->is_translated_object_type( $query->query['post_type'] ) ) {
			$query->query_vars['update_post_term_cache'] = true;
		}
	}

	/**
	 * Checks if the current user can read the post.
	 *
	 *  
	 *   Renamed the parameter $post_id into $id.
	 *
	 * @param int    $id Post ID
	 * @param string $context Optional, 'edit' or 'view'. Defaults to 'view'.
	 * @return bool
	 *
	 * @phpstan-param non-empty-string $context
	 */
	public function current_user_can_read( $id, $context = 'view' ) {
		$id = $this->sanitize_int_id( $id );

		if ( empty( $id ) ) {
			return false;
		}

		$post = get_post( $id );

		if ( empty( $post ) ) {
			return false;
		}

		if ( 'inherit' === $post->post_status && $post->post_parent ) {
			$post = get_post( $post->post_parent );

			if ( empty( $post ) ) {
				return false;
			}
		}

		if ( 'inherit' === $post->post_status || in_array( $post->post_status, get_post_stati( array( 'public' => true ) ) ) ) {
			return true;
		}

		// Follow WP practices, which shows links to private posts ( when readable ), but not for draft posts ( ex: get_adjacent_post_link() )
		if ( in_array( $post->post_status, get_post_stati( array( 'private' => true ) ) ) ) {
			if ( ! is_user_logged_in() ) {
				return false;
			}

			$user = wp_get_current_user();

			if ( (int) $user->ID === (int) $post->post_author ) {
				return true;
			}

			$post_type_object = get_post_type_object( $post->post_type );

			return ! empty( $post_type_object ) && current_user_can( $post_type_object->cap->read_private_posts );
		}

		// In edit context, show draft and future posts.
		if ( 'edit' === $context ) {
			$states = get_post_stati(
				array(
					'protected'              => true,
					'show_in_admin_all_list' => true,
				)
			);

			if ( in_array( $post->post_status, $states ) ) {
				$user = wp_get_current_user();
				return is_user_logged_in() && ( current_user_can( 'edit_posts' ) || (int) $user->ID === (int) $post->post_author );
			}
		}

		return false;
	}

	/**
	 * Creates a media translation
	 *
	 *  
	 *
	 * @param int                 $post_id Original attachment id.
	 * @param string|LMAT_Language $lang    New translation language.
	 * @return int Attachment id of the translated media.
	 */
	public function create_media_translation( $post_id, $lang ) {
		if ( empty( $post_id ) ) {
			return 0;
		}

		$post = get_post( $post_id, ARRAY_A );

		if ( empty( $post ) ) {
			return 0;
		}

		$lang = $this->languages->get( $lang ); // Make sure we get a valid language slug.

		if ( empty( $lang ) ) {
			return 0;
		}

		// Create a new attachment ( translate attachment parent if exists ).
		add_filter( 'lmat_enable_duplicate_media', '__return_false', 99 ); // Avoid a conflict with automatic duplicate at upload.
		unset( $post['ID'] ); // Will force the creation.
		if ( ! empty( $post['post_parent'] ) ) {
			$post['post_parent'] = (int) $this->get_translation( $post['post_parent'], $lang->slug );
		}
		$post['tax_input'] = array( 'lmat_language' => array( $lang->slug ) ); // Assigns the language.

		// Loads the strings translations with the attachment's target language.
		LMAT()->load_strings_translations( $lang->slug );

		$tr_id = wp_insert_attachment( wp_slash( $post ) );
		remove_filter( 'lmat_enable_duplicate_media', '__return_false', 99 ); // Restore automatic duplicate at upload.

		// Copy metadata.
		$data = wp_get_attachment_metadata( $post_id, true ); // Unfiltered.
		if ( is_array( $data ) ) {
			wp_update_attachment_metadata( $tr_id, wp_slash( $data ) ); // Directly uses update_post_meta, so expects slashed.
		}

		// Copy attached file.
		if ( $file = get_attached_file( $post_id, true ) ) { // Unfiltered.
			update_attached_file( $tr_id, wp_slash( $file ) ); // Directly uses update_post_meta, so expects slashed.
		}

		// Copy alternative text. Direct use of the meta as there is no filtered wrapper to manipulate it.
		if ( $text = get_post_meta( $post_id, '_wp_attachment_image_alt', true ) ) {
			add_post_meta( $tr_id, '_wp_attachment_image_alt', wp_slash( $text ) );
		}

		$this->set_language( $tr_id, $lang );

		$translations = $this->get_translations( $post_id );
		$translations[ $lang->slug ] = $tr_id;
		$this->save_translations( $tr_id, $translations );

		$switch_language = new LMAT_Switch_Language();
		$switch_language->switch_language( $lang );

		/**
		 * Fires after a media translation is created
		 *
		 *  
		 *
		 * @param int    $post_id Post id of the source media.
		 * @param int    $tr_id   Post id of the new media translation.
		 * @param string $slug    Language code of the new translation.
		 */
		do_action( 'lmat_translate_media', $post_id, $tr_id, $lang->slug );

		// Restores the strings translations with the current language.
		if ( LMAT()->curlang instanceof LMAT_Language ) {
			LMAT()->load_strings_translations( LMAT()->curlang->slug );
		}

		return $tr_id;
	}

	/**
	 * Returns a list of posts in a language ($lang) not translated in another language ($untranslated_in).
	 *
	 *  
	 *
	 * @param string       $type            Post type.
	 * @param LMAT_Language $untranslated_in The language the posts must not be translated in.
	 * @param LMAT_Language $lang            Language of the searched posts.
	 * @param string       $search          Limit the results to the posts matching this string.
	 * @return WP_Post[] Array of posts.
	 */
	public function get_untranslated( $type, LMAT_Language $untranslated_in, LMAT_Language $lang, $search = '' ) {
		global $wpdb;

		$args = array( 'numberposts' => 20 ); // Limit to 20 posts by default.
		/**
		 * Filters the query args when auto suggesting untranslated posts in the Languages metabox.
		 *
		 *  
		 *   Handled arguments restricted to `numberposts` to limit queried posts.
		 *            No `WP_Query` is made anymore, a custom one is used instead.
		 *
		 * @param array $args WP_Query arguments
		 */
		$args = apply_filters( 'lmat_ajax_posts_not_translated_args', $args );

		$limit             = $args['numberposts'];
		$search_like       = '%' . $wpdb->esc_like( $search ) . '%';
		$untranslated_like = '%' . $wpdb->esc_like( $untranslated_in->slug ) . '%';
		// Use WordPress functions to search for posts with specific language and search terms
		$search_term = str_replace( array( '%', '_' ), array( '', '' ), $search_like );
		$search_term = trim( $search_term );
		
		// Get posts in the specified language that match search criteria
		$query_args = array(
			'post_type'      => $type,
			'post_status'    => array( 'publish', 'private', 'draft', 'pending', 'future' ),
			'posts_per_page' => $limit,
			's'              => $search_term, // WordPress search covers title, content, and excerpt
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- Necessary for language filtering, already optimized with term_id and limited results
			'tax_query'      => array(
				array(
					'taxonomy'         => $this->tax_language,
					'terms'            => $lang->get_tax_prop( $this->tax_language, 'term_id' ),
					'field'            => 'term_id',
					'include_children' => false,
				),
			),
			'suppress_filters' => false,
		);
		
		$query = new \WP_Query( $query_args );
		$all_posts = $query->posts;
		
		// Filter out posts that already have translations
		$posts = array();
		foreach ( $all_posts as $post ) {
			// Check if this post already has translations
			$translation_terms = wp_get_object_terms( $post->ID, 'lmat_post_translations', array( 'fields' => 'all' ) );
			$has_translations = false;
			
			if ( ! is_wp_error( $translation_terms ) && ! empty( $translation_terms ) ) {
				foreach ( $translation_terms as $term ) {
					// Check if the description contains translation data matching our pattern
					if ( strpos( $term->description, trim( str_replace( '%', '', $untranslated_like ) ) ) !== false ) {
						$has_translations = true;
						break;
					}
				}
			}
			
			// Only include posts that don't have translations
			if ( ! $has_translations ) {
				$posts[] = $post;
			}
		}

		foreach ( $posts as $i => $post ) {
			if ( ! $this->current_user_can_read( $post->ID, 'edit' ) ) {
				unset( $posts[ $i ] );
				continue;
			}

			$posts[ $i ] = new WP_Post( $post );
		}

		return $posts;
	}

	/**
	 * Returns the description to use for the "language properties" in the REST API.
	 *
	 *  
	 * @see Linguator\modules\REST\V2\Languages::get_item_schema()
	 *
	 * @return string
	 */
	public function get_rest_description(): string {
		return __( 'Language taxonomy properties for post types.', 'linguator-multilingual-ai-translation' );
	}

	/**
	 * Returns database-related information that can be used in some of this class methods.
	 * These are specific to the table containing the objects.
	 *
	 * @see LMAT_Translatable_Object::join_clause()
	 * @see LMAT_Translatable_Object::get_raw_objects_with_no_lang()
	 *
	 *  
	 *
	 * @return string[] {
	 *     @type string $table         Name of the table.
	 *     @type string $id_column     Name of the column containing the object's ID.
	 *     @type string $type_column   Name of the column containing the object's type.
	 *     @type string $default_alias Default alias corresponding to the object's table.
	 * }
	 * @phpstan-return DBInfoWithType
	 */
	protected function get_db_infos() {
		return array(
			'table'         => $GLOBALS['wpdb']->posts,
			'id_column'     => 'ID',
			'type_column'   => 'post_type',
			'default_alias' => $GLOBALS['wpdb']->posts,
		);
	}

	/**
	 * Wraps `wp_insert_post` with language feature.
	 *
	 *  
	 *
	 * @param array        $postarr {
	 *     Optional. An array of elements that make up a post to insert.
	 *     @See wp_insert_post() for accepted arguments.
	 *
	 *     @type string[] $translations The translation group to assign to the post with language slug as keys and post ID as values.
	 * }
	 * @param LMAT_Language $language The post language object.
	 * @return int|WP_Error The post ID on success. The value `WP_Error` on failure.
	 */
	public function insert( array $postarr, LMAT_Language $language ) {
		$post_id = wp_insert_post( $postarr, true );
		if ( is_wp_error( $post_id ) ) {
			// Something went wrong!
			return $post_id;
		}

		$this->set_language( $post_id, $language );

		if ( ! empty( $postarr['translations'] ) ) {
			$this->save_translations( $post_id, $postarr['translations'] );
		}

		return $post_id;
	}

	/**
	 * Wraps `wp_update_post` with language feature.
	 *
	 *  
	 *
	 * @param array $postarr {
	 *     Optional. An array of elements that make up a post to update.
	 *     @See wp_insert_post() for accepted arguments.
	 *
	 *     @type LMAT_Language|string $lang         The post language object or slug.
	 *     @type string[]            $translations The translation group to assign to the post with language slug as keys and post ID as values.
	 * }
	 * @return int|WP_Error The post ID on success. The value `WP_Error` on failure.
	 */
	public function update( array $postarr ) {
		if ( ! empty( $postarr['lang'] ) ) {
			$post = get_post( $postarr['ID'] );
			if ( ! $post instanceof WP_Post ) {
				return new WP_Error( 'invalid_post', __( 'Invalid post ID.', 'linguator-multilingual-ai-translation' ) );
			}

			$language = $this->languages->get( $postarr['lang'] );
			if ( ! $language instanceof LMAT_Language ) {
				return new WP_Error( 'invalid_language', __( 'Please provide a valid language.', 'linguator-multilingual-ai-translation' ) );
			}

			$this->set_language( $postarr['ID'], $language );
		}

		$post_id = wp_update_post( $postarr, true );
		if ( is_wp_error( $post_id ) ) {
			// Something went wrong!
			return $post_id;
		}

		if ( ! empty( $postarr['translations'] ) ) {
			$this->save_translations( $postarr['ID'], $postarr['translations'] );
		}

		return $post_id;
	}
}
