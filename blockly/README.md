# Blockly

Google's Blockly is a web-based, visual programming editor.  Users can drag
blocks together to build programs.  All code is free and open source.

**The project page is https://developers.google.com/blockly/**

![](https://developers.google.com/blockly/sample.png)


## 1.10版 (2015-12-14)

修复问题:
- 【mBot】连接界面，刷新时重命名，crash
- 【mBot】重命名无效
- 【mBot】项目主页面，长按M按钮，弹出JavaScript菜单
- 【mBot】拖拽删除语句块时点击空白处，左侧删除遮罩不消失，导致无法选择语句块
- 【mBot】在保存项目提示框编辑状态下，收起键盘，UI错误
- 【mBot】关闭设备电源断开连接，再通过mBlockly断开，crash
- 【mBot】同时设置两个语句块的参数值，程序被遮罩，无法使用
- 【mBot】取色器无效

已知但未修复问题：
- 【mBot】设置“板载按钮按下”时，循环语句块（重复执行），无法停止
- 【mBot】保存项目时未屏蔽其他操作
- 【mBot】删除时未屏蔽其他操作（导致逻辑错误）
- 【mBot】我的项目界面不支持下拉、左右滑动（超过6个项目，无法显示）
- 【mBot】设备自动重连后，刷新时没有该设备记录