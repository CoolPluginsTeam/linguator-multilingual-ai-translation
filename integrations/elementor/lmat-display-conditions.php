<?php
/**
 * Elementor Display Conditions for Linguator
 *
 * @package Linguator
 */

namespace Linguator\Integrations\elementor;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class LMAT_Display_Conditions
 *
 * Handles the display conditions for Elementor templates based on language.
 */
class LMAT_Display_Conditions {

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		// Check if Elementor Pro is active
		if ( ! lmat_is_plugin_active( 'elementor-pro/elementor-pro.php' ) ) {
			return;
		}

		// Register the custom display condition
		add_action( 'elementor/theme/register_conditions', [ $this, 'register_language_condition' ] );
	}

	/**
	 * Register language condition for Elementor display conditions
	 *
	 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Conditions_Manager $conditions_manager Conditions manager instance.
	 * @return void
	 */
	public function register_language_condition( $conditions_manager ) {
		// Get the condition class
		require_once __DIR__ . '/conditions/language-condition.php';
		
		// Register the condition
		$conditions_manager->get_condition( 'general' )->register_sub_condition( new Language_Condition() );
	}
}
