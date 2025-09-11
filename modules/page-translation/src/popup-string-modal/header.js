import { __ } from "@wordpress/i18n";
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
                <button className="notranslate save_it button button-primary" disabled={props.translatePendingStatus} onClick={props.updatePostData}>{__("Update Content", 'linguator-multilingual-ai-translation')}</button>
            </div>
        </div>
    );
}

export default StringPopUpHeader;