import CopyClipboard from "../copy-clipboard/index.js";
import { useEffect } from "@wordpress/element";
import DOMPurify from 'dompurify';

const ErrorModalBox = ({ message, onClose, Title }) => {

    let dummyElement = jQuery('<div>').append(message);
    const stringifiedMessage = dummyElement.html();
    dummyElement.remove();
    dummyElement = null;

    useEffect(() => {
        const clipboardElements = document.querySelectorAll('.chrome-ai-translator-flags');
        const reloadButton = document.querySelector('.lmat-page-translation-error-reload-btn');
        
        if(reloadButton){
            reloadButton.addEventListener('click', () => {
                window.location.reload();
            });
        }

        if (clipboardElements.length > 0) {
            clipboardElements.forEach(element => {

                element.classList.add('lmat-page-translation-tooltip-element');

                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    const toolTipExists = element.querySelector('.lmat-page-translation-tooltip');
                    
                    if(toolTipExists){
                        return;
                    }

                    let toolTipElement = document.createElement('span');
                    toolTipElement.textContent = "Text to be copied.";
                    toolTipElement.className = 'lmat-page-translation-tooltip';
                    element.appendChild(toolTipElement);

                    CopyClipboard({ text: element.getAttribute('data-clipboard-text'), startCopyStatus: () => {
                        toolTipElement.classList.add('lmat-page-translation-tooltip-active');
                    }, endCopyStatus: () => {
                        setTimeout(() => {
                            toolTipElement.remove();
                            toolTipElement=null;
                        }, 800);
                    } });
                });
            });
        }

        if(window.atfp_global_object.editor_type === 'divi'){
            document.querySelectorAll('.lmat-page-translation-error-modal-box-container a').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open(e.currentTarget.href, '_blank');
                });
            });
        }

        return () => {
            if(clipboardElements.length > 0){
                clipboardElements.forEach(element => {
                    element.removeEventListener('click', () => { });
                });
            }

            if(reloadButton){
                reloadButton.removeEventListener('click', () => {});
            }
            
            if(window.atfp_global_object.editor_type === 'divi'){
                document.querySelectorAll('.lmat-page-translation-error-modal-box-container a').forEach(element => {
                    element.removeEventListener('click', () => { });
                });
            }
        }
    }, []);

    return (
        <div className="lmat-page-translation-error-modal-box-container">
            <div className="lmat-page-translation-error-modal-box">
            <div className="lmat-page-translation-error-modal-box-header">
                    <span className="lmat-page-translation-error-modal-box-close" onClick={onClose}>×</span>
                    {Title && <h3>{Title}</h3>}
                </div>
                <div className="lmat-page-translation-error-modal-box-body">
                    <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(stringifiedMessage) }} />
                </div>
                <div className="lmat-page-translation-error-modal-box-footer">
                    <button className="lmat-page-translation-error-modal-box-close button button-primary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModalBox;
