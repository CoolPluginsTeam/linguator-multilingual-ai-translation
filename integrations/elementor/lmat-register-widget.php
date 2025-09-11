<?php
/**
 * Language Switcher Elementor Widget
 *
 * @package           Linguator
 * @wordpress-plugin
 */

namespace Linguator\Integrations\elementor;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class LMAT_Register_Widget
 *
 * Handles the registration of custom Elementor widget.
 */
class LMAT_Register_Widget {

	/**
	 * Constructor
	 *
	 * Initialize the class and set up hooks.
	 */
	public function __construct() {
		add_action( 'elementor/widgets/register', array( $this, 'lmat_register_widgets' ) );
	}

	/**
	 * Register custom Elementor widgets
	 *
	 * @return void
	 */
	public function lmat_register_widgets() {
		require_once LINGUATOR_DIR . '/integrations/elementor/lmat-widget.php';
		\Elementor\Plugin::instance()->widgets_manager->register( new LMAT_Widget() );
	}
}