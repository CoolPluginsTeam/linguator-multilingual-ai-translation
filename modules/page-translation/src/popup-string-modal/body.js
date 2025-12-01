import React, { useEffect, useState, useRef } from "react";
import FilterTargetContent from "../component/filter-target-content/index.js";
import { __ } from "@wordpress/i18n";
import { select, dispatch } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import TranslateService from "../component/translate-provider/index.js";
import ReactDOM from "react-dom";
import { InfoPopup, GlossaryPopup, AddGlossaryPopup } from "../component/RightPopup/index.js";
import SaveTranslation from '../component/store-translated-string/index.js';
import GlossaryCount from "../component/glossary-count/index.js";

const StringPopUpBody = (props) => {

    const { service: service } = props;
    const translateContent = select("block-lmatPageTranslation/translate").getTranslationEntries();
    const StringModalBodyNotice = props.stringModalBodyNotice;

    const imgFolder = lmatPageTranslationGlobal.lmat_url + 'admin/assets/images/';


    // Add refs and state for popup
    const tableRef = useRef(null);
    const [popupInfo, setPopupInfo] = useState(null);
    const [activePopupType, setActivePopupType] = useState(null);
    const [glossaryPosition, setGlossaryPosition] = useState({ left: 0, top: 0 });
    const [addGlossaryPosition, setAddGlossaryPosition] = useState({ left: 0, top: 0 });
    const [editingCells, setEditingCells] = useState([]);
    const [editingValues, setEditingValues] = useState({});
    const textareaRefs = useRef({});
    const [glossaryTerms, setGlossaryTerms] = useState([]);
    const [glossaryOrignalTerms, setGlossaryOrignalTerms] = useState([]);
    const [selectedSourceText, setSelectedSourceText] = useState('');
    const [activePopupCell, setActivePopupCell] = useState(null);
    const [savedValues, setSavedValues] = useState({});
    const showGlossary = activePopupType === 'glossary';
    const showAddGlossary = activePopupType === 'add-glossary';

    const saveFilteredString = (type, id, filteredString) => {
        const action = `${type}SaveFiltered`;

        dispatch('block-lmatPageTranslation/translate')[action](filteredString, id);
    }


    // Helper function for glossary positioning (assuming fixed/viewport relative positioning for GlossaryPopup)
    const calculateGlossaryPosition = (anchorElementRect, isTdSource = false) => {
        const stringContainer = document.querySelector('.lmat_page_translation_string_container');

        // Default to positioning below the anchor if stringContainer is not found
        if (!stringContainer) {
            return {
                right: anchorElementRect.right - (isTdSource ? 4 : 0),
                top: anchorElementRect.bottom + 4
            };
        }

        const stringContainerRect = stringContainer.getBoundingClientRect();
        const position = { right: (anchorElementRect.right - (isTdSource ? 4 : 0)) };
        const spaceBelowInContainer = stringContainerRect.bottom - anchorElementRect.bottom;
        const spaceAboveInContainer = anchorElementRect.top - stringContainerRect.top;

        // Estimate popup height (approximately 200px for glossary popup)
        const estimatedPopupHeight = 200;

        // Check if there's enough space below the textarea
        if (spaceBelowInContainer < estimatedPopupHeight) {
            // Check if there's enough space above the textarea
            if (spaceAboveInContainer >= estimatedPopupHeight) {
                // Position above the textarea
                position.bottom = window.innerHeight - anchorElementRect.top + 4;
            } else {
                // If not enough space above either, position at the top of the container
                position.top = stringContainerRect.top + window.scrollY;
                position.right = position.right - 30;
            }
        } else {
            // Position below the textarea
            position.top = anchorElementRect.bottom + 4;
        }
        return position;
    };


    // Fetch glossary data on initial render
    const calculateAddGlossaryPosition = (anchorElementRect, isTdSource = false) => {
        const stringContainer = document.querySelector('.lmat_page_translation_string_container');

        const position = {
            right: anchorElementRect.right - (isTdSource ? 4 : 0)
        };

        if (!stringContainer) {
            return position;
        }

        const stringContainerRect = stringContainer.getBoundingClientRect();
        const spaceBelowInContainer = stringContainerRect.bottom - anchorElementRect.bottom;

        if (spaceBelowInContainer < 200) {
            position.right = position.right - 30;
        }

        return position;
    };

    useEffect(() => {
        async function fetchGlossary() {
            try {

                const data = {
                    action: 'lmat_get_glossary',
                    source_lang: props.sourceLang,
                    target_lang: props.targetLang,
                    _wpnonce: lmatPageTranslationGlobal.get_glossary_validate
                }
                // Add sourceLang and targetLang as query params
                const url = `${lmatPageTranslationGlobal.ajax_url}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Accept': 'application/json',
                    },
                    credentials: 'same-origin',
                    body: new URLSearchParams(data)

                });

                const responseData = await response.json();

                const glossaryOrignalTerms = [];
                responseData.data.terms.forEach(term => {
                    if (term.original_term && term.original_term !== '') {
                        glossaryOrignalTerms.push(term.original_term);
                    }
                });

                setGlossaryOrignalTerms(glossaryOrignalTerms);
                setGlossaryTerms(responseData.data.terms || []);
            } catch (err) {
                setGlossaryTerms([]); // fallback or show error
            }
        }
        fetchGlossary();
    }, [props.sourceLang, props.targetLang]);


    // Update handleTdClick to check for AI service
    const handleTdClick = (event, colIndex, rowIndex, data) => {
        const translationEntry = select("block-lmatPageTranslation/translate").getTranslationEntry({ id: data.id, type: data.type });

        if (colIndex !== 2 || !translationEntry) return;

        const cellKey = `${rowIndex}_${colIndex}`;

        let translation = '';
        if (translationEntry.translatedData && translationEntry.translatedData[service]) {
            translation = translationEntry.translatedData[service];
        } else if (translationEntry.translatedData && translationEntry.translatedData[props.service]) {
            translation = translationEntry.translatedData[props.service];
        } else if (translationEntry.filteredString) {
            translation = translationEntry.filteredString;
        } else {
            translation = translationEntry.source || '';
        }

        // Only set editing state if not already editing this cell
        const isAlreadyEditing = editingCells.some(
            cell => cell.row === rowIndex && cell.col === colIndex
        );

        if (!isAlreadyEditing) {
            setEditingCells([{ row: rowIndex, col: colIndex }]);
            setEditingValues({
                [cellKey]: translation
            });
        }
        setSelectedSourceText(data.source || '');
        setActivePopupCell({ row: rowIndex, col: colIndex });

        if (!tableRef.current) return;
        const tdRect = event.currentTarget.getBoundingClientRect();
        const ths = tableRef.current.querySelectorAll("thead th");
        const thText = ths[colIndex] ? ths[colIndex].textContent : '';
        const stringContainer = document.querySelector('.lmat_page_translation_string_container');
        const stringContainerRect = stringContainer.getBoundingClientRect();
        const difference = stringContainerRect.bottom - tdRect.bottom;
        const differencetop = tdRect.top - stringContainerRect.top;

        // Calculate popup position relative to the clicked cell
        const newPopupInfo = {
            left: tdRect.right + window.scrollX,
            top: tdRect.top + window.scrollY - 35,
            value: data,
            header: thText,
        };

        // Adjust position if near bottom of container
        if (difference < 50) {
            newPopupInfo.top = tdRect.top + window.scrollY - 130;
            newPopupInfo.bottom = 50;
        }
        // Adjust position if near top of container
        if (differencetop < 35) {
            newPopupInfo.top = stringContainerRect.top + window.scrollY;
            newPopupInfo.bottom = 35;
        }

        setPopupInfo(newPopupInfo);

        if (showGlossary) {
            const glossaryPos = calculateGlossaryPosition(tdRect, true);
            setGlossaryPosition(glossaryPos);
        }
    };

    // Update closePopup to clear all editing states
    const closePopup = () => {
        setEditingCells([]);
        setEditingValues({});
        setPopupInfo(null);
        setActivePopupCell(null);
    };
    // Helper to get matched glossary terms
    const getMatchedGlossaryTerms = (sourceText) => {
        if (!sourceText) return [];

        // Create a temporary div to parse HTML and get text content
        const temp = document.createElement('div');
        temp.innerHTML = sourceText;
        const textContent = temp.textContent;

        // Normalize text (lowercase + remove unnecessary punctuation)
        const normalizeText = (text) => {
            return text.toLowerCase()
                .replace(/[.,/#!$%^&*;{}=\-_`~()]/g, (match) => {
                    // Preserve colon but remove other punctuation
                    return match === ':' ? ':' : '';
                })
                .trim();
        };

        // Escape special characters for safe regex creation
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const normalizedSourceText = normalizeText(textContent);

        return glossaryTerms
            .filter(entry => {
                if (!entry.original_term) return false;

                const glossaryTerm = entry.original_term.trim();
                const normalizedGlossaryTerm = normalizeText(glossaryTerm);
                const safeTerm = escapeRegex(normalizedGlossaryTerm);

                // Create regex to match whole words only
                const regex = new RegExp(`\\b${safeTerm}\\b`, 'i');

                // Check if it matches as a separate word
                const isMatch = regex.test(normalizedSourceText);

                if (isMatch && glossaryTerm.endsWith(':')) {
                    // Ensure colon match is properly followed by space or end
                    const matchIndex = normalizedSourceText.indexOf(normalizedGlossaryTerm);
                    const afterMatch = normalizedSourceText[matchIndex + normalizedGlossaryTerm.length];
                    return !afterMatch || afterMatch === ' ';
                }

                return isMatch;
            })
            .map(entry => {
                return ({
                    english: entry.original_term,
                    translation:
                        entry.translations?.[props.targetLang] || '',
                    description: entry.description || ''
                })
            });
    };

    const matchedGlossaryTerms = getMatchedGlossaryTerms(selectedSourceText);

    // Update handleGlossaryClick to check for AI service
    const handleGlossaryClick = () => {
        if (matchedGlossaryTerms.length === 0) return;

        // Toggle glossary popup, close if already open
        setActivePopupType(prev => prev === 'glossary' ? null : 'glossary');

        if (activePopupCell) {
            const cellKey = `${activePopupCell.row}_${activePopupCell.col}`;
            const textarea = textareaRefs.current[cellKey];
            if (textarea) {
                const textareaRect = textarea.getBoundingClientRect();
                const newPos = calculateGlossaryPosition(textareaRect, true);
                setGlossaryPosition(newPos);
            }
        }
    };

    const handleAddGlossaryClick = () => {
        // Toggle add glossary popup - close if already open, open if closed
        setActivePopupType(prev => prev === 'add-glossary' ? null : 'add-glossary');

        // Only update position if we're opening the popup
        if (activePopupType !== 'add-glossary' && activePopupCell) {
            const cellKey = `${activePopupCell.row}_${activePopupCell.col}`;
            const textarea = textareaRefs.current[cellKey];
            if (textarea) {
                const textareaRect = textarea.getBoundingClientRect();
                const newPos = calculateAddGlossaryPosition(textareaRect, true);
                setAddGlossaryPosition(newPos);
            }
        }
    };

    // Update handleTextareaInput to use dynamic positioning
    const handleTextareaInput = (e, row, col) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';

        // Recalculate positions for both glossary and add glossary popups when textarea size changes
        if (activePopupCell && activePopupCell.row === row && activePopupCell.col === col) {
            const textareaRect = e.target.getBoundingClientRect();

            if (showGlossary) {
                const newGlossaryPos = calculateGlossaryPosition(textareaRect, true);
                setGlossaryPosition(newGlossaryPos);
            }

            if (showAddGlossary) {
                const newAddGlossaryPos = calculateAddGlossaryPosition(textareaRect, true);
                setAddGlossaryPosition(newAddGlossaryPos);
            }
        }
    };

    useEffect(() => {
        if (!popupInfo) {
            setActivePopupType(null);
            setEditingCells([]);
        }
    }, [popupInfo]);

    useEffect(() => {

        if (['yandex', 'google'].includes(props.service)) {
            document.documentElement.setAttribute('translate', 'no');
            document.body.classList.add('notranslate');
        }

        /**
         * Calls the translate service provider based on the service type.
         * For example, it can call services like yandex Translate.
        */
        const service = props.service;
        const id = `lmat_page_translation_${service}_translate_element`;

        const translateContent = select('block-lmatPageTranslation/translate').getTranslationEntries();

        if (translateContent.length > 0 && props.postDataFetchStatus) {
            const ServiceSetting = TranslateService({ Service: service });
            ServiceSetting.Provider({ sourceLang: props.sourceLang, targetLang: props.targetLang, translateStatusHandler: props.translateStatusHandler, ID: id, translateStatus: props.translateStatus, modalRenderId: props.modalRender, destroyUpdateHandler: props.updateDestroyHandler });
        }
    }, [props.modalRender, props.postDataFetchStatus]);

    const udpateFilterdContent = (div) => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = div.innerHTML;
        const childNodes = tempElement.childNodes;

        if (childNodes.length > 0) {
            for (let i = 0; i < childNodes.length; i++) {
                const childNode = childNodes[i];
                if (childNode.nodeType === 3) {
                    continue;
                } else {
                    const childNodes = childNode.childNodes;
                    if (childNodes.length > 0) {
                        if (!childNode.classList.contains('lmat-page-translation-notraslate-tag')) {
                            const textContent = udpateFilterdContent(childNode);
                            childNode.outerHTML = textContent;
                        } else {
                            const textContent = udpateFilterdContent(childNode);
                            childNode.innerHTML = textContent;
                        }
                    }
                }
            }
        }

        return tempElement.innerHTML;
    }

    const insertOrReplaceInContentEditable = (div, glossaryText) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        // Make sure the selection is inside this div
        if (!div.contains(range.startContainer)) return;

        const selectedString = range.toString();

        // Get all starting spaces (single or multiple) and ending spaces (single or multiple)
        const startingWhiteSpace = selectedString.match(/^\s+/)?.[0] || "";
        const endingWhiteSpace = selectedString.match(/\s+$/)?.[0] || "";

        // Delete selected content (if any)
        range.deleteContents();

        // Prepare HTML node
        const temp = document.createElement("div");
        temp.innerHTML = `<span class="notranslate lmat-page-translation-notraslate-tag" translate="no">${startingWhiteSpace}${glossaryText}${endingWhiteSpace}</span>`;
        const node = temp.firstChild;

        // Insert the span
        range.insertNode(node);

        // Move caret after the inserted node
        range.setStartAfter(node);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);

        const filteredContent = udpateFilterdContent(div);

        const td = div.closest('td');

        if ('' !== filteredContent && td) {
            const type = td.dataset.stringType;
            const id = td.dataset.key;

            saveFilteredString(type, id, filteredContent);
        }
    }


    // Update handleInsertGlossaryTerm to accept a cell argument
    const handleInsertGlossaryTerm = (term, cell) => {
        if (!cell) return;
        const cellKey = `${cell.row}_${cell.col}`;
        const textarea = textareaRefs.current[cellKey];

        if (textarea) {
            const insertText = term.translation || term.english || '';

            insertOrReplaceInContentEditable(textarea, insertText);
        } else {
            setEditingValues({
                ...editingValues,
                [cellKey]: (editingValues[cellKey] || '') + (term.translation || term.english || '')
            });
        }
    };

    // Add this helper function at the top level of your component
    const getTranslationProviders = (service) => {
        if (service) {
            return [service];
        }
    };

    // Save handler for InfoPopup
    const handleSave = () => {
        const cell = activePopupCell;
        if (cell) {
            const cellKey = `${cell.row}_${cell.col}`;
            const newValue = textareaRefs?.current[cellKey]?.innerText || '';
            const rowData = translateContent[cell.row];

            if (newValue && newValue.trim() !== '') {
                // Save non-empty values
                setSavedValues(prev => ({ ...prev, [cellKey]: newValue }));

                if (rowData?.id) {
                    const providers = getTranslationProviders(service);

                    // Save translation for each provider
                    providers.forEach(provider => {
                        SaveTranslation({
                            type: rowData.type || 'content',
                            key: rowData.id,
                            translateContent: newValue,
                            source: rowData.source,
                            provider: provider,
                            AllowedMetaFields: props.AllowedMetaFields || {}
                        });
                    });
                }
            } else {
                // For empty values, clear both local state and call SaveTranslation with empty string
                setSavedValues(prev => {
                    const newSavedValues = { ...prev };
                    delete newSavedValues[cellKey];
                    return newSavedValues;
                });

                if (rowData?.id) {
                    const providers = getTranslationProviders(service);

                    // Save translation for each provider
                    providers.forEach(provider => {
                        SaveTranslation({
                            type: rowData.type || 'content',
                            key: rowData.id,
                            translateContent: '', // Save empty string to clear the translation
                            source: rowData.source,
                            provider: provider,
                            AllowedMetaFields: props.AllowedMetaFields || {}
                        });
                    });
                }
            }

            // Remove the current cell from editingCells so it renders as a <td>
            setEditingCells(prev => prev.filter(c => !(c.row === cell.row && c.col === cell.col)));

            // Move to next row if exists
            const nextRow = cell.row + 1;
            if (nextRow < translateContent.length) {
                const nextRowData = translateContent[nextRow];
                if (nextRowData?.source?.trim()) {
                    const nextCellKey = `${nextRow}_${cell.col}`;
                    let initialNextTranslation;
                    if (savedValues[nextCellKey] !== undefined) {
                        initialNextTranslation = savedValues[nextCellKey];
                    } else {
                        let trans = '';
                        if (nextRowData.translatedData) {
                            if (service && nextRowData.translatedData[service]) {
                                trans = nextRowData.translatedData[service];
                            } else if (nextRowData.translatedData[props.service]) {
                                trans = nextRowData.translatedData[props.service];
                            }
                        }
                        initialNextTranslation = trans || nextRowData.source || '';
                    }

                    setEditingCells(prev => [...prev, { row: nextRow, col: cell.col }]);
                    setEditingValues(prev => ({ ...prev, [nextCellKey]: initialNextTranslation }));
                    setSelectedSourceText(nextRowData.source || '');
                    setActivePopupCell({ row: nextRow, col: cell.col });

                    // Update popup position for next row
                    setTimeout(() => {
                        const table = tableRef.current;
                        const nextTd = table?.querySelector(`tbody tr:nth-child(${nextRow + 1}) td:nth-child(${cell.col + 1})`);
                        if (nextTd) {
                            const tdRect = nextTd.getBoundingClientRect();
                            setPopupInfo({
                                left: tdRect.right + window.scrollX,
                                top: tdRect.top + window.scrollY,
                                value: nextRowData,
                                header: table.querySelectorAll("thead th")[cell.col]?.textContent || '',
                            });
                        }
                    }, 0);
                    return;
                }
            }

            setPopupInfo(null);
        }
    };

    // Add this helper function to get language name
    const getLanguageName = (langCode) => {
        const languages = window.lmatPageTranslationGlobal?.languageObject || {};
        const language = languages[langCode];
        // If language is an object, extract the name, otherwise use the langCode
        const result = typeof language === 'object' ? language.name || langCode : (language || langCode);
        return result;
    };

    const getTranslation = (data) => {
        let originalTranslation = false;

        if (data.translatedData) {
            if (service && data.translatedData[service]) {
                originalTranslation = data.translatedData[service];
            } else if (data.translatedData[props.service]) {
                originalTranslation = data.translatedData[props.service];
            }
        }

        return originalTranslation;
    }

    // Update the cell display logic in the render section
    const getCellContent = (index, data, cellKey) => {
        const savedEdit = savedValues[cellKey];
        const translation = getTranslation(data);

        if (savedEdit !== undefined) {
            return savedEdit;
        } else if (translation) {
            return translation;
        } else {
            if (['google', 'yandex', 'localAiTranslator'].includes(props.service)) {
                // Use FilterTargetContent for pending translations with supported services
                if (props.translatePendingStatus && !props.service.includes('_ai')) {
                    if (data.filteredString) {
                        return <span dangerouslySetInnerHTML={{ __html: data.filteredString }} style={{ whiteSpace: 'pre-wrap' }}></span>;
                    }

                    return <FilterTargetContent service={props.service} content={data.source || ''} contentKey={data.id} item={data} saveFilteredString={saveFilteredString} />;
                }
                return data.source || '';
            } else {
                return (
                    <img
                        src={imgFolder + 'plus.png'}
                        alt={__("Add translation", "automatic-translations-for-polylang-pro")}
                        className="lmat-page-translation-add-translation-icon"
                    />
                );
            }
        }
    };

    return (
        <div className="modal-body">
            {translateContent.length > 0 && props.postDataFetchStatus ?
                <>
                    {StringModalBodyNotice && <div className="lmat-page-translation-body-notice-wrapper"><StringModalBodyNotice /></div>}
                    {props.translatePendingStatus && (
                        <div className="lmat_page_translation_translate_progress" key={props.modalRender}>
                            {__("Automatic translation is in progress....", 'automatic-translations-for-polylang-pro')}<br />
                            {__("It will take few minutes, enjoy ☕ coffee in this time!", 'automatic-translations-for-polylang-pro')}<br /><br />
                            {__("Please do not leave this window or browser tab while translation is in progress...", 'automatic-translations-for-polylang-pro')}
                        </div>
                    )}
                    <div className={`translator-widget ${service}`} style={{ display: 'flex' }}>
                        <h3 className="choose-lang">{TranslateService({ Service: props.service }).heading} <span className="dashicons-before dashicons-translation"></span></h3>

                        <div className={`lmat_page_translation_translate_element_wrapper ${props.translateStatus ? 'translate-completed' : ''}`}>
                            <div id={`lmat_page_translation_${props.service}_translate_element`}></div>
                        </div>
                    </div>

                    <div className="lmat_page_translation_string_container">
                        <table className="scrolldown" id="stringTemplate" ref={tableRef}>
                            <thead>
                                <tr>
                                    <th className="notranslate">{__("S.No", 'linguator-multilingual-ai-translation')}</th>
                                    <th className="notranslate">{__("Source Text", 'linguator-multilingual-ai-translation')}</th>
                                    <th className="notranslate">{__("Translation", 'linguator-multilingual-ai-translation')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.postDataFetchStatus &&
                                    <>
                                        {translateContent.map((data, index) => {
                                            const cellKey = `${index}_2`;
                                            let originalTranslation = '';

                                            if (data.translatedData) {
                                                if (service && data.translatedData[service]) {
                                                    originalTranslation = data.translatedData[service];
                                                } else if (data.translatedData[props.service]) {
                                                    originalTranslation = data.translatedData[props.service];
                                                }
                                            }

                                            const isEditingThisCell = editingCells.some(cell => cell.row === index && cell.col === 2);

                                            return (
                                                <Fragment key={index + props.translatePendingStatus}>
                                                    {undefined !== data.source && data.source.trim() !== '' &&
                                                        <>
                                                            <tr key={index + 'tr' + props.translatePendingStatus + (data.filteredString ? 'filteredString' : '')}>
                                                                <td>{index + 1}{(!getTranslation(data) && !isEditingThisCell) && <GlossaryCount string={data.source} glossary={glossaryOrignalTerms}
                                                                    onClick={(e) => {
                                                                        handleTdClick(e, 2, index, data);
                                                                    }}
                                                                />}</td>
                                                                <td data-source="source_text">{data.source}</td>
                                                                <td
                                                                    data-key={data.id}
                                                                    data-string-type={data.type}
                                                                    onClick={(e) => {
                                                                        handleTdClick(e, 2, index, data);
                                                                    }}
                                                                    style={{ cursor: 'pointer' }}
                                                                    translate={(savedValues[cellKey] && props.service === 'google' || savedValues[cellKey] && props.service === 'yandex') ? "no" : (props.translatePendingStatus && ['google', 'yandex', 'localAiTranslator'].includes(props.service) && !props.service.includes('_ai')) ? "yes" : 'yes'}
                                                                    className={`${!isEditingThisCell && !savedValues[cellKey] && !originalTranslation ? 'lmat-page-translation-empty-translation-cell' : ''} ${savedValues[cellKey] && props.service === 'localAiTranslator' || savedValues[cellKey] && props.service === 'google' ? 'notranslate' : (props.translatePendingStatus && ['google', 'yandex', 'localAiTranslator'].includes(props.service) && !props.service.includes('_ai')) ? 'translate' : 'translate'} ${isEditingThisCell ? 'lmat-page-translation-editing-cell' : ''}`}
                                                                    data-translate-status={props.translatePendingStatus ? 'pending' : 'translated'}
                                                                >
                                                                    {isEditingThisCell ? (
                                                                        <div
                                                                            contentEditable="true"
                                                                            className="lmat-page-translation-content-editable"
                                                                            ref={el => {
                                                                                textareaRefs.current[cellKey] = el;
                                                                                if (el) {
                                                                                    el.style.height = 'auto';
                                                                                    el.style.height = el.scrollHeight + 'px';
                                                                                }
                                                                            }}
                                                                            onFocus={() => setActivePopupCell({ row: index, col: 2 })}
                                                                            onInput={e => handleTextareaInput(e, index, 2)}
                                                                            style={{ width: '100%', minHeight: 40, resize: 'vertical' }}
                                                                            dangerouslySetInnerHTML={{ __html: editingValues[cellKey] || '' }}
                                                                        />
                                                                    ) : (
                                                                        getCellContent(index, data, cellKey)
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </>
                                                    }
                                                </Fragment>
                                            );
                                        })}
                                    </>
                                }
                            </tbody>
                        </table>
                    </div>
                </> :
                props.postDataFetchStatus ?
                    <p>{__('No strings are available for translation', 'linguator-multilingual-ai-translation')}</p> :

                    <div className="lmat-page-translation-skeleton-loader-wrapper">
                        <div className="translate-widget">
                            <div className="lmat-page-translation-skeleton-loader-mini"></div>
                            <div className="lmat-page-translation-skeleton-loader-mini"></div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th className="notranslate">{__("S.No", 'linguator-multilingual-ai-translation')}</th>
                                    <th className="notranslate">{__("Source Text", 'linguator-multilingual-ai-translation')}</th>
                                    <th className="notranslate">{__("Translation", 'linguator-multilingual-ai-translation')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(10)].map((_, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><div className="lmat-page-translation-skeleton-loader-mini"></div></td>
                                            <td><div className="lmat-page-translation-skeleton-loader-mini"></div></td>
                                            <td><div className="lmat-page-translation-skeleton-loader-mini"></div></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
            }
            {/* Popup rendered via portal for correct positioning */}
            {popupInfo &&
                ReactDOM.createPortal(
                    <InfoPopup
                        left={popupInfo.left}
                        top={popupInfo.top}
                        onClose={closePopup}
                        onGlossaryClick={handleGlossaryClick}
                        onAddGlossary={handleAddGlossaryClick}
                        showAddGlossary={showAddGlossary}
                        onCopy={() => {
                            const cell = activePopupCell;
                            if (cell) {
                                const sourceText = translateContent[cell.row]?.source || '';
                                setEditingValues(prev => ({
                                    ...prev,
                                    [`${cell.row}_${cell.col}`]: sourceText
                                }));
                                setTimeout(() => {
                                    const textarea = textareaRefs.current[`${cell.row}_${cell.col}`];
                                    if (textarea) textarea.focus();
                                }, 0);
                            }
                        }}
                        glossaryOpen={showGlossary && matchedGlossaryTerms.length > 0}
                        glossaryCount={matchedGlossaryTerms.length}
                        onSave={handleSave}
                        disableGlossary={matchedGlossaryTerms.length === 0}
                    />,
                    document.body
                )
            }

            {/* Add Glossary Modal */}
            {showAddGlossary && activePopupCell && ReactDOM.createPortal(
                <AddGlossaryPopup
                    position={addGlossaryPosition}
                    sourceLang={props.sourceLang}
                    targetLang={props.targetLang}
                    selectedSourceText={selectedSourceText}
                    onClose={() => setActivePopupType(null)}
                    setGlossaryTerms={setGlossaryTerms}
                    setGlossaryOrignalTerms={setGlossaryOrignalTerms}
                />,
                document.body
            )}

            {/* Glossary Modal */}
            {showGlossary && matchedGlossaryTerms.length > 0 && ReactDOM.createPortal(
                <GlossaryPopup
                    position={glossaryPosition}
                    terms={matchedGlossaryTerms}
                    sourceLangLabel={getLanguageName(props.sourceLang)}
                    targetLangLabel={getLanguageName(props.targetLang)}
                    onInsert={term => handleInsertGlossaryTerm(term, activePopupCell)}
                    width={256}
                />,
                document.body
            )}
        </div>
    );
}

export default StringPopUpBody;
