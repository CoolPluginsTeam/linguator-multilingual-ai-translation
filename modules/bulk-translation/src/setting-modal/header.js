import { __ } from "@wordpress/i18n";

const SettingModalHeader = ({ setSettingVisibility, prefix }) => {
    return (
        <div className={`${prefix}-setting-modal-header`}>
            <h2>{__("Step 2 - Select Translation Provider", 'linguator-multilingual-ai-translation')}</h2>
            <span className={`${prefix}-setting-modal-close`} onClick={(e) => setSettingVisibility(e)}>&times;</span>
        </div>
    );
}

export default SettingModalHeader;
