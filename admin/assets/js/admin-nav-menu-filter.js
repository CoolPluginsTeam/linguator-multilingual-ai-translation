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

    // Preserve language parameter in navigation links
    const urlParams = new URLSearchParams(window.location.search);
    const currentLang = urlParams.get('lang');
    
    if (currentLang && currentLang !== 'all') {
        // Add language parameter to Edit Menus and Manage Locations tabs
        $('a[href*="nav-menus.php"]').each(function() {
            const $link = $(this);
            const href = $link.attr('href');
            
            // Skip if this is already a language filter link
            if ($link.closest('.lmat_subsubsub_list').length) {
                return;
            }
            
            // Skip if href already contains lang parameter
            if (href && href.indexOf('lang=') === -1) {
                const separator = href.indexOf('?') !== -1 ? '&' : '?';
                $link.attr('href', href + separator + 'lang=' + encodeURIComponent(currentLang));
            }
        });

        // Handle form submissions to preserve language parameter
        $('form[action*="nav-menus.php"], form[action=""]').each(function() {
            const $form = $(this);
            
            // Add hidden input for language parameter if it doesn't exist
            if (!$form.find('input[name="lang"]').length) {
                $form.append('<input type="hidden" name="lang" value="' + currentLang + '">');
            }
        });

        // Handle menu selection form specifically
        $('#select-menu-to-edit').on('change', function() {
            const $form = $(this).closest('form');
            if ($form.length) {
                // Ensure language parameter is preserved
                if (!$form.find('input[name="lang"]').length) {
                    $form.append('<input type="hidden" name="lang" value="' + currentLang + '">');
                }
            }
        });

        // Handle language filter changes - reload page to update menu list
        $('.lmat_subsubsub_list a').on('click', function(e) {
            // Let the default navigation happen, which will reload the page with the new language filter
            // This ensures the menu dropdown is updated with the filtered list
        });

        // Handle the "Select" button to preserve language parameter
        $('input[name="action"][value="edit"]').closest('form').on('submit', function() {
            const $form = $(this);
            if (!$form.find('input[name="lang"]').length && currentLang && currentLang !== 'all') {
                $form.append('<input type="hidden" name="lang" value="' + currentLang + '">');
            }
        });

        // Handle "create a new menu" link to preserve language parameter
        $('a[href*="nav-menus.php"][href*="action=edit"]').each(function() {
            const $link = $(this);
            const href = $link.attr('href');
            
            // Skip if this is already a language filter link
            if ($link.closest('.lmat_subsubsub_list').length) {
                return;
            }
            
            // Skip if href already contains lang parameter
            if (href && href.indexOf('lang=') === -1 && currentLang && currentLang !== 'all') {
                const separator = href.indexOf('?') !== -1 ? '&' : '?';
                $link.attr('href', href + separator + 'lang=' + encodeURIComponent(currentLang));
            }
        });

        // Handle new menu creation form submission
        $('#create-menu-form, form[action*="nav-menus.php"]').on('submit', function() {
            const $form = $(this);
            
            // Only add language parameter if it's missing and we have a current language
            if (!$form.find('input[name="lang"]').length && currentLang && currentLang !== 'all') {
                $form.append('<input type="hidden" name="lang" value="' + currentLang + '">');
            }
        });
    }
});