export type VerbType = 'regular' | 'irregular' | 'trennbar';

export interface ConjugationForm {
  form: string;          // e.g. "sprichst"
  example: string;       // German example sentence
  translation: string;   // English translation
}

export interface Conjugations {
  ich: ConjugationForm;
  du: ConjugationForm;
  er: ConjugationForm;
  wir: ConjugationForm;
  ihr: ConjugationForm;
  sie: ConjugationForm;
}

// Per-person vowel-change character indices (irregular verbs only)
export interface IrregularMarks {
  ich?: number[];
  du?: number[];
  er?: number[];
  wir?: number[];
  ihr?: number[];
  sie?: number[];
}

// Per-person regular-ending character indices (all verb types)
export interface EndingIndices {
  ich?: number[];
  du?: number[];
  er?: number[];
  wir?: number[];
  ihr?: number[];
  sie?: number[];
}

// For trennbar verbs: index in form string where the split occurs
export interface TrennbarInfo {
  prefix: string;        // e.g. "an" in "anrufen"
  splitExample: string;  // e.g. "Ich rufe dich an."
  splitTranslation: string;
}

export interface Verb {
  id: string;
  infinitive: string;
  english: string;
  type: VerbType;
  category: string;       // for tab grouping e.g. "common-a1", "modal", "movement"
  conjugations: Conjugations;
  irregularMarks?: IrregularMarks;    // vowel-change indices, irregular verbs only
  endingIndices?: EndingIndices;      // regular ending indices, all verb types
  trennbarInfo?: TrennbarInfo;        // only for trennbar
  stemNote?: string;                  // e.g. "sprech– → sprich (du, er/sie/es)"
}

export type ArticleType = 'der' | 'die' | 'das';

export interface Noun {
  id: string;
  german: string;
  english: string;
  article: ArticleType;
  plural: string;
  category: string;
}

export interface NounCategory {
  id: string;
  label: string;
  icon: string;
}
