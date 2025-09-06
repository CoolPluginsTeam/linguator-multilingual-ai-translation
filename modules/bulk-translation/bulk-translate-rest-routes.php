<?php
namespace Linguator\modules\Bulk_Translation;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Linguator\modules\Page_Translation\LMAT_Page_Translation_Helper;

if ( ! class_exists( 'LMAT_Bulk_Translate_Rest_Routes' ) ) :
	/**
	 * LMAT_Bulk_Translate_Rest_Routes
	 *
	 * @package Linguator\modules\Bulk_Translation
	 */
	class LMAT_Bulk_Translate_Rest_Routes {


		/**
		 * The base name of the route.
		 *
		 * @var string
		 */
		private $base_name;

		/**
		 * Constructor
		 *
		 * @param string $base_name The base name of the route.
		 */
		public function __construct( $base_name ) {
			$this->base_name = $base_name;
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		}

		/**
		 * Register the routes
		 */
		public function register_routes() {
			register_rest_route(
				$this->base_name,
				'/(?P<slug>[\w-]+):bulk-translate-entries',
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
				$this->base_name,
				'/(?P<post_id>[\w-]+):create-translate-post',
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
		}

		public function permission_only_admins( $request ) {

			$nonce = $request->get_header( 'X-WP-Nonce' );

			if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
				return new WP_Error( 'rest_forbidden', __( 'Invalid nonce.', 'autopoly-ai-translation-for-polylang-pro' ), array( 'status' => 403 ) );
			}

			if ( ! is_user_logged_in() ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'autopoly-ai-translation-for-polylang-pro' ), array( 'status' => 401 ) );
			}
			if ( ! current_user_can( 'manage_options' ) ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'autopoly-ai-translation-for-polylang-pro' ), array( 'status' => 403 ) );
			}
			return true;
		}

		public function validate_lmat_bulk_nonce( $value, $request, $param ) {
			return wp_verify_nonce( $value, 'lmat_bulk_translate_entries_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'autopoly-ai-translation-for-polylang-pro' ), array( 'status' => 403 ) );
		}

		public function validate_lmat_create_post_nonce( $value, $request, $param ) {
			return wp_verify_nonce( $value, 'lmat_create_translate_post_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'autopoly-ai-translation-for-polylang-pro' ), array( 'status' => 403 ) );
		}

		public function validate_bulk_entries_callback( $params ) {
			if ( ! is_user_logged_in() ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			if ( ! wp_verify_nonce( $params['privateKey'], 'lmat_bulk_translate_entries_nonce' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			return true;
		}

		public function validate_create_translate_post_callback( $params ) {
			if ( ! is_user_logged_in() ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			if ( ! wp_verify_nonce( $params['privateKey'], 'lmat_create_translate_post_nonce' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			return true;
		}

		public function bulk_translate_entries( $params ) {
			// Check if the user is logged in and has the necessary capabilities
			if ( ! is_user_logged_in() ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			// Verify the nonce
			if ( ! wp_verify_nonce( $params['privateKey'], 'lmat_bulk_translate_entries_nonce' ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			// check language exists or not
			$translate_lang = json_decode( $params['lang'] );

			$post_ids        = json_decode( $params['ids'] );
			$posts_translate = array();
			$gutenberg_block = false;
			if ( count( $translate_lang ) > 0 && ! ( count( $post_ids ) < 1 ) ) {
				global $linguator;
				$lmat_langs       = $linguator->model->get_languages_list();
				$lmat_langs_slugs = array_column( $lmat_langs, 'slug' );
				foreach ( $post_ids as $postId ) {

					if ( ! current_user_can( 'edit_post', $postId ) ) {
						continue;
					}

					$post_data = get_post( $postId );

					$elementor_enabled = get_post_meta( $postId, '_elementor_edit_mode', true );

					if ( ! $post_data ) {
						continue;
					}

					$posts_translate[ $postId ]['title']          = $post_data->post_title;
					$posts_translate[ $postId ]['content']        = has_blocks( $post_data->post_content ) ? parse_blocks( $post_data->post_content ) : $post_data->post_content;
					$posts_translate[ $postId ]['content']        = has_blocks( $post_data->post_content ) ? parse_blocks( $post_data->post_content ) : $post_data->post_content;
					$posts_translate[ $postId ]['editor_type']    = has_blocks( $post_data->post_content ) ? 'block' : 'classic';
					$posts_translate[ $postId ]['sourceLanguage'] = $linguator->model->post->get_language( $postId )->slug;

					$posts_translate[ $postId ]['sourceLanguage'] = ! isset( $posts_translate[ $postId ]['sourceLanguage'] ) ? lmat_default_language() : $posts_translate[ $postId ]['sourceLanguage'];
					$posts_translate[ $postId ]['metaFields']     = get_post_meta( $postId );
					$posts_translate[ $postId ]['post_link']      = get_the_permalink( $postId );

					if ( $elementor_enabled && 'builder' === $elementor_enabled && defined( 'ELEMENTOR_VERSION' ) ) {
						$elementor_data = get_post_meta( $postId, '_elementor_data', true );

						if ( $elementor_data && '' !== $elementor_data ) {
							$posts_translate[ $postId ]['editor_type'] = 'elementor';
							$elementor_data                            = array();

							if ( class_exists( '\Elementor\Plugin' ) && property_exists( '\Elementor\Plugin', 'instance' ) ) {
								$elementor_data = \Elementor\Plugin::$instance->documents->get( $postId )->get_elements_data();
							}

							$posts_translate[ $postId ]['metaFields']['_elementor_data'] = $elementor_data;

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

			if ( $gutenberg_block ) {
				$block_parse_rules       = LMAT_Page_Translation_Helper::get_instance()->block_parsing_rules();
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

			$content = isset( $params['post_content'] ) ? $params['post_content'] : '';

			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				wp_send_json_error( 'You are not authorized to perform this action.' );
			}

			$post_data = array(
				'post_title'   => $title,
				'post_content' => $content,
			);

			if ( $editor_type === 'elementor' ) {
				$post_data['meta_fields']['_elementor_data'] = $content;

				unset( $post_data['post_content'] );
			}

			if ( $editor_type === 'block' ) {
				$post_data['post_content'] = serialize_blocks( json_decode( $post_data['post_content'], true ) );
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
	}
endif;
