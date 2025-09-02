<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\Editors\Screens;

use Linguator\Includes\Other\LMAT_Model;
use Linguator\Includes\Base\LMAT_Base;
use WP_Screen;
use Linguator\Includes\Other\LMAT_Language;
use Linguator\Admin\Controllers\LMAT_Admin_Block_Editor;

/**
 * Template class to manage editors scripts.
 *
 */
abstract class Abstract_Screen {
	/**
	 * The script suffix, default empty.
	 *
	 * @var string
	 */
	protected $suffix = '';

	/**
	 * @var LMAT_Admin_Block_Editor|null
	 */
	protected $block_editor;

	/**
	 * @var LMAT_Model
	 */
	protected $model;

	/**
	 * Constructor.
	 *
	 *
	 * @param LMAT_Base $linguator Linguator main object.
	 */
	public function __construct( &$linguator ) {
		if ( ! defined( 'SCRIPT_DEBUG' ) || ! SCRIPT_DEBUG ) {
			$this->suffix = '.min';
		}

		$this->model        = &$linguator->model;
		$this->block_editor = &$linguator->block_editor;
	}

	/**
	 * Adds required hooks.
	 *
	 *
	 * @return static
	 */
	public function init() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );

		return $this;
	}

	/**
	 * Enqueues script for the editors.
	 *
	 *
	 * @return void
	 */
	public function enqueue(): void {
		$screen = get_current_screen();
		if ( empty( $screen ) ) {
			return;
		}

		if ( $this->can_enqueue_style( $screen ) ) {
			$this->enqueue_style();
		}

		if ( ! $this->screen_matches( $screen ) ) {
			return;
		}

		wp_enqueue_script(
			static::get_handle(),
			plugins_url( $this->get_script_path(), LINGUATOR_ROOT_FILE ),
			array(
				'wp-api-fetch',
				'wp-data',
				'wp-i18n',
				'wp-sanitize',
				'lodash',
			),
			LINGUATOR_VERSION,
			true
		);

		$editor_lang = $this->get_language();
		if ( ! empty( $editor_lang ) ) {
			$editor_lang = $editor_lang->to_array();
		}
		$lmat_settings_script = 'let lmat_block_editor_plugin_settings = ' . wp_json_encode(
			/**
			 * Filters settings required by the UI.
			 *
			 * @since 3.6
			 *
			 * @param array $settings.
			 */
			(array) apply_filters(
				'lmat_block_editor_plugin_settings',
				array(
					'lang'  => $editor_lang,
					'nonce' => wp_create_nonce( 'lmat_language' ),
				)
			)
		);

		wp_add_inline_script( static::get_handle(), $lmat_settings_script, 'before' );
		wp_set_script_translations( static::get_handle(), 'linguator-multilingual-ai-translation' );

		if ( ! empty( $this->block_editor ) ) {
			$this->block_editor->filter_rest_routes->add_inline_script( static::get_handle() );
		}
	}

	/**
	 * Tells if the given screen matches the type of the current object.
	 *
	 *
	 * @param WP_Screen $screen The WordPress screen object.
	 * @return bool True is the screen is a match, false otherwise.
	 */
	abstract protected function screen_matches( WP_Screen $screen ): bool;

	/**
	 * Returns the current editor language.
	 *
	 *
	 * @return LMAT_Language|null The language object if found, `null` otherwise.
	 */
	abstract protected function get_language(): ?LMAT_Language;

	/**
	 * Returns the screen name to use across all process.
	 *
	 *
	 * @return string
	 */
	abstract protected function get_screen_name(): string;

	/**
	 * Tells if the given screen is suitable for stylesheet enqueueing.
	 *
	 *
	 * @param WP_Screen $screen The WordPress screen object.
	 * @return bool
	 */
	protected function can_enqueue_style( WP_Screen $screen ): bool {
		return $this->screen_matches( $screen );
	}

	/**
	 * Returns the main script handle for the editor.
	 * Useful to add inline scripts or to register translations for instance.
	 *
	 *
	 * @return string The handle.
	 */
	protected function get_handle(): string {
		return "lmat_{$this->get_screen_name()}_sidebar";
	}

	/**
	 * Returns the path to the main script for the editor.
	 *
	 *
	 * @return string The full path.
	 */
	protected function get_script_path(): string {
		return "/Admin/Assets/js/build/editors/{$this->get_screen_name()}{$this->suffix}.js";
	}

	/**
	 * Enqueues stylesheet commonly used in all editors.
	 * Override to your taste.
	 *
	 *
	 * @return void
	 */
	protected function enqueue_style(): void {
		wp_enqueue_style(
			'linguator-block-widget-editor-css',
			plugins_url( '/Admin/Assets/css/build/style' . $this->suffix . '.css', LINGUATOR_ROOT_FILE ),
			array( 'wp-components' ),
			LINGUATOR_VERSION
		);
	}
}
