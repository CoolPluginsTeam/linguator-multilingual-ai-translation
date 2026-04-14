<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\REST;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Other\Linguator_Model;



/**
 * Sets all Linguator REST controllers up.
 *
 *  
 */
class API {
	/**
	 * REST languages.
	 *
	 * @var V1\Languages|null
	 */
	public $languages;

	/**
	 * REST settings.
	 *
	 * @var V1\Settings|null
	 */
	public $settings;

	/**
	 * REST bulk translate.
	 *
	 * @var V1\Bulk_Translate|null
	 */
	public $bulk_translate;

	/**
	 * REST page translate.
	 *
	 * @var V1\Page_Translation|null
	 */
	public $page_translate;

	/**
	 * REST API keys.
	 *
	 * @var V1\Api_Keys|null
	 */
	public $api_keys;

	/**
	 * @var Linguator_Model
	 */
	private $model;

	/**
	 * Constructor.
	 *
	 *  
	 *
	 * @param Linguator_Model $model Linguator's model.
	 */
	public function __construct( Linguator_Model $model ) {
		$this->model = $model;
	}

	/**
	 * Adds hooks and registers endpoints.
	 *
	 *  
	 *
	 * @return void
	 */
	public function init(): void {
		$this->languages = new V1\Languages( $this->model );
		$this->languages->register_routes();

		$this->settings = new V1\Settings( $this->model );
		$this->settings->register_routes();

		$this->bulk_translate = new V1\Bulk_Translation( $this->model );
		$this->bulk_translate->register_routes();
		
		$this->page_translate = new V1\Page_Translation( $this->model );
		$this->page_translate->register_routes();

		// Only register API Keys endpoint when WP AI Client exists.
		if ( function_exists( 'linguator_is_wp_ai_client_exist' ) && linguator_is_wp_ai_client_exist() ) {
			$this->api_keys = new V1\Api_Keys( $this->model );
			$this->api_keys->register_routes();
		}
	}
}
