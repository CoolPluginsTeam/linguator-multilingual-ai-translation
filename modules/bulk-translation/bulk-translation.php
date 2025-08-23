<?php
namespace Linguator\modules\Bulk_Translation;

use Linguator\Admin\Controllers\LMAT_Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'LMAT_Bulk_Translation' ) ) :
	class LMAT_Bulk_Translation {

		private static $instance;

		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		public function __construct() {
			global $linguator;

			if ( $linguator instanceof LMAT_Admin ) {
				add_action( 'current_screen', array( $this, 'bulk_translate_btn' ) );
				add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_bulk_translate_assets' ) );
			}else{
				new LMAT_Bulk_Translate_Rest_Routes('lmat-bulk-translate');
			}
		}

		public function bulk_translate_btn( $screen ) {
			global $linguator;

			if ( ! $linguator || ! property_exists( $linguator, 'model' ) ) {
				return;
			}

			$translated_post_types = $linguator->model->get_translated_post_types();
			$translated_post_types = array_keys( $translated_post_types );

			if ( ! isset( $screen->id ) ) {
				return;
			}

			if ( ( isset( $_GET['post_status'] ) && 'trash' === $_GET['post_status'] ) ) {
				return;
			}

			if ( ! in_array( $screen->post_type, $translated_post_types ) ) {
				return;
			}

			add_filter( "views_{$screen->id}", array( $this, 'lmat_bulk_translate_button' ) );

			add_action( 'admin_footer', array( $this, 'bulk_translate_container' ) );
		}

		public function lmat_bulk_translate_button( $views ) {
			echo "<button class='button lmat-bulk-translate-btn' style='display:none;'>Bulk Translate</button>";

			return $views;
		}

		public function bulk_translate_container() {
			echo "<div id='lmat-bulk-translate-wrapper'></div>";
		}

		public function enqueue_bulk_translate_assets() {
			global $linguator;

			if ( ! $linguator || ! property_exists( $linguator, 'model' ) ) {
				return;
			}

			$translated_post_types = $linguator->model->get_translated_post_types();
			$translated_post_types = array_keys( $translated_post_types );

			$current_screen = get_current_screen();

			if ( ! isset( $current_screen->id ) ) {
				return;
			}

			if ( ( isset( $_GET['post_status'] ) && 'trash' === $_GET['post_status'] ) ) {
				return;
			}

			if ( ! in_array( $current_screen->post_type, $translated_post_types ) ) {
				return;
			}

			$post_label = __( 'Pages', 'linguator-multilingual-ai-translation' );

			if ( isset( $current_screen->post_type ) ) {
				$post_type = $current_screen->post_type;

				if ( isset( get_post_type_object( $post_type )->label ) && ! empty( get_post_type_object( $post_type )->label ) ) {
					$post_label = get_post_type_object( $post_type )->label;
				}
			}

			$editor_script_asset = include LINGUATOR_DIR . '/Admin/Assets/bulk-translate/index.asset.php';

			$rtl      = function_exists( 'is_rtl' ) ? is_rtl() : false;
			$css_file = $rtl ? 'index-rtl.css' : 'index.css';

			wp_enqueue_script( 'lmat-google-api', 'https://translate.google.com/translate_a/element.js', '', LINGUATOR_VERSION, true );
			wp_enqueue_script( 'lmat-bulk-translate', plugins_url( 'Admin/Assets/bulk-translate/index.js', LINGUATOR_ROOT_FILE ), array_merge( $editor_script_asset['dependencies'], array( 'lmat-google-api' ) ), $editor_script_asset['version'], true );

			wp_enqueue_style( 'lmat-bulk-translate', plugins_url( 'Admin/Assets/bulk-translate/index.css', LINGUATOR_ROOT_FILE ), array(), $editor_script_asset['version'] );

			$languages = LMAT()->model->get_languages_list();

			$lang_object = array();
			foreach ( $languages as $lang ) {
				$lang_object[ $lang->slug ] = array(
					'name'   => $lang->name,
					'flag'   => $lang->flag_url,
					'locale' => $lang->locale,
				);
			}

			wp_localize_script(
				'lmat-bulk-translate',
				'lmatBulkTranslationGlobal',
				array(
					'ajax_url'                 => admin_url( 'admin-ajax.php' ),
					'languageObject'           => $lang_object,
					'nonce'                    => wp_create_nonce( 'wp_rest' ),
					'bulkTranslateRouteUrl'    => get_rest_url( null, 'lmat-bulk-translate' ),
					'bulkTranslatePrivateKey'  => wp_create_nonce( 'lmat_bulk_translate_entries_nonce' ),
					'fetchBlockRulesNonce' => wp_create_nonce( 'lmat_fetch_block_rules_nonce' ),
					'lmat_url'                => plugins_url( '', LINGUATOR_ROOT_FILE ).'/',
					'admin_url'                => admin_url(),
					'post_label'               => $post_label,
					'update_translate_data'    => 'lmat_update_translate_data',
				)
			);
		}
	}
endif;
