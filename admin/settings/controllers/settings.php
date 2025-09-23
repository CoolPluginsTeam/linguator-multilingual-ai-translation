<?php
/**
 * @package Linguator
 */
namespace Linguator\Settings\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Admin\Controllers\LMAT_Admin_Base;
use Linguator\Admin\Controllers\LMAT_Admin_Strings;
use Linguator\Admin\Controllers\LMAT_Admin_Model;
use Linguator\Settings\Controllers\LMAT_Settings_Module;
use Linguator\Settings\Tables\LMAT_Table_Languages;
use Linguator\Settings\Tables\LMAT_Table_String;
use Linguator\Settings\Header\Header;
use Linguator\Supported_Blocks\LMAT_Supported_Blocks;

use WP_Error;

/**
 * A class for the Linguator settings pages, accessible from @see LMAT().
 *
 * @since 1.0.0
 */
#[AllowDynamicProperties]
class LMAT_Settings extends LMAT_Admin_Base {

	/**
	 * @var LMAT_Admin_Model
	 */
	public $model;

	/**
	 * Name of the active module.
	 *
	 * @var string|null
	 */
	protected $active_tab;

	/**
	 * Array of modules classes.
	 *
	 * @var LMAT_Settings_Module[]|null
	 */
	protected $modules;

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
	public $switcher_block;

	/**
	 * @var mixed
	 */
	public $navigation_block;

	// Additional dynamic properties
	/**
	 * @var mixed
	 */
	public $pref_lang;

	/**
	 * @var mixed
	 */
	public $filter_lang;

	/**
	 * @var mixed
	 */
	private $header;

	/**
	 * @var mixed
	 */
	private $selected_tab;


	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 *
	 * @param LMAT_Links_Model $links_model Reference to the links model.
	 */
	public function __construct( &$links_model ) {
		parent::__construct( $links_model );

		$selected_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : '';
		$loco=isset($_GET['loco']) ? sanitize_text_field($_GET['loco']) : '';
		
		
		if ( isset( $_GET['page'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$this->active_tab = 'lmat' === $_GET['page'] ? 'lang' : substr( sanitize_key( $_GET['page'] ), 5 ); // phpcs:ignore WordPress.Security.NonceVerification
		}

		
		if($loco === 'true'){
			add_action( 'load-languages_page_lmat_settings', array( $this, 'loco_page_redirect' ) );
		}

		if($this->active_tab === 'lang'){
			$selected_tab='lang';
		}

		if('loco' === $selected_tab || '' === $selected_tab){
			$this->selected_tab = 'general';
			$selected_tab='general';
		}
		
		if($selected_tab){
			if($selected_tab === 'strings'){
				$this->active_tab = $selected_tab;
			}

			$this->selected_tab = $selected_tab;
		}else{
			$this->selected_tab = $this->active_tab;
		}
		
		$this->header = Header::get_instance($this->selected_tab, $this->model);

		LMAT_Admin_Strings::init();

		add_action( 'admin_init', array( $this, 'register_settings_modules' ) );

		// Adds screen options and the about box in the languages admin panel.
		add_action( 'load-toplevel_page_lmat', array( $this, 'load_page' ) );

		// Saves the per-page value in screen options.
		add_filter( 'set_screen_option_lmat_lang_per_page', array( $this, 'set_screen_option' ), 10, 3 );
		add_filter( 'set_screen_option_lmat_strings_per_page', array( $this, 'set_screen_option' ), 10, 3 );
	}

	/**
	 * Initializes the modules
	 * 
	 * Note: Legacy settings modules are no longer needed since React handles settings.
	 * Only external modules from filters are registered now.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_settings_modules() {
		$modules = array();

		/**
		 * Filter the list of setting modules
		 * Allows external plugins/modules to add their own settings modules
		 *
		 * @since 1.0.0
		 *
		 * @param array $modules the list of module classes
		 */
		$modules = apply_filters( 'lmat_settings_modules', $modules );

		foreach ( $modules as $key => $class ) {
			// Handle namespace mapping for remaining modules (mainly sync)
			if ( 'LMAT_Settings_Sync' === $class ) {
				$class = \Linguator\Modules\sync\LMAT_Settings_Sync::class;
			}
			
			// Extract class name for the key if it's a full class name
			if ( is_string( $class ) && strpos( $class, '\\' ) !== false ) {
				$class_parts = explode( '\\', $class );
				$class_name = end( $class_parts );
			} else {
				$class_name = $class;
			}
			
			$key = is_numeric( $key ) ? strtolower( str_replace( 'LMAT_Settings_', '', $class_name ) ) : $key;
			$this->modules[ $key ] = new $class( $this );
		}
	}

	/**
	 * Adds screen options and the about box in the languages admin panel
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function load_page() {
		

		add_screen_option(
			'per_page',
			array(
				'label'   => __( 'Languages', 'linguator-multilingual-ai-translation' ),
				'default' => 10,
				'option'  => 'lmat_lang_per_page',
			)
		);

		add_action( 'admin_notices', array( $this, 'notice_objects_with_no_lang' ) );
	}

	/**
	 * Adds screen options in the strings translations admin panel
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function load_page_strings() {
		add_screen_option(
			'per_page',
			array(
				'label'   => __( 'Strings translations', 'linguator-multilingual-ai-translation' ),
				'default' => 10,
				'option'  => 'lmat_strings_per_page',
			)
		);
	}

	/**
	 * Adds screen options in the localizations admin panel
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function loco_page_assets() {

		if(!function_exists('is_plugin_active')){
			include_once(ABSPATH . 'wp-admin/includes/plugin.php');
		}
		$loco_plugin_active=is_plugin_active('loco-translate/loco.php');
		$loco_install="false";
		
		if($loco_plugin_active){
			$loco_install="true";
			$plugin_info_url=admin_url('admin.php?page=loco');
		}else{

			if ( ! current_user_can( 'install_plugins' ) ) {
				return;
			}

			// Load ThickBox and updates JS
			add_thickbox();
			wp_enqueue_script( 'updates' );

			$plugin_info_url=admin_url('plugin-install.php?tab=plugin-information&plugin=loco-translate&TB_iframe=true&width=772&height=800');
		}
		

		wp_enqueue_script('lmat-loco-redirect-script', plugins_url('admin/assets/js/loco-redirect-script.js', LINGUATOR_ROOT_FILE), array('jquery'), LINGUATOR_VERSION, true);
		wp_localize_script('lmat-loco-redirect-script', 'lmat_loco_redirect_script', array('admin_' => esc_url(admin_url('admin.php?page=lmat_settings')), 'loco_iframe_page_url' => array("url" => $plugin_info_url, "title" => esc_js( __( 'Plugin: Loco Translate', 'linguator-multilingual-ai-translation' ) )), 'loco_install' => $loco_install));
	}

	/**
	 * Redirects to the loco page
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function loco_page_redirect() {
		if(!function_exists('is_plugin_active')){
			include_once(ABSPATH . 'wp-admin/includes/plugin.php');
		}

		$loco_plugin_active=is_plugin_active('loco-translate/loco.php');

		if($loco_plugin_active){
			wp_safe_redirect(admin_url('admin.php?page=loco'));
		};
	}

	/**
	 * Saves the number of rows in the languages or strings table set by this user.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed  $screen_option False or value returned by a previous filter, not used.
	 * @param string $option        The name of the option, not used.
	 * @param int    $value         The new value of the option to save.
	 * @return int The new value of the option.
	 */
	public function set_screen_option( $screen_option, $option, $value ) {
		return (int) $value;
	}

	/**
	 * Manages the user input for the languages pages.
	 *
	 * @since 1.0.0
	 *
	 * @param string $action The action name.
	 * @return void
	 */
	public function handle_actions( $action ) {
		switch ( $action ) {
			case 'add':
				check_admin_referer( 'add-lang', '_wpnonce_add-lang' );
				$sanitized_data = array(
					'name' => sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) ),
					'slug' => sanitize_key( wp_unslash( $_POST['slug'] ?? '' ) ),
					'locale' => sanitize_locale_name( wp_unslash( $_POST['locale'] ?? '' ) ),
					'rtl' => isset( $_POST['rtl'] ) ? (bool) $_POST['rtl'] : false,
					'term_group' => isset( $_POST['term_group'] ) ? (int) $_POST['term_group'] : 0,
					'flag' => sanitize_text_field( wp_unslash( $_POST['flag'] ?? '' ) ),
				);
				$errors = $this->model->add_language( $sanitized_data );

				if ( is_wp_error( $errors ) ) {
						lmat_add_notice( $errors );
				} else {
					lmat_add_notice( new WP_Error( 'lmat_languages_created', __( 'Language added.', 'linguator-multilingual-ai-translation' ), 'success' ) );
					$locale = $sanitized_data['locale'];

					if ( 'en_US' !== $locale && current_user_can( 'install_languages' ) ) {
						// Attempts to install the language pack
						require_once ABSPATH . 'wp-admin/includes/translation-install.php';
						if ( ! wp_download_language_pack( $locale ) ) {
							lmat_add_notice( new WP_Error( 'lmat_download_mo', __( 'The language was created, but the WordPress language file was not downloaded. Please install it manually.', 'linguator-multilingual-ai-translation' ), 'warning' ) );
						}

						// Force checking for themes and plugins translations updates
						wp_clean_themes_cache();
						wp_clean_plugins_cache();
					}
				}
				self::redirect(); // To refresh the page 
				break;

			case 'delete':
				check_admin_referer( 'delete-lang' );

				if ( ! empty( $_GET['lang'] ) && $this->model->delete_language( (int) $_GET['lang'] ) ) {
					lmat_add_notice( new WP_Error( 'lmat_languages_deleted', __( 'Language deleted.', 'linguator-multilingual-ai-translation' ), 'success' ) );
				}

				self::redirect(); // To refresh the page 
				break;

			case 'update':
				check_admin_referer( 'add-lang', '_wpnonce_add-lang' );
				$sanitized_data = array(
					'lang_id' => absint( wp_unslash( $_POST['lang_id'] ?? 0 ) ),
					'name' => sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) ),
					'slug' => sanitize_key( wp_unslash( $_POST['slug'] ?? '' ) ),
					'locale' => sanitize_locale_name( wp_unslash( $_POST['locale'] ?? '' ) ),
					'rtl' => isset( $_POST['rtl'] ) ? (bool) $_POST['rtl'] : false,
					'term_group' => isset( $_POST['term_group'] ) ? (int) $_POST['term_group'] : 0,
					'flag' => sanitize_text_field( wp_unslash( $_POST['flag'] ?? '' ) ),
				);
				$errors = $this->model->update_language( $sanitized_data );

				if ( is_wp_error( $errors ) ) {
					lmat_add_notice( $errors );
				} else {
					lmat_add_notice( new WP_Error( 'lmat_languages_updated', __( 'Language updated.', 'linguator-multilingual-ai-translation' ), 'success' ) );
				}

				self::redirect(); // To refresh the page 
				break;

			case 'default-lang':
				check_admin_referer( 'default-lang' );

				if ( $lang = $this->model->get_language( (int) $_GET['lang'] ) ) {
					$this->model->update_default_lang( $lang->slug );
				}

				self::redirect(); // To refresh the page 
				break;

			case 'content-default-lang':
				check_admin_referer( 'content-default-lang' );

				$this->model->set_language_in_mass();

				self::redirect(); // To refresh the page 
				break;

			case 'activate':
				check_admin_referer( 'lmat_activate' );
				if ( isset( $_GET['module'] ) ) {
					$module = sanitize_key( $_GET['module'] );
					if ( isset( $this->modules[ $module ] ) ) {
						$this->modules[ $module ]->activate();
					}
				}
				self::redirect();
				break;

			case 'deactivate':
				check_admin_referer( 'lmat_deactivate' );
				if ( isset( $_GET['module'] ) ) {
					$module = sanitize_key( $_GET['module'] );
					if ( isset( $this->modules[ $module ] ) ) {
						$this->modules[ $module ]->deactivate();
					}
				}
				self::redirect();
				break;

			default:
				/**
				 * Fires when a non default action has been sent to Linguator settings
				 *
				 * @since 1.0.0
				 */
				do_action( "lmat_action_$action" );
				break;
		}
	}

	/**
	 * Displays the 3 tabs pages: languages, strings translations, settings
	 * Also manages user input for these pages
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function languages_page() {

		// Support Blocks
		if($this->selected_tab === 'supported-blocks'){
			$this->header->header();
			LMAT_Supported_Blocks::get_instance()->lmat_render_support_blocks_page();
			return;
		}

		// return if the active tab is localizations
		if($this->active_tab === 'localizations'){
			return;
		}
		
		// Check if this is a settings tab (not lang, strings, or wizard which has its own handling)
		$is_settings_tab = ! in_array( $this->active_tab, array( 'lang', 'strings', 'wizard' ), true );
		
		if ( $is_settings_tab ) {
			// Handle user input for legacy actions
			$action = isset( $_REQUEST['lmat_action'] ) ? sanitize_key( $_REQUEST['lmat_action'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
			if ( ! empty( $action ) ) {
				$this->handle_actions( $action );
			}

			// Render the React container for settings
			$this->header->header();
			echo '<div class="wrap lmat-styles">';
			echo '<div id="lmat-settings"></div>';
			echo '</div>';
			return;
		}

		// Original logic for lang and strings tabs
		switch ( $this->active_tab ) {
			case 'lang':
				// Prepare the list table of languages
				$list_table = new LMAT_Table_Languages();
				$list_table->prepare_items( $this->model->get_languages_list() );
				break;

			case 'strings':
				$string_table = new LMAT_Table_String( $this->model->get_languages_list() );
				$string_table->prepare_items();
				break;
		}

		// Handle user input
		$action = isset( $_REQUEST['lmat_action'] ) ? sanitize_key( $_REQUEST['lmat_action'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
		if ( 'edit' === $action && ! empty( $_GET['lang'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			// phpcs:ignore WordPress.Security.NonceVerification, VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
			$edit_lang = $this->model->get_language( (int) $_GET['lang'] );
		} else {
			$this->handle_actions( $action );
		}

		// Displays the page
		$modules    = $this->modules;
		$active_tab = $this->active_tab;
		$header = $this->header;
		include __DIR__ . '/../views/view-languages.php';
	}

	/**
	 * Get synchronization options formatted for JavaScript
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of sync options with label and value
	 */
	private function get_sync_options() {
		// Use the static method from LMAT_Settings_Sync to get sync options
		if ( class_exists( 'Linguator\Modules\sync\LMAT_Settings_Sync' ) ) {
			$sync_metas = \Linguator\Modules\sync\LMAT_Settings_Sync::list_metas_to_sync();
			
			// Format for JavaScript consumption
			$formatted_options = array();
			foreach ( $sync_metas as $value => $label ) {
				$formatted_options[] = array(
					'label' => $label,
					'value' => $value,
				);
			}
			
			return $formatted_options;
		}
		
		// Fallback to empty array if class not available
		return array();
	}

	/**
	 * Get language switcher options formatted for JavaScript
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of language switcher options with label and value
	 */
	private function get_language_switcher_options() {
        $language_switcher_options = array(
            array(
                'label' => __( 'Classic (Menu, Widgets) Based', 'linguator-multilingual-ai-translation' ),
                'value' => 'default',
				'subheading' => 'Standard language switcher widget that can be added to widget areas and sidebars.'
            ),
            array(
                'label' => __( 'Block Based', 'linguator-multilingual-ai-translation' ),
                'value' => 'block',
				'subheading' => 'Gutenberg block widget for the block editor, compatible with modern WordPress themes.'
            )
        );
        if(lmat_is_plugin_active('elementor/elementor.php')){
            $language_switcher_options[] = array(
                'label' => __( 'Elementor Widget Based', 'linguator-multilingual-ai-translation' ),
                'value' => 'elementor',
				'subheading' => 'Specialized widget for Elementor page builder with enhanced styling and customization options.'
            );
        }
        return $language_switcher_options;
    }  

	/**
	 * Enqueues scripts and styles
	 *
	 * @return void
	 */
	public function admin_enqueue_scripts() {
		parent::admin_enqueue_scripts();

		// Check if this is a settings tab (not lang, strings, or wizard which has its own handling)
		$is_settings_tab = ! in_array( $this->active_tab, array( 'lang', 'strings', 'wizard' ), true );
		$active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : false;
		$supported_blocks_tab = $is_settings_tab && $active_tab === 'supported-blocks';
		
		if ( $is_settings_tab && (!$active_tab || empty($active_tab) || 'strings' !== $active_tab) && !$supported_blocks_tab) {
			// Enqueue React-based settings for settings tabs
			$asset_file = plugin_dir_path( LINGUATOR_ROOT_FILE ) . 'admin/assets/frontend/settings/settings.asset.php';

			if ( ! file_exists( $asset_file ) ) {
				return;
			}

			$asset = require $asset_file;
			
			$this->header->header_assets();
			// Enqueue header assets

			// Enqueue React-based settings script
			wp_enqueue_script(
				'lmat_settings',
				plugins_url( 'admin/assets/frontend/settings/settings.js', LINGUATOR_ROOT_FILE ),
				$asset['dependencies'],
				$asset['version'],
				true
			);

			// Localize script with settings data
			wp_localize_script(
				'lmat_settings',
				'lmat_settings',
				array(
					'dismiss_notice' => esc_html__( 'Dismiss this notice.', 'linguator-multilingual-ai-translation' ),
					'api_url'        => rest_url( 'lmat/v1/' ),
					'nonce'          => wp_create_nonce( 'wp_rest' ),
					'activate_nonce' => wp_create_nonce( 'activate-plugin_automatic-translator-addon-for-loco-translate/automatic-translator-addon-for-loco-translate.php' ),
					'languages'      => $this->model->get_languages_list(),
					'all_languages'  => self::get_predefined_languages(),
					'home_url'       => get_home_url(),
					'modules'        => ( $this->modules ? array_keys( $this->modules ) : array() ),
					'active_tab'     => $this->active_tab,
					'locoai_plugin_status' => $this->get_locoai_plugin_status(),
					'sync_options'   => $this->get_sync_options(),
					'language_switcher_options' => $this->get_language_switcher_options(),
				)
			);
			wp_localize_script(
				'lmat_settings',
				'lmat_settings_logo_data',
				[
					'logoUrl' => plugin_dir_url(LINGUATOR_ROOT_FILE) . '/assets/logo/',
					'nonce' => wp_create_nonce('wp_rest'),
					'restUrl' => rest_url('lmat/v1/'),
				]
			);

			// Enqueue styles
			wp_enqueue_style(
				'lmat_settings',
				plugins_url( 'admin/assets/css/build/main.css', LINGUATOR_ROOT_FILE ),
				array(),
				LINGUATOR_VERSION
			);

			
		} else if($supported_blocks_tab){
			$this->header->header_assets();

			wp_enqueue_script( 'lmat-datatable-script', plugins_url( 'admin/assets/js/dataTables.min.js', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION, true );
			wp_enqueue_script( 'lmat-datatable-style', plugins_url( 'admin/assets/js/dataTables.min.js', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION, true );
			wp_enqueue_style( 'lmat-custom-data-table', plugins_url( 'admin/assets/css/lmat-custom-data-table.min.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
			wp_enqueue_script( 'lmat-custom-data-table', plugins_url( 'admin/assets/js/lmat-custom-data-table.min.js', LINGUATOR_ROOT_FILE ), array('lmat-datatable-script'), LINGUATOR_VERSION, true );
		}else {
			$this->header->header_assets();

			// Original scripts for lang and strings tabs
			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

			wp_enqueue_script( 'lmat_settings', plugins_url( 'admin/assets/js/build/settings' . $suffix . '.js', LINGUATOR_ROOT_FILE ), array( 'jquery', 'wp-ajax-response', 'postbox', 'jquery-ui-selectmenu', 'wp-hooks' ), LINGUATOR_VERSION, true );
			wp_localize_script( 'lmat_settings', 'lmat_settings', array( 'dismiss_notice' => esc_html__( 'Dismiss this notice.', 'linguator-multilingual-ai-translation' ) ) );

			wp_enqueue_style( 'lmat_selectmenu', plugins_url( 'admin/assets/css/build/selectmenu' . $suffix . '.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
		}

		$this->loco_page_assets();
	}

	/**
	 * Displays a notice when there are objects with no language assigned
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function notice_objects_with_no_lang() {
		if ( ! empty( $this->options['default_lang'] ) && $this->model->get_objects_with_no_lang( 1 ) ) {
			printf(
				'<div class="error"><p>%s <a href="%s">%s</a></p></div>',
				esc_html__( 'There are posts, pages, categories or tags without language.', 'linguator-multilingual-ai-translation' ),
				esc_url( wp_nonce_url( '?page=lmat&lmat_action=content-default-lang&noheader=true', 'content-default-lang' ) ),
				esc_html__( 'You can set them all to the default language.', 'linguator-multilingual-ai-translation' )
			);
		}
	}

	/**
	 * Redirects to language page ( current active tab )
	 * saves error messages in a transient for reuse in redirected page
	 *
	 * @since 1.0.0
	 *
	 * @param array $args query arguments to add to the url
	 * @return void
	 */
	public static function redirect( $args = array() ) {
		$errors = get_settings_errors( 'linguator-multilingual-ai-translation' );
		if ( ! empty( $errors ) ) {
			set_transient( 'lmat_settings_errors', $errors, 30 );
			$args['settings-updated'] = 1;
		}
		// Remove possible 'lmat_action' and 'lang' query args from the referer before redirecting
		wp_safe_redirect( add_query_arg( $args, remove_query_arg( array( 'lmat_action', 'lang' ), wp_get_referer() ) ) );
		exit;
	}

	/**
	 * Get the list of predefined languages
	 *
	 * @since 1.0.0
	 *
	 * @return string[][] {
	 *   An array of array of language properties.
	 *
	 *   @type string[] {
	 *      @type string $code     ISO 639-1 language code.
	 *      @type string $locale   WordPress locale.
	 *      @type string $name     Native language name.
	 *      @type string $dir      Text direction: 'ltr' or 'rtl'.
	 *      @type string $flag     Flag code, generally the country code.
	 *      @type string $w3c      W3C locale.
	 *      @type string $facebook Facebook locale.
	 *   }
	 * }
	 */
	public static function get_predefined_languages() {
		require_once ABSPATH . 'wp-admin/includes/translation-install.php';

		$languages    = include __DIR__ . '/languages.php';
		$translations = wp_get_available_translations();

		// Keep only languages with existing WP language pack
		// Unless the transient has expired and we don't have an internet connection to refresh it
		if ( ! empty( $translations ) ) {
			$translations['en_US'] = ''; // Languages packs don't include en_US
			$languages = array_intersect_key( $languages, $translations );
		}

		/**
		 * Filter the list of predefined languages
		 *
		 * @since 1.0.0
		 * @since 1.0.0 The languages arrays use associative keys instead of numerical keys
		 *
		 * @param array $languages
		 */
		$languages = apply_filters( 'lmat_predefined_languages', $languages );

		// Keep only languages with all necessary information
		foreach ( $languages as $k => $lang ) {
			if ( ! isset( $lang['code'], $lang['locale'], $lang['name'], $lang['dir'], $lang['flag'] ) ) {
				unset( $languages[ $k ] );
			}
		}

		return $languages;
	}

	/**
	 * Check LocoAI plugin installation and activation status.
	 *
	 * @since 1.0.0
	 *
	 * @return array Plugin status information
	 */
	private function get_locoai_plugin_status() {
		// Ensure plugin functions are available
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		
		// Check if plugin is installed
		$plugin_path = 'automatic-translator-addon-for-loco-translate/automatic-translator-addon-for-loco-translate.php';
		$all_plugins = get_plugins();
		$is_installed = isset( $all_plugins[ $plugin_path ] );
		
		// Check if plugin is active
		$is_active = is_plugin_active( $plugin_path );
		return array(
			'installed' => $is_installed,
			'active'    => $is_active,
			'status'    => $is_active ? 'active' : ( $is_installed ? 'installed' : 'not_installed' )
		);
	}
}
