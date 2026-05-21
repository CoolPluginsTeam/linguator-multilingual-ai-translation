<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Core;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly
}

use Linguator\Includes\Base\Linguator_Base;
use Linguator\Includes\Options\Options;
use Linguator\Includes\Options\Registry as Options_Registry;
use Linguator\Includes\Other\Linguator_OLT_Manager;
use Linguator\Includes\Other\Linguator_Model;
use Linguator\Admin\Controllers\Linguator_Admin_Model;
use Linguator\Admin\Controllers\Linguator_Admin;
use Linguator\Frontend\Controllers\Linguator_Frontend;
use Linguator\Includes\Controllers\Linguator_REST_Request;
use Linguator\Integrations\Linguator_Integrations;
use Linguator\Settings\Controllers\Linguator_Settings;
use Linguator\Supported_Blocks\Supported_Blocks;
use Linguator\Supported_Blocks\Custom_Block_Post;
use Linguator\Custom_Fields\Custom_Fields;
use Linguator\Includes\Other\Linguator_Translation_Dashboard;

// Define directory safely
if ( ! defined( 'LMAT_LOCAL_DIR' ) ) {
	$lmat_upload_dir = wp_upload_dir();

	if ( empty( $lmat_upload_dir['basedir'] ) || ! empty( $lmat_upload_dir['error'] ) ) {
		// Fallback (may vary if custom uploads path is used)
		$lmat_base_dir = path_join( wp_content_dir(), 'uploads' );
	} else {
		$lmat_base_dir = $lmat_upload_dir['basedir'];
	}

	define( 'LMAT_LOCAL_DIR', path_join( $lmat_base_dir, 'linguator' ) );
}

// Ensure directory exists
if ( ! file_exists( LMAT_LOCAL_DIR ) ) {
	wp_mkdir_p( LMAT_LOCAL_DIR );
}

// Load config safely
$lmat_config = array();

$lmat_config_file = path_join( LMAT_LOCAL_DIR, 'lmat-config.json' );

if ( is_readable( $lmat_config_file ) ) {

	if ( function_exists( 'wp_json_file_decode' ) ) {
		$lmat_decoded = wp_json_file_decode( $lmat_config_file, array( 'associative' => true ) );
	} else {
		$lmat_content = file_get_contents( $lmat_config_file );
		$lmat_decoded = ( is_string( $lmat_content ) && $lmat_content !== '' )
			? json_decode( $lmat_content, true )
			: null;
	}

	if ( is_array( $lmat_decoded ) ) {
		$lmat_config = $lmat_decoded;
	}
}

/**
 * Raw JSON config loaded from `LMAT_LOCAL_DIR/lmat-config.json`.
 *
 * Allow third parties to adjust/augment the local config.
 *
 * @param array<string,mixed> $lmat_config Local config array.
 */
$GLOBALS['lmat_local_config'] = apply_filters( 'lmat_local_config', $lmat_config );

/**
 * Controls the plugin, as well as activation, and deactivation
 *
 *  
 *
 * @template TLMATClass of Linguator_Base
 */
class Linguator {

	/**
	 * @var Linguator_Admin_Feedback|null
	 */
	public $feedback;
	/**
	 * @var CPFM_Feedback_Notice|null
	 */
	public $cpfm_feedback_notice;

	/**
	 * @var Linguator_cronjob|null
	 */
	public $linguator_cronjob;

	/**
	 * @var Options|null
	 */
	public $options;

	/**
	 * Constructor
	 *
	 *  
	 */
	public function __construct() {
		require_once __DIR__ . '/../helpers/functions.php'; // VIP functions

		// Plugin initialization
		// Take no action before all plugins are loaded
		add_action( 'plugins_loaded', array( $this, 'init' ), 1 );

		// Override load text domain waiting for the language to be defined
		// Here for plugins which load text domain as soon as loaded :(
		if ( ! defined( 'LMAT_OLT' ) || LMAT_OLT ) {
			Linguator_OLT_Manager::instance();
		}

		// Register the custom post type for the supported blocks
		if(class_exists(Custom_Block_Post::class)){
			Custom_Block_Post::get_instance();
		}

		if(class_exists(Supported_Blocks::class)){
			Supported_Blocks::get_instance();
		}

		// Register the custom fields
		if(class_exists(Custom_Fields::class)){
			Custom_Fields::get_instance();
		}

		// Register the translation dashboard
		if(class_exists(Linguator_Translation_Dashboard::class)){
			Linguator_Translation_Dashboard::get_instance();
		}

		// Initialize feedback functionality
		$this->feedback = new \Linguator\Admin\Feedback\Linguator_Admin_Feedback( $this );
		$this->cpfm_feedback_notice = new \Linguator\Admin\cpfm_feedback\CPFM_Feedback_Notice();
		$this->linguator_cronjob = new \Linguator\Admin\cpfm_feedback\cron\Linguator_cronjob();
		add_action('cpfm_register_notice', function () {

			if (!class_exists('Linguator\Admin\cpfm_feedback\CPFM_Feedback_Notice') || !current_user_can('manage_options')) {
				return;
			}
			$notice = [
				'title' => __('Linguator – Multilingual AI Translation', 'linguator-multilingual-ai-translation'),
				'message' => __('Help us make this plugin more compatible with your site by sharing non-sensitive site data.', 'linguator-multilingual-ai-translation'),
				'pages' => ['lmat_settings'],
				'always_show_on' => ['lmat_settings'], // This enables auto-show
				'plugin_name'=>'lmat',
				
			];
			\Linguator\Admin\cpfm_feedback\CPFM_Feedback_Notice::cpfm_register_notice('lmat', $notice);
				if (!isset($GLOBALS['cool_plugins_feedback'])) {
					// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
					$GLOBALS['cool_plugins_feedback'] = [];
				}
				// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
				$GLOBALS['cool_plugins_feedback']['lmat'][] = $notice;
	   
		});
		add_action('cpfm_after_opt_in_lmat', function($category) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
			if ($category === 'lmat') {
				// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
				\Linguator\Admin\cpfm_feedback\cron\Linguator_cronjob::linguator_send_data();
			}
		});


		/*
		 * Loads the compatibility with some plugins and themes.
		 * Loaded as soon as possible as we may need to act before other plugins are loaded.
		 */
		if ( ! defined( 'LMAT_PLUGINS_COMPAT' ) || LMAT_PLUGINS_COMPAT ) {
			Linguator_Integrations::instance();
		}
	}

	/**
	 * Tells whether the current request is an ajax request on frontend or not
	 *
	 *  
	 *
	 * @return bool
	 */
	public static function is_ajax_on_front() {
		// Special test for plupload which does not use jquery ajax and thus does not pass our ajax prefilter
		// Special test for customize_save done in frontend but for which we want to load the admin
		// Special test for Elementor actions which should be treated as admin/backend operations
		$excluded_actions = array( 'upload-attachment', 'customize_save' );
		
		// Add Elementor-specific actions that should be treated as backend
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only parameter for filtering
		if ( isset( $_REQUEST['action'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only parameter for filtering
			$action = sanitize_key( wp_unslash( $_REQUEST['action'] ) );
			// Check for Elementor actions - these should be treated as admin operations
			if ( strpos( $action, 'elementor' ) !== false || 
				 in_array( $action, array( 'heartbeat' ) ) ) {
				$excluded_actions[] = $action;
			}
		}
		
		$in = isset( $_REQUEST['action'] ) && in_array( sanitize_key( wp_unslash( $_REQUEST['action'] ) ), $excluded_actions ); // phpcs:ignore WordPress.Security.NonceVerification
		// Treat presence of lmat_ajax_backend as "backend" ajax.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only routing flag.
		$lmat_ajax_backend = isset( $_REQUEST['lmat_ajax_backend'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['lmat_ajax_backend'] ) ) : '';

		$is_ajax_on_front = wp_doing_ajax() && '' === $lmat_ajax_backend && ! $in;

		/**
		 * Filters whether the current request is an ajax request on front.
		 *
		 *  
		 *
		 * @param bool $is_ajax_on_front Whether the current request is an ajax request on front.
		 */
		return apply_filters( 'lmat_is_ajax_on_front', $is_ajax_on_front );
	}

	/**
	 * Is the current request a REST API request?
	 * Inspired by WP::parse_request()
	 * Needed because at this point, the constant REST_REQUEST is not defined yet
	 *
	 *  
	 *
	 * @return bool
	 */
	public static function is_rest_request() {
		// Handle pretty permalinks.
		$home_path       = trim( (string) wp_parse_url( home_url(), PHP_URL_PATH ), '/' );
		$home_path_regex = sprintf( '|^%s|i', preg_quote( $home_path, '|' ) );

		$req_uri = trim( (string) wp_parse_url( linguator_get_requested_url(), PHP_URL_PATH ), '/' );
		$req_uri = (string) preg_replace( $home_path_regex, '', $req_uri );
		$req_uri = trim( $req_uri, '/' );
		$req_uri = str_replace( 'index.php', '', $req_uri );
		$req_uri = trim( $req_uri, '/' );

		// And also test rest_route query string parameter is not empty for plain permalinks.
		$query_string = array();
		wp_parse_str( (string) wp_parse_url( linguator_get_requested_url(), PHP_URL_QUERY ), $query_string );
		$rest_route = isset( $query_string['rest_route'] ) && is_string( $query_string['rest_route'] ) ? trim( $query_string['rest_route'], '/' ) : false;

		return 0 === strpos( $req_uri, rest_get_url_prefix() . '/' ) || ! empty( $rest_route );
	}

	/**
	 * Tells if we are in the wizard process.
	 *
	 *  
	 *
	 * @return bool
	 */
	public static function is_wizard() {
		return isset( $_GET['page'] ) && ! empty( $_GET['page'] ) && 'lmat_wizard' === sanitize_key( wp_unslash( $_GET['page'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
	}

	/**
	 * Defines constants
	 * May be overridden by a plugin if set before plugins_loaded, 1
	 *
	 *  
	 *
	 * @return void
	 */
	public static function define_constants() {
		// Cookie name. no cookie will be used if set to false
		if ( ! defined( 'LMAT_COOKIE' ) ) {
			define( 'LMAT_COOKIE', 'lmat_language' );
		}



		// Admin
		if ( ! defined( 'LMAT_ADMIN' ) ) {
			define( 'LMAT_ADMIN', wp_doing_cron() || ( defined( 'WP_CLI' ) && WP_CLI ) || ( is_admin() && ! self::is_ajax_on_front() ) );
		}

		// Settings page whatever the tab except for the wizard which needs to be an admin process.
		if ( ! defined( 'LMAT_SETTINGS' ) ) {
			define( 'LMAT_SETTINGS', is_admin() && ( ( isset( $_GET['page'] ) && 0 === strpos( sanitize_key( wp_unslash( $_GET['page'] ) ), 'lmat' ) && ! self::is_wizard() ) || ! empty( $_REQUEST['lmat_ajax_settings'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification
		}
	}

	/**
	 * Linguator initialization
	 * setups models and separate admin and frontend
	 *
	 *  
	 *
	 * @return void
	 */
	public function init() {
		self::define_constants();

		// Plugin options.
		add_action( 'lmat_init_options_for_blog', array( Options_Registry::class, 'register' ) );
		$options = new Options();

		// Set current version
		$options['version'] = LINGUATOR_VERSION;
		/**
		 * Filter the model class to use
		 * /!\ this filter is fired *before* the $linguator object is available
		 *
		 *  
		 *
		 * @param string $class either Linguator_Model or Linguator_Admin_Model
		 */
		$class = apply_filters( 'lmat_model', LMAT_SETTINGS || self::is_wizard() ? 'Linguator_Admin_Model' : 'Linguator_Model' );
		
		// Handle namespaced classes for dynamic instantiation
		if ( 'Linguator_Admin_Model' === $class ) {
			$class = Linguator_Admin_Model::class;
		} elseif ( 'Linguator_Model' === $class ) {
			$class = Linguator_Model::class;
		}
		
		/** @var Linguator_Model $model */
		$model = new $class( $options );

		if ( ! $model->has_languages() ) {
			/**
			 * Fires when no language has been defined yet
			 * Used to load overridden textdomains
			 *
			 *  
			 */
			do_action( 'lmat_no_language_defined' );
		}

		$class = '';

		if ( LMAT_SETTINGS ) {
			$class = 'Linguator_Settings';
		} elseif ( LMAT_ADMIN ) {
			$class = 'Linguator_Admin';
		} elseif ( self::is_rest_request() ) {
			$class = 'Linguator_REST_Request';
		} elseif ( $model->has_languages() ) {
			$class = 'Linguator_Frontend';
		}

		/**
		 * Filters the class to use to instantiate the $linguator object
		 *
		 *  
		 *
		 * @param string $class A class name.
		 */
		$class = apply_filters( 'lmat_context', $class );

		if ( ! empty( $class ) ) {
			// Handle namespaced classes for dynamic instantiation
			if ( 'Linguator_Admin' === $class ) {
				$class = Linguator_Admin::class;
			} elseif ( 'Linguator_Frontend' === $class ) {
				$class = Linguator_Frontend::class;
			} elseif ( 'Linguator_Settings' === $class ) {
				$class = Linguator_Settings::class;
			} elseif ( 'Linguator_REST_Request' === $class ) {
				$class = Linguator_REST_Request::class;
			}
			
			/** @phpstan-var class-string<TLMATClass> $class */
			$this->init_context( $class, $model );
		}
	}

	/**
	 * Linguator initialization.
	 * Setups the Linguator Context, loads the modules and init Linguator.
	 *
	 *  
	 *
	 * @param string    $class The class name.
	 * @param Linguator_Model $model Instance of Linguator_Model.
	 * @return Linguator_Base
	 *
	 * @phpstan-param class-string<TLMATClass> $class
	 * @phpstan-return TLMATClass
	 */
	public function init_context( string $class, Linguator_Model $model ): Linguator_Base {
		global $linguator;

		$links_model = $model->get_links_model();
		$linguator    = new $class( $links_model );
		
		// Set the options property for backward compatibility
		$linguator->options = $model->options;

		/**
		 * Fires after Linguator's model init.
		 * This is the best place to register a custom table (see `Linguator_Model`'s constructor).
		 * /!\ This hook is fired *before* the $linguator object is available.
		 * /!\ The languages are also not available yet.
		 *
		 *  
		 *
		 * @param Linguator_Model $model Linguator model.
		 */
		do_action( 'lmat_model_init', $model );

		$model->maybe_create_language_terms();

		/**
		 * Fires after the $linguator object is created and before the API is loaded
		 *
		 *  
		 *
		 * @param object $linguator
		 */
		do_action_ref_array( 'lmat_pre_init', array( &$linguator ) );

		// Loads the API
		require_once LINGUATOR_DIR . '/includes/api/language-api.php';

		// Loads the modules.
		// Loads the modules.
		$load_scripts = require LINGUATOR_DIR . '/modules/module-build.php';

		foreach ( $load_scripts as $load_script ) {
			if(file_exists(LINGUATOR_DIR . "/modules/{$load_script}/load.php")) {
				require_once LINGUATOR_DIR . "/modules/{$load_script}/load.php";
			}
		}
		
		$linguator->init();
		/**
		 * Fires after the $linguator object and the API is loaded
		 *
		 *  
		 *
		 * @param object $linguator
		 */
		do_action_ref_array( 'lmat_init', array( &$linguator ) );

			return $linguator;
}
}


