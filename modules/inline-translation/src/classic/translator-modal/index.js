import TranslatorModal from '../../inline-translate-modal/modal/index.tsx';


const ClassicWidgetTranslator = (props) => {
  const value = props.getContent();

  const activePageLanguage = window.lmatClassicInlineTranslation?.pageLanguage || 'en';
  
  const onUpdateHandler = (value) => {
    props.setContent(value);
    props.unMountToolTip();
  }

  const onCloseHandler = () => {
    props.onCloseHandler();
  }

  return <TranslatorModal modalOpen={true} value={value} onUpdate={onUpdateHandler} pageLanguage={activePageLanguage} onModalClose={onCloseHandler} />
}

export default ClassicWidgetTranslator;