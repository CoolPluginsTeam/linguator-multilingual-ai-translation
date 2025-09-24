import ElementorSaveSource from "../../store-source-string/elementor/index.js";

const fetchPostContent = async (props) => {
    const elementorPostData = lmatPageTranslationGlobal.elementorData && typeof lmatPageTranslationGlobal.elementorData === 'string' ? JSON.parse(lmatPageTranslationGlobal.elementorData) : lmatPageTranslationGlobal.elementorData;

    const content={
        widgetsContent:elementorPostData,
    }

    if(lmatPageTranslationGlobal.slug_translation_option === 'slug_translate'){
        content.slug_name=lmatPageTranslationGlobal.slug_name;
    }

    if(lmatPageTranslationGlobal.parent_post_title && '' !== lmatPageTranslationGlobal.parent_post_title){
        content.title=lmatPageTranslationGlobal.parent_post_title;
    }
    
    ElementorSaveSource(content);
    
    props.refPostData(content);
    props.updatePostDataFetch(true);
}

export default fetchPostContent;