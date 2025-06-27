# Zanwei Guo - 响应式简历网页

基于 Figma 设计稿创建的响应式个人简历网页，使用 TypeScript + Tailwind CSS 开发。

## 🎨 设计特色

- **响应式设计**：完美适配 375px - 600px 宽度范围
- **现代排版**：使用 Inter 字体和 IBM Plex Mono 等宽字体
- **优雅交互**：平滑动画和悬停效果
- **无障碍访问**：支持键盘导航和屏幕阅读器
- **深色模式**：自动适配系统主题偏好
- **打印友好**：优化的打印样式

## 🚀 技术栈

- **HTML5** - 语义化标记
- **Tailwind CSS** - 实用优先的 CSS 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vanilla JS** - 轻量级交互逻辑

## 📱 响应式断点

- **Mobile**: 375px - 639px
- **Tablet**: 640px - 1023px  
- **Desktop**: 1024px+

## 🎯 功能特性

### 核心功能
- ✅ 个人信息展示
- ✅ 工作经历时间线
- ✅ 教育背景
- ✅ 项目作品集
- ✅ 联系方式

### 交互增强
- ✅ 平滑滚动
- ✅ 链接点击追踪
- ✅ 响应式布局适配
- ✅ 元素进入动画
- ✅ 悬停效果

### 可访问性
- ✅ 语义化 HTML
- ✅ 焦点管理
- ✅ 键盘导航
- ✅ 高对比度支持
- ✅ 减少动画选项

## 🏗️ 项目结构

```
cv/
├── index.html          # 主页HTML文件
├── styles.css          # 自定义样式和动画
├── script.ts           # TypeScript源文件
├── script.js           # 编译后的JavaScript
├── tsconfig.json       # TypeScript配置
└── README.md           # 项目文档
```

## 🚀 快速开始

### 本地预览

1. **直接打开**：
   ```bash
   # 直接用浏览器打开 index.html
   open index.html
   ```

2. **本地服务器**（推荐）：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 或使用 Node.js
   npx serve .
   
   # 或使用 Live Server（VS Code 扩展）
   ```

3. **访问网页**：
   ```
   http://localhost:8000
   ```

### TypeScript 开发

如果需要修改 TypeScript 代码：

```bash
# 编译 TypeScript
npx tsc

# 或者监听模式
npx tsc --watch
```

## 🎨 自定义修改

### 修改个人信息
编辑 `index.html` 中的相应部分：
- 个人简介
- 工作经历
- 教育背景
- 项目经验
- 联系方式

### 修改样式
在 `styles.css` 中自定义：
- 颜色主题
- 字体设置
- 动画效果
- 响应式断点

### 添加交互
在 `script.ts` 中扩展功能：
- 新的动画效果
- 数据追踪
- 表单处理
- 第三方集成

## 📊 性能优化

- **字体优化**：使用 Google Fonts 的 `font-display: swap`
- **图片优化**：WebP 格式支持和懒加载
- **CSS 优化**：Critical CSS 内联
- **JavaScript 优化**：按需加载和代码分割

## 🌐 浏览器支持

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- **Email**: zanwei.guo@outlook.com
- **Dribbble**: [zanwei](https://dribbble.com/zanwei)
- **Twitter**: [@zanweiguo](https://x.com/zanweiguo)
- **Instagram**: [@zanwei.guo](https://www.instagram.com/zanwei.guo)
- **Figma**: [@zanweiguo](https://www.figma.com/@zanweiguo)

---

基于 [Figma 设计稿](https://www.figma.com/design/N9I5q2SmQ8zXf2yhJHNs3a/Untitled?node-id=41-44563&t=8rpAMZTDqwJHGn2x-4) 开发 