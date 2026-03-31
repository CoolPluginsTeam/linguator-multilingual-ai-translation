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
					(string) $e->getMessage(),
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
