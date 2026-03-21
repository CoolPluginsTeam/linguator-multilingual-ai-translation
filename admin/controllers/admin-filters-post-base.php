<?php
/**
 * @package Linguator
 */
namespace Linguator\Admin\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Some common code for Linguator_Admin_Filters_Post and Linguator_Admin_Filters_Media
 *
 *  
 */
abstract class Linguator_Admin_Filters_Post_Base {
	/**
	 * @var Linguator_Model
	 */
	public $model;

	/**
	 * @var Linguator_Admin_Links
	 */
	public $links;

	/**
	 * Language selected in the admin language filter.
	 *
	 * @var Linguator_Language|null
	 */
	public $filter_lang;

	/**
	 * Preferred language to assign to new contents.
	 *
	 * @var Linguator_Language|null
	 */
	public $pref_lang;

	/**
	 * Constructor: setups filters and actions
	 *
	 *  
	 *
	 * @param object $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->links = &$linguator->links;
		$this->model = &$linguator->model;
		$this->pref_lang = &$linguator->pref_lang;
	}

	/**
	 * Save translations from the languages metabox.
	 *
	 *  
	 *
	 * @param int   $post_id Post id of the post being saved.
	 * @param int[] $arr     An array with language codes as key and post id as value.
	 * @return int[] The array of translated post ids.
	 */
	protected function save_translations( $post_id, $arr ) {
		// Security check as 'wp_insert_post' can be called from outside WP admin.
		check_admin_referer( 'lmat_language', '_lmat_nonce' );

		$translations = $this->model->post->save_translations( $post_id, $arr );
		return $translations;
	}
}
