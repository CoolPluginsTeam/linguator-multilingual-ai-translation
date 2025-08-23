import React, { useEffect, useState } from 'react';
import { bulkTranslateEntries, initBulkTranslate } from '../bulk-translate.js';
import { useSelector, useDispatch } from 'react-redux';
import { selectTranslatePostInfo, selectProgressStatus, selectCountInfo, selectPendingPosts, selectServiceProvider } from '../ReduxStore/features/selectors.js';
import { __ } from '@wordpress/i18n';
import ErrorModalBox from '../components/ErrorModalBox/index.js';

const StatusModal = ({ postIds, selectedLanguages, prefix, onDestory }) => {

    const storeDispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [errorModal, setErrorModal] = useState(false);
    const [errorModalData, setErrorModalData] = useState(false);
    const translatePostInfo = useSelector(selectTranslatePostInfo);
    const [destroyHandlers, setDestroyHandlers] = useState([]);
    const pendingPosts=useSelector(selectPendingPosts);
    const serviceProvider = useSelector(selectServiceProvider);
    const [progressBarVisibility, setProgressBarVisibility] = useState(true);
    const [charactersCountVisibility, setCharactersCountVisibility] = useState(false);
    const [bulkStatus, setBulkStatus] = useState('status');
    const countInfo = useSelector(selectCountInfo);
    let [emptyPostMessage, setEmptyPostMessage]=useState(sprintf(__('Translations already exist for all selected %s in the chosen languages. There are no new %s to translate.', 'linguator-multilingual-ai-translation'), lmatBulkTranslationGlobal.post_label, lmatBulkTranslationGlobal.post_label));
    let progressStatus = useSelector(selectProgressStatus);
    progressStatus=progressStatus.toFixed(1);
    progressStatus=Math.min(progressStatus, 100);

    useEffect(() => {
        const translatePosts = async () => {
            const response = await bulkTranslateEntries({ ids: postIds, langs: selectedLanguages, storeDispatch });
            setIsLoading(false);

            if(!response.success && false === response.success && response.message){
                setEmptyPostMessage(response.message);
                return;
            }
        
            initBulkTranslate(response.postKeys, response.nonce, storeDispatch, prefix, updateDestoryHandler);
        }
        translatePosts();
    }, []);

    const handleErrorModal = (data) => {
        setErrorModalData(data);
        setErrorModal(true);
    }

    const closeErrorModal = (e) => {
        setErrorModal(false);
        setErrorModalData(false);
    }

    const updateDestoryHandler = (callback) => {
        setDestroyHandlers(prev => [...prev, callback]);
    }

    const onModalClose= (e) => {
        destroyHandlers.forEach(callback => typeof callback === 'function' && callback());
        onDestory(e);
    }

    useEffect(() => {

        if(countInfo.totalPosts < 1 && !isLoading && bulkStatus !== 'status'){
            updateBulkStatus('status');
            return;
        }

        if(translatePostInfo && Object.keys(translatePostInfo).length > 0){
            if(pendingPosts.length < 1){''
                updateBulkStatus('completed');
                return;
            }

            let error=false;
            let running=false;

            const runLoop=(items, index)=>{
                const status=translatePostInfo[items[index]].status;

                if(status === 'running' || status === 'in-progress' || status === 'pending'){
                    running=true;
                    bulkStatus !== 'running' && updateBulkStatus('running');
                    return;
                }

                if(status === 'error'){
                    error=true;
                }

                index++;
                if(index < items.length){
                    runLoop(items, index);                    
                }
            }

            runLoop(Object.keys(translatePostInfo), 0);
            
            if(running) return;

            if(error){
                updateBulkStatus('pending');
            }else{
                updateBulkStatus('pending');
            }
        }
    }, [translatePostInfo]); 

    const updateBulkStatus=(status)=>{
        setBulkStatus(status);
    }

    const getBulkStatus=()=>{
        switch(bulkStatus){
            case 'running':
                return __('In Progress', 'linguator-multilingual-ai-translation');
            case 'pending':
                return __('Pending', 'linguator-multilingual-ai-translation');
            case 'completed':
                return __('Completed', 'linguator-multilingual-ai-translation');
            default:
                return __('Status', 'linguator-multilingual-ai-translation');
        }
    }

    useEffect(() => {
       if(progressStatus >= 100 && pendingPosts.length < 1){
            if(countInfo.postsTranslated < 1){
                setProgressBarVisibility(false);
                setCharactersCountVisibility(false);
                return;
            }

            if(countInfo.stringsTranslated > 0){
                setTimeout(() => {
                    setCharactersCountVisibility(true);
                }, 1000);
            }

            setTimeout(() => {
                setProgressBarVisibility(false);
                setCharactersCountVisibility(false);
            }, 7500);
       }
    }, [pendingPosts]);

    const getTranslatedPostLink = () => {
        const translatedLanguagesArr=Object.values(translatePostInfo).filter(post=>post.status==='completed' && post.targetLanguage);
        const translatedLangs=translatedLanguagesArr.map(post=>post.targetLanguage).filter((lang, index, self) => self.indexOf(lang) === index);
      
        if(translatedLangs.length === 1){
            const translatedLang=translatedLangs[0];
            // Get current query params
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            // Set or update the required params
            params.set('lang', translatedLang);
            params.set('orderby', 'date');
            params.set('order', 'desc');

            const newQuery = Object.fromEntries(params.entries());

            return window.location.href.split('?')[0]+'?'+new URLSearchParams(newQuery).toString();
        }else{
            return window.location.href;
        }

    }
    
    const getServiceProviderLabel = () => {
        switch(serviceProvider){
            case 'google':
                return 'Google Translate';
            default:
                return 'AI Translator';
        }
    }

    return (
        errorModal ? <ErrorModalBox message={errorModalData.errorHtml} onClose={closeErrorModal} Title={__('Bulk Translation Error', 'linguator-multilingual-ai-translation')} prefix={prefix} ></ErrorModalBox> :
        <div id={`${prefix}-status-modal-container`}>
            <h2 className={`${prefix}-bulk-status-heading ${bulkStatus}`}>{sprintf(__('Bulk Translation %s', 'linguator-multilingual-ai-translation'), getBulkStatus())}{bulkStatus === 'running' && <span className={`${prefix}-bulk-status-running`}></span>}</h2>
            <div className={`${prefix}-status-modal-close`} onClick={onModalClose}>&times;</div>
            {countInfo.totalPosts < 1 && !isLoading ?
                    <p>{emptyPostMessage}</p> :
                    <>
                        {isLoading && <div className={`${prefix}-progress-skeleton`}></div>}
                        {progressBarVisibility && !isLoading ?
                        <>
                            <div className={`${prefix}-overall-progress`}>
                                <div className={`${prefix}-progress-bar`}>
                                    <div className={`${prefix}-progress`} style={{width: progressStatus + '%'}}>{progressStatus + '%'}</div>
                                </div>
                            </div>
                            {charactersCountVisibility &&
                                <div className={`${prefix}-translator-strings-count`}>
                                    {__('Wahooo! You have saved your valuable time via auto translating', 'linguator-multilingual-ai-translation')}
                                    <strong className="totalChars"> {countInfo.charactersTranslated} </strong>{__('characters using', 'linguator-multilingual-ai-translation')}
                                <strong> {getServiceProviderLabel()}</strong>
                                </div>
                            }
                        </> : (countInfo.postsTranslated > 0 &&
                            <div className={`${prefix}-count-container`}>
                                <div className={`${prefix}-post-count`}>
                                    <span className={`${prefix}-count-text-heading`}>{__('Posts Translated:', 'linguator-multilingual-ai-translation')} </span>
                                    <span className={`${prefix}-post-translated-post`}>{countInfo.postsTranslated}</span>
                                    <span className={`${prefix}-post-text`}> {__('out of', 'linguator-multilingual-ai-translation')} </span>
                                    <span className={`${prefix}-post-total`}>{countInfo.totalPosts}</span>
                                    <span className={`${prefix}-post-total-text`}> {__('posts translated', 'linguator-multilingual-ai-translation')}</span>
                                </div>
                                <div className={`${prefix}-string-count`}>
                                    <span className={`${prefix}-count-text-heading`}>{__('Strings:', 'linguator-multilingual-ai-translation')} </span>
                                    <span className={`${prefix}-string-number`}>{countInfo.stringsTranslated}</span>
                                </div>
                                <div className={`${prefix}-char-count`}>
                                    <span className={`${prefix}-count-text-heading`}>{__('Characters:', 'linguator-multilingual-ai-translation')} </span>
                                    <span className={`${prefix}-char-number`}>{countInfo.charactersTranslated}</span>
                                </div>
                            </div>
                        )
                        }

                        <div className={`${prefix}-status-table-container`}>
                            <div>
                                <table className={`${prefix}-status-table`}>
                                    <thead>
                                    <tr>
                                        <th>{__('Language', 'linguator-multilingual-ai-translation')}</th>
                                        <th>{__('Status', 'linguator-multilingual-ai-translation')}</th>
                                        <th>{__('Title', 'linguator-multilingual-ai-translation')}</th>
                                        <th>{__('Actions', 'linguator-multilingual-ai-translation')}</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {isLoading &&
                                        <>
                                            <tr>
                                                <td>
                                                    <div className={`${prefix}-progress-skeleton`}></div>
                                                </td>
                                                <td>
                                                    <div className={`${prefix}-progress-skeleton`}></div>
                                                </td>
                                                <td>
                                                    <div className={`${prefix}-progress-skeleton`}></div>
                                                </td>
                                                <td>
                                                    <div className={`${prefix}-progress-skeleton`}></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className={`${prefix}-progress-skeleton`}></div>
                                                </td>
                                                <td>
                                                    <div className={`${prefix}-progress-skeleton`}></div>
                                                </td>
                                                <td>
                                                    <div className={`${prefix}-progress-skeleton`}></div>
                                                </td>
                                                <td>
                                                    <div className={`${prefix}-progress-skeleton`}></div>
                                                </td>
                                            </tr>
                                        </>
                                    }
                                    {!isLoading && Object.keys(translatePostInfo).map((key, index)=>{
                                        const info = translatePostInfo[key];
                                        const rows = [];
                                        const workingStatus=info.status === 'running' || info.status === 'in-progress' ? true : false;

                                        if (info.firstPostLanguage) {
                                            rows.push(
                                                <tr key={`group-title-${info.parentPostId || key}`} className={`${prefix}-group-title`}>
                                                    <td colSpan="5">
                                                        {info.parentPostTitle || __('Untitled', 'linguator-multilingual-ai-translation')}
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        // Language row
                                        rows.push(
                                            <tr key={key} className={`${prefix}-td-${info.status}`}>
                                                <td className={`${prefix}-status-flag`}>
                                                    {info.flagUrl && <img src={info.flagUrl} width="20" alt={info.targetLanguage}/>}
                                                    {info.languageName || info.targetLanguage}
                                                </td>
                                                {info.status === 'error' ?
                                                <>
                                                    <td colSpan={`${info.errorHtml ? '2' : '3'}`}>{info.errorMessage}</td>
                                                    {info.errorHtml && <td colSpan="1" onClick={()=>{handleErrorModal(info)}}><button className={`${prefix}-status-error-button`}>{__('Error Details', 'linguator-multilingual-ai-translation')}</button></td>}
                                                </> :
                                                <>
                                                    <td>
                                                        <span className={`${prefix}-status ${info.messageClass} ${info.status}`}>
                                                            {info.status === 'pending' && __('Pending', 'linguator-multilingual-ai-translation')}
                                                            {info.status === 'completed' && __('Completed', 'linguator-multilingual-ai-translation')}
                                                            {workingStatus && <div className={`${prefix}-progress-bar-circular`} data-id={info.parentPostId + '_' + info.targetLanguage}>
                                                                <svg className={`${prefix}-circle`} viewBox="0 0 36 36">
                                                                    <path className={`${prefix}-bg`} d="M18 2.0845
                                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                                    <path className={`${prefix}-progress`}
                                                                    strokeDasharray="0, 100"
                                                                    d="M18 2.0845
                                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                                </svg>
                                                                <div className={`${prefix}-percentage`}>0%</div>
                                                            </div>}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <>
                                                        {info.status === 'completed' ?
                                                            <a href={info.postLink} target="_blank" rel="noopener noreferrer">{info.targetPostTitle}</a> :
                                                            (info.status === 'in-progress' ?
                                                            <div className={`${prefix}-${info.messageClass}-text`}>{__('In Progress', 'linguator-multilingual-ai-translation')}<span></span></div> :
                                                            <div className={`${prefix}-progress-skeleton short`}></div>)
                                                        }
                                                        </>
                                                    </td>
                                                    <td>
                                                        {info.status === 'completed' && info.targetPostId ?
                                                            <span className={`${prefix}-view-link`}>
                                                                <a href={info.postEditLink} target="_blank" rel="noopener noreferrer" className="button button-primary">{__('Review', 'linguator-multilingual-ai-translation')}</a>
                                                            </span>
                                                        : 
                                                        (info.status === 'in-progress' ?
                                                            <div className={`${prefix}-${info.messageClass}-text`}>{__('In Progress', 'linguator-multilingual-ai-translation')}<span></span></div> :
                                                            <div className={`${prefix}-progress-skeleton short`}></div>)
                                                        }
                                                    </td>
                                                </>
                                                }
                                            </tr>
                                        );

                                        return rows;
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {(countInfo.postsTranslated > 0 && !pendingPosts.length && !progressBarVisibility) &&
                            <div className={`${prefix}-progress-footer`}>
                                <a className={`${prefix}-progress-button button button-primary`} href={getTranslatedPostLink()}>{sprintf(__('Check Translated %s', 'linguator-multilingual-ai-translation'), lmatBulkTranslationGlobal.post_label)}</a>
                            </div>
                        }
                    </>
            }
        </div>
    );
};

export default StatusModal;
