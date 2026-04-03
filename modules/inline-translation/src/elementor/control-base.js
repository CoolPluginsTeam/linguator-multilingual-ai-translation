import ElementorTranslator from "./elementor-translator-button.js";

/**
 * Theme Builder: note when display-condition conflicts involve linked template translations.
 * `lmatConnectedIds` is output from PHP only for translated `elementor_library` templates.
 */
export function initLmatDisplayConditionsNote() {
	if (
		typeof window.lmatConnectedIds === 'undefined' ||
		! Array.isArray( window.lmatConnectedIds )
	) {
		return;
	}

	const lmatConnectedIds = window.lmatConnectedIds;

	jQuery( function ( $ ) {
		const lmatAddConditionsNote = function () {
			const conditionsContainer = $( '#elementor-theme-builder-conditions' );
			if ( conditionsContainer.length === 0 ) {
				return;
			}

			const conflictEls = $(
				'.elementor-conditions-conflict-message:visible'
			);
			if ( conflictEls.length === 0 ) {
				return;
			}

			const conflictIds = [];

			conflictEls.find( 'a[href*="post="]' ).each( function () {
				const href = $( this ).attr( 'href' );
				if ( ! href ) {
					return;
				}

				const match = href.match( /[?&]post=(\d+)/ );
				if ( match && match[ 1 ] ) {
					const id = parseInt( match[ 1 ], 10 );
					if ( ! isNaN( id ) ) {
						conflictIds.push( id );
					}
				}
			} );

			if (
				! conflictIds.some( function ( id ) {
					return lmatConnectedIds.indexOf( id ) !== -1;
				} )
			) {
				return;
			}

			if ( conditionsContainer.find( '.lmat-conditions-note' ).length > 0 ) {
				return;
			}

			conditionsContainer.prepend(
				'<div class="lmat-conditions-note">Note: The Conditions applied on its connected templates will be automatically applied to this template. So please ignore the below conflict notice.</div>'
			);
		};

		const observer = new MutationObserver( function () {
			lmatAddConditionsNote();
		} );

		observer.observe( document.body, { childList: true, subtree: true } );

		$( document ).ready( lmatAddConditionsNote );

		$( document ).on(
			'click',
			'.elementor-button.elementor-repeater-add',
			function () {
				setTimeout( lmatAddConditionsNote, 100 );
				setTimeout( lmatAddConditionsNote, 400 );
				setTimeout( lmatAddConditionsNote, 900 );
			}
		);
	} );
}

export default class ControlBase extends elementorModules.editor.utils.Module {
    constructor(prefix) {
        super();

        this.pluginPrefix = prefix;
    }
    onElementorInit() {
        elementor.hooks.addFilter('controls/base/behaviors', this.addControlBehavior.bind(this));
    }

    addControlBehavior(behaviors, view) {
        const controlType = view.options.model.get('type');
        const aiConfig = view.options.model.get( 'ai' );

        if (!aiConfig?.active) {
            return behaviors;
        }

        if (['text', 'textarea'].includes(aiConfig.type)) {

            behaviors.lmatElementorInlineTranslation = {
                behaviorClass: ElementorTranslator,
                pluginPrefix: this.pluginPrefix,
                controlType,
                setControlValue: (value) => {

                    if ('wysiwyg' === controlType) {
                        value = value.replaceAll('\n', '<br>');
                    }

                    view.setSettingsModel(value);
                    view.applySavedValue();
                },
                getControlValue: view.getControlValue.bind(view),
                isLabelBlock: view.options.model.get('label_block'),
                controlLabel: view.options.model.get('label')
            };
        }

        return behaviors;
    }
};