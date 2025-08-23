import CopyClipboard from "../CopyClipboard/index.js";
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

const ErrorModalBox = ({ message, onClose, onDestroy, Title, prefix, children }) => {

    let dummyElement = jQuery('<div>').append(message);
    const stringifiedMessage = dummyElement.html();
    dummyElement.remove();
    dummyElement = null;

    useEffect(() => {
        const clipboardElements = document.querySelectorAll('.chrome-ai-translator-flags');

        if (clipboardElements.length > 0) {
            clipboardElements.forEach(element => {

                element.classList.add(`${prefix}-tooltip-element`);

                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    const toolTipExists = element.querySelector(`.${prefix}-tooltip`);
                    
                    if(toolTipExists){
                        return;
                    }

                    let toolTipElement = document.createElement('span');
                    toolTipElement.textContent = "Text to be copied.";
                    toolTipElement.className = `${prefix}-tooltip`;
                    element.appendChild(toolTipElement);

                    CopyClipboard({ text: element.getAttribute('data-clipboard-text'), startCopyStatus: () => {
                        toolTipElement.classList.add(`${prefix}-tooltip-active`);
                    }, endCopyStatus: () => {
                        setTimeout(() => {
                            toolTipElement.remove();
                        }, 800);
                    } });
                });
            });

            return () => {
                clipboardElements.forEach(element => {
                    element.removeEventListener('click', () => { });
                });
            };
        }
    }, []);

    return (
        <div className={`${prefix}-error-modal-box-container`}>
            <div className={`${prefix}-error-modal-box`}>
                <div className={`${prefix}-error-modal-box-header`}>
                    <span className={`${prefix}-error-modal-box-close`} onClick={onDestroy}>×</span>
                    {Title && <h3>{Title}</h3>}
                </div>
                <div className={`${prefix}-error-modal-box-body`}>
                    <p dangerouslySetInnerHTML={{ __html: stringifiedMessage }} />
                    {children}
                </div>
                <div className={`${prefix}-error-modal-box-footer`}>
                    <button className={`${prefix}-error-modal-box-close button button-primary`} onClick={onClose}>{__('Back', 'linguator-multilingual-ai-translation')}</button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModalBox;
