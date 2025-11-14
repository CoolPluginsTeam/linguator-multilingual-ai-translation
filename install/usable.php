<?php
/**
 * @package Linguator
 *
 * /!\ THE CONSTANTS `LINGUATOR`, `LMAT_MIN_PHP_VERSION`, AND `LMAT_MIN_WP_VERSION` MUST BE DEFINED.
 */

namespace Linguator\Install;

/**
 * Class that can tell if Linguator can be activated.
 *
 * @since 0.0.8
 */
class LMAT_Usable {
	/**
	 * Checks min PHP and WP version, displays a notice if a requirement is not met.
	 *
	 * @since 0.0.8
	 * @return bool
	 */
	public static function can_activate() {
		global $wp_version;

		if ( version_compare( LMAT_get_constant( 'PHP_VERSION', '' ), static::get_min_php_version(), '<' ) ) {
			add_action( 'admin_notices', array( static::class, 'php_version_notice' ) );
			return false;
		}

		if ( version_compare( $wp_version, static::get_min_wp_version(), '<' ) ) {
			add_action( 'admin_notices', array( static::class, 'wp_version_notice' ) );
			return false;
		}

		return true;
	}

	/**
	 * Displays a notice if PHP min version is not met.
	 *
	 * @since 0.0.8
	 * @return void
	 */
	public static function php_version_notice() {
		load_plugin_textdomain( 'linguator-multilingual-ai-translation' ); // Plugin i18n.

		printf(
			'<div class="error"><p>%s</p></div>',
			sprintf(
				/* translators: 1: Plugin name 2: Current PHP version 3: Required PHP version */
				esc_html__( '%1$s has deactivated itself because you are using an old version of PHP. You are using using PHP %2$s. %1$s requires PHP %3$s.', 'linguator-multilingual-ai-translation' ),
				esc_html( static::get_plugin_name() ),
				esc_html( LMAT_get_constant( 'PHP_VERSION', '' ) ),
				esc_html( static::get_min_php_version() )
			)
		);
	}

	/**
	 * Displays a notice if WP min version is not met.
	 *
	 * @since 0.0.8
	 * @return void
	 */
	public static function wp_version_notice() {
		global $wp_version;

		load_plugin_textdomain( 'linguator-multilingual-ai-translation' ); // Plugin i18n.

		printf(
			'<div class="error"><p>%s</p></div>',
			sprintf(
				/* translators: 1: Plugin name 2: Current WordPress version 3: Required WordPress version */
				esc_html__( '%1$s has deactivated itself because you are using an old version of WordPress. You are using using WordPress %2$s. %1$s requires at least WordPress %3$s.', 'linguator-multilingual-ai-translation' ),
				esc_html( static::get_plugin_name() ),
				esc_html( $wp_version ),
				esc_html( static::get_min_wp_version() )
			)
		);
	}

	/**
	 * Returns the minimal php version required to run the plugin.
	 *
	 * @since 0.0.8
	 *
	 * @return string
	 */
	public static function get_min_php_version() {
		return LMAT_get_constant( 'LMAT_MIN_PHP_VERSION', '' );
	}

	/**
	 * Returns the minimal WP version required to run the plugin.
	 *
	 * @since 0.0.8
	 *
	 * @return string
	 */
	public static function get_min_wp_version() {
		return LMAT_get_constant( 'LMAT_MIN_WP_VERSION', '' );
	}

	/**
	 * Returns the plugin's name.
	 *
	 * @since 0.0.8
	 *
	 * @return string
	 */
	public static function get_plugin_name() {
		return LMAT_get_constant( 'LINGUATOR', '' );
	}
}
