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
	 * @return array{openai_model:string, gemini_model:string, anthropic_model:string}
	 */
	protected function get_default() {
		return array(
			'openai_model'    => 'gpt-4o-mini',
			'gemini_model'    => 'gemini-2.0-flash',
			'anthropic_model' => 'claude-3-5-sonnet-latest',
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
				'openai_model'    => array( 'type' => 'string' ),
				'gemini_model'    => array( 'type' => 'string' ),
				'anthropic_model' => array( 'type' => 'string' ),
			),
		);
	}

	/**
	 * Sanitizes models while preserving existing values for unknown keys.
	 *
	 * @param mixed   $value   Incoming value.
	 * @param Options $options Options registry instance.
	 * @return array
	 */
	protected function sanitize( $value, Options $options ) {
		$current = $options->get( self::key() );
		if ( ! is_array( $current ) ) {
			$current = $this->get_default();
		}

		if ( ! is_array( $value ) ) {
			return $current;
		}

		$filtered = $current;

		foreach ( array( 'openai_model', 'gemini_model', 'anthropic_model' ) as $k ) {
			if ( array_key_exists( $k, $value ) ) {
				$v = $value[ $k ];
				if ( null === $v ) {
					$filtered[ $k ] = '';
					continue;
				}

				if ( is_scalar( $v ) ) {
					$filtered[ $k ] = sanitize_text_field( (string) $v );
				} else {
					$filtered[ $k ] = '';
				}
			}
		}

		return $filtered;
	}

	/**
	 * Discover available text-generation models for supported providers via WP AI Client.
	 *
	 * Notes:
	 * - This mirrors the model discovery approach used in the TranslatePress AI settings UI.
	 * - Provider API keys are stored in WP options (connectors_ai_{provider}_key). When WP AI
	 *   Client is available, it typically reads those connector settings to configure providers.
	 *
	 * @return array{openai:list<string>,gemini:list<string>,anthropic:list<string>}
	 */
	public static function discover_provider_models(): array {
		$result = array(
			'openai'     => array(),
			'gemini'     => array(),
			'anthropic'  => array(),
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
				$openai_key    = $get_provider_key( 'openai' );
				$gemini_key    = $get_provider_key( 'gemini' );
				$anthropic_key = $get_provider_key( 'anthropic' );

				if ( '' !== $openai_key ) {
					$registry->setProviderRequestAuthentication( 'openai', new $auth_class( $openai_key ) );
				}
				if ( '' !== $gemini_key ) {
					// WP AI Client provider id is "google" for Gemini.
					$registry->setProviderRequestAuthentication( 'google', new $auth_class( $gemini_key ) );
				}
				if ( '' !== $anthropic_key ) {
					$registry->setProviderRequestAuthentication( 'anthropic', new $auth_class( $anthropic_key ) );
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

			// WP AI Client provider ids: openai, google, anthropic.
			if ( '' !== $get_provider_key( 'openai' ) ) {
				$result['openai'] = $load_models( 'openai' );
			}
			if ( '' !== $get_provider_key( 'gemini' ) ) {
				$result['gemini'] = $load_models( 'google' );
			}
			if ( '' !== $get_provider_key( 'anthropic' ) ) {
				$result['anthropic'] = $load_models( 'anthropic' );
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

