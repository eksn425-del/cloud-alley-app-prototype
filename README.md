# Cloud Alley App Prototype

Mobile-first H5 service prototype for the Cloud Alley residential design project.

## 中文项目简介

**Cloud Alley App Prototype** 是一个面向低空智慧社区场景的移动端 H5 产品原型。它把住宅设计中的低空物流、阳台服务、社区节点和居民服务体验，转译成可交互的前端 Demo。

这个项目不应过度包装成完整 AI 产品。它更适合表达为：**空间设计方案如何转化为用户可感知的服务产品原型**。AI 相关价值主要体现在前期低空路线、建筑间距、阳台尺度和社区服务效率之间的辅助决策逻辑。

**项目关键词：** H5 原型、低空智慧社区、空间服务产品、React / TypeScript、AI-assisted decision logic。

This public-clean repository shows the interactive app layer of a residential architecture project. The full architecture archive, raw design files, course materials, database experiments, and private deployment files are not included.

## Product Positioning

Cloud Alley is best framed as a **low-altitude smart community app prototype**, with an AI-assisted spatial decision concept behind the design. It should not be overstated as a complete AI product. The current public release mainly demonstrates the H5 interaction layer, while the AI-related value sits in the design decision logic:

```text
drone route feasibility + building spacing + balcony projection depth + masterplan layout
-> AI-assisted trade-off discussion
-> risk / comfort / service-efficiency judgment
-> app scenario and spatial strategy update
```

In other words, AI helped evaluate relationships among low-altitude delivery, residential facade strategy, balcony depth, and site planning. The public app shows how those decisions can become a user-facing community service experience.

## What It Is

Cloud Alley App Prototype is a React + TypeScript + Vite front-end demo for a residential design proposal. It translates part of the architectural concept into a mobile service experience for presentation, scanning, and review.

The app currently runs in local demo mode:

- no backend
- no database
- no Supabase configuration
- no private environment variables
- demo state stored in browser `localStorage`

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- localStorage data persistence
- mobile-first H5 prototype structure

## Project Context

The original Cloud Alley project includes residential design drawings, boards, images, and raw modeling assets. This repository only publishes the safe app prototype layer.

Use this repo as a code and interaction sample. Use a separate portfolio PDF for the architectural boards and design narrative.

## AI-assisted Decision Logic

The AI-related layer should be described as a design-support workflow:

- Drone routes need enough clearance, safe takeoff / landing logic, and reasonable service coverage.
- Building spacing affects flight corridor risk, privacy, daylight, wind, and delivery efficiency.
- Balcony projection depth affects facade use, wind pressure, planting, privacy, and UAV passing distance.
- Masterplan layout coordinates community nodes, vertical logistics points, shared spaces, and pedestrian comfort.

AI is used as a reasoning partner to compare these factors and help refine product scenarios. The app prototype then expresses those scenarios through delivery tracking, balcony status, community service, and resident-facing controls.

## Product Documents

- [AI product flow diagram](docs/AI_PRODUCT_FLOW_DIAGRAM.md)
- [Product flow](docs/PRODUCT_FLOW.md)
- [Low-altitude decision module](docs/LOW_ALTITUDE_DECISION_MODULE.md)
- [Drone route constraints](docs/DRONE_ROUTE_CONSTRAINTS.md)
- [Risk score demo](docs/RISK_SCORE_DEMO.md)
- [中文产品定位说明](docs/PRODUCT_POSITIONING_CN.md)
- [Interview talking points](docs/INTERVIEW_TALKING_POINTS.md)

## Quick Start

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Repository Map

- `src/App.tsx` - main app interface
- `src/data/localRepository.ts` - localStorage data adapter
- `src/data/defaultSnapshot.ts` - default demo data
- `src/mock/` - mock data for presentation
- `src/assets/` - public-safe app images

## Privacy Notes

This repository intentionally excludes:

- `.env`
- Supabase/database files
- raw CAD/SKP/PSD/INDD files
- course/private documents
- build outputs
- dependency folders
- deployment ZIP files

This is a public-clean prototype, not the full private project archive.

## Status

v0.1 public-clean prototype.

Next visual improvements:

- add selected app screenshots
- add a short interaction demo GIF
- add a portfolio link when the architecture PDF is ready
