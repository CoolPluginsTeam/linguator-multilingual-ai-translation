<?php
/**
 * Handles deactivation logic for the Linguator plugin.
 *
 * IMPORTANT: Make sure the constants LINGUATOR_BASENAME and LINGUATOR_VERSION are defined before using this class.
 *
 * @package Linguator
 */

namespace Linguator\Install;

/**
 * Class to take care of plugin deactivation.
 * Works with both single and multisite WordPress setups.
 *
 * @since 0.0.8
 */
class LMAT_Deactivate extends LMAT_Abstract_Deactivate {
	/**
	 * Runs tasks needed when the plugin is deactivated.
	 *
	 * This function deletes the 'rewrite_rules' option so that WordPress rewrites are reset when the plugin is turned off.
	 * We do not use flush_rewrite_rules here because it can cause problems when deactivating on a network in multisite mode.
	 *
	 * @since 0.0.8
	 * @return void
	 */
	protected static function process(): void {
		delete_option( 'rewrite_rules' ); // Remove stored permalinks so WordPress updates them safely after deactivation.
		wp_clear_scheduled_hook('lmat_extra_data_update');
	}
}
