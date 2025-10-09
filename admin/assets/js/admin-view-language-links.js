jQuery(document).ready(function(){
    const lmatSubsubsubList = jQuery('.lmat_subsubsub');
    const lmatBulkTranslateBtn = jQuery('.lmat-bulk-translate-btn');

    if(lmatSubsubsubList.length){
        const $defaultSubsubsub = jQuery('ul.subsubsub:not(.lmat_subsubsub_list)');

        if($defaultSubsubsub.length){
            $defaultSubsubsub.before(lmatSubsubsubList);
            lmatSubsubsubList.show();
        }
    }

    if(lmatBulkTranslateBtn.length){
        const $defaultFilter = jQuery('#posts-filter .actions:not(.bulkactions)');
        const $bulkAction=jQuery('.actions.bulkactions');

        if($defaultFilter.length){
            $defaultFilter.each(function(){
                const clone=lmatBulkTranslateBtn.clone(true);
                jQuery(this).append(clone);
                clone.show();
            });

            lmatBulkTranslateBtn.remove();
        }else if($bulkAction.length){
            $bulkAction.each(function(){
                const clone=lmatBulkTranslateBtn.clone(true);
                jQuery(this).after(clone);
                clone.show();
            });
        }
    }
});
