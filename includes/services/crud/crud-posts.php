<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Services\Crud;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Other\LMAT_Language;
use Linguator\Includes\Other\LMAT_Model;
use Linguator\Modules\REST\Request;
use Linguator\Includes\Capabilities\User;
use Linguator\Includes\Capabilities\Create\Post as Create_Post;
use WP_Term;

/**
 * Adds actions and filters related to languages when creating, updating or deleting posts.
 * Actions and filters triggered when reading posts are handled separately.
 *
 *  
 */
class LMAT_CRUD_Posts {
	/**
	 * @var LMAT_Model
	 */
	protected $model;

	/**
	 * Preferred language to assign to a new post.
	 *
	 * @var LMAT_Language|null
	 */
	protected $pref_lang;

	/**
	 * Current language.
	 *
	 * @var LMAT_Language|null
	 */
	protected $curlang;

	/**
	 * Reference to the Linguator options array.
	 *
	 * @var array
	 */
	protected $options;

	/**
	 * Reference to the Linguator Request object.
	 *
	 * @var Request
	 */
	private $request;

	/**
	 * Constructor
	 *
	 *  
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->options   = &$linguator->options;
		$this->model     = &$linguator->model;
		$this->pref_lang = &$linguator->pref_lang;
		$this->curlang   = &$linguator->curlang;
		$this->request   = &$linguator->request;

		add_action( 'save_post', array( $this, 'save_post' ), 10, 2 );
		add_action( 'set_object_terms', array( $this, 'set_object_terms' ), 10, 4 );
		add_filter( 'wp_insert_post_parent', array( $this, 'wp_insert_post_parent' ), 10, 2 );
		add_action( 'before_delete_post', array( $this, 'delete_post' ) );
		add_action( 'post_updated', array( $this, 'force_tags_translation' ), 10, 3 );
		// Link translations when leaving auto-draft status (first real save)
		add_action( 'transition_post_status', array( $this, 'on_transition_post_status' ), 10, 3 );
		// Capture intent as soon as editor opens via add-translation link
		add_action( 'admin_init', array( $this, 'capture_add_translation_intent' ) );

		// Specific for media
		if ( $linguator->options['media_support'] ) {
			add_action( 'add_attachment', array( $this, 'set_default_language' ) );
			add_action( 'delete_attachment', array( $this, 'delete_post' ) );
			add_filter( 'wp_delete_file', array( $this, 'wp_delete_file' ) );
		}
	}

	/**
	 * Capture the intent to add a translation when opening `post-new.php` with
	 * `from_post` and `lang` query args. This protects against cases where
	 * the initial auto-draft creation does not trigger `save_post`.
	 *
	 * @return void
	 */
	public function capture_add_translation_intent() {
		if ( ! is_admin() ) {
			return;
		}
		
		// Only run on post editor pages to avoid unnecessary database queries on every admin page
		global $pagenow;
		if ( ! in_array( $pagenow, array( 'post.php', 'post-new.php' ), true ) ) {
			return;
		}
		
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			return;
		}
		if ( ! empty( $_GET['from_post'] ) && ! empty( $_GET['new_lang'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			update_user_meta( $user_id, '_lmat_pending_linking_intent', array(
				'from_post' => (int) $_GET['from_post'], // phpcs:ignore WordPress.Security.NonceVerification
				'new_lang'  => sanitize_key( $_GET['new_lang'] ), // phpcs:ignore WordPress.Security.NonceVerification
			) );
		} else {
			// Visiting the editor without explicit intent: purge any stale intent.
			delete_user_meta( $user_id, '_lmat_pending_linking_intent' );
		}
	}

	/**
	 * When a new post moves out of auto-draft, complete deferred translation linking.
	 *
	 *  
	 *
	 * @param string  $new_status Transition to this post status.
	 * @param string  $old_status Previous post status.
	 * @param WP_Post $post       Post object.
	 * @return void
	 */
	public function on_transition_post_status( $new_status, $old_status, $post ) {
		if ( 'auto-draft' === $old_status && 'auto-draft' !== $new_status && $this->model->is_translated_post_type( $post->post_type ) ) {
			$this->handle_translation_linking( $post->ID );
		}
	}

	/**
	 * Allows to set a language by default for posts if it has no language yet.
	 *
	 *  
	 *
	 * @param int $post_id Post ID.
	 * @return void
	 */
	public function set_default_language( $post_id ) {
		if ( is_multisite() && ms_is_switched() && ! $this->model->has_languages() ) {
			return;
		}

		if ( $this->model->post->get_language( $post_id ) ) {
			return;
		}

		$post_language = new Create_Post(
			$this->model,
			$this->request,
			$this->pref_lang instanceof LMAT_Language ? $this->pref_lang : null, // Can be `false` as well...
			$this->curlang instanceof LMAT_Language ? $this->curlang : null // Can be `false` as well...
		);

		$this->model->post->set_language(
			$post_id,
			$post_language->get_language( new User(), (int) $post_id )
		);
	}

	/**
	 * Called when a post ( or page ) is saved, published or updated.
	 *
	 *  
	 *   Does not save the language and translations anymore, unless the post has no language yet.
	 *
	 * @param int     $post_id Post id of the post being saved.
	 * @param WP_Post $post    The post being saved.
	 * @return void
	 */
	public function save_post( $post_id, $post ) {
		if ( is_multisite() && ms_is_switched() && ! $this->model->has_languages() ) {
			return;
		}

		if ( ! $this->model->is_translated_post_type( $post->post_type ) ) {
			return;
		}

			if ( $id = wp_is_post_revision( $post_id ) ) {
				$post_id = $id;
			}

			$lang = $this->model->post->get_language( $post_id );

			// Ensure the post has a language set at least once.
			if ( empty( $lang ) ) {
				$this->set_default_language( $post_id );
			}

			// Avoid creating translation links on auto-draft creation.
			$is_autodraft = isset( $post->post_status ) && 'auto-draft' === $post->post_status;
			if ( $is_autodraft ) {
				// Persist intended linking info to apply on first real save.
				if ( ! empty( $_GET['from_post'] ) && ! empty( $_GET['new_lang'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
					update_post_meta( $post_id, '_lmat_from_post', (int) $_GET['from_post'] ); // phpcs:ignore WordPress.Security.NonceVerification
					update_post_meta( $post_id, '_lmat_new_lang', sanitize_key( $_GET['new_lang'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
				}
				else {
					// Ensure a plain Add New (no query args) doesn't inherit stale intent
					delete_post_meta( $post_id, '_lmat_from_post' );
					delete_post_meta( $post_id, '_lmat_new_lang' );
				}
			} else {
				// Handle from_post parameter or previously stored intent for translation linking
				$this->handle_translation_linking( $post_id );
			}
			
			/**
			 * Fires after the post language and translations are saved.
			 *
			 *  
			 *
			 * @param int     $post_id      Post id.
			 * @param WP_Post $post         Post object.
			 * @param int[]   $translations The list of translations post ids.
			 */
			do_action( 'lmat_save_post', $post_id, $post, $this->model->post->get_translations( $post_id ) );

	}

	/**
	 * Handles translation linking when a post is created with from_post parameter.
	 *
	 *  
	 *
	 * @param int $post_id Post ID of the newly created post.
	 * @return void
	 */
	public function handle_translation_linking( $post_id ) {
		// Prefer explicit query args, otherwise use any stored intent from post meta.
		$from_post_id = 0;
		$new_lang_slug = '';
		if ( ! empty( $_GET['from_post'] ) && ! empty( $_GET['new_lang'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$from_post_id = (int) $_GET['from_post']; // phpcs:ignore WordPress.Security.NonceVerification
			$new_lang_slug = sanitize_key( $_GET['new_lang'] ); // phpcs:ignore WordPress.Security.NonceVerification
		} else {
			$from_post_id = (int) get_post_meta( $post_id, '_lmat_from_post', true );
			$new_lang_slug = sanitize_key( (string) get_post_meta( $post_id, '_lmat_new_lang', true ) );
		}

		if ( empty( $from_post_id ) || empty( $new_lang_slug ) ) {
			return;
		}
		
		// Validate the from_post exists and is translatable
		$from_post = get_post( $from_post_id );
		if ( ! $from_post || ! $this->model->is_translated_post_type( $from_post->post_type ) ) {
			return;
		}
		
		// Validate the new language exists
		$new_lang = $this->model->get_language( $new_lang_slug );
		if ( ! $new_lang ) {
			return;
		}
		
		// Get the original post's language
		$from_lang = $this->model->post->get_language( $from_post_id );
		if ( ! $from_lang ) {
			return;
		}
		
		// Set the language for the new post
		$this->model->post->set_language( $post_id, $new_lang );
		
		// Create the translation link between the posts
		$this->create_translation_link( $from_post_id, $post_id, $from_lang, $new_lang );

		// Clear stored intent to avoid re-linking in future saves.
		delete_post_meta( $post_id, '_lmat_from_post' );
		delete_post_meta( $post_id, '_lmat_new_lang' );
	}

	/**
	 * Creates a translation link between two posts.
	 *
	 *  
	 *
	 * @param int           $from_post_id Original post ID.
	 * @param int           $to_post_id   New translation post ID.
	 * @param LMAT_Language $from_lang    Original post language.
	 * @param LMAT_Language $to_lang      New translation language.
	 * @return void
	 */
	private function create_translation_link( $from_post_id, $to_post_id, $from_lang, $to_lang ) {
		// Get existing translations for the original post
		$existing_translations = $this->model->post->get_translations( $from_post_id );
		
		// Add the original post to translations if not already there
		if ( ! isset( $existing_translations[ $from_lang->slug ] ) ) {
			$existing_translations[ $from_lang->slug ] = $from_post_id;
		}
		
		// Add the new translation
		$existing_translations[ $to_lang->slug ] = $to_post_id;
		
		// Save translations for all posts in the group
		foreach ( $existing_translations as $lang_slug => $post_id ) {
			if ( $post_id ) {
				$this->model->post->save_translations( $post_id, $existing_translations );
			}
		}
	}

	/**
	 * Makes sure that saved terms are in the right language.
	 *
	 *  
	 *
	 * @param int            $object_id Object ID.
	 * @param int[]|string[] $terms     An array of object term IDs or slugs.
	 * @param int[]          $tt_ids    An array of term taxonomy IDs.
	 * @param string         $taxonomy  Taxonomy slug.
	 * @return void
	 */
	public function set_object_terms( $object_id, $terms, $tt_ids, $taxonomy ) {
		static $avoid_recursion;

		if ( $avoid_recursion || empty( $terms ) || ! is_array( $terms ) || empty( $tt_ids )
			|| ! $this->model->is_translated_taxonomy( $taxonomy ) ) {
			return;
		}

		$lang = $this->model->post->get_language( $object_id );

		if ( empty( $lang ) ) {
			return;
		}

		// Use the term_taxonomy_ids to get all the requested terms in 1 query.
		$new_terms = get_terms(
			array(
				'taxonomy'         => $taxonomy,
				'term_taxonomy_id' => array_map( 'intval', $tt_ids ),
				'lang'             => '',
			)
		);

		if ( empty( $new_terms ) || ! is_array( $new_terms ) ) {
			// Terms not found.
			return;
		}

		$new_term_ids_translated = $this->translate_terms( $new_terms, $taxonomy, $lang );

		// Query the object's term.
		$orig_terms = get_terms(
			array(
				'taxonomy'   => $taxonomy,
				'object_ids' => $object_id,
				'lang'       => '',
			)
		);

		if ( is_array( $orig_terms ) ) {
			$orig_term_ids            = wp_list_pluck( $orig_terms, 'term_id' );
			$orig_term_ids_translated = $this->translate_terms( $orig_terms, $taxonomy, $lang );

			// Terms that are not in the translated list.
			$remove_term_ids = array_diff( $orig_term_ids, $orig_term_ids_translated );

			if ( ! empty( $remove_term_ids ) ) {
				wp_remove_object_terms( $object_id, $remove_term_ids, $taxonomy );
			}
		} else {
			$orig_term_ids            = array();
			$orig_term_ids_translated = array();
		}

		// Terms to add.
		$add_term_ids = array_unique( array_merge( $orig_term_ids_translated, $new_term_ids_translated ) );
		$add_term_ids = array_diff( $add_term_ids, $orig_term_ids );

		if ( ! empty( $add_term_ids ) ) {
			$avoid_recursion = true;
			wp_set_object_terms( $object_id, $add_term_ids, $taxonomy, true ); // Append.
			$avoid_recursion = false;
		}
	}

	/**
	 * Make sure that the post parent is in the correct language.
	 *
	 *  
	 *
	 * @param int $post_parent Post parent ID.
	 * @param int $post_id     Post ID.
	 * @return int
	 */
	public function wp_insert_post_parent( $post_parent, $post_id ) {
		$lang = $this->model->post->get_language( $post_id );
		$parent_post_type = $post_parent > 0 ? get_post_type( $post_parent ) : null;
		// Dont break the hierarchy in case the post has no language
		if ( ! empty( $lang ) && ! empty( $parent_post_type ) && $this->model->is_translated_post_type( $parent_post_type ) ) {
			$post_parent = $this->model->post->get_translation( $post_parent, $lang );
		}

		return $post_parent;
	}

	/**
	 * Called when a post, page or media is deleted
	 * Don't delete translations if this is a post revision 
	 *
	 *  
	 *
	 * @param int $post_id Post ID.
	 * @return void
	 */
	public function delete_post( $post_id ) {
		if ( ! wp_is_post_revision( $post_id ) ) {
			$this->model->post->delete_translation( $post_id );
		}
	}

	/**
	 * Prevents WP deleting files when there are still media using them.
	 *
	 *  
	 *
	 * @param string $file Path to the file to delete.
	 * @return string Empty or unmodified path.
	 */
	public function wp_delete_file( $file ) {
		global $wpdb;

		$uploadpath = wp_upload_dir();

		// Get the main attached file.
		$attached_file = substr_replace( $file, '', 0, strlen( trailingslashit( $uploadpath['basedir'] ) ) );
		$attached_file = preg_replace( '#-\d+x\d+\.([a-z]+)$#', '.$1', $attached_file );

		$with_scaled = $attached_file;
		$without_year_month = $attached_file;

		// First, check if attached_file has '-scaled' before the extension, if so, remove it
		if ( ! preg_match( '/-scaled\.[a-zA-Z0-9]+$/', $attached_file ) ) {
			$with_scaled = preg_replace( '/(\.[a-zA-Z0-9]+)$/', '-scaled$1', $attached_file );
		}

		// Then, check if the path starts with a year/month (e.g., 2025/07/)
		if ( preg_match( '/^\d{4}\/\d{2}\//', $without_year_month ) ) {
			$without_year_month = preg_replace( '/^\d{4}\/\d{2}\//', '', $without_year_month );
		}

		// Escape user inputs safely
		$attached_file    = sanitize_text_field( $attached_file );
		$with_scaled      = sanitize_text_field( $with_scaled );
		$without_year_month = sanitize_text_field( $without_year_month );

		// Prepare LIKE patterns safely
		$like_original_text = '%' . $wpdb->esc_like( '"original_image"' ) . '%';
		$like_with_scaled      = '%' . $wpdb->esc_like( '"'.$with_scaled.'"' ) . '%';
		$like_without_year_month  = '%' . $wpdb->esc_like( '"'.$without_year_month.'"' ) . '%';
		$not_like_attached = '%' . $wpdb->esc_like( '"'.$attached_file.'"' ) . '%';

		// Build and prepare the SQL query
		$query = $wpdb->prepare(
			"SELECT post_id 
			FROM {$wpdb->postmeta}
			WHERE 
				(meta_key = '_wp_attached_file' AND meta_value = %s)
				OR 
				(
					meta_key = '_wp_attachment_metadata'
					AND meta_value LIKE %s
					AND meta_value LIKE %s
					AND meta_value LIKE %s
					AND meta_value NOT LIKE %s
				)",
			$attached_file,
			$like_original_text,
			$like_with_scaled,
			$like_without_year_month,
			$not_like_attached
		);

		// Execute and get IDs
		$ids = $wpdb->get_col( $query );

		if ( ! empty( $ids ) ) {
			return ''; // Prevent deleting the file.
		}

		return $file;
	}


	/**
	 * Ensure that tags are in the correct language when a post is updated, due to `tags_input` parameter being removed in `wp_update_post()`.
	 *
	 *  
	 *
	 * @param int     $post_id      Post ID, unused.
	 * @param WP_Post $post_after   Post object following the update.
	 * @param WP_Post $post_before  Post object before the update.
	 * @return void
	 */
	public function force_tags_translation( $post_id, $post_after, $post_before ) {
		if ( ! is_object_in_taxonomy( $post_before->post_type, 'post_tag' ) ) {
			return;
		}

		$terms = get_the_terms( $post_before, 'post_tag' );

		if ( empty( $terms ) || ! is_array( $terms ) ) {
			return;
		}

		$term_ids = wp_list_pluck( $terms, 'term_id' );

		// Let's ensure that `LMAT_CRUD_Posts::set_object_terms()` will do its job.
		wp_set_post_terms( $post_id, $term_ids, 'post_tag' );
	}

	/**
	 * Makes sure that all terms in the given list are in the given language.
	 * If not the case, the terms are translated or created (for a hierarchical taxonomy, terms are created recursively).
	 *
	 *  
	 *
	 * @param WP_Term[]    $terms    List of terms to translate.
	 * @param string       $taxonomy The terms' taxonomy.
	 * @param LMAT_Language $language The language to translate the terms into.
	 * @return int[] List of `term_id`s.
	 *
	 * @phpstan-return array<positive-int>
	 */
	private function translate_terms( array $terms, string $taxonomy, LMAT_Language $language ): array {
		$term_ids_translated = array();

		foreach ( $terms as $term ) {
			$term_ids_translated[] = $this->translate_term( $term, $taxonomy, $language );
		}

		return array_filter( $term_ids_translated );
	}

	/**
	 * Translates the given term into the given language.
	 * If the translation doesn't exist, it is created (for a hierarchical taxonomy, terms are created recursively).
	 *
	 *  
	 *
	 * @param WP_Term      $term     The term to translate.
	 * @param string       $taxonomy The term's taxonomy.
	 * @param LMAT_Language $language The language to translate the term into.
	 * @return int A `term_id` on success, `0` on failure.
	 *
	 * @phpstan-return int<0, max>
	 */
	private function translate_term( WP_Term $term, string $taxonomy, LMAT_Language $language ): int {
		// Check if the term is in the correct language or if a translation exists.
		$tr_term_id = $this->model->term->get( $term->term_id, $language );

		if ( ! empty( $tr_term_id ) ) {
			// Already in the correct language.
			return $tr_term_id;
		}

		// Or choose the correct language for tags (initially defined by name).
		$tr_term_id = $this->model->term_exists( $term->name, $taxonomy, $term->parent, $language );

		if ( ! empty( $tr_term_id ) ) {
			return $tr_term_id;
		}

		// Or create the term in the correct language.
		$tr_parent_term_id = 0;

		if ( $term->parent > 0 && is_taxonomy_hierarchical( $taxonomy ) ) {
			$parent = get_term( $term->parent, $taxonomy );

			if ( $parent instanceof WP_Term ) {
				// Translate the parent recursively.
				$tr_parent_term_id = $this->translate_term( $parent, $taxonomy, $language );
			}
		}

		$lang_callback   = function ( $lang, $tax, $slug ) use ( $language, $term, $taxonomy ) {
			if ( ! $lang instanceof LMAT_Language && $tax === $taxonomy && $slug === $term->slug ) {
				return $language;
			}
			return $lang;
		};
		$parent_callback = function ( $parent_id, $tax, $slug ) use ( $tr_parent_term_id, $term, $taxonomy ) {
			if ( empty( $parent_id ) && $tax === $taxonomy && $slug === $term->slug ) {
				return $tr_parent_term_id;
			}
			return $parent_id;
		};
		add_filter( 'lmat_inserted_term_language', $lang_callback, 10, 3 );
		add_filter( 'lmat_inserted_term_parent', $parent_callback, 10, 3 );
		$new_term_info = wp_insert_term(
			$term->name,
			$taxonomy,
			array(
				'parent' => $tr_parent_term_id,
				'slug'   => $term->slug, // Useless but prevents the use of `sanitize_title()` and for consistency with `$lang_callback`.
			)
		);
		remove_filter( 'lmat_inserted_term_language', $lang_callback );
		remove_filter( 'lmat_inserted_term_parent', $parent_callback );

		if ( is_wp_error( $new_term_info ) ) {
			// Term creation failed.
			return 0;
		}

		$tr_term_id = max( 0, (int) $new_term_info['term_id'] );

		if ( empty( $tr_term_id ) ) {
			return 0;
		}

		$this->model->term->set_language( $tr_term_id, $language );

		$trs = $this->model->term->get_translations( $term->term_id );

		$trs[ $language->slug ] = $tr_term_id;

		$this->model->term->save_translations( $term->term_id, $trs );

		return $tr_term_id;
	}
}
