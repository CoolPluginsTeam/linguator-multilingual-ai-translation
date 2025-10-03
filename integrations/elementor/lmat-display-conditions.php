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
 * Class LMAT_Display_Conditions
 *
 * Adds informational notes to Elementor's display conditions interface
 * to inform users about connected template conditions.
 */
class LMAT_Display_Conditions {
	/**
	 * Constructor
	 *
	 *  
	 */
	public function __construct() {
		// Add custom note to display conditions modal
		add_action( 'elementor/editor/footer', [ $this, 'add_conditions_note_script_and_style' ] );
	}

	/**
	 * Add script and styles to display conditions modal
	 *
	 * @return void
	 */
	public function add_conditions_note_script_and_style() {
		// Only load for Elementor library posts (templates)
		global $post;
		if ( ! $post || 'elementor_library' !== get_post_type( $post->ID ) ) {
			return;
		}

		// Check if this is a translated template
		$translations = lmat_get_post_translations( $post->ID );
		if ( empty( $translations ) ) {
			return;
		}
		?>
		<style>
			.lmat-conditions-note {
				text-align: center;
				margin: 15px 0;
				border-radius: 4px;
				font-size: 18px;
                font-weight: 300;
				line-height: 1.6;
				color: yellow;
			}
		</style>
		<script>
		jQuery(function($) {
			'use strict';
			
			var lmatAddConditionsNote = function() {
				// Target the specific Elementor theme builder conditions container
				var conditionsContainer = $('#elementor-theme-builder-conditions');
				
				if (conditionsContainer.length === 0) {
					return;
				}
				
				// Check if note already exists
				if (conditionsContainer.find('.lmat-conditions-note').length > 0) {
					return;
				}
				
				// Create the note
				var noteHtml = '<div class="lmat-conditions-note">' +
					'Note: The display conditions set on the connected template will also be applied to this version.' +
				'</div>';
				
				// Prepend the note to the conditions container
				conditionsContainer.prepend(noteHtml);
			};
			
			// Watch for DOM changes
			var observer = new MutationObserver(function(mutations) {
				lmatAddConditionsNote();
			});
			
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
			
			// Run on document ready and clicks
			$(document).ready(function() {
				lmatAddConditionsNote();
			});
			
			$(document).on('click', function() {
				setTimeout(lmatAddConditionsNote, 100);
				setTimeout(lmatAddConditionsNote, 500);
				setTimeout(lmatAddConditionsNote, 1000);
			});
		});
		</script>
		<?php
	}
}
