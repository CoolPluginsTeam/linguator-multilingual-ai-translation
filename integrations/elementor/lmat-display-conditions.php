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
		add_action( 'elementor/editor/after_enqueue_scripts', [ $this, 'linguator_enqueue_conditions_note_script' ] );
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
	 * Enqueue script and inline JS for the conditions note (WordPress way: register → enqueue → add_inline_script).
	 *
	 * @return void
	 */
	public function linguator_enqueue_conditions_note_script() {
		$connected_ids = $this->linguator_get_connected_template_ids();
		if ( null === $connected_ids ) {
			return;
		}

		wp_register_script( 'lmat_elementor_conditions_note', '', array( 'jquery' ), LINGUATOR_VERSION, true );
		wp_enqueue_script( 'lmat_elementor_conditions_note' );
		wp_add_inline_script(
			'lmat_elementor_conditions_note',
			'var lmatConnectedIds = ' . wp_json_encode( $connected_ids ) . ';',
			'before'
		);
		wp_add_inline_script(
			'lmat_elementor_conditions_note',
			$this->linguator_get_conditions_note_inline_js(),
			'after'
		);
	}

	/**
	 * Returns the inline JavaScript for the conditions note (no PHP interpolation).
	 *
	 * @return string
	 */
	private function linguator_get_conditions_note_inline_js() {
		return <<<'JS'
			jQuery(function($) {
				'use strict';
				var lmatAddConditionsNote = function() {
					var conditionsContainer = $('#elementor-theme-builder-conditions');
					if (conditionsContainer.length === 0) return;
					var conflictEls = $('.elementor-conditions-conflict-message:visible');
					if (conflictEls.length === 0) return;
					var conflictIds = [];
					conflictEls.find('a[href*="post="]').each(function() {
						var href = $(this).attr('href');
						if (!href) return;
						var match = href.match(/[?&]post=(\d+)/);
						if (match && match[1]) {
							var id = parseInt(match[1], 10);
							if (!isNaN(id)) conflictIds.push(id);
						}
					});
					if (!conflictIds.some(function(id){ return lmatConnectedIds.indexOf(id) !== -1; })) return;
					if (conditionsContainer.find('.lmat-conditions-note').length > 0) return;
					conditionsContainer.prepend('<div class="lmat-conditions-note">Note: The Conditions applied on its connected templates will be automatically applied to this template. So please ignore the below conflict notice.</div>');
				};
				var observer = new MutationObserver(function() { lmatAddConditionsNote(); });
				observer.observe(document.body, { childList: true, subtree: true });
				$(document).ready(lmatAddConditionsNote);
				$(document).on('click', '.elementor-button.elementor-repeater-add', function() {
					setTimeout(lmatAddConditionsNote, 100);
					setTimeout(lmatAddConditionsNote, 400);
					setTimeout(lmatAddConditionsNote, 900);
				});
			});
		JS;
	}
}

