import { __ } from '@wordpress/i18n';
import ClassicWidgetTranslator from './translator-modal/index.js';
import ReactDom from 'react-dom/client';
import { RiTranslateAi2 } from "react-icons/ri";
import * as styles from './style.modules.css';
import { useState } from 'react';

const TranslateToolTip=({left,top,getContent,setContent,prefix,contentTinyMCE, unMountToolTip})=>{
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        const content=getContent();

        if(content && content.length > 0){
            setIsOpen(true);
        }
    }

    return (
        <>
            {isOpen ? <ClassicWidgetTranslator getContent={getContent} setContent={setContent} pluginPrefix={prefix} onCloseHandler={() => { setIsOpen(false) }} contentTinyMCE={contentTinyMCE} unMountToolTip={unMountToolTip} /> : <div style={{ top: top, left: left }} className={styles[prefix+'-wrapper']} onClick={openModal}>
                Ai Translate <RiTranslateAi2 className={styles[prefix+'-translate-icon']} />
            </div>}
        </>

    )
}

export default TranslateToolTip;