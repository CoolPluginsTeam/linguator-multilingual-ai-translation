import ControlBase, { initLmatDisplayConditionsNote } from './control-base.js';
import elementorLanguageListBtn from './elementor-language-list.js';

const App = () => {
    const prefix = 'lmatElementorInlineTranslation';
    return new ControlBase(prefix);
}

initLmatDisplayConditionsNote();

jQuery(window).on('elementor:loaded', function () {
    App();
    elementorLanguageListBtn.appendElementorLanguageListBtn();
})