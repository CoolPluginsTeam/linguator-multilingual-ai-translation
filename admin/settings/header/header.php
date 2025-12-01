<?php

namespace Linguator\Settings\Header;

/**
 * Header file for settings page
 *
 * @package Linguator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Linguator\Settings\Header\Header' ) ) {
    /**
     * Header class
     * @param mixed $tab
     */
	class Header {

		/**
		 * Instance of the class
		 * @var mixed
		 */
		private static $instance;

		/**
		 * Active tab
		 * @var mixed
		 */
		private $active_tab;

        /**
         * Model
         * @var mixed
         */
        private $model;

		/**
		 * Get instance of the class
		 * @param mixed $tab
		 * @param mixed $model
		 * @return mixed
		 */
		public static function get_instance( $tab, $model ) {
			if ( null === self::$instance ) {
				self::$instance = new self( $tab, $model );
			}

			return self::$instance;
		}

		/**
		 * Constructor
		 * @param mixed $tab
		 * @param mixed $model
		 */
		public function __construct( $tab, $model ) {
			$this->active_tab = sanitize_text_field( $tab );
			$this->model = $model;
		}

		/**
		 * Set active tab
		 * @param mixed $tab
		 */
		public function set_active_tab( $tab ) {
			$this->active_tab = $tab;
		}

		/**
		 * Check if Polylang data exists
		 *
		 * @return bool True if Polylang data exists, false otherwise.
		 */
		private function has_polylang_data() {
			global $wpdb;

			// Check if Polylang data exists in database (works even if plugin is deactivated)
			// Check for 'language' taxonomy terms directly in database
			$polylang_languages_count = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM {$wpdb->term_taxonomy} WHERE taxonomy = %s",
					'language'
				)
			);

			// Get Polylang settings first to check if Polylang was ever used
			$polylang_options = get_option( 'polylang', array() );
			
			// If no languages found, check if Polylang was ever installed by checking for settings
			if ( empty( $polylang_languages_count ) || 0 === (int) $polylang_languages_count ) {
				// If no languages and no settings, Polylang was never used
				if ( empty( $polylang_options ) ) {
					return false;
				}
				// Settings exist but no languages - still show migration option for settings
				return true;
			}

			// If languages exist, Polylang data is present
			return true;
		}

		/**
		 * Tabs
		 * @return mixed
		 */
		public function tabs() {
			$default_url = '';

			if ( $this->active_tab && in_array($this->active_tab, ['strings', 'lang', 'supported-blocks','custom-fields','glossary']) ) {
				$default_url = 'lmat_settings';
			}

			$tabs = array(
				'general'     => array( 'title' => __( 'General Settings', 'linguator-multilingual-ai-translation' ) ),
				'lang'   => array( 'title' => __( 'Manage Languages', 'linguator-multilingual-ai-translation' ), 'redirect' => true, 'redirect_url' => 'lmat' ),
				'translation' => array( 'title' => __( 'AI Translation', 'linguator-multilingual-ai-translation' ) ),
				'switcher'    => array( 'title' => __( 'Language Switcher', 'linguator-multilingual-ai-translation' ) ),
				'supported-blocks' => array( 'title' => __( 'Supported Blocks', 'linguator-multilingual-ai-translation' ), 'redirect' => true, 'redirect_url' => 'lmat_settings&tab=supported-blocks' ),
				'custom-fields' => array( 'title' => __( 'Custom Fields', 'linguator-multilingual-ai-translation' ), 'redirect' => true, 'redirect_url' => 'lmat_settings&tab=custom-fields' ),
				'glossary' => array( 'title' => __( 'Glossary', 'linguator-multilingual-ai-translation' ), 'redirect' => true, 'redirect_url' => 'lmat_settings&tab=glossary' ),
			);

			// Only show Advanced Settings tab if migration hasn't been completed AND Polylang data exists
			$migration_completed = get_option( 'lmat_migration_completed', false );
			if ( ! $migration_completed ) {
				$tabs['advanced-settings'] = array( 'title' => __( 'Advanced Settings', 'linguator-multilingual-ai-translation' ) );
			}

            $languages = $this->model->get_languages_list();
            $static_strings_visibility = $this->model->options->get( 'static_strings_visibility' );
            if(!empty($languages) && $static_strings_visibility){
                $tabs['strings']     = array(
					'title'        => __( 'Static Strings', 'linguator-multilingual-ai-translation' ),
					'redirect'     => true,
					'redirect_url' => 'lmat_settings&tab=strings',
				);
            }

			if ( $default_url && ! empty( $default_url ) ) {
				$tabs['general']['redirect']         = true;
				$tabs['general']['redirect_url']     = $default_url . '&tab=general';
				$tabs['translation']['redirect']     = true;
				$tabs['translation']['redirect_url'] = $default_url . '&tab=translation';

				$tabs['switcher']['redirect']     = true;
				$tabs['switcher']['redirect_url'] = $default_url . '&tab=switcher';
				
				// Only set redirect for advanced-settings if the tab exists
				if ( isset( $tabs['advanced-settings'] ) ) {
					$tabs['advanced-settings']['redirect']     = true;
					$tabs['advanced-settings']['redirect_url'] = $default_url . '&tab=advanced-settings';
				}
			}

			return apply_filters( 'lmat_settings_header_tabs', $tabs );
		}

		/**
		 * @return void
		 */
		public function header() {
			echo '<div id="lmat-settings-header">';
			echo '<div id="lmat-settings-header-tabs">';
			echo '<div class="lmat-settings-header-tab-container">';
			echo '<div class="lmat-settings-header-logo">';
			echo '<a href="' . esc_url( admin_url( 'admin.php?page=lmat_settings&tab=general' ) ) . '"><img src="' . esc_url( plugin_dir_url( LINGUATOR_ROOT_FILE ) . 'assets/logo/linguator_icon.svg' ) . '" alt="Linguator" /></a>';
			echo '</div>';
			echo '<div class="lmat-settings-header-tab-list">';
			foreach ( $this->tabs() as $key => $value ) {
				$active_class = $this->active_tab === $key ? 'active' : '';
				$title        = $value['title'];
				$redirect     = isset( $value['redirect'] ) ? $value['redirect'] : false;
				$redirect_url = $redirect && isset( $value['redirect_url'] ) ? $value['redirect_url'] : false;
				if ( $redirect && $redirect_url && $this->active_tab !== $key ) {
					echo '<a href="' . esc_url( admin_url( 'admin.php?page=' . esc_attr( $redirect_url ) ) ) . '"><div class="lmat-settings-header-tab ' . esc_attr( $active_class ) . '" data-tab="' . esc_attr( $key ) . '" title="' . esc_attr( $title ) . '" data-link="true">' . esc_html(  $title  ) . '</div></a>';
				} else {
					echo '<div class="lmat-settings-header-tab ' . esc_attr( $active_class ) . '" data-tab="' . esc_attr( $key ) . '" title="' . esc_attr( $title ) . '">' . esc_html(  $title  ) . '</div>';
				}
			}
			echo '</div>';
			echo '<div class="lmat-settings-header-actions">';
			echo '<a href="https://linguator.com/documentation/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard" target="_blank" class="lmat-header-action-link">' . esc_html__( 'Documentation', 'linguator-multilingual-ai-translation' ) . '</a>';
			echo '<a href="https://linguator.com/docs/video-tutorials/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=video&utm_content=dashboard" target="_blank" class="lmat-header-action-link">' . esc_html__( 'Video Tutorial', 'linguator-multilingual-ai-translation' ) . '</a>';
			echo '<a href="https://my.coolplugins.net/account/support-tickets/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=support&utm_content=dashboard" target="_blank" class="lmat-header-action-link">' . esc_html__( 'Support', 'linguator-multilingual-ai-translation' ) . '</a>';
			echo '</div>';
			echo '</div>';
			echo '</div>';
			echo '</div>';
		}

		/**
		 * @return void
		 */
		public function header_assets() {
			wp_enqueue_style( 'lmat-settings-header', plugins_url( 'admin/assets/css/settings-header.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
		}
	}

}
