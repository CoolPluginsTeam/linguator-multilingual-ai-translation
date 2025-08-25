<?php
/**
 * @package Linguator
 */
namespace Linguator\Admin\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Filters\LMAT_Filters;



/**
 * Setup miscellaneous admin filters as well as filters common to admin and frontend
 *
 * @since 1.0.0
 */
class LMAT_Admin_Filters extends LMAT_Filters {

	/**
	 * Constructor: setups filters and actions.
	 *
	 * @since 1.0.0
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		parent::__construct( $linguator );

		// Language management for users
		add_action( 'personal_options_update', array( $this, 'personal_options_update' ) );
		add_action( 'edit_user_profile_update', array( $this, 'personal_options_update' ) );
		add_action( 'personal_options', array( $this, 'personal_options' ) );

		// Upgrades plugins and themes translations files
		add_filter( 'themes_update_check_locales', array( $this, 'update_check_locales' ) );
		add_filter( 'plugins_update_check_locales', array( $this, 'update_check_locales' ) );

		add_filter( 'admin_body_class', array( $this, 'admin_body_class' ) );

		// Add post state for translations of the privacy policy page
		add_filter( 'display_post_states', array( $this, 'display_post_states' ), 10, 2 );
	}

	/**
	 * Updates the user biographies.
	 *
	 * @since 1.0.0
	 *
	 * @param int $user_id User ID.
	 * @return void
	 */
	public function personal_options_update( $user_id ) {
		// Biography translations
		foreach ( $this->model->get_languages_list() as $lang ) {
			$meta        = $lang->is_default ? 'description' : 'description_' . $lang->slug;
			// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- WordPress core handles nonce verification for personal_options_update, sanitized below with sanitize_textarea_field
			$description = empty( $_POST[ 'description_' . $lang->slug ] ) ? '' : sanitize_textarea_field( trim( wp_unslash( $_POST[ 'description_' . $lang->slug ] ) ) );

			/** This filter is documented in wp-includes/user.php */
			$description = apply_filters( 'pre_user_description', $description ); // Applies WP default filter wp_filter_kses
			update_user_meta( $user_id, $meta, $description );
		}
	}

	/**
	 * Outputs hidden information to modify the biography form with js.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_User $profileuser The current WP_User object.
	 * @return void
	 */
	public function personal_options( $profileuser ) {
		foreach ( $this->model->get_languages_list() as $lang ) {
			$meta        = $lang->is_default ? 'description' : 'description_' . $lang->slug;
			$description = get_user_meta( $profileuser->ID, $meta, true );

			printf(
				'<input type="hidden" class="biography" name="%s___%s" value="%s" />',
				esc_attr( $lang->slug ),
				esc_attr( $lang->name ),
				sanitize_user_field( 'description', $description, $profileuser->ID, 'edit' )
			);
		}
	}

	/**
	 * Allows to update translations files for plugins and themes.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $locales List of locales to update for plugins and themes.
	 * @return string[]
	 */
	public function update_check_locales( $locales ) {
		return array_merge( $locales, $this->model->get_languages_list( array( 'fields' => 'locale' ) ) );
	}

	/**
	 * Adds custom classes to the body
	 *
	 * @since 1.0.0 Adds a text direction dependent class to the body.
	 * @since 1.0.0 Adds a language dependent class to the body.
	 *
	 * @param string $classes Space-separated list of CSS classes.
	 * @return string
	 */
	public function admin_body_class( $classes ) {
		if ( ! empty( $this->curlang ) ) {
			$classes .= ' lmat-dir-' . ( $this->curlang->is_rtl ? 'rtl' : 'ltr' );
			$classes .= ' lmat-lang-' . $this->curlang->slug;
		}
		return $classes;
	}

	/**
	 * Adds post state for translations of the privacy policy page.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $post_states An array of post display states.
	 * @param WP_Post  $post        The current post object.
	 * @return string[]
	 */
	public function display_post_states( $post_states, $post ) {
		$page_for_privacy_policy = get_option( 'wp_page_for_privacy_policy' );

		if ( $page_for_privacy_policy && in_array( $post->ID, $this->model->post->get_translations( $page_for_privacy_policy ) ) ) {
			$post_states['page_for_privacy_policy'] = __( 'Privacy Policy Page', 'linguator-multilingual-ai-translation' );
		}

		return $post_states;
	}
}
