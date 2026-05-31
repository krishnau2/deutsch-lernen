import type { Verb } from '../types';
import { ColoredForm, ColoredExample } from './ColoredForm';

const SUBJECTS = [
  { key: 'ich',  label: 'ich' },
  { key: 'du',   label: 'du' },
  { key: 'er',   label: 'er / sie / es' },
  { key: 'wir',  label: 'wir' },
  { key: 'ihr',  label: 'ihr' },
  { key: 'sie',  label: 'sie / Sie' },
] as const;

type SubjectKey = typeof SUBJECTS[number]['key'];

interface Props { verb: Verb; }

export default function ConjugationTable({ verb }: Props) {
  const { conjugations, irregularMarks, type } = verb;
  const isTrennbar = type === 'trennbar';

  return (
    <div className="conj-table-wrap">
      <table className="conj-table">
        <thead>
          <tr>
            <th style={{ width: 130 }}>Subject</th>
            <th style={{ width: 170 }}>Form</th>
            <th>Example sentence</th>
          </tr>
        </thead>
        <tbody>
          {SUBJECTS.map(({ key, label }) => {
            const conj   = conjugations[key as SubjectKey];
            const mark   = irregularMarks?.[key as SubjectKey];
            const isIrr  = !!mark && mark.vowelChangeIndices.length > 0;

            return (
              <tr key={key} className={isIrr ? 'irr-row' : ''}>
                <td className="subject-cell">
                  {isIrr && <span className="irr-dot" style={{ marginRight: 6 }} />}
                  {label}
                </td>
                <td className="form-cell">
                  <ColoredForm form={conj.form} mark={mark} isTrennbar={isTrennbar} />
                </td>
                <td className="example-cell">
                  <ColoredExample
                    example={conj.example}
                    form={conj.form}
                    mark={mark}
                    isTrennbar={isTrennbar}
                  />
                  <span className="example-eng"> — {conj.translation}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
