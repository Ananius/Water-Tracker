# Water Tracker Chrome 扩展插件

这是一个 Chrome 扩展插件，用于帮助您记录每日喝水次数。它会记录您每天喝水的次数，并以图表的形式展示这些数据。您可以查看过去几天的喝水情况，也可以删除某一天的数据。

## 功能

- **记录喝水次数**：点击“记录喝水”按钮来记录每天的喝水次数。
- **数据可视化**：查看最近 7 天或 30 天的喝水次数，或查看所有数据。
- **删除数据**：可以删除指定日期的喝水记录。
- **灵活的时间范围选择**：可以选择查看最近 7 天、30 天的数据，或者查看所有历史数据。

## 如何使用

1. 安装该扩展插件到 Chrome 浏览器。
2. 点击浏览器工具栏上的扩展图标，打开弹出窗口。
3. 点击“记录喝水”按钮，记录当天的喝水次数。
4. 从下拉菜单中选择时间范围，查看最近 7 天、30 天，或所有数据的图表。
5. 如果需要删除数据，输入日期并点击“删除”按钮。

## 数据格式

该扩展插件使用以下格式将数据保存在 Chrome 的 `localStorage` 中：

```json
{
  "waterData": {
    "username": "Admin",
    "records": [
      {
        "date": "YYYY-MM-DD",
        "count": 5
      },
      {
        "date": "YYYY-MM-DD",
        "count": 3
      }
    ]
  }
}
```
