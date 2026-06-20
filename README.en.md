<p align="center">
  <img src="public/favicon.png" width="80" alt="Logo" />
</p>

<h1 align="center">MD2PPT</h1>
<p align="center">Markdown → Horizontal Swipe Web Slides</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" />
</p>

---

## What is MD2PPT

**MD2PPT** turns Markdown into swipeable web-based presentation slides. Write MD, preview in browser, double-click to open the built output.

**Core feature**: Built-in `/md2ppt` AI skill — paste your speech script, AI distills key points and generates layout-tagged PPT slides. Slides are visual anchors, not teleprompters.

## AI-Generated PPT (Recommended)

```
Your speech → AI (/md2ppt) → tagged MD → live preview
```

### Step 1: Write a speech script

Plain Markdown, no layout tags needed:

```markdown
# My Talk Title

## Opening

Hello everyone, today I'll cover...

## Key Metrics

80% user growth, revenue doubled...
```

### Step 2: AI generates slides

Type `/md2ppt` in Claude Code and paste your script. The AI:

- 🔍 Analyzes content structure
- ✂️ **Distills**: long sentences → short phrases, paragraphs → keywords
- 🏷️ Adds `{layout: xxx}` tags
- 📝 Outputs `xxx-ppt.md`

### Step 3: Preview

```bash
npm run dev
```

Open `http://localhost:5173`, use arrow keys to navigate.

## Quick Start

```bash
npm install
npm run dev        # dev → http://localhost:5173
npm run build      # build to dist/
npm run preview    # preview build output
```

## Distributable Output

### Option A: Continue editing → Use BAT launcher

**Double-click `dist/start.bat`** (zero-dependency PowerShell server)

```
dist/
├── start.bat           ← double-click to launch
├── slides-ppt.md       ← edit this file
└── assets/
    ├── index.html
    ├── serve.ps1
    └── favicon.png
```

### Option B: Content finalized → HTML only

The HTML file embeds the MD content at build time. **No server, no MD file needed**.

Double-click `index.html` to present fullscreen.

## Configuration

Edit `.env`:

```env
VITE_MD_FILE_PATH=md/slides-ppt.md
VITE_ASSETS_PATH=md/assets
```

## Slide Splitting

| Trigger | Effect |
|---------|--------|
| `#` / `##` / `###` / `####` headings | Each heading becomes a slide |
| `---` horizontal rule | **Global page break** |
| `<video>` / `<img>` tags | Extracted as full-screen slide |
| ` ``` ` code blocks | Protected from splitting |

## Layout Types (11)

| Layout | Use case |
|--------|----------|
| `cover` | Title / ending slide |
| `section` | Chapter transition |
| `content` | Standard content |
| `two-column` | Side-by-side columns (`**bold**` marks column titles) |
| `stats` | Big number showcase |
| `quote` | Block quote |
| `code-full` | Code display |
| `media-hero` | Video / large image |
| `comparison` | A/B comparison (`**bold**` + `- list`) |
| `timeline` | Timeline |
| `list` | Feature list |

## Kit Themes (7 Kits)

Tap to cycle, long-press for popup panel:

| Kit | Style |
|-----|-------|
| **Realtime Beats** | Modern tech, WebGL backgrounds, glassmorphism |
| **Animal Island** | Natural warm, rounded cards |
| **Holo Sci-Fi** | Holographic, neon colors, hexagonal geometry |
| **Pixel Island** | Retro pixel game, Pokémon / Stardew aesthetic |
| **Water Ink** | Chinese ink painting, rice paper texture, vertical text |
| **Cyberpunk 2077** | Cyberpunk, terminal HUD, neon night |
| **Pixel Retro** | 8-bit NES aesthetic, pixel-precise borders |

4 color themes per kit. Add kits: create folder under `src/kits/` → `index.ts` → register in `kits/index.ts`.

### Kit Preview

| Animal Island | Realtime Beats | Holo Sci-Fi |
|:---:|:---:|:---:|
| ![Animal Island](docs/animal-island.png) | ![Beats](docs/beats.png) | ![Holo](docs/holo.png) |
| Natural Warm | Modern Tech | Holographic Sci-Fi |

## Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` Space PageUp/Down | Navigate |
| Home / End | First / last slide |
| Tab | Slide overview |
| F | Toggle fullscreen |
| Number keys | Jump to slide |
| P | Auto-play |
| K / T / A / S | Kit / Theme / Transition / Scale |
| Mouse wheel / touch swipe | Navigate |

## Dock Controls

- Navigation / Fullscreen / Overview / **Auto-play (3s)** / Kit / Theme / Transition / Scale
- Always visible in windowed mode, auto-hide in fullscreen after 3s
- Kit/theme/transition/scale: tap to cycle, **long-press for swipe-select popup**
- 7 transitions: slide / fade / zoom / flip / pixel / reveal / none
- 3 scale levels: 1x / 1.25x / 1.5x

## Tech Stack

- **Vue 3** Composition API `<script setup>` + **TypeScript**
- **Vite** + **Tailwind CSS v4**
- **marked** + **shiki** — MD parsing & Dracula syntax highlighting
- **Custom Vite plugin** — `virtual:slides` + HMR
- **unplugin-auto-import / unplugin-vue-components**
- **vite-plugin-singlefile** — single-file output

---

<p align="center">MIT</p>
