import React, { useEffect } from 'react'
import MainComponent from '../components/main-component'
import { Toaster } from 'sonner'

const getCurrentTab=()=>{
  let url = new URL(window.location);
  let tab=url.searchParams.get("tab");

  if(tab && '' !== tab){
    return tab;
  }

  return 'general';
}

const SettingPage = () => {

  const [currentPage,setCurrentPage] = React.useState(getCurrentTab());

  const updateTabParameter=(newValue)=>{
    let url = new URL(window.location);

    // Check if "tab" exists
    if (url.searchParams.has("tab")) {
      // Update its value
      url.searchParams.set("tab", newValue);
    } else {
      // Add it if missing
      url.searchParams.append("tab", newValue);
    }

    // Push the updated URL without reloading
    window.history.replaceState({}, '', url);
  }

  const handleTabClick = (e) => {

    const tabBtn=e.target.classList.contains('lmat-settings-header-tab') ? e.target : e.target.closest('.lmat-settings-header-tab');
    const activeTab=document.querySelector('.lmat-settings-header-tab.active');

    if(tabBtn.classList.contains('active')){
      return;
    }

    activeTab && activeTab.classList.remove('active');
    tabBtn.classList.add('active');

    const tab=tabBtn.dataset.tab;

    updateTabParameter(tab);
    setCurrentPage(tab);
  }

  useEffect(() => {
    const tabs=document.querySelectorAll('.lmat-settings-header-tab:not([data-link="true"])');
    tabs.forEach(tab => {
      tab.addEventListener('click', handleTabClick);
    });

    return () => {
      tabs.forEach(tab => {
        tab.removeEventListener('click', handleTabClick);
      });
    }
  }, []);

  return (
    <div>
      <Toaster richColors position="top-right" />
      {/* header, topbar section */}
      {/* <Header  setCurrentPage={setCurrentPage} currentPage={currentPage} /> */}
      {/* main component -> tab switcher and main body */}
      <MainComponent currentPage={currentPage} />
    </div>
  )
}

export default SettingPage