import { useState, useEffect, useMemo } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import { SpeakingExercise } from './SpeakingExercise';
import '@/styles/LingoArabExercise.css';

export type ExerciseType = 'mcq' | 'fill_blank' | 'reorder' | 'listening' | 'translation' | 'matching' | 'speaking';

interface MatchingPair {
  english: string;
  arabic: string;
}

interface ExerciseData {
  options?: string[];
  correct?: number;
  answer?: string;
  alternatives?: string[];
  words?: string[];
  correct_order?: number[];
  hint_ar?: string;
  hint_en?: string;
  pairs?: MatchingPair[];
}

interface ExerciseRendererProps {
  type: ExerciseType;
  promptAr: string;
  promptEn?: string;
  data: ExerciseData;
  onAnswer: (isCorrect: boolean, hintPenalty?: number) => void;
  disabled?: boolean;
}

/* ---------- Inline icons (no extra deps) ---------- */
const SpeakerSvg = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

const SpeakerButton = ({ text, disabled }: { text: string; disabled?: boolean }) => {
  const { speak, isSupported } = useSpeech();
  return (
    <button
      type="button"
      className="la-speaker-icon"
      aria-label="Listen"
      onClick={() => isSupported && text && speak(text.trim())}
      disabled={disabled || !isSupported}
    >
      <SpeakerSvg />
    </button>
  );
};

export const ExerciseRenderer = ({
  type,
  promptAr,
  promptEn,
  data,
  onAnswer,
  disabled = false,
}: ExerciseRendererProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [reorderedWords, setReorderedWords] = useState<number[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [showOriginalHint, setShowOriginalHint] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState<Record<number, number>>({});
  const [selectedEnglish, setSelectedEnglish] = useState<number | null>(null);

  // Stable shuffle of arabic column for matching exercises
  const shuffledArabicIndexes = useMemo(() => {
    const len = data.pairs?.length || 0;
    const arr = Array.from({ length: len }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.pairs?.length]);

  useEffect(() => {
    return () => {};
  }, []);

  const normalizeAnswer = (text: string): string =>
    text.trim().toLowerCase().replace(/[.?!,،؟]+$/g, '').trim();

  const checkAnswer = () => {
    let correct = false;

    switch (type) {
      case 'mcq':
        correct = selectedOption === data.correct;
        break;
      case 'fill_blank':
      case 'translation': {
        const userAnswer = normalizeAnswer(textAnswer);
        const correctAnswer = normalizeAnswer(data.answer || '');
        const alternatives = data.alternatives?.map((a) => normalizeAnswer(a)) || [];
        correct = userAnswer === correctAnswer || alternatives.includes(userAnswer);
        break;
      }
      case 'reorder':
        correct = JSON.stringify(reorderedWords) === JSON.stringify(data.correct_order);
        break;
      case 'listening':
        correct = normalizeAnswer(textAnswer) === normalizeAnswer(data.answer || '');
        break;
      case 'matching': {
        const pairs = data.pairs || [];
        correct =
          Object.keys(matchedPairs).length === pairs.length &&
          Object.entries(matchedPairs).every(([eng, arb]) => parseInt(eng) === arb);
        break;
      }
    }

    setAnswered(true);
    setIsCorrect(correct);
    setTimeout(() => onAnswer(correct, 0), 1500);
  };

  const handleWordClick = (index: number) => {
    if (answered || disabled) return;
    if (reorderedWords.includes(index)) {
      setReorderedWords(reorderedWords.filter((i) => i !== index));
    } else {
      setReorderedWords([...reorderedWords, index]);
    }
  };

  const handleMatchClick = (isEnglish: boolean, index: number) => {
    if (answered || disabled) return;
    if (isEnglish) {
      setSelectedEnglish(index);
    } else if (selectedEnglish !== null) {
      setMatchedPairs((prev) => ({ ...prev, [selectedEnglish]: index }));
      setSelectedEnglish(null);
    }
  };

  const canSubmit = () => {
    switch (type) {
      case 'mcq':
        return selectedOption !== null;
      case 'fill_blank':
      case 'translation':
      case 'listening':
        return textAnswer.trim().length > 0;
      case 'reorder':
        return reorderedWords.length === (data.words?.length || 0);
      case 'matching':
        return Object.keys(matchedPairs).length === (data.pairs?.length || 0);
      default:
        return false;
    }
  };

  /* -------- Renderers per type -------- */
  const renderMCQ = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.options?.map((option, index) => {
        let cls = 'la-option-btn';
        if (answered) {
          if (index === data.correct) cls += ' correct';
          else if (selectedOption === index) cls += ' wrong';
        } else if (selectedOption === index) cls += ' selected';
        return (
          <button
            key={index}
            type="button"
            className={cls}
            dir="ltr"
            onClick={() => !answered && !disabled && setSelectedOption(index)}
            disabled={answered || disabled}
          >
            <span style={{ flex: 1, textAlign: 'left' }}>{option}</span>
          </button>
        );
      })}
    </div>
  );

  const renderTextInput = (placeholder: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="text"
        value={textAnswer}
        onChange={(e) => setTextAnswer(e.target.value)}
        placeholder={placeholder}
        className={`la-input ${answered ? (isCorrect ? 'correct' : 'wrong') : ''}`}
        disabled={answered || disabled}
        dir="ltr"
      />
      {answered && (
        <div className={`la-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? (
            <span>✓ ممتاز!</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>✕ إجابة خاطئة</span>
              <span style={{ direction: 'ltr', opacity: 0.85, textDecoration: 'line-through' }}>{textAnswer}</span>
              <span style={{ direction: 'ltr', color: 'var(--la-neon-green)' }}>
                الصحيح: {data.answer}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderReorder = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="la-dropzone" dir="ltr">
        {reorderedWords.length === 0 ? (
          <span style={{ color: 'var(--la-gray)' }}>اضغط على الكلمات لترتيبها</span>
        ) : (
          reorderedWords.map((wordIndex, i) => (
            <button
              key={i}
              type="button"
              className="la-chip"
              onClick={() => handleWordClick(wordIndex)}
              disabled={answered || disabled}
            >
              {data.words?.[wordIndex]}
            </button>
          ))
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }} dir="ltr">
        {data.words?.map((word, index) => (
          <button
            key={index}
            type="button"
            className={`la-chip ${reorderedWords.includes(index) ? 'used' : ''}`}
            onClick={() => handleWordClick(index)}
            disabled={answered || disabled || reorderedWords.includes(index)}
          >
            {word}
          </button>
        ))}
      </div>

      {answered && (
        <div className={`la-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? (
            <span>✓ ترتيب صحيح!</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>✕ ترتيب خاطئ</span>
              <span style={{ direction: 'ltr', color: 'var(--la-neon-green)' }}>
                الصحيح: {data.answer}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderListening = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        type="button"
        className="la-option-btn"
        style={{ justifyContent: 'center', fontSize: 18 }}
        onClick={() => data.answer && new SpeechSynthesisUtterance && window.speechSynthesis?.speak(new SpeechSynthesisUtterance(data.answer))}
        disabled={answered || disabled}
      >
        🔊 استمع
      </button>
      {renderTextInput('اكتب ما سمعته...')}
    </div>
  );

  const renderMatching = () => {
    const pairs = data.pairs || [];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--la-gray)' }}>English</p>
            {pairs.map((pair, index) => {
              const isMatched = matchedPairs[index] !== undefined;
              const isSelected = selectedEnglish === index;
              let cls = 'la-option-btn';
              if (isMatched) cls += ' correct';
              else if (isSelected) cls += ' selected';
              return (
                <button
                  key={index}
                  type="button"
                  className={cls}
                  dir="ltr"
                  onClick={() => handleMatchClick(true, index)}
                  disabled={answered || disabled || isMatched}
                  style={{ opacity: isMatched ? 0.6 : 1 }}
                >
                  {pair.english}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--la-gray)', textAlign: 'right' }}>العربية</p>
            {shuffledArabicIndexes.map((origIdx) => {
              const isMatched = Object.values(matchedPairs).includes(origIdx);
              const cls = `la-option-btn ${isMatched ? 'correct' : ''}`;
              return (
                <button
                  key={origIdx}
                  type="button"
                  className={cls}
                  onClick={() => handleMatchClick(false, origIdx)}
                  disabled={answered || disabled || isMatched || selectedEnglish === null}
                  style={{ opacity: isMatched ? 0.6 : 1, justifyContent: 'flex-end' }}
                >
                  {pairs[origIdx]?.arabic}
                </button>
              );
            })}
          </div>
        </div>

        {answered && (
          <div className={`la-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? '✓ ممتاز!' : '✕ حاول مرة أخرى'}
          </div>
        )}
      </div>
    );
  };

  const renderExercise = () => {
    switch (type) {
      case 'mcq':
        return renderMCQ();
      case 'fill_blank':
        return renderTextInput('اكتب الإجابة هنا...');
      case 'translation':
        return renderTextInput('اكتب الترجمة هنا...');
      case 'reorder':
        return renderReorder();
      case 'listening':
        return renderListening();
      case 'matching':
        return renderMatching();
      case 'speaking':
        return (
          <SpeakingExercise
            target={data.answer || ''}
            disabled={disabled}
            onAnswer={(ok) => {
              setAnswered(true);
              setIsCorrect(ok);
              setTimeout(() => onAnswer(ok, 0), 100);
            }}
          />
        );
      default:
        return <p style={{ color: 'var(--la-gray)' }}>نوع السؤال غير مدعوم</p>;
    }
  };

  /* -------- Prompt with LTR isolation -------- */
  const renderPromptWithLTR = (text: string) => {
    const hintPattern = /^(.+?)\s*\(([^\x00-\x7F]+)\)\s*$/;
    const hintMatch = text.match(hintPattern);
    if (hintMatch) {
      return (
        <>
          <bdi dir="ltr" style={{ unicodeBidi: 'isolate', display: 'inline' }}>
            {hintMatch[1].trim()}
          </bdi>
          <span style={{ color: 'var(--la-gray)', marginInlineStart: 8 }}>({hintMatch[2]})</span>
        </>
      );
    }
    const prefixPattern = /^([\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s:]+)\s*(.+)$/;
    const prefixMatch = text.match(prefixPattern);
    if (prefixMatch && /[A-Za-z_]/.test(prefixMatch[2])) {
      return (
        <>
          <span>{prefixMatch[1]}</span>
          <bdi dir="ltr" style={{ unicodeBidi: 'isolate', display: 'inline' }}>
            {prefixMatch[2]}
          </bdi>
        </>
      );
    }
    if (/[A-Za-z]/.test(text) && /_{2,}/.test(text)) {
      return (
        <bdi dir="ltr" style={{ unicodeBidi: 'isolate', display: 'inline' }}>
          {text}
        </bdi>
      );
    }
    return text;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Prompt as glowing flashcard */}
      <div className="la-flashcard la-flashcard-center">
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--la-white)', margin: 0 }}>
          {renderPromptWithLTR(promptAr)}
        </h2>
        {promptEn && (
          <div className="la-example-box" style={{ marginTop: 14 }}>
            <div className="la-example-en-row">
              <SpeakerButton text={promptEn} disabled={disabled} />
              <span className="la-example-en">{promptEn}</span>
            </div>
          </div>
        )}
      </div>

      {/* Exercise */}
      {renderExercise()}

      {/* Hints */}
      {!answered && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(type === 'fill_blank' || type === 'translation' || type === 'listening') && data.answer && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {hintLevel < 1 && (
                <button type="button" className="la-chip" onClick={() => setHintLevel(1)}>
                  # عدد الكلمات
                </button>
              )}
              {hintLevel >= 1 && hintLevel < 2 && (
                <button type="button" className="la-chip" onClick={() => setHintLevel(2)}>
                  Aa الحرف الأول
                </button>
              )}
              {hintLevel >= 2 && hintLevel < 3 && (
                <button type="button" className="la-chip" onClick={() => setHintLevel(3)}>
                  👁 كشف المزيد
                </button>
              )}
            </div>
          )}

          {hintLevel > 0 && data.answer && (
            <div className="la-hint-card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {hintLevel >= 1 && (
                <span>
                  عدد الكلمات: <strong>{data.answer.trim().split(/\s+/).length}</strong>
                </span>
              )}
              {hintLevel >= 2 && (
                <span>
                  يبدأ بـ:{' '}
                  <strong style={{ direction: 'ltr', display: 'inline-block', fontFamily: 'monospace' }}>
                    {data.answer.charAt(0).toUpperCase()}...
                  </strong>
                </span>
              )}
              {hintLevel >= 3 && (
                <span>
                  التلميح:{' '}
                  <strong style={{ direction: 'ltr', display: 'inline-block', fontFamily: 'monospace' }}>
                    {data.answer.split('').map((c, i) => (i < 3 || c === ' ' ? c : '_')).join('')}
                  </strong>
                </span>
              )}
            </div>
          )}

          {(data.hint_ar || data.hint_en) && (
            <div style={{ textAlign: 'center' }}>
              {showOriginalHint ? (
                <div className="la-hint-card">
                  💡 <span>{data.hint_ar}</span>
                  {data.hint_en && (
                    <span style={{ color: 'var(--la-gray)', marginInlineStart: 8, direction: 'ltr' }}>
                      ({data.hint_en})
                    </span>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="la-chip"
                  onClick={() => setShowOriginalHint(true)}
                >
                  💡 تلميح إضافي
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit / Next button — not for speaking (it auto-advances) */}
      {!answered && type !== 'speaking' && (
        <div className="la-next-btn-wrapper">
          <button
            type="button"
            className="la-next-btn"
            onClick={checkAnswer}
            disabled={!canSubmit() || disabled}
          >
            <span>تحقق</span>
          </button>
        </div>
      )}
    </div>
  );
};
