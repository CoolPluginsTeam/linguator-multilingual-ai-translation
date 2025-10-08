import ControlBase from './control-base.js';
import elementorLanguageListBtn from './elementor-language-list.js';

const App = () => {
    const prefix = 'lmatElementorInlineTranslation';
    return new ControlBase(prefix);
}

jQuery(window).on('elementor:loaded', function () {
    App();
    elementorLanguageListBtn.appendElementorLanguageListBtn();
})