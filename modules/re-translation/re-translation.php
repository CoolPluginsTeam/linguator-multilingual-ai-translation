<?php

namespace Linguator\Modules\Re_Translation;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Linguator\Custom_Fields\Custom_Fields;
use WP_Post;


if ( ! class_exists( 'LMAT_Re_Translation' ) ) {

	/**
	 * LMAT_Re_Translation class
	 *
	 * @package Linguator
	 * @since 1.0.3
	 */
	class LMAT_Re_Translation {

		/**
		 * Current post id
		 *
		 * @var int|null
		 */
		private static $current_post_id;

		/**
		 * Previous post_title
		 *
		 * @var string|null
		 */
		private static $previous_post_title;

		/**
		 * Previous post_content
		 *
		 * @var string|null
		 */
		private static $previous_post_content;

		/**
		 * Previous post_excerpt
		 *
		 * @var string|null
		 */
		private static $previous_post_excerpt;

		/**
		 * Previous post_meta_fields (hashes)
		 *
		 * @var array|null
		 */
		private static $previous_post_meta_fields;

		/**
		 * Previous post editor type
		 *
		 * @var string|null
		 */
		private static $previous_post_editor_type = '';

		/**
		 * Target posts ids
		 *
		 * @var array|null
		 */
		private static $target_posts_ids;

		/**
		 * Constructor
		 *
		 * @return void
		 */
		public function __construct() {
			add_action( 'post_updated', array( $this, 'lmat_re_translation' ), 10, 3 );
			add_action( 'elementor/document/before_save', array( $this, 'lmat_elementor_re_translation' ), 10, 2 );
		}

		/**
		 * Re-translation of the post
		 *
		 * @param int     $post_id
		 * @param WP_Post $post_after
		 * @param WP_Post $post_before
		 * @return void
		 */
		public function lmat_re_translation( $post_id, $post_after, $post_before ) {

			if ( false === $this->lmat_check_retranslation_request() ) {
				return;
			}

			if ( isset( $post_before->post_title ) && empty( $post_before->post_title ) && isset( $post_before->post_content ) && empty( $post_before->post_content ) && isset( $post_before->post_status ) && 'auto-draft' === $post_before->post_status ) {
				return;
			}

			$translation_publish_status = get_post_meta( $post_id, '_lmat_translation_publish_status', true );

			if ( 'true' === $translation_publish_status ) {
				delete_post_meta( $post_id, '_lmat_translation_publish_status' );
				return;
			}

			self::reset_re_translation_properties();

			self::$current_post_id = (int) $post_id;

			if ( self::$current_post_id && $post_before && $post_before instanceof WP_Post && function_exists( 'lmat_get_post_translations' ) ) {

				self::$previous_post_editor_type = $this->get_editor_type( self::$current_post_id );

				self::$target_posts_ids = $this->lmat_get_unique_post_ids();

				if ( empty( self::$target_posts_ids ) || ! is_array( self::$target_posts_ids ) ) {
					self::reset_re_translation_properties();
					return;
				}

				$this->previous_content( self::$previous_post_editor_type, $post_before, self::$current_post_id );

				$this->lmat_save_re_translation_data();
			}

			self::reset_re_translation_properties();
		}

		/**
		 * Re-translation of the Elementor post
		 *
		 * @param \Elementor\Core\Base\Document $document
		 * @param array                         $data
		 * @return void
		 */
		public function lmat_elementor_re_translation( $document, $data ) {

			if ( false === $this->lmat_check_retranslation_request() ) {
				return;
			}

			if ( ! isset( $data ) || ! is_array( $data ) || count( $data ) === 0 ) {
				return;
			}

			self::reset_re_translation_properties();

			if ( $document && $document instanceof \Elementor\Core\DocumentTypes\Page ) {

				self::$current_post_id = (int) $document->get_id();

				if ( isset( $_REQUEST['lmat_elementor_translation_publish'] ) && 'true' === $_REQUEST['lmat_elementor_translation_publish'] ) {
					$initial_post_publish_status = get_post_meta( self::$current_post_id, '_lmat_elementor_page_publish_status', true );

					if ( '' === $initial_post_publish_status || 'true' !== $initial_post_publish_status ) {
						update_post_meta( self::$current_post_id, '_lmat_elementor_page_publish_status', 'true' );
						return;
					}
				} else {
					delete_post_meta( self::$current_post_id, '_lmat_elementor_page_publish_status' );
				}

				self::$previous_post_editor_type = 'elementor';

				self::$target_posts_ids = $this->lmat_get_unique_post_ids();

				if ( empty( self::$target_posts_ids ) || ! is_array( self::$target_posts_ids ) ) {
					self::reset_re_translation_properties();
					return;
				}

				$post_object = $document->get_post();

				if ( $post_object instanceof \WP_Post ) {
					$this->previous_content( 'elementor', $post_object, self::$current_post_id );
				}

				$this->lmat_save_re_translation_data();

				self::reset_re_translation_properties();
			}
		}

		private function previous_content( $editor_type, \WP_Post $post_object, int $post_id ) {
			self::$previous_post_title   = $post_object->post_title;
			self::$previous_post_excerpt = $post_object->post_excerpt;

			if ( 'elementor' === $editor_type ) {
				// Elementor data can be heavy; only load once when needed.
				if ( class_exists( '\Elementor\Plugin' ) && isset( \Elementor\Plugin::$instance ) ) {
					$elementor_doc = \Elementor\Plugin::$instance->documents->get( (int) $post_id );

					if ( $elementor_doc ) {
						$elementor_data              = $elementor_doc->get_elements_data();
						self::$previous_post_content = json_encode( $elementor_data );
					}
				}
			} else {
				self::$previous_post_content = $post_object->post_content;
			}
		}

		private function lmat_check_retranslation_request() {
			if ( defined( 'DOING_LMAT_BULK_POST_TRANSLATION' ) && true === DOING_LMAT_BULK_POST_TRANSLATION ) {
				return false;
			}

			if ( defined( 'DOING_LMAT_ELEMENTOR_PAGE_TRANSLATION' ) && true === DOING_LMAT_ELEMENTOR_PAGE_TRANSLATION ) {
				return false;
			}

			return true;
		}

		/**
		 * Get the translation data
		 *
		 * @return array
		 */
		public function lmat_translated_post_ids_data() {

			if ( ! isset( self::$current_post_id ) || false === self::$current_post_id ) {
				return array();
			}

			$cache_key   = 'lmat_translation_data_post_ids';
			$cache_group = 'lmat_translation_info';

			/* 1️⃣ Try object cache (fastest) */
			$data = wp_cache_get( $cache_key, $cache_group );
			if ( false !== $data ) {
				return $data;
			}

			/* 2️⃣ Fallback to transient (persistent) */
			$data = get_transient( $cache_key );

			if ( false !== $data ) {
				// Re-prime object cache for this request
				wp_cache_set( $cache_key, $data, $cache_group, DAY_IN_SECONDS );
				return $data;
			}

			/* 3️⃣ Build fresh data */
			$translation_data = get_option( 'cpt_dashboard_data', array() );
			$lmat_data        = $translation_data['lmat'] ?? array();

			if ( empty( $lmat_data ) ) {
				return array();
			}

			$post_ids = array_map(
				'intval',
				array_column( $lmat_data, 'post_id' )
			);

			$data = array_keys( array_flip( $post_ids ) );

			/* 4️⃣ Store in both caches */
			wp_cache_set( $cache_key, array_values( $data ), $cache_group, DAY_IN_SECONDS );
			set_transient( $cache_key, array_values( $data ), DAY_IN_SECONDS );

			return $data;
		}

		private function lmat_get_unique_post_ids() {
			$translated_post_ids = $this->lmat_translated_post_ids_data();

			$current_post_id = absint( self::$current_post_id );

			if ( empty( $translated_post_ids ) || ! is_array( $translated_post_ids ) ) {
				return array();
			}

			$translated_post_ids = array_values( $translated_post_ids );

			if ( function_exists( 'lmat_get_post_translations' ) ) {
				$all_post_ids = lmat_get_post_translations( $current_post_id );
				$all_post_ids = is_array( $all_post_ids ) ? array_values( $all_post_ids ) : array();
			} else {
				return array();
			}

			foreach ( $all_post_ids as $target_post_id ) {
				if ( in_array( $target_post_id, $translated_post_ids ) ) {
					$unique_post_ids[] = (int) $target_post_id;
				}
			}

			return $unique_post_ids;
		}

		/**
		 * Get the updated post metas
		 *
		 * @param int $current_post_id
		 * @param int $update_post_id
		 * @return array
		 */
		public static function get_updated_post_metas( int $current_post_id, int $update_post_id ) {

			$data            = array();
			$allowed_meta    = Custom_Fields::get_allowed_custom_fields('post');
			$old_meta_fields = get_post_meta( $current_post_id, '_lmat_updated_post_inital_custom_fields', true );
			$old_meta_fields = is_array( $old_meta_fields ) ? $old_meta_fields : array();
			$update_post_id  = absint( $update_post_id );

			if ( empty( $allowed_meta ) || ! is_array( $allowed_meta ) ) {
				return $data;
			}

			foreach ( $allowed_meta as $key => $settings ) {

				if ( ! isset( $settings['status'] ) || true !== $settings['status'] ) {
					continue;
				}

				// Fetch only specific meta, avoid loading everything.
				$current_meta_value = get_post_meta( $update_post_id, $key, true );

				if ( '' === $current_meta_value || null === $current_meta_value ) {
					// If we never tracked this key before and value is empty, skip it.
					if ( ! isset( $old_meta_fields[ $key ] ) ) {
						continue;
					}
				}

				// Build hash for comparison.
				$hash_source = is_array( $current_meta_value ) ? maybe_serialize( $current_meta_value ) : $current_meta_value;
				$value_hash  = md5( sanitize_text_field( $hash_source ) );

				// If hash is same as stored one, nothing changed.
				if ( isset( $old_meta_fields[ $key ] ) && $old_meta_fields[ $key ] === $value_hash ) {
					continue;
				}

				// Prepare cleaned value to return.
				$value = maybe_unserialize( $current_meta_value );

				// If no previous hash stored and new value is effectively empty, skip.
				if ( ! isset( $old_meta_fields[ $key ] ) && empty( $value ) ) {
					continue;
				}

				$data[ $key ] = $value;
			}

			return $data;
		}

		/**
		 * Build hashes for allowed meta fields of a post.
		 * This avoids loading all post meta in memory.
		 *
		 * @param int $post_id
		 * @return array
		 */
		private static function build_allowed_meta_hashes( int $post_id ) {

			$post_id      = absint( $post_id );
			$allowed_meta = Custom_Fields::get_allowed_custom_fields('post');
			$meta_hashes  = array();

			if ( empty( $allowed_meta ) || ! is_array( $allowed_meta ) ) {
				return $meta_hashes;
			}

			foreach ( $allowed_meta as $key => $settings ) {

				if ( ! isset( $settings['status'] ) || true !== $settings['status'] ) {
					continue;
				}

				$current_meta_value = get_post_meta( $post_id, $key, true );

				if ( '' === $current_meta_value || null === $current_meta_value ) {
					continue;
				}

				$hash_source                                = is_array( $current_meta_value ) ? maybe_serialize( $current_meta_value ) : $current_meta_value;
				$meta_hashes[ sanitize_text_field( $key ) ] = md5( sanitize_text_field( $hash_source ) );
			}

			return $meta_hashes;
		}

		/**
		 * Update the post metas hashes snapshot
		 *
		 * @return void
		 */
		private function lmat_updated_post_metas() {

			if ( empty( self::$current_post_id ) ) {
				return;
			}

			// If there are no target posts, no need to build meta snapshot.
			if ( empty( self::$target_posts_ids ) || ! is_array( self::$target_posts_ids ) ) {
				return;
			}

			$current_post_id                 = absint( self::$current_post_id );
			self::$previous_post_meta_fields = self::build_allowed_meta_hashes( $current_post_id );
		}

		/**
		 * Save the re-translation data
		 *
		 * @return void
		 */
		private function lmat_save_re_translation_data() {

			if ( ! self::$current_post_id ) {
				return;
			}

			if ( ! isset( self::$target_posts_ids ) || ! is_array( self::$target_posts_ids ) || count( self::$target_posts_ids ) === 0 ) {
				return;
			}

			$meta_fields_status = false;

			$current_post_id = absint( self::$current_post_id );

			self::delete_re_translation_data( $current_post_id );

			foreach ( self::$target_posts_ids as $target_post_id ) {

				$target_post_id = (int) $target_post_id;

				if ( $target_post_id === $current_post_id ) {
					continue;
				}

				$old_updated_post_id     = (int) get_post_meta( $target_post_id, '_lmat_updated_post_id', true );
				$target_post_editor_type = $this->get_editor_type( $target_post_id );

				if ( $target_post_editor_type !== self::$previous_post_editor_type ) {
					continue;
				}

				if ( $old_updated_post_id && ! empty( $old_updated_post_id ) && ( self::$current_post_id != $old_updated_post_id ) ) {
					// Check if the post data saved and there is no different in the post data then delete the post data
					$retranslation_status = self::retranslation_status( $target_post_id );

					if ( isset( $retranslation_status['re_translation_status'] ) && false === $retranslation_status['re_translation_status'] ) {
						$old_updated_post_id = false;
					}
				}

				if ( $old_updated_post_id && ! empty( $old_updated_post_id ) ) {

					$parent_post_data             = get_post( $old_updated_post_id );
					$old_updated_post_editor_type = get_post_meta( $target_post_id, '_lmat_updated_post_inital_editor_type', true );

					if ( ! isset( $parent_post_data ) ) {
						$old_updated_post_id = false;
					}

					if ( $old_updated_post_editor_type !== $target_post_editor_type && self::$previous_post_editor_type !== $old_updated_post_editor_type ) {
						$old_updated_post_id = false;
					}
				}

				if ( ! $old_updated_post_id ) {

					self::delete_re_translation_data( $target_post_id );

					if ( false === $meta_fields_status ) {
						$this->lmat_updated_post_metas();
						$meta_fields_status = true;
					}

					update_post_meta( $target_post_id, '_lmat_updated_post_id', $current_post_id );

					if ( isset( self::$previous_post_title ) ) {
						update_post_meta(
							$target_post_id,
							'_lmat_updated_post_inital_title',
							md5( sanitize_text_field( self::$previous_post_title ) )
						);
					}

					if ( isset( self::$previous_post_content ) ) {
						update_post_meta(
							$target_post_id,
							'_lmat_updated_post_inital_content',
							md5( wp_kses_post( self::$previous_post_content ) )
						);
					}

					if ( isset( self::$previous_post_excerpt ) ) {
						update_post_meta(
							$target_post_id,
							'_lmat_updated_post_inital_excerpt',
							md5( wp_kses_post( self::$previous_post_excerpt ) )
						);
					}

					if ( isset( self::$previous_post_meta_fields ) && is_array( self::$previous_post_meta_fields ) ) {
						update_post_meta(
							$target_post_id,
							'_lmat_updated_post_inital_custom_fields',
							self::$previous_post_meta_fields
						);
					}

					if ( isset( self::$previous_post_editor_type ) && ! empty( self::$previous_post_editor_type ) ) {
						update_post_meta(
							$target_post_id,
							'_lmat_updated_post_inital_editor_type',
							sanitize_text_field( self::$previous_post_editor_type )
						);
					}
				}
			}
		}

		/**
		 * Get the retranslation status
		 *
		 * @param int $post_id
		 * @return array|false
		 */
		public static function retranslation_status( $post_id ) {

			if ( ! isset( $post_id ) || ! is_numeric( $post_id ) || empty( $post_id ) ) {
				return false;
			}

			$post_id         = absint( $post_id );
			$updated_post_id = get_post_meta( $post_id, '_lmat_updated_post_id', true );

			if ( ! isset( $updated_post_id ) || empty( $updated_post_id ) || ! $updated_post_id ) {
				return false;
			}

			$updated_post_id = absint( $updated_post_id );

			$data = array(
				'parent_post_id'          => 0,
				're_translation_status'   => false,
				're_translate_title'      => false,
				're_translate_excerpt'    => false,
				're_translate_content'    => false,
				're_translate_metaFields' => false,
			);

			$parent_post_data = get_post( $updated_post_id );

			if ( ! $parent_post_data instanceof \WP_Post ) {
				return $data;
			}

			// This call is kept for side-effect: it populates self::$previous_post_meta_fields.
			self::is_custom_fields_updated( $updated_post_id, get_post_meta( $updated_post_id ) );

			$parent_post_initial_title         = get_post_meta( $post_id, '_lmat_updated_post_inital_title', true );
			$parent_post_initial_content       = get_post_meta( $post_id, '_lmat_updated_post_inital_content', true );
			$parent_post_initial_excerpt       = get_post_meta( $post_id, '_lmat_updated_post_inital_excerpt', true );
			$parent_post_initial_custom_fields = get_post_meta( $post_id, '_lmat_updated_post_inital_custom_fields', true );
			$parent_post_initial_custom_fields = is_array( $parent_post_initial_custom_fields ) ? $parent_post_initial_custom_fields : array();
			$parent_post_initial_editor_type   = get_post_meta( $post_id, '_lmat_updated_post_inital_editor_type', true );

			$parent_post_title   = md5( sanitize_text_field( $parent_post_data->post_title ) );
			$parent_post_content = md5( wp_kses_post( $parent_post_data->post_content ) );
			$parent_post_excerpt = md5( wp_kses_post( $parent_post_data->post_excerpt ) );

			$parent_post_custom_fields = is_array( self::$previous_post_meta_fields ) ? self::$previous_post_meta_fields : array();

			// Elementor editor type – re-calc content hash from Elementor data.
			if ( 'elementor' === $parent_post_initial_editor_type ) {

				if ( ! class_exists( '\Elementor\Plugin' ) || ! property_exists( '\Elementor\Plugin', 'instance' ) ) {
					return $data;
				}

				$elementor_doc = \Elementor\Plugin::$instance->documents->get( $updated_post_id );

				if ( $elementor_doc ) {
					$elementor_data = $elementor_doc->get_elements_data();

					$parent_post_content = md5( wp_kses_post( json_encode( $elementor_data ) ) );
				}
			}

			if ( $parent_post_initial_title !== $parent_post_title ) {
				$data['re_translation_status'] = true;
				$data['re_translate_title']    = true;
			}

			if ( $parent_post_initial_excerpt !== $parent_post_excerpt ) {
				$data['re_translation_status'] = true;
				$data['re_translate_excerpt']  = true;
			}

			if ( $parent_post_initial_content !== $parent_post_content ) {
				$data['re_translation_status'] = true;
				$data['re_translate_content']  = true;
			}

			if ( $parent_post_initial_custom_fields !== $parent_post_custom_fields ) {
				$data['re_translation_status']   = true;
				$data['re_translate_metaFields'] = true;
			}

			if ( true === $data['re_translation_status'] ) {
				$data['parent_post_id'] = $updated_post_id;
			}

			if ( ! isset( $data['re_translation_status'] ) || false === $data['re_translation_status'] ) {
				self::delete_re_translation_data( $post_id );
			}

			return $data;
		}

		/**
		 * Check if the custom fields are updated
		 *
		 * @param int   $post_id
		 * @param array $old_custom_fields_updated
		 * @return bool
		 */
		private static function is_custom_fields_updated( $post_id, $old_custom_fields_updated ) {

			$old_custom_fields_updated       = is_array( $old_custom_fields_updated ) ? $old_custom_fields_updated : array();
			self::$previous_post_meta_fields = self::build_allowed_meta_hashes( absint( $post_id ) );

			if ( $old_custom_fields_updated !== self::$previous_post_meta_fields ) {
				return true;
			}

			return false;
		}

		/**
		 * Reset the properties
		 *
		 * @return void
		 */
		private static function reset_re_translation_properties() {

			self::$current_post_id           = null;
			self::$previous_post_title       = null;
			self::$previous_post_content     = null;
			self::$previous_post_excerpt     = null;
			self::$previous_post_meta_fields = null;
			self::$target_posts_ids          = null;
			self::$previous_post_editor_type = '';
		}

		/**
		 * Delete the re-translation data
		 *
		 * @param int $post_id
		 * @return bool|void
		 */
		public static function delete_re_translation_data( int $post_id ) {

			if ( ! isset( $post_id ) || ! is_numeric( $post_id ) || empty( $post_id ) ) {
				return false;
			}

			$post_id = absint( $post_id );

			delete_post_meta( $post_id, '_lmat_updated_post_id' );
			delete_post_meta( $post_id, '_lmat_updated_post_inital_content' );
			delete_post_meta( $post_id, '_lmat_updated_post_inital_excerpt' );
			delete_post_meta( $post_id, '_lmat_updated_post_inital_custom_fields' );
			delete_post_meta( $post_id, '_lmat_updated_post_inital_title' );
			delete_post_meta( $post_id, '_lmat_updated_post_inital_editor_type' );
		}

		private function get_editor_type( $post_id ) {
			$editor = '';

			if ( 'builder' === get_post_meta( $post_id, '_elementor_edit_mode', true ) && defined( 'ELEMENTOR_VERSION' ) ) {
				$editor = 'elementor';
			} elseif ( 'on' === get_post_meta( $post_id, '_et_pb_use_builder', true ) && defined( 'ET_CORE' ) ) {
				$editor = 'divi';
			}

			return $editor;
		}

		/**
		 * Generate re-translation nonce
		 *
		 * @param string $value
		 * @return string
		 */
		public static function generate_retranslation_nonce( $value ) {
			return self::generate_private_key( $value );
		}

		/**
		 * Generate nonce
		 *
		 * @param string $value
		 * @return string
		 */
		private static function generate_private_key( $value ) {
			return wp_create_nonce( 'lmat-re-translation-nonce-' . $value );
		}

		/**
		 * Get re-translation fields
		 *
		 * @return array
		 */
		public static function re_translate_fields() {
			return array( 'title', 'content', 'excerpt', 'metaFields' );
		}

		/**
		 * Get re-translation saved fields
		 *
		 * @return array
		 */
		public static function re_translate_saved_fields() {
			return array( 'title', 'content', 'excerpt', 'custom_fields' );
		}
	}
}
