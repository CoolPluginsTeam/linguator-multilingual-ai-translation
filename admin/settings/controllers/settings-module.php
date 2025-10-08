<?php
/**
 * @package Linguator
 */
namespace Linguator\Settings\Controllers;
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use WP_Error;
use WP_Ajax_Response;
use Linguator\Includes\Options\Options;


/**
 * Base class for all settings
 *
 *  
 */
class LMAT_Settings_Module {
	/**
	 * Stores the plugin options.
	 *
	 * @var Options
	 */
	public $options;

	/**
	 * @var LMAT_Model
	 */
	public $model;

	/**
	 * Instance of a child class of LMAT_Links_Model.
	 *
	 * @var LMAT_Links_Model
	 */
	public $links_model;

	/**
	 * Key to use to manage the module activation state.
	 * Possible values:
	 * - An option key for a module that can be activated/deactivated.
	 * - 'none' for a module that doesn't have a activation/deactivation setting.
	 *
	 * @var string
	 *
	 * @phpstan-var non-falsy-string
	 */
	public $active_option;

	/**
	 * Stores the display order priority.
	 *
	 * @var int
	 */
	public $priority = 100;

	/**
	 * Stores the module name.
	 * It must be unique.
	 *
	 * @var string
	 *
	 * @phpstan-var non-falsy-string
	 */
	public $module;

	/**
	 * Stores the module title.
	 *
	 * @var string
	 */
	public $title;

	/**
	 * Stores the module description.
	 *
	 * @var string
	 */
	public $description;

	/**
	 * Stores the settings actions.
	 *
	 * @var array
	 */
	protected $action_links;

	/**
	 * Stores html fragment for the buttons.
	 *
	 * @var array
	 */
	protected $buttons;

	/**
	 * Stores html form when provided by a child class.
	 *
	 * @var string|false
	 */
	protected $form = false;

	/**
	 * Constructor
	 *
	 *  
	 *
	 * @param object $linguator The Linguator object.
	 * @param array  $args {
	 *   @type string $module        Unique module name.
	 *   @type string $title         The title of the settings module.
	 *   @type string $description   The description of the settings module.
	 *   @type string $active_option Optional. Key to use to manage the module activation state.
	 *                               Possible values:
	 *                               - An option key for a module that can be activated/deactivated.
	 *                               - 'none' for a module that doesn't have a activation/deactivation setting.
	 *                               - 'preview' for a preview module whose functionalities are available in the Pro version.
	 *                               Default is 'none'.
	 * }
	 *
	 * @phpstan-param array{
	 *   module: non-falsy-string,
	 *   title: string,
	 *   description: string,
	 *   active_option?: non-falsy-string
	 * } $args
	 */
	public function __construct( &$linguator, $args ) {
		$this->options     = &$linguator->options;
		$this->model       = &$linguator->model;
		$this->links_model = &$linguator->links_model;

		$args = wp_parse_args(
			$args,
			array(
				'title'         => '',
				'description'   => '',
				'active_option' => 'none',
			)
		);


		foreach ( $args as $prop => $value ) {
			$this->$prop = $value;
		}

		// All possible action links, even if not always a link ;-)
		$this->action_links = array(
			'configure'   => sprintf(
				'<a title="%s" href="%s">%s</a>',
				esc_attr__( 'Configure this module', 'linguator-multilingual-ai-translation' ),
				'#',
				esc_html__( 'Settings', 'linguator-multilingual-ai-translation' )
			),
			'deactivate'  => sprintf(
				'<a title="%s" href="%s">%s</a>',
				esc_attr__( 'Deactivate this module', 'linguator-multilingual-ai-translation' ),
				esc_url( wp_nonce_url( '?page=lmat&tab=modules&lmat_action=deactivate&noheader=true&module=' . $this->module, 'lmat_deactivate' ) ),
				esc_html__( 'Deactivate', 'linguator-multilingual-ai-translation' )
			),
			'activate'    => sprintf(
				'<a title="%s" href="%s">%s</a>',
				esc_attr__( 'Activate this module', 'linguator-multilingual-ai-translation' ),
				esc_url( wp_nonce_url( '?page=lmat&tab=modules&lmat_action=activate&noheader=true&module=' . $this->module, 'lmat_activate' ) ),
				esc_html__( 'Activate', 'linguator-multilingual-ai-translation' )
			),
			'activated'   => esc_html__( 'Activated', 'linguator-multilingual-ai-translation' ),
			'deactivated' => esc_html__( 'Deactivated', 'linguator-multilingual-ai-translation' ),
		);

		$this->buttons = array(
			'cancel' => sprintf( '<button type="button" class="button button-secondary cancel">%s</button>', esc_html__( 'Cancel', 'linguator-multilingual-ai-translation' ) ),
			'save'   => sprintf( '<button type="button" class="button button-primary save">%s</button>', esc_html__( 'Save Changes', 'linguator-multilingual-ai-translation' ) ),
		);

		// Ajax action to save options.
		add_action( 'wp_ajax_lmat_save_options', array( $this, 'save_options' ) );
	}

	/**
	 * Tells if the module is active.
	 *
	 *  
	 *
	 * @return bool
	 */
	public function is_active() {
		return 'none' === $this->active_option || ( 'preview' !== $this->active_option && ! empty( $this->options[ $this->active_option ] ) );
	}

	/**
	 * Activates the module.
	 *
	 *  
	 *
	 * @return void
	 */
	public function activate() {
		if ( 'none' !== $this->active_option && 'preview' !== $this->active_option ) {
			$this->options[ $this->active_option ] = true;
		}
	}

	/**
	 * Deactivates the module.
	 *
	 *  
	 *
	 * @return void
	 */
	public function deactivate() {
		if ( 'none' !== $this->active_option && 'preview' !== $this->active_option ) {
			$this->options[ $this->active_option ] = false;
		}
	}

	/**
	 * Protected method to display a configuration form.
	 *
	 *  
	 *
	 * @return void
	 */
	protected function form() {
		// Child classes can provide a form.
	}

	/**
	 * Public method returning the form if any.
	 *
	 *  
	 *
	 * @return string
	 */
	public function get_form() {
		if ( ! $this->is_active() ) {
			return '';
		}

		// Read the form only once
		if ( false === $this->form ) {
			ob_start();
			$this->form();
			$this->form = ob_get_clean();
		}

		return $this->form;
	}

	/**
	 * Allows child classes to prepare the received data before saving.
	 *
	 *  
	 *
	 * @param array $options Raw values to save.
	 * @return array
	 */
	protected function prepare_raw_data( array $options ): array {
		return $options;
	}

	/**
	 * Ajax method to save the options.
	 *
	 *  
	 *
	 * @return void
	 */
	public function save_options() {
		check_ajax_referer( 'lmat_options', '_lmat_nonce' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( -1 );
		}

		if ( isset( $_POST['module'] ) && $this->module === $_POST['module'] ) {
			// It's up to the child class to decide which options are saved, whether there are errors or not
			$posted_options   = array_diff_key( map_deep( $_POST, 'sanitize_text_field' ), array_flip( array( 'action', 'module', 'lmat_ajax_backend', 'lmat_ajax_settings', '_lmat_nonce' ) ) );
			$errors           = $this->options->merge( $this->prepare_raw_data( $posted_options ) );

			// Refresh language cache in case home urls have been modified
			$this->model->clean_languages_cache();

			// Refresh rewrite rules in case rewrite, hide_default, post types or taxonomies options have been modified
			// Don't use flush_rewrite_rules as we don't have the right links model and permastruct
			delete_option( 'rewrite_rules' );

			$notice_html = '';

			if ( ! $errors->has_errors() ) {
				// Send update message
				lmat_add_notice( new WP_Error( 'settings_updated', __( 'Settings saved.', 'linguator-multilingual-ai-translation' ), 'success' ) );
				$notice_html = $this->render_settings_errors_html( 'linguator' );
				$x = new WP_Ajax_Response( array( 'what' => 'success', 'data' => $notice_html ) );
				$x->send();
			} else {
				// Send error messages
				lmat_add_notice( $errors );
				$notice_html = $this->render_settings_errors_html( 'linguator' );
				$x = new WP_Ajax_Response( array( 'what' => 'error', 'data' => $notice_html ) );
				$x->send();
			}
		}
	}

	/**
	 * Renders settings errors HTML without relying on output buffering.
	 *
	 *  
	 *
	 * @param string $setting Settings group name used with add_settings_error/get_settings_errors.
	 * @return string HTML markup for admin notices.
	 */
	protected function render_settings_errors_html( $setting ) {
		$errors = \get_settings_errors( $setting );
		if ( empty( $errors ) ) {
			return '';
		}

		$html = '';
		foreach ( $errors as $error ) {
			$type  = isset( $error['type'] ) && is_string( $error['type'] ) ? $error['type'] : 'error';
			$class = 'notice notice-' . $type;
			if ( ! empty( $error['dismissible'] ) ) {
				$class .= ' is-dismissible';
			}

			$message = isset( $error['message'] ) && is_string( $error['message'] ) ? $error['message'] : '';
			$html   .= '<div class="' . \esc_attr( $class ) . '"><p>' . \wp_kses_post( $message ) . '</p></div>';
		}

		return $html;
	}

	/**
	 * Get the row actions.
	 *
	 *  
	 *
	 * @return string[]
	 */
	protected function get_actions() {
		$actions = array();

		if ( $this->is_active() && $this->get_form() ) {
			$actions[] = 'configure';
		}

		if ( 'none' !== $this->active_option && 'preview' !== $this->active_option ) {
			$actions[] = $this->is_active() ? 'deactivate' : 'activate';
		}

		if ( empty( $actions ) ) {
			$actions[] = $this->is_active() ? 'activated' : 'deactivated';
		}

		return $actions;
	}

	/**
	 * Get the actions links.
	 *
	 *  
	 *
	 * @return string[] Action links.
	 */
	public function get_action_links() {
		return array_intersect_key( $this->action_links, array_flip( $this->get_actions() ) );
	}

	/**
	 * Get the buttons.
	 *
	 *  
	 *
	 * @return string[] An array of html fragment for the buttons.
	 */
	public function get_buttons() {
		return $this->buttons;
	}
}
