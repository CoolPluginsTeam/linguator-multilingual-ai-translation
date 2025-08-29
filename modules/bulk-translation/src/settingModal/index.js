import React, { useState,useEffect } from "react";
import ReactDOM from "react-dom/client";
import SettingModalHeader from "./header.js";
import SettingModalBody from "./body.js";
import SettingModalFooter from "./footer.js";
import { __ } from "@wordpress/i18n";
import ErrorModalBox from "../components/ErrorModalBox/index.js";

const SettingModal = (props) => {
    const prefix=props.prefix || 'lmat-bulk-translate';
    const imgFolder = lmatBulkTranslationGlobal.lmat_url + 'Admin/Assets/images/';
    const [errorModal, setErrorModal] = useState(false);
    const providers=lmatBulkTranslationGlobal.providers;

    useEffect(()=>{
        if(providers.length < 2 && providers[0]){
            const provider=providers[0];

            const errorNameKey=()=>{
                switch(provider){
                    case 'localAiTranslator':
                        return 'localAiModalError';
                    default:
                        return provider+'ModalError';
                }
            }

            const errorName=errorNameKey(provider);

            if(props[errorName]){
                setErrorModal(props[errorName]);
            }else{
                props.updateProviderHandler(provider);
            }
        }
    },[providers]);

    /**
     * Function to handle fetching content based on the target button clicked.
     * Sets the target button and updates the fetch status to true.
     * @param {Event} e - The event object representing the button click.
     */
    const startTranslationHandler = async (e) => {
        let targetElement = !e.target.classList.contains(`${prefix}-service-btn`) ? e.target.closest(`.${prefix}-service-btn`) : e.target;

        if (!targetElement) {
            return;
        }

        const dataService = targetElement.dataset && targetElement.dataset.service;

        props.updateProviderHandler(dataService);
    };

    const handleSettingVisibility = (visibility) => {
        // setSettingVisibility(visibility);
    }

    const errorModalHandler = (msg) => {
        setErrorModal(msg);
    }

    const closeErrorModal = () => {
        setErrorModal(false);
    }

    return (
        <>
            {errorModal ? <ErrorModalBox message={errorModal} onDestroy={props.onDestory} onClose={closeErrorModal} Title='Linguator Multilingual AI Translation' prefix={prefix} /> :
            (providers.length > 1 && <div id={`${prefix}-setting-modal-container`}>
                <div className={`${prefix}-setting-modal-content`}>
                    <SettingModalHeader
                        setSettingVisibility={props.onDestory}
                        prefix={prefix}
                    />
                    <SettingModalBody
                        startTranslationHandler={startTranslationHandler}
                        imgFolder={imgFolder}
                        prefix={prefix}
                        localAiModalError={props.localAiModalError}
                        errorModalHandler={errorModalHandler}
                    />
                    <SettingModalFooter
                        setSettingVisibility={props.onCloseHandler}
                        prefix={prefix}
                    />
                </div>
            </div>)}
        </>
    );
};

export default SettingModal;