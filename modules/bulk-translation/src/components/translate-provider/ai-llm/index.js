import { updateProgressStatus, updateTranslatePostInfo, unsetPendingPost } from "../../../redux-store/features/actions.js";
import { selectProgressStatus, selectTargetContent, selectTranslatePostInfo } from "../../../redux-store/features/selectors.js";
import { store } from "../../../redux-store/store.js";
import storeTranslateString from "../../store-translate-strings/index.js";
import { __ } from "@wordpress/i18n";
import { requestAiBatch, chunkStringMap } from "./api-client.js";

class AiLlmBulkTranslator {
    constructor({ sourceLang = "en", targetLangs = false, updateContent, totalPosts, storeDispatch, postId, prefix, updateDestoryHandler }) {
        this.textContentObject = selectTargetContent(store.getState(), postId);
        this.totalTranslatedLength = Object.keys(this.textContentObject).length;
        this.sourceLang = sourceLang;
        this.targetLangs = targetLangs;
        this.updateContent = updateContent;
        this.totalPosts = totalPosts;
        this.storeDispatch = storeDispatch;
        this.postId = postId;
        this.prefix = prefix;
        this.serviceProvider = store.getState().serviceProvider;
        this.stopTranslation = false;
        this.completedPostStatus = 0;
        updateDestoryHandler(() => {
            this.destroy();
        });
    }

    destroy = () => {
        this.stopTranslation = true;
    };

    getObjectType = () => {
        const info = store.getState().parentPostsInfo[this.postId];
        return info && info.editorType === "taxonomy" ? "term" : "post";
    };

    getRestUrl = () => {
        const base = (lmatBulkTranslationGlobal.bulkTranslateRouteUrl || "").replace(/\/$/, "");
        return `${base}/ai-translate-batch`;
    };

    updateProgressForChunk = (completedKeys, targetLang) => {
        if (this.totalTranslatedLength < 1) {
            return;
        }
        const completedPercentage = Math.min(100, (completedKeys / this.totalTranslatedLength) * 100);
        const progressBarCircular = document.querySelector(`.${this.prefix}-progress-bar-circular[data-id="${this.postId}_${targetLang}"]`);
        if (progressBarCircular) {
            const rounded = Math.min(100, Math.round(completedPercentage));
            progressBarCircular.querySelector(`.${this.prefix}-percentage`).innerHTML = `${rounded}%`;
            progressBarCircular.querySelector(`.${this.prefix}-progress`).style.strokeDasharray = `${rounded}, 100`;
        }
        const totalProgressBar = document.querySelector(`.${this.prefix}-overall-progress .${this.prefix}-progress`);
        if (totalProgressBar) {
            const totalProgress = Math.min(100, this.completedPostStatus + completedPercentage / this.totalPosts);
            totalProgressBar.style.width = `${totalProgress.toFixed(2)}%`;
            totalProgressBar.innerHTML = `${totalProgress.toFixed(2)}%`;
        }
    };

    async createLlmTranslator(targetLang, index) {
        if (this.stopTranslation) {
            return;
        }

        this.completedPostStatus = selectProgressStatus(store.getState());

        if (!this.textContentObject || Object.keys(this.textContentObject).length === 0) {
            this.storeDispatch(unsetPendingPost(`${this.postId}_${targetLang}`));
            this.storeDispatch(updateProgressStatus(100 / this.totalPosts));
            this.storeDispatch(
                updateTranslatePostInfo({
                    [`${this.postId}_${targetLang}`]: {
                        status: "error",
                        messageClass: "error",
                        errorMessage: __("No content to translate", "linguator-multilingual-ai-translation"),
                        errorHtml: false,
                    },
                })
            );
        } else {
            this.storeDispatch(updateTranslatePostInfo({ [`${this.postId}_${targetLang}`]: { status: "running", messageClass: "" } }));
            this.startTime = new Date();

            try {
                const chunks = chunkStringMap(this.textContentObject);
                const p = this.serviceProvider;
                const modelKey = p === "gemini" ? "gemini_model" : p === "anthropic" ? "anthropic_model" : "openai_model";
                const selectedModel =
                    lmatBulkTranslationGlobal?.ai_models && lmatBulkTranslationGlobal.ai_models[modelKey]
                        ? String(lmatBulkTranslationGlobal.ai_models[modelKey])
                        : "";
                let done = 0;
                for (const chunk of chunks) {
                    if (this.stopTranslation) {
                        break;
                    }
                    const translations = await requestAiBatch({
                        provider: this.serviceProvider,
                        postId: this.postId,
                        objectType: this.getObjectType(),
                        sourceLang: this.sourceLang,
                        targetLang,
                        strings: chunk,
                        model: selectedModel,
                        restUrl: this.getRestUrl(),
                        nonce: lmatBulkTranslationGlobal.nonce,
                    });
                    if (Object.keys(translations).length === 0 && Object.keys(chunk).length > 0) {
                        throw new Error(__("The AI returned an empty translation response. Please try again.", "linguator-multilingual-ai-translation"));
                    }
                    for (const key of Object.keys(chunk)) {
                        const value = translations[key] !== undefined ? translations[key] : chunk[key];
                        storeTranslateString(this.postId, key, targetLang, value, this.serviceProvider, targetLang, this.storeDispatch);
                        done++;
                    }
                    this.updateProgressForChunk(done, targetLang);
                }

                if (!this.stopTranslation) {
                    this.storeDispatch(updateProgressStatus(100 / this.totalPosts));
                    const endTime = new Date();
                    const duration = endTime - this.startTime;
                    const tInfo = selectTranslatePostInfo(store.getState());
                    const previousDuration = (tInfo && tInfo[`${this.postId}_${targetLang}`] && tInfo[`${this.postId}_${targetLang}`].duration) || 0;
                    this.storeDispatch(
                        updateTranslatePostInfo({
                            [`${this.postId}_${targetLang}`]: { duration: previousDuration + duration },
                        })
                    );
                    await this.updateContent(targetLang);
                }
            } catch (err) {
                const msg = err && err.message ? err.message : __("Translation failed.", "linguator-multilingual-ai-translation");
                this.storeDispatch(unsetPendingPost(`${this.postId}_${targetLang}`));
                this.storeDispatch(updateProgressStatus(100 / this.totalPosts));
                this.storeDispatch(
                    updateTranslatePostInfo({
                        [`${this.postId}_${targetLang}`]: {
                            status: "error",
                            messageClass: "error",
                            errorMessage: msg,
                            errorHtml: false,
                        },
                    })
                );
            }
        }

        if (index < this.targetLangs.length - 1 && !this.stopTranslation) {
            await this.createLlmTranslator(this.targetLangs[index + 1], index + 1);
        }
    }

    async initTranslation() {
        if (this.textContentObject && Object.keys(this.textContentObject).length > 0 && this.targetLangs && this.targetLangs.length > 0 && !this.stopTranslation) {
            await this.createLlmTranslator(this.targetLangs[0], 0);
        } else if (this.targetLangs && this.targetLangs.length > 0 && !this.stopTranslation) {
            this.targetLangs.forEach((lang) => {
                this.storeDispatch(unsetPendingPost(`${this.postId}_${lang}`));
                this.storeDispatch(updateProgressStatus(100 / this.totalPosts));
                this.storeDispatch(
                    updateTranslatePostInfo({
                        [`${this.postId}_${lang}`]: {
                            status: "error",
                            messageClass: "error",
                            errorMessage: __("No content to translate", "linguator-multilingual-ai-translation"),
                            errorHtml: false,
                        },
                    })
                );
            });
        }
    }
}

export default AiLlmBulkTranslator;
