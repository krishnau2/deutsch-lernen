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

export default function ConjugationCards({ verb }: Props) {
  const { conjugations, irregularMarks, type } = verb;
  const isTrennbar = type === 'trennbar';

  return (
    <div className="conj-cards-grid">
      {SUBJECTS.map(({ key, label }) => {
        const conj  = conjugations[key as SubjectKey];
        const mark  = irregularMarks?.[key as SubjectKey];
        const isIrr = !!mark && mark.vowelChangeIndices.length > 0;

        return (
          <div key={key} className={`conj-card ${isIrr ? 'irr-card' : ''}`}>
            <div className="card-subject">{label}</div>
            <div className="card-form">
              <ColoredForm form={conj.form} mark={mark} isTrennbar={isTrennbar} />
            </div>
            <div className="card-example">
              <ColoredExample
                example={conj.example}
                form={conj.form}
                mark={mark}
                isTrennbar={isTrennbar}
              />
              <span className="card-eng">{conj.translation}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
