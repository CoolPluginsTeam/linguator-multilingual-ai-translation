<?php
namespace Linguator\modules\Bulk_Translation;

use Linguator\modules\Page_Translation\LMAT_Page_Translation_Helper;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'LMAT_Bulk_Translate_Rest_Routes' ) ) :

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
					'args'                => array(
						'ids'  => array(
							'type'     => 'string',
							'required' => true,
						),
						'lang' => array(
							'type'     => 'string',
							'required' => true,
						),
					),
					'callback'            => array( $this, 'bulk_translate_entries' ),
					'validate_callback'   => array( $this, 'validate_bulk_entries_callback' ),
					'permission_callback' => array( $this, 'validate_bulk_translate_permission_callback' ),
				)
			);

			register_rest_route(
				$this->base_name,
				'/(?P<post_id>[\w-]+):create-translate-post',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'create_translate_post' ),
					'validate_callback'   => array( $this, 'validate_create_translate_post_callback' ),
					'permission_callback' => array( $this, 'validate_bulk_translate_permission_callback' ),
				)
			);
		}

        public function validate_bulk_translate_permission_callback($params){
            if(!is_user_logged_in()) wp_send_json_error('You are not authorized to perform this action.');
            if(!current_user_can('manage_options')) wp_send_json_error('You are not authorized to perform this action.');
            if(!current_user_can('edit_posts')) wp_send_json_error('You are not authorized to perform this action.');
            return true;
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

					if ( $elementor_enabled && 'builder' === $elementor_enabled ) {
						$elementor_data = get_post_meta( $postId, '_elementor_data', true );

						if ( $elementor_data && '' !== $elementor_data ) {
							$posts_translate[ $postId ]['editor_type'] = 'elementor';
							$elementor_data                            = is_serialized( $elementor_data ) ? unserialize( $elementor_data ) : ( is_string( $elementor_data ) ? json_decode( $elementor_data ) : $elementor_data );

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
