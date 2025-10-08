import SetupPage from "./pages/setup-page.jsx";
import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';


//Setup Page Component
const SetupPageComponent = () =>{
    return(
        <>
        <SetupPage />
        </>
    )
}

// Mount the appropriate component based on which element exists
domReady(() => {
    const element = document.getElementById('lmat-setup');
        if (element) {
            const root = createRoot(element);
            root.render(<SetupPageComponent />);
        }
});


