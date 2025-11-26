<?php
/**
 * @package Linguator
 */
namespace Linguator\Admin\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Services\Links\LMAT_Links;
use Linguator\Includes\Capabilities\User;
use Linguator\Includes\Base\LMAT_Base;
use Linguator\Includes\Other\LMAT_Language;

/**
 * Manages links related functions.
 *
 *  	
 */
class LMAT_Admin_Links extends LMAT_Links {
	/**
	 * Current user.
	 *
	 * @var User
	 */
	protected $user;

	/**
	 * Constructor.
	 *
	 * @since 0.0.8
	 *
	 * @param LMAT_Base $linguator Reference to the linguator object.
	 */
	public function __construct( LMAT_Base $linguator ) {
		parent::__construct( $linguator );
		$this->user = new User();
	}

	/**
	 * Returns the html markup for a new translation link.
	 *
	 *
	 * @param string       $link     The new translation link.
	 * @param LMAT_Language $language The language of the new translation.
	 * @return string
	 */
	protected function new_translation_link( string $link, LMAT_Language $language ): string {
		if ( empty( $link ) ) {
			return sprintf(
				'<span title="%s" class="lmat_icon_add wp-ui-text-icon"></span>',
				/* translators: accessibility text, %s is a native language name */
				esc_attr( sprintf( __( 'You are not allowed to add a translation in %s', 'linguator-multilingual-ai-translation' ), $language->name ) )
			);
		}

		/* translators: accessibility text, %s is a native language name */
		$hint = sprintf( __( 'Add a translation in %s', 'linguator-multilingual-ai-translation' ), $language->name );
		return sprintf(
			'<a href="%1$s" title="%2$s" class="lmat_icon_add"><span class="screen-reader-text">%3$s</span></a>',
			esc_url( $link ),
			esc_attr( $hint ),
			esc_html( $hint )
		);
	}

	/**
	 * Returns the html markup for a translation link.
	 *
	 *  
	 *
	 * @param string       $link     The translation link.
	 * @param LMAT_Language $language The language of the translation.
	 * @return string
	 */
	protected function edit_translation_link( string $link, LMAT_Language $language ): string {
		if ( empty( $link ) ) {
			return sprintf(
				'<span title="%s" class="lmat_icon_edit wp-ui-text-icon"></span>',
				/* translators: accessibility text, %s is a native language name */
				esc_attr( sprintf( __( 'You are not allowed to edit a translation in %s', 'linguator-multilingual-ai-translation' ), $language->name ) )
			);
		}

		/* translators: accessibility text, %s is a native language name */
		$hint = sprintf( __( 'Edit the translation in %s', 'linguator-multilingual-ai-translation' ), $language->name );
		return sprintf(
			'<a href="%1$s" title="%2$s" class="lmat_icon_edit"><span class="screen-reader-text">%3$s</span></a>',
			esc_url( $link ),
			esc_attr( $hint ),
			esc_html( $hint )
		);
	}

	/**
	 * Get the link to create a new post translation.
	 *
	 *
	 * @param int          $post_id  The source post id.
	 * @param LMAT_Language $language The language of the new translation.
	 * @param string       $context  Optional. Defaults to 'display' which encodes '&' to '&amp;'.
	 *                               Otherwise, preserves '&'.
	 * @return string
	 */
	public function get_new_post_translation_link( int $post_id, LMAT_Language $language, string $context = 'display' ): string {
		if ( ! $this->user->can_translate( $language ) ) {
			return '';
		}

		$post_type = get_post_type( $post_id );

		if ( empty( $post_type ) ) {
			return '';
		}

		$post_type_object = get_post_type_object( $post_type );

		if ( empty( $post_type_object ) || ! $this->user->has_cap( $post_type_object->cap->create_posts ) ) {
			return '';
		}

		// Special case for the privacy policy page which is associated to a specific capability
		if ( 'page' === $post_type_object->name && ! $this->user->has_cap( 'manage_privacy_options' ) ) {
			$privacy_page = get_option( 'wp_page_for_privacy_policy' );
			$privacy_page = is_numeric( $privacy_page ) ? (int) $privacy_page : 0;

			if ( $privacy_page && in_array( $post_id, $this->model->post->get_translations( $privacy_page ) ) ) {
				return '';
			}
		}

		if ( 'attachment' === $post_type ) {
			$args = array(
				'action'     => 'translate_media',
				'from_media' => $post_id,
				'new_lang'   => $language->slug,
			);

			$link = add_query_arg( $args, admin_url( 'admin.php' ) );

			// Add nonce for media as we will directly publish a new attachment from a click on this link
			if ( 'display' === $context ) {
				$link = wp_nonce_url( $link, 'translate_media' );
			} else {
				$link = add_query_arg( '_wpnonce', wp_create_nonce( 'translate_media' ), $link );
			}
		} else {
			$args = array(
				'post_type' => $post_type,
				'from_post' => $post_id,
				'new_lang'  => $language->slug,
			);

			$link = add_query_arg( $args, admin_url( 'post-new.php' ) );

			if ( 'display' === $context ) {
				$link = wp_nonce_url( $link, 'new-post-translation' );
			} else {
				$link = add_query_arg( '_wpnonce', wp_create_nonce( 'new-post-translation' ), $link );
			}
		}

		/**
		 * Filters the new post translation link.
		 *
		 *
		 * @param string       $link     The new post translation link.
		 * @param LMAT_Language $language The language of the new translation.
		 * @param int          $post_id  The source post id.
		 */
		return apply_filters( 'lmat_get_new_post_translation_link', $link, $language, $post_id );
	}

	/**
	 * Returns the html markup for a new post translation link.
	 *
	 *
	 * @param int          $post_id  The source post id.
	 * @param LMAT_Language $language The language of the new translation.
	 * @return string
	 */
	public function new_post_translation_link( int $post_id, LMAT_Language $language ): string {
		$link = $this->get_new_post_translation_link( $post_id, $language );
		return $this->new_translation_link( $link, $language );
	}

	/**
	 * Returns the html markup for a post translation link.
	 *
	 *  
	 *
	 * @param int $post_id The translation post id.
	 * @return string
	 */
	public function edit_post_translation_link( int $post_id ): string {
		$language = $this->model->post->get_language( $post_id );

		if ( empty( $language ) ) {
			// Should not happen.
			return '';
		}

		$link = (string) get_edit_post_link( $post_id );
		return $this->edit_translation_link( $link, $language );
	}

	/**
	 * Get the link to create a new term translation.
	 *
	 *  
	 *
	 * @param int          $term_id   Source term id.
	 * @param string       $taxonomy  Taxonomy name.
	 * @param string       $post_type Post type name.
	 * @param LMAT_Language $language  The language of the new translation.
	 * @return string
	 */
	public function get_new_term_translation_link( int $term_id, string $taxonomy, string $post_type, LMAT_Language $language ): string {
		if ( ! $this->user->can_translate( $language ) ) {
			return '';
		}

		$tax = get_taxonomy( $taxonomy );
		if ( ! $tax || ! $this->user->has_cap( $tax->cap->edit_terms ) ) {
			return '';
		}

		$args = array(
			'taxonomy'  => $taxonomy,
			'post_type' => $post_type,
			'from_tag'  => $term_id,
			'new_lang'  => $language->slug,
		);

		$link = add_query_arg( $args, admin_url( 'edit-tags.php' ) );

		/**
		 * Filters the new term translation link.
		 *
		 *
		 * @param string       $link      The new term translation link.
		 * @param LMAT_Language $language  The language of the new translation.
		 * @param int          $term_id   The source term id.
		 * @param string       $taxonomy  Taxonomy name.
		 * @param string       $post_type Post type name.
		 */
		return apply_filters( 'lmat_get_new_term_translation_link', $link, $language, $term_id, $taxonomy, $post_type );
	}

	/**
	 * Returns the html markup for a new term translation.
	 *
	 *  
	 *
	 * @param int          $term_id   Source term id.
	 * @param string       $taxonomy  Taxonomy name.
	 * @param string       $post_type Post type name.
	 * @param LMAT_Language $language  The language of the new translation.
	 * @return string
	 */
	public function new_term_translation_link( int $term_id, string $taxonomy, string $post_type, LMAT_Language $language ): string {
		$link = $this->get_new_term_translation_link( $term_id, $taxonomy, $post_type, $language );
		return $this->new_translation_link( $link, $language );
	}

	/**
	 * Returns the html markup for a term translation link.
	 *
	 *  
	 *
	 * @param int    $term_id   Translation term id.
	 * @param string $taxonomy  Taxonomy name.
	 * @param string $post_type Post type name.
	 * @return string
	 */
	public function edit_term_translation_link( int $term_id, string $taxonomy, string $post_type ): string {
		$language = $this->model->term->get_language( $term_id );

		if ( empty( $language ) ) {
			// Should not happen.
			return '';
		}

		$link = (string) get_edit_term_link( $term_id, $taxonomy, $post_type );
		return $this->edit_translation_link( $link, $language );
	}

	/**
	 * Returns some data (`from_post` and `new_lang`) from the current request.
	 *
	 *  
	 *
	 * @param string $post_type A post type.
	 * @return array {
	 *     @type WP_Post      $from_post The source post.
	 *     @type LMAT_Language $new_lang  The target language.
	 * }
	 *
	 * @phpstan-return array{}|array{from_post: WP_Post, new_lang: LMAT_Language}|never
	 */
	public function get_data_from_new_post_translation_request( string $post_type ): array {
		if ( 'attachment' === $post_type ) {
			return $this->get_data_from_new_media_translation_request();
		}

		if ( ! isset( $GLOBALS['pagenow'], $_GET['_wpnonce'], $_GET['from_post'], $_GET['new_lang'], $_GET['post_type'] ) ) {
			return array();
		}

		if ( 'post-new.php' !== $GLOBALS['pagenow'] ) {
			return array();
		}

		if ( empty( $post_type ) || $post_type !== $_GET['post_type'] || ! $this->model->is_translated_post_type( $post_type ) ) {
			return array();
		}

		// Capability check already done in post-new.php.
		check_admin_referer( 'new-post-translation' );
		return $this->get_objects_from_new_post_translation_request( (int) $_GET['from_post'], sanitize_key( $_GET['new_lang'] ) );
	}

	/**
	 * Returns some data (`from_post` and `new_lang`) from the current request.
	 *
	 *  
	 *
	 * @return array {
	 *     @type WP_Post      $from_post The source media.
	 *     @type LMAT_Language $new_lang  The target language.
	 * }
	 *
	 * @phpstan-return array{}|array{from_post: WP_Post, new_lang: LMAT_Language}|never
	 */
	public function get_data_from_new_media_translation_request(): array {
		if ( ! $this->options['media_support'] ) {
			return array();
		}

		if ( ! isset( $_GET['action'], $_GET['_wpnonce'], $_GET['from_media'], $_GET['new_lang'] ) || 'translate_media' !== $_GET['action'] ) {
			return array();
		}

		check_admin_referer( 'translate_media' );
		return $this->get_objects_from_new_post_translation_request( (int) $_GET['from_media'], sanitize_key( $_GET['new_lang'] ) );
	}

	/**
	 * Returns the objects given the post ID and language slug provided in the new post translation request.
	 *
	 *  
	 *
	 * @param int    $post_id   The original Post ID provided.
	 * @param string $lang_slug The new translation language provided
	 * @return array {
	 *     @type WP_Post      $from_post The source post.
	 *     @type LMAT_Language $new_lang  The target language.
	 * }
	 *
	 * @phpstan-return array{}|array{from_post: WP_Post, new_lang: LMAT_Language}|never
	 */
	private function get_objects_from_new_post_translation_request( int $post_id, string $lang_slug ): array {
		if ( $post_id <= 0 || empty( $lang_slug ) ) {
			return array();
		}

		$post = get_post( $post_id );
		$lang = $this->model->get_language( $lang_slug );

		if ( empty( $post ) || empty( $lang ) ) {
			return array();
		}

		return array(
			'from_post' => $post,
			'new_lang'=>$lang,
		);
	}
}
