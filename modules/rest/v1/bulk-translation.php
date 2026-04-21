<?php

namespace Linguator\Modules\REST\V1;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Linguator\Includes\Capabilities\Capabilities;
use Linguator\Includes\Services\Translation\Translation_Term_Model;
use Linguator\Supported_Blocks\Supported_Blocks;
use Linguator\Custom_Fields\Custom_Fields;
use Translation_Entry;
use Translations;
use WP_Error;
use WP_REST_Request;
if ( ! class_exists( 'Bulk_Translation' ) ) :
	/**
	 * Bulk_Translation
	 *
	 * @package Linguator\Modules\Bulk_Translation
	 */
	class Bulk_Translation {


		/**
		 * The base name of the route.
		 *
		 * @var string
		 */
		private $namespace;

		/**
		 * The base name of the route.
		 *
		 * @var string
		 */
		private $rest_base;

		/**
		 * Constructor
		 *
		 * @param string $base_name The base name of the route.
		 */
		public function __construct( $model ) {
			$this->namespace = 'lmat/v1';
			$this->rest_base = 'bulk-translate';
		}

		/**
		 * Register the routes
		 */
		public function register_routes(): void {
			register_rest_route(
				$this->namespace,
				'/' . $this->rest_base . '/(?P<slug>[\w-]+):bulk-translate-entries',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'bulk_translate_entries' ),
					'permission_callback' => array( $this, 'linguator_permission_only_admins' ),
					'args'                => array(
						'ids'        => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => array( $this, 'sanitize_lmat_json_ids' ),
							'validate_callback' => array( $this, 'validate_lmat_json_ids' ),
						),
						'lang'       => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => array( $this, 'sanitize_lmat_json_langs' ),
							'validate_callback' => array( $this, 'validate_lmat_json_langs' ),
						),
						'privateKey' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_lmat_bulk_nonce' ),
						),
					),
				)
			);

			register_rest_route(
				$this->namespace,
				'/' . $this->rest_base . '/(?P<slug>[\w-]+):bulk-translate-taxonomy-entries',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'bulk_translate_taxonomy_entries' ),
					'permission_callback' => array( $this, 'linguator_permission_only_admins' ),
					'args'                => array(
						'taxonomy'   => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_key',
							'validate_callback' => array( $this, 'validate_taxonomy_param' ),
						),
						'lang'       => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => array( $this, 'sanitize_lmat_json_langs' ),
							'validate_callback' => array( $this, 'validate_lmat_json_langs' ),
						),
						'privateKey' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_lmat_bulk_nonce' ),
						),
						'ids'        => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => array( $this, 'sanitize_lmat_json_ids' ),
							'validate_callback' => array( $this, 'validate_lmat_json_ids' ),
						),
					),
				)
			);

			register_rest_route(
				$this->namespace,
				'/' . $this->rest_base . '/(?P<post_id>[\w-]+):create-translate-post',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'linguator_create_translate_post' ),
					'permission_callback' => array( $this, 'linguator_permission_only_admins' ),
					'args'                => array(
						'privateKey'      => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_lmat_create_post_nonce' ),
						),
						'post_id'         => array(
							'type'              => 'integer',
							'required'          => true,
							'sanitize_callback' => 'absint',
							'validate_callback' => array( $this, 'validate_positive_int_param' ),
						),
						'target_language' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_key',
							'validate_callback' => array( $this, 'validate_required_slug_param' ),
						),
						'editor_type'     => array(
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_editor_type_param' ),
						),
						'source_language' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_key',
							'validate_callback' => array( $this, 'validate_required_slug_param' ),
						),
						'post_title'      => array(
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_optional_string_param' ),
						),
						'post_content'    => array(
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => array( $this, 'sanitize_post_content_for_builders' ),
							'validate_callback' => array( $this, 'validate_optional_string_param' ),
						),'post_meta_fields' => array(
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => array( $this, 'sanitize_post_meta_fields_param' ),
							'validate_callback' => array( $this, 'validate_post_meta_fields_param' ),
						),
					),
				)
			);

			register_rest_route(
				$this->namespace,
				'/' . $this->rest_base . '/(?P<term_id>[\w-]+):create-translate-taxonomy',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'create_translate_taxonomy' ),
					'permission_callback' => array( $this, 'linguator_permission_only_admins' ),
					'args'                => array(
						'term_id'              => array(
							'type'              => 'integer',
							'required'          => true,
							'sanitize_callback' => 'absint',
							'validate_callback' => array( $this, 'validate_positive_int_param' ),
						),
						'privateKey'           => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_lmat_create_term_nonce' ),
						),
						'target_language'      => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_key',
							'validate_callback' => array( $this, 'validate_required_slug_param' ),
						),
						'source_language'      => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_key',
							'validate_callback' => array( $this, 'validate_required_slug_param' ),
						),
						'taxonomy'             => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_key',
							'validate_callback' => array( $this, 'validate_taxonomy_param' ),
						),
						'taxonomy_name'        => array(
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_required_text_param' ),
						),
						'taxonomy_slug'        => array(
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_optional_string_param' ),
						),
						'taxonomy_description' => array(
							'required'          => false,
							'type'              => 'string',
							'default'           => '',
							'sanitize_callback' => array( $this, 'sanitize_taxonomy_description_param' ),
							'validate_callback' => array( $this, 'validate_optional_string_param' ),
						),
					),
				)
			);

			register_rest_route(
				$this->namespace,
				'/' . $this->rest_base . '/ai-translate-batch',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'ai_translate_batch' ),
					'permission_callback' => array( $this, 'ai_translate_batch_permissions_check' ),
				)
			);
		}

		/**
		 * REST permission for AI string batch translation (post or taxonomy term as object).
		 *
		 * @param \WP_REST_Request $request Request.
		 * @return true|\WP_Error
		 */
		public function ai_translate_batch_permissions_check( $request ) {
			if ( ! is_user_logged_in() ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 401 ) );
			}

			$nonce = sanitize_text_field( wp_unslash( (string) $request->get_header( 'X-WP-Nonce' ) ) );
			if ( '' === $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
				return new WP_Error( 'rest_forbidden', __( 'Invalid nonce.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}

			if ( ! current_user_can( Capabilities::TRANSLATIONS ) ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}

			return true;
		}

		/**
		 * Batch-translate string map via configured LLM (OpenAI / Gemini / Anthropic).
		 *
		 * @param \WP_REST_Request $request Request.
		 * @return \WP_REST_Response|\WP_Error
		 */
		public function ai_translate_batch( $request ) {
			if ( ! function_exists( 'wp_ai_client_prompt' ) ) {
				return new WP_Error(
					'lmat_ai_unavailable',
					__( 'WordPress AI Client is not available. Install or enable the AI Client and provider packages.', 'linguator-multilingual-ai-translation' ),
					array( 'status' => 501 )
				);
			}

			$params = $request->get_json_params();
			if ( ! is_array( $params ) ) {
				$params = array();
			}

			$provider    = isset( $params['provider'] ) ? sanitize_key( (string) $params['provider'] ) : '';
			$post_id     = isset( $params['post_id'] ) ? absint( $params['post_id'] ) : 0;
			$source_lang = isset( $params['source_lang'] ) ? sanitize_key( (string) $params['source_lang'] ) : '';
			$target_lang = isset( $params['target_lang'] ) ? sanitize_key( (string) $params['target_lang'] ) : '';
			$strings     = isset( $params['strings'] ) && is_array( $params['strings'] ) ? $params['strings'] : array();
			$object_type = isset( $params['object_type'] ) ? sanitize_key( (string) $params['object_type'] ) : 'post';
			$model       = isset( $params['model'] ) ? sanitize_text_field( (string) $params['model'] ) : '';

			if ( ! in_array( $provider, array( 'openai', 'gemini', 'anthropic' ), true ) ) {
				return new WP_Error( 'lmat_ai_invalid_provider', __( 'Invalid translation provider.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
			}

			if ( $post_id <= 0 || '' === $source_lang || '' === $target_lang || empty( $strings ) ) {
				return new WP_Error( 'lmat_ai_invalid_params', __( 'Missing required translation parameters.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
			}

			$access = $this->ai_translate_batch_verify_object_access( $post_id, $object_type );
			if ( is_wp_error( $access ) ) {
				return $access;
			}

			$ai_config = array();
			if ( property_exists( LMAT(), 'options' ) && isset( LMAT()->options['ai_translation_configuration'] ) && is_array( LMAT()->options['ai_translation_configuration'] ) ) {
				$ai_config = LMAT()->options['ai_translation_configuration'];
			}

			$enabled = isset( $ai_config['provider'][ $provider ] ) && $ai_config['provider'][ $provider ];
			if ( ! $enabled ) {
				return new WP_Error( 'lmat_ai_provider_disabled', __( 'This AI provider is not enabled in translation settings.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
			}

			$key_option = 'connectors_ai_' . $provider . '_key';
			$api_key    = (string) get_option( $key_option, '' );
			if ( '' === trim( $api_key ) ) {
				return new WP_Error( 'lmat_ai_no_key', __( 'API key is not configured for this provider.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
			}

			$sanitized_strings = array();
			foreach ( $strings as $k => $v ) {
				$key = sanitize_text_field( (string) $k );
				if ( '' === $key ) {
					continue;
				}
				if ( ! is_string( $v ) ) {
					$v = wp_json_encode( $v );
				}
				$sanitized_strings[ $key ] = $v;
			}

			if ( empty( $sanitized_strings ) ) {
				return new WP_Error( 'lmat_ai_invalid_params', __( 'No translatable strings in request.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
			}

			$lang_names = $this->ai_translate_language_labels( $source_lang, $target_lang );

			$result = $this->ai_translate_strings_with_llm(
				$provider,
				$source_lang,
				$target_lang,
				$lang_names['source_name'],
				$lang_names['target_name'],
				$sanitized_strings,
				$api_key,
				$model
			);

			if ( is_wp_error( $result ) ) {
				return $result;
			}

			return rest_ensure_response( array( 'translations' => $result ) );
		}

		private function ai_translate_batch_verify_object_access( int $object_id, string $object_type ) {
			if ( 'term' === $object_type ) {
				$term = get_term( $object_id );
				if ( ! $term || is_wp_error( $term ) ) {
					return new WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
				}
				if ( ! current_user_can( 'edit_term', $object_id ) ) {
					return new WP_Error( 'rest_forbidden', __( 'You are not authorized to edit this term.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
				}
				return true;
			}

			$post = get_post( $object_id );
			if ( ! $post ) {
				return new WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}
			if ( ! current_user_can( 'edit_post', $object_id ) ) {
				return new WP_Error( 'rest_forbidden', __( 'You are not allowed to edit this content.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}
			$post_type_object = get_post_type_object( $post->post_type );
			if ( ! $post_type_object || empty( $post_type_object->cap->create_posts ) ) {
				return new WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}
			if ( ! current_user_can( $post_type_object->cap->create_posts ) ) {
				return new WP_Error( 'rest_forbidden', __( 'You are not allowed to create translations for this post type.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}
			return true;
		}

		/**
		 * @param string $source_slug Source language slug.
		 * @param string $target_slug Target language slug.
		 * @return array{source_name:string,target_name:string}
		 */
		private function ai_translate_language_labels( string $source_slug, string $target_slug ): array {
			$default = array(
				'source_name' => $source_slug,
				'target_name' => $target_slug,
			);
			if ( ! function_exists( 'LMAT' ) || ! LMAT() || ! property_exists( LMAT(), 'model' ) ) {
				return $default;
			}
			$list = LMAT()->model->get_languages_list();
			if ( ! is_array( $list ) ) {
				return $default;
			}
			$source_name = $source_slug;
			$target_name = $target_slug;
			foreach ( $list as $lang ) {
				if ( ! is_object( $lang ) || ! isset( $lang->slug ) ) {
					continue;
				}
				$name = isset( $lang->name ) ? (string) $lang->name : $lang->slug;
				if ( $lang->slug === $source_slug ) {
					$source_name = $name;
				}
				if ( $lang->slug === $target_slug ) {
					$target_name = $name;
				}
			}
			return array(
				'source_name' => $source_name,
				'target_name' => $target_name,
			);
		}

		/**
		 * @param string               $provider     openai|gemini|anthropic.
		 * @param string               $source_lang  Slug.
		 * @param string               $target_lang  Slug.
		 * @param string               $source_label Human label.
		 * @param string               $target_label Human label.
		 * @param array<string,string> $strings      Key => source text.
		 * @return array<string,string>|\WP_Error
		 */
		private function ai_translate_strings_with_llm( string $provider, string $source_lang, string $target_lang, string $source_label, string $target_label, array $strings, string $api_key, string $model_override = '', int $split_depth = 0 ) {
			$models = array();
			$ai_config = array();
			if ( property_exists( LMAT(), 'options' ) ) {
				$m = LMAT()->model->options->get( 'api_keys' );
				if ( is_array( $m ) ) {
					$models = $m;
				}

				$cfg = LMAT()->model->options->get( 'ai_translation_configuration' );
				if ( is_array( $cfg ) ) {
					$ai_config = $cfg;
				}
			}

			$model_key = 'openai_model';
			if ( 'gemini' === $provider ) {
				$model_key = 'gemini_model';
			} elseif ( 'anthropic' === $provider ) {
				$model_key = 'anthropic_model';
			}
			$model_defaults = array(
				'openai_model'    => 'gpt-4o-mini',
				'gemini_model'    => 'gemini-2.5-flash',
				'anthropic_model' => 'claude-3-5-sonnet-latest',
			);
			$model_id = trim( $model_override );
			if ( '' === $model_id ) {
				$model_id = isset( $models[ $model_key ] ) ? trim( (string) $models[ $model_key ] ) : '';
			}
			if ( '' === $model_id && isset( $model_defaults[ $model_key ] ) ) {
				$model_id = $model_defaults[ $model_key ];
			}
			// Ensure the selected provider is actually configured in the WP AI Client registry.
			$provider_id = ( 'gemini' === $provider ) ? 'google' : $provider;
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

			$auth_class = '\WordPress\AiClient\Providers\Http\DTO\ApiKeyRequestAuthentication';
			if ( ! class_exists( $auth_class ) ) {
				return new WP_Error(
					'lmat_ai_client_missing',
					__( 'AI client is not available.', 'linguator-multilingual-ai-translation' ),
					array( 'status' => 400 )
				);
			}

			// Inject key for this request so prompt builder can resolve models.
			$registry->setProviderRequestAuthentication( $provider_id, new $auth_class( trim( $api_key ) ) );

			$payload = wp_json_encode( $strings, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
			if ( false === $payload ) {
				return new WP_Error( 'lmat_ai_encode_error', __( 'Could not prepare translation payload.', 'linguator-multilingual-ai-translation' ), array( 'status' => 500 ) );
			}

			$glossary_data         = get_option( 'lmat_glossary_data', array() );
			$glossary_instructions = '';
			$matched_terms         = array();
			$has_glossary_terms    = false;

			if ( ! empty( $glossary_data ) && is_array( $glossary_data ) ) {
				foreach ( $strings as $string ) {
					foreach ( $glossary_data as $entry ) {
						if (
							is_array( $entry ) &&
							! empty( $entry['original_term'] ) &&
							isset( $entry['original_language_code'] ) &&
							$entry['original_language_code'] === $source_lang &&
							stripos( (string) $string, (string) $entry['original_term'] ) !== false
						) {
							$has_glossary_terms = true;
							break 2;
						}
					}
				}

				if ( $has_glossary_terms ) {
					foreach ( $glossary_data as $entry ) {
						if (
							! is_array( $entry ) ||
							empty( $entry['original_language_code'] ) ||
							empty( $entry['original_term'] ) ||
							empty( $entry['translations'] ) ||
							$entry['original_language_code'] !== $source_lang
						) {
							continue;
						}

						$translations_by_code = array();
						foreach ( $entry['translations'] as $translation ) {
							if (
								is_array( $translation ) &&
								! empty( $translation['target_language_code'] ) &&
								! empty( $translation['translated_term'] )
							) {
								$translations_by_code[ $translation['target_language_code'] ] = $translation['translated_term'];
							}
						}

						$term_found = false;
						foreach ( $strings as $string ) {
							if ( stripos( (string) $string, (string) $entry['original_term'] ) !== false ) {
								$term_found = true;
								break;
							}
						}

						if ( $term_found && isset( $translations_by_code[ $target_lang ] ) ) {
							$matched_terms[] = array(
								'term'        => $entry['original_term'],
								'translation' => $translations_by_code[ $target_lang ],
								'description' => $entry['description'] ?? '',
							);
						}
					}
				}
			}

			if ( $has_glossary_terms && ! empty( $matched_terms ) ) {
				$glossary_instructions = "Please use the following glossary terms in your translation:\n";

				foreach ( $matched_terms as $term ) {
					$src_term    = isset( $term['term'] ) ? (string) $term['term'] : '';
					$translation = isset( $term['translation'] ) ? (string) $term['translation'] : '';
					$description = isset( $term['description'] ) ? (string) $term['description'] : '';

					$glossary_instructions .= '- "' . $src_term . '" -> "' . $translation . '"';
					if ( '' !== $description ) {
						$glossary_instructions .= ' - Note: ' . $description;
					}
					$glossary_instructions .= "\n";
				}
			}

			$custom_prompt = '';
			if ( isset( $ai_config['custom_prompt'] ) && is_string( $ai_config['custom_prompt'] ) ) {
				$custom_prompt = trim( $ai_config['custom_prompt'] );
			}

			$instruction = sprintf(
				'You are a professional translator.
				Source Language: %s
				Target Language: %s
				Instruction 1: Translate visible text content semantically from %s into %s language. Provide a proper meaning-based translation.
				Instruction 2: Do not translate or modify any content inside square brackets [] and Do not translate any URL. These are shortcodes or dynamic placeholders and must remain exactly as they are.
				Instruction 3: Preserve all HTML tags and their attributes such as class, id, data-*, etc. Do not alter any part of the HTML structure.
				Instruction 4: Return the translation in the format of a JSON object with the keys being numeric values (matching the source keys), and the values being the translated strings.
				Instruction 5: Do not escape double quotes with backslashes. Output must be valid JSON without extra slashes.
				Instruction 6: Translate the provided JSON array from %s into %s language, regardless of whether the values are the same, and ensure the JSON is well-formed and complete.
				Instruction 7: Decode any &lt; and &gt; HTML entities back to < and > symbols in the output and preserve and maintain whitespace.
				Instruction 8: Return the output as a valid JSON object. Do not wrap the output in a string or markdown code block. Ensure the JSON is clean, parseable, and properly formatted.

				Please ensure that the output follows the format: {"key(numeric value)": "(translations of the strings in %s language)"}

				Strings are :- %s',
				sanitize_text_field( $source_label ),
				sanitize_text_field( $target_label ),
				sanitize_text_field( $source_label ),
				sanitize_text_field( $target_label ),
				sanitize_text_field( $source_label ),
				sanitize_text_field( $target_label ),
				sanitize_text_field( $target_label ),
				$payload
			);

			if ( '' !== $custom_prompt ) {
				$instruction .= 'Instruction 9: ' . sanitize_text_field( $custom_prompt );
			}

			if ( '' !== $glossary_instructions ) {
				$instruction_number = '' !== $custom_prompt ? 10 : 9;
				$instruction       .= 'Instruction ' . $instruction_number . ': ' . $glossary_instructions;
			}

			$builder = wp_ai_client_prompt();
			if ( method_exists( $builder, 'using_system_instruction' ) ) {
				$builder = $builder->using_system_instruction( __( 'You are a professional translator. Output only valid JSON objects.', 'linguator-multilingual-ai-translation' ) );
			}
			if ( method_exists( $builder, 'with_text' ) ) {
				$builder = $builder->with_text( $instruction );
			} else {
				$builder = wp_ai_client_prompt( $instruction );
			}

			if ( '' !== $model_id && method_exists( $builder, 'using_model_preference' ) ) {
				$builder = $builder->using_model_preference( $model_id );
			}

			try {
				$text = $builder->generate_text();
			} catch ( \Exception $e ) {
				$msg = (string) $e->getMessage();
				if ( false !== stripos( $msg, 'No models found' ) ) {
					return new WP_Error(
						'lmat_ai_no_models',
						__( 'No compatible text-generation model is available for the selected provider. Please ensure the provider is installed, an API key is saved, and a text model is selected.', 'linguator-multilingual-ai-translation' ),
						array( 'status' => 400 )
					);
				}
				if (
					false !== stripos( $msg, '429' ) ||
					false !== stripos( $msg, 'quota exceeded' ) ||
					false !== stripos( $msg, 'rate limit' ) ||
					false !== stripos( $msg, 'too many requests' )
				) {
					return new WP_Error(
						'lmat_ai_rate_limited',
						__( 'Gemini API quota/rate limit exceeded. Please check billing/quotas, then retry with smaller batches.', 'linguator-multilingual-ai-translation' ),
						array( 'status' => 429 )
					);
				}
				return new WP_Error(
					'lmat_ai_request_failed',
					__( 'AI translation request failed. Please try again shortly.', 'linguator-multilingual-ai-translation' ),
					array( 'status' => 502 )
				);
			}

			if ( is_wp_error( $text ) ) {
				if ( $this->ai_translate_is_timeout_error( $text ) ) {
					$string_count = count( $strings );
					if ( $string_count > 1 && $split_depth < 3 ) {
						$chunks = $this->ai_translate_split_string_map( $strings );
						if ( 2 === count( $chunks ) ) {
							$left = $this->ai_translate_strings_with_llm(
								$provider,
								$source_lang,
								$target_lang,
								$source_label,
								$target_label,
								$chunks[0],
								$api_key,
								$model_override,
								$split_depth + 1
							);
							if ( is_wp_error( $left ) ) {
								return $left;
							}

							$right = $this->ai_translate_strings_with_llm(
								$provider,
								$source_lang,
								$target_lang,
								$source_label,
								$target_label,
								$chunks[1],
								$api_key,
								$model_override,
								$split_depth + 1
							);
							if ( is_wp_error( $right ) ) {
								return $right;
							}

							return $left + $right;
						}
					}

					return new WP_Error(
						'lmat_ai_request_timeout',
						__( 'The AI provider request timed out. Please retry in a moment or translate fewer strings at once.', 'translate-words' ),
						array( 'status' => 503 )
					);
				}

				return $text;
			}

			$clean_text = preg_replace( '/(^```json\n|```$)/', '', (string) $text );
			$clean_text = str_replace( '<ATFPP_NEW_L>', '\n', (string) $clean_text );
			$clean_text = str_replace( '<ATFPP_NEW_R>', '\r', (string) $clean_text );
			$final_text = preg_replace( '/\\\\{2,}([\'"n])/', '\\\$1', (string) $clean_text );

			if ( is_string( $final_text ) ) {
				$maybe_decoded = json_decode( $final_text, true );
				if ( is_array( $maybe_decoded ) && 1 === count( $maybe_decoded ) ) {
					$key = array_keys( $maybe_decoded )[0];
					if ( isset( $maybe_decoded[ $key ] ) && is_string( $maybe_decoded[ $key ] ) ) {
						$inner = json_decode( $maybe_decoded[ $key ], true );
						if ( is_array( $inner ) && isset( $inner[ $key ] ) && ! is_array( $inner[ $key ] ) ) {
							$maybe_decoded[ $key ] = (string) $inner[ $key ];
							$final_text            = wp_json_encode( $maybe_decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
						}
					}
				}
			}

			if ( is_string( $final_text ) && ( str_starts_with( $final_text, '"' ) || str_ends_with( $final_text, '"' ) ) ) {
				$final_text = trim( $final_text, '"' );
			}

			$decoded = $this->ai_translate_parse_json_object( (string) $final_text );
			if ( is_wp_error( $decoded ) ) {
				return $decoded;
			}

			$out = array();
			foreach ( array_keys( $strings ) as $key ) {
				if ( isset( $decoded[ $key ] ) && is_scalar( $decoded[ $key ] ) ) {
					$out[ $key ] = (string) $decoded[ $key ];
				} else {
					$out[ $key ] = $strings[ $key ];
				}
			}

			return $out;
		}

		/**
		 * @param string $text Raw model output.
		 * @return array<string,mixed>|\WP_Error
		 */
		private function ai_translate_parse_json_object( string $text ) {
			$text = trim( $text );
			$text = html_entity_decode( $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
			if ( preg_match( '/```(?:json)?\s*(\{.*\})\s*```/s', $text, $m ) ) {
				$text = $m[1];
			} elseif ( preg_match( '/\{[\s\S]*\}/', $text, $m ) ) {
				$text = $m[0];
			}

			$decoded = json_decode( $text, true );
			if ( JSON_ERROR_NONE !== json_last_error() || ! is_array( $decoded ) ) {
				return new WP_Error(
					'lmat_ai_bad_response',
					__( 'The AI returned an invalid translation response. Please try again.', 'linguator-multilingual-ai-translation' ),
					array( 'status' => 502 )
				);
			}

			return $decoded;
		}

		/**
		 * Determines whether an AI client error indicates a request timeout.
		 *
		 * @param \WP_Error $error Error returned by the AI client.
		 * @return bool
		 */
		private function ai_translate_is_timeout_error( WP_Error $error ): bool {
			$codes = $error->get_error_codes();
			foreach ( $codes as $code ) {
				$code_str = strtolower( (string) $code );
				if ( false !== stripos( $code_str, 'timeout' ) || false !== stripos( $code_str, 'network_error' ) ) {
					return true;
				}

				$data = $error->get_error_data( $code );
				if ( is_array( $data ) && isset( $data['status'] ) && 503 === absint( $data['status'] ) ) {
					$exception_class = isset( $data['exception_class'] ) ? strtolower( (string) $data['exception_class'] ) : '';
					if ( false !== stripos( $exception_class, 'networkexception' ) ) {
						return true;
					}
				}
			}

			$message = strtolower( $error->get_error_message() );
			return false !== stripos( $message, 'timed out' ) || false !== stripos( $message, 'cURL error 28' );
		}

		/**
		 * Split an associative string map into two balanced chunks.
		 *
		 * @param array<string,string> $strings Source strings.
		 * @return array<int,array<string,string>>
		 */
		private function ai_translate_split_string_map( array $strings ): array {
			$keys  = array_keys( $strings );
			$count = count( $keys );
			if ( $count < 2 ) {
				return array( $strings );
			}

			$left_count = (int) ceil( $count / 2 );
			$left       = array();
			$right      = array();

			foreach ( $keys as $index => $key ) {
				if ( $index < $left_count ) {
					$left[ $key ] = $strings[ $key ];
					continue;
				}
				$right[ $key ] = $strings[ $key ];
			}

			if ( empty( $left ) || empty( $right ) ) {
				return array( $strings );
			}

			return array( $left, $right );
		}
		
		public function linguator_permission_only_admins( $request ) {

			if ( ! is_user_logged_in() ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 401 ) );
			}

			$nonce = $request->get_header( 'X-WP-Nonce' );

			$nonce = sanitize_text_field( wp_unslash( (string) $nonce ) );

			if ( '' === $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
				return new WP_Error( 'rest_forbidden', __( 'Invalid nonce.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}

			$taxonomy = $request->get_param( 'taxonomy' );
			if ( ! empty( $taxonomy ) ) {
				$taxonomy = sanitize_key( $taxonomy );
				$tax_obj  = get_taxonomy( $taxonomy );
				if ( ! $tax_obj || empty( $tax_obj->cap ) || empty( $tax_obj->cap->manage_terms ) ) {
					return new \WP_Error( 'rest_invalid_param', __( 'Invalid taxonomy.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
				}
				if ( ! current_user_can( $tax_obj->cap->manage_terms ) ) {
					return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
				}
				// Object-level checks: if a term (or list of terms) is provided, require edit capability for it.
				$term_id_param = $request->get_param( 'term_id' );
				if ( null !== $term_id_param && '' !== $term_id_param ) {
					// Creating a translated term (create-translate-taxonomy) will create a new term; require create capability too.
					if ( ! empty( $tax_obj->cap->create_terms ) && ! current_user_can( $tax_obj->cap->create_terms ) ) {
						return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to create terms for this taxonomy.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
					}
					$term_id = absint( $term_id_param );
					if ( $term_id <= 0 ) {
						return new \WP_Error( 'rest_invalid_param', __( 'Invalid term id.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
					}
					if ( ! current_user_can( 'edit_term', $term_id ) ) {
						return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to edit this term.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
					}
				}

				$ids_param = $request->get_param( 'ids' );
				if ( null !== $ids_param && '' !== $ids_param ) {
					// Bulk taxonomy translation can create new terms; require create capability too.
					if ( ! empty( $tax_obj->cap->create_terms ) && ! current_user_can( $tax_obj->cap->create_terms ) ) {
						return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to create terms for this taxonomy.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
					}
					$decoded_ids = json_decode( (string) $ids_param, true );
					if ( is_array( $decoded_ids ) ) {
						foreach ( $decoded_ids as $maybe_id ) {
							$term_id = absint( $maybe_id );
							if ( $term_id > 0 && ! current_user_can( 'edit_term', $term_id ) ) {
								return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to edit one or more requested terms.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
							}
						}
					}
				}
				return true;
			}
			// Creating a translated post: must edit source and be allowed to create new content of that post type.
			$post_id_param = $request->get_param( 'post_id' );
			if ( null !== $post_id_param && '' !== $post_id_param ) {
				$post_id = absint( $post_id_param );
				if ( $post_id <= 0 ) {
					return new \WP_Error( 'rest_invalid_param', __( 'Invalid post ID.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
				}
				$post = get_post( $post_id );
				if ( ! $post ) {
					return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
				}
				if ( ! current_user_can( 'edit_post', $post_id ) ) {
					return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
				}
				$post_type_object = get_post_type_object( $post->post_type );
				if ( ! $post_type_object || empty( $post_type_object->cap->create_posts ) ) {
					return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
				}
				if ( ! current_user_can( $post_type_object->cap->create_posts ) ) {
					return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
				}
				return true;
			}
			// Bulk post translation (`bulk-translate-entries`): body `ids` are post IDs — require edit + create (and publish when source is public).
			$ids_param = $request->get_param( 'ids' );
			if ( null !== $ids_param && '' !== $ids_param ) {
				$decoded_ids = json_decode( (string) $ids_param, true );
				if ( ! is_array( $decoded_ids ) || empty( $decoded_ids ) ) {
					return new \WP_Error( 'rest_invalid_param', __( 'Invalid post ids.', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
				}

				if ( ! current_user_can( Capabilities::TRANSLATIONS ) ) {
					return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
				}

				foreach ( $decoded_ids as $maybe_id ) {
					$post_id = absint( $maybe_id );
					if ( $post_id <= 0 ) {
						continue;
					}

					$post = get_post( $post_id );
					if ( ! $post ) {
						continue;
					}

					if ( ! current_user_can( 'edit_post', $post_id ) ) {
						return new \WP_Error( 'rest_forbidden', __( 'You are not allowed to translate one or more of the selected posts.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
					}

					$post_type_object = get_post_type_object( $post->post_type );
					if ( ! $post_type_object || empty( $post_type_object->cap ) ) {
						return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
					}

					$create_cap = ! empty( $post_type_object->cap->create_posts )
						? $post_type_object->cap->create_posts
						: ( ! empty( $post_type_object->cap->edit_posts ) ? $post_type_object->cap->edit_posts : '' );

					if ( '' === $create_cap || ! current_user_can( $create_cap ) ) {
						return new \WP_Error( 'rest_forbidden', __( 'You are not allowed to create translations for one or more of the selected post types.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
					}

					// Translations may inherit publish status from source.
					if ( 'publish' === $post->post_status || 'private' === $post->post_status ) {
						$publish_cap = ! empty( $post_type_object->cap->publish_posts ) ? $post_type_object->cap->publish_posts : '';
						if ( '' !== $publish_cap && ! current_user_can( $publish_cap ) ) {
							return new \WP_Error( 'rest_forbidden', __( 'You are not allowed to publish translations for one or more of the selected posts.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
						}
					}
				}

				return true;
			}
			if ( ! current_user_can( Capabilities::TRANSLATIONS ) ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}
			return true;
		}

		public function validate_lmat_bulk_nonce( $value, $request, $param ) {
			$nonce = sanitize_text_field( wp_unslash( (string) $value ) );
			return wp_verify_nonce( $nonce, 'lmat_bulk_translate_entries_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
		}

		public function validate_lmat_create_post_nonce( $value, $request, $param ) {
			$nonce = sanitize_text_field( wp_unslash( (string) $value ) );
			return wp_verify_nonce( $nonce, 'lmat_create_translate_post_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
		}

		public function validate_lmat_create_term_nonce( $value, $request, $param ) {
			$nonce = sanitize_text_field( wp_unslash( (string) $value ) );
			return wp_verify_nonce( $nonce, 'lmat_create_translate_taxonomy_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
		}

		/**
		 * Validate positive integer request values.
		 *
		 * @param mixed $value Request value.
		 * @return bool
		 */
		public function validate_positive_int_param( $value ) {
			return is_numeric( $value ) && absint( $value ) > 0;
		}

		/**
		 * Validate required slug-like values.
		 *
		 * @param mixed $value Request value.
		 * @return bool
		 */
		public function validate_required_slug_param( $value ) {
			return is_scalar( $value ) && '' !== sanitize_key( (string) $value );
		}

		/**
		 * Validate taxonomy parameter.
		 *
		 * @param mixed $value Request value.
		 * @return bool
		 */
		public function validate_taxonomy_param( $value ) {
			$taxonomy = sanitize_key( (string) $value );
			return '' !== $taxonomy && taxonomy_exists( $taxonomy );
		}

		/**
		 * Validates editor type payload.
		 *
		 * @param mixed $value Request value.
		 * @return bool
		 */
		public function validate_editor_type_param( $value ) {
			// Allow empty/missing editor type (handler handles defaults).
			if ( null === $value ) {
				return true;
			}

			$editor_type = sanitize_text_field( (string) $value );
			if ( '' === $editor_type ) {
				return true;
			}

			return in_array( $editor_type, array( 'elementor', 'block', 'classic' ), true );
		}

		/**
		 * Validates an optional string-like parameter.
		 *
		 * @param mixed $value Request value.
		 * @return bool
		 */
		public function validate_optional_string_param( $value ) {
			// Optional args can be empty. Ensure we only accept scalar inputs.
			if ( null === $value ) {
				return true;
			}

			return is_scalar( $value );
		}
		
		/**
		 * Validates optional JSON payload for post meta fields.
		 *
		 * @param mixed $value Request value.
		 * @return bool
		 */
		public function validate_post_meta_fields_param( $value ) {
			if ( null === $value || '' === $value ) {
				return true;
			}

			if ( ! is_string( $value ) ) {
				return false;
			}

			$decoded = json_decode( $value, true );
			return JSON_ERROR_NONE === json_last_error() && is_array( $decoded );
		}

		/**
		 * Sanitizes optional JSON payload for post meta fields.
		 *
		 * @param mixed $value Raw request value.
		 * @return string
		 */
		public function sanitize_post_meta_fields_param( $value ) {
			if ( null === $value || '' === $value || ! is_string( $value ) ) {
				return '';
			}

			$decoded = json_decode( $value, true );
			if ( JSON_ERROR_NONE !== json_last_error() || ! is_array( $decoded ) ) {
				return '';
			}

			return wp_json_encode( $decoded );
		}

		/**
		 * Sanitize taxonomy term description for REST (allowed post HTML).
		 *
		 * @param mixed $value Raw request value.
		 * @return string
		 */
		public function sanitize_taxonomy_description_param( $value ) {
			if ( null === $value || false === $value ) {
				return '';
			}
			return wp_kses_post( is_string( $value ) ? $value : (string) $value );
		}

		/**
		 * Validates a required non-empty text parameter.
		 *
		 * @param mixed $value Request value.
		 * @return bool
		 */
		public function validate_required_text_param( $value ) {
			if ( ! is_scalar( $value ) ) {
				return false;
			}

			return '' !== sanitize_text_field( (string) $value );
		}

		/**
		 * Validate JSON-encoded IDs payload.
		 *
		 * @param mixed $value Request value.
		 * @return bool
		 */
		public function validate_lmat_json_ids( $value ) {
			$decoded = json_decode( (string) $value, true );
			if ( ! is_array( $decoded ) || empty( $decoded ) ) {
				return false;
			}

			foreach ( $decoded as $id ) {
				if ( ! is_numeric( $id ) || absint( $id ) <= 0 ) {
					return false;
				}
			}

			return true;
		}

		/**
		 * Validate JSON-encoded language slugs payload.
		 *
		 * @param mixed $value Request value.
		 * @return bool
		 */
		public function validate_lmat_json_langs( $value ) {
			$decoded = json_decode( (string) $value, true );
			if ( ! is_array( $decoded ) || empty( $decoded ) ) {
				return false;
			}

			foreach ( $decoded as $lang ) {
				if ( '' === sanitize_key( (string) $lang ) ) {
					return false;
				}
			}

			return true;
		}

		/**
		 * Sanitizes JSON-encoded post IDs payload.
		 *
		 * @param mixed $value Raw request value.
		 * @return string
		 */
		public function sanitize_lmat_json_ids( $value ) {
			$decoded = json_decode( (string) $value, true );
			if ( ! is_array( $decoded ) ) {
				return wp_json_encode( array() );
			}

			$ids = array_values( array_filter( array_map( 'absint', $decoded ) ) );
			return wp_json_encode( $ids );
		}

		/**
		 * Sanitizes JSON-encoded language slugs payload.
		 *
		 * @param mixed $value Raw request value.
		 * @return string
		 */
		public function sanitize_lmat_json_langs( $value ) {
			$decoded = json_decode( (string) $value, true );
			if ( ! is_array( $decoded ) ) {
				return wp_json_encode( array() );
			}

			$langs = array();
			foreach ( $decoded as $lang ) {
				$sanitized_lang = sanitize_key( (string) $lang );
				if ( '' !== $sanitized_lang ) {
					$langs[] = $sanitized_lang;
				}
			}

			return wp_json_encode( array_values( $langs ) );
		}

		/**
		 * Sanitizes post_content for create-translate-post depending on the page builder/editor.
		 *
		 * - classic/wpbakery: allow safe HTML via wp_kses_post().
		 * - block/elementor: expect JSON payload; validate JSON but don't run HTML sanitization on it.
		 *
		 * @param mixed           $value   Raw incoming value.
		 * @param WP_REST_Request $request Request object.
		 * @param string          $param   Parameter name.
		 * @return string Sanitized content (empty string if invalid).
		 */
		public function sanitize_post_content_for_builders( $value, $request, $param ) {
			$value = is_string( $value ) ? $value : '';

			$editor_type = '';
			if ( $request instanceof WP_REST_Request ) {
				$editor_type = sanitize_key( (string) $request->get_param( 'editor_type' ) );
			}

			// JSON builders: validate JSON and return it as-is (so downstream json_decode() works).
			if ( in_array( $editor_type, array( 'block', 'elementor' ), true ) ) {
				if ( '' === $value ) {
					return '';
				}
				json_decode( $value, true );
				return ( JSON_ERROR_NONE === json_last_error() ) ? $value : '';
			}

			// Default: sanitize as post content HTML.
			return wp_kses_post( $value );
		}

		public function bulk_translate_entries( $params ) {
			// Check if the user is logged in and has the necessary capabilities
			if ( ! is_user_logged_in() ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			if ( ! current_user_can( Capabilities::TRANSLATIONS ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			// Verify the nonce.
			$private_key = isset( $params['privateKey'] ) ? sanitize_text_field( wp_unslash( (string) $params['privateKey'] ) ) : '';
			if ( '' === $private_key || ! wp_verify_nonce( $private_key, 'lmat_bulk_translate_entries_nonce' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			global $linguator;

			// check language exists or not
			$translate_lang = json_decode( $params['lang'], true );
			$translate_lang = is_array( $translate_lang )
				? array_values(
					array_filter(
						array_map(
							static function ( $lang ) {
								return sanitize_key( (string) $lang );
							},
							$translate_lang
						)
					)
				)
				: array();

			$post_ids = json_decode( $params['ids'], true );
			$post_ids = is_array( $post_ids )
				? array_values( array_filter( array_map( 'absint', $post_ids ) ) )
				: array();
			$posts_translate = array();
			$gutenberg_block = false;

			$slug_translation_option = 'title_translate';
			if(property_exists(LMAT(), 'options') && isset(LMAT()->options['ai_translation_configuration']['slug_translation_option'])){
				$slug_translation_option = LMAT()->options['ai_translation_configuration']['slug_translation_option'];
			}

			$post_meta_sync = true;
			if ( ! isset( LMAT()->options['sync'] ) || ( isset( LMAT()->options['sync'] ) && ! in_array( 'post_meta', LMAT()->options['sync'] ) ) ) {
				$post_meta_sync = false;
			}

			if ( count( $translate_lang ) > 0 && ! ( count( $post_ids ) < 1 ) ) {
				$lmat_langs           = $linguator->model->get_languages_list();
				$lmat_langs_slugs     = array_column( $lmat_langs, 'slug' );
				$allowed_meta_fields = Custom_Fields::get_allowed_custom_fields();
				
				foreach ( $post_ids as $postId ) {

					if ( ! current_user_can( 'edit_post', $postId ) ) {
						continue;
					}

					$posts_translate[ $postId ]['sourceLanguage'] = $linguator->model->post->get_language( $postId )->slug;
					$post_data                                    = get_post( $postId );

					if ( ! $posts_translate[ $postId ]['sourceLanguage'] ) {
						$posts_translate[ $postId ]['sourceLanguage'] = false;
						$posts_translate[ $postId ]['title']          = $post_data->post_title;
						$posts_translate[ $postId ]['editor_type']    = has_blocks( $post_data->post_content ) ? 'block' : 'classic';
						$posts_translate[ $postId ]['post_link']      = html_entity_decode( get_edit_post_link( $postId ) );
						continue;
					}

			$elementor_enabled = get_post_meta( $postId, '_elementor_edit_mode', true );
			$wpbakery_enabled = get_post_meta( $postId, '_wpb_vc_js_status', true );
			if ( ! $post_data ) {
				continue;
			}

			if ( $slug_translation_option === 'slug_translate' ) {
				$posts_translate[ $postId ]['post_name'] = urldecode( get_post_field( 'post_name', $postId ) );
			}

			$posts_translate[ $postId ]['title']       = $post_data->post_title;
			
			// Check for WPBakery first - if enabled, treat as classic even if has_blocks() returns true
			// This prevents vc_gutenberg element from incorrectly setting editor type to 'block'
			$is_wpbakery_page = ( 'true' === $wpbakery_enabled || true === $wpbakery_enabled );
			
			if ( $is_wpbakery_page ) {
				// For WPBakery pages, always use raw content and set editor to 'classic'
				$posts_translate[ $postId ]['content']     = $post_data->post_content;
				$posts_translate[ $postId ]['editor_type'] = 'classic';
			} else {
				// For non-WPBakery pages, check for Gutenberg blocks
				$posts_translate[ $postId ]['content']     = has_blocks( $post_data->post_content ) ? parse_blocks( $post_data->post_content ) : $post_data->post_content;
				$posts_translate[ $postId ]['editor_type'] = has_blocks( $post_data->post_content ) ? 'block' : 'classic';
			}

					if ( isset( $post_data->post_excerpt ) && ! empty( $post_data->post_excerpt ) ) {
						$posts_translate[ $postId ]['excerpt'] = $post_data->post_excerpt;
					}

					$posts_translate[ $postId ]['sourceLanguage'] = ! isset( $posts_translate[ $postId ]['sourceLanguage'] ) ? linguator_default_language() : $posts_translate[ $postId ]['sourceLanguage'];

					if ( ! $post_meta_sync ) {
						$post_meta_fields    = get_post_meta( $postId );
						$existed_meta_fields = array_intersect( array_keys( $post_meta_fields ), array_keys( $allowed_meta_fields ) );

						foreach ( $existed_meta_fields as $key ) {
							if ( isset( $post_meta_fields[ $key ] ) && ! empty( $post_meta_fields[ $key ] ) && isset( $allowed_meta_fields[ $key ]['status'] ) && true === $allowed_meta_fields[ $key ]['status'] ) {
								$value = $allowed_meta_fields[ $key ]['type'] && is_array( $post_meta_fields[ $key ] ) ? maybe_unserialize( $post_meta_fields[ $key ][0] ) : maybe_unserialize( $post_meta_fields[ $key ] );
								$posts_translate[ $postId ]['metaFields'][ $key ] = $value;
							}
						}
					}

					$posts_translate[ $postId ]['post_link'] = get_the_permalink( $postId );

				if ( $elementor_enabled && 'builder' === $elementor_enabled && defined( 'ELEMENTOR_VERSION' ) ) {
					$elementor_data = get_post_meta( $postId, '_elementor_data', true );

					if ( $elementor_data && '' !== $elementor_data ) {
						$posts_translate[ $postId ]['editor_type'] = 'elementor';
						$elementor_data                            = array();

						if ( class_exists( '\Elementor\Plugin' ) && property_exists( '\Elementor\Plugin', 'instance' ) ) {
							$elementor_data = \Elementor\Plugin::$instance->documents->get( $postId )->get_elements_data();
						}

						$posts_translate[ $postId ]['content'] = $elementor_data;
						unset( $posts_translate[ $postId ]['metaFields']['_elementor_data'] );
					}
				}

			// Handle WPBakery content - apply transformations for translation
			if ( $is_wpbakery_page ) {
				// Apply WPBakery content filters to prepare for translation
				// This decodes base64-encoded attributes and exposes translatable content
				$wpbakery_content = $posts_translate[ $postId ]['content'];
				
				// Apply the lmat_post_content_for_translation filter that WPBakery hooks into
				$wpbakery_content = apply_filters( 'lmat_post_content_for_translation', $wpbakery_content, $postId );
				
				$posts_translate[ $postId ]['content'] = $wpbakery_content;
			}

				if ( $posts_translate[ $postId ]['editor_type'] === 'block' && ! $gutenberg_block ) {
					$gutenberg_block = true;
				}

					foreach ( $translate_lang as $lang ) {
						if ( in_array( $lang, $lmat_langs_slugs ) ) {
							$post_translate_status = $linguator->model->post->get_translation( $postId, $lang );
							if ( ! $post_translate_status ) {
								$posts_translate[ $postId ]['languages'][] = $lang;
							} else {
								$posts_translate[ $postId ]['postExists'][ $lang ] = array(
									'post_title' => get_the_title( $post_translate_status ),
									'post_url'   => get_the_permalink( $post_translate_status ),
								);
							}
						}
					}
				}
			}

			$data = array(
				'posts'                    => $posts_translate,
				'CreateTranslatePostNonce' => wp_create_nonce( 'lmat_create_translate_post_nonce' ),
			);
			if ( ! $post_meta_sync ) {
				$data['allowedMetaFields'] = json_encode( $allowed_meta_fields );
			}

			if ( $gutenberg_block ) {
				$block_parse_rules       = Supported_Blocks::get_instance()->block_parsing_rules();
				$data['blockParseRules'] = json_encode( $block_parse_rules );
			}

			if ( count( $posts_translate ) > 0 ) {
				wp_send_json_success( $data );
			} else {
				wp_send_json_error( 'No posts to translate' );
			}
		}

		/**
		 * Create a translated copy of a post (capabilities verified in permission_callback).
		 *
		 * @param WP_REST_Request $request Request.
		 * @return \WP_REST_Response|WP_Error
		 */
		public function linguator_create_translate_post( WP_REST_Request $request ) {
			$params = $request->get_params();

			if ( empty( $params['source_language'] ) ) {
				return new WP_Error( 'invalid_source_language', __( 'Invalid source language', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
			}
			if ( ! isset( $params['post_id'] ) || ! isset( $params['target_language'] ) || ( ! isset( $params['post_title'] ) && ! isset( $params['post_content'] ) ) ) {
				return new WP_Error( 'invalid_request', __( 'Invalid request', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
			}
			if ( empty( $params['target_language'] ) ) {
				return new WP_Error( 'invalid_target_language', __( 'Invalid target language', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
			}
			if ( empty( $params['privateKey'] ) || ! wp_verify_nonce( $params['privateKey'], 'lmat_create_translate_post_nonce' ) ) {
				return new WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}
			if ( empty( $params['post_title'] ) && empty( $params['post_content'] ) ) {
				return new WP_Error( 'empty_content', __( 'Invalid request content & title empty', 'linguator-multilingual-ai-translation' ), array( 'status' => 400 ) );
			}

			$source_post_id   = absint( $params['post_id'] );
			$target_language  = sanitize_text_field( $params['target_language'] );
			$editor_type      = isset( $params['editor_type'] ) ? sanitize_text_field( $params['editor_type'] ) : '';
			$source_language  = sanitize_text_field( $params['source_language'] );
			$title            = isset( $params['post_title'] ) ? sanitize_text_field( $params['post_title'] ) : '';
			$slug             = isset( $params['post_name'] ) && ! empty( $params['post_name'] ) ? sanitize_text_field( $params['post_name'] ) : false;
			$excerpt          = isset( $params['post_excerpt'] ) ? sanitize_text_field( $params['post_excerpt'] ) : '';
			$content          = isset( $params['post_content'] ) ? $params['post_content'] : '';

			$slug_translation_option = 'title_translate';

			if ( property_exists( LMAT(), 'options' ) && isset( LMAT()->options['ai_translation_configuration']['slug_translation_option'] ) ) {
				$slug_translation_option = LMAT()->options['ai_translation_configuration']['slug_translation_option'];
			}

			$meta_fields = isset( $params['post_meta_fields'] ) ? $params['post_meta_fields'] : '';

			$post_data = array(
				'post_title'   => sanitize_text_field( $title ),
				'post_content' => $content,
			);

			if ( $excerpt && ! empty( $excerpt ) ) {
				$post_data['post_excerpt'] = sanitize_text_field( $excerpt );
			}

			if ( $meta_fields && ! empty( $meta_fields ) ) {
				$decoded_meta_fields = json_decode( $meta_fields, true );
				if ( null === $decoded_meta_fields && json_last_error() !== JSON_ERROR_NONE ) {
					return new WP_Error(
						'invalid_post_meta_fields',
						__( 'Invalid post_meta_fields JSON payload.', 'linguator-multilingual-ai-translation' ),
						array( 'status' => 400 )
					);
				}
				$post_data['post_meta_fields'] = $decoded_meta_fields;
			}

			if ( $slug_translation_option === 'slug_translate' && $slug && ! empty( $slug ) ) {
				$post_data['post_name'] = sanitize_title( $slug );
			} elseif ( $slug_translation_option === 'slug_keep' ) {
				$post_data['post_name'] = sanitize_text_field( get_post_field( 'post_name', $source_post_id ) );
			} else {
				$post_data['post_name'] = sanitize_title( $title );
			}

			if ( 'elementor' === $editor_type ) {
				$post_data['meta_fields'] = array();
				$post_data['meta_fields']['_elementor_data'] = $content;
				unset( $post_data['post_content'] );
			} elseif ( 'block' === $editor_type  ) {
				$decoded_blocks = json_decode( $post_data['post_content'], true );
				if ( null === $decoded_blocks && json_last_error() !== JSON_ERROR_NONE ) {
					return new WP_Error(
						'invalid_block_content',
						__( 'Invalid block post_content JSON payload.', 'linguator-multilingual-ai-translation' ),
						array( 'status' => 400 )
					);
				}
				if ( ! is_array( $decoded_blocks ) ) {
					return new WP_Error(
						'invalid_block_content_type',
						__( 'Block post_content must decode to an array.', 'linguator-multilingual-ai-translation' ),
						array( 'status' => 400 )
					);
				}
				$post_data['post_content'] = serialize_blocks( $decoded_blocks );
			}  elseif ( 'classic' === $editor_type ) {
				// Classic editor content is plain HTML, not JSON.
				// Some clients may still send JSON-encoded strings; tolerate that without failing the request.
				$raw_classic = isset( $params['post_content'] ) ? (string) $params['post_content'] : '';
				$decoded     = json_decode( $raw_classic, true );
				if ( JSON_ERROR_NONE === json_last_error() && is_string( $decoded ) ) {
					$post_data['post_content'] = wp_kses_post( $decoded );
				} else {
					// Use already-sanitized `post_content` from args sanitizer.
					$post_data['post_content'] = isset( $post_data['post_content'] ) ? (string) $post_data['post_content'] : '';
				}
			}

			global $linguator;
			$post_clone   = new \Linguator_Sync_Post_Model( $linguator );
			try {
				$new_post_id = $post_clone->copy_post( $source_post_id, $source_language, $target_language, false, $post_data, $editor_type );
			} catch ( \Throwable $e ) {
				return new WP_Error(
					'create_failed_exception',
					// Avoid exposing too much, but keep message for debugging.
					__( 'Failed to create the translated post.', 'linguator-multilingual-ai-translation' ),
					array( 'status' => 500 )
				);
			}

			if ( ! $new_post_id ) {
				return new WP_Error(
					'create_failed',
					sprintf(
						/* translators: 1: source post ID, 2: language slug */
						__( 'Unable to create the translated post for parent post ID %1$s in %2$s.', 'linguator-multilingual-ai-translation' ),
						(string) $source_post_id,
						$target_language
					),
					array( 'status' => 500 )
				);
			}

			$post_link      = html_entity_decode( get_the_permalink( $new_post_id ) );
			$post_title_out = html_entity_decode( get_the_title( $new_post_id ) );
			$post_edit_link = html_entity_decode( get_edit_post_link( $new_post_id ) );

			return rest_ensure_response(
				array(
					'post_id'                     => $new_post_id,
					'target_language'             => $target_language,
					'post_link'                   => $post_link,
					'post_title'                  => $post_title_out,
					'post_edit_link'              => $post_edit_link,
					'update_translate_data_nonce' => wp_create_nonce( 'lmat_update_translate_data_nonce' ),
				)
			);
		}

		public function bulk_translate_taxonomy_entries( $params ) {
			if ( ! isset( $params['taxonomy'] ) || empty( $params['taxonomy'] ) ) {
				wp_send_json_error( 'Invalid taxonomy' );
			}
			if ( ! isset( $params['lang'] ) || empty( $params['lang'] ) ) {
				wp_send_json_error( 'Invalid language' );
			}
			if ( ! isset( $params['privateKey'] ) || empty( $params['privateKey'] ) ) {
				wp_send_json_error( 'Invalid private key' );
			}
			if ( ! isset( $params['ids'] ) || empty( $params['ids'] ) ) {
				wp_send_json_error( 'Invalid ids' );
			}

			// Check if the user is logged in and has the necessary capabilities
			if ( ! is_user_logged_in() ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			if ( ! current_user_can( Capabilities::TRANSLATIONS ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			$params                  = $params->get_params();

			// Verify the nonce
			$private_key = isset( $params['privateKey'] ) ? sanitize_text_field( wp_unslash( (string) $params['privateKey'] ) ) : '';
			if ( '' === $private_key || ! wp_verify_nonce( $private_key, 'lmat_bulk_translate_entries_nonce' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			$translate_lang = json_decode( $params['lang'] );

			$taxonomy_translate = array();

			$slug_translation_option = 'title_translate';
			if(property_exists(LMAT(), 'options') && isset(LMAT()->options['ai_translation_configuration']['slug_translation_option'])){
				$slug_translation_option = LMAT()->options['ai_translation_configuration']['slug_translation_option'];
			}

			if ( $translate_lang && count( $translate_lang ) > 0 ) {
				global $linguator;
				$lmat_langs       = $linguator->model->get_languages_list();
				$lmat_langs_slugs = array_column( $lmat_langs, 'slug' );

				$taxonomy     = sanitize_text_field( $params['taxonomy'] );
				$taxonomy_ids = json_decode( $params['ids'] );

				foreach ( $taxonomy_ids as $taxonomy_id ) {
					$taxonomy_translate[ $taxonomy_id ]['sourceLanguage'] = linguator_get_term_language( $taxonomy_id );
					$taxonomy_data                                        = get_term( $taxonomy_id, $taxonomy );

					if ( ! $taxonomy_translate[ $taxonomy_id ]['sourceLanguage'] ) {
						$taxonomy_translate[ $taxonomy_id ]['sourceLanguage'] = false;
						$taxonomy_translate[ $taxonomy_id ]['title']          = $taxonomy_data->name;
						$taxonomy_translate[ $taxonomy_id ]['editor_type']    = 'taxonomy';
						$taxonomy_translate[ $taxonomy_id ]['post_link']      = html_entity_decode( get_edit_term_link( $taxonomy_data->term_id, $taxonomy_data->taxonomy ) );
						continue;
					}

					$taxonomy_translate[ $taxonomy_id ]['title'] = $taxonomy_data->name;

					if ( $slug_translation_option === 'slug_translate' ) {
						$taxonomy_translate[ $taxonomy_id ]['post_name'] = urldecode( $taxonomy_data->slug );
					}

					$taxonomy_translate[ $taxonomy_id ]['editor_type'] = 'taxonomy';

					if ( $taxonomy_data->description && ! empty( $taxonomy_data->description ) ) {
						$taxonomy_translate[ $taxonomy_id ]['content'] = $taxonomy_data->description;
					}

					foreach ( $translate_lang as $lang ) {
						if ( in_array( $lang, $lmat_langs_slugs ) ) {
							$post_translate_status = linguator_get_term( $taxonomy_id, $lang );

							if ( ! $post_translate_status ) {
								$taxonomy_translate[ $taxonomy_id ]['languages'][] = $lang;
							} else {
								$term = get_term( $post_translate_status, $taxonomy );

								$title = isset( $term->name ) ? $term->name : '';
								$slug  = get_term_link( $post_translate_status, $taxonomy );

								if ( is_wp_error( $slug ) || empty( $slug ) ) {
									$slug = '';
								}

								$taxonomy_translate[ $taxonomy_id ]['postExists'][ $lang ] = array(
									'post_title' => $title,
									'post_url'   => $slug,
								);
							}
						}
					}
				}
			}

			$data = array(
				'posts'                    => $taxonomy_translate,
				'CreateTranslatePostNonce' => wp_create_nonce( 'lmat_create_translate_taxonomy_nonce' ),
			);

			if ( count( $taxonomy_translate ) > 0 ) {
				wp_send_json_success( $data );
			} else {
				wp_send_json_error( 'No taxonomy posts to translate' );
			}
		}

		public function create_translate_taxonomy( $params ) {
			if ( ! isset( $params['term_id'] ) || empty( $params['term_id'] ) ) {
				wp_send_json_error( 'Invalid term id' );
			}
			if ( ! isset( $params['target_language'] ) || empty( $params['target_language'] ) ) {
				wp_send_json_error( 'Invalid target language' );
			}
			if ( ! isset( $params['taxonomy'] ) || empty( $params['taxonomy'] ) ) {
				wp_send_json_error( 'Invalid taxonomy' );
			}
			if ( ! isset( $params['source_language'] ) || empty( $params['source_language'] ) ) {
				wp_send_json_error( 'Invalid source language' );
			}
			$private_key = isset( $params['privateKey'] ) ? sanitize_text_field( wp_unslash( (string) $params['privateKey'] ) ) : '';
			if ( '' === $private_key || ! wp_verify_nonce( $private_key, 'lmat_create_translate_taxonomy_nonce' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			$params = $params->get_params();

			$term_id                 = intval( sanitize_text_field( $params['term_id'] ) );
			$target_language         = isset( $params['target_language'] ) ? sanitize_text_field( $params['target_language'] ) : '';
			$taxonomy                = isset( $params['taxonomy'] ) ? sanitize_text_field( $params['taxonomy'] ) : '';
			$taxonomy_name           = isset( $params['taxonomy_name'] ) ? sanitize_text_field( $params['taxonomy_name'] ) : '';
			$taxonomy_slug           = isset( $params['taxonomy_slug'] ) ? sanitize_title( $params['taxonomy_slug'] ) : '';
			$taxonomy_description    = isset( $params['taxonomy_description'] ) ? wp_kses_post( $params['taxonomy_description'] ) : '';
					$slug_translation_option = 'title_translate';
			if(property_exists(LMAT(), 'options') && isset(LMAT()->options['ai_translation_configuration']['slug_translation_option'])){
				$slug_translation_option = LMAT()->options['ai_translation_configuration']['slug_translation_option'];
			}
			if ( ! $target_language ) {
				wp_send_json_error( 'Invalid target language' );
			}
			if ( ! $taxonomy ) {
				wp_send_json_error( 'Invalid taxonomy' );
			}

			$get_term = get_term( $term_id, $taxonomy );

			$translations = new Translations();

			if ( $taxonomy_name && ! empty( $taxonomy_name ) ) {
				$entry = $this->create_translation_entry( $get_term->name, $taxonomy_name, 'name' );
				$translations->add_entry( $entry );
			}

			if ( $taxonomy_description && ! empty( $taxonomy_description ) ) {
				$entry = $this->create_translation_entry( $get_term->description, $taxonomy_description, 'description' );
				$translations->add_entry( $entry );
			}

			if ( $slug_translation_option === 'slug_translate' && $taxonomy_slug && ! empty( $taxonomy_slug ) ) {
				$taxonomy_slug = sanitize_title( $taxonomy_slug );
			} elseif ( $slug_translation_option === 'slug_keep' ) {
				$taxonomy_slug = sanitize_text_field( $get_term->slug );
			} else {
				$taxonomy_slug = sanitize_title( $taxonomy_name );
			}

			if ( $taxonomy_slug && ! empty( $taxonomy_slug ) ) {
				$entry = $this->create_translation_entry( $get_term->slug, $taxonomy_slug, 'slug' );
				$translations->add_entry( $entry );
			}

			global $linguator;

			$target_language_object = $linguator->model->get_language( $target_language );
			$term_clone             = new Translation_Term_Model( $linguator );

			$term_id = $term_clone->translate(
				array(
					'id'   => $term_id,
					'data' => $translations,
				),
				$target_language_object
			);

			if ( ! $term_id ) {
				wp_send_json_error( 'Unable to create the translated post for parent post ID ' . $term_id . ' in ' . $target_language_object . '.' );
				exit;
			}

			$term_url       = get_term_link( $term_id, $taxonomy );
			$term           = get_term( $term_id, $taxonomy );
			$term_title     = html_entity_decode( $term->name );
			$term_link      = $term_url && is_string( $term_url ) ? html_entity_decode( $term_url ) : '';
			$term_edit_link = html_entity_decode( get_edit_term_link( $term_id, $taxonomy ) );

			wp_send_json_success(
				array(
					'post_id'                     => $term_id,
					'target_language'             => $target_language,
					'post_link'                   => $term_link,
					'post_title'                  => $term_title,
					'post_edit_link'              => $term_edit_link,
					'update_translate_data_nonce' => wp_create_nonce( 'lmat_update_translate_data_nonce' ),
				)
			);
		}

		public function create_translation_entry( $singular, $translation, $context ) {
			$entry = new Translation_Entry(
				array(
					'singular'    => $singular,
					'translation' => array( $translation ),
					'context'     => $context,
				)
			);
			return $entry;
		}
	}
endif;
