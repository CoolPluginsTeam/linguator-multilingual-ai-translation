<?php
/**
 * @package Linguator
 *
 * NOTE: You must define the constants `LINGUATOR_BASENAME` and `LINGUATOR_VERSION` for this code to work.
 */

namespace Linguator\Install;


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Linguator\Includes\Options\Options;
use Linguator\Includes\Options\Registry as Options_Registry;
use Linguator\Modules\Wizard\Linguator_Wizard;


/**
 * Handles plugin activation for single and multisite installs.
 *
 * This class sets up everything needed when the plugin is activated.
 *
 * @since 0.0.8
 */
class Linguator_Activate extends Linguator_Abstract_Activate {
	/**
	 * Adds required hooks for plugin activation.
	 *
	 * This includes linking the plugin's activation process and any hooks needed.
	 *
	 * @since 0.0.8
	 * @return void
	 */
	public static function add_hooks(): void {
		// When the plugin is activated, start the setup wizard.
		register_activation_hook( static::get_plugin_basename(), array( Linguator_Wizard::class, 'start_wizard' ) );

		// Call any hooks defined in the parent class.
		parent::add_hooks();
	}

	/**
	 * Runs all necessary steps when the plugin is activated.
	 *
	 * This function initializes options and checks if there is a need to upgrade the plugin data.
	 *
	 * @since 0.5
	 * @return void
	 */
	protected static function process(): void {
		// Make sure our plugin options are set up when needed.
		add_action( 'lmat_init_options_for_blog', array( Options_Registry::class, 'register' ) );
		$options = new Options();

		// Check and store first installation date
		$install_date = get_option('lmat_install_date');

		if (empty($install_date)) {
			update_option('lmat_install_date', gmdate('Y-m-d h:i:s'));
			// Set flag for redirection
			update_option('lmat_needs_setup', 'yes');
			// Set flag to ensure rewrite rules are flushed on first admin page load
			// This is a safety net in case flush_rewrite_rules() during activation doesn't work
			update_option('lmat_needs_rewrite_flush', 'yes');
			
			
			// Ensure language switcher meta box is visible for new installations
			$user_id = get_current_user_id();
			if ($user_id) {
				$hidden_meta_boxes = get_user_meta($user_id, 'metaboxhidden_nav-menus', true);
				// If meta doesn't exist yet, initialize as empty array
				if (!is_array($hidden_meta_boxes)) {
					$hidden_meta_boxes = array();
				}
				// Remove language switcher from hidden meta boxes to make it visible
				$hidden_meta_boxes = array_diff($hidden_meta_boxes, array('lmat_lang_switch_box'));
				update_user_meta($user_id, 'metaboxhidden_nav-menus', $hidden_meta_boxes);
			}
		}

		if ( empty( $options['version'] ) ) {
			// If this is a fresh install, set the current plugin version.
			$options['version'] = static::get_plugin_version();
		}

		// Save all option changes right now to avoid conflicts with other plugin instances.
		$options->save();

		add_option(
			// Track if language can be detected from content. Set to 'yes' if force_lang is 0, otherwise 'no'.
			'lmat_language_from_content_available',
			0 === $options['force_lang'] ? 'yes' : 'no'
		);

		// Save registered language taxonomies.
		add_option( 'lmat_language_taxonomies', array() );

		// Also clear any cached language data in the cache object
		if ( class_exists( 'Linguator\Includes\Helpers\Linguator_Cache' ) ) {
			$cache = new \Linguator\Includes\Helpers\Linguator_Cache();
			$cache->clean();
		}

		/*
		 * Flush rewrite rules to ensure REST API endpoints are accessible immediately.
		 * This prevents "invalid JSON response" errors when the setup wizard tries to make REST API calls.
		 */
		flush_rewrite_rules();
		$options = get_option( 'linguator' );
		$lmat_feedback_data = $options['lmat_feedback_data'];
		if ( $lmat_feedback_data === true && ! wp_next_scheduled( 'lmat_extra_data_update' ) ) {
			wp_schedule_event( time(), 'every_30_days', 'lmat_extra_data_update' );
		}
	}
}

