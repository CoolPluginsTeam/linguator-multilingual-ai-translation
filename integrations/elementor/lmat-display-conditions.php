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
		global $post;
		if ( ! $post || 'elementor_library' !== get_post_type( $post->ID ) ) {
			return;
		}

		        // Check if this is a translated template
        $translations = lmat_get_post_translations( $post->ID );
        if ( empty( $translations ) ) {
            return;
        }

        // Build list of connected post IDs (current + all translations)
        $connected_ids = array_map( 'intval', array_values( $translations ) );
        $connected_ids[] = (int) $post->ID;
        $connected_ids   = array_values( array_unique( $connected_ids ) );
		?>
		<style>
			.lmat-conditions-note {
				text-align: center;
				margin: 15px 0;
				border-radius: 4px;
				font-size: 18px;
                font-weight: 300;
				line-height: 1.6;
				color: orange;
			}
		</style>
		        <script>
        jQuery(function($) {
            'use strict';

            // Connected template IDs for this group (current + translations)
            var lmatConnectedIds = <?php echo wp_json_encode( $connected_ids ); ?>;

            
            // Adds the note if the conflict message is present
            var lmatAddConditionsNote = function() {
                // Target the specific Elementor theme builder conditions container
                var conditionsContainer = $('#elementor-theme-builder-conditions');
                if (conditionsContainer.length === 0) {
                    return;
                }

                // Only proceed when at least one conflict message exists (and is visible)
                var conflictEls = $('.elementor-conditions-conflict-message:visible');
                if (conflictEls.length === 0) {
                    return;
                }

                // Collect all conflicting template IDs from links inside the messages
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

                // Decide visibility: show the note if ANY conflicting ID belongs to the connected set
                var isConnectedConflict = conflictIds.some(function(id){ return lmatConnectedIds.indexOf(id) !== -1; });
                if (!isConnectedConflict) {
                    return;
                }

                // Avoid duplicates
                if (conditionsContainer.find('.lmat-conditions-note').length > 0) {
                    return;
                }

				// Create the note
				var noteHtml = '<div class=\"lmat-conditions-note\">' +
					'Note: The Conditions applied on its connected templates will be automatically applied to this template. So please ignore the below conflict notice.' +
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
			
			// Run on document ready and bind to Add Condition button
			$(document).ready(function() {
				lmatAddConditionsNote();
			});
			
			// When user clicks the "+ Add condition" button, re-check for conflict and add note if present
			$(document).on('click', '.elementor-button.elementor-repeater-add', function() {
				setTimeout(lmatAddConditionsNote, 100);
				setTimeout(lmatAddConditionsNote, 400);
				setTimeout(lmatAddConditionsNote, 900);
			});
		});
		</script>
		<?php
	}
}
