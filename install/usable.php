<?php
/**
 * @package Linguator
 *
 * NOTE: The constants `LINGUATOR`, `LMAT_MIN_PHP_VERSION`, and `LMAT_MIN_WP_VERSION` must be defined before using this class.
 */

namespace Linguator\Install;

/**
 * This class checks if the Linguator plugin can be used.
 * It makes sure the server is running the required PHP version and WordPress version for the plugin,
 * and it shows an admin message if there are any problems.
 *
 * @since 0.0.8
 */
class LMAT_Usable {
	/**
	 * Checks if the current PHP and WordPress versions meet the minimum requirements to use the plugin.
	 * If requirements are not met, an error notice is shown in the admin area.
	 *
	 * @since 0.0.8
	 * @return bool True if both versions are high enough, false if not.
	 */
	public static function can_activate() {
		global $wp_version;

		// Check for Polylang conflict first
		if ( defined( 'POLYLANG_VERSION' ) ) {
			add_action( 'admin_notices', array( static::class, 'polylang_conflict_notice' ) );
			add_action( 'network_admin_notices', array( static::class, 'polylang_conflict_notice' ) );
			return false;
		}
		
		// Check if the current PHP version is less than the required version.	
		if ( version_compare( LMAT_get_constant( 'PHP_VERSION', '' ), static::get_min_php_version(), '<' ) ) {
			// Show an admin notice about outdated PHP.
			add_action( 'admin_notices', array( static::class, 'php_version_notice' ) );
			return false;
		}

		// Check if the current WordPress version is less than the required version.
		if ( version_compare( $wp_version, static::get_min_wp_version(), '<' ) ) {
			// Show an admin notice about outdated WordPress.
			add_action( 'admin_notices', array( static::class, 'wp_version_notice' ) );
			return false;
		}

		// All requirements met, plugin can be used.
		return true;
	}

	/**
	 * Shows a message in the admin area if the server's PHP version is too old.
	 *
	 * @since 0.0.8
	 * @return void
	 */
	public static function php_version_notice() {
		// Load translations for plugin text.
		load_plugin_textdomain( 'linguator-multilingual-ai-translation' );

		printf(
			'<div class="error"><p>%s</p></div>',
			sprintf(
				/*
				* translators: 1: Plugin name 2: Current PHP version 3: Required PHP version
				*/
				esc_html__( '%1$s has deactivated itself because you are using an old version of PHP. You are using using PHP %2$s. %1$s requires PHP %3$s.', 'linguator-multilingual-ai-translation' ),
				esc_html( static::get_plugin_name() ),
				esc_html( LMAT_get_constant( 'PHP_VERSION', '' ) ),
				esc_html( static::get_min_php_version() )
			)
		);
	}

	/**
	 * Displays a notice if Polylang is detected.
	 *
	 *  
	 *
	 * @return void
	 */
	public static function polylang_conflict_notice() {
		?>
		<div class="notice notice-error">
			<p>
				<strong><?php esc_html_e( 'Linguator – Multilingual AI Translation', 'linguator-multilingual-ai-translation' ); ?></strong>
			</p>
			<p>
				<?php 
				echo esc_html__( 'Linguator cannot run alongside Polylang. Please deactivate Polylang first.', 'linguator-multilingual-ai-translation' );
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Shows a message in the admin area if the WordPress version is too old.
	 *
	 * @since 0.0.8
	 * @return void
	 */
	public static function wp_version_notice() {
		global $wp_version;

		// Load translations for plugin text.
		load_plugin_textdomain( 'linguator-multilingual-ai-translation' );

		printf(
			'<div class="error"><p>%s</p></div>',
			sprintf(
				/*
				* translators: 1: Plugin name 2: Current WordPress version 3: Required WordPress version
				*/
				esc_html__( '%1$s has deactivated itself because you are using an old version of WordPress. You are using using WordPress %2$s. %1$s requires at least WordPress %3$s.', 'linguator-multilingual-ai-translation' ),
				esc_html( static::get_plugin_name() ),
				esc_html( $wp_version ),
				esc_html( static::get_min_wp_version() )
			)
		);
	}

	/**
	 * Get the minimum PHP version needed to run the plugin.
	 *
	 * @since 0.0.8
	 * @return string The required PHP version (e.g. "7.4").
	 */
	public static function get_min_php_version() {
		return LMAT_get_constant( 'LMAT_MIN_PHP_VERSION', '' );
	}

	/**
	 * Get the minimum WordPress version needed to run the plugin.
	 *
	 * @since 0.0.8
	 * @return string The required WordPress version (e.g. "5.0").
	 */
	public static function get_min_wp_version() {
		return LMAT_get_constant( 'LMAT_MIN_WP_VERSION', '' );
	}

	/**
	 * Get the name of the plugin.
	 *
	 * @since 0.0.8
	 * @return string The plugin name.
	 */
	public static function get_plugin_name() {
		return LMAT_get_constant( 'LINGUATOR', '' );
	}
}
