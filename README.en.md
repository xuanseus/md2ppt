<p align="center">
  <img src="public/favicon.png" width="80" alt="Logo" />
</p>

<h1 align="center">MD2PPT</h1>
<p align="center">Markdown → Horizontal Swipe Web Deck</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" />
</p>

---

## What is this

**MD2PPT** turns Markdown into a horizontal swipe web deck with live preview. Write MD, see the result in browser instantly, and build into a single self-contained HTML file.

**Key feature**: Built-in `/md2ppt` skill — hand your speech script to AI, it auto-generates layout-tagged PPT.

## AI-Powered PPT Generation (Recommended)

```
You (speech script) → AI (/md2ppt) → Tagged MD → Live browser preview
```

### Step 1: Prepare Your Script

Write a plain Markdown speech script with no layout markup:

```markdown
# My Talk Title

## Opening

Hello everyone, today I'd like to share...

## Key Metrics

80% user growth, 2x revenue...

## Architecture

We adopted a microservices approach...
```

### Step 2: AI Auto-Tagging

Type `/md2ppt` in Claude Code and paste your script. The AI will:

- 🔍 Analyze content structure (cover, sections, data, code, comparisons…)
- 🏷️ Add `{layout: xxx}` tags automatically
- 📝 Output `xxx-ppt.md` file

### Step 3: Preview

```bash
# Point .env to the generated file
# Edit .env → VITE_MD_FILE_PATH=../my-speech-ppt.md

npm run dev
```

Open `http://localhost:5173`, navigate with ← → keys.

## Quick Start

```bash
npm install
npm run dev        # Dev server → http://localhost:5173
```

Edit your MD file — the browser reloads automatically.

```bash
npm run build      # Build to dist/
npm run preview    # Preview the build
```

## After Build

Build output is in `dist/`. Choose based on your needs:

### Option 1: Continue editing → Use BAT launcher

**Double-click `dist/start.bat`** (PowerShell zero-dependency local server)

```
dist/
├── start.bat           ← Double-click to launch
├── slides-ppt.md       ← Edit this file
└── assets/
    ├── index.html
    ├── serve.ps1
    └── favicon.png
```

1. Double-click `start.bat` → PowerShell starts local server + opens browser
2. Edit `dist/slides-ppt.md` and save → auto-refresh within 500ms
3. Close terminal → server stops automatically
4. Double-click `start.bat` again → detects running server, just opens browser

> 💡 How it works: the page polls `./slides-ppt.md` every 500ms, re-renders on change.

### Option 2: Content finalized → Keep only HTML

The HTML file has MD content baked in — **no server, no MD file needed**.

- **No images** → just one `index.html` file is enough
- **With images** → `index.html` + image files (keep relative paths)

Double-click `index.html` for fullscreen presentation.

## Configuration

Edit `.env`:

```env
# MD file path (relative to project root)
VITE_MD_FILE_PATH=md/slides-ppt.md

# Assets directory path (relative to project root)
VITE_ASSETS_PATH=md/assets
```

## Slide Splitting Rules

| Trigger | Behavior |
|---------|----------|
| `#` / `##` / `###` / `####` | Each heading becomes its own slide |
| `---` | Slide break |
| `<video>` / `<img>` | Extracted to fullscreen slide |
| ` ``` ` fenced code block | Protected from splitting |

## Layout Types

Add `{layout: xxx}` after a heading to specify layout. 12 types available:

| Layout | Use case |
|--------|----------|
| `cover` | Title / closing slide |
| `section` | Chapter divider |
| `content` | Standard content |
| `two-column` | Side-by-side columns |
| `stats` | Big-number highlight |
| `quote` | Blockquote showcase |
| `code-full` | Code display |
| `image-grid` | Image gallery |
| `media-hero` | Video / hero image |
| `comparison` | Before / after |
| `timeline` | Milestone roadmap |
| `list` | Feature checklist |

Example:

```markdown
### Key Metrics {layout: stats}

**80%**

Year-over-year user growth rate
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` Space PageUp/Down | Navigate slides |
| Home / End | First / last slide |
| ESC | Overview mode |
| F | Fullscreen |
| Number keys | Jump to slide |
| Scroll / touch swipe | Navigate |

## Themes

JSON theme files live in `src/themes/`. To add one: duplicate an existing JSON → tweak colors → register in `index.ts`.

## Tech Stack

- **Vue 3** Composition API `<script setup>`
- **TypeScript** + **Vite 8**
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **marked** + **shiki** — Markdown parsing & syntax highlighting
- **Custom Vite plugin** — `virtual:slides` virtual module + HMR + asset middleware
- **unplugin-auto-import / unplugin-vue-components** — auto-imports
- **vite-plugin-singlefile** — single HTML output

---

<p align="center">MIT</p>
