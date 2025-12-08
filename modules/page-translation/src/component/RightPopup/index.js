import React, { useState, useEffect, useRef } from "react";


const AddGlossaryPopup = ({
  position,
  sourceLang,
  targetLang,
  selectedSourceText,
  onClose,
  setGlossaryTerms,
  setGlossaryOrignalTerms
}) => {
  const [type, setType] = useState("general");
  const [sourceText, setSourceText] = useState(selectedSourceText || "");
  const [selectedText, setSelectedText] = useState(selectedSourceText || "");
  const [targetText, setTargetText] = useState('');
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [extractedTexts, setExtractedTexts] = useState([]);

  // Function to find the best matching text
  const findBestMatch = (texts) => {
    if (!texts || texts.length === 0) return '';

    // Try to find text that matches common patterns
    for (const text of texts) {
      const trimmed = text.trim();
      // Look for text ending with colon or starting with common label patterns
      if (trimmed.endsWith(':') || /^(Label|Title|Heading|Text):/i.test(trimmed)) {
        return trimmed;
      }
    }

    // If no pattern matches, return the first non-empty text
    return texts[0] || '';
  };

  // Function to extract text content from HTML
  const extractTextFromHtml = (html) => {
    // Create temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Get all text nodes
    const texts = [];
    const walk = document.createTreeWalker(
      temp,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walk.nextNode()) {
      const text = node.textContent.trim();
      if (text && text.length > 1) { // Skip single characters
        // Get parent element to check context
        const parent = node.parentElement;
        if (parent) {
          // If text is inside a tag like <strong>, get its full content
          const fullText = parent.textContent.trim();
          // Check if it ends with punctuation like colon
          if (fullText.endsWith(':')) {
            texts.push(fullText);
          }
        }
        // Also add the text node content itself
        texts.push(text);
      }
    }

    // Remove duplicates but preserve order
    return [...new Set(texts)];
  };

  // Effect to process selectedSourceText when it changes
  useEffect(() => {
    if (selectedSourceText) {
      if (selectedSourceText.includes('<') && selectedSourceText.includes('>')) {
        // Looks like HTML - extract text content
        const texts = extractTextFromHtml(selectedSourceText);
        setExtractedTexts(texts);
        if (texts.length > 0) {
          // Find the best match or use first text
          const bestMatch = findBestMatch(texts);
          setSelectedText(bestMatch);
          setSourceText(bestMatch);
        }
      } else {
        // Plain text - use as is
        setSelectedText(selectedSourceText);
        setSourceText(selectedSourceText);
        setExtractedTexts([]);
      }
    }
  }, [selectedSourceText]);

  const popupRef = useRef(null);
  const infoPopupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const popup = popupRef.current;
      const infoPopup = infoPopupRef.current || document.querySelector(".lmat-page-translation-info-popup");

      const clickedOutsidePopup = popup && !popup.contains(event.target);
      const clickedOutsideInfo = infoPopup ? !infoPopup.contains(event.target) : true;

      if (clickedOutsidePopup && clickedOutsideInfo) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!type || !sourceText?.trim() || !sourceLang?.trim()) {
      setError("Type, Term, and Source Language are required.");
      setSaving(false);
      return;
    }

    try {

      if (!lmatPageTranslationGlobal?.add_glossary_validate) {
        setError('Security token missing. Please refresh the page.');
        setSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append("action", "lmat_add_glossary");
      formData.append("_wpnonce", lmatPageTranslationGlobal.add_glossary_validate);
      formData.append("type", type);
      formData.append("term", sourceText.trim());
      formData.append("description", description || "");
      formData.append("source_lang", sourceLang);

      if (targetText && targetText.trim() && targetLang) {
        formData.append(`translations[${targetLang}]`, targetText.trim());
      }

      const ajax = lmatPageTranslationGlobal?.ajaxurl || ajaxurl;

      const response = await fetch(ajax, {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      let data;
      try {
        const responseText = await response.text();
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse response:", responseText);
          throw new Error("Invalid response from server");
        }
      } catch (e) {
        console.error("Error reading response:", e);
        throw new Error("Failed to read server response");
      }


      if (data?.success) {
        if (typeof setGlossaryTerms === "function") {
          try {
            const data = {
              action: 'lmat_get_glossary',
              source_lang: sourceLang,
              target_lang: targetLang,
              _wpnonce: lmatPageTranslationGlobal.get_glossary_validate
            }
            // Add sourceLang and targetLang as query params
            const url = `${lmatPageTranslationGlobal.ajax_url}`;

            const refreshResponse = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
              },
              credentials: 'same-origin',
              body: new URLSearchParams(data)

            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();

              if (refreshData?.success) {

                let glossaryOrignalTerms = [];
                
                refreshData.data.terms.forEach(term => {
                  if(term.original_term && term.original_term !== ''){
                    glossaryOrignalTerms.push(term.original_term);
                  }
                });

                setGlossaryOrignalTerms(glossaryOrignalTerms);

                setGlossaryTerms(refreshData.data?.terms || []);
                setSuccessMessage("Glossary term added successfully!");
                setTimeout(() => {
                  onClose();
                }, 3000);
              }
            }
          } catch (refreshErr) {
            console.error("Error refreshing glossary:", refreshErr);
          }
        }
      } else {
        const msg = data?.data || "Could not add glossary term";
        if (msg === "This term already exists in this language.") {
          setError("This term already exists in this language.");
        } else if (msg === "Permission denied") {
          setError("You do not have permission to add glossary terms.");
        } else if (typeof msg === "string") {
          setError(msg);
        } else {
          setError("Failed to add glossary term.");
        }
      }
    } catch (err) {
      console.error("Error saving glossary term:", err);
      setError("Failed to add glossary term. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ----- Positioning -----
  const style = {};
  if (typeof window !== "undefined" && position?.right != null) {
    style.right = window.innerWidth - position.right;
  }
  if (typeof window !== "undefined" && position?.bottom != null) {
    style.bottom = window.innerHeight - position.bottom + 20;
    if (style.right != null) style.right = style.right - 30;
  } else if (position?.top != null) {
    style.top = position.top;
  }

  return (
    <div
      ref={popupRef}
      className="lmat-page-translation-glossary-popup lmat-page-translation-add-glossary-popup"
      style={style}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lmat-page-translation-add-glossary-title"
    >
      <div className="lmat-page-translation-glossary-popup__header">
        <span id="lmat-page-translation-add-glossary-title">Add New Glossary Term</span>
      </div>

      <form onSubmit={handleSubmit} className="lmat-page-translation-add-glossary-form">
        <div className="lmat-page-translation-form-group">
          <label htmlFor="lmat-page-translation-type">Type:</label>
          <select
            id="lmat-page-translation-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="general">General</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="lmat-page-translation-form-group">
          {extractedTexts.length > 0 ? (
            <>
              <div className="lmat-page-translation-form-group">
                <label htmlFor="lmat-page-translation-term-select">Select Glossary Term:</label>
                <select
                  id="lmat-page-translation-term-select"
                  value={selectedText}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedText(selected);
                    setSourceText(selected);
                  }}
                  required
                >
                  {extractedTexts.map((text, index) => {
                    const displayText = text.length > 50 ? text.substring(0, 47) + '...' : text;
                    return (
                      <option key={index} value={text}>
                        {displayText}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="lmat-page-translation-form-group" style={{ marginTop: '16px' }}>
                <label htmlFor="lmat-page-translation-term">Glossary Term:</label>
                <input
                  id="lmat-page-translation-term"
                  type="text"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Edit selected text if needed"
                  required
                />
              </div>
            </>
          ) : (
            <div className="lmat-page-translation-form-group">
              <label htmlFor="lmat-page-translation-term">Glossary Term:</label>
              <input
                id="lmat-page-translation-term"
                type="text"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter source term"
                required
              />
            </div>
          )}
        </div>

        <div className="lmat-page-translation-form-group">
          <label htmlFor="lmat-page-translation-translation">
            Custom Translation {targetLang ? `(${targetLang})` : ""}:
          </label>
          <input
            id="lmat-page-translation-translation"
            type="text"
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            placeholder="Enter custom translation..."
          />
        </div>

        <div className="lmat-page-translation-form-group">
          <label htmlFor="lmat-page-translation-description">Description (optional):</label>
          <textarea
            id="lmat-page-translation-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter term description (optional)..."
            rows={3}
          />
        </div>

        {error && <div className="lmat-page-translation-error-message" role="alert">{error}</div>}
        {successMessage && <div className="lmat-page-translation-success-message" role="alert">{successMessage}</div>}

        <div className="lmat-page-translation-form-actions">
          <button type="button" onClick={onClose} className="button button-secondary">
            Cancel
          </button>
          <button type="submit" className="button button-primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

const InfoPopup = React.forwardRef(
  (
    {
      left,
      top,
      onClose,
      onGlossaryClick,
      onAddGlossary,
      glossaryOpen,
      glossaryCount = 0,
      onSave,
      onCopy,
      disableGlossary = false,
      showAddGlossary = false
    },
    ref
  ) => {
    const imgFolder = lmatPageTranslationGlobal.lmat_url + 'assets/images/';

    React.useEffect(() => {
      const handleTranslateClick = () => onClose();

      const elements = [
        document.getElementById('lmat-page-translation-ai-translate-btn'),
        document.getElementsByClassName('local_ai_translator_btn')[0],
        document.querySelector('.goog-te-combo'),
        document.getElementById('yt-widget')
      ].filter(Boolean);

      elements.forEach(el => {
        const eventType = el.tagName === 'SELECT' ? 'change' : 'click';
        el.addEventListener(eventType, handleTranslateClick);
      });
      return () => {
        elements.forEach(el => {
          const eventType = el.tagName === 'SELECT' ? 'change' : 'click';
          el.removeEventListener(eventType, handleTranslateClick);
        });
      };
    }, [onClose]);

    return (
      <div
        ref={ref}
        className="lmat-page-translation-info-popup"
        style={{ left, top }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="lmat-page-translation-info-popup__close"
          onClick={onClose}
          aria-label="Close"
          title="Close"
        >
          <img src={imgFolder + 'cross.png'} alt="Close" />
        </button>
        <button
          className={`lmat-page-translation-info-popup__glossary${disableGlossary ? ' lmat-page-translation-disabled' : ''}`}
          onClick={disableGlossary ? null : onGlossaryClick}
          title={disableGlossary ? "No glossary terms available" : "Glossary"}
          disabled={disableGlossary}
        >
          <span className="lmat-page-translation-bookmark-icon-wrapper">
            <img
              src={imgFolder + 'bookmark.png'}
              alt="Glossary"
              className={`lmat-page-translation-bookmark-icon${glossaryOpen ? ' lmat-page-translation-bookmark-icon--active' : ''}${disableGlossary ? ' lmat-page-translation-bookmark-icon--disabled' : ''}`}
            />
            {glossaryCount > 0 && (
              <span className="lmat-page-translation-bookmark-badge">{glossaryCount}</span>
            )}
          </span>
        </button>
        <button
          className={`lmat-page-translation-info-popup__add-glossary${showAddGlossary ? ' lmat-page-translation-active' : ''}`}
          onClick={onAddGlossary}
          title="Add to Glossary"
        >
          <img
            src={imgFolder + 'plus.png'}
            alt="Add Glossary"
            className={`lmat-page-translation-add-icon${showAddGlossary ? ' lmat-page-translation-add-icon--active' : ''}`}
          />
        </button>
        <button
          className="lmat-page-translation-info-popup__copy"
          onClick={onCopy}
          title="Copy"
        >
          <img src={imgFolder + 'copy.png'} alt="Copy" className="lmat-page-translation-copy-icon" />
        </button>
        <button
          className="lmat-page-translation-info-popup__save"
          onClick={onSave}
          aria-label="Save"
          title="Save"
        >
          <img src={imgFolder + 'save.png'} alt="Save" className="lmat-page-translation-save-icon" />
        </button>
      </div>
    );
  }
);

const GlossaryPopup = ({
  position,
  terms = [],
  targetLangLabel = "Translation",
  sourceLangLabel = "English",
  onInsert
}) => {
  const style = { right: window.innerWidth - position.right };

  if (position.bottom) {
    style.bottom = window.innerHeight - position.bottom + 20;
    style.right = style.right - 30;
  } else {
    style.top = position.top;
  }

  const truncateText = (text, maxLength = 23, sliceLength = 20) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, sliceLength) + "…" : text;
  };

  const imgFolder = lmatPageTranslationGlobal.lmat_url + 'assets/images/';
  return (
    <div
      className="lmat-page-translation-glossary-popup"
      style={style}
      onClick={e => e.stopPropagation()}
    >
      <div className="lmat-page-translation-glossary-popup__header">
        <span className="lmat-page-translation-glossary-popup__icon">
          <img src={imgFolder + 'bookmark.png'} alt="Glossary" className="lmat-page-translation-bookmark-icon" />
        </span>
        Glossary term in this sentence
        <span className="lmat-page-translation-glossary-popup__badge">{terms.length}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>{sourceLangLabel}</th>
            <th>{targetLangLabel}</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {terms.map((term, idx) => (
            <tr key={idx}>
              <td title={term.english}>{truncateText(term.english)}</td>
              <td title={term.translation}>{truncateText(term.translation)}</td>
              <td title={term.description}>{truncateText(term.description)}</td>
              <td>
                <button
                  className="lmat-page-translation-glossary-insert"
                  onClick={() => onInsert && onInsert(term)}
                >
                  Insert
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export {
  InfoPopup,
  GlossaryPopup,
  AddGlossaryPopup
};