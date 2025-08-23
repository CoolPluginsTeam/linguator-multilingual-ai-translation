import StringPopUpNotice from "./notice.js";
import { sprintf, __ } from "@wordpress/i18n";
import FormatNumberCount from "../component/FormateNumberCount/index.js";

const StringPopUpFooter = (props) => {

    return (
        <div className="modal-footer" key={props.modalRender}>
            {!props.translatePendingStatus && <StringPopUpNotice className="lmat_page_translation_string_count"><p>{__('Wahooo! You have saved your valuable time via auto translating', 'autopoly-ai-translation-for-polylang')} <strong><FormatNumberCount number={props.characterCount} /></strong> {__('characters using', 'autopoly-ai-translation-for-polylang')} <strong>{props.serviceLabel}</strong>.{__('Please share your feedback —', 'autopoly-ai-translation-for-polylang')}<a href="https://wordpress.org/support/plugin/automatic-translations-for-polylang/reviews/#new-post" target="_blank" rel="noopener" style={{color: 'yellow'}}>{__('leave a quick review', 'autopoly-ai-translation-for-polylang')}</a>!</p></StringPopUpNotice>}
            <div className="save_btn_cont">
                <button className="notranslate save_it button button-primary" disabled={props.translatePendingStatus} onClick={props.updatePostData}>{__("Update Content", 'autopoly-ai-translation-for-polylang')}</button>
            </div>
        </div>
    );
}

export default StringPopUpFooter;