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
		 * Tabs
		 * @return mixed
		 */
		public function tabs() {
			$default_url = '';

			if ( $this->active_tab && in_array($this->active_tab, ['strings', 'lang']) ) {
				$default_url = 'lmat_settings';
			}

			$tabs = array(
				'general'     => array( 'title' => __( 'General', 'linguator-multilingual-ai-translation' ) ),
				'translation' => array( 'title' => __( 'Translation', 'linguator-multilingual-ai-translation' ) ),
				'switcher'    => array( 'title' => __( 'Switcher', 'linguator-multilingual-ai-translation' ) ),
				'lang'   => array( 'title' => __( 'Manage Languages', 'linguator-multilingual-ai-translation' ), 'redirect' => true, 'redirect_url' => 'lmat' ),
			);

            $languages = $this->model->get_languages_list();

            if(!empty($languages)){
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
			echo '<img src="' . esc_url( plugin_dir_url( LINGUATOR_ROOT_FILE ) . 'Assets/logo/loco.png' ) . '" alt="Linguator" />';
			echo '</div>';
			echo '<div class="lmat-settings-header-tab-list">';
			foreach ( $this->tabs() as $key => $value ) {
				$active_class = $this->active_tab === $key ? 'active' : '';
				$title        = $value['title'];
				$redirect     = isset( $value['redirect'] ) ? $value['redirect'] : false;
				$redirect_url = $redirect && isset( $value['redirect_url'] ) ? $value['redirect_url'] : false;
				if ( $redirect && $redirect_url && $this->active_tab !== $key ) {
					echo '<a href="' . admin_url( 'admin.php?page=' . esc_attr( $redirect_url ) ) . '"><div class="lmat-settings-header-tab ' . esc_attr( $active_class ) . '" data-tab="' . esc_attr( $key ) . '" title="' . esc_attr( $title ) . '" data-link="true">' . strtoupper( esc_html( $title ) ) . '</div></a>';
				} else {
					echo '<div class="lmat-settings-header-tab ' . esc_attr( $active_class ) . '" data-tab="' . esc_attr( $key ) . '" title="' . esc_attr( $title ) . '">' . strtoupper( esc_html( $title ) ) . '</div>';
				}
			}
			echo '</div>';
			echo '</div>';
			echo '</div>';
			echo '</div>';
		}

		/**
		 * @return void
		 */
		public function header_assets() {
			wp_enqueue_style( 'lmat-settings-header', plugins_url( 'Admin/Assets/css/settings-header.css', LINGUATOR_ROOT_FILE ), array(), LINGUATOR_VERSION );
		}
	}

}
