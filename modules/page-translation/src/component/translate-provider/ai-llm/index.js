import { select, dispatch } from "@wordpress/data";
import SaveTranslation from "../../store-translated-string/index.js";
import StoreTimeTaken from "../../store-time-taken/index.js";
import { requestAiBatch, chunkStringMap } from "../../../../../bulk-translation/src/components/translate-provider/ai-llm/api-client.js";
import { __, sprintf } from "@wordpress/i18n";
import AddProgressBar from "../../progress-bar/index.js";
import ShowStringCount from "../../progress-bar/show-string-count.js";

/**
 * @param {string} providerId openai|gemini|anthropic
 * @returns {(props: Object) => Promise<void>}
 */
export default function createAiLlmPageTranslator(providerId) {
    return async (props) => {
        const { sourceLang, targetLang, translateStatusHandler, ID, translateStatus, destroyUpdateHandler, modalRenderId } = props;
        const AllowedMetaFields = select("block-lmatPageTranslation/translate").getAllowedMetaFields();

        const clearErrorNotice = () => {
            document.dispatchEvent(new CustomEvent("lmat-page-translation:translation-error-clear", { bubbles: true }));
        };

        const showErrorNotice = (message) => {
            document.dispatchEvent(
                new CustomEvent("lmat-page-translation:translation-error", {
                    bubbles: true,
                    detail: { message: String(message || "") },
                })
            );
        };

        const targetEl = ID ? document.getElementById(ID) : null;
        if (!targetEl) {
            return;
        }

        const buttonTextMap = {
            openai: __("Translate with OpenAI", "linguator-multilingual-ai-translation"),
            gemini: __("Translate with Gemini", "linguator-multilingual-ai-translation"),
            anthropic: __("Translate with Anthropic", "linguator-multilingual-ai-translation"),
        };

        // Render button (and avoid duplicating on re-renders)
        targetEl.innerHTML = "";
        const btn = document.createElement("button");
        btn.type = "button";
        // Reuse Chrome AI button classes for identical styling
        btn.className = "local_ai_translator_btn button button-primary";
        btn.textContent = buttonTextMap[providerId] || sprintf(__("Translate with %s", "linguator-multilingual-ai-translation"), providerId);
        if (translateStatus) {
            btn.disabled = true;
        }
        targetEl.appendChild(btn);

        const runTranslation = async () => {
            if (btn.disabled) {
                return;
            }

            btn.disabled = true;
            translateStatusHandler(true);

            const entries = select("block-lmatPageTranslation/translate").getTranslationEntries();
            const entryById = {};
            const strings = {};
            entries.forEach((row) => {
                if (!row.source || String(row.source).trim() === "") {
                    return;
                }
                entryById[row.id] = row;
                strings[row.id] = row.filteredString || row.source;
            });

            const stringContainer = jQuery("#lmat_page_translation_strings_model .modal-content .lmat_page_translation_string_container");
            const progressBar = jQuery("#lmat_page_translation_strings_model .lmat_page_translation_translate_progress");

            if (Object.keys(strings).length === 0) {
                clearErrorNotice();
                translateStatusHandler(false);
                btn.disabled = false;
                return;
            }

            // Chrome-like: show overlay + auto-scroll + percent bar
            AddProgressBar(providerId);

            if (stringContainer[0] && stringContainer[0].scrollHeight > 100) {
                progressBar.fadeIn("slow");
            }

            const startTime = new Date().getTime();
            const restUrl = lmatPageTranslationGlobal.ai_batch_translate_url;
            const nonce = lmatPageTranslationGlobal.rest_nonce;
            const postId = lmatPageTranslationGlobal.current_post_id;
            const objectType = lmatPageTranslationGlobal.editor_type === "taxonomy" ? "term" : "post";

            /** When true, translation finished without error — keep translate button disabled. */
            let translationSucceeded = false;

            const finish = () => {
                progressBar.fadeOut("slow");
                translateStatusHandler(false);
                if (!translationSucceeded) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            };

            try {
                clearErrorNotice();
                const chunks = chunkStringMap(strings);
                const totalKeys = Math.max(1, Object.keys(strings).length);
                let doneKeys = 0;
                let totalChars = 0;
                let totalStrings = 0;

                for (const chunk of chunks) {
                    const modelKey = providerId === 'gemini' ? 'gemini_model' : providerId === 'anthropic' ? 'anthropic_model' : 'openai_model';
                    const selectedModel = (lmatPageTranslationGlobal?.ai_models && lmatPageTranslationGlobal.ai_models[modelKey]) ? String(lmatPageTranslationGlobal.ai_models[modelKey]) : '';
                    const translations = await requestAiBatch({
                        provider: providerId,
                        postId,
                        objectType,
                        sourceLang,
                        targetLang,
                        strings: chunk,
                        model: selectedModel,
                        restUrl,
                        nonce,
                    });

                    if (Object.keys(translations).length === 0 && Object.keys(chunk).length > 0) {
                        throw new Error(__("The AI returned an empty translation response. Please try again.", "linguator-multilingual-ai-translation"));
                    }

                    for (const key of Object.keys(chunk)) {
                        const row = entryById[key];
                        if (!row) {
                            continue;
                        }
                        const t = translations[key] !== undefined ? translations[key] : chunk[key];
                        SaveTranslation({
                            type: row.type,
                            key: row.id,
                            translateContent: t,
                            source: row.source,
                            provider: providerId,
                            AllowedMetaFields,
                        });
                        const src = row.source || "";
                        totalChars += src.trim().length;
                        totalStrings += src.trim().split(/(?<=[.!?]+)\s+/).filter(Boolean).length;
                        doneKeys++;
                    }

                    const pct = Math.min(100, Math.round((doneKeys / totalKeys) * 100));
                    jQuery(`.${providerId}-translator_progress`).css("width", `${pct}%`).text(`${pct}%`);

                    // Keep the strings container scrolling while work is happening
                    const el = stringContainer && stringContainer[0] ? stringContainer[0] : null;
                    if (el && el.scrollHeight > el.clientHeight) {
                        const maxScroll = el.scrollHeight - el.clientHeight;
                        el.scrollTop = Math.round((pct / 100) * maxScroll);
                    }
                }

                dispatch("block-lmatPageTranslation/translate").translationInfo({
                    targetStringCount: totalStrings,
                    targetWordCount: entries.reduce((acc, row) => {
                        const s = (row.source || "").trim();
                        return acc + s.split(/\s+/).filter((word) => /[^\p{L}\p{N}]/.test(word)).length;
                    }, 0),
                    targetCharacterCount: totalChars,
                    translateStatus: true,
                    provider: providerId,
                });

                jQuery(`.${providerId}-translator_progress`).css("width", "100%").text("100%");
                ShowStringCount(providerId, "block", totalChars);
                StoreTimeTaken({ prefix: providerId, start: startTime, end: new Date().getTime(), translateStatus: true });
                translationSucceeded = true;
            } catch (e) {
                StoreTimeTaken({ prefix: providerId, start: startTime, end: new Date().getTime(), translateStatus: false });
                const errorMessage = e?.message || __("Translation failed. Please try again.", "linguator-multilingual-ai-translation");
                showErrorNotice(errorMessage);
            }

            // Keep the progress overlay visible briefly, similar to other providers
            setTimeout(finish, 4000);
        };

        btn.addEventListener("click", runTranslation);

        // If translation is already in progress (e.g. re-render), keep button disabled.
        if (translateStatus) {
            btn.disabled = true;
        }

        if (typeof destroyUpdateHandler === "function") {
            destroyUpdateHandler(() => {
                btn.removeEventListener("click", runTranslation);
                if (targetEl) {
                    targetEl.innerHTML = "";
                }
                clearErrorNotice();
            });
        }
    };
}
