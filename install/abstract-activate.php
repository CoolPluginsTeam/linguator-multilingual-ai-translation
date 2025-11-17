<?php
/**
 * @package Linguator
 *
 * IMPORTANT: You must define the constants `LINGUATOR_BASENAME` and `LINGUATOR_VERSION` for this to work.
 */

namespace Linguator\Install;

/**
 * This abstract class helps you manage plugin activation steps.
 * It works with both regular WordPress sites and Multisite networks.
 * Extend this class to easily set up code that runs when the plugin is activated.
 *
 * @since 0.0.8
 */
abstract class LMAT_Abstract_Activate extends LMAT_Abstract_Activable {
	/**
	 * Register activation hooks for your plugin.
	 *
	 * This function:
	 * - Sets up the code to run when the plugin is activated.
	 * - Ensures new sites on a multisite network get default plugin settings.
	 *
	 * @since 0.0.8
	 *
	 * @return void
	 */
	public static function add_hooks(): void {
		// Run our activation process when the plugin is activated in WordPress.
		register_activation_hook( static::get_plugin_basename(), array( static::class, 'do_for_all_blogs' ) );

		// When a new site is added in multisite, run our setup to add default options.
		// The priority 50 makes sure our code runs after WordPress has finished its own setup for the new site.
		add_action( 'wp_initialize_site', array( static::class, 'new_site' ), 50 );
	}

	/**
	 * Runs when a new site is created in a WordPress Multisite network.
	 * This is used to set default options or do other setup tasks automatically on the new site.
	 *
	 * @since 0.0.8
	 * @param WP_Site $new_site The new site object created by WordPress.
	 * @return void
	 */
	public static function new_site( $new_site ): void {
		// Temporarily switch to the new site's context.
		switch_to_blog( $new_site->id );
		// Run our plugin's setup or activation code for the new site.
		static::process();
		// Return to the original site.
		restore_current_blog();
	}
}
