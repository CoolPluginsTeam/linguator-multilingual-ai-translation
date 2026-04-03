<?php
/**
 * Elementor Display Conditions Integration
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
 * Class Linguator_Display_Conditions
 *
 * Adds informational notes to Elementor's display conditions interface
 * to inform users about connected template conditions.
 */
class Linguator_Display_Conditions {
	/**
	 * Constructor
	 *
	 *  
	 */
	public function __construct() {
		add_action( 'elementor/editor/after_enqueue_styles', [ $this, 'linguator_enqueue_conditions_note_style' ] );
		add_action( 'elementor/editor/after_enqueue_scripts', [ $this, 'linguator_add_conditions_note_inline_data' ] );
	}

	/**
	 * Whether current post is an Elementor template with translations (so we should enqueue assets).
	 *
	 * @return array|null Connected post IDs, or null if we should not enqueue.
	 */
	private function linguator_get_connected_template_ids() {
		global $post;
		if ( ! $post || 'elementor_library' !== get_post_type( $post->ID ) ) {
			return null;
		}
		$translations = linguator_get_post_translations( $post->ID );
		if ( empty( $translations ) ) {
			return null;
		}
		$connected_ids = array_map( 'intval', array_values( $translations ) );
		$connected_ids[] = (int) $post->ID;
		return array_values( array_unique( $connected_ids ) );
	}

	/**
	 * Enqueue inline style for the conditions note.
	 *
	 * @return void
	 */
	public function linguator_enqueue_conditions_note_style() {
		if ( null === $this->linguator_get_connected_template_ids() ) {
			return;
		}
		$css = '.lmat-conditions-note{
			text-align:center;
			margin:15px 0;
			border-radius:4px;
			font-size:18px;
			font-weight:300;
			line-height:1.6;
			color:orange;
		}';
		wp_register_style( 'lmat_elementor_conditions_note', false, array(), LINGUATOR_VERSION );
		wp_enqueue_style( 'lmat_elementor_conditions_note' );
		wp_add_inline_style( 'lmat_elementor_conditions_note', $css );
	}

	/**
	 * Pass connected template IDs to the Elementor editor inline-translation bundle
	 *
	 * @return void
	 */
	public function linguator_add_conditions_note_inline_data() {
		$connected_ids = $this->linguator_get_connected_template_ids();

		if ( null === $connected_ids ) {
			return;
		}

		$handle = 'lmat-elementor-inline-translation';

		if ( ! wp_script_is( $handle, 'enqueued' ) ) {
			return;
		}

		wp_add_inline_script(
			$handle,
			'var lmatConnectedIds = ' . wp_json_encode( $connected_ids ) . ';',
			'before'
		);
	}
}

