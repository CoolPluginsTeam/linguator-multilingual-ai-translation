import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import StatusModal from './status-modal/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { resetStore, updateServiceProvider } from './redux-store/features/actions.js';
import { selectCountInfo } from './redux-store/features/selectors.js';
import ChromeAiTranslator from './components/translate-provider/localAi/local-ai-translate.js';
import ErrorModalBox from './components/error-modal-box/index.js';
import SettingModal from './setting-modal/index.js';
import DOMPurify from 'dompurify';

const App = ({ onDestory, prefix, postIds }) => {
    const dispatch = useDispatch();
    const { languageObject = {} } = lmatBulkTranslationGlobal || {};
    const emptyPostIdsErrorMessage = __('Please select at least one post for translation.', 'linguator-multilingual-ai-translation');
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [errorMessage, setErrorMessage] = useState(postIds.length === 0 ? emptyPostIdsErrorMessage : '');
    const [settingModalVisibility, setSettingModalVisibility] = useState(false);
    const [statusModalVisibility, setStatusModalVisibility] = useState(false);
    const translatePostsCount = useSelector(selectCountInfo).totalPosts;
    const [isLoading, setIsLoading] = useState(true);
    const [errorModal, setErrorModal] = useState(false);
    const [localAiModalError, setLocalAiModalError] = useState(false);

    const destroyApp = (e) => {
        setStatusModalVisibility(false);
        setSettingModalVisibility(false);
        onDestory(e);
    }


    useEffect(() => {
        const checkStatus = async () => {
            const status = await ChromeAiTranslator.languageSupportedStatus('en', 'hi', 'English', 'Hindi');
            if (status.type === 'browser-not-supported' || status.type === 'translation-api-not-available' || status.type === 'browser-not-supported') {
                setLocalAiModalError(__(status.html[0].outerHTML, 'linguator-multilingual-ai-translation'));
            }

            setIsLoading(false);
        }

        checkStatus();
    }, [statusModalVisibility]);

    useEffect(() => {
        if (!statusModalVisibility && !settingModalVisibility) {
            dispatch(resetStore());
        }
    }, [statusModalVisibility, settingModalVisibility, dispatch]);

    const settingModalVisibilityHandler = async () => {
        if (selectedLanguages.length === 0 && !settingModalVisibility) {
            setErrorMessage(__('Please select at least one language', 'linguator-multilingual-ai-translation'));
            setErrorModal(true);
            return;
        }

        setSettingModalVisibility((prev) => !prev);
    }

    const handleLanguageChange = (e) => {
        const { value } = e.target;
        const checked = e.target.checked;
        if (checked) {
            setSelectedLanguages([...selectedLanguages, value]);
        } else {
            setSelectedLanguages(selectedLanguages.filter(language => language !== value));
        }
    }

    const closeErrorModal = (e) => {
        setErrorModal(false);
    }

    const handleSelectAllLanguages = (e) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedLanguages(Object.keys(languageObject));
        } else {
            setSelectedLanguages([]);
        }
    }

    const updateProviderHandler = (services) => {
        dispatch(updateServiceProvider(services));
        setSettingModalVisibility(false);
        setStatusModalVisibility(true);
        setIsLoading(true);
    }

    const containerCls=()=>{
        let cls=[];
        if(statusModalVisibility){
            cls.push(`${prefix}-status-modal-active`);
        }

        if(settingModalVisibility){
            cls.push(`${prefix}-setting-modal-active`);
        }

        if(!translatePostsCount && !settingModalVisibility && statusModalVisibility){
            cls.push(`${prefix}-empty-posts`);
        }

        return cls.join(' ');
    }

    return <div
        id={`${prefix}-container`}
        className={containerCls()}>
        {settingModalVisibility && <SettingModal
            postIds={postIds}
            prefix={prefix}
            onDestory={destroyApp}
            onCloseHandler={settingModalVisibilityHandler}
            updateProviderHandler={updateProviderHandler} 
            localAiModalError={localAiModalError}
        />}

        {statusModalVisibility && !settingModalVisibility && (isLoading ?
            <div
                className={`${prefix}-skeleton-loader`}></div> :
            <StatusModal
                postIds={postIds}
                selectedLanguages={selectedLanguages}
                prefix={prefix}
                onDestory={destroyApp}
            />)}
        {!statusModalVisibility && !settingModalVisibility &&
            <div
                className={`${prefix}-language-container`}>
                <div
                    className={`${prefix}-header`}>
                    <h2>{__('Step 1: Select Languages', 'linguator-multilingual-ai-translation')}</h2>
                    <span
                        className="close"
                        onClick={destroyApp}
                        title={__('Close', 'linguator-multilingual-ai-translation')}
                    >
                        &times;
                    </span>
                </div>
                {errorMessage && errorMessage !== '' ? (errorModal ? <ErrorModalBox
                    message={errorMessage}
                    onClose={closeErrorModal}
                /> : <div
                    className={`${prefix}-error-message`}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(errorMessage) }}
                />) :
                    <>
                        <div
                            className={`${prefix}-body`}>
                            <div
                                className={`${prefix}-languages`}>
                                {Object.keys(languageObject).map((language) => {
                                    return <div key={language} className={`${prefix}-language`}>
                                        <div
                                            title={!postIds.length ? emptyPostIdsErrorMessage : languageObject[language].name}>
                                            <input
                                                type="checkbox"
                                                name="languages"
                                                id={language}
                                                value={language}
                                                onChange={(e) => handleLanguageChange(e)}
                                                disabled={!postIds.length}
                                                checked={selectedLanguages.includes(language)} />
                                            <label
                                                htmlFor={language}
                                                className={`${prefix}-language-label`}
                                                title={languageObject[language].name}
                                            >
                                                <img
                                                    src={languageObject[language].flag}
                                                    alt={languageObject[language].name} />
                                                &nbsp; {languageObject[language].name}
                                            </label>
                                        </div>
                                    </div>
                                })}
                            </div>
                            <div
                                className={`${prefix}-select-all-languages`}>
                                <input
                                    type="checkbox"
                                    name="select-all-languages"
                                    id="select-all-languages"
                                    onChange={(e) => handleSelectAllLanguages(e)}
                                    checked={selectedLanguages.length === Object.keys(languageObject).length} />
                                <label
                                    htmlFor="select-all-languages"
                                >
                                    {selectedLanguages.length === Object.keys(languageObject).length ? __('Unselect All', 'linguator-multilingual-ai-translation') : __('Select All', 'linguator-multilingual-ai-translation')}
                                </label>
                            </div>
                        </div>
                        <div
                            className={`${prefix}-footer`}>
                            <button
                                className={`${prefix}-footer-button button button-primary`}
                                onClick={destroyApp}
                                title={!postIds.length ? emptyPostIdsErrorMessage : ''}>
                                {__('Close', 'linguator-multilingual-ai-translation')}
                            </button>
                            <button
                                className={`${prefix}-footer-button button button-primary`}
                                onClick={settingModalVisibilityHandler}
                                disabled={!postIds.length || !selectedLanguages.length}
                                title={!postIds.length ? emptyPostIdsErrorMessage : (!selectedLanguages.length ? __('Please select at least one language', 'linguator-multilingual-ai-translation') : '')}>
                                {__('Translate', 'linguator-multilingual-ai-translation')}
                            </button>
                        </div>
                    </>}
            </div>
        }
    </div>
}

export default App;
