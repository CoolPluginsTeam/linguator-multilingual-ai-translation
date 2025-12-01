import { __, sprintf } from "@wordpress/i18n";
const StringPopUpHeader = (props) => {

    /**
     * Function to close the popup modal.
     */
    const closeModal = () => {
        props.setPopupVisibility(false);
    }

    const translateService=lmatPageTranslationGlobal.providers;
    const serviceProvideLength=Object.keys(translateService).length;

    return (
        <div className="modal-header" key={props.modalRender}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2 className="notranslate">{sprintf(__("%sStart Automatic Translation Process", 'linguator-multilingual-ai-translation'), serviceProvideLength > 1 ? 'Step 2 - ' : '')}</h2>
            <div className="save_btn_cont">
                <button className="notranslate save_it button button-primary" disabled={props.translatePendingStatus} onClick={props.updatePostData}>{props.translateButtonStatus ? <><span className="updating-text">{__("Updating", 'linguator-multilingual-ai-translation')}<span className="dot" style={{"--i": 0}}></span><span className="dot" style={{"--i": 1}}></span><span className ="dot" style={{"--i": 2}}></span></span></> : __("Update Content", 'linguator-multilingual-ai-translation')}</button>
            </div>
        </div>
    );
}

export default StringPopUpHeader;