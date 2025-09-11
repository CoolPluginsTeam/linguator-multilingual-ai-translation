import { svgIcons } from "./modal/svgIcons";

class Translator {
  private pageLanguage: string;
  private wrpId: string;
  private translateElementId: string;
  private bodyNoTranslateExist: boolean;

  constructor(pageLanguage: string, wrpId: string, translateElementId: string) {
    this.pageLanguage = this.filterLanguage(pageLanguage);
    this.wrpId = wrpId;
    this.translateElementId = translateElementId;
    this.bodyNoTranslateExist = document.body.classList.contains('notranslate');
    this.createTranslator();
  }

  private createTranslator = async () => {
    // @ts-ignore
    const googleTranslator = new google.translate.TranslateElement({
        includedLanguages: this.pageLanguage,
        multilanguagePage: true,
        autoDisplay: false,
    }, `${this.translateElementId}`);

    const element=document.querySelector(`#${this.translateElementId}`);

    if(element){
        const translateElement=element.children;

        if(translateElement.length <= 0){
          // @ts-ignore
            Object.values(google?.translate?.TranslateElement()).map(item=>{
                if(item instanceof HTMLElement && item.id === `${this.translateElementId}`){
                    element.replaceWith(item);
                }
            });
        }
    }
  }

  public startTranslation = async (
    texts: object,
  ): Promise<object> => {

    document.body.classList.add('notranslate');
    document.body.classList.add('lmat-inline-translate-start');

    let translateContent = '';
    let translateContentArray = {};

    Object.keys(texts).forEach((key) => {
      translateContent += '<div class="translate" data-lmat-translate-key="'+key+'">'+texts[key]+'</div>';
    });

    const stringWrp=document.querySelector(`.${this.wrpId}`);

    if(stringWrp){
      stringWrp.innerHTML = translateContent;

      await new Promise(resolve => setTimeout(resolve, 200));

      const languageSelector=document.querySelector(`#${this.translateElementId} .goog-te-combo`);

      if(languageSelector){
        // @ts-ignore
        languageSelector.value = this.pageLanguage;

        // @ts-ignore
        languageSelector.dispatchEvent(new Event('change'));


        await new Promise(resolve => setTimeout(resolve, 1200));

        // @ts-ignore
        const translatedWrp=Array.from(document.querySelectorAll(`.${this.wrpId} .translate[data-lmat-translate-key]`));

        translatedWrp.forEach((item) => {
          // @ts-ignore
          const key=item?.dataset?.lmatTranslateKey;
          // @ts-ignore
          translateContentArray[key] = item.innerText;
        });
      }
    }

    if(!this.bodyNoTranslateExist){
      document.body.classList.remove('notranslate');
    }

    const googleWidget=document.querySelector('.skiptranslate iframe[id=":1.container"]');

    if (googleWidget) {
      // @ts-ignore
      const closeButton = googleWidget.contentDocument.querySelector('a[id=":1.close"][title="Close"] img');
      if (closeButton) {
          closeButton.click();
      }
  }

    document.body.classList.remove('lmat-inline-translate-start');
    return translateContentArray;
  };

  private filterLanguage = (lang: string) => {
    if(lang === 'zh'){
        return this.pageLanguage.replace('_', '-');
    }

    return lang;
  }
}

export default Translator;
