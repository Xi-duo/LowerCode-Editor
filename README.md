# React + TypeScript + Vite + Zustand + Tailwind

## 项目概述

### 1. 拖拽组件编辑器
- 使用 `react-dnd` 实现拖拽，支持将物料拖拽到组件树的任意层级。

### 2. 状态管理与持久化
- 通过 `zustand` 管理全局 store，存储组件树、组件配置等数据。
- 使用 `persist` 中间件进行数据持久化，确保刷新页面后状态不丢失。

### 3. 样式处理
- 采用 `tailwindcss` 编写样式，无需单独维护 CSS 文件。

### 4. 组件边界计算
- 通过 `getBoundingClientRect` 获取 hover、click 组件的边界信息。
- 动态计算编辑框的位置，确保交互体验流畅。

### 5. 组件树渲染
- 组件树基于 JSON 递归渲染组件。
- 采用 `React.cloneElement` 修改组件 `props`，支持动态属性调整。

### 6. 组件联动
- 组件通过 `ref` 进行联动，内部使用 `forwardRef` + `useImperativeHandle` 公开方法。
- 全局注册组件方法，其他组件可随时调用，实现灵活交互。
