# Deutsch Lernen — Project Context

## Purpose

A personal study web app built to support a German integration course (A1 → B1) following the **Schritte Plus Neu** textbook (Hueber Verlag). The course book is at `book_reference/shritte-a11.pdf`.

**Core problem being solved:** Verb conjugations and noun articles are hard to memorize and hard to look up from handwritten notes. The app provides a fast, visually structured reference.

**Current scope (A1.1):**
- Verb conjugation browser with color-coded endings and vowel changes
- Noun article reference with gender color-coding

**Planned scope (as levels progress):**
- More verbs and nouns added as each level is covered
- Possibly new feature sections (grammar rules, sentence structure, etc.) in later levels

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

## File Structure

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

### Component hierarchy

```
App
└── AppShell
    ├── Sidebar           (always visible, context-aware)
    └── Routes
        ├── ConjugationPage  "/"
        │   ├── ConjugationTable
        │   │   └── ColoredForm / ColoredExample  (per row)
        │   └── ConjugationCards
        │       └── ColoredForm / ColoredExample  (per card)
        └── ArticlesPage  "/articles"
```

---

## Data — `src/data/verbs.json`

Each entry is a `Verb` object (typed in `src/types/index.ts`).

### Verb shape

```jsonc
{
  "id": "sprechen",           // URL-safe identifier
  "infinitive": "sprechen",   // Display form (may include ä/ö/ü/ß)
  "english": "to speak / to talk",
  "type": "regular" | "irregular" | "trennbar",
  "category": "common-a1",   // Used for tab filtering (see VERB CATEGORIES below)
  "stemNote": "sprech– → sprich (du, er/sie/es)",  // Optional — shown in header

  // Six persons, always present
  "conjugations": {
    "ich": { "form": "spreche",  "example": "Ich spreche Deutsch.", "translation": "I speak German." },
    "du":  { "form": "sprichst", ... },
    "er":  { "form": "spricht",  ... },
    "wir": { "form": "sprechen", ... },
    "ihr": { "form": "sprecht",  ... },
    "sie": { "form": "sprechen", ... }
  },

  // OPTIONAL — only present when there are actual vowel changes (irregular verbs)
  // Value is an array of 0-based character indices in the conjugated form string
  "irregularMarks": {
    "du": [3],    // e.g. "sprichst" — index 3 is 'i' (changed from 'e')
    "er": [3]
  },

  // OPTIONAL — present on all verb types that have meaningful endings to highlight
  // Value is an array of 0-based character indices in the conjugated form string
  // For trennbar verbs the index is into the full "prefix/stem" string (including the '/')
  "endingIndices": {
    "ich": [6],
    "du":  [5, 6],
    "er":  [5],
    "wir": [6, 7],
    "ihr": [6],
    "sie": [6, 7]
  },

  // OPTIONAL — only for trennbar verbs
  "trennbarInfo": {
    "prefix": "an",
    "splitExample": "Ich rufe dich morgen an.",
    "splitTranslation": "I will call you tomorrow."
  }
}
```

### Verb categories (tab filter values)

| `category` value | Tab label |
|---|---|
| `sein-haben` | sein / haben |
| `common-a1` | Common A1 |
| `modal` | Modal verbs |
| `movement` | Movement |
| `daily-life` | Daily life |

### Verb types and what they mean

| `type` | Description |
|---|---|
| `regular` | Stem unchanged across all persons — only `endingIndices` needed |
| `irregular` | Vowel change in du/er (e→i, a→ä, etc.) — has `irregularMarks` for those persons and `endingIndices` for all |
| `trennbar` | Separable prefix verb — form stored as `"prefix/stem"` e.g. `"an/rufe"` |

**Special cases:**
- `sein` — fully irregular, all 6 persons have `irregularMarks` (entire form is a vowel change), no `endingIndices`
- `haben`, `möchten` — irregular type but no vowel-change indices (irregularity is in stem consonant drop / subjunctive base); only `endingIndices` present
- `können` — modal with vowel change on ich/du/er (ö→a), plus `endingIndices` on the remaining persons

---

## Data — `src/data/nouns.json`

```jsonc
{
  "id": "tisch",
  "german": "Tisch",
  "english": "table",
  "article": "der" | "die" | "das",
  "plural": "die Tische",
  "category": "wohnung"   // see NOUN CATEGORIES below
}
```

### Noun categories

| `category` | Sidebar label |
|---|---|
| `obst-gemuese` | Obst & Gemüse |
| `wohnung` | Wohnung |
| `kleidung` | Kleidung |
| `familie` | Familie |
| `berufe` | Berufe |
| `verkehr` | Verkehr |
| `schule` | Schule |

---

## Color System

All colors are CSS custom properties defined at `:root` in `src/index.css`.

### Brand / accent

| Variable | Hex | Usage |
|---|---|---|
| `--accent` | `#0F9D8E` | Teal-green — active nav, focused inputs, trennbar prefix |
| `--accent-dark` | `#0A7A6E` | Darker teal — active text, hover states |
| `--accent-light` | `#E6F4F1` | Very light teal — active nav background, trennbar tip box |

### Conjugation highlight colors (the core teaching colors)

| CSS variable | Hex | CSS class | Meaning |
|---|---|---|---|
| `--color-vowel` | `#C0360C` | `.vc` | Vowel change — orange-red, applied to changed characters in irregular du/er forms |
| `--color-ending` | `#0277BD` | `.re` | Regular ending — teal-blue, applied to the inflection suffix (-e, -st, -t, -en) |
| `--color-trennbar` | `#0F9D8E` | `.ts` | Trennbar split — same teal as accent, applied to the separable prefix and `/` separator |

These classes are applied character-by-character inside `ColoredForm` and `ColoredExample` using the index arrays from `irregularMarks` and `endingIndices`.

### Verb type pill colors

| Type | Background | Text |
|---|---|---|
| `irregular` | `#FDE9E3` | `#8B2607` (dark red) |
| `regular` | `#E6F4EA` | `#1E7E3E` (dark green) |
| `trennbar` | `#E3F2FD` | `#01579B` (dark blue) |

### Article / gender colors (noun page)

| Article | Background | Text |
|---|---|---|
| `der` (masculine) | `#E8F0FE` | `#1558D6` (blue) |
| `die` (feminine) | `#FCE8E6` | `#B31412` (red) |
| `das` (neuter) | `#E6F4EA` | `#1E8E3E` (green) |

### Irregular row highlight

`--irr-row-bg: #F5F5F5` — light grey background on table rows / left border on cards where `irregularMarks` has a non-empty vowel-change array for that person. Regular endings alone do **not** trigger this highlight.

---

## How Highlighting Works — `ColoredForm`

`ColoredForm` (and `ColoredExample`) in `src/components/ColoredForm.tsx` takes three optional data props:

| Prop | Type | Source |
|---|---|---|
| `vowelChanges` | `number[] \| undefined` | `verb.irregularMarks?.[person]` |
| `endingIndices` | `number[] \| undefined` | `verb.endingIndices?.[person]` |
| `isTrennbar` | `boolean` | `verb.type === 'trennbar'` |

Rendering logic:
1. **Trennbar:** splits form on `/`, renders prefix + `/` in `.ts` (teal), then maps remaining characters applying `.re` from `endingIndices` (indices are absolute into the full `prefix/stem` string).
2. **Regular/Irregular:** maps every character — `.vc` if its index is in `vowelChanges`, `.re` if in `endingIndices`, plain otherwise.

The `isIrr` flag (used to apply grey row / left border) is `true` only when `vowelChanges` is non-empty. Regular endings alone never trigger the irregular styling.

---

## Key Conventions

- **JSON ids** use ASCII-only lowercase slugs for German words with umlauts (e.g. `id: "hoeren"` for *hören*, `id: "koennen"` for *können*).
- **Trennbar form strings** always use `/` as the prefix separator: `"auf/stehe"`. Index arrays reference into this full string including the `/` character.
- **`er` person** represents er/sie/es (third-person singular) — always the same form, labeled "er / sie / es" in the UI.
- **`sie` person** represents sie/Sie (third-person plural and formal) — always the same form, labeled "sie / Sie" in the UI.
- All data is **static** — no runtime fetching. Both JSON files are imported directly into their respective page components.
- The app has **no backend**, **no authentication**, and **no build-time data generation**. Adding a new verb means editing `verbs.json` directly.