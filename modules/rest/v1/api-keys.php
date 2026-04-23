<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\REST\V1;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Linguator\Includes\Other\Linguator_Model;
use Linguator\Includes\Options\Business\Api_Keys as Api_Keys_Option;
use Linguator\Modules\REST\Abstract_Controller;
use WP_Error;
use WP_REST_Request;
use WP_REST_Server;

/**
 * API Keys REST controller.
 *
 * Stores provider keys in dedicated WP options:
 * - connectors_ai_gemini_key
 *
 * Stores selected models in Linguator option `api_keys` via Options registry.
 */
class Api_Keys extends Abstract_Controller {
	/**
	 * @var Linguator_Model
	 */
	protected $model;

	protected $namespace;
	protected $rest_base;

	public function __construct( Linguator_Model $model ) {
		$this->namespace = 'lmat/v1';
		$this->rest_base = 'api-keys';
		$this->model     = $model;
	}

	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}",
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(
						'keys' => array(
							'required' => false,
							'type'     => 'object',
							'properties' => array(
								'gemini'     => array( 'type' => 'string' ),
							),
						),
						'models' => array(
							'required' => false,
							'type'     => 'object',
							'properties' => array(
								'gemini_model'    => array( 'type' => 'string' ),
							),
						),
					),
				),
			)
		);
	}

	/**
	 * @param WP_REST_Request $request REST request.
	 * @return true|WP_Error
	 */
	public function get_item_permissions_check( $request ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return new WP_Error(
				'rest_forbidden_context',
				__( 'Sorry, you are not allowed to view options.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * @param WP_REST_Request $request REST request.
	 * @return true|WP_Error
	 */
	public function update_item_permissions_check( $request ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return new WP_Error(
				'rest_forbidden_context',
				__( 'Sorry, you are not allowed to edit options.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		$nonce_check = $this->verify_nonce( $request );
		if ( is_wp_error( $nonce_check ) ) {
			return $nonce_check;
		}

		return true;
	}

	private function option_name_for_provider( string $provider ): string {
		return 'connectors_ai_' . strtolower( $provider ) . '_key';
	}

	private function mask_key( string $raw ): string {
		if ( '' === $raw ) {
			return '';
		}
		$tail = substr( $raw, -4 );
		return '••••••••' . $tail;
	}

	/**
	 * Sanitize provider exceptions for safe UI display.
	 *
	 * @param string $message Raw exception message.
	 * @param string $api_key Raw API key (to redact if present).
	 * @return string
	 */
	private function sanitize_provider_error_message( string $message, string $api_key ): string {
		$msg = trim( (string) $message );
		if ( '' === $msg ) {
			return __( 'Provider returned an unknown error.', 'linguator-multilingual-ai-translation' );
		}

		$key_trimmed = trim( (string) $api_key );
		if ( '' !== $key_trimmed ) {
			$msg = str_replace( $key_trimmed, '[redacted]', $msg );
		}

		// Keep responses reasonably small for REST/UI.
		if ( strlen( $msg ) > 500 ) {
			$msg = substr( $msg, 0, 500 ) . '…';
		}

		return $msg;
	}

	/**
	 * Validate provider API key before saving.
	 *
	 * @param string $provider Provider slug used by this endpoint (gemini).
	 * @param string $api_key  Raw API key.
	 * @return true|WP_Error
	 */
	private function validate_provider_api_key( string $provider, string $api_key ) {
		$provider    = strtolower( trim( $provider ) );
		$key_trimmed = trim( $api_key );

		if ( '' === $provider || '' === $key_trimmed ) {
			return new WP_Error(
				'lmat_api_key_invalid',
				__( 'Provider and API key are required.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		// Basic format validation - reject obviously invalid keys before provider validation.
		if ( strlen( $key_trimmed ) < 10 ) {
			return new WP_Error(
				'lmat_api_key_invalid',
				__( 'API key appears to be invalid or too short.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		// Reject keys with HTML/script characters or obvious junk.
		if ( preg_match( '/[<>"\']/', $key_trimmed ) ) {
			return new WP_Error(
				'lmat_api_key_invalid',
				__( 'Invalid API key format. Please check your credentials.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		// Provider-specific format hints.
		if ( 'gemini' === $provider && ! preg_match( '/^AIza[0-9A-Za-z\-_]{20,}$/', $key_trimmed ) ) {
			return new WP_Error(
				'lmat_api_key_invalid',
				__( 'Gemini API keys must start with AIza and be in the correct format.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		// Map UI provider slug to WP AI Client provider id.
		$provider_id    = $provider;
		$provider_label = $provider;
		if ( 'gemini' === $provider ) {
			$provider_id    = 'google';
			$provider_label = 'Gemini';
		}

		if ( ! class_exists( '\WordPress\AiClient\AiClient' ) ) {
			return new WP_Error(
				'lmat_ai_client_missing',
				__( 'AI client is not available.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		$registry = \WordPress\AiClient\AiClient::defaultRegistry();
		if ( ! $registry || ! method_exists( $registry, 'hasProvider' ) || ! $registry->hasProvider( $provider_id ) ) {
			return new WP_Error(
				'lmat_ai_provider_invalid',
				__( 'Invalid AI provider.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		$is_gemini = ( 'google' === $provider_id ) || ( false !== strpos( $provider_id, 'gemini' ) );
		$cooldown  = $is_gemini ? 60 : 5;
		$lock_key  = 'lmat_ai_test_lock_' . md5( $provider_id . '|' . $key_trimmed );

		if ( get_transient( $lock_key ) ) {
			return new WP_Error(
				'lmat_ai_provider_rate_limited',
				$is_gemini
					? __( 'Gemini rate limit reached. Please wait a minute and try again.', 'linguator-multilingual-ai-translation' )
					: __( 'Please wait a few seconds before testing again.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 429 )
			);
		}

		// Inject the test API key into the registry (same as the REST controller does).
		$auth_class = '\WordPress\AiClient\Providers\Http\DTO\ApiKeyRequestAuthentication';
		if ( ! class_exists( $auth_class ) ) {
			return new WP_Error(
				'lmat_ai_client_missing',
				__( 'AI client is not available.', 'linguator-multilingual-ai-translation' ),
				array( 'status' => 400 )
			);
		}

		$registry->setProviderRequestAuthentication( $provider_id, new $auth_class( $key_trimmed ) );
		set_transient( $lock_key, 1, $cooldown );

		try {
			$provider_classname = $registry->getProviderClassName( $provider_id );
			if ( ! $provider_classname || ! class_exists( $provider_classname ) ) {
				return new WP_Error(
					'lmat_ai_provider_invalid',
					__( 'Invalid AI provider.', 'linguator-multilingual-ai-translation' ),
					array( 'status' => 400 )
				);
			}

			if ( method_exists( $provider_classname, 'availability' ) ) {
				$provider_availability = $provider_classname::availability();
				if ( is_object( $provider_availability ) && method_exists( $provider_availability, 'isConfigured' ) && ! $provider_availability->isConfigured() ) {
					return new WP_Error(
						'lmat_api_key_invalid',
						sprintf(
							/* translators: %s: AI provider name (e.g. Gemini). */
							__( 'API key is not configured for %s.', 'linguator-multilingual-ai-translation' ),
							$provider_label
						),
						array( 'status' => 400 )
					);
				}
			}

			if ( method_exists( $provider_classname, 'modelMetadataDirectory' ) ) {
				$model_metadata_directory = $provider_classname::modelMetadataDirectory();
				if ( is_object( $model_metadata_directory ) && method_exists( $model_metadata_directory, 'listModelMetadata' ) ) {
					$model_metadata_directory->listModelMetadata(); // throws on invalid key.
				}
			}
		} catch ( \Exception $e ) {
			$msg = strtolower( (string) $e->getMessage() );
			if ( false !== strpos( $msg, '429' ) ) {
				return new WP_Error(
					'lmat_ai_provider_rate_limited',
					$is_gemini
						? __( 'Gemini free tier rate limit exceeded. Please wait and try again.', 'linguator-multilingual-ai-translation' )
						: __( 'Rate limit exceeded. Please try again later.', 'linguator-multilingual-ai-translation' ),
					array( 'status' => 429 )
				);
			}

			return new WP_Error(
				'lmat_api_key_invalid',
				$this->sanitize_provider_error_message( (string) $e->getMessage(), $key_trimmed ),
				array( 'status' => 400 )
			);
		}

		return true;
	}

	/**
	 * @param WP_REST_Request $request REST request.
	 * @return \WP_REST_Response
	 */
	public function get_item( $request ) {
		$providers = array( 'gemini' );
		$keys      = array();

		foreach ( $providers as $provider ) {
			$raw              = (string) get_option( $this->option_name_for_provider( $provider ), '' );
			$keys[ $provider ] = $this->mask_key( $raw );
		}

		$models = $this->model->options->get( 'api_keys' );
		if ( ! is_array( $models ) ) {
			$models = array();
		}

		$available_models = Api_Keys_Option::discover_provider_models();

		return rest_ensure_response(
			array(
				'keys'             => $keys,
				'models'           => $models,
				'available_models' => $available_models,
			)
		);
	}

	/**
	 * @param WP_REST_Request $request REST request.
	 * @return \WP_REST_Response|WP_Error
	 */
	public function update_item( $request ) {
		$params = $request->get_json_params();
		if ( ! is_array( $params ) ) {
			$params = array();
		}

		$providers = array( 'gemini' );

		// Save keys to dedicated WP options.
		$incoming_keys = isset( $params['keys'] ) && is_array( $params['keys'] ) ? $params['keys'] : array();
		foreach ( $providers as $provider ) {
			if ( ! array_key_exists( $provider, $incoming_keys ) ) {
				continue;
			}
			$v = $incoming_keys[ $provider ];
			$v = is_string( $v ) ? trim( $v ) : '';

			$option_name  = $this->option_name_for_provider( $provider );
			$current_raw  = (string) get_option( $option_name, '' );
			$current_trim = trim( $current_raw );

			// Skip provider validation unless the key actually changed.
			$is_unchanged = ( '' !== $v && '' !== $current_trim && hash_equals( $current_trim, $v ) );
			$did_change   = ( $v !== $current_trim );
			unset( $did_change );

			// Validate only when setting a non-empty key AND it differs from the stored one.
			// Empty string is allowed for reset.
			if ( '' !== $v && ! $is_unchanged ) {
				$validation = $this->validate_provider_api_key( $provider, $v );
				if ( is_wp_error( $validation ) ) {
					return $validation;
				}
			}

			update_option( $option_name, $v );
		}

		// Save models into Linguator option `api_keys`.
		$incoming_models = isset( $params['models'] ) && is_array( $params['models'] ) ? $params['models'] : array();
		if ( ! empty( $incoming_models ) ) {
			$this->model->options->set( 'api_keys', $incoming_models );
		}

		return $this->get_item( $request );
	}
}

