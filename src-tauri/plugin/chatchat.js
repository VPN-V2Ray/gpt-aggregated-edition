/*********************************************************************************
 * 
 *                              这是一个Chat Chat的脚本 V1.0
 * 
 **********************************************************************************/
if (window.location.href.indexOf("chat.okis.dev") != -1) {
    try {
        let _chatChatMinHeithClassName = "md:min-h-[600px]";
        // 创建一个MutationObserver实例
        const observer = new MutationObserver(function (mutations) {
            // 获取中级空白区域
            let spaceArea = document.getElementsByClassName(_chatChatMinHeithClassName)[0];
            if (spaceArea != null) {
                process();
            }
        });

        // 开始观察document，并在节点添加或删除时检测变化
        observer.observe(document, {
            childList: true,
            subtree: true
        });

    } catch (e) {

    }
}

function process() {
    let textContentElement = document.getElementsByClassName(_chatChatMinHeithClassName)[0];
    textContentElement.classList.remove(_chatChatMinHeithClassName);
}