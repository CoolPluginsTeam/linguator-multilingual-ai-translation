<?php
/**
 * @package Linguator
 */
namespace Linguator\Integrations\elementor;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Frontend\Controllers\LMAT_Frontend;
use Linguator\Includes\Other\LMAT_Model;


/**
 * Manages the compatibility with Elementor
 *
 *  
 */
class LMAT_Elementor {
	/**
	 * Constructor
	 *
	 *  
	 */
	public function __construct() {
		self::elementor_compatibility();
		self::add_rest_routes();
	}

    /**
	 * Elementor compatibility.
	 *
	 * Fix Elementor compatibility with Linguator.
	 *
	 *  
	 * @access private
	 * @static
	 */
	private static function elementor_compatibility() {
		// Copy elementor data while linguator creates a translation copy.
		add_filter( 'lmat_copy_post_metas', [ __CLASS__, 'save_elementor_meta' ], 10, 4 );
	}

	/**
	 * Add REST API routes for Elementor integration.
	 *
	 * @access private
	 * @static
	 */
	private static function add_rest_routes() {
		add_action( 'rest_api_init', [ __CLASS__, 'register_rest_routes' ] );
	}

	/**
	 * Register REST API routes.
	 *
	 * @access public
	 * @static
	 */
	public static function register_rest_routes() {
		register_rest_route( 'lmat/v1', '/post-language/(?P<post_id>\d+)', [
			'methods' => 'GET',
			'callback' => [ __CLASS__, 'get_post_language_rest' ],
			'permission_callback' => [ __CLASS__, 'rest_permission_check' ],
			'args' => [
				'post_id' => [
					'required' => true,
					'type' => 'integer',
					'sanitize_callback' => 'absint',
				],
			],
		] );
	}

	/**
	 * Permission callback for REST API.
	 *
	 * @access public
	 * @static
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return bool
	 */
	public static function rest_permission_check( $request ) {
		// Allow if user can edit posts or if it's a public request
		return current_user_can( 'edit_posts' ) || true;
	}

	/**
	 * REST API handler to get post language information.
	 *
	 * @access public
	 * @static
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function get_post_language_rest( $request ) {
		$post_id = $request->get_param( 'post_id' );
		
		if ( ! $post_id ) {
			return new WP_Error( 'invalid_post_id', 'Invalid post ID', [ 'status' => 400 ] );
		}

		// Get the post language
		$language = lmat_get_post_language( $post_id );
		
		if ( ! $language ) {
			return new WP_Error( 'language_not_found', 'Language not found for this post', [ 'status' => 404 ] );
		}

		// Get language object with flag information
		$language_object = LMAT()->model->get_language( $language );
		
		if ( ! $language_object ) {
			return new WP_Error( 'language_object_not_found', 'Language object not found', [ 'status' => 404 ] );
		}

		// Return language information
		return rest_ensure_response( [
			'language' => $language,
			'flag_url' => $language_object->flag_url,
			'name' => $language_object->name,
			'locale' => $language_object->locale,
			'post_id' => $post_id
		] );
	}

    /**
	 * Save elementor meta.
	 *
	 * Copy elementor data while Linguator creates a translation copy.
	 *
	 * Fired by `lmat_copy_post_metas` filter.
	 *
	 *  
	 * @access public
	 * @static
	 *
	 * @param array $keys List of custom fields names.
	 * @param bool  $sync True if it is synchronization, false if it is a copy.
	 * @param int   $from ID of the post from which we copy information.
	 * @param int   $to   ID of the post to which we paste information.
	 *
	 * @return array List of custom fields names.
	 */
	public static function save_elementor_meta( $keys, $sync, $from, $to ) {
		// Copy only for a new post.
		if ( ! $sync ) {
			self::copy_elementor_meta( $from, $to );
		}

		return $keys;
	}

    /**
	 * Copy Elementor meta.
	 *
	 * Duplicate the data from one post to another.
	 *
	 * Consider using `safe_copy_elementor_meta()` method instead.
	 *
	 *  
	 * @access public
	 *
	 * @param int $from_post_id Original post ID.
	 * @param int $to_post_id   Target post ID.
	 */
	public static function copy_elementor_meta( $from_post_id, $to_post_id ) {
		$from_post_meta = get_post_meta( $from_post_id );
		$core_meta = [
			'_wp_page_template',
			'_thumbnail_id',
		];

		foreach ( $from_post_meta as $meta_key => $values ) {
			// Copy only meta with the `_elementor` prefix.
			if ( 0 === strpos( $meta_key, '_elementor' ) || in_array( $meta_key, $core_meta, true ) ) {
				$value = $values[0];

				// The elementor JSON needs slashes before saving.
				if ( '_elementor_data' === $meta_key ) {
					$value = wp_slash( $value );
				} else {
					$value = maybe_unserialize( $value );
				}

				// Don't use `update_post_meta` that can't handle `revision` post type.
				update_metadata( 'post', $to_post_id, $meta_key, $value );
			}
		}
	}
} 