import storeTranslateString from "../store-translate-strings/index.js";


/**
 * Handles the scrolling animation of a specified element.
 * 
 * @param {Object} props - The properties for the scroll animation.
 * @param {HTMLElement} props.element - The element to be scrolled.
 * @param {number} props.scrollSpeed - The duration of the scroll animation in milliseconds.
 */
const ScrollAnimation = (props) => {
    const { element, scrollSpeed, prefix, completedPostStatus, totalPosts, postId, lang } = props;

    if(element.scrollHeight - element.offsetHeight <= 0){
        return;
    }
    
    let startTime = null;
    let startScrollTop = element.scrollTop;
    const animateScroll = () => {
        
        const scrollHeight = element.scrollHeight - element.offsetHeight + 100;
        const currentTime = performance.now();
        const duration = scrollSpeed;
        const scrollTarget = scrollHeight + 2000;

        if (!startTime) {
            startTime = currentTime;
        }

        const progress = (currentTime - startTime) / duration;
        const scrollPosition = startScrollTop + (scrollTarget - startScrollTop) * progress;

        var scrollTop = element.scrollTop;
        var currentScrollHeight = element.scrollHeight;
        var clientHeight = element.clientHeight;
        var scrollPercentage = (scrollTop / (currentScrollHeight - clientHeight)) * 100;

        let completedPercentage=(Math.round(scrollPercentage * 10) / 10).toFixed(2);
        completedPercentage = Math.min(completedPercentage, 100).toString();

        updateProgressBarStatus(prefix, postId, lang, completedPercentage, completedPostStatus, totalPosts);

        if (scrollPosition > scrollHeight) {
            return; // Stop animate scroll
        }

        element.scrollTop = scrollPosition;

        if (scrollPosition < scrollHeight) {
            requestAnimationFrame(animateScroll);
        }
    }
    requestAnimationFrame(animateScroll);
};

/**
 * Updates the translated content in the string container based on the provided translation object.
 */
const updateTranslatedContent = ({provider, startTime, endTime, prefix, postId, lang, storeDispatch}) => {
    const stringContainer = document.querySelector(`#${prefix}-${provider}-table-container[data-render-id="${postId}"]`);

    if(!stringContainer){
        return;
    }

    const translatedData = stringContainer.querySelectorAll(`.${prefix}-${provider}-table-cell`);    
    translatedData.forEach((ele, index) => {
        const translatedText = ele.innerText;
        const key = ele.dataset.key;

        storeTranslateString(postId, key, lang, translatedText, provider, lang, storeDispatch);
    });
}

/**
 * Handles the completion of the translation process by enabling the save button,
 * updating the UI, and stopping the translation progress.
 * 
 * @param {HTMLElement} container - The container element for translation.
 * @param {number} startTime - The start time of the translation.
 * @param {number} endTime - The end time of the translation.
 * @param {Function} translateStatus - The function to call when the translation is complete.
 */
const onCompleteTranslation = ({provider, startTime, endTime, prefix, postId, lang, storeDispatch}) => {
    const stringContainer = document.querySelector(`#${prefix}-${provider}-table-container[data-render-id="${postId}"]`);

    if(!stringContainer){
        return;
    }

    updateTranslatedContent({provider, startTime, endTime, prefix, postId, lang, storeDispatch});
}

const updateProgressBarStatus=(prefix, postId, lang, percentage, completedPostStatus, totalPosts)=>{
    const progressBarCircular=document.querySelector(`.${prefix}-progress-bar-circular[data-id="${postId}_${lang}"]`);

    let currentPostCompletedPercentage=percentage;
    currentPostCompletedPercentage=Math.round(currentPostCompletedPercentage);
    currentPostCompletedPercentage=Math.min(currentPostCompletedPercentage, 100);

    if(progressBarCircular){
        progressBarCircular.querySelector(`.${prefix}-percentage`).innerHTML=currentPostCompletedPercentage + '%';
        progressBarCircular.querySelector(`.${prefix}-progress`).style.strokeDasharray=currentPostCompletedPercentage + ', 100';
    }

    let totalProgress=completedPostStatus + (percentage / totalPosts);
    const totalProgressBar=document.querySelector(`.${prefix}-overall-progress .${prefix}-progress`);
    if(totalProgressBar){

        totalProgress=totalProgress.toFixed(2);
        totalProgress=Math.min(totalProgress, 100);
        totalProgressBar.style.width=totalProgress + '%';
        totalProgressBar.innerHTML=totalProgress + '%';
    }
}

/**
 * Automatically scrolls the string container and triggers the completion callback
 * when the bottom is reached or certain conditions are met.
 * 
 * @param {Function} translateStatus - Callback function to execute when translation is deemed complete.
 * @param {string} provider - The provider of the translation.
 * @param {string} prefix - The prefix of the translation.
 * @param {string} postId - The post id of the translation.
 * @param {string} lang - The language of the translation.
 * @param {Function} storeDispatch - The store dispatch function.
 * @param {number} totalPosts - The total number of posts.
 * @param {number} completedPostStatus - The completed post status.
 */
const ModalStringScroll = async ({provider, prefix, postId, lang, storeDispatch, totalPosts, completedPostStatus}) => {
    const startTime = new Date().getTime();
    
    let translateComplete = false;
    
    const stringContainer = document.querySelector(`#${prefix}-${provider}-table-container[data-render-id="${postId}"]`);
    
    stringContainer.scrollTop = 0;
    const scrollHeight = stringContainer.scrollHeight;
    
    await new Promise((resolve) => {
        // Defensive: check for valid container
        if (!stringContainer) {
            resolve('No container');
            return;
        }

        // If scrollable, animate and listen for scroll-to-bottom
        if (typeof scrollHeight === 'number' && scrollHeight > 100) {

            const visibilityChange = () => {
                if(document.visibilityState === 'visible'){
                    const scrollSpeed = Math.ceil(scrollHeight / (stringContainer.offsetHeight || 1)) * 1000;
                    ScrollAnimation({ element: stringContainer, scrollSpeed, prefix, totalPosts, completedPostStatus, postId, lang });
                }
            }

            document.addEventListener("visibilitychange", visibilityChange);

            setTimeout(() => {
                const scrollSpeed = Math.ceil(scrollHeight / (stringContainer.offsetHeight || 1)) * 1000;
                ScrollAnimation({ element: stringContainer, scrollSpeed, provider, prefix, totalPosts, completedPostStatus, postId, lang });
            }, 500);

            const onScroll = () => {
                const isScrolledToBottom =
                    stringContainer.scrollTop + stringContainer.clientHeight + 50 >= stringContainer.scrollHeight;
                if (isScrolledToBottom && !translateComplete) {
                    translateComplete = true;
                    stringContainer.removeEventListener('scroll', onScroll);
                    const endTime = new Date().getTime();
                    updateProgressBarStatus(prefix, postId, lang, 100, completedPostStatus, totalPosts);
                    document.removeEventListener('visibilitychange', visibilityChange);
                    setTimeout(() => {
                        onCompleteTranslation({ provider, startTime, endTime, prefix, postId, lang, storeDispatch });
                        resolve('Complete');
                    }, 1000);
                }
            };
            stringContainer.addEventListener('scroll', onScroll);

            // If not enough to scroll, just complete after delay
            if ((stringContainer.clientHeight || 0) + 10 >= scrollHeight) {
                updateProgressBarStatus(prefix, postId, lang, 100, completedPostStatus, totalPosts);
                setTimeout(() => {
                    const endTime = new Date().getTime();
                    document.removeEventListener('visibilitychange', visibilityChange);
                    onCompleteTranslation({ provider, startTime, endTime, prefix, postId, lang, storeDispatch });
                    resolve('Complete');
                }, 1000);
            }
        } else {
            updateProgressBarStatus(prefix, postId, lang, 100, completedPostStatus, totalPosts);

            // Not scrollable, just complete after delay
            setTimeout(() => {
                const endTime = new Date().getTime();
                onCompleteTranslation({ provider, startTime, endTime, prefix, postId, lang, storeDispatch });
                resolve('Complete');
            }, 1000);
        }
    });
}

export default ModalStringScroll;