<?php
/**
 * @package Linguator
 */
namespace Linguator\Admin\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use Linguator\Includes\Filters\Linguator_Filter_REST_Routes;
use Linguator\Includes\Other\Linguator_Model;
use WP_Block_Editor_Context;
use WP_Post;


/**
 * Manages filters and actions related to the block editor
 *
 *  
 */
class Linguator_Admin_Block_Editor {
	/**
	 * @var Linguator_Model
	 */
	protected $model;

	/**
	 * @var Linguator_Filter_REST_Routes
	 */
	public $filter_rest_routes;

	/**
	 * Constructor: setups filters and actions.
	 *
	 *  
	 *
	 * @param Linguator_Admin $linguator The Linguator object.
	 */
	public function __construct( &$linguator ) {
		$this->model              = &$linguator->model;
		$this->filter_rest_routes = new Linguator_Filter_REST_Routes( $linguator->model );

		add_filter( 'block_editor_rest_api_preload_paths', array( $this, 'filter_preload_paths' ), 50, 2 );
		add_action( 'admin_enqueue_scripts', array( $this, 'linguator_add_block_editor_inline_script' ), 15 ); // After `Linguator_Admin_Base::admin_enqueue_scripts()` to ensure `linguator_block-editor`script is enqueued.
	}

	/**
	 * Filters preload paths based on the context (block editor for posts, site editor or widget editor for instance).
	 *
	 *  
	 *
	 * @param array                   $preload_paths Preload paths.
	 * @param WP_Block_Editor_Context $context       Editor context.
	 * @return array Filtered preload paths.
	 */
	public function filter_preload_paths( $preload_paths, $context ) {
		if ( ! $context instanceof WP_Block_Editor_Context ) {
			return $preload_paths;
		}

		if (
			'core/edit-post' !== $context->name || ! $context->post instanceof WP_Post
		) {
			// Do nothing if not post editor.
			return $preload_paths;
		}

		if ( ! $this->model->is_translated_post_type( $context->post->post_type ) ) {
			return $preload_paths;
		}

		$language = $this->model->post->get_language( $context->post->ID );

		if ( empty( $language ) ) {
			return $preload_paths;
		}

		return $this->filter_rest_routes->add_query_parameters(
			$preload_paths,
			array(
				'lang' => $language->slug,
			)
		);
	}

	/**
	 * Adds inline block editor script for filterable REST routes.
	 *
	 *  
	 *
	 * @return void
	 */
	public function linguator_add_block_editor_inline_script() {
		$handle = 'lmat_block-editor';

		if ( wp_script_is( $handle, 'enqueued' ) ) {
			$this->filter_rest_routes->add_inline_script( $handle );
		}
	}
}
