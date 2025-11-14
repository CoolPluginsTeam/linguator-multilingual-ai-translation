<?php
/**
 * @package Linguator
 *
 * /!\ THE CONSTANTS `LINGUATOR_BASENAME` AND `LINGUATOR_VERSION` MUST BE DEFINED.
 */

namespace Linguator\Install;

/**
 * A generic deactivation class compatible with multisite.
 *
 * @since 0.0.8
 */
abstract class LMAT_Abstract_Deactivate extends LMAT_Abstract_Activable {
	/**
	 * Adds the required hooks.
	 *
	 * @since 0.0.8
	 *
	 * @return void
	 */
	public static function add_hooks(): void {
		register_deactivation_hook( static::get_plugin_basename(), array( static::class, 'do_for_all_blogs' ) );
	}

	/**
	 * Detects plugin deactivation.
	 *
	 * @since 0.0.8
	 * @return bool True if the plugin is currently being deactivated.
	 */
	public static function is_deactivation(): bool {
		return isset( $_GET['action'], $_GET['plugin'] ) && 'deactivate' === $_GET['action'] && static::get_plugin_basename() === $_GET['plugin']; // phpcs:ignore WordPress.Security.NonceVerification
	}
}
