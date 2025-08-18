import SettingPage from "./pages/SettingPage.jsx";
import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';

//Settings Page Component
const SettingsPage = () =>{
    return(
        <>
        <SettingPage />
        </>
    )
}



domReady(() => {
    const element = document.getElementById('lmat-settings');
        if (element) {
            const root = createRoot(element);
            root.render(<SettingsPage/>);
        }

});


