// 获取用户存储的主题设置，默认为自动
let currentTheme = localStorage.getItem('theme') || 'auto';

// 设置主题
function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    } else if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else if (theme === 'auto') {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDarkScheme) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    }
    // 保存当前选择的主题到 localStorage
    localStorage.setItem('theme', theme);
}

// 初始化时设置主题
setTheme(currentTheme);

// 设置单选框的选中状态
document.addEventListener('DOMContentLoaded', function () {
    // 根据存储的主题值选中对应的单选框
    if (currentTheme === 'light') {
        document.getElementById('light-theme').checked = true;
    } else if (currentTheme === 'dark') {
        document.getElementById('dark-theme').checked = true;
    } else if (currentTheme === 'auto') {
        document.getElementById('auto-theme').checked = true;
    }
});

// 监听单选框的变化事件
document.querySelectorAll('input[name="theme"]').forEach(function (input) {
    input.addEventListener('change', function () {
        const selectedTheme = this.value;
        setTheme(selectedTheme);
    });
});

// 如果当前主题是自动，初始化时检查系统主题设置
if (currentTheme === 'auto') {
    setTheme('auto');
}
