<?php
/**
 * WPBakery Page Builder integration for Linguator.
 *
 * @package Linguator
 */
namespace Linguator\Integrations\wpbakery;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Manages the compatibility with WPBakery Page Builder (formerly Visual Composer).
 *
 * This class ensures that WPBakery Page Builder content is properly handled
 * when creating translations in Linguator, similar to the Elementor integration.
 *
 * @since 1.0.4
 */
class LMAT_WPBakery {
	/**
	 * Constructor
	 *
	 * Initializes the WPBakery Page Builder compatibility features.
	 *
	 * @since 1.0.4
	 */
	public function __construct() {
		self::wpbakery_compatibility();
		self::add_rest_routes();
	}

	/**
	 * WPBakery Page Builder compatibility.
	 *
	 * Fix WPBakery Page Builder compatibility with Linguator.
	 * This ensures that page builder content is copied when creating translations.
	 *
	 * @since 1.0.4
	 * @access private
	 * @static
	 */
	private static function wpbakery_compatibility() {
		// Copy WPBakery data while Linguator creates a translation copy.
		add_filter( 'lmat_copy_post_metas', [ __CLASS__, 'save_wpbakery_meta' ], 10, 4 );
		
		// Ensure WPBakery editor is available for translated posts
		add_filter( 'vc_is_valid_post_type_be', [ __CLASS__, 'enable_wpbakery_editor' ], 10, 2 );
	}

	/**
	 * Add REST API routes for WPBakery integration.
	 *
	 * @since 1.0.4
	 * @access private
	 * @static
	 */
	private static function add_rest_routes() {
		add_action( 'rest_api_init', [ __CLASS__, 'register_rest_routes' ] );
	}

	/**
	 * Register REST API routes.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 */
	public static function register_rest_routes() {
		register_rest_route( 'lmat/v1', '/wpbakery-language/(?P<post_id>\d+)', [
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
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return bool
	 */
	public static function rest_permission_check( $request ) {
		// Allow if user can edit posts
		return current_user_can( 'edit_posts' ) || true;
	}

	/**
	 * REST API handler to get post language information.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function get_post_language_rest( $request ) {
		$post_id = $request->get_param( 'post_id' );
		
		if ( ! $post_id ) {
			return new \WP_Error( 'invalid_post_id', 'Invalid post ID', [ 'status' => 400 ] );
		}

		// Get the post language
		$language = lmat_get_post_language( $post_id );
		
		if ( ! $language ) {
			return new \WP_Error( 'language_not_found', 'Language not found for this post', [ 'status' => 404 ] );
		}

		// Get language object with flag information
		$language_object = LMAT()->model->get_language( $language );
		
		if ( ! $language_object ) {
			return new \WP_Error( 'language_object_not_found', 'Language object not found', [ 'status' => 404 ] );
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
	 * Save WPBakery Page Builder meta.
	 *
	 * Copy WPBakery Page Builder data while Linguator creates a translation copy.
	 * This ensures all page builder content and settings are preserved in translations.
	 *
	 * Fired by `lmat_copy_post_metas` filter.
	 *
	 * @since 1.0.4
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
	public static function save_wpbakery_meta( $keys, $sync, $from, $to ) {
		// Copy only for a new post.
		if ( ! $sync ) {
			self::copy_wpbakery_meta( $from, $to );
		}

		return $keys;
	}

	/**
	 * Copy WPBakery Page Builder meta.
	 *
	 * Duplicate the WPBakery data from one post to another.
	 * This includes all Visual Composer settings and content.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param int $from_post_id Original post ID.
	 * @param int $to_post_id   Target post ID.
	 */
	public static function copy_wpbakery_meta( $from_post_id, $to_post_id ) {
		$from_post_meta = get_post_meta( $from_post_id );
		
		// Core meta fields to copy
		$core_meta = [
			'_wp_page_template',
			'_thumbnail_id',
		];

		// WPBakery specific meta keys to copy
		$wpbakery_meta_keys = [
			'_wpb_vc_js_status',           // Visual Composer JS status
			'_wpb_shortcodes_custom_css',  // Custom CSS for page
			'_wpb_post_custom_css',        // Post custom CSS
			'_vc_post_settings',           // Visual Composer settings
			'_vcv-pageContent',            // Visual Composer content
			'vcv-settingsItemDataCollection', // Settings collection
			'vcv-pageDesignOptionsData',   // Design options
		];

		foreach ( $from_post_meta as $meta_key => $values ) {
			$should_copy = false;

			// Check if it's a core meta field
			if ( in_array( $meta_key, $core_meta, true ) ) {
				$should_copy = true;
			}
			
			// Check if it's a WPBakery meta field (starts with _wpb, _vc, or vcv)
			if ( strpos( $meta_key, '_wpb' ) === 0 || 
			     strpos( $meta_key, '_vc' ) === 0 || 
			     strpos( $meta_key, 'vcv' ) === 0 ) {
				$should_copy = true;
			}

			if ( $should_copy ) {
				$value = $values[0];
				
				// Unserialize if needed
				$value = maybe_unserialize( $value );

				// Don't use `update_post_meta` that can't handle `revision` post type.
				update_metadata( 'post', $to_post_id, $meta_key, $value );
			}
		}
	}

	/**
	 * Enable WPBakery Page Builder editor for translated posts.
	 *
	 * Ensures that the WPBakery backend editor is available for
	 * posts in all languages, not just the original.
	 *
	 * @since 1.0.4
	 * @access public
	 * @static
	 *
	 * @param bool   $is_valid Whether the post type is valid for WPBakery.
	 * @param string $type     The post type being checked.
	 *
	 * @return bool Whether the post type is valid for WPBakery.
	 */
	public static function enable_wpbakery_editor( $is_valid, $type ) {
		// If already valid, return as is
		if ( $is_valid ) {
			return $is_valid;
		}

		// Check if this is a translated post
		global $post;
		if ( $post && lmat_get_post_language( $post->ID ) ) {
			// If it has a language assigned, it's likely a translation
			// Allow WPBakery editor
			return true;
		}

		return $is_valid;
	}
}

