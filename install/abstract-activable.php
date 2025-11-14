<?php
/**
 * @package Linguator
 *
 * /!\ THE CONSTANTS `LINGUATOR_BASENAME` AND `LINGUATOR_VERSION` MUST BE DEFINED.
 */

namespace Linguator\Install;

/**
 * A generic (de)activation class compatible with multisite.
 *
 * @since 0.0.8
 */
abstract class LMAT_Abstract_Activable {
	/**
	 * (De)Activation for all blogs.
	 *
	 * @since 0.0.8
	 * @param bool $networkwide Whether the plugin is (de)activated for all sites in the network or just the current site.
	 * @return void
	 */
	public static function do_for_all_blogs( $networkwide ): void {
		if ( is_multisite() && $networkwide ) {
			// Network.
			foreach ( get_sites( array( 'fields' => 'ids', 'number' => 0 ) ) as $blog_id ) {
				switch_to_blog( $blog_id );
				static::process();
			}
			restore_current_blog();
		} else {
			// Single blog.
			static::process();
		}
	}

	/**
	 * Returns the plugin's basename.
	 *
	 * @since 0.0.8
	 *
	 * @return string
	 */
	public static function get_plugin_basename(): string {
		return LMAT_get_constant( 'LINGUATOR_BASENAME', '' );
	}

	/**
	 * Returns the plugin's version.
	 *
	 * @since 0.0.8
	 *
	 * @return string
	 */
	public static function get_plugin_version(): string {
		return LMAT_get_constant( 'LINGUATOR_VERSION', '' );
	}

	/**
	 * The process to run on plugin (de)activation.
	 *
	 * @since 0.0.8
	 * @return void
	 */
	abstract protected static function process(): void;
}
