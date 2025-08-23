<?php

namespace Linguator\modules\Inline_Translation;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LMAT_Inline_Translation {


	/**
	 * Singleton instance of LMAT_Inline_Translation.
	 *
	 * @var LMAT_Inline_Translation
	 */
	private static $instance;

	/**
	 * Get the singleton instance of LMAT_Inline_Translation.
	 *
	 * @return LMAT_Inline_Translation
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor for LMAT_Inline_Translation.
	 */
	public function __construct() {
		add_action( 'enqueue_block_assets', array( $this, 'block_inline_translation_assets' ) );
		add_action( 'elementor/editor/before_enqueue_scripts', array( $this, 'elementor_inline_translation_assets' ) );
	}

	/**
	 * Register block translator assets.
	 */
	public function block_inline_translation_assets() {

		if ( defined( 'LINGUATOR_VERSION' ) ) {
			$this->enqueue_inline_translation_assets( 'gutenberg' );
		}
	}

	/**
	 * Enqueue the elementor widget translator script.
	 */
	public function elementor_inline_translation_assets() {
		if ( defined( 'LINGUATOR_VERSION' ) ) {
			$this->enqueue_inline_translation_assets(
				'elementor',
				array(
					'backbone-marionette',
					'elementor-common',
					'elementor-web-cli',
					'elementor-editor-modules',
				)
			);
		}
	}

	private function enqueue_inline_translation_assets( $type = 'gutenberg', $extra_dependencies = array() ) {
		if ( function_exists( 'lmat_current_language' ) ) {
			$current_language      = lmat_current_language();
			$current_language_name = lmat_current_language( 'name' );
			$current_language_code = lmat_current_language( 'code' );
		} else {
			$current_language      = '';
			$current_language_name = '';
			$current_language_code = '';
		}

		$editor_script_asset = include LINGUATOR_DIR . '/Admin/Assets/' . sanitize_file_name( $type ) . '-inline-translate/index.asset.php';

		wp_register_script( 'lmat-inline-google-api', 'https://translate.google.com/translate_a/element.js', '', LINGUATOR_VERSION, true );
		
		$extra_dependencies[] = 'lmat-inline-google-api';
		
		wp_register_script( 'lmat-' . sanitize_file_name( $type ) . '-inline-translation', plugins_url( '/Admin/Assets/' . sanitize_file_name( $type ) . '-inline-translate/index.js', LINGUATOR_ROOT_FILE ), array_merge( $editor_script_asset['dependencies'], $extra_dependencies ), $editor_script_asset['version'], true );

		wp_enqueue_script( 'lmat-inline-google-api' );
		wp_enqueue_script( 'lmat-' . sanitize_file_name( $type ) . '-inline-translation' );

		if ( $current_language && $current_language !== '' ) {
			wp_localize_script(
				'lmat-' . sanitize_file_name( $type ) . '-inline-translation',
				'lmat' . ucfirst( sanitize_file_name( $type ) ) . 'InlineTranslation',
				array(
					'pageLanguage'     => $current_language,
					'pageLanguageName' => $current_language_name,
					'pageLanguageCode' => $current_language_code,
				)
			);
		}
	}
}
