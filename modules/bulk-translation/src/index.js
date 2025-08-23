import App from './App.js';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { store } from './ReduxStore/store.js';
import { Provider } from 'react-redux';

(() => {
    const BulkTranslate = (props) => {
        const [modalVisible, setModalVisible] = useState(false);
        const [postIds, setPostIds] = useState([]);
        const prefix=props.prefix;
        const wrapper=document.getElementById(`${prefix}-wrapper`);

        const handleModalVisibility = (e) => {
            e.preventDefault();
            const selectedPostIds=document.querySelectorAll('table.widefat input[name="post[]"]:checked');
            const postIds=Array.from(selectedPostIds).map(postId=>postId.value);
            setPostIds(postIds);
            setModalVisible(prev => !prev);
            
            const googleWidget=document.querySelector('.skiptranslate iframe[id=":1.container"]');
            document.body.classList.remove(prefix+'-google-translate');

            if (googleWidget) {
                const closeButton = googleWidget.contentDocument.querySelector('a[id=":1.close"][title="Close"] img');
                if (closeButton) {
                    closeButton.click();
                }
            }

        }
        
        useEffect(() => {
            const doActionsBtn=document.querySelectorAll(`.${prefix}-btn`);
            if(doActionsBtn){
                doActionsBtn.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleModalVisibility(e);
                    });
                });
            }
        }, []);

        useEffect(() => {
            const mainWrapper=document.getElementById(`${prefix}-wrapper`);
            if(mainWrapper){
                mainWrapper.classList.toggle(`${prefix}-active`, modalVisible);
            }
        }, [modalVisible]);

        return (
            modalVisible ? (
                <App onDestory={handleModalVisibility} prefix={prefix} postIds={postIds} />
            ) : null
        );
    }
    
    window.addEventListener('load', async () => {
        const prefix='lmat-bulk-translate';

        await new Promise(resolve => setTimeout(resolve, 500));

        ReactDOM.createRoot(document.getElementById(`${prefix}-wrapper`)).render(
            <Provider store={store}>
                <BulkTranslate prefix={prefix} />
            </Provider>
        );
    });
})();
