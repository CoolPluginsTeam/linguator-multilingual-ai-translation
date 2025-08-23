import { useState, useRef, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import styles from './style.modules.css';
import Translator from "../Translator";
import isTranslatorApiAvailable from "../isTranslatorApiAvailable";
import languages from "../Languages";
import LanguageDetector from "../LanguageDetector";
import Languages from "../Languages";
import Skeleton from 'react-loading-skeleton';
import skeletonStyles from 'react-loading-skeleton/dist/skeleton.css'
import ModalStyle from './modalStyle';
import ButtonGroup from './ButtonGroup';
import { svgIcons } from './svgIcons';
import ErrorModalBox from '../errorModal';

import {
  Modal,
  Button,
  SelectControl,
} from "@wordpress/components";

interface TranslateModalProps {
  value: string;
  onUpdate: (value: string) => void;
  pageLanguage: string;
  onModalClose?: () => void;
  modalOpen: boolean;
}

interface ButtonProps {
  label: string;
  className?: string;
  onClick: () => void;
}

const TranslatorModal: React.FC<TranslateModalProps> = ({ value, onUpdate, pageLanguage, onModalClose, modalOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(modalOpen);
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [langError, setLangError] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<string>("Copy");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorBtns, setErrorBtns] = useState<ButtonProps[]>([]);
  const [isTranslate, setIsTranslate] = useState<boolean>(false);

  useEffect(() => {
    if (!isTranslate) setIsLoading(true);
    setLangError("");

    if (value === "") {
      setLangError('<span style="color: #ff4646; display: inline-block;">Please enter text in your selected setting to translate.</span>');
      setIsLoading(false);
      return;
    }

    if (!isLoading || isTranslate) return;

    HandlerTranslate(value, pageLanguage)
  });

  const HandlerCloseModal = () => {
    setIsModalOpen(false);
    setLangError("");
    setTranslatedContent("");
    setErrorBtns([]);
    onModalClose && onModalClose();
  }

  const HandlerTranslate = async (value: string, pageLanguage: string) => {
    setTranslatedContent("");
    let element: HTMLDivElement | null = document.createElement('div');
    element.innerHTML = value;

    const allNodes = element.childNodes;
    const translatorObject = new Translator(pageLanguage, styles.originalText, styles.translateBtnWrap);
    const texts = {};

    const translateOnlyText = async (allNodes: string | any[] | NodeListOf<ChildNode>, index: number, id: string, translatedData: any) => {
      if (index >= allNodes.length) {
        return;
      }

      if (allNodes[index].nodeType === 3) {
        if (translatedData && Object.keys(translatedData).length > 0){
          allNodes[index].textContent = translatedData[id];
        } else {
          texts[id] = allNodes[index].textContent;
        }
      } else {
        const allChildNodes = allNodes[index].childNodes;
        await translateOnlyText(allChildNodes, 0, id + '_' + index, translatedData);
      }

      await translateOnlyText(allNodes, index + 1, id, translatedData);
    }

    if (allNodes.length > 0) {
      await translateOnlyText(allNodes, 0, '0', null);
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    const translatedData = await translatorObject.startTranslation(texts);

    if (translatedData && Object.keys(translatedData).length > 0){
      await translateOnlyText(allNodes, 0, '0', translatedData);
    }

    const translatedText = element.innerHTML;

    element = null;

    setTranslatedContent(translatedText);
    setIsLoading(false);
    setIsTranslate(true);
  };

  const HandlerReplaceText = () => {
    onUpdate(translatedContent);
    HandlerCloseModal();
  }

  const HandlerCopyText = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!translatedContent || translatedContent === "") return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(translatedContent);
      } else {
        // Fallback method if Clipboard API is not supported
        const textArea = document.createElement('textarea');
        textArea.value = translatedContent;
        document.body.appendChild(textArea);
        textArea.select();
        if (document.execCommand) {
          document.execCommand('copy');
        }
        document.body.removeChild(textArea);
      }

      setCopyStatus("Copied");
      setTimeout(() => setCopyStatus("Copy"), 1000); // Reset to "Copy" after 2 seconds
    } catch (err) {
      console.error('Error copying text to clipboard:', err);
    }
  }

  return (isModalOpen &&
    <>
      <ModalStyle modalContainer={styles.modalContainer} />
      <Modal
        title="Lingauator Inline Translator"
        onRequestClose={HandlerCloseModal}
        className={styles.modalContainer}
        overlayClassName={styles.modalOverlay}
        isDismissible={false}
        bodyOpenClassName={'body-class'}
      >
        <div className={styles.modalCloseButton} onClick={HandlerCloseModal}>&times;</div>
        {langError && langError !== "" ? (
          <div className={styles.error}><p dangerouslySetInnerHTML={{ __html: langError }} />{errorBtns.length > 0 && <ButtonGroup className={styles.errorBtnGroup} buttons={errorBtns} />}</div>
        ) : (
          <div className={styles.modal}>
            <div className={styles.controls}>
              {isLoading && !langError &&
                <div className={styles.loadingTextWrapper}>
                  <div id={styles.translateBtnWrap}></div>
                  <div className={styles.originalText}>
                    {value}
                  </div>
                  <Skeleton
                    count={1}
                    height='100%'
                    width="100%"
                    className={skeletonStyles['react-loading-skeleton'] + " " + styles.loadingTextSkeleton}
                  />
                </div>
              }
              {translatedContent && (!langError || langError === "") && !isLoading && translatedContent !== "" &&
                <>
                  <div className={styles.translatedContent}><label>Translated Text</label><p>{translatedContent}</p></div>
                  <div className={styles.translatedButtonWrp}>
                    <Button
                      className={styles.replaceBtn + " " + styles.btnStyle}
                      onClick={HandlerReplaceText}
                    >
                      Replace
                    </Button>
                    <Button
                      className={styles.copyBtn + " " + styles.btnStyle}
                      onClick={HandlerCopyText}
                    >
                      {copyStatus}
                    </Button>
                    <Button
                      className={styles.closeBtn + " " + styles.btnStyle}
                      onClick={HandlerCloseModal}
                    >
                      Close
                    </Button>
                  </div>
                </>
              }
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default TranslatorModal;