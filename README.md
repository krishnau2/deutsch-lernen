# Deutsch Lernen

A personal study web app built to support a German integration course (A1 → B1) following the **Schritte Plus Neu** textbook (Hueber Verlag).

**Core problem:** Verb conjugations and noun articles are hard to memorize and tedious to look up from handwritten notes. This app provides a fast, visually structured reference — with color-coded endings, vowel changes, and article genders — right in the browser.

---

## Features

- **Verb conjugation browser** — search and filter verbs by category; view all 6 persons in a table or card layout
- **Color-coded endings** — regular inflection suffixes, irregular vowel changes, and trennbar prefixes are each highlighted in a distinct color
- **Noun article reference** — noun grid with article color-coding (der / die / das)
- **Trennbar verb support** — separable prefix shown split from the stem with its own color and a usage example
- **Static, offline-ready** — no backend, no API calls; data lives entirely in JSON files

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build tool | Vite 8 |
| Routing | react-router-dom v7 |
| Icons | @tabler/icons-react |
| Fonts | Google Sans, Roboto (Google Fonts) |
| Styling | Plain CSS with custom properties (no CSS framework) |
| Data | Static JSON files — no backend, no API |

---

## Project Structure

```
src/
├── App.tsx                    # BrowserRouter shell, route definitions
├── main.tsx                   # React root mount
├── index.css                  # All styles — single flat file with design tokens
│
├── types/
│   └── index.ts               # All shared TypeScript interfaces
│
├── data/
│   ├── verbs.json             # Verb data with conjugations + highlight indices
│   └── nouns.json             # Noun data with articles, plurals, categories
│
├── components/
│   ├── Sidebar.tsx            # Left nav — switches context based on active route
│   ├── ConjugationTable.tsx   # Table view of one verb's 6 conjugation rows
│   ├── ConjugationCards.tsx   # Card grid view of one verb's 6 conjugations
│   └── ColoredForm.tsx        # Core rendering primitive — applies color spans
│
└── pages/
    ├── ConjugationPage.tsx    # "/" — search, tabs, verb header, table/card toggle
    └── ArticlesPage.tsx       # "/articles" — noun grid with article color-coding
```

---

## Color & Design Guide

All colors are CSS custom properties in `src/index.css`.

### Brand / Accent

| Variable | Hex | Usage |
|---|---|---|
| `--accent` | `#0F9D8E` | Teal-green — active nav, focused inputs, trennbar prefix |
| `--accent-dark` | `#0A7A6E` | Darker teal — active text, hover states |
| `--accent-light` | `#E6F4F1` | Very light teal — active nav background, trennbar tip box |

### Conjugation Highlight Colors

These are the core teaching colors applied character-by-character inside `ColoredForm`.

| CSS variable | Hex | CSS class | Meaning |
|---|---|---|---|
| `--color-vowel` | `#C0360C` | `.vc` | Vowel change — orange-red; irregular du/er forms |
| `--color-ending` | `#0277BD` | `.re` | Regular ending — teal-blue; inflection suffix (-e, -st, -t, -en) |
| `--color-trennbar` | `#0F9D8E` | `.ts` | Trennbar split — teal; the separable prefix and `/` separator |

### Verb Type Pill Colors

| Type | Background | Text |
|---|---|---|
| `irregular` | `#FDE9E3` | `#8B2607` |
| `regular` | `#E6F4EA` | `#1E7E3E` |
| `trennbar` | `#E3F2FD` | `#01579B` |

### Article / Gender Colors (Noun Page)

| Article | Background | Text |
|---|---|---|
| `der` (masculine) | `#E8F0FE` | `#1558D6` |
| `die` (feminine) | `#FCE8E6` | `#B31412` |
| `das` (neuter) | `#E6F4EA` | `#1E8E3E` |

### Irregular Row Highlight

`--irr-row-bg: #F5F5F5` — light grey background on table rows / left border on cards where the verb has an actual vowel change (`irregularMarks` is non-empty for that person). Regular endings alone do **not** trigger this highlight.

---

## How Highlighting Works

`ColoredForm` in `src/components/ColoredForm.tsx` takes three data props derived from the JSON:

| Prop | Source |
|---|---|
| `vowelChanges` | `verb.irregularMarks?.[person]` — 0-based char indices |
| `endingIndices` | `verb.endingIndices?.[person]` — 0-based char indices |
| `isTrennbar` | `verb.type === 'trennbar'` |

Rendering logic:

1. **Trennbar** — splits the form on `/`, renders prefix + `/` in `.ts` (teal), then maps remaining characters applying `.re` from `endingIndices`. Indices are absolute into the full `prefix/stem` string including the `/`.
2. **Regular / Irregular** — maps every character: `.vc` if its index is in `vowelChanges`, `.re` if in `endingIndices`, plain otherwise.

---

## Local Setup

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone <repo-url>
cd deutsch-lernen

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Other commands

```bash
npm run build     # Type-check and produce a production build in dist/
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint
```

---

## Adding Data

All content lives in two JSON files — no backend or build step needed.

**New verb** → edit `src/data/verbs.json`. Follow the shape documented in `CLAUDE.md`. Key points:
- `id` must be an ASCII-only lowercase slug (use `oe` for ö, `ue` for ü, etc.)
- Trennbar forms use `/` as the prefix separator: `"an/rufe"`
- `irregularMarks` and `endingIndices` hold 0-based character indices into the conjugated form string

**New noun** → edit `src/data/nouns.json` with `id`, `german`, `english`, `article`, `plural`, and `category`.

---

## Scope & Roadmap

**Current scope (A1.1):**
- Verb conjugation browser
- Noun article reference

**Planned (as course levels progress):**
- More verbs and nouns added per level
- Possible new sections: grammar rules, sentence structure, case system
