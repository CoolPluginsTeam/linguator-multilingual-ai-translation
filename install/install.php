<?php
/**
 * @package Linguator
 */
namespace Linguator\Install;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}



use Linguator\Includes\Options\Options;
use Linguator\Includes\Options\Registry as Options_Registry;
use Linguator\Install\LMAT_Install_Base;


/**
 * Linguator activation / de-activation class
 *
 *  
 */
class LMAT_Install extends LMAT_Install_Base {

	/**
	 * Checks min PHP and WP version, displays a notice if a requirement is not met.
	 *
	 *  
	 *
	 * @return bool
	 */
	public function can_activate() {
		global $wp_version;

		if ( version_compare( PHP_VERSION, LMAT_MIN_PHP_VERSION, '<' ) ) {
			add_action( 'admin_notices', array( $this, 'php_version_notice' ) );
			return false;
		}

		if ( version_compare( $wp_version, LMAT_MIN_WP_VERSION, '<' ) ) {
			add_action( 'admin_notices', array( $this, 'wp_version_notice' ) );
			return false;
		}

		return true;
	}

	/**
	 * Displays a notice if PHP min version is not met.
	 *
	 *  
	 *
	 * @return void
	 */
	public function php_version_notice() {

		printf(
			'<div class="error"><p>%s</p></div>',
			sprintf(
				/* translators: 1: Plugin name 2: Current PHP version 3: Required PHP version */
				esc_html__( '%1$s has deactivated itself because you are using an old version of PHP. You are using using PHP %2$s. %1$s requires PHP %3$s.', 'linguator-multilingual-ai-translation' ),
				esc_html( LINGUATOR ),
				esc_html( PHP_VERSION ),
				esc_html( LMAT_MIN_PHP_VERSION )
			)
		);
	}

	/**
	 * Displays a notice if WP min version is not met.
	 *
	 *  
	 *
	 * @return void
	 */
	public function wp_version_notice() {
		global $wp_version;

		printf(
			'<div class="error"><p>%s</p></div>',
			sprintf(
				/* translators: 1: Plugin name 2: Current WordPress version 3: Required WordPress version */
				esc_html__( '%1$s has deactivated itself because you are using an old version of WordPress. You are using using WordPress %2$s. %1$s requires at least WordPress %3$s.', 'linguator-multilingual-ai-translation' ),
				esc_html( LINGUATOR ),
				esc_html( $wp_version ),
				esc_html( LMAT_MIN_WP_VERSION )
			)
		);
	}

	/**
	 * Plugin activation
	 *
	 *  
	 *
	 * @return void
	 */
	protected function _activate() {
		add_action( 'lmat_init_options_for_blog', array( Options_Registry::class, 'register' ) );
		$options = new Options();

		// Check and store first installation date
		$install_date = get_option('lmat_install_date');
		if (empty($install_date)) {
			// Store the first installation date
			update_option('lmat_install_date', current_time('timestamp'));
			// Set flag for redirection
			update_option('lmat_needs_setup', 'yes');
		}

		
		// Update version to current
		$options['version'] = LINGUATOR_VERSION;

		$options->save(); // Force save here to prevent any conflicts with another instance of `Options`.

		if ( false === get_option( 'lmat_language_from_content_available' ) ) {
			update_option(
				'lmat_language_from_content_available',
				0 === $options['force_lang'] ? 'yes' : 'no'
			);
		}

		// Avoid 1 query on every pages if no wpml strings is registered
		if ( ! get_option( 'linguator_wpml_strings' ) ) {
			update_option( 'linguator_wpml_strings', array() );
		}

		// Clear language cache on activation to ensure fresh data is loaded
		// This fixes the issue where deleted languages from linguator still show up
		delete_transient( 'lmat_languages_list' );
		
		// Also clear any cached language data in the cache object
		if ( class_exists( 'Linguator\Includes\Helpers\LMAT_Cache' ) ) {
			$cache = new \Linguator\Includes\Helpers\LMAT_Cache();
			$cache->clean();
		}

		// Don't use flush_rewrite_rules at network activation. 
		delete_option( 'rewrite_rules' );
		$options = get_option( 'linguator' );
		$lmat_feedback_data = $options['lmat_feedback_data'];
		if ( $lmat_feedback_data === true && ! wp_next_scheduled( 'lmat_extra_data_update' ) ) {
			wp_schedule_event( time(), 'every_30_days', 'lmat_extra_data_update' );
		}
	}

	/**
	 * Plugin deactivation
	 *
	 *  
	 *
	 * @return void
	 */
	protected function _deactivate() {
		delete_option( 'rewrite_rules' ); // Don't use flush_rewrite_rules at network activation. 
		delete_option( 'lmat_elementor_templates_assigned' );
		wp_clear_scheduled_hook('lmat_extra_data_update');
	}
}
