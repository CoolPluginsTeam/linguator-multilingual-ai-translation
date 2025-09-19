<?php

/**
 * @package Linguator
 */

namespace Linguator\Modules\Wizard;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Admin\Controllers\LMAT_Admin_Notices;
use Linguator\Includes\Other\LMAT_Language;
use Linguator\Admin\Controllers\LMAT_Admin_Model;
use Linguator\Includes\Core\Linguator;
use WP_Error;



use Linguator\Includes\Options\Options;

/**
 * Main class for Linguator wizard.
 *
 *  
 */
class LMAT_Wizard
{
	/**
	 * Reference to the model object
	 *
	 * @var LMAT_Admin_Model
	 */
	protected $model;

	/**
	 * Reference to the Linguator options array.
	 *
	 * @var array
	 */
	protected $options;

	/**
	 * Steps configuration for the wizard
	 *
	 * @var array
	 */
	protected $steps;

	/**
	 * Current step in the wizard
	 *
	 * @var string
	 */
	protected $current_step;

	/**
	 * CSS styles for the wizard
	 *
	 * @var array
	 */
	protected $styles;


	/**
	 * Constructor
	 *
	 * @param object $linguator Reference to Linguator global object.
	 *  
	 */
	public function __construct(&$linguator)
	{
		$this->options = &$linguator->options;
		$this->model   = &$linguator->model;

		// Add admin menu for wizard page
		add_action('admin_menu', array($this, 'add_admin_menu'));
		
		// Setup wizard page handling 
		add_action('admin_init', array($this, 'setup_wizard_page'), 40);

		// Add Wizard submenu.
		add_filter('lmat_settings_tabs', array($this, 'settings_tabs'), 10, 1);
		// Add filter to select screens where to display the notice.
		add_filter('lmat_can_display_notice', array($this, 'can_display_notice'), 10, 2);
	}

	/**
	 * Add admin menu item for the wizard
	 *
	 *  
	 * @return void
	 */
	public function add_admin_menu()
	{
		// Add the wizard page as a top-level admin menu item (hidden from menu)
		add_menu_page(
			esc_html__('Linguator Setup Wizard', 'linguator-multilingual-ai-translation'),
			esc_html__('Linguator Setup', 'linguator-multilingual-ai-translation'),
			'manage_options',
			'lmat_wizard',
			array($this, 'display_wizard_page'),
			'dashicons-translation',
			null
		);
		
		// Remove from admin menu to hide it (we only want it accessible via direct URL)
		remove_menu_page('lmat_wizard');
	}

	/**
	 * Save an activation transient when Linguator is activating to redirect to the wizard
	 *
	 *  
	 *
	 * @param bool $network_wide if activated for all sites in the network.
	 * @return void
	 */
	public static function start_wizard($network_wide)
	{
		$options = (array) get_option(Options::OPTION_NAME, array());

		if (wp_doing_ajax() || $network_wide || ! empty($options['version'])) {
			return;
		}
		set_transient('lmat_activation_redirect', 1, 30);
	}

	/**
	 * Redirect to the wizard depending on the context
	 *
	 *  
	 *
	 * @return void
	 */
	public function redirect_to_wizard()
	{
		if (get_transient('lmat_activation_redirect')) {
			$do_redirect = true;
			if ((isset($_GET['page']) && 'lmat_wizard' === sanitize_key($_GET['page'])) || isset($_GET['activate-multi'])) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				delete_transient('lmat_activation_redirect');
				$do_redirect = false;
			}

			if ($do_redirect) {
				wp_safe_redirect(
					sanitize_url(
						add_query_arg(
							array(
								'page' => 'lmat_wizard',
							),
							admin_url('admin.php')
						)
					)
				);
				exit;
			}
		}
	}

	/**
	 * Add an admin Linguator submenu to access the wizard
	 *
	 *  
	 *
	 * @param string[] $tabs Submenus list.
	 * @return string[] Submenus list updated.
	 */
	public function settings_tabs($tabs)
	{
		$tabs['wizard'] = esc_html__('Setup', 'linguator-multilingual-ai-translation');
		return $tabs;
	}

	/**
	 * Returns true if the media step is displayable, false otherwise.
	 *
	 *  
	 *
	 * @param LMAT_Language[] $languages List of language objects.
	 * @return bool
	 */
	public function is_media_step_displayable($languages)
	{
		$media = array();
		// If there is no language or only one the media step is displayable.
		if (! $languages || count($languages) < 2) {
			return true;
		}
		foreach ($languages as $language) {
			$media[$language->slug] = $this->model->count_posts(
				$language,
				array(
					'post_type'   => array('attachment'),
					'post_status' => 'inherit',
				)
			);
		}
		return count(array_filter($media)) === 0;
	}


	/**
	 * Setup the wizard page
	 *
	 *  
	 *
	 * @return void
	 */
	public function setup_wizard_page()
	{

		if (!get_option('lmat_setup_complete')) {
			LMAT_Admin_Notices::add_notice('wizard', $this->wizard_notice());
		}

		$this->redirect_to_wizard();
		if (! Linguator::is_wizard()) {
			return;
		}

		// Enqueue scripts and styles especially for the wizard.
		add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
	}

	/**
	 * Adds some admin screens where to display the wizard notice
	 *
	 *  
	 *
	 * @param bool   $can_display_notice Whether the notice can be displayed.
	 * @param string $notice             The notice name.
	 * @return bool
	 */
	public function can_display_notice($can_display_notice, $notice)
	{
		if (! $can_display_notice && 'wizard' === $notice) {
			$screen = get_current_screen();
			$can_display_notice = ! empty($screen) && in_array(
				$screen->base,
				array(
					'edit',
					'upload',
					'options-general',
				)
			);
		}
		return $can_display_notice;
	}

	/**
	 * Return html code of the wizard notice
	 *
	 *  
	 *
	 * @return string
	 */
	public function wizard_notice()
	{
		ob_start();
		include __DIR__ . '/html-wizard-notice.php';
		return ob_get_clean();
	}


	/**
	 * Get language switcher options formatted for JavaScript
	 *
	 *  
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
	 * Display the wizard page
	 *
	 *  
	 *
	 * @return void
	 */
	public function display_wizard_page()
	{
		// Check permissions
		if (! current_user_can('manage_options')) {
			wp_die(esc_html__('Sorry, you are not allowed to manage options for this site.', 'linguator-multilingual-ai-translation'));
		}

		$steps          = $this->steps;
		$current_step   = $this->current_step;
		$styles         = $this->styles;
		include __DIR__ . '/view-wizard-page.php';
	}

	/**
	 * Enqueue scripts and styles for the wizard
	 *
	 *  
	 *
	 * @return void
	 */
	public function enqueue_scripts()
	{
		if (Linguator::is_wizard()) {
			// Enqueue React-based settings for settings tabs
			$asset_file = plugin_dir_path(LINGUATOR_ROOT_FILE) . 'admin/assets/frontend/setup/setup.asset.php';
			$asset = require $asset_file;
			$languages = $this->model->get_languages_list();
			$home_page_id = get_option('page_on_front');
			$home_page_language = $this->model->post->get_language($home_page_id);
			$translations = $this->model->post->get_translations($home_page_id);
			$is_media_step_displayable = $this->is_media_step_displayable($languages);
			$is_home_page_displayable = $home_page_id > 0 && (! $languages || count($languages) === 1 || count($translations) !== count($languages));
			$is_untranslated_contents_displayable = ! $this->model->has_languages() || $this->model->get_objects_with_no_lang(1);
			$home_languages = $this->model->languages->get_list();
			$home_page_languages = [];
			foreach ($home_languages as $language) {
				if ($this->model->post->get($home_page_id, $language)) {
					array_push(
						$home_page_languages,
						$language
					);
				}
			}
			$home_page_data = [
				"static_page" => $home_page_id > 0 ? get_post($home_page_id) : null,
				"static_page_language"=> $home_page_language,
				"static_page_languages" => $home_page_languages
			];
			// Enqueue React-based settings script
			wp_enqueue_script(
				'lmat_setup',
				plugins_url('admin/assets/frontend/setup/setup.js', LINGUATOR_ROOT_FILE),
				$asset['dependencies'],
				$asset['version'],
				true
			);

			// Provide ajaxurl previously added inline in the view
			wp_add_inline_script(
				'lmat_setup',
				'var ajaxurl = ' . wp_json_encode( esc_url( admin_url( 'admin-ajax.php', 'relative' ) ) ) . ';',
				'before' // Add the script before the main script
			);

			// Localize script with settings data
			wp_localize_script(
				'lmat_setup',
				'lmat_setup',
				array(
					'dismiss_notice' => esc_html__('Dismiss this notice.', 'linguator-multilingual-ai-translation'),
					'api_url'        => rest_url('lmat/v1/'),
					'nonce'          => wp_create_nonce('wp_rest'),
					'languages'      => $this->model->get_languages_list(),
					'all_languages'  => \Linguator\Settings\Controllers\LMAT_Settings::get_predefined_languages(),
					'media'          => $is_media_step_displayable,
					'untranslated_contents' => $is_untranslated_contents_displayable,
					'home_page' => $is_home_page_displayable,
					'admin_url' => get_admin_url(),
					'home_url'       => get_home_url(),
					'home_page_data' => $home_page_data,
					'language_switcher_options' => $this->get_language_switcher_options(),
				)
			);

			wp_localize_script(
				'lmat_setup',
				'lmat_setup_flag_data',
				[
					'flagsUrl' => plugin_dir_url(LINGUATOR_ROOT_FILE) . '/assets/flags/',
					'nonce' => wp_create_nonce('wp_rest'),
					'restUrl' => rest_url('lmat/v1/'),
				]
			);
			// Enqueue styles
			wp_enqueue_style(
				'lmat_setup',
				plugins_url('admin/assets/css/build/main.css', LINGUATOR_ROOT_FILE),
				array(),
				LINGUATOR_VERSION
			);
		}
	}

	/**
	 * Get the suffix to enqueue non minified files in a Debug context
	 *
	 *  
	 *
	 * @return string Empty when SCRIPT_DEBUG equal to true
	 *                otherwise .min
	 */
	public function get_suffix()
	{
		return defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : '.min';
	}













	/**
	 * Create home page translations for each language defined.
	 *
	 *  
	 *
	 * @param string   $default_language       Slug of the default language; null if no default language is defined.
	 * @param int      $home_page              Post ID of the home page if it's defined, false otherwise.
	 * @param string   $home_page_title        Home page title if it's defined, 'Homepage' otherwise.
	 * @param string   $home_page_language     Slug of the home page if it's defined, false otherwise.
	 * @param string[] $untranslated_languages Array of languages which needs to have a home page translated.
	 * @return void
	 */
	public function create_home_page_translations($default_language, $home_page, $home_page_title, $home_page_language, $untranslated_languages)
	{
		$translations = $this->model->post->get_translations($home_page);

		foreach ($untranslated_languages as $language) {
			$language_properties = $this->model->get_language($language);
			$id = wp_insert_post(
				array(
					'post_title'  => $home_page_title . ' - ' . $language_properties->name,
					'post_type'   => 'page',
					'post_status' => 'publish',
				)
			);
			$translations[$language] = $id;
			lmat_set_post_language($id, $language);
		}
		lmat_save_post_translations($translations);
	}
}
