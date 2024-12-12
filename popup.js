document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("add-water");
    const waterCountDisplay = document.getElementById("water-count");
    const ctx = document.getElementById("water-chart").getContext("2d");
    const deleteButton = document.getElementById("delete-data");
    const deleteDateInput = document.getElementById("delete-date");
    const timeRangeSelect = document.getElementById("time-range");

    let chart; // 用于存储图表实例
    const username = "Admin"; // 使用 Admin 作为默认用户名

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
                username: 'Admin', // 默认用户名
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

    // 删除某天的数据
    deleteButton.addEventListener("click", async () => {
        const date = deleteDateInput.value; // 获取用户输入的日期
        if (!date) {
            alert("请选择日期！");
            return;
        }

        const data = await safeGetStorage("waterData");
        const waterData = data || {};

        // 删除指定日期的数据
        const index = waterData.records.findIndex(record => record.date === date);
        if (index !== -1) {
            waterData.records.splice(index, 1);
            await safeSetStorage("waterData", waterData);

            console.log(`已删除 ${date} 的数据`);
            alert(`已删除 ${date} 的数据`);
            updateChart(); // 更新图表
        } else {
            alert(`未找到 ${date} 的数据！`);
        }
    });

    // 更新图表
    async function updateChart(range = "7") {
        const data = await safeGetStorage("waterData");
        const waterData = data || {};

        // 获取今天日期
        const today = new Date();
        let labels = [];
        let values = [];

        // 如果选择的是 "全部数据"
        if (range === "all") {
            // 获取所有日期
            labels = waterData.records.map(record => record.date);
            values = labels.map((date) => {
                const record = waterData.records.find(r => r.date === date);
                return record ? record.count : 0;
            });
        } else {
            // 否则，生成最近 N 天的日期列表
            const days = parseInt(range, 10);
            labels = Array.from({ length: days }).map((_, i) => {
                const date = new Date(today);
                date.setDate(today.getDate() - (days - 1) + i); // 最近 N 天
                return date.toISOString().slice(0, 10); // 格式化为 YYYY-MM-DD
            });

            // 按日期获取对应的喝水次数，没有记录的日期设为 0
            values = labels.map((day) => {
                const record = waterData.records.find(r => r.date === day);
                return record ? record.count : 0;
            });
        }

        // 销毁旧图表以避免多实例
        if (chart) {
            chart.destroy();
        }

        // 创建新图表
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels, // X 轴显示的日期
                datasets: [
                    {
                        label: "每日喝水量",
                        data: values, // Y 轴显示的喝水次数
                        borderColor: "blue",
                        backgroundColor: "lightblue",
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }, // 显示图例
                    tooltip: { enabled: true }, // 启用悬浮提示
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "时间（日期）", // X 轴标题
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "喝水量（杯）", // Y 轴标题
                        },
                        min: 0, // 最小值为 0
                        max: 10, // 最大值为 10
                        ticks: {
                            stepSize: 1, // 每次刻度增加 1
                            callback: function (value) {
                                return `${value}`; // Y 轴显示 0 到 10
                            },
                        },
                    },
                },
            },
        });
    }

    // 时间范围选择事件
    timeRangeSelect.addEventListener("change", async () => {
        const range = timeRangeSelect.value;
        updateChart(range);
    });

    initializeData();
});
