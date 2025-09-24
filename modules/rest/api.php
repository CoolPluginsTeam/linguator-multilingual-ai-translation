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
 * @since 1.0.0
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
	 * @var LMAT_Model
	 */
	private $model;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param LMAT_Model $model Linguator's model.
	 */
	public function __construct( LMAT_Model $model ) {
		$this->model = $model;
	}

	/**
	 * Adds hooks and registers endpoints.
	 *
	 * @since 1.0.0
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
	}
}
