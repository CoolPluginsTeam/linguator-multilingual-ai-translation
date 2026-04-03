<?php
/**
 * @package Linguator
 */
namespace Linguator\Integrations\elementor;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Frontend\Controllers\Linguator_Frontend;
use Linguator\Includes\Capabilities\Capabilities;
use Linguator\Includes\Other\Linguator_Model;
use WP_Error;
use WP_REST_Request;


/**
 * Manages the compatibility with Elementor
 *
 *  
 */
class Linguator_Elementor {
	/**
	 * Constructor
	 *
	 *  
	 */
	public function __construct() {
		self::linguator_elementor_compatibility();
		self::linguator_add_rest_routes();
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
	private static function linguator_elementor_compatibility() {
		// Copy elementor data while linguator creates a translation copy.
		add_filter( 'lmat_copy_post_metas', [ __CLASS__, 'linguator_save_elementor_meta' ], 10, 4 );
	}

	/**
	 * Add REST API routes for Elementor integration.
	 *
	 * @access private
	 * @static
	 */
	private static function linguator_add_rest_routes() {
		add_action( 'rest_api_init', [ __CLASS__, 'linguator_register_rest_routes' ] );
	}

	/**
	 * Register REST API routes.
	 *
	 * @access public
	 * @static
	 */
	public static function linguator_register_rest_routes() {
		register_rest_route( 'lmat/v1', '/post-language/(?P<post_id>\d+)', [
			'methods'             => 'GET',
			'callback'            => [ __CLASS__, 'linguator_get_post_language_rest' ],
			'permission_callback' => [ __CLASS__, 'linguator_check_rest_permission' ],
			'args'                => [
				'post_id' => [
					'required'          => true,
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
					'validate_callback' => [ __CLASS__, 'linguator_validate_post_id_param' ],
				],
			],
		] );
	}

	/**
	 * Proper Permission Check
	 */
	public static function linguator_check_rest_permission( $request ) {
		if ( ! is_user_logged_in() || ! current_user_can( Capabilities::TRANSLATIONS ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to access this resource.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		$post_id = absint( $request->get_param( 'post_id' ) );
		if ( $post_id <= 0 ) {
			return new WP_Error(
				'invalid_post_id',
				__( 'Invalid post ID.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		if ( ! current_user_can( 'edit_post', $post_id ) && ! current_user_can( 'read_post', $post_id ) ) {
			return new WP_Error(
				'rest_forbidden_post',
				__( 'Sorry, you are not allowed to access this post.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * Validates the REST route `post_id` param.
	 *
	 * @param mixed $value
	 * @return bool
	 */
	public static function linguator_validate_post_id_param( $value ): bool {
		return is_numeric( $value ) && absint( $value ) > 0;
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
	public static function linguator_get_post_language_rest( $request ) {
		$post_id = $request->get_param( 'post_id' );
		
		if ( ! $post_id ) {
			return new WP_Error( 'invalid_post_id', 'Invalid post ID', [ 'status' => 400 ] );
		}

		// Get the post language
		$language = linguator_get_post_language( $post_id );
		
		if ( ! $language ) {
			return new WP_Error( 'language_not_found', 'Language not found for this post', [ 'status' => 404 ] );
		}

		// Get language object with flag information
		$language_object = LMAT()->model->get_language( $language );
		
		if ( ! $language_object ) {
			return new WP_Error( 'language_object_not_found', 'Language object not found', [ 'status' => 404 ] );
		}

		// Return language information (all fields sanitized for safe JSON output).
		return new \WP_REST_Response(
			[
				'language' => sanitize_text_field( (string) $language ),
				'flag_url' => esc_url_raw( (string) $language_object->flag_url ),
				'name'     => sanitize_text_field( (string) $language_object->name ),
				'locale'   => sanitize_text_field( (string) $language_object->locale ),
				'post_id'  => absint( $post_id ),
			],
			200
		);
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
	public static function linguator_save_elementor_meta( $keys, $sync, $from, $to ) {
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

