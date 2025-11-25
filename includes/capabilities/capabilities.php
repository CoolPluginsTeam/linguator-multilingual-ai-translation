<?php
/**
 * @package Linguator
 */

namespace Linguator\Includes\Capabilities;

defined( 'ABSPATH' ) || exit;

/**
 * This class helps WordPress understand Linguator's custom capabilities, like handling languages and translations, by matching them to standard WordPress capabilities.
 *
 * In simple terms: When something in Linguator needs a special permission (like "manage_languages" or "manage_translations"), this class tells WordPress what basic permission is needed for that action.
 *
 * @since 0.0.8
 */
class Capabilities {
	public const LANGUAGES    = 'manage_languages';     // Used when a user wants to manage languages in Linguator.
	public const TRANSLATIONS = 'manage_translations';  // Used when a user wants to manage translations in Linguator.

	/**
	 * Sets up the mapping of custom capabilities to standard WordPress ones.
	 *
	 * @since 0.0.8
	 */
	public function __construct() {
		// Add a filter so we can change how WordPress checks capabilities for Linguator.
		add_filter( 'map_meta_cap', array( $this, 'map_custom_caps' ), 1, 2 ); // phpcs:ignore WordPress.NamingConventions.ValidHookName
	}

	/**
	 * Filters user capabilities to handle LMAT's custom capabilities.
	 *
	 * @since 0.0.8
	 *
	 * @param string[] $caps An array of capabilities that WordPress thinks are needed for the action.
	 * @param string   $cap  The name of the capability being checked right now.
	 * @return string[]      The final list of capabilities WordPress will actually check for.
	 */
	public function map_custom_caps( $caps, $cap ) {
		// If we're asking for one of Linguator's custom caps,
		// remove it and instead require 'manage_options' (admin permission).
		if ( in_array( $cap, array( self::TRANSLATIONS, self::LANGUAGES ), true ) ) {
			$caps   = array_diff( $caps, array( $cap ) );
			$caps[] = 'manage_options';
		}

		// Return the updated capabilities list.
		return $caps;
	}
}
