<?php
/**
 * @package Linguator
 */

namespace Linguator\Admin\Controllers;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Filters\Linguator_Filters_Sanitization;




/**
 * Main Linguator class for admin (except Linguator pages), accessible from @see LMAT().
 *
 *  
 */
#[AllowDynamicProperties]
class Linguator_Admin extends Linguator_Admin_Base {
	/**
	 * @var Linguator_Admin_Filters|null
	 */
	public $filters;

	/**
	 * @var Linguator_Admin_Filters_Columns|null
	 */
	public $filters_columns;

	/**
	 * @var Linguator_Admin_Filters_Post|null
	 */
	public $filters_post;

	/**
	 * @var Linguator_Admin_Filters_Term|null
	 */
	public $filters_term;

	/**
	 * @var Linguator_Admin_Filters_Media|null
	 */
	public $filters_media;

	/**
	 *  
	 *
	 * @var Linguator_Filters_Sanitization|null
	 */
	public $filters_sanitization;

	/**
	 * @var Linguator_Admin_Block_Editor|null
	 */
	public $block_editor;

	/**
	 * @var Linguator_Admin_Classic_Editor|null
	 */
	public $classic_editor;

	/**
	 * @var Linguator_Admin_Nav_Menu|null
	 */
	public $nav_menu;

	/**
	 * @var Linguator_Admin_Filters_Widgets_Options|null
	 */
	public $filters_widgets_options;

	// Module properties
	/**
	 * @var mixed
	 */
	public $sitemaps;

	/**
	 * @var mixed
	 */
	public $sync;

	/**
	 * @var mixed
	 */
	public $wizard;

	/**
	 * @var mixed
	 */
	public $rest;

	/**
	 * @var mixed
	 */
	public $site_health;

	// Block module properties
	/**
	 * @var mixed
	 */
	public $switcher_block;

	/**
	 * @var mixed
	 */
	public $navigation_block;

	// Editor module properties
	/**
	 * @var mixed
	 */
	public $site_editor;

	/**
	 * @var mixed
	 */
	public $post_editor;

	/**
	 * @var mixed
	 */
	public $widget_editor;

	/**
	 * @var mixed
	 */
	public $filter_path;


	/**
	 * Setups filters and action needed on all admin pages and on plugins page.
	 *
	 *  
	 *
	 * @param Linguator_Links_Model $links_model Reference to the links model.
	 */
	public function __construct( &$links_model ) {
		parent::__construct( $links_model );
		
		// Adds a 'settings' link in the plugins table
		add_filter( 'plugin_action_links_' . LINGUATOR_BASENAME, array( $this, 'linguator_plugin_action_links' ) );
		add_action( 'in_plugin_update_message-' . LINGUATOR_BASENAME, array( $this, 'linguator_plugin_update_message' ), 10, 2 );
	}

	/**
	 * Setups filters and action needed on all admin pages and on plugins page
	 * Loads the settings pages or the filters base on the request
	 *
	 *  
	 */
	public function init() {
		parent::init();

		// Setup filters for admin pages
		// Priority 5 to make sure filters are there before customize_register is fired
		if ( $this->model->has_languages() ) {
			add_action( 'wp_loaded', array( $this, 'linguator_add_filters' ), 5 );
		}
	}

	/**
	 * Adds a 'settings' link for our plugin in the plugins list table.
	 *
	 *  
	 *
	 * @param string[] $links List of links associated to the plugin.
	 * @return string[] Modified list of links.
	 */
	public function linguator_plugin_action_links( $links ) {
		$settings_url = admin_url( 'admin.php?page=lmat_settings' );
		$docs_url     = 'https://linguator.com/documentation/?utm_source=twlmat_plugin&utm_medium=inside&utm_campaign=docs&utm_content=plugins_list';

		array_unshift(
			$links,
			'<a href="' . esc_url( $settings_url ) . '">' . esc_html__( 'Settings', 'linguator-multilingual-ai-translation' ) . '</a>'
		);
		array_unshift(
			$links,
			'<a href="' . esc_url( $docs_url ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Learn More', 'linguator-multilingual-ai-translation' ) . '</a>'
		);
		return $links;
	}

	/**
	 * Adds the upgrade notice in plugins table
	 *
	 *  
	 *
	 * @param array  $plugin_data Not used
	 * @param object $r           Plugin update data
	 * @return void
	 */
	public function linguator_plugin_update_message( $plugin_data, $r ) {
		if ( ! empty( $r->upgrade_notice ) ) {
			printf( '<p style="margin: 3px 0 0 0; border-top: 1px solid #ddd; padding-top: 3px">%s</p>', esc_html( $r->upgrade_notice ) );
		}
	}

	/**
	 * Setup filters for admin pages
	 *
	 *  
	 *   instantiate a Linguator_Bulk_Translate instance.
	 * @return void
	 */
	public function linguator_add_filters() {
		$this->filters_sanitization = new Linguator_Filters_Sanitization( $this->linguator_get_locale_for_sanitization() );
		$this->filters_widgets_options = new Linguator_Admin_Filters_Widgets_Options( $this );

		// All these are separated just for convenience and maintainability
		$classes = array( 'Filters', 'Filters_Columns', 'Filters_Post', 'Filters_Term', 'Classic_Editor', 'Block_Editor', 'Nav_Menu' );
		

		// Don't load media filters if option is disabled or if user has no right
		if ( $this->options['media_support'] && ( $obj = get_post_type_object( 'attachment' ) ) && ( current_user_can( $obj->cap->edit_posts ) || current_user_can( $obj->cap->create_posts ) ) ) {
			$classes[] = 'Filters_Media';
		}

		foreach ( $classes as $class ) {
			$obj = strtolower( $class );

			/**
			 * Filter the class to instantiate when loading admin filters
			 *
			 *  
			 *
			 * @param string $class class name
			 */
			$class = apply_filters( 'linguator_' . $obj, 'Linguator_Admin_' . $class );
			
			// Handle namespaced classes for dynamic instantiation
			if ( strpos( $class, 'Linguator_Admin_' ) === 0 && strpos( $class, '\\' ) === false ) {
				$class = __NAMESPACE__ . '\\' . $class;
			}
			
			$this->$obj = new $class( $this );
		}
	}

	/**
	 * Retrieve the locale according to the current language instead of the language
	 * of the admin interface.
	 *
	 *  
	 *
	 * @return string
	 */
	public function linguator_get_locale_for_sanitization() {
		$locale = get_locale();

		// Fallback to WordPress site language if get_locale() returns null
		if ( null === $locale || empty( $locale ) ) {
			remove_filter( 'locale', array( $this, 'get_locale' ) );
			$site_locale = get_locale();
			add_filter( 'locale', array( $this, 'get_locale' ) );
			if ( ! empty( $site_locale ) ) {
				$locale = $site_locale;
			}
		}

		if ( isset( $_POST['post_lang_choice'] ) && ! empty( $_POST['post_lang_choice'] ) && $lang = $this->model->get_language( sanitize_key( wp_unslash( $_POST['post_lang_choice'] ) ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$locale = $lang->locale;
		} elseif ( isset( $_POST['term_lang_choice'] ) && ! empty( $_POST['term_lang_choice'] ) && $lang = $this->model->get_language( sanitize_key( wp_unslash( $_POST['term_lang_choice'] ) ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$locale = $lang->locale;
		} elseif ( isset( $_POST['inline_lang_choice'] ) && ! empty( $_POST['inline_lang_choice'] ) && $lang = $this->model->get_language( sanitize_key( wp_unslash( $_POST['inline_lang_choice'] ) ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$locale = $lang->locale;
		} elseif ( ! empty( $this->curlang ) ) {
			$locale = $this->curlang->locale;
		}

		return $locale;
	}
}
