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

// For irregular verbs: which characters changed and where
export interface IrregularMark {
  // indices (0-based) of characters in the form string that are vowel changes
  vowelChangeIndices: number[];
  // indices of characters that are regular endings
  endingIndices: number[];
}

export interface IrregularMarks {
  du?: IrregularMark;
  er?: IrregularMark;
  wir?: IrregularMark;
  ihr?: IrregularMark;
  sie?: IrregularMark;
  ich?: IrregularMark;
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
  irregularMarks?: IrregularMarks;   // only for irregular
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
