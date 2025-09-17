jQuery(document).ready(function($) {
    // Position the language filter using the same logic as posts/pages
    const lmatSubsubsubList = $('.lmat_subsubsub');
    
    if (lmatSubsubsubList.length) {
        // Look for existing subsubsub or insert after the page title
        const $existingSubsubsub = $('ul.subsubsub:not(.lmat_subsubsub_list)');
        
        if ($existingSubsubsub.length) {
            $existingSubsubsub.before(lmatSubsubsubList);
        } else {
            // Fallback: insert after page title in nav-menus page
            const $pageTitle = $('.wrap h1');
            if ($pageTitle.length) {
                $pageTitle.after(lmatSubsubsubList);
            }
        }
        
        lmatSubsubsubList.show();
    }
});