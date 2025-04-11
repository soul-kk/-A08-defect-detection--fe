# 车辆零部件缺陷检测系统前端

本项目是一个基于 React 的车辆零部件缺陷检测系统的前端实现，集成了图像检测、数据可视化和智能对话等功能。

## 功能特点

- 图像检测：支持上传图片并进行缺陷检测
- 检测记录：展示历史检测记录和详细结果
- 数据统计：使用图表直观展示缺陷分布和检测准确率
- AI 助手：集成讯飞星火大模型的智能对话功能

## 技术栈

- React 18
- Vite
- Ant Design
- ECharts
- WebSocket
- CSS Modules

## 安装依赖

确保你的开发环境已安装 Node.js (v16+)，然后执行：

```bash
# 安装依赖
npm install

# 或使用 yarn
yarn install
```

## 运行项目

```bash
# 开发环境运行
npm run dev

# 或使用 yarn
yarn dev
```

启动后访问 http://localhost:5173

## 项目结构

```
src/
├── components/        # 组件目录
│   ├── chatbot.jsx   # AI对话组件
│   ├── header.jsx    # 页面头部组件
│   └── detection.jsx # 检测相关组件
├── pages/            # 页面目录
│   ├── detection/    # 检测页面
│   └── statistics/   # 统计页面
├── style/            # 样式文件
├── api.js           # API 接口
└── App.jsx          # 应用入口
```

## 环境要求

- Node.js v16+
- npm v7+ 或 yarn v1.22+
- 现代浏览器（支持 ES6+）

## 许可证

[MIT License](LICENSE)