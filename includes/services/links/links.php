<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Services\Links;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Other\Linguator_Language;



/**
 * Manages links related functions
 *
 *  
 */
class Linguator_Links {
	/**
	 * Stores the plugin options.
	 *
	 * @var array
	 */
	public $options;

	/**
	 * @var Linguator_Model
	 */
	public $model;

	/**
	 * Instance of a child class of Linguator_Links_Model.
	 *
	 * @var Linguator_Links_Model
	 */
	public $links_model;

	/**
	 * Current language (used to filter the content).
	 *
	 * @var Linguator_Language|null
	 */
	public $curlang;

	/**
	 * Constructor
	 *
	 *  
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->links_model = &$linguator->links_model;
		$this->model = &$linguator->model;
		$this->options = &$linguator->options;
	}

	/**
	 * Returns the home url in the requested language.
	 *
	 *  
	 *
	 * @param Linguator_Language|string $language  The language.
	 * @param bool                $is_search Optional, whether we need the home url for a search form, defaults to false.
	 * @return string
	 */
	public function get_home_url( $language, $is_search = false ) {
		if ( ! $language instanceof Linguator_Language ) {
			$language = $this->model->get_language( $language );
		}

		if ( empty( $language ) ) {
			return home_url( '/' );
		}

		return $is_search ? $language->get_search_url() : $language->get_home_url();
	}
}

