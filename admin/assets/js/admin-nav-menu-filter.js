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
    
    // Preserve language parameter when switching between Edit Menus and Manage Locations tabs
    const urlParams = new URLSearchParams(window.location.search);
    const currentLang = urlParams.get('lang');
    
    if (currentLang && currentLang !== 'all') {
        // Update Edit Menus tab link
        $('#nav-menus-frame .wp-filter .filter-links a').each(function() {
            const $link = $(this);
            const href = $link.attr('href');
            
            if (href && href.includes('nav-menus.php')) {
                // Check if it's the edit menus tab (no action parameter)
                if (!href.includes('action=')) {
                    const url = new URL(href, window.location.origin);
                    url.searchParams.set('lang', currentLang);
                    $link.attr('href', url.toString());
                }
            }
        });
        
        // Also update any other tab links that might exist
        $('.nav-tab-wrapper .nav-tab').each(function() {
            const $link = $(this);
            const href = $link.attr('href');
            
            if (href && href.includes('nav-menus.php')) {
                const url = new URL(href, window.location.origin);
                url.searchParams.set('lang', currentLang);
                $link.attr('href', url.toString());
            }
        });
    }
});