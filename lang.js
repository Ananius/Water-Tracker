// lang.js
// 动态加载语言包并更新界面
const loadLanguage = async (language) => {
    try {
        const response = await fetch(`lang/${language}.json`);
        const translations = await response.json();

        Object.keys(translations).forEach((key) => {
            const element = document.getElementById(key);
            if (element) {
                element.innerText = translations[key];
            }
        });
    } catch (error) {
        console.error("语言加载失败", error);
    }
};

document
    .getElementById("language-select")
    .addEventListener("change", (event) => {
        const selectedLanguage = event.target.value;
        loadLanguage(selectedLanguage);
    });

// 默认加载简体中文
loadLanguage("zh-CN");
