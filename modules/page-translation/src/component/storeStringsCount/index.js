import { select, dispatch } from "@wordpress/data";

const StoreStringsCount = () => {
    const reTranslationFields = select("block-lmatPageTranslation/translate").getReTranslationFields();
    let getFieldTypes=false;
    if(window.lmatPageTranslationGlobal && window.lmatPageTranslationGlobal.re_translate_page && window.lmatPageTranslationGlobal.re_translate_page === "1" && reTranslationFields && Object.keys(reTranslationFields).length > 0){
       getFieldTypes=reTranslationFields;
    }

    const allEntries = select('block-lmatPageTranslation/translate').getTranslationEntries(getFieldTypes);

    let totalStringCount = 0;
    let totalCharacterCount = 0;
    let totalWordCount = 0;

    allEntries.map(entries => {
      const source = entries.source ? entries.source : '';
      const stringCount = source.split(/(?<=[.!?]+)\s+/).length;
      const wordCount = source.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
      const characterCount = source.length;

      totalStringCount += stringCount
      totalCharacterCount += characterCount;
      totalWordCount += wordCount;
    });

    dispatch('block-lmatPageTranslation/translate').translationInfo({ sourceStringCount: totalStringCount, sourceWordCount: totalWordCount, sourceCharacterCount: totalCharacterCount });
}

export default StoreStringsCount;