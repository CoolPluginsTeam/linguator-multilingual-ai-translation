window.addEventListener('load', function() {
    const url=new URL(window.location.href);
    const locoDemo=url.searchParams.get('loco');

    const locoRedirectCallback=()=>{
        var title = lmat_loco_redirect_script.loco_iframe_page_url.title;
        var loco_url   = lmat_loco_redirect_script.loco_iframe_page_url.url;
    
    
        if(lmat_loco_redirect_script.loco_install === 'false') {
            tb_show(title, loco_url);
        
            const closeBtn=document.getElementById('TB_closeWindowButton');
        
            closeBtn.addEventListener('click', function() {
                // Remove 'loco' query parameter from the current URL
                const url = new URL(window.location.href);
                url.searchParams.delete('loco');
                // Update the URL in the browser without reloading the page
                window.history.replaceState({}, document.title, url.toString());
            });
        }else{
            window.location.href = loco_url;
        }
    }

    const localizationMenu=document.querySelector('.wp-submenu li a[href$="page=lmat_settings&tab=general&loco=true"]');
    localizationMenu.addEventListener('click', function(e) {
        e.preventDefault();
        locoRedirectCallback();
    });

    if(!locoDemo || locoDemo !== 'true'){
        return
    }

    locoRedirectCallback();
});