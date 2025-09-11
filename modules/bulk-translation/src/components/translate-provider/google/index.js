import ModalStringScroll from "../../string-modal-scroll/index.js";
import GoogleLanguage from "./google-language.js";
import { selectProgressStatus, selectTargetContent, selectTargetLanguages, selectTranslatePostInfo } from "../../../redux-store/features/selectors.js";
import { store } from "../../../redux-store/store.js";
import { updateProgressStatus, updateTranslatePostInfo, unsetPendingPost } from "../../../redux-store/features/actions.js";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Initializes Google Translate functionality on specific elements based on provided data.
 * @param {Object} data - The data containing source and target languages.
 */
class GoogleTranslater {
    constructor({sourceLang = 'en', targetLangs = false, updateContent, totalPosts, storeDispatch, postId, prefix, updateDestoryHandler}) {
        this.sourceLang = sourceLang;
        this.targetLangs = targetLangs;
        this.updateContent = updateContent;
        this.totalPosts = totalPosts;
        this.storeDispatch = storeDispatch;
        this.postId = postId;
        this.prefix = prefix;
        this.updateDestoryHandler = updateDestoryHandler;
        this.stopTranslation = false;
        this.textContentObject = selectTargetContent(store.getState(), postId);
        this.appendStringTable();
        updateDestoryHandler(()=>{
            this.destroy();
        });
    }

    destroy=()=>{
        this.stopTranslation=true;
    }

    createGoogleTranslator = async (targetLang, index) => {
        if(this.stopTranslation) return;

        this.completedTranslateIndex=0;
        this.googleTranslator = null;

        const languageObject=lmatBulkTranslationGlobal.languageObject;
        this.completedPostStatus=selectProgressStatus(store.getState());

        if(!GoogleLanguage().includes(this.filterLanguage(targetLang))){
            this.storeDispatch(unsetPendingPost(this.postId+'_'+targetLang));
            this.storeDispatch(updateProgressStatus(100 / this.totalPosts));
            this.storeDispatch(updateTranslatePostInfo({[this.postId+'_'+targetLang]: { status: 'error', messageClass: 'error', errorMessage: sprintf(__('Language %s(%s) is not supported by Google Translate', 'linguator-multilingual-ai-translation'), languageObject[targetLang].name, targetLang), errorHtml: false}}));
        }else{
            this.activeTargetLang=targetLang;
    
            this.storeDispatch(updateTranslatePostInfo({[this.postId+'_'+targetLang]: { status: 'running', messageClass: ''}}));
            this.startTime=new Date();
            const isTranslated=await this.translateContent();

            if(!this.stopTranslation){
                this.storeDispatch(updateProgressStatus(100 / this.totalPosts));

                if(isTranslated){
                    this.updateContent(targetLang);

                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

        }
        
        this.startTime=null;
        
        if(index < this.targetLangs.length - 1 && !this.stopTranslation){
           await this.createGoogleTranslator(this.targetLangs[index + 1], index + 1);
        }
    }

    appendTranslateWidget = async () => {

        const targetLangs = selectTargetLanguages(store.getState(), this.postId).map(lang=>this.filterLanguage(lang));


        this.googleTranslator = new google.translate.TranslateElement({
            pageLanguage: this.sourceLang,
            // includedLanguages: targetLangs.join(','),
            defaultLanguage: this.sourceLang,
            multilanguagePage: true,
            autoDisplay: false,
        }, `${this.prefix}-google-translate-btn`);
        
        
        const element=document.querySelector(`#${this.prefix}-google-translate-btn`);

        if(element){
            const translateElement=element.children;

            if(translateElement.length <= 0){
                Object.values(google?.translate?.TranslateElement()).map(item=>{
                    if(item instanceof HTMLElement && item.id === `${this.prefix}-google-translate-btn`){
                        element.replaceWith(item);
                    }
                });
            }
        }
    }

    appendStringTable = () => {

        const tableContainer=jQuery(`#${this.prefix}-google-table-container`);
        const container=jQuery(`#${this.prefix}-container`);

        if(tableContainer && tableContainer.length > 0){
            tableContainer.find(`#${this.prefix}-google-translate-strings-container`).remove();
            tableContainer.attr('data-render-id', this.postId);
            const stringHtml=`<div id="${this.prefix}-google-translate-strings-container">
            ${Object.keys(this.textContentObject).map(key=>`
                <div class="${this.prefix}-google-table-row">
                    <div class="${this.prefix}-google-table-cell" data-key="${key}">${this.textContentObject[key]}</div>
                </div>
            `).join('')}
            </div>`;

            tableContainer.append(stringHtml);

        }else{
            const tableHtml=`
            <div id="${this.prefix}-google-table-container" class="translate" data-render-id="${this.postId}">
            <div id="${this.prefix}-google-translate-btn">Translate</div>
            <div id="${this.prefix}-google-translate-strings-container">
            ${Object.keys(this.textContentObject).map(key=>`
                <div class="${this.prefix}-google-table-row">
                    <div class="${this.prefix}-google-table-cell" data-key="${key}">${this.textContentObject[key]}</div>
                </div>
            `).join('')}
            </div>
            </div>
            `
    
            container.append(tableHtml);
        }

        document.documentElement.setAttribute('translate', 'no');
        document.body.classList.add('notranslate');
    }

    translateContent = async () => {
        const languageSelector=document.querySelector(`#${this.prefix}-google-translate-btn .goog-te-combo`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        if(languageSelector){
            const languageExist=languageSelector.querySelector('option[value="'+this.filterLanguage(this.activeTargetLang)+'"]');

            if(!languageExist){
                const languageObject=lmatBulkTranslationGlobal.languageObject;
                
                this.storeDispatch(updateTranslatePostInfo({[this.postId+'_'+this.activeTargetLang]: { status: 'error', messageClass: 'error', errorMessage: sprintf(__('Language %s(%s) is not supported by Google Translate', 'linguator-multilingual-ai-translation'), languageObject[this.activeTargetLang].name, this.activeTargetLang), errorHtml: false}}));
                return false;
            }

            document.body.classList.add(this.prefix+'-google-translate');

            languageSelector.value=this.filterLanguage(this.activeTargetLang);
            languageSelector.dispatchEvent(new Event('change'));

            await new Promise(resolve => setTimeout(resolve, 1500));

            if(this.stopTranslation) return false;
            
            await ModalStringScroll({provider: 'google', prefix: this.prefix, postId: this.postId, lang: this.activeTargetLang, storeDispatch: this.storeDispatch, totalPosts: this.totalPosts, completedPostStatus: this.completedPostStatus});

            const endTime=new Date();
            const duration=endTime-this.startTime;
            const previousDuration=selectTranslatePostInfo(store.getState(), this.postId+'_'+this.activeTargetLang).duration || 0;

            this.storeDispatch(updateTranslatePostInfo({[this.postId+'_'+this.activeTargetLang]: { duration: previousDuration + duration}}));

            return true;
        }
    }

    filterLanguage = (lang) => {
        if(lang === 'zh'){
            return lmatBulkTranslationGlobal.languageObject['zh']?.locale.replace('_', '-');
        }

        return lang;
    }

     // Function to initialize translation if conditions are met
     async initTranslation() {
        if(this.textContentObject && Object.keys(this.textContentObject).length > 0 && this.targetLangs && this.targetLangs.length > 0 && !this.stopTranslation){
            this.appendTranslateWidget();
            await this.createGoogleTranslator(this.targetLangs[0], 0);
        }else if(this.targetLangs && this.targetLangs.length > 0 && !this.stopTranslation){
            this.targetLangs.forEach(lang=>{
                this.storeDispatch(unsetPendingPost(this.postId+'_'+lang));
                this.storeDispatch(updateProgressStatus(100 / this.totalPosts));
                this.storeDispatch(updateTranslatePostInfo({[this.postId+'_'+lang]: { status: 'error', messageClass: 'error', errorMessage: __('No content to translate', 'linguator-multilingual-ai-translation'), errorHtml: false}}));
            });
        }
    }
}

export default GoogleTranslater;