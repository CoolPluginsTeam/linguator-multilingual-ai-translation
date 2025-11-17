<?php
/**
 * Handles plugin activation and deactivation for single and multisite installations.
 *
 * Note: This abstract class expects you to define the constants `LINGUATOR_BASENAME` and `LINGUATOR_VERSION`.
 * 
 * @package Linguator
 */

namespace Linguator\Install;

/**
 * Provides a generic way to activate or deactivate plugins on all sites,
 * including in WordPress Multisite networks.
 *
 * To use, extend this class and define your own process logic.
 * 
 * @since 0.0.8
 */
abstract class LMAT_Abstract_Activable {
	/**
	 * Perform activation or deactivation for all sites.
	 * 
	 * If running on a Multisite network and the plugin is activated/deactivated network-wide,
	 * it will process each site individually. Otherwise, it will only process the current site.
	 *
	 * @since 0.0.8
	 * @param bool $networkwide True to (de)activate for every site, false for current site only.
	 * @return void
	 */
	public static function do_for_all_blogs( $networkwide ): void {
		if ( is_multisite() && $networkwide ) {
			// If this is a Multisite network and network-wide is true:
			foreach ( get_sites( array(
				'fields' => 'ids',
				'number' => 0
			) ) as $blog_id ) {
				switch_to_blog( $blog_id ); // Temporarily switch to each site in the network
				static::process();           // Run the (de)activation process for that site
			}
			restore_current_blog(); // Return to the original site after processing
		} else {
			// For a single site or non-network-wide activation:
			static::process();
		}
	}

	/**
	 * Get the plugin's basename, which is a unique identifier for your plugin file.
	 *
	 * @since 0.0.8
	 * @return string The plugin's basename, or empty string if not defined.
	 */
	public static function get_plugin_basename(): string {
		return LMAT_get_constant( 'LINGUATOR_BASENAME', '' );
	}

	/**
	 * Get the plugin's version number.
	 *
	 * @since 0.0.8
	 * @return string The version number of the plugin, or empty string if not defined.
	 */
	public static function get_plugin_version(): string {
		return LMAT_get_constant( 'LINGUATOR_VERSION', '' );
	}

	/**
	 * This abstract method defines what should happen on plugin activation or deactivation.
	 * 
	 * You must implement this method in your child class.
	 *
	 * @since 0.0.8
	 * @return void
	 */
	abstract protected static function process(): void;
}
