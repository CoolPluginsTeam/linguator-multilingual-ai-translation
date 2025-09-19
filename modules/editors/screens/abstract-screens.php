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
		$this->suffix = '';

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

		// Get translations table data for the current post
		$translations_table_data = $this->get_translations_table_data();

		$lmat_settings_script = 'let lmat_block_editor_plugin_settings = ' . wp_json_encode(
			/**
			 * Filters settings required by the UI.
			 *
			 *
			 * @param array $settings.
			 */
			(array) apply_filters(
				'lmat_block_editor_plugin_settings',
				array(
					'lang'  => $editor_lang,
					'nonce' => wp_create_nonce( 'lmat_language' ),
					'translations_table' => $translations_table_data,
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
		return "/admin/assets/js/build/editors/{$this->get_screen_name()}{$this->suffix}.js";
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
			plugins_url( '/admin/assets/css/build/style' . $this->suffix . '.css', LINGUATOR_ROOT_FILE ),
			array( 'wp-components' ),
			LINGUATOR_VERSION
		);
	}

	/**
	 * Gets translations table data for the current post.
	 *
	 * @return array Translations table data.
	 */
	protected function get_translations_table_data(): array {
		global $post;

		if ( empty( $post ) || ! $this->model->post_types->is_translated( $post->post_type ) ) {
			return array();
		}

		$current_lang = $this->model->post->get_language( $post->ID );
		if ( empty( $current_lang ) ) {
			return array();
		}

		$translations_table = array();
		$languages_list = $this->model->get_languages_list();

		foreach ( $languages_list as $language ) {
			// Skip current language
			if ( $language->slug === $current_lang->slug ) {
				continue;
			}

			// Get translated post ID
			$translation_id = $this->model->post->get_translation( $post->ID, $language );
			if ( empty( $translation_id ) && ! empty( $_GET['from_post'] ) && ! empty( $_GET['new_lang'] ) ) {
				$translation_id = $this->model->post->get_translation( $_GET['from_post'], $language );
			}
			$translated_post = null;
			$edit_link = '';
			$add_link = '';

			if ( $translation_id && $translation_id !== $post->ID ) {
				// Translation exists
				$translated_post = get_post( $translation_id );
				if ( $translated_post ) {
					$edit_link = get_edit_post_link( $translation_id, 'raw' );
					if ( $edit_link ) {
						$edit_link = add_query_arg( 'lang', $language->slug, $edit_link );
					}
					$add_link = '';
				}
			}

			if ( empty( $translated_post ) ) {
				// No translation exists, create add link
				$add_link = add_query_arg(
					array(
						'post_type' => $post->post_type,
						'new_lang'  => $language->slug,
						'from_post' => $post->ID,
						'_wpnonce' => wp_create_nonce( 'new-post-translation' ),
					),
					admin_url( 'post-new.php' )
				);
			}

			$translations_table[ $language->slug ] = array(
				'lang' => array(
					'slug'     => $language->slug,
					'name'     => $language->name,
					'flag'     => $language->get_display_flag( 'no-alt' ),
					'flag_url' => $language->get_display_flag_url(),
				),
				'translated_post' => $translated_post ? array(
					'id'    => $translated_post->ID,
					'title' => $translated_post->post_title,
				) : array( 'id' => null ),
				'caps' => array(
					'edit' => $translated_post ? current_user_can( 'edit_post', $translated_post->ID ) : false,
					'add'  => current_user_can( 'edit_posts' ),
				),
				'links' => array(
					'add_link'  => $add_link,
					'edit_link' => $edit_link,
				),
				'block_editor' => array(
					'edit_link' => $edit_link,
				),
				'can_synchronize' => true,
			);
		}

		return $translations_table;
	}
}
