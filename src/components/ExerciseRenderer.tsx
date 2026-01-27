import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Lightbulb, Volume2, Eye, Hash, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AudioButton } from '@/components/AudioButton';
import { useSpeech } from '@/hooks/useSpeech';

export type ExerciseType = 'mcq' | 'fill_blank' | 'reorder' | 'listening' | 'translation' | 'matching';

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
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

// Listening button component with speech synthesis
const ListeningButton = ({ text, disabled }: { text: string; disabled: boolean }) => {
  const { speak, isSupported, voiceCount } = useSpeech();

  const handleListen = () => {
    const cleanText = (text || '').trim();
    console.log('[ListeningButton] Clicked, text:', cleanText, 'voices:', voiceCount);
    
    if (cleanText) {
      speak(cleanText);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className="w-full h-20"
      onClick={handleListen}
      disabled={disabled || !isSupported}
    >
      <Volume2 className="w-8 h-8 ml-3" />
      <span>{isSupported ? 'استمع' : 'الصوت غير متاح'}</span>
    </Button>
  );
};

export const ExerciseRenderer = ({
  type,
  promptAr,
  promptEn,
  data,
  onAnswer,
  disabled = false
}: ExerciseRendererProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [reorderedWords, setReorderedWords] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0); // 0: none, 1: basic, 2: first letter, 3: word count
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState<Record<number, number>>({});
  const [selectedEnglish, setSelectedEnglish] = useState<number | null>(null);

  // Reset state only when the component is truly remounted via key change
  // We no longer use dependencies that change on every render
  useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, []);

  // Helper function to normalize text by removing trailing punctuation
  const normalizeAnswer = (text: string): string => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[.?!,،؟]+$/g, '') // Remove trailing punctuation (English & Arabic)
      .trim();
  };

  const checkAnswer = () => {
    let correct = false;

    switch (type) {
      case 'mcq':
        correct = selectedOption === data.correct;
        break;
      case 'fill_blank':
      case 'translation':
        const userAnswer = normalizeAnswer(textAnswer);
        const correctAnswer = normalizeAnswer(data.answer || '');
        const alternatives = data.alternatives?.map(a => normalizeAnswer(a)) || [];
        correct = userAnswer === correctAnswer || alternatives.includes(userAnswer);
        break;
      case 'reorder':
        correct = JSON.stringify(reorderedWords) === JSON.stringify(data.correct_order);
        break;
      case 'listening':
        correct = normalizeAnswer(textAnswer) === normalizeAnswer(data.answer || '');
        break;
      case 'matching':
        // Check if all pairs are correctly matched
        const pairs = data.pairs || [];
        correct = Object.keys(matchedPairs).length === pairs.length &&
          Object.entries(matchedPairs).every(([eng, arb]) => parseInt(eng) === arb);
        break;
    }

    setAnswered(true);
    setIsCorrect(correct);
    
    // Delay callback to show feedback
    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  };

  const handleWordClick = (index: number) => {
    if (answered || disabled) return;
    
    if (reorderedWords.includes(index)) {
      setReorderedWords(reorderedWords.filter(i => i !== index));
    } else {
      setReorderedWords([...reorderedWords, index]);
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

  const handleMatchClick = (isEnglish: boolean, index: number) => {
    if (answered || disabled) return;
    
    if (isEnglish) {
      setSelectedEnglish(index);
    } else if (selectedEnglish !== null) {
      // Match the selected English with this Arabic
      setMatchedPairs(prev => ({ ...prev, [selectedEnglish]: index }));
      setSelectedEnglish(null);
    }
  };

  const renderExercise = () => {
    switch (type) {
      case 'mcq':
        return (
          <div className="grid grid-cols-1 gap-3">
            {data.options?.map((option, index) => (
              <Button
                key={index}
                type="button"
                variant={
                  answered
                    ? index === data.correct
                      ? 'success'
                      : selectedOption === index
                      ? 'destructive'
                      : 'secondary'
                    : selectedOption === index
                    ? 'default'
                    : 'secondary'
                }
                className={cn(
                  "h-auto py-4 px-6 text-lg justify-start",
                  answered && index === data.correct && "ring-2 ring-success",
                  answered && selectedOption === index && index !== data.correct && "ring-2 ring-destructive"
                )}
                onClick={() => !answered && !disabled && setSelectedOption(index)}
                disabled={answered || disabled}
                dir="ltr"
              >
                <span className="flex-1 text-left ltr-sentence">{option}</span>
                {answered && index === data.correct && (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                {answered && selectedOption === index && index !== data.correct && (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
              </Button>
            ))}
          </div>
        );

      case 'fill_blank':
      case 'translation':
        return (
          <div className="space-y-4">
            <Input
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder={type === 'translation' ? 'اكتب الترجمة هنا...' : 'اكتب الإجابة هنا...'}
              className={cn(
                "text-lg h-14 ltr-text",
                answered && isCorrect && "border-success ring-2 ring-success",
                answered && !isCorrect && "border-destructive ring-2 ring-destructive"
              )}
              disabled={answered || disabled}
              dir="ltr"
            />
            {answered && (
              <div className={cn(
                "p-4 rounded-lg",
                isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {isCorrect ? (
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    ممتاز!
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="font-semibold flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      إجابة خاطئة
                    </p>
                    <div className="bg-background/50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground shrink-0">إجابتك:</span>
                        <span className="ltr-inline line-through opacity-70">{textAnswer}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground shrink-0">الصحيح:</span>
                        <span className="ltr-inline text-success font-medium">{data.answer}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'reorder':
        return (
          <div className="space-y-6">
            {/* Selected words */}
            <div className="min-h-[60px] p-4 rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-wrap gap-2">
              {reorderedWords.length === 0 ? (
                <p className="text-muted-foreground">اضغط على الكلمات لترتيبها</p>
              ) : (
                reorderedWords.map((wordIndex, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => handleWordClick(wordIndex)}
                    disabled={answered || disabled}
                    className="ltr-inline"
                    dir="ltr"
                  >
                    {data.words?.[wordIndex]}
                  </Button>
                ))
              )}
            </div>

            {/* Available words */}
            <div className="flex flex-wrap gap-2 justify-center">
              {data.words?.map((word, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={reorderedWords.includes(index) ? 'outline' : 'secondary'}
                  size="lg"
                  onClick={() => handleWordClick(index)}
                  disabled={answered || disabled || reorderedWords.includes(index)}
                  className={cn(
                    "ltr-inline",
                    reorderedWords.includes(index) && "opacity-50"
                  )}
                  dir="ltr"
                >
                  {word}
                </Button>
              ))}
            </div>

            {answered && (
              <div className={cn(
                "p-4 rounded-lg",
                isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {isCorrect ? (
                  <p className="font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    ممتاز!
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="font-semibold flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5" />
                      ترتيب خاطئ
                    </p>
                    <div className="bg-background/50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-muted-foreground shrink-0">ترتيبك:</span>
                        <span className="ltr-inline line-through opacity-70">
                          {reorderedWords.map(i => data.words?.[i]).join(' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-muted-foreground shrink-0">الصحيح:</span>
                        <span className="ltr-inline text-success font-medium">{data.answer}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'listening':
        return (
          <div className="space-y-4">
            <ListeningButton text={data.answer || ''} disabled={answered || disabled} />
            <Input
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="اكتب ما سمعته..."
              className={cn(
                "text-lg h-14 ltr-text",
                answered && isCorrect && "border-success ring-2 ring-success",
                answered && !isCorrect && "border-destructive ring-2 ring-destructive"
              )}
              disabled={answered || disabled}
              dir="ltr"
            />
            {answered && (
              <div className={cn(
                "p-4 rounded-lg",
                isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {isCorrect ? (
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    ممتاز!
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="font-semibold flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      إجابة خاطئة
                    </p>
                    <div className="bg-background/50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground shrink-0">إجابتك:</span>
                        <span className="ltr-inline line-through opacity-70">{textAnswer}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground shrink-0">الصحيح:</span>
                        <span className="ltr-inline text-success font-medium">{data.answer}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'matching':
        const pairs = data.pairs || [];
        const shuffledArabic = [...pairs].sort(() => Math.random() - 0.5);
        
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* English column */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">English</p>
                {pairs.map((pair, index) => {
                  const isMatched = matchedPairs[index] !== undefined;
                  const isSelected = selectedEnglish === index;
                  return (
                    <Button
                      key={index}
                      type="button"
                      variant={isMatched ? 'success' : isSelected ? 'default' : 'secondary'}
                      className={cn(
                        "w-full justify-start",
                        isMatched && "opacity-60"
                      )}
                      dir="ltr"
                      onClick={() => handleMatchClick(true, index)}
                      disabled={answered || disabled || isMatched}
                    >
                      {pair.english}
                    </Button>
                  );
                })}
              </div>
              
              {/* Arabic column */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">العربية</p>
                {pairs.map((pair, index) => {
                  const isMatched = Object.values(matchedPairs).includes(index);
                  return (
                    <Button
                      key={index}
                      type="button"
                      variant={isMatched ? 'success' : 'secondary'}
                      className={cn(
                        "w-full justify-start",
                        isMatched && "opacity-60"
                      )}
                      onClick={() => handleMatchClick(false, index)}
                      disabled={answered || disabled || isMatched || selectedEnglish === null}
                    >
                      {pair.arabic}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {answered && (
              <div className={cn(
                "p-4 rounded-lg text-center",
                isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                <p className="font-semibold flex items-center justify-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      ممتاز!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      حاول مرة أخرى
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return <p>نوع السؤال غير مدعوم</p>;
    }
  };

  // Helper function to wrap English sentences (including blanks) in LTR isolation
  const renderPromptWithLTR = (text: string) => {
    // Pattern to match: Arabic prefix (like "أكمل:") followed by English sentence
    // We detect English segments that contain letters, blanks, punctuation
    const segments: React.ReactNode[] = [];
    
    // Split by detecting transitions between Arabic and English/blank content
    // Match full English sentences including ___, punctuation, etc.
    const fullEnglishPattern = /([_]{2,}[\s]*[A-Za-z][A-Za-z0-9\s.,!?'"()\-–—_]*|[A-Za-z][A-Za-z0-9\s.,!?'"()\-–—_]*[_]{2,}[A-Za-z0-9\s.,!?'"()\-–—_]*|[A-Za-z][A-Za-z0-9\s.,!?'"()\-–—]+)/g;
    
    let lastIndex = 0;
    let match;
    
    while ((match = fullEnglishPattern.exec(text)) !== null) {
      // Add Arabic text before this match
      if (match.index > lastIndex) {
        const arabicPart = text.slice(lastIndex, match.index);
        if (arabicPart.trim()) {
          segments.push(<span key={`ar-${lastIndex}`}>{arabicPart}</span>);
        }
      }
      
      // Add English text wrapped in bdi for LTR isolation
      segments.push(
        <bdi 
          key={`en-${match.index}`} 
          dir="ltr" 
          style={{ 
            unicodeBidi: 'isolate',
            display: 'inline'
          }}
        >
          {match[0]}
        </bdi>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining Arabic text
    if (lastIndex < text.length) {
      const remaining = text.slice(lastIndex);
      if (remaining.trim()) {
        segments.push(<span key={`ar-end`}>{remaining}</span>);
      }
    }
    
    return segments.length > 0 ? segments : text;
  };

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <Card className="bg-secondary/30">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">{renderPromptWithLTR(promptAr)}</h2>
          {promptEn && (
            <div className="flex items-center gap-2" dir="ltr">
              <AudioButton text={promptEn} size="sm" className="text-muted-foreground" />
              <p className="text-muted-foreground flex-1" style={{ unicodeBidi: 'isolate' }}>{promptEn}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercise content */}
      {renderExercise()}

      {/* Smart Hints System */}
      {!answered && (
        <div className="space-y-3">
          {/* Progressive hints for text-based exercises */}
          {(type === 'fill_blank' || type === 'translation' || type === 'listening') && data.answer && (
            <div className="flex flex-wrap gap-2 justify-center">
              {/* Hint 1: Word count */}
              {hintLevel < 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setHintLevel(1)}
                  className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <Hash className="w-4 h-4 ml-1" />
                  عدد الكلمات
                </Button>
              )}
              
              {/* Hint 2: First letter */}
              {hintLevel >= 1 && hintLevel < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setHintLevel(2)}
                  className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  <Type className="w-4 h-4 ml-1" />
                  الحرف الأول
                </Button>
              )}
              
              {/* Hint 3: Show more letters */}
              {hintLevel >= 2 && hintLevel < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setHintLevel(3)}
                  className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Eye className="w-4 h-4 ml-1" />
                  كشف المزيد
                </Button>
              )}
            </div>
          )}

          {/* Display active hints */}
          {hintLevel > 0 && data.answer && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4 space-y-2">
                {hintLevel >= 1 && (
                  <p className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <Hash className="w-4 h-4" />
                    <span>عدد الكلمات: <strong>{data.answer.trim().split(/\s+/).length}</strong></span>
                  </p>
                )}
                {hintLevel >= 2 && (
                  <p className="text-sm flex items-center gap-2 text-orange-700 dark:text-orange-300">
                    <Type className="w-4 h-4" />
                    <span>يبدأ بـ: <strong className="ltr-inline font-mono text-base">{data.answer.charAt(0).toUpperCase()}...</strong></span>
                  </p>
                )}
                {hintLevel >= 3 && (
                  <p className="text-sm flex items-center gap-2 text-red-700 dark:text-red-300">
                    <Eye className="w-4 h-4" />
                    <span>التلميح: <strong className="ltr-inline font-mono text-base">
                      {data.answer.split('').map((char, i) => 
                        i < 3 || char === ' ' ? char : '_'
                      ).join('')}
                    </strong></span>
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Original hint from exercise data */}
          {(data.hint_ar || data.hint_en) && (
            <div className="text-center">
              {showHint ? (
                <Card className="bg-accent/10 border-accent/30">
                  <CardContent className="p-4">
                    <p className="text-sm flex items-center justify-center gap-2">
                      <Lightbulb className="w-4 h-4 text-accent" />
                      <span>{data.hint_ar}</span>
                      {data.hint_en && (
                        <span className="text-muted-foreground ltr-text">({data.hint_en})</span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="text-accent"
                >
                  <Lightbulb className="w-4 h-4 ml-2" />
                  تلميح إضافي
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit button */}
      {!answered && (
        <Button
          type="button"
          variant="hero"
          size="xl"
          className="w-full"
          onClick={checkAnswer}
          disabled={!canSubmit() || disabled}
        >
          تحقق
        </Button>
      )}
    </div>
  );
};
