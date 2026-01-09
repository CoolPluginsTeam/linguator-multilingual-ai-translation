<?php
/**
 * @package Linguator
 */
namespace Linguator\Admin\Controllers;

use Linguator\Includes\Capabilities\Capabilities;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Base\LMAT_Base;
use Linguator\Includes\Services\Links\LMAT_Links;
use Linguator\Includes\Filters\LMAT_Filters_Links;
use Linguator\Includes\Filters\LMAT_Filters_Widgets_Options;
use Linguator\Includes\Other\LMAT_Language;
use Linguator\Admin\Controllers\LMAT_Admin_Links;
use WP_Post;
use WP_Term;

/**
 * Setup features available on all admin pages.
 *

 */
#[AllowDynamicProperties]
abstract class LMAT_Admin_Base extends LMAT_Base {
	/**
	 * @since 0.0.8
	 */
	public const SCREEN_PREFIX = 'languages';

	/**
	 * Current language (used to filter the content).
	 *
	 * @var LMAT_Language|null
	 */
	public $curlang;

	/**
	 * Language selected in the admin language filter.
	 *
	 * @var LMAT_Language|null
	 */
	public $filter_lang;

	/**
	 * Preferred language to assign to new contents.
	 *
	 * @var LMAT_Language|null
	 */
	public $pref_lang;

	/**
	 * @var LMAT_Filters_Links|null
	 */
	public $filters_links;

	/**
	 * @var LMAT_Admin_Links|null
	 */
	public $links;

	/**
	 * @var LMAT_Admin_Notices|null
	 */
	public $notices;

	/**
	 * @var LMAT_Admin_Static_Pages|null
	 */
	public $static_pages;

	/**
	 * @var LMAT_Admin_Default_Term|null
	 */
	public $default_term;

	/**
	 * Setups actions needed on all admin pages.
	 *
	 *
	 * @param LMAT_Links_Model $links_model Reference to the links model.
	 */
	public function __construct( &$links_model ) {
		parent::__construct( $links_model );
		// Adds the link to the languages panel in the WordPress admin menu
		add_action( 'admin_menu', array( $this, 'add_menus' ) );

		add_action( 'admin_menu', array( $this, 'remove_customize_submenu' ) );

		// Setup js scripts and css styles
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ), 0 ); // High priority in case an ajax request is sent by an immediately invoked function

		add_action( 'customize_controls_enqueue_scripts', array( $this, 'customize_controls_enqueue_scripts' ) );
		// Early instantiated to be able to correctly initialize language properties.
		$this->static_pages = new LMAT_Admin_Static_Pages( $this );
		$this->model->set_languages_ready();
	}

	/**
	 * Setups filters and action needed on all admin pages and on plugins page
	 * Loads the settings pages or the filters base on the request
	 *
	 *  
	 */
	public function init() {
		parent::init();

		$this->notices = new LMAT_Admin_Notices( $this );

		$this->default_term = new LMAT_Admin_Default_Term( $this );
		$this->default_term->add_hooks();

		if ( ! $this->model->has_languages() ) {
			return;
		}

		$this->links = new LMAT_Admin_Links( $this );
		$this->filters_links = new LMAT_Filters_Links( $this );

		// Add view language links
		new LMAT_Admin_View_Language_Links();

		// Filter admin language for users
		// We must not call user info before WordPress defines user roles in wp-settings.php
		add_action( 'setup_theme', array( $this, 'init_user' ) );
		add_filter( 'request', array( $this, 'request' ) );

		// Adds the languages in admin bar
		add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu' ), 100 ); // 100 determines the position
	}

	/**
	 * Adds the link to the Linguator panel in the WordPress admin menu
	 *
	 *  
	 *
	 * @return void
	 */
	public function add_menus(): void {
		global $admin_page_hooks;

		global $admin_page_hooks;

		$parent    = '';
		$first_tab = '';

		foreach ( $this->get_menu_items() as $tab => $title ) {
			$page = self::get_screen_slug( $tab );
			$capa = $this->get_menu_capability( $tab );

			if ( empty( $parent ) ) {
				$parent    = $page;
				$first_tab = $tab;

				/*
				 * WP actually doesn't care about the user capability used here, as long as it has sub-menus: it will
				 * use the ones from the sub-menus. See `_wp_menu_output()`.
				 * Ex: a user with `manage_translations` will still be able to access the Translations page, even if the
				 * main menu has `manage_options`.
				 */
				add_menu_page( $title, __( 'Linguator', 'linguator-multilingual-ai-translation' ), $capa, $parent, '__return_null', 'dashicons-translation' );
				$admin_page_hooks[ $parent ] = self::SCREEN_PREFIX; // avoid the localization of the hook name.
			}

			add_submenu_page( $parent, $title, $title, $capa, $page, array( $this, 'languages_page' ) );
		}

		/*
		 * Get rid of the `toplevel` prefix in hook names.
		 *
		 * In the WP admin, if an admin screen is the first of its menu (like the LMAT's "Languages" screen), the hooks
		 * fired in the screen get a `toplevel` prefix (ex: `toplevel_page_lmat`) while all the other screens get a
		 * slug based on the parent screen title (ex: `lmat_strings`, where `languages` is the parent
		 * screen's slug). This will not prevent the `toplevel` hooks to fire, but it will fire the `languages` hooks in
		 * addition: this way, screens can be removed or moved around without the need of hooking both prefixes: using
		 * the hooks with the `languages` prefix will work in both cases.
		 *
		 * @see get_plugin_page_hookname()
		 */
		foreach ( array( 'load-', 'admin_print_styles-', 'admin_print_scripts-', 'admin_head-', '', 'admin_print_footer_scripts-', 'admin_footer-' ) as $prefix ) {
			add_action(
				"{$prefix}toplevel_page_{$parent}",
				static function () use ( $prefix, $first_tab ) {
					// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.DynamicHooknameFound
					do_action( $prefix . self::get_screen_id( $first_tab ) );
				}
			);
		}

		/*
		 * Ensure a common CSS class to the `<body>` tag.
		 *
		 * Due to the `toplevel` "issue" described earlier, the CSS class `toplevel_page_lmat` (for example) is added
		 * to the body. This adds a class with the `languages` prefix. This ensures we have a common CSS class, even if
		 * the screen is moved to the 1st position in the menu.
		 */
		add_action(
			// Target the screen in 1st position only.
			"admin_head-toplevel_page_{$parent}",
			static function () use ( $first_tab ) {
				add_filter(
					'admin_body_class',
					static function ( $admin_body_classes ) use ( $first_tab ) {
						return $admin_body_classes . ' ' . self::get_screen_id( $first_tab );
					}
				);
			}
		);

		/**
		 * Also modify the screen ID and base.
		 *
		 * Note: the global variables `$page_hook` and `$hook_suffix` are not changed, their value is still
		 * `toplevel_page_lmat`. Changing them breaks things because we can't filter `get_plugin_page_hookname()`.
		 * This is why the above hooks are still needed.
		 */
		add_action(
			'current_screen',
			static function ( $current_screen ) use ( $parent, $first_tab ) {
				if ( "toplevel_page_{$parent}" !== $current_screen->id ) {
					return;
				}

				$current_screen->id   = self::get_screen_id( $first_tab );
				$current_screen->base = self::get_screen_id( $first_tab );
			}
		);
	}

	/**
	 * Dummy method to display the 3 tabs pages: languages, strings translations, settings.
	 * Overwritten in `LMAT_Settings`.
	 *
	 *  
	 *
	 * @return void
	 */
	public function languages_page() {}

	/**
	 * Setup js scripts & css styles ( only on the relevant pages )
	 *
	 *  
	 *
	 * @return void
	 */
	public function admin_enqueue_scripts() {
		// Don't load admin scripts on wizard page as it has its own scripts
		if ( \Linguator\Includes\Core\Linguator::is_wizard() ) {
			
			return;
		}

		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_enqueue_script( 'lmat_admin', plugins_url( "admin/assets/js/build/admin{$suffix}.js", LINGUATOR_ROOT_FILE ), array( 'jquery' ), LINGUATOR_VERSION, true );
		$inline_script = sprintf( 'let lmat_admin = %s;', wp_json_encode( array( 'ajax_filter' => $this->get_ajax_filter_data() ) ) );
		wp_add_inline_script( 'lmat_admin', $inline_script, 'before' );

		$screen = get_current_screen();
		if ( empty( $screen ) ) {
			return;
		}

		/*
		 * For each script:
		 * 0 => the pages on which to load the script
		 * 1 => the scripts it needs to work
		 * 2 => true if loaded even if languages have not been defined yet, false otherwise
		 * 3 => true if loaded in footer
		 */
		$scripts = array(
			'user'    => array( array( 'profile', 'user-edit' ), array( 'jquery' ), false, false ),
			'widgets' => array( array( 'widgets' ), array( 'jquery' ), false, false ),
		);

		$block_screens = array( 'widgets', 'site-editor' );

		if ( ! empty( $screen->post_type ) && $this->model->is_translated_post_type( $screen->post_type ) ) {
			$scripts['post'] = array( array( 'edit' ), array( 'jquery', 'wp-ajax-response' ), false, true );

			// Classic editor.
			if ( ! method_exists( $screen, 'is_block_editor' ) || ! $screen->is_block_editor() ) {
				$scripts['classic-editor'] = array( array( 'post', 'media', 'async-upload' ), array( 'jquery', 'wp-ajax-response', 'post', 'jquery-ui-dialog', 'wp-i18n' ), false, true );
			}

			// Block editor with legacy metabox in WP 5.0+.
			$block_screens[] = 'post';
		}

		if ( $this->options['media_support'] ) {
			$scripts['media'] = array( array( 'upload' ), array( 'jquery' ), false, true );
		}

		if ( $this->is_block_editor( $screen ) ) {
			$scripts['block-editor'] = array( $block_screens, array( 'jquery', 'wp-ajax-response', 'wp-api-fetch', 'jquery-ui-dialog', 'wp-i18n' ), false, true );
		}

		if ( ! empty( $screen->taxonomy ) && $this->model->is_translated_taxonomy( $screen->taxonomy ) ) {
			$scripts['term'] = array( array( 'edit-tags', 'term' ), array( 'jquery', 'wp-ajax-response', 'jquery-ui-autocomplete' ), false, true );
		}

		foreach ( $scripts as $script => $v ) {
			if ( in_array( $screen->base, $v[0] ) && ( $v[2] || $this->model->has_languages() ) ) {
				wp_enqueue_script( "lmat_{$script}", plugins_url( "admin/assets/js/build/{$script}{$suffix}.js", LINGUATOR_ROOT_FILE ), $v[1], LINGUATOR_VERSION, $v[3] );
				if ( 'classic-editor' === $script || 'block-editor' === $script ) {
					wp_set_script_translations( "lmat_{$script}", 'linguator' );
				}
			}
		}

		wp_register_style( 'linguator_admin', plugins_url( "admin/assets/css/build/admin{$suffix}.css", LINGUATOR_ROOT_FILE ), array( 'wp-jquery-ui-dialog' ), LINGUATOR_VERSION );
		wp_enqueue_style( 'linguator_dialog', plugins_url( "admin/assets/css/build/dialog{$suffix}.css", LINGUATOR_ROOT_FILE ), array( 'linguator_admin' ), LINGUATOR_VERSION );
		
		// Enqueue custom font for icons
		$this->enqueue_linguator_font();

		$this->add_inline_scripts();
		$this->add_menu_redirect_script();
	}

	/**
	 * Enqueues the Linguator custom font and its styles.
	 * Centralized method to avoid loading the same CSS multiple times.
	 *
	 * @return void
	 */
	public function enqueue_linguator_font() {
		// Only enqueue if not already enqueued
		if ( ! wp_style_is( 'linguator-font', 'enqueued' ) ) {
			wp_enqueue_style( 'linguator-font', plugins_url( 'assets/fonts/lmaticons.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
			
			// Add custom CSS for the Linguator icon
			$icon_css = "
			/* Override dashicons-translation with custom font icon */
			#adminmenu .toplevel_page_lmat .wp-menu-image:before,
			#adminmenu .toplevel_page_lmat .dashicons-before:before {
				font-family: 'linguator' !important;
				content: '\\e900' !important;
				font-size: 20px;
				line-height: 1;
				vertical-align: middle;
			}
			
			/* Apply same icon to ab-icon class */
			#wpadminbar #wp-admin-bar-languages .ab-icon:before {
				font-family: 'linguator' !important;
				content: '\\e900' !important;
				font-size: 20px;
			}
			";
			wp_add_inline_style( 'linguator-font', $icon_css );
		}
	}

	/**
	 * Adds JavaScript to redirect main menu click to settings page.
	 *
	 *  
	 *
	 * @return void
	 */
	private function add_menu_redirect_script() {
		$script = "
		jQuery(document).ready(function($) {
			// Find the main Linguator menu link (the one that points to the first submenu)
			var mainMenuLink = $('a[href*=\"page=lmat\"][href*=\"admin.php\"]').first();
			if (mainMenuLink.length) {
				// Override the click event to redirect to settings
				mainMenuLink.off('click').on('click', function(e) {
					e.preventDefault();
					window.location.href = '" . admin_url( 'admin.php?page=lmat_settings' ) . "';
				});
			}
		});
		";
		
		wp_add_inline_script( 'lmat_admin', $script );
	}

	/**
	 * Tells whether or not the given screen is block editor kind.
	 * e.g. widget, site or post editor.
	 *
	 *  
	 *
	 * @param WP_Screen $screen Screen object.
	 * @return bool True if the screen is a block editor, false otherwise.
	 */
	protected function is_block_editor( $screen ) {
		return method_exists( $screen, 'is_block_editor' ) && $screen->is_block_editor() && !lmat_use_block_editor_plugin();
	}

	/**
	 * Enqueue scripts to the WP Customizer.
	 *
	 *  
	 *
	 * @return void
	 */
	public function customize_controls_enqueue_scripts() {
		if ( $this->model->has_languages() ) {
			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			wp_enqueue_script( 'lmat_widgets', plugins_url( 'admin/assets/js/build/widgets' . $suffix . '.js', LINGUATOR_ROOT_FILE ), array( 'jquery' ), LINGUATOR_VERSION, true );
			$this->add_inline_scripts();
		}
	}

	/**
	 * Adds inline scripts to set the default language in JS
	 * and localizes scripts.
	 *
	 *  
	 *
	 * @return void
	 */
	private function add_inline_scripts() {
		if ( wp_script_is( 'lmat_block-editor', 'enqueued' ) ) {
			$default_lang_script = 'const lmatDefaultLanguage = ' . wp_json_encode( (string) $this->options['default_lang'] ) . ';';
			wp_add_inline_script(
				'lmat_block-editor',
				$default_lang_script,
				'before'
			);
		}
		if ( wp_script_is( 'lmat_widgets', 'enqueued' ) ) {
			wp_localize_script(
				'lmat_widgets',
				'lmat_widgets',
				array(
					'flags' => wp_list_pluck( $this->model->get_languages_list(), 'flag', 'slug' ),
				)
			);
		}

	}



	/**
	 * Returns the data to use with the AJAX filter.
	 * The final goal is to detect if an ajax request is made on admin or frontend.
	 *
	 *
	 *  
	 *
	 * @return array
	 */
	public function get_ajax_filter_data(): array {
		global $post, $tag;

		$params = array( 'lmat_ajax_backend' => 1 );
		if ( $post instanceof WP_Post && $this->model->post_types->is_translated( $post->post_type ) ) {
			$params['lmat_post_id'] = $post->ID;
		}

		if ( $tag instanceof WP_Term && $this->model->taxonomies->is_translated( $tag->taxonomy ) ) {
			$params['lmat_term_id'] = $tag->term_id;
		}

		/**
		 * Filters the list of parameters to add to the admin ajax request.
		 *
		 *  
		 *
		 * @param array $params List of parameters to add to the admin ajax request.
		 */
		return (array) apply_filters( 'lmat_admin_ajax_params', $params );
	}

	/**
	 * Sets the admin current language, used to filter the content
	 *
	 *  
	 *
	 * @return void
	 */
	public function set_current_language() {
		$this->curlang = $this->filter_lang;

		// Edit Post
		if ( isset( $_REQUEST['lmat_post_id'] ) && $lang = $this->model->post->get_language( (int) $_REQUEST['lmat_post_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$this->curlang = $lang;
		} elseif ( 'post.php' === $GLOBALS['pagenow'] && isset( $_GET['post'] ) && $this->model->is_translated_post_type( get_post_type( (int) $_GET['post'] ) ) && $lang = $this->model->post->get_language( (int) $_GET['post'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$this->curlang = $lang;
		} elseif ( 'post-new.php' === $GLOBALS['pagenow'] && ( empty( $_GET['post_type'] ) || $this->model->is_translated_post_type( sanitize_key( $_GET['post_type'] ) ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$this->curlang = empty( $_GET['new_lang'] ) ? $this->pref_lang : $this->model->get_language( sanitize_key( $_GET['new_lang'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
		}

		// Edit Term
		elseif ( isset( $_REQUEST['lmat_term_id'] ) && $lang = $this->model->term->get_language( (int) $_REQUEST['lmat_term_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$this->curlang = $lang;
		} elseif ( in_array( $GLOBALS['pagenow'], array( 'edit-tags.php', 'term.php' ) ) && isset( $_GET['taxonomy'] ) && $this->model->is_translated_taxonomy( sanitize_key( $_GET['taxonomy'] ) ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			if ( isset( $_GET['tag_ID'] ) && $lang = $this->model->term->get_language( (int) $_GET['tag_ID'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
				$this->curlang = $lang;
			} elseif ( ! empty( $_GET['new_lang'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
				$this->curlang = $this->model->get_language( sanitize_key( $_GET['new_lang'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
			} elseif ( empty( $this->curlang ) ) {
				$this->curlang = $this->pref_lang;
			}
		}

		// Ajax
		if ( wp_doing_ajax() && ! empty( $_REQUEST['lang'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$this->curlang = $this->model->get_language( sanitize_key( $_REQUEST['lang'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
		}

		/**
		 * Filters the current language used by Linguator in the admin context.
		 *
		 *  
		 *
		 * @param LMAT_Language|false|null $curlang  Instance of the current language.
		 * @param LMAT_Admin_Base          $linguator Instance of the main Linguator's object.
		 */
		$this->curlang = apply_filters( 'lmat_admin_current_language', $this->curlang, $this );

		// Inform that the admin language has been set.
		if ( $this->curlang instanceof LMAT_Language ) {
			/** This action is documented in frontend/choose-lang.php */
			do_action( 'lmat_language_defined', $this->curlang->slug, $this->curlang );
		} else {
			/** This action is documented in include/class-linguator.php */
			do_action( 'lmat_no_language_defined' ); // To load overridden textdomains.
		}
	}

	/**
	 * Defines the backend language and the admin language filter based on user preferences
	 *
	 *  
	 *
	 * @return void
	 */
	public function init_user() {
		// Language for admin language filter: may be empty
		// $_GET['lang'] is numeric when editing a language, not when selecting a new language in the filter
		// We intentionally don't use a nonce to update the language filter
		// Don't update global filter when editing posts or terms (post.php, term.php)
		$is_edit_page = in_array( $GLOBALS['pagenow'], array( 'post.php', 'term.php' ) );
		
		if ( ! wp_doing_ajax() && ! empty( $_GET['lang'] ) && ! is_numeric( sanitize_key( $_GET['lang'] ) ) && ! $is_edit_page && current_user_can( 'edit_user', $user_id = get_current_user_id() ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			update_user_meta( $user_id, 'lmat_filter_content', ( $lang = $this->model->get_language( sanitize_key( $_GET['lang'] ) ) ) ? $lang->slug : '' ); // phpcs:ignore WordPress.Security.NonceVerification
		}

		$this->filter_lang = $this->model->get_language( get_user_meta( get_current_user_id(), 'lmat_filter_content', true ) );

		// Set preferred language for use when saving posts and terms: must not be empty
		$this->pref_lang = empty( $this->filter_lang ) ? $this->model->get_default_language() : $this->filter_lang;

		/**
		 * Filters the preferred language on admin side.
		 * The preferred language is used for example to determine the language of a new post.
		 *
		 *  
		 *
		 * @param LMAT_Language $pref_lang Preferred language.
		 */
		$this->pref_lang = apply_filters( 'lmat_admin_preferred_language', $this->pref_lang );

		$this->set_current_language();
	}

	/**
	 * Avoids parsing a tax query when all languages are requested
	 * Fixes https://wordpress.org/support/topic/notice-undefined-offset-0-in-wp-includesqueryphp-on-line-3877 introduced in WP 4.1
	 *
	 * @see https://core.trac.wordpress.org/ticket/31246 the suggestion of @boonebgorges.
	 *
	 *  
	 *
	 * @param array $qvars The array of requested query variables.
	 * @return array
	 */
	public function request( $qvars ) {
		if ( isset( $qvars['lang'] ) && 'all' === $qvars['lang'] ) {
			unset( $qvars['lang'] );
		}

		return $qvars;
	}

	/**
	 * Adds the languages list in admin bar for the admin languages filter.
	 *
	 *  
	 *
	 * @param WP_Admin_Bar $wp_admin_bar WP_Admin_Bar global object.
	 * @return void
	 */
	public function admin_bar_menu( $wp_admin_bar ) {
		$all_item = (object) array(
			'slug' => 'all',
			'name' => __( 'Show all languages', 'linguator-multilingual-ai-translation' ),
			'flag' => '<span class="ab-icon"></span>',
		);

		$selected = empty( $this->filter_lang ) ? $all_item : $this->filter_lang;

		$title = sprintf(
			'<span class="ab-label"%1$s><span class="screen-reader-text">%2$s</span>%3$s</span>',
			$selected instanceof LMAT_Language ? sprintf( ' lang="%s"', esc_attr( $selected->get_locale( 'display' ) ) ) : '',
			__( 'Filters content by language', 'linguator-multilingual-ai-translation' ),
			esc_html( $selected->name )
		);

		$all_items = array_merge( array( $all_item ), $this->model->get_languages_list() );
		$items     = $all_items;

		if ( $this->should_hide_admin_bar_menu() ) {
			$items = array();
		}

		/**
		 * Filters the admin languages filter submenu items
		 *
		 *
		 * @param array $items The admin languages filter submenu items.
		 */
		$items = apply_filters( 'lmat_admin_languages_filter', $items, $all_items );

		if ( empty( $items ) ) {
			return;
		}

		$wp_admin_bar->add_menu(
			array(
				'id'    => 'languages',
				'title' => $selected->flag . $title,
				'href'  => esc_url( add_query_arg( 'lang', $selected->slug, remove_query_arg( 'paged' ) ) ),
				'meta'  => array(
					'title' => __( 'Filters content by language', 'linguator-multilingual-ai-translation' ),
					'class' => 'all' === $selected->slug ? '' : 'lmat-filtered-languages',
				),
			)
		);

		foreach ( $items as $lang ) {
			if ( $selected->slug === $lang->slug ) {
				continue;
			}

			$wp_admin_bar->add_menu(
				array(
					'parent' => 'languages',
					'id'     => $lang->slug,
					'title'  => wp_kses( $lang->flag, array( 'img' => array( 'src' => true, 'alt' => true, 'class' => true, 'width' => true, 'height' => true, 'style' => true ) ), array_merge( wp_allowed_protocols(), array( 'data' ) ) ) . esc_html( $lang->name ),
					'href'   => esc_url( add_query_arg( 'lang', $lang->slug, remove_query_arg( 'paged' ) ) ),
					'meta'   => 'all' === $lang->slug ? array() : array( 'lang' => esc_attr( $lang->get_locale( 'display' ) ) ),
				)
			);
		}
	}

	/**
	 * Remove the customize submenu when using a block theme.
	 *
	 * WordPress removes the Customizer menu if a block theme is activated and no other plugins interact with it.
	 * As Linguator interacts with the Customizer, we have to delete this menu ourselves in the case of a block theme,
	 * unless another plugin than Linguator interacts with the Customizer.
	 *
	 *  
	 *
	 * @return void
	 */
	public function remove_customize_submenu() {
		if ( ! $this->should_customize_menu_be_removed() ) {
			return;
		}

		global $submenu;

		if ( ! empty( $submenu['themes.php'] ) ) {
			foreach ( $submenu['themes.php'] as $submenu_item ) {
				if ( 'customize' === $submenu_item[1] ) {
					remove_submenu_page( 'themes.php', $submenu_item[2] );
				}
			}
		}
	}
	/**
	 * Tells if the Linguator's admin bar menu should be hidden for the current page.
	 * Conventionally, it should be hidden on edition pages.
	 *
	 *
	 * @return bool
	 */
	public function should_hide_admin_bar_menu(): bool {
		global $pagenow, $typenow, $taxnow;

		if ( in_array( $pagenow, array( 'post.php', 'post-new.php' ), true ) ) {
			return ! empty( $typenow );
		}

		if ( 'term.php' === $pagenow ) {
			return ! empty( $taxnow );
		}

		return false;
	}

	/**
	 * Returns the ID of a Linguator's settings screen.
	 *
	 * @since 0.0.8
	 *
	 * @param string $tab The name of the screen (`lang`, `strings`, `settings`).
	 * @return string
	 */
	public static function get_screen_id( string $tab ): string {
		return sprintf( '%s_page_%s', self::SCREEN_PREFIX, self::get_screen_slug( $tab ) );
	}

	/**
	 * Returns the slug of a Linguator's settings screen, as seen in the URL.
	 *
	 * @since 0.0.8
	 *
	 * @param string $tab The name of the screen (`lang`, `strings`, `settings`).
	 * @return string
	 */
	public static function get_screen_slug( string $tab ): string {
		return 'lang' === $tab ? 'lmat' : "lmat_$tab";
	}

	/**
	 * Returns the list of sub-menu items.
	 *
	 * @since 0.0.8
	 *
	 * @return string[] List of sub-menu items with page slugs as array keys, and sub-menu titles as array values.
	 *
	 * @phpstan-return array<non-empty-string, string>
	 */
	protected function get_menu_items(): array {
		$tabs = array(
			'lang' => __( 'Manage Languages', 'linguator-multilingual-ai-translation' ),
		);

		$tabs['settings'] = __( 'Settings', 'linguator-multilingual-ai-translation' );

		$tabs['settings&tab=general&loco=true'] = __( 'Theme & plugins localization', 'linguator-multilingual-ai-translation' );

		/**
		 * Filter the list of sub-menu items in Linguator settings.
		 *
		 * @since 1.5.1
		 *
		 * @param string[] $tabs List of sub-menu items with page slugs as array keys and titles as array values.
		 */
		return (array) apply_filters( 'lmat_settings_tabs', $tabs );
	}

	/**
	 * Returns the user capability required to access the given menu page.
	 *
	 * @since 0.0.8
	 *
	 * @param string $menu Menu slug.
	 * @return string
	 */
	protected function get_menu_capability( string $menu ): string {
		switch ( $menu ) {
			case 'lang':
				return Capabilities::LANGUAGES;

			case 'strings':
				return Capabilities::TRANSLATIONS;
		}

		return 'manage_options';
	}
}