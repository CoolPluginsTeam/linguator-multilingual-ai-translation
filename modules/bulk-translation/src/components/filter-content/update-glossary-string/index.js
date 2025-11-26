const updateGlossaryString = async ({ content, glossaryTerms }) => {

    if(!glossaryTerms || typeof glossaryTerms !== 'object' || Object.values(glossaryTerms).length < 1) return content;

    // Escape special characters in glossary terms
    const terms = Object.values(glossaryTerms)
      .map(t => t.original_term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
  
    if (!terms) return content;
  
    // Match only visible text (outside HTML tags <...> and shortcodes [...])
    const regex = new RegExp(
      `(?:(?<=>)|^)(?![^<]*(?:>|&lt;|&gt;))(?:[^<\\[]*?)\\b(${terms})\\b([^<\\[]*)(?=<|$)`,
      'gi'
    );

    content = content.replace(regex, match => {
      let updated = match;
  
      for (const term of Object.values(glossaryTerms)) {
        const escaped = term.original_term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
        // Capture any leading/trailing spaces with the term
        const termRegex = new RegExp(`(\\s*)(${escaped})(\\s*)`, 'gi');
  
        updated = updated.replace(
          termRegex,
          (full, before, found, after) =>
            `<span class="no-translate" translate="no" data-glossary-term="${found}">${before}${found}${after}</span>`
        );
      }
  
      return updated;
    });
  
    return content;
  };
  
  export default updateGlossaryString;
  