<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\Editors;

use WP_Post;
use Linguator\Includes\Base\LMAT_Base;
use Linguator\Includes\Other\LMAT_Model;
use Linguator\Includes\Other\LMAT_Language;
use Linguator\Admin\Controllers\LMAT_Admin_Block_Editor;
use WP_Block_Editor_Context;

/**
 * Class to filter REST preload paths.
 *
 */
class Filter_Preload_Paths {
	/**
	 * @var LMAT_Model
	 */
	protected $model;

	/**
	 * @var LMAT_Language|false|null
	 */
	protected $curlang;

	/**
	 * @var LMAT_Admin_Block_Editor|null
	 */
	protected $block_editor;

	/**
	 * Constructor
	 *
	 *
	 * @param LMAT_Base $linguator Linguator object.
	 */
	public function __construct( LMAT_Base &$linguator ) {
		$this->model        = &$linguator->model;
		$this->curlang      = &$linguator->curlang;
		$this->block_editor = &$linguator->block_editor;
	}

	/**
	 * Adds required hooks.
	 *
	 *
	 * @return self
	 */
	public function init(): self {
		add_filter( 'block_editor_rest_api_preload_paths', array( $this, 'filter_preload_paths' ), 50, 2 );
		add_filter( 'lmat_filtered_rest_routes', array( $this, 'filter_navigation_fallback_route' ) );

		return $this;
	}

	/**
	 * Filters preload paths based on the context (block editor for posts, site editor or widget editor for instance).
	 *
	 *
	 * @param (string|string[])[]     $preload_paths Preload paths.
	 * @param WP_Block_Editor_Context $context       Editor context.
	 * @return array Filtered preload paths.
	 */
	public function filter_preload_paths( $preload_paths, $context ) {
		if ( ! $context instanceof WP_Block_Editor_Context || empty( $this->block_editor ) ) {
			return $preload_paths;
		}

		if ( $context->post instanceof WP_Post && ! $this->model->is_translated_post_type( $context->post->post_type ) ) {
			return $preload_paths;
		}

		$preload_paths = (array) $preload_paths;

		// Do nothing if in post editor since `LMAT_Admin_Block_Editor` has already filtered.
		if ( 'core/edit-post' !== $context->name ) {
			$lang = ! empty( $this->curlang ) ? $this->curlang->slug : null;

			if ( empty( $lang ) || 'core/edit-widgets' === $context->name ) {
				$lang = $this->model->options['default_lang'];
			}

			$preload_paths = $this->block_editor->filter_rest_routes->add_query_parameters(
				$preload_paths,
				array(
					'lang' => $lang,
				)
			);

			if ( 'core/edit-site' === $context->name ) {
				// User data required for the site editor (WP already adds it to the post block editor).
				$preload_paths[] = '/wp/v2/users/me';
			}
		}

		$preload_paths[] = '/lmat/v1/languages';

		return $preload_paths;
	}

	/**
	 * Adds navigation fallback REST route to the filterable ones.
	 *
	 *
	 * @param string[] $routes Filterable REST routes.
	 * @return string[] Filtered filterable REST routes.
	 */
	public function filter_navigation_fallback_route( $routes ) {
		$routes['navigation-fallback'] = 'wp-block-editor/v1/navigation-fallback';

		return $routes;
	}
}
