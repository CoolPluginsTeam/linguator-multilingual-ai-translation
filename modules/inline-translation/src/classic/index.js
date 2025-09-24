import TranslateToolTip from './classic-tooltip.js';

class ClassicTranslationTooltip {
    constructor(contentTinyMCE) {
        this.contentTinyMCE = contentTinyMCE;
        this.reactRoot = null;
        this.prefix='lmatClassicInlineTranslation';
        this.toolTipTop=0;
        this.toolTipLeft=0;
        this.showDebounce=false;
    }

    showToolTip(){
        clearTimeout(this.showDebounce);
        this.showDebounce=setTimeout(()=>{
            this.reactRoot.render(
                <TranslateToolTip
                    top={Math.max(this.toolTipTop, 0)}
                    left={Math.max(this.toolTipLeft, 0)}
                    prefix={this.prefix}
                    unMountToolTip={() => {
                        this.reactRoot.unmount();
                        this.reactRoot = null; // Reset the root reference
                    }}
                    getContent={() => {
                        return this.contentTinyMCE.selection.getContent();
                    }}
                    setContent={(value) => {
                        this.contentTinyMCE.selection.setContent(value);
                    }}
                />
            );
        },200);
    }

    init() {
        if (this.reactRoot) {
            this.reactRoot.unmount();
            this.reactRoot = null;
        }

        this.contentTinyMCE.on('selectionchange', () => {
            if (!this.contentTinyMCE || !this.contentTinyMCE.selection) {
                return;
            }

            const selectedText = this.contentTinyMCE.selection.getContent();

            if (selectedText.length <= 0) {
                return;
            }

            const selectedElements = this.contentTinyMCE.selection.getSel();

            if (!selectedElements || !selectedElements.extentNode) {
                return;
            }

            const extendNode = selectedElements.extentNode;
            const extendOffset = selectedElements.extentOffset;

            const range = document.createRange();
            range.setStart(extendNode, extendOffset);
            range.setEnd(extendNode, extendOffset);

            const rect = range.getBoundingClientRect();

            if (!this.reactRoot) {
                this.reactRoot = ReactDOM.createRoot(document.getElementById('lmat-classic-inline-translation'));
            }

            this.toolTipTop=rect.top + 59;
            this.toolTipLeft=rect.left - 50;

            this.showToolTip();
        });

        this.contentTinyMCE.on('mousedown', () => {
            this.reactRoot && this.reactRoot.unmount();
            this.reactRoot = null; // Reset the root reference
        });
    }
}

jQuery(window).on('load', function () {
    if(typeof tinymce !== 'undefined' && tinymce) {
        const contentTinyMCE = tinymce.get('content');
        
        if(contentTinyMCE){

            const wrapperElement=document.createElement('div');
            wrapperElement.id = 'lmat-classic-inline-translation';
            document.querySelector('#wp-content-wrap')?.appendChild(wrapperElement);

            const classicTranslationTooltip = new ClassicTranslationTooltip(contentTinyMCE);
            classicTranslationTooltip.init();
        }
    }
});