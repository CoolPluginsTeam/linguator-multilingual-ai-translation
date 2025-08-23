import { useState, useEffect } from 'react';
import FormatNumberCount from '../FormateNumberCount/index.js';

const ProVersionNotice = ({ characterCount = 0, url = '' }) => {
    const [showNotice, setShowNotice] = useState(false);
    const [activeClass, setActiveClass] = useState(false);

    if(url !== ''){
        url = url+'?utm_source=lmat_page_translation_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=popup';
    }

    useEffect(() => {
        const translateButton = document.querySelector('button.lmat-page-translation-button[name="lmat_page_translation_meta_box_translate"],input#lmat-page-translation-button[name="lmat_page_translation_meta_box_translate"]');

        if (!translateButton) {
            return;
        }

        translateButton.addEventListener('click', () => {
            setShowNotice(true);
            setActiveClass(true);
        });

        return () => {
            translateButton.removeEventListener('click', () => { });
        };
    }, []);

    return (
        showNotice ? (
            <div id="lmat-page-translation-pro-notice-wrapper" className={`${activeClass ? 'lmat-page-translation-active' : ''}`}>
                <div className="lmat-page-translation-pro-notice">
                    <div className="lmat-page-translation-notice-header">
                        <h2>AutoPoly - AI Translation For Polylang</h2>
                        <span className="lmat-page-translation-close-button" onClick={() => setShowNotice(false)} aria-label="Close Notice">×</span>
                    </div>
                    <div className="lmat-page-translation-notice-content">
                        <p>You have reached the character limit of <strong><FormatNumberCount number={characterCount} /></strong> for your translations. To continue translating beyond this limit, please consider upgrading to <strong>AutoPoly - AI Translation For Polylang Pro</strong>.</p>
                    </div>
                    <div className="lmat-page-translation-notice-footer">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="lmat-page-translation-upgrade-button">Upgrade to Pro</a>
                    </div>
                </div>
            </div>
        ) : null
    );
};

export default ProVersionNotice;