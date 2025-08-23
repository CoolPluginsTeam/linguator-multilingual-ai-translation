import { select } from '@wordpress/data';
import FormatNumberCount from "../FormateNumberCount/index.js";

const ShowStringCount = (provider, status='none', characterCount=false) => {

    if(false ===characterCount){
        characterCount = select('block-lmatMachineTranslate/translate').getTranslationInfo().sourceCharacterCount;
    }

    const stringCount = document.querySelector(`.${provider}-translator-strings-count`);
    if(stringCount){
        stringCount.style.display = status;
        stringCount.querySelector('.totalChars').textContent = FormatNumberCount({number: characterCount});
    }
}

export default ShowStringCount;
