//popup.js
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("add-water");
    const waterCountDisplay = document.getElementById("water-count");
    const ctx = document.getElementById("water-chart").getContext("2d");
    const deleteButton = document.getElementById("delete-data");
    const deleteDateInput = document.getElementById("delete-date");
    const timeRangeSelect = document.getElementById("time-range");


    let chart;
    const username = "Admin"; // 默认用户名

    // 安全存储数据函数
    async function safeSetStorage(key, value) {
        try {
            await chrome.storage.local.set({ [key]: value });
        } catch (error) {
            console.error(`存储 ${key} 数据失败:`, error);
            alert("存储数据失败，请重试！");
        }
    }

    // 安全获取数据函数
    async function safeGetStorage(key) {
        try {
            const data = await chrome.storage.local.get([key]);
            return data[key];
        } catch (error) {
            console.error(`读取 ${key} 数据失败:`, error);
            alert("读取数据失败，请重试！");
            return null;
        }
    }

    // 初始化数据
    async function initializeData() {
        const data = await safeGetStorage("waterData");
        if (!data) {
            const initialData = {
                username, // 默认用户名
                records: [], // 初始化 records 数组
            };
            await safeSetStorage("waterData", initialData);
        }
        updateWaterCount();
        updateChart();
    }

    // 更新喝水计数
    async function updateWaterCount() {
        const data = await safeGetStorage("waterData");
        const waterData = data || {};
        const today = new Date().toISOString().slice(0, 10);

        const recordForToday = waterData.records.find(record => record.date === today);
        const count = recordForToday ? recordForToday.count : 0;
        waterCountDisplay.textContent = count;
    }

    // 增加喝水记录
    button.addEventListener("click", async () => {
        const data = await safeGetStorage("waterData");
        const waterData = data || {};
        const today = new Date().toISOString().slice(0, 10);

        // 查找当天的记录
        let recordForToday = waterData.records.find(record => record.date === today);

        if (!recordForToday) {
            recordForToday = { date: today, count: 0 };
            waterData.records.push(recordForToday);
        }

        // 增加当天的喝水次数
        recordForToday.count += 1;
        await safeSetStorage("waterData", waterData);

        updateWaterCount();
        updateChart();
    });
    // 时间范围选择事件
    timeRangeSelect.addEventListener("change", async () => {
        const range = timeRangeSelect.value;
        updateChart(range);
    });

    // 删除某天的数据
    deleteButton.addEventListener("click", async () => {
        const date = deleteDateInput.value;
        if (!date) {
            alert("请选择日期！");
            return;
        }

        const data = await safeGetStorage("waterData");
        const waterData = data || {};

        const index = waterData.records.findIndex(record => record.date === date);
        if (index !== -1) {
            waterData.records.splice(index, 1);
            await safeSetStorage("waterData", waterData);
            alert(`已删除 ${date} 的数据`);
            updateChart();
        } else {
            alert(`未找到 ${date} 的数据！`);
        }
    });

    // 更新图表
    async function updateChart(range = "7") {
        const data = await safeGetStorage("waterData");
        const waterData = data || {};

        const today = new Date();
        let labels = [];
        let values = [];

        if (range === "all") {
            labels = waterData.records.map(record => record.date);
            values = labels.map((date) => {
                const record = waterData.records.find(r => r.date === date);
                return record ? record.count : 0;
            });
        } else {
            const days = parseInt(range, 10);
            labels = Array.from({ length: days }).map((_, i) => {
                const date = new Date(today);
                date.setDate(today.getDate() - (days - 1) + i);
                return date.toISOString().slice(0, 10);
            });

            values = labels.map((day) => {
                const record = waterData.records.find(r => r.date === day);
                return record ? record.count : 0;
            });
        }

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "每日喝水量",
                    data: values,
                    borderColor: "blue",
                    backgroundColor: "lightblue",
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: "时间（日期）" },
                    },
                    y: {
                        title: { display: true, text: "喝水量（杯）" },
                        min: 0,
                        max: 10,
                        ticks: { stepSize: 1, callback: function (value) { return `${value}`; } },
                    },
                },
            },
        });
    }

    document.getElementById('saveSettings').addEventListener('click', () => {
        const minutes = parseInt(document.getElementById('minutes').value, 10);
        const enableReminder = document.getElementById('enableReminder').checked;

        // 输入验证：确保分钟数是一个正整数
        if (isNaN(minutes) || minutes <= 0) {
            alert("请输入一个有效的正整数作为提醒间隔！");
            return;
        }

        // 存储设置到 chrome.storage
        chrome.storage.local.set({ reminderEnabled: enableReminder, reminderInterval: minutes }, () => {
            // 提示保存成功
            alert("设置已保存！");
        });
    });

    // 页面加载时，读取存储的设置并应用到页面
    chrome.storage.local.get(['reminderEnabled', 'reminderInterval'], (result) => {
        // 确保从存储中获取的值不是 undefined
        if (result.reminderEnabled !== undefined) {
            document.getElementById('enableReminder').checked = result.reminderEnabled;
        }
        if (result.reminderInterval !== undefined) {
            document.getElementById('minutes').value = result.reminderInterval;
        }
    });
    initializeData();
});
