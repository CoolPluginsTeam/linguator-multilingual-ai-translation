const { __, sprintf } = wp.i18n;

const lmatElementorConfirmBox = {
    init: function() {
        this.pageTitleEvent=false;
        if(window.lmatElementorConfirmBoxData){
            this.createConfirmBox();
        }
    },

    createConfirmBox: function() {
        const sourceLangName=window.lmatElementorConfirmBoxData.sourceLangName;
        const targetLangName=window.lmatElementorConfirmBoxData.targetLangName;
        const confirmBox = jQuery(`<div class="lmat-elementor-translate-confirm-box modal-container" style="display:flex">
            <div class="modal-content">
            <p>
                ${sprintf(
                __("The original page in %s was built with Elementor. Its content has already been copied into this new %s version. You can now translate it with Elementor to keep the same design, or edit it with the Gutenberg editor.", "linguator-multilingual-ai-translation"),
                sourceLangName,
                targetLangName
                )}
            </p>
            <div>
                <button data-value="yes">
                ${__("Translate with Elementor", "linguator-multilingual-ai-translation")}
                </button>
                <button data-value="no">
                ${__("Edit with Default Editor", "linguator-multilingual-ai-translation")}
                </button>
            </div>
            </div>
        </div>
        `);

        confirmBox.appendTo(jQuery('body'));

        confirmBox.find('button[data-value="yes"]').on('click', (e)=>{this.confirmTranslation(e)});
        confirmBox.find('button[data-value="no"]').on('click', (e)=>{e.preventDefault();this.closeConfirmBox();});
    },

    closeConfirmBox: function() {
        this.setPageTitle();
        const confirmBox = jQuery('.lmat-elementor-translate-confirm-box.modal-container');
        confirmBox.remove();
    },

    confirmTranslation: function(e) {
        this.setPageTitle();
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
            const elementorEditModeButton=document.getElementById('elementor-edit-mode-button');

            if(elementorEditModeButton) {
                elementorEditModeButton.click();
            }else if(elementorButton) {
                elementorButton.click();
            }

            this.closeConfirmBox();
        }
    },

    setPageTitle: function() {

        if(window.lmatElementorConfirmBoxData.editorType !== 'classic') {
            return;
        }

        if(this.pageTitleEvent) {
            return;
        }

        this.pageTitleEvent=true;

        const elementorButtons=document.querySelectorAll('#elementor-editor-button, #elementor-edit-mode-button');

        elementorButtons.forEach(button=>{
            button.addEventListener('click', (e)=>{  
                e.preventDefault();              
                
                if(window.wp && window.elementorAdmin && window.elementorAdmin.getDefaultElements){
                    const defaultElements=window.elementorAdmin.getDefaultElements();

                    if(defaultElements) {
                        $goToEditLink=defaultElements.$goToEditLink;

                        if($goToEditLink) {
                            var $wpTitle = jQuery('#title');

                            if (!$wpTitle.val()) {
                              $wpTitle.val('Elementor #' + jQuery('#post_ID').val());
                            }

                            if (wp.autosave) {
                              wp.autosave.server.triggerSave();
                            }

                            jQuery(document).on('heartbeat-tick.autosave', function () {
                              window.elementorCommon.elements.$window.off('beforeunload.edit-post');
                              location.href = $goToEditLink.attr('href');
                            });
                        }
                    }
                }
            });
        });
    }
};

jQuery(document).ready(function($) {
    lmatElementorConfirmBox.init();
});