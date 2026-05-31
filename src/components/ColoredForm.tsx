interface FormProps {
  form: string;
  vowelChanges?: number[];   // character indices with vowel changes (irregular verbs)
  endingIndices?: number[];  // character indices for regular endings (all verb types)
  isTrennbar?: boolean;
}

/**
 * Renders a conjugation form string, applying color spans:
 *  - vowel changes  → .vc (orange-red)
 *  - regular endings → .re (teal-blue)
 *  - trennbar "/"   → .ts (teal-green, bold)
 */
export function ColoredForm({ form, vowelChanges, endingIndices, isTrennbar }: FormProps) {
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
          {endingIndices
            ? rest.split('').map((ch, i) => {
                const absIdx = restStart + i;
                if (endingIndices.includes(absIdx)) return <span key={i} className="re">{ch}</span>;
                return <span key={i}>{ch}</span>;
              })
            : rest}
        </span>
      );
    }
  }

  if (!vowelChanges && !endingIndices) return <span>{form}</span>;

  return (
    <span>
      {form.split('').map((ch, i) => {
        if (vowelChanges?.includes(i))  return <span key={i} className="vc">{ch}</span>;
        if (endingIndices?.includes(i)) return <span key={i} className="re">{ch}</span>;
        return <span key={i}>{ch}</span>;
      })}
    </span>
  );
}

/**
 * Same logic applied inside an example sentence.
 * Finds the conjugated form in the sentence and colors it.
 */
export function ColoredExample({
  example,
  form,
  vowelChanges,
  endingIndices,
  isTrennbar,
}: {
  example: string;
  form: string;
  vowelChanges?: number[];
  endingIndices?: number[];
  isTrennbar?: boolean;
}) {
  if (isTrennbar) return <span>{example}</span>;
  if (!vowelChanges && !endingIndices) return <span>{example}</span>;

  const lowerEx   = example.toLowerCase();
  const lowerForm = form.toLowerCase();
  const idx = lowerEx.indexOf(lowerForm);
  if (idx === -1) return <span>{example}</span>;

  const before  = example.slice(0, idx);
  const matched = example.slice(idx, idx + form.length);
  const after   = example.slice(idx + form.length);

  return (
    <span>
      {before}
      {matched.split('').map((ch, i) => {
        if (vowelChanges?.includes(i))  return <span key={i} className="vc">{ch}</span>;
        if (endingIndices?.includes(i)) return <span key={i} className="re">{ch}</span>;
        return <span key={i}>{ch}</span>;
      })}
      {after}
    </span>
  );
}