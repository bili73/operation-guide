# operation-guide

页面级操作指引 —— [Claude Code Skill](https://code.claude.com/docs/en/skills) + Vue 3 组件二合一。

基于 Element Plus Tour 的手动短指引系统：按页面/场景和账号权限展示 3–6 步，高亮框精确框住具体组件，翻步平滑滑动，Esc 只关指引不穿透，指引本身零业务副作用。

## 特性

- **锚点精确**：`data-guide` 放在哪个组件就框哪个组件，支持控件组包裹层
- **翻步平滑**：定位期间面板不闪回屏幕中央，解析稳定后一次滑动到新目标；滚动跟随无拖尾
- **权限裁剪**：`write` 步骤对只读账号自动剔除；管理员专属场景对普通账号隐藏
- **健壮生命周期**：晚到/暂时缺失的目标有明确兜底；页面切换、弹窗关闭、组件卸载全部清理；Esc 阻断穿透保护未保存草稿
- **零新依赖**：只用已有的 `element-plus`（ElTour）与 `vue`

## 安装

### 方式一：作为 Claude Code Skill

把本仓库克隆到项目的 `.claude/skills/operation-guide/`（或将 `SKILL.md`、`guide.ts`、`OperationGuide.vue` 三个文件放进去），之后涉及指引新增/修改/排查的对话会自动带着全部机制与坑位清单。

### 方式二：直接使用组件

1. 复制 [`guide.ts`](./guide.ts)（把示例步骤换成你的页面与文案）和 [`OperationGuide.vue`](./OperationGuide.vue)；
2. 页面模板：

```html
<div data-guide-scope="page-demo">
  <input data-guide="demo-form-input" />
  <button data-guide="demo-form-save">保存</button>
</div>
```

```ts
import OperationGuide from './OperationGuide.vue'
```

```html
<OperationGuide
  label="本页指引"
  context="demo-form"
  scope="page-demo"
  :can-write="canWrite"
  :is-admin="isAdmin"
  :active="pageVisible"
  reset-key="demo-1"
/>
```

## 铁律

八条实现铁律（翻步为何不能置空 target、锚点移出文档为何立即解绑、rAF 循环为何不能提前 return、Node 测试桩的调用守卫等）与浏览器轨迹采样验证配方，见 [`SKILL.md`](./SKILL.md)。修改 `guide.ts` 或 `OperationGuide.vue` 前必读。

## 环境

- Vue >= 3.4、Element Plus >= 2.9（ElTour）
- TypeScript（DOM lib）

## License

[MIT](./LICENSE)
