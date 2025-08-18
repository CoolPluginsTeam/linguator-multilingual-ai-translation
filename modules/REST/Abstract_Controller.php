<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\REST;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use WP_Error;
use WP_REST_Controller;
use WP_REST_Request;



/**
 * Abstract REST controller.
 *
 * @since 1.0.0
 */
abstract class Abstract_Controller extends WP_REST_Controller {
	/**
	 * Adds a status code to the given error and returns the error.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Error $error       A `WP_Error` object.
	 * @param int      $status_code Optional. A status code. Default is 400.
	 * @return WP_Error
	 */
	protected function add_status_to_error( WP_Error $error, int $status_code = 400 ): WP_Error {
		$error->add_data( array( 'status' => $status_code ) );
		return $error;
	}

	/**
	 * Verifies nonce for REST API requests.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if nonce is valid, WP_Error object otherwise.
	 */
	protected function verify_nonce( WP_REST_Request $request ) {
		// Skip nonce verification for GET requests (read operations)
		if ( $request->get_method() === 'GET' ) {
			return true;
		}

		// Get nonce from request headers or parameters
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! $nonce ) {
			$nonce = $request->get_param( '_wpnonce' );
		}

		// Sanitize the nonce input before verification
		if ( $nonce ) {
			$nonce = sanitize_text_field( wp_unslash( $nonce ) );
		}

		// Verify the nonce
		if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_Error(
				'rest_invalid_nonce',
				__( 'Security check failed. Please refresh the page and try again.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 403 )
			);
		}

		return true;
	}
}
