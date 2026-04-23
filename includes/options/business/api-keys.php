<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Options\Business;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Linguator\Includes\Options\Abstract_Option;
use Linguator\Includes\Options\Options;

/**
 * Stores API keys for supported AI providers.
 */
class Api_Keys extends Abstract_Option {
	/**
	 * Returns option key.
	 *
	 * @return string
	 */
	public static function key(): string {
		return 'api_keys';
	}

	/**
	 * Stores provider models only. Provider keys are stored in dedicated WP options:
	 * connectors_ai_{provider}_key.
	 *
	 * @return array{gemini_model:string}
	 */
	protected function get_default() {
		return array(
			'gemini_model' => 'gemini-2.5-flash',
		);
	}

	/**
	 * Returns JSON schema structure for this option.
	 *
	 * @return array
	 */
	protected function get_data_structure(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'gemini_model' => array( 'type' => 'string' ),
			),
		);
	}

	/**
	 * Sanitizes stored Gemini model id.
	 *
	 * @param mixed   $value   Incoming value.
	 * @param Options $options Options registry instance.
	 * @return array
	 */
	protected function sanitize( $value, Options $options ) {
		$current = $options->get( self::key() );
		if ( ! is_array( $current ) ) {
			$current = array();
		}

		$default = $this->get_default();
		$gemini  = isset( $current['gemini_model'] ) && is_scalar( $current['gemini_model'] )
			? sanitize_text_field( (string) $current['gemini_model'] )
			: $default['gemini_model'];

		if ( is_array( $value ) && array_key_exists( 'gemini_model', $value ) ) {
			$v = $value['gemini_model'];
			if ( null === $v ) {
				$gemini = '';
			} elseif ( is_scalar( $v ) ) {
				$gemini = sanitize_text_field( (string) $v );
			} else {
				$gemini = '';
			}
		}

		return array(
			'gemini_model' => $gemini,
		);
	}

	/**
	 * Discover available text-generation models for supported providers via WP AI Client.
	 *
	 * Notes:
	 * - This mirrors the model discovery approach used in the TranslatePress AI settings UI.
	 * - Provider API keys are stored in WP options (connectors_ai_{provider}_key). When WP AI
	 *   Client is available, it typically reads those connector settings to configure providers.
	 *
	 * @return array{gemini:list<string>}
	 */
	public static function discover_provider_models(): array {
		$result = array(
			'gemini' => array(),
		);

		// Only attempt discovery when WP AI Client is present.
		if (
			! class_exists( '\WordPress\AiClient\AiClient' ) ||
			! class_exists( '\WordPress\AiClient\Providers\Models\DTO\ModelRequirements' ) ||
			! class_exists( '\WordPress\AiClient\Providers\Models\Enums\CapabilityEnum' )
		) {
			return $result;
		}

		// Only attempt discovery when a provider key exists.
		$get_provider_key = static function ( string $provider ): string {
			$opt = 'connectors_ai_' . strtolower( $provider ) . '_key';
			return trim( (string) get_option( $opt, '' ) );
		};

		try {
			$registry = \WordPress\AiClient\AiClient::defaultRegistry();
			if ( ! $registry || ! method_exists( $registry, 'findProviderModelsMetadataForSupport' ) ) {
				return $result;
			}

			// Ensure the registry is authenticated using our stored connector options.
			// Without this, model listing can work right after "test" calls but fail after page reload.
			$auth_class = '\WordPress\AiClient\Providers\Http\DTO\ApiKeyRequestAuthentication';
			if ( class_exists( $auth_class ) && method_exists( $registry, 'setProviderRequestAuthentication' ) ) {
				$gemini_key = $get_provider_key( 'gemini' );

				if ( '' !== $gemini_key ) {
					// WP AI Client provider id is "google" for Gemini.
					$registry->setProviderRequestAuthentication( 'google', new $auth_class( $gemini_key ) );
				}
			}

			$requirements = new \WordPress\AiClient\Providers\Models\DTO\ModelRequirements(
				array( \WordPress\AiClient\Providers\Models\Enums\CapabilityEnum::textGeneration() ),
				array()
			);

			$excluded_patterns = array(
				'audio',
				'transcribe',
				'search',
				'vision',
				'embedding',
				'image',
				'code',
				'whisper',
				'tts',
			);

			$load_models = static function ( string $provider_id ) use ( $registry, $requirements, $excluded_patterns ): array {
				try {
					$models_metadata = $registry->findProviderModelsMetadataForSupport( $provider_id, $requirements );
					$ids             = array();

					if ( is_array( $models_metadata ) ) {
						foreach ( $models_metadata as $model ) {
							if ( is_object( $model ) && method_exists( $model, 'getId' ) ) {
								$ids[] = (string) $model->getId();
							}
						}
					}

					if ( empty( $ids ) ) {
						return array();
					}

					$filtered = array();
					foreach ( $ids as $id ) {
						$lower = strtolower( $id );
						$skip  = false;
						foreach ( $excluded_patterns as $pattern ) {
							if ( false !== strpos( $lower, $pattern ) ) {
								$skip = true;
								break;
							}
						}
						if ( ! $skip ) {
							$filtered[] = $id;
						}
					}

					return array_values( array_unique( $filtered ) );
				} catch ( \Throwable $e ) {
					return array();
				}
			};

			if ( '' !== $get_provider_key( 'gemini' ) ) {
				$result['gemini'] = $load_models( 'google' );
			}
		} catch ( \Throwable $e ) {
			return $result;
		}

		return $result;
	}

	/**
	 * Returns option description.
	 *
	 * @return string
	 */
	protected function get_description(): string {
		return __( 'API keys for AI translation providers.', 'linguator-multilingual-ai-translation' );
	}
}
