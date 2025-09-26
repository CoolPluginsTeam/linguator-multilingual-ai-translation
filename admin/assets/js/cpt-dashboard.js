jQuery(document).ready(function($){
    $('.lmat-review-notice-dismiss button').click(function(){
        var prefix = $(this).closest('.lmat-review-notice-dismiss').data('prefix');
        var nonce = $(this).closest('.lmat-review-notice-dismiss').data('nonce');

        $.post(ajaxurl, {action: 'lmat_hide_review_notice', prefix: prefix, nonce: nonce}, (response)=>{
            $(this).closest('.cpt-review-notice').slideUp();
        });
    });
});