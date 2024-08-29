'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { initialHealthQuizData } from '@/lib/data';
import { HealthQuizData } from '@/lib/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from './ui/button';
import BottomNav from './bottom-nav';
import { saveHealthQuiz } from '@/actions/actions';

export default function HealthQuiz() {
  const [quizData, setQuizData] = useState<HealthQuizData>(
    initialHealthQuizData,
  );
  const isQuizComplete =
    quizData.filter((question) => question.answer !== null).length ===
    quizData.length;

  const [isSubmitting, startSubmitting] = useTransition();
  const handleSubmit = async () => {
    startSubmitting(async () => {
      await saveHealthQuiz(quizData);
    });
    return;
  };

  return (
    <>
      <QuestionSet quizData={quizData} setQuizData={setQuizData} />
      <BtnSet
        isQuizComplete={isQuizComplete}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

function QuestionSet({
  quizData,
  setQuizData,
}: {
  quizData: HealthQuizData;
  setQuizData: Dispatch<SetStateAction<HealthQuizData>>;
}) {
  return (
    <div className="flex-1 flex flex-col gap-5">
      {quizData.map(({ id, question, answer }) => (
        <div key={id} className="pb-5 border-b border-zinc-200">
          <p className="font-medium">
            {id}. {question}
          </p>
          <div className="flex w-full justify-center items-center gap-3 mt-3">
            <Button
              onClick={() => {
                setQuizData(
                  quizData.map((question) => ({
                    ...question,
                    answer: question.id === id ? true : question.answer,
                  })),
                );
              }}
              variant={answer === true ? 'koldupGreen' : 'outline'}
              className="w-full"
            >
              YES
            </Button>
            <Button
              onClick={() => {
                setQuizData(
                  quizData.map((question) => ({
                    ...question,
                    answer: question.id === id ? false : question.answer,
                  })),
                );
              }}
              variant={answer === false ? 'koldupGreen' : 'outline'}
              className="w-full"
            >
              NO
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BtnSet({
  isQuizComplete,
  onSubmit,
  isSubmitting,
}: {
  isQuizComplete: boolean;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const skipQuiz = async () => {
    startTransition(async () => {
      router.push('/waiver');
    });
  };
  return (
    <BottomNav className="flex flex-row justify-center items-center">
      <Button
        variant="outline"
        onClick={async () => await skipQuiz()}
        isLoading={isPending}
        className='w-36 px-0'
      >
        Skip
      </Button>
      <Button
        disabled={!isQuizComplete || isSubmitting}
        isLoading={isSubmitting}
        onClick={async () => await onSubmit()}
        className="w-full"
      >
        Done
      </Button>
    </BottomNav>
  );
}
