let reminderInterval = 0;  // 提醒间隔（分钟）
let reminderEnabled = false;  // 是否启用提醒
let lastReminderTime = Date.now();  // 上次提醒时间，初始为当前时间
const waterReminderMessages = [
    "别忘了喝水，保持身体水分哦！",
    "喝水对健康非常重要，记得补充水分！",
    "给身体加点水，保持活力！",
    "喝一口水，轻松又健康！",
    "水是生命之源，别忘了喝！",
    "记得喝水，保持充沛的精力！",
    "快喝点水，给自己补充能量！",
    "水是最好的饮料，赶紧喝吧！",
    "喝水才能保持肌肤水润哦！",
    "一天八杯水，健康又有活力！",
    "及时补充水分，保持好状态！",
    "渴了就喝水，保持最佳状态！",
    "多喝水，身体更健康！",
    "水是自然的良药，喝起来！",
    "身体需要水分，记得及时补充！",
    "喝水是对自己最好的照顾！",
    "喝水，给你的身体充电！",
    "喝水，保持活力和精神！",
    "喝水，保持最佳健康状态！",
    "水是最好的排毒剂，别忘了喝！",
    "每天保持喝水习惯，远离疲劳！",
    "喝水能促进新陈代谢哦！",
    "多喝水，少喝含糖饮料！",
    "喝水，润泽每一天！",
    "喝水，清新一整天！",
    "给自己喝一杯水的时间，感受清爽！",
    "水分充足，身体更健康！",
    "你需要水，喝吧！",
    "喝水能改善体内循环，健康加分！",
    "喝水帮助消化，保持肠道健康！",
    "水是生命的源泉，别忘了！",
    "多喝水，远离口渴！",
    "每次感到疲惫时，试试喝水！",
    "水润肤，喝出好气色！",
    "喝水是对健康的小投资！",
    "每天都喝水，保持最佳健康状态！",
    "坚持喝水，感受健康每一天！",
    "不渴也要喝水，保持水分平衡！",
    "水分是保持肌肉健康的关键，别忘了！",
    "喝水是最简单的保养法！",
    "喝水，清除体内垃圾！",
    "保持水分，保持健康！",
    "喝水，滋润每一寸肌肤！",
    "给身体补充足够水分，充满活力！",
    "喝水，带来一天的清新和能量！",
    "记得多喝水，不要让身体脱水！",
    "喝水，你的身体在感谢你！",
    "补充水分，保持舒适与清爽！"
];
// 检查是否需要提醒
function checkReminder() {
    if (reminderEnabled && reminderInterval > 0) {
        // 创建通知
        chrome.notifications.create('', {
            type: 'basic',
            iconUrl: 'icon.png',
            title: '喝水时间到！',
            message: `${waterReminderMessages[Math.floor(Math.random() * waterReminderMessages.length)]}`,
            priority: 2
        });
    }
}

// 每分钟检查一次
setInterval(() => {
    chrome.storage.local.get(['reminderEnabled', 'reminderInterval'], (result) => {
        reminderEnabled = result.reminderEnabled || false;
        reminderInterval = result.reminderInterval || 0;

        if (reminderEnabled && reminderInterval > 0) {
            const currentTime = Date.now();
            const timeSinceLastReminder = Math.floor((currentTime - lastReminderTime) / 60000);  // 计算自上次提醒以来的分钟数

            // 如果时间间隔已到，触发提醒并更新上次提醒时间
            if (timeSinceLastReminder >= reminderInterval) {
                checkReminder();
                lastReminderTime = currentTime;  // 更新上次提醒时间
            }
        }
    });
}, 3000);  
