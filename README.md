# Water Tracker Chrome 扩展插件

这是一个 Chrome 扩展插件，用于帮助您记录每日喝水次数。它会记录您每天喝水的次数，并以图表的形式展示这些数据。您可以查看过去几天的喝水情况、删除某一天的数据，并设置喝水提醒功能。

<div>
<img src="assets/screenshot1.png" style="display:inline-block; width: 40%;"/>
<img src="assets/screenshot2.png" style="display:inline-block; width: 40%;"/>
</div>

## 功能

- **记录喝水**：用户可以点击按钮记录每天的喝水次数。
- **饮水统计**：显示用户指定时间范围内的喝水次数，支持最近 7 天、30 天和所有数据。
- **图表显示**：用户可以选择显示为折线图、柱状图或饼图。
- **语言选择**：支持多种语言，包括简体中文、繁体中文、英语、俄语、法语、日语、韩语、西班牙语和德语。
- **设置功能**：
  - **删除数据**：用户可以选择特定日期删除记录。
  - **喝水提醒**：设置提醒时间并开启提醒功能，确保及时喝水。
  - **主题色切换**：支持白色主题、黑色主题和自动主题选择。
  - **数据备份与恢复**：可以导出和导入喝水数据（不包括设置和配置信息）。

## 安装链接

[WaterTrack - 喝水记录与提醒 Google Store 安装链接](https://chromewebstore.google.com/detail/watertrack-%E5%96%9D%E6%B0%B4%E8%AE%B0%E5%BD%95%E4%B8%8E%E6%8F%90%E9%86%92/hfldebifcmhcodgodgnahhnhonndbnbg)

### 语言选择

通过设置页面选择您所需的语言。

### 喝水提醒

在设置页面中，您可以设置提醒时间（分钟）并开启提醒功能，确保不会忘记饮水。

### 主题色设置

您可以在设置页面选择白色、黑色或自动主题模式，以适应您的个人喜好。

### 数据备份与恢复

- **导出数据**：点击“导出数据”按钮，将数据导出为 `.json` 文件，便于备份。
- **导入数据**：上传 `.json` 数据文件以恢复喝水记录。

## 项目结构

WaterTrack/
│
├── index.html # 扩展插件的主页面，显示用户界面
├── style.css # 自定义样式文件，用于页面样式
├── bootstrap.min.css # 引入的 Bootstrap 样式文件
├── chart.min.js # 引入的 Chart.js 图表库，用于绘制饮水统计图表
├── popup.js # 扩展插件的主要逻辑，处理交互与功能
├── lang.js # 语言切换功能脚本，支持多语言设置
├── theme-switcher.js # 主题切换功能脚本，处理不同主题的切换
├── bootstrap.bundle.min.js # 引入的 Bootstrap JavaScript 库，支持响应式设计和动态交互
└── manifest.json # Chrome 扩展的配置文件，包含扩展的元数据和权限声明

## 贡献

欢迎任何形式的贡献！如果您有建议、错误报告或代码贡献，请通过 [GitHub Issues](https://github.com/yourusername/WaterTrack/issues) 或提交 Pull Request 来帮助我们改进。

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。
