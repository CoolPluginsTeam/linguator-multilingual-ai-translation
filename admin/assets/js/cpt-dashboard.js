jQuery(document).ready(function($){
    $('.lmat-review-notice-dismiss button').click(function(e){
        e.preventDefault();
        e.stopPropagation();

        var prefix = $(this).closest('.lmat-review-notice-dismiss').data('prefix');
        var nonce = $(this).closest('.lmat-review-notice-dismiss').data('nonce');
        var $notice = $(this).closest('.cpt-review-notice');

        // Hide immediately to prevent flicker/re-show on the same page.
        // Remove on fade completion so nothing can reappear until reload.
        $notice.stop(true, true).fadeOut(150, function () {
            $(this).remove();
        });

        // Fire-and-forget: server persistence is handled by PHP (option update).
        $.post(ajaxurl, {action: 'lmat_hide_review_notice', prefix: prefix, nonce: nonce});
    });
});