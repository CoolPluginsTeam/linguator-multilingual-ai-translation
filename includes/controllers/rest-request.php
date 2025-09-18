<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Base\LMAT_Base;
use Linguator\Includes\Helpers\LMAT_Default_Term;
use Linguator\Includes\Filters\LMAT_Filters;
use Linguator\Includes\Filters\LMAT_Filters_Links;
use Linguator\Includes\Filters\LMAT_Filters_Widgets_Options;
use Linguator\Admin\Controllers\LMAT_Admin_Links;
use Linguator\Frontend\Controllers\LMAT_Frontend_Nav_Menu;



/**
 * Main Linguator class for REST API requests, accessible from @see LMAT().
 *
 * @since 1.0.0
 */
#[AllowDynamicProperties]
class LMAT_REST_Request extends LMAT_Base {
	/**
	 * @var LMAT_Language|false|null A `LMAT_Language` when defined, `false` otherwise. `null` until the language
	 *                              definition process runs.
	 */
	public $curlang;

	/**
	 * @var LMAT_Default_Term|null
	 */
	public $default_term;

	/**
	 * @var LMAT_Filters|null
	 */
	public $filters;

	/**
	 * @var LMAT_Filters_Links|null
	 */
	public $filters_links;

	/**
	 * @var LMAT_Admin_Links|null
	 */
	public $links;

	/**
	 * @var LMAT_Nav_Menu|null
	 */
	public $nav_menu;

	/**
	 * @var LMAT_Static_Pages|null
	 */
	public $static_pages;

	/**
	 * @var LMAT_Filters_Widgets_Options|null
	 */
	public $filters_widgets_options;

	/**
	 * @var LMAT_Filters_Sanitization|null
	 */
	public $filters_sanitization;


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

	// Additional dynamic properties
	/**
	 * @var mixed
	 */
	public $pref_lang;

	/**
	 * @var mixed
	 */
	public $filter_lang;

	// Block module properties
	/**
	 * @var mixed
	 */
	public $switcher_block;

	/**
	 * @var mixed
	 */
	public $navigation_block;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param LMAT_Links_Model $links_model Reference to the links model.
	 */
	public function __construct( &$links_model ) {
		parent::__construct( $links_model );

		// Static front page and page for posts.
		// Early instantiated to be able to correctly initialize language properties.
		if ( 'page' === get_option( 'show_on_front' ) ) {
			$this->static_pages = new LMAT_Static_Pages( $this );
		}

		$this->model->set_languages_ready();
	}

	/**
	 * Setup filters.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function init() {
		parent::init();

		$this->default_term = new LMAT_Default_Term( $this );
		$this->default_term->add_hooks();

		if ( ! $this->model->has_languages() ) {
			return;
		}

		add_filter( 'rest_pre_dispatch', array( $this, 'set_language' ), 10, 3 );
		add_filter( 'rest_request_before_callbacks', array( $this, 'set_filters_sanitization' ) );

		$this->filters_links           = new LMAT_Filters_Links( $this );
		$this->filters                 = new LMAT_Filters( $this );
		$this->filters_widgets_options = new LMAT_Filters_Widgets_Options( $this );

		$this->links    = new LMAT_Admin_Links( $this );
		$this->nav_menu = new LMAT_Frontend_Nav_Menu( $this ); // For auto added pages to menu.
	}

	/**
	 * Sets the current language during a REST request if sent.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed           $result  Response to replace the requested version with. Remains untouched.
	 * @param WP_REST_Server  $server  Server instance.
	 * @param WP_REST_Request $request Request used to generate the response.
	 * @return mixed Untouched $result.
	 *
	 * @phpstan-param WP_REST_Request<array{lang?: string}> $request
	 */
	public function set_language( $result, $server, $request ) {
		$lang = $request->get_param( 'lang' );

		if ( ! empty( $lang ) && is_string( $lang ) ) {
			$this->curlang = $this->model->get_language( sanitize_key( $lang ) );

			if ( empty( $this->curlang ) && ! empty( $this->options['default_lang'] ) ) {
				// A lang has been requested but it is invalid, let's fall back to the default one.
				$this->curlang = $this->model->get_language( sanitize_key( $this->options['default_lang'] ) );
			}
		}

		if ( ! empty( $this->curlang ) ) {
			/** This action is documented in frontend/choose-lang.php */
			do_action( 'lmat_language_defined', $this->curlang->slug, $this->curlang );
		} else {
			/** This action is documented in include/class-linguator.php */
			do_action( 'lmat_no_language_defined' ); // To load overridden textdomains.
		}

		return $result;
	}

	/**
	 * Initialize sanitization filters with the correct language locale.
	 *
	 * @see WP_REST_Server::dispatch()
	 *
	 *
	 * @param WP_REST_Response|WP_HTTP_Response|WP_Error|mixed $response Result to send to the client.
	 * @return WP_REST_Response|WP_HTTP_Response|WP_Error|mixed
	 */
	public function set_filters_sanitization( $response ) {
		$language = $this->request->get_language();
		if ( empty( $language ) ) {
			$type     = $this->request->get_object_type();
			$language = $type ? $this->model->$type->get_language( $this->request->get_id() ) : null;
		}

		if ( ! empty( $language ) ) {
			$this->filters_sanitization = new LMAT_Filters_Sanitization( $language->locale );
		}

		return $response;
	}
}
