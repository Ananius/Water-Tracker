//popup.js
document.addEventListener("DOMContentLoaded", () => {
    const addbutton = document.getElementById("add-water");
    const waterCountDisplay = document.getElementById("water-count");
    const ctx = document.getElementById("water-chart").getContext("2d");
    const deleteButton = document.getElementById("delete-data");
    const deleteDateInput = document.getElementById("delete-date");
    const timeRangeSelect = document.getElementById("time-range");
    const chartTypeSelect = document.getElementById("chart-type");
    const exportButton = document.getElementById("export-data");
    const importButton = document.getElementById("importData");
    const importFileInput = document.getElementById("importFile");

    let chart;
    const username = "Admin"; // 默认用户名
    let currentChartType = "line";  // 初始为折线图
    let currentTimeRange = "7";  // 初始为最近7天

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
    addbutton.addEventListener("click", async () => {
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
        updateChart(currentTimeRange, currentChartType); // 保持当前时间范围和图表类型
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


    // 图表类型选择事件
    chartTypeSelect.addEventListener("change", (event) => {
        currentChartType = event.target.value;
        updateChart(currentTimeRange, currentChartType);  // 更新图表，保持时间范围不变
    });

    // 时间范围选择事件
    timeRangeSelect.addEventListener("change", (event) => {
        currentTimeRange = event.target.value;
        updateChart(currentTimeRange, currentChartType);  // 更新图表，保持图表类型不变
    });
    // 更新图表
    async function updateChart(range = "7", chartType = "line") {
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
            chart.destroy();  // 销毁现有图表实例
        }

        // 根据图表类型选择不同的图表配置
        const chartOptions = {
            type: chartType,
            data: {
                labels,
                datasets: [{
                    label: "每日喝水量",
                    data: values,
                    borderColor: "#007bff", // 更改折线图颜色为蓝色
                    backgroundColor: "rgba(0, 123, 255, 0.2)", // 更改折线图填充颜色
                    fill: chartType === "line" || chartType === "bar", // 填充图表区域
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
                        min: 0,  // 最小值
                        ticks: {
                            stepSize: 1,  // 设置刻度的步长为1
                            callback: function (value) {
                                return `${value}杯`;  // 在每个刻度值后加上单位"杯"
                            }
                        },
                    },
                },

            },
        };

        // 为柱状图设置特定选项
        if (chartType === "bar") {
            chartOptions.data.datasets[0].backgroundColor = "rgba(30, 123, 223, 0.5)";  // 设置柱状图的背景色
        }

        // 饼图的颜色修复：使用温和的颜色调色板
        if (chartType === "pie") {
            chartOptions.type = "pie";
            chartOptions.data.datasets[0].backgroundColor = [
                "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
            ];  // 使用更柔和的颜色调色板
            chartOptions.options = {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
            };
        }

        // 创建新图表
        chart = new Chart(ctx, chartOptions);
    }

    // 保存提醒配置
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
    // 导出数据功能
    exportButton.addEventListener("click", async () => {
        const data = await safeGetStorage("waterData");
        const jsonData = JSON.stringify(data, null, 2); // 格式化 JSON 数据

        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "water_data.json";
        a.click();

        URL.revokeObjectURL(url); // 释放 URL
        alert("数据已导出！");
    });
    // 导入数据功能
    importButton.addEventListener("click", async () => {
        const file = importFileInput.files[0];

        if (!file) {
            alert("请选择一个文件！");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedData = JSON.parse(event.target.result);

                // 数据格式校验
                if (
                    importedData &&
                    typeof importedData === "object" &&
                    Array.isArray(importedData.records)
                ) {
                    await safeSetStorage("waterData", importedData);
                    alert("数据已成功导入！");
                    updateWaterCount();
                    updateChart();
                } else {
                    alert("文件格式不正确，请选择有效的JSON文件！");
                }
            } catch (error) {
                alert("导入数据失败，请检查文件格式！");
            }
        };

        reader.readAsText(file);
    });
    initializeData();
});
