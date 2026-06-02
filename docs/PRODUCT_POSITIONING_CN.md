# 中文产品定位说明｜Cloud Alley App Prototype

## 推荐定位

Cloud Alley 更适合作为 **空间服务产品原型 + H5 交互 Demo**，而不是强 AI Agent 项目。

推荐标题：

> Cloud Alley｜面向低空智慧社区的 H5 服务产品原型

## 用户与场景

- 社区居民：希望低空配送、阳台服务和社区设施更安全、更可理解。
- 物业 / 社区运营者：需要把低空服务和社区节点组织成可管理的服务流程。
- 设计评审者：需要看到住宅空间策略如何转化为用户体验。

## AI 产品价值

AI 在这个项目里的价值主要是 **辅助空间决策和产品场景推导**：

```text
drone route feasibility
+ building spacing
+ balcony projection depth
+ community service nodes
-> trade-off reasoning
-> risk / comfort / service-efficiency judgment
-> resident-facing H5 prototype
```

## 当前已有证据

- React + TypeScript + Vite H5 原型。
- `docs/PRODUCT_FLOW.md` 描述产品流程。
- `docs/AI_PRODUCT_FLOW_DIAGRAM.md` 说明低空社区服务的 AI-assisted decision layer。
- `docs/DRONE_ROUTE_CONSTRAINTS.md` 和 `docs/RISK_SCORE_DEMO.md` 说明低空路线约束与风险评分思路。
- `docs/INTERVIEW_TALKING_POINTS.md` 已明确不要过度声称强 AI 产品。

## 主要短板

- 没有真实用户调研。
- 没有真实低空路线数据或飞行仿真。
- AI 层目前主要是决策说明，没有接入模型 API 或 Agent。
- 更像前端交互原型，而不是完整 AI 产品闭环。

## 最少补强

1. 补一页用户画像和场景流程。
2. 补一张低空服务 workflow 图。
3. 补 3 个 H5 页面截图和功能说明。

## 项目叙述建议

这个项目不是我最强的 AI 项目，它更像一个空间服务产品原型。我把住宅设计中的低空物流、阳台服务和社区节点转译成移动端 H5 体验，用来展示空间方案如何变成居民可使用的产品服务。AI 相关部分主要体现在前期低空路线和空间尺度的决策推理，而不是完整 Agent。
