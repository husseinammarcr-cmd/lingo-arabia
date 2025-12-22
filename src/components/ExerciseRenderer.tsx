import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Lightbulb, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ExerciseType = 'mcq' | 'fill_blank' | 'reorder' | 'listening' | 'translation';

interface ExerciseData {
  options?: string[];
  correct?: number;
  answer?: string;
  alternatives?: string[];
  words?: string[];
  correct_order?: number[];
  hint_ar?: string;
  hint_en?: string;
}

interface ExerciseRendererProps {
  type: ExerciseType;
  promptAr: string;
  promptEn?: string;
  data: ExerciseData;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

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
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Reset state when exercise changes
    setSelectedOption(null);
    setTextAnswer('');
    setReorderedWords([]);
    setShowHint(false);
    setAnswered(false);
    setIsCorrect(false);
  }, [type, promptAr, data]);

  const checkAnswer = () => {
    let correct = false;

    switch (type) {
      case 'mcq':
        correct = selectedOption === data.correct;
        break;
      case 'fill_blank':
      case 'translation':
        const userAnswer = textAnswer.trim().toLowerCase();
        const correctAnswer = data.answer?.toLowerCase() || '';
        const alternatives = data.alternatives?.map(a => a.toLowerCase()) || [];
        correct = userAnswer === correctAnswer || alternatives.includes(userAnswer);
        break;
      case 'reorder':
        correct = JSON.stringify(reorderedWords) === JSON.stringify(data.correct_order);
        break;
      case 'listening':
        // Placeholder for listening exercises
        correct = textAnswer.trim().toLowerCase() === (data.answer?.toLowerCase() || '');
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
      default:
        return false;
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
                  "h-auto py-4 px-6 text-lg justify-start ltr-text",
                  answered && index === data.correct && "ring-2 ring-success",
                  answered && selectedOption === index && index !== data.correct && "ring-2 ring-destructive"
                )}
                onClick={() => !answered && !disabled && setSelectedOption(index)}
                disabled={answered || disabled}
              >
                <span className="flex-1 text-right">{option}</span>
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
                <p className="font-semibold flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      ممتاز!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      الإجابة الصحيحة: <span className="ltr-text">{data.answer}</span>
                    </>
                  )}
                </p>
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
                    variant="default"
                    size="sm"
                    onClick={() => handleWordClick(wordIndex)}
                    disabled={answered || disabled}
                    className="ltr-text"
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
                  variant={reorderedWords.includes(index) ? 'outline' : 'secondary'}
                  size="lg"
                  onClick={() => handleWordClick(index)}
                  disabled={answered || disabled || reorderedWords.includes(index)}
                  className={cn(
                    "ltr-text",
                    reorderedWords.includes(index) && "opacity-50"
                  )}
                >
                  {word}
                </Button>
              ))}
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
                      الترتيب الصحيح: <span className="ltr-text">{data.answer}</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        );

      case 'listening':
        return (
          <div className="space-y-4">
            <Button
              variant="secondary"
              size="lg"
              className="w-full h-20"
              onClick={() => {
                // Placeholder for audio playback
                console.log('Play audio');
              }}
            >
              <Volume2 className="w-8 h-8 ml-3" />
              <span>استمع</span>
            </Button>
            <Input
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="اكتب ما سمعته..."
              className="text-lg h-14 ltr-text"
              disabled={answered || disabled}
              dir="ltr"
            />
          </div>
        );

      default:
        return <p>نوع السؤال غير مدعوم</p>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <Card className="bg-secondary/30">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">{promptAr}</h2>
          {promptEn && (
            <p className="text-muted-foreground ltr-text">{promptEn}</p>
          )}
        </CardContent>
      </Card>

      {/* Exercise content */}
      {renderExercise()}

      {/* Hint */}
      {(data.hint_ar || data.hint_en) && !answered && (
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
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(true)}
              className="text-accent"
            >
              <Lightbulb className="w-4 h-4 ml-2" />
              أظهر تلميح
            </Button>
          )}
        </div>
      )}

      {/* Submit button */}
      {!answered && (
        <Button
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
