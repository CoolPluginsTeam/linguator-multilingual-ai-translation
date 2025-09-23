<?php

namespace Linguator\Modules\REST\V1;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Linguator\Includes\Services\Translation\Translation_Term_Model;
use Linguator\Supported_Blocks\Supported_Blocks;
use Linguator\Custom_Fields\Custom_Fields;
use Translation_Entry;
use Translations;
use WP_Error;

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
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		}

		/**
		 * Register the routes
		 */
		public function register_routes() {
			register_rest_route(
				$this->namespace,
				'/'.$this->rest_base.'/(?P<slug>[\w-]+):bulk-translate-entries',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'bulk_translate_entries' ),
					'permission_callback' => array( $this, 'permission_only_admins' ),
					'args'                => array(
						'ids'        => array(
							'type'     => 'string',
							'required' => true,
						),
						'lang'       => array(
							'type'     => 'string',
							'required' => true,
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
				'/'.$this->rest_base.'/(?P<slug>[\w-]+):bulk-translate-taxonomy-entries',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'bulk_translate_taxonomy_entries' ),
					'permission_callback' => array( $this, 'permission_only_admins' ),
					'args'                => array(
						'taxonomy'   => array(
							'type'     => 'string',
							'required' => true,
						),
						'lang'       => array(
							'type'     => 'string',
							'required' => true,
						),
						'privateKey' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_lmat_bulk_nonce' ),
						),
						'ids'        => array(
							'type'     => 'string',
							'required' => true,
						),
					),
				)
			);

			register_rest_route(
				$this->namespace,
				'/'.$this->rest_base.'/(?P<post_id>[\w-]+):create-translate-post',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'create_translate_post' ),
					'permission_callback' => array( $this, 'permission_only_admins' ),
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
						),
						'target_language' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'editor_type'     => array(
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'source_language' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'post_title'      => array(
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'post_content'    => array(
							'type'     => 'string',
							'required' => false,
						),
					),
				)
			);

			register_rest_route(
				$this->namespace,
				'/'.$this->rest_base.'/(?P<term_id>[\w-]+):create-translate-taxonomy',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'create_translate_taxonomy' ),
					'permission_callback' => array( $this, 'permission_only_admins' ),
					'args'                => array(
						'term_id'              => array(
							'required'          => true,
							'type'              => 'integer',
							'required'          => true,
							'sanitize_callback' => 'absint',
						),
						'privateKey'           => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_lmat_create_term_nonce' ),
						),
						'target_language'      => array(
							'required'          => true,
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'source_language'      => array(
							'required'          => true,
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'taxonomy'             => array(
							'required'          => true,
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'taxonomy_name'        => array(
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'taxonomy_slug'        => array(
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'taxonomy_description' => array(
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'wp_kses_post',
						),
					),
				)
			);
		}

		public function permission_only_admins( $request ) {
			$nonce = $request->get_header( 'X-WP-Nonce' );

			if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
				return new WP_Error( 'rest_forbidden', __( 'Invalid nonce.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}

			if ( ! is_user_logged_in() ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 401 ) );
			}
			if ( ! current_user_can( 'edit_posts' ) ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
			}
			return true;
		}

		public function validate_lmat_bulk_nonce( $value, $request, $param ) {
			return wp_verify_nonce( $value, 'lmat_bulk_translate_entries_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
		}

		public function validate_lmat_create_post_nonce( $value, $request, $param ) {
			return wp_verify_nonce( $value, 'lmat_create_translate_post_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
		}

		public function validate_lmat_create_term_nonce( $value, $request, $param ) {
			return wp_verify_nonce( $value, 'lmat_create_translate_taxonomy_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'linguator-multilingual-ai-translation' ), array( 'status' => 403 ) );
		}

		public function bulk_translate_entries( $params ) {
			// Check if the user is logged in and has the necessary capabilities
			if ( ! is_user_logged_in() ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			if ( ! current_user_can( 'edit_posts' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			// Verify the nonce
			if ( ! wp_verify_nonce( $params['privateKey'], 'lmat_bulk_translate_entries_nonce' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			global $linguator;

			// check language exists or not
			$translate_lang = json_decode( $params['lang'] );

			$post_ids        = json_decode( $params['ids'] );
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

					$post_data = get_post( $postId );

					$elementor_enabled = get_post_meta( $postId, '_elementor_edit_mode', true );

					if ( ! $post_data ) {
						continue;
					}

					if ( $slug_translation_option === 'slug_translate' ) {
						$posts_translate[ $postId ]['post_name'] = urldecode( get_post_field( 'post_name', $postId ) );
					}

					$posts_translate[ $postId ]['title']          = $post_data->post_title;
					$posts_translate[ $postId ]['content']        = has_blocks( $post_data->post_content ) ? parse_blocks( $post_data->post_content ) : $post_data->post_content;
					$posts_translate[ $postId ]['content']        = has_blocks( $post_data->post_content ) ? parse_blocks( $post_data->post_content ) : $post_data->post_content;
					$posts_translate[ $postId ]['editor_type']    = has_blocks( $post_data->post_content ) ? 'block' : 'classic';
					$posts_translate[ $postId ]['sourceLanguage'] = $linguator->model->post->get_language( $postId )->slug;

					if ( isset( $post_data->post_excerpt ) && ! empty( $post_data->post_excerpt ) ) {
						$posts_translate[ $postId ]['excerpt'] = $post_data->post_excerpt;
					}

					$posts_translate[ $postId ]['sourceLanguage'] = ! isset( $posts_translate[ $postId ]['sourceLanguage'] ) ? lmat_default_language() : $posts_translate[ $postId ]['sourceLanguage'];

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

		public function create_translate_post( $params ) {
			if ( ! isset( $params['source_language'] ) || empty( $params['source_language'] ) ) {
				wp_send_json_error( 'Invalid source language' );
			}
			if ( ! isset( $params['post_id'] ) || ! isset( $params['target_language'] ) || ( ! isset( $params['post_title'] ) && ! isset( $params['post_content'] ) ) ) {
				wp_send_json_error( 'Invalid request' );
			}
			if ( ! isset( $params['target_language'] ) && empty( $params['target_language'] ) ) {
				wp_send_json_error( 'Invalid target language' );
			}
			if ( ! wp_verify_nonce( $params['privateKey'], 'lmat_create_translate_post_nonce' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			if ( empty( $params['post_title'] ) && empty( $params['post_content'] ) ) {
				wp_send_json_error( 'Invalid request content & title empty' );
			}

			$params = $params->get_params();

			$post_id         = intval( sanitize_text_field( $params['post_id'] ) );
			$target_language = sanitize_text_field( $params['target_language'] );
			$editor_type     = sanitize_text_field( $params['editor_type'] );
			$source_language = sanitize_text_field( $params['source_language'] );

			$title = isset( $params['post_title'] ) ? sanitize_text_field( $params['post_title'] ) : '';

			$slug = isset( $params['post_name'] ) && ! empty( $params['post_name'] ) ? sanitize_text_field( $params['post_name'] ) : false;

			$excerpt = isset( $params['post_excerpt'] ) ? sanitize_text_field( $params['post_excerpt'] ) : '';

			$content = isset( $params['post_content'] ) ? $params['post_content'] : '';

			$slug_translation_option = 'title_translate';

			if(property_exists(LMAT(), 'options') && isset(LMAT()->options['ai_translation_configuration']['slug_translation_option'])){
				$slug_translation_option = LMAT()->options['ai_translation_configuration']['slug_translation_option'];
			}

			$meta_fields = isset( $params['post_meta_fields'] ) ? $params['post_meta_fields'] : '';

			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			$post_data = array(
				'post_title'   => sanitize_text_field( $title ),
				'post_content' => $editor_type === 'block' ? $content : wp_kses_post( $content ),
			);

			if ( $excerpt && ! empty( $excerpt ) ) {
				$post_data['post_excerpt'] = sanitize_text_field( $excerpt );
			}

			if ( $meta_fields && ! empty( $meta_fields ) ) {
				$post_data['post_meta_fields'] = json_decode( $meta_fields, true );
			}

			if ( $slug_translation_option === 'slug_translate' && $slug && ! empty( $slug ) ) {
				$post_data['post_name'] = sanitize_title( $slug );
			} elseif ( $slug_translation_option === 'slug_keep' ) {
				$post_data['post_name'] = sanitize_text_field( get_post_field( 'post_name', $post_id ) );
			} else {
				$post_data['post_name'] = sanitize_title( $title );
			}

			if ( $editor_type === 'elementor' ) {
				$post_data['meta_fields']['_elementor_data'] = $content;

				unset( $post_data['post_content'] );
			}

			if ( $editor_type === 'block' ) {
				$post_data['post_content'] = serialize_blocks( json_decode( $post_data['post_content'], true ) );

				$post_data['post_content'] = wp_kses_post( $post_data['post_content'] );
			}

			if ( $editor_type === 'classic' ) {
				$post_data['post_content'] = json_decode( $post_data['post_content'], true );
			}

			global $linguator;
			$post_clone = new \LMAT_Sync_Post_Model( $linguator );
			$post_id    = $post_clone->copy_post( $post_id, $source_language, $target_language, false, $post_data, $editor_type );

			if ( ! $post_id ) {
				wp_send_json_error( 'Unable to create the translated post for parent post ID ' . $post_id . ' in ' . $target_language . '.' );
			} else {

				$post_link      = html_entity_decode( get_the_permalink( $post_id ) );
				$post_title     = html_entity_decode( get_the_title( $post_id ) );
				$post_edit_link = html_entity_decode( get_edit_post_link( $post_id ) );

				wp_send_json_success(
					array(
						'post_id'                     => $post_id,
						'target_language'             => $target_language,
						'post_link'                   => $post_link,
						'post_title'                  => $post_title,
						'post_edit_link'              => $post_edit_link,
						'update_translate_data_nonce' => wp_create_nonce( 'lmat_update_translate_data_nonce' ),
					)
				);
			}
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
			if ( ! current_user_can( 'edit_posts' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			$params                  = $params->get_params();

			// Verify the nonce
			if ( ! wp_verify_nonce( $params['privateKey'], 'lmat_bulk_translate_entries_nonce' ) ) {
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
					$taxonomy_data = get_term( $taxonomy_id, $taxonomy );

					$taxonomy_translate[ $taxonomy_id ]['title'] = $taxonomy_data->name;

					if ( $slug_translation_option === 'slug_translate' ) {
						$taxonomy_translate[ $taxonomy_id ]['post_name'] = urldecode( $taxonomy_data->slug );
					}

					$taxonomy_translate[ $taxonomy_id ]['editor_type']    = 'taxonomy';
					$taxonomy_translate[ $taxonomy_id ]['sourceLanguage'] = lmat_get_term_language( $taxonomy_id );

					if ( $taxonomy_data->description && ! empty( $taxonomy_data->description ) ) {
						$taxonomy_translate[ $taxonomy_id ]['content'] = $taxonomy_data->description;
					}

					foreach ( $translate_lang as $lang ) {
						if ( in_array( $lang, $lmat_langs_slugs ) ) {
							$post_translate_status = lmat_get_term( $taxonomy_id, $lang );

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
			if ( ! wp_verify_nonce( $params['privateKey'], 'lmat_create_translate_taxonomy_nonce' ) ) {
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
			$post_clone             = new Translation_Term_Model( $linguator );

			$term_id = $post_clone->translate(
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
