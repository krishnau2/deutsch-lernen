import type { IrregularMark } from '../types';

interface FormPartProps {
  form: string;
  mark?: IrregularMark;
  isTrennbar?: boolean;
}

/**
 * Renders a conjugation form string, applying color spans:
 *  - vowel changes  → .vc (orange-red)
 *  - regular endings → .re (teal-blue)
 *  - trennbar "/"   → .ts (teal-green, bold)
 */
export function ColoredForm({ form, mark, isTrennbar }: FormPartProps) {
  // Handle trennbar: split on "/" and style the slash + optional ending marks
  if (isTrennbar) {
    const slashIdx = form.indexOf('/');
    if (slashIdx !== -1) {
      const prefix    = form.slice(0, slashIdx);
      const rest      = form.slice(slashIdx + 1);
      const restStart = slashIdx + 1;
      return (
        <span>
          <span className="ts">{prefix}</span>
          <span className="ts">/</span>
          {mark
            ? rest.split('').map((ch, i) => {
                const absIdx = restStart + i;
                if (mark.endingIndices.includes(absIdx)) return <span key={i} className="re">{ch}</span>;
                return <span key={i}>{ch}</span>;
              })
            : rest}
        </span>
      );
    }
  }

  if (!mark) return <span>{form}</span>;

  const { vowelChangeIndices, endingIndices } = mark;
  const chars = form.split('');

  return (
    <span>
      {chars.map((ch, i) => {
        if (vowelChangeIndices.includes(i)) return <span key={i} className="vc">{ch}</span>;
        if (endingIndices.includes(i))      return <span key={i} className="re">{ch}</span>;
        return <span key={i}>{ch}</span>;
      })}
    </span>
  );
}

/**
 * Same logic applied inside an example sentence.
 * We find the conjugated form inside the sentence and color it.
 */
export function ColoredExample({
  example,
  form,
  mark,
  isTrennbar,
}: {
  example: string;
  form: string;
  mark?: IrregularMark;
  isTrennbar?: boolean;
}) {
  // For trennbar, just return plain example (prefix is at end)
  if (isTrennbar) return <span>{example}</span>;
  if (!mark) return <span>{example}</span>;

  // Find the conjugated form (case-insensitive) in the example sentence
  const lowerEx   = example.toLowerCase();
  const lowerForm = form.toLowerCase();
  const idx = lowerEx.indexOf(lowerForm);
  if (idx === -1) return <span>{example}</span>;

  const before  = example.slice(0, idx);
  const matched = example.slice(idx, idx + form.length);
  const after   = example.slice(idx + form.length);

  const chars = matched.split('');
  const { vowelChangeIndices, endingIndices } = mark;

  return (
    <span>
      {before}
      {chars.map((ch, i) => {
        if (vowelChangeIndices.includes(i)) return <span key={i} className="vc">{ch}</span>;
        if (endingIndices.includes(i))      return <span key={i} className="re">{ch}</span>;
        return <span key={i}>{ch}</span>;
      })}
      {after}
    </span>
  );
}
