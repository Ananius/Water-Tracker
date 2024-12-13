// lang.js
// 动态加载语言包并更新界面
const loadLanguage = async (language) => {
    try {
        // 请求语言包
        const response = await fetch(`lang/${language}.json`);

        // 如果响应不成功，则抛出错误
        if (!response.ok) {
            throw new Error(`无法加载语言包：${language}`);
        }

        // 解析 JSON 数据
        const translations = await response.json();

        // 更新页面文本
        Object.keys(translations).forEach((key) => {
            const element = document.getElementById(key);
            if (element) {
                element.innerText = translations[key];
            }
        });

        // 更新语言选择框的当前选中值
        const languageSelect = document.getElementById("language-select");
        if (languageSelect) {
            languageSelect.value = language;  // 设置语言选择框的选中项
        }

        // 如果语言包加载成功，存储语言设置
        chrome.storage.local.set({ language }, () => {
            console.log(`语言设置已保存：${language}`);
        });

    } catch (error) {
        console.error("语言加载失败", error);
        alert("加载语言包失败，请检查网络或联系管理员。");
    }
};

// 语言选择事件监听器
document.getElementById("language-select")?.addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    loadLanguage(selectedLanguage);
});

// 页面加载时获取已保存的语言设置（如果有）
chrome.storage.local.get("language", (result) => {
    const savedLanguage = result.language || navigator.language || "zh-CN"; // 默认使用简体中文
    loadLanguage(savedLanguage);
});
