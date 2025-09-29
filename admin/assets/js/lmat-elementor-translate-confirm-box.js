const { __, sprintf } = wp.i18n;

const lmatElementorConfirmBox = {
    init: function() {
        if(window.lmatElementorConfirmBoxData){
            this.createConfirmBox();
        }
    },

    createConfirmBox: function() {
        console.log('createConfirmBox');
        const sourceLangName=window.lmatElementorConfirmBoxData.sourceLangName;
        const targetLangName=window.lmatElementorConfirmBoxData.targetLangName;
        const confirmBox = jQuery(`<div class="lmat-elementor-translate-confirm-box modal-container" style="display:flex">
            <div class="modal-content">
            <p>
                ${sprintf(
                __("The original page in %s was built with Elementor. Its content has already been copied into this new %s version. You can now translate it with Elementor to keep the same design, or edit it with the Gutenberg editor.", "autopoly-ai-translation-for-polylang-pro"),
                sourceLangName,
                targetLangName
                )}
            </p>
            <div>
                <button data-value="yes">
                ${__("Translate with Elementor", "autopoly-ai-translation-for-polylang-pro")}
                </button>
                <button data-value="no">
                ${__("Edit with Gutenberg", "autopoly-ai-translation-for-polylang-pro")}
                </button>
            </div>
            </div>
        </div>
        `);

        confirmBox.appendTo(jQuery('body'));

        confirmBox.find('button[data-value="yes"]').on('click', (e)=>this.confirmTranslation(e));
        confirmBox.find('button[data-value="no"]').on('click', (e)=>{e.preventDefault();this.closeConfirmBox();});
    },

    closeConfirmBox: function() {
        const confirmBox = jQuery('.lmat-elementor-translate-confirm-box.modal-container');
        confirmBox.remove();
    },

    confirmTranslation: function(e) {
        e.preventDefault();
        const postId=window.lmatElementorConfirmBoxData.postId;
        const targetLangSlug=window.lmatElementorConfirmBoxData.targetLangSlug;

        if(postId && targetLangSlug) {
            let oldData=localStorage.getItem('lmatElementorConfirmBox');
            let data={[postId+'_'+targetLangSlug]: true};

            if(oldData && 'string' === typeof oldData && '' !== oldData) {
                oldData=JSON.parse(oldData);
                data={...oldData, ...data};
            }

            localStorage.setItem('lmatElementorConfirmBox', JSON.stringify(data));

            const elementorButton=document.getElementById('elementor-editor-button');

            if(elementorButton) {
                elementorButton.click();
            }

            this.closeConfirmBox();
        }
    }
};

jQuery(document).ready(function($) {
    lmatElementorConfirmBox.init();
});