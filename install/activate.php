<?php
/**
 * @package Linguator
 *
 * /!\ THE CONSTANTS `LINGUATOR_BASENAME` AND `LINGUATOR_VERSION` MUST BE DEFINED.
 */

namespace Linguator\Install;

use Linguator\Includes\Options\Options;
use Linguator\Includes\Options\Registry as Options_Registry;

/**
 * Activation class compatible with multisite.
 *
 * @since 0.0.8
 */
class LMAT_Activate extends LMAT_Abstract_Activate {
	/**
	 * Adds the required hooks.
	 *
	 * @since 0.0.8
	 *
	 * @return void
	 */
	public static function add_hooks(): void {
		register_activation_hook( static::get_plugin_basename(), array( LMAT_Wizard::class, 'start_wizard' ) );

		parent::add_hooks();
	}

	/**
	 * The process to run on plugin activation.
	 *
	 * @since 0.5
	 * @return void
	 */
	protected static function process(): void {
		add_action( 'lmat_init_options_for_blog', array( Options_Registry::class, 'register' ) );
		$options = new Options();

		if ( ! empty( $options['version'] ) ) {
			// Check if we will be able to upgrade.
			if ( version_compare( $options['version'], static::get_plugin_version(), '<' ) ) {
				( new LMAT_Upgrade( $options ) )->can_activate();
			}
		} else {
			$options['version'] = static::get_plugin_version();
		}

		$options->save(); // Force save here to prevent any conflicts with another instance of `Options`.

		add_option(
			'lmat_language_from_content_available',
			0 === $options['force_lang'] ? 'yes' : 'no'
		);

		// Avoid 1 query on every pages if no wpml strings is registered.
		add_option( 'lmat_wpml_strings', array() );

		add_option( 'lmat_language_taxonomies', array() );

		/*
		 * Don't use flush_rewrite_rules at network activation. See #32471.
		 * Thanks to RavanH for the trick. See https://linguator.com/2015/06/10/linguator-1-7-6-and-multisite/.
		 * Rewrite rules are created at next page load.
		 */
		delete_option( 'rewrite_rules' );
	}
}
