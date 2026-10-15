// 页面操作指引：步骤配置与锚点查找（通用模板）。
// 铁律与接入说明见 SKILL.md；改动任何一条前先读那里的「为什么」。
export interface GuideStep { anchor: string; title: string; text: string; write?: boolean; optional?: boolean }
const step = (anchor: string, title: string, text: string, extra: Partial<GuideStep> = {}): GuideStep => ({ anchor, title, text, ...extra })

// 按页面/场景分组的示例步骤 —— 换成你自己的页面与文案。
// write: 只读账号自动剔除；optional: start 时按当前可见性过滤（条件渲染的区域）。
export type GuideContext = 'demo-form' | 'demo-list'

const guides: Record<GuideContext, GuideStep[]> = {
  'demo-form': [
    step('demo-form-input', '先填写关键字段', '对照说明填写各输入项；带星号的为必填。识别或自动填充的结果也可能出错，请逐项核对。', { write: true }),
    step('demo-form-save', '填写后保存', '点击“保存”提交当前修改；只打开或关闭指引不会保存。保存前请先核对填写内容。', { write: true }),
  ],
  'demo-list': [
    step('demo-list-filter', '先筛选', '用筛选器快速找出目标条目。筛选只改变展示，不改变数据本身。'),
    step('demo-list-refresh', '需要时刷新', '列表会自动刷新；空闲时可点“刷新”。刷新页面不会替你执行任何操作。'),
  ],
}

// 管理员专属场景：非管理员返回空数组，指引入口自动置灰。
const ADMIN_CONTEXTS: string[] = []

export function guideSteps(context: GuideContext, canWrite: boolean, isAdmin: boolean): GuideStep[] {
  if (ADMIN_CONTEXTS.includes(context) && !isAdmin) return []
  return guides[context].filter(item => !item.write || canWrite)
}

// Guide anchors are scoped to one page/batch. Never use business actions to reveal a target.
// Identifiers are app-owned, not file names, recognised text or selector expressions.
export function findGuideTarget(root: ParentNode, scope: string, anchor: string): HTMLElement | undefined {
  if (![scope, anchor].every(value => /^[a-zA-Z0-9_-]+$/.test(value))) return
  const visible = (el: HTMLElement) => el.isConnected && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
  const scopes = Array.from(root.querySelectorAll<HTMLElement>(`[data-guide-scope="${scope}"]`)).filter(visible)
  if (scopes.length !== 1) return
  const targets = Array.from(scopes[0]!.querySelectorAll<HTMLElement>(`[data-guide="${anchor}"]`)).filter(visible)
  return targets.length === 1 ? targets[0] : undefined
}
