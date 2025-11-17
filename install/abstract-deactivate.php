<?php
/**
 * @package Linguator
 *
 * IMPORTANT: You must define the constants `LINGUATOR_BASENAME` and `LINGUATOR_VERSION` for this class to work.
 */

namespace Linguator\Install;

/**
 * This abstract class helps you handle plugin deactivation.
 * It works on both normal WordPress sites and Multisite networks.
 * Extend this class if you want to run code when your plugin is deactivated everywhere.
 *
 * @since 0.0.8
 */
abstract class LMAT_Abstract_Deactivate extends LMAT_Abstract_Activable {
	/**
	 * Register the deactivation hook so WordPress will call our code when the plugin is turned off.
	 *
	 * @since 0.0.8
	 *
	 * @return void
	 */
	public static function add_hooks(): void {
		// Tell WordPress to run our function for all sites when the plugin is deactivated.
		register_deactivation_hook( static::get_plugin_basename(), array( static::class, 'do_for_all_blogs' ) );
	}

	/**
	 * Checks if the plugin is currently being deactivated (from the admin area).
	 *
	 * @since 0.0.8
	 * @return bool Returns true if this plugin is being deactivated right now.
	 */
	public static function is_deactivation(): bool {
		// Looks at the request and checks if the user is deactivating this exact plugin.
		return isset( $_GET['action'], $_GET['plugin'] ) && 'deactivate' === $_GET['action'] && static::get_plugin_basename() === $_GET['plugin']; // phpcs:ignore WordPress.Security.NonceVerification
	}
}
