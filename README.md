# Cloud Alley App Prototype

Mobile-first H5 service prototype for the Cloud Alley residential design project.

This public-clean repository shows the interactive app layer of a residential architecture project. The full architecture archive, raw design files, course materials, database experiments, and private deployment files are not included.

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

