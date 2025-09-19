<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\REST;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Includes\Other\LMAT_Model;



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
	 * @var LMAT_Model
	 */
	private $model;

	/**
	 * Constructor.
	 *
	 *  
	 *
	 * @param LMAT_Model $model Linguator's model.
	 */
	public function __construct( LMAT_Model $model ) {
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
	}
}
