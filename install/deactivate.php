<?php
/**
 * @package Linguator
 *
 * /!\ THE CONSTANTS `LINGUATOR_BASENAME` AND `LINGUATOR_VERSION` MUST BE DEFINED.
 */

namespace Linguator\Install;
	
/**
 * Deactivation class compatible with multisite.
 *
 * @since 0.0.8
 */
class LMAT_Deactivate extends LMAT_Abstract_Deactivate {
	/**
	 * The process to run on plugin deactivation.
	 *
	 * @since 0.0.8
	 * @return void
	 */
	protected static function process(): void {
		delete_option( 'rewrite_rules' ); // Don't use flush_rewrite_rules at network deactivation. See #32471.
	}
}
