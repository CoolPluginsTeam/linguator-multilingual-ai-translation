import { useRef } from 'react';
import {select, dispatch} from '@wordpress/data';
import { Fragment } from "@wordpress/element";
import { __ } from '@wordpress/i18n';
import StoreStringsCount from '../component/storeStringsCount/index.js';

const ReTranslationFields = ({setRenderFields}) => {
    const itemsRef=useRef({});
    const reTranslationFields=select("block-lmatPageTranslation/translate").getReTranslationFields();

    const itemLabel=(label)=>{
        switch(label){
            case "title":
                return __('Title', 'linguator-multilingual-ai-translation');
            case "content":
                return __('Content', 'linguator-multilingual-ai-translation');
            case "excerpt":
                return __('Excerpt', 'linguator-multilingual-ai-translation');
            case "slug":
                return __('Slug', 'linguator-multilingual-ai-translation');
            case "metaFields":
                return __('Meta Fields', 'linguator-multilingual-ai-translation');
            default:
                return label;
        }
    }

    const translationInfo=select("block-lmatPageTranslation/translate").getTranslationInfo();
    if(!translationInfo && !translationInfo.availableContentTypes){
        return null;
    }

    const availableContentTypes=Object.keys(translationInfo.availableContentTypes).filter(key=>translationInfo.availableContentTypes[key]);

    const handleRetranslate=()=>{
        if(itemsRef && itemsRef.current && Object.values(itemsRef.current).length > 0){
            const inputFields=Object.values(itemsRef.current);
            
            const filterFields={};

            inputFields.forEach(field=>{
                if(field.checked){
                    filterFields[field.name]=true;
                }
            })
            
            setRenderFields(filterFields);
            dispatch('block-lmatPageTranslation/translate').updateReTranslationFields(filterFields);
            StoreStringsCount(); // Store the strings count in the global store
        }
    }

    return (
        <div className="lmat-page-translation-retranslate-wrapper">
            <div className="lmat-page-translation-retranslate-container">
                <div className="lmat-page-translation-retranslate-header">
                    <h3>{__('Re-Translate Specific Fields : ', 'linguator-multilingual-ai-translation')}</h3>
                </div>
                <div className="lmat-page-translation-retranslate-body">
                    <div className="lmat-page-translation-retranslate-items">
                        {availableContentTypes.map((contentType, index)=>{
                            return(
                                <Fragment key={index}>
                                    <input type="checkbox" name={contentType} id={contentType} ref={(el)=>itemsRef.current[index] = el} onChange={handleRetranslate} checked={reTranslationFields[contentType] === true ? true : false} />
                                    <label htmlFor={contentType}>{itemLabel(contentType)}</label>
                                </Fragment>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReTranslationFields;
