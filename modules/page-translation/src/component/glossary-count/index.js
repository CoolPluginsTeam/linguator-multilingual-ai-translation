const GlossaryCount = ({ string, glossary }) => {

    let count=0;

    glossary.forEach(term => {
        if(string.includes(term)){
            count++;
        }
    });

    if(!count || count < 1) return null;

    const bookmarkIcon = lmatPageTranslationGlobal.lmat_url + 'assets/images/bookmark.png';

    return (
        <span className="lmat-page-translation-glossary-count">
            <img src={bookmarkIcon} alt="Glossary" className="lmat-page-translation-glossary-count-icon"/>
            <span className="lmat-page-translation-glossary-count-badge">{count}</span>
        </span>
    );
};

export default GlossaryCount;