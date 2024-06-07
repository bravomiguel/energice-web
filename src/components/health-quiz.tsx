'use client';

import { useRouter } from 'next/navigation';

import { initialHealthQuizData } from '@/lib/data';
import { HealthQuizData } from '@/lib/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from './ui/button';
import H1 from './h1';
import Subtitle from './subtitle';
import BottomNav from './bottom-nav';

export default function HealthQuiz() {
  const [quizData, setQuizData] = useState<HealthQuizData[]>(
    initialHealthQuizData,
  );
  const isQuizComplete =
    quizData.filter((question) => question.answer !== null).length === 10;

  const onSubmit = async () => {
    
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <H1>Health Quiz</H1>
        <Subtitle>
          2-min quiz to check if cold plunging suits your health needs.
        </Subtitle>
      </div>
      <QuestionSet quizData={quizData} setQuizData={setQuizData} />
      <BtnSet isQuizComplete={isQuizComplete} onSubmit={onSubmit} />
    </>
  );
}

function QuestionSet({
  quizData,
  setQuizData,
}: {
  quizData: HealthQuizData[];
  setQuizData: Dispatch<SetStateAction<HealthQuizData[]>>;
}) {
  return (
    <div className="flex flex-col gap-5">
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
              variant={answer === true ? 'tertiary' : 'outline'}
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
              variant={answer === false ? 'tertiary' : 'outline'}
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
}: {
  isQuizComplete: boolean;
  onSubmit: () => Promise<void>;
}) {
  const router = useRouter();
  return (
    <BottomNav className="flex w-full gap-3 justify-center items-center">
      <Button variant="outline" onClick={() => router.push('/app/waiver')}>
        Skip
      </Button>
      <Button
        disabled={!isQuizComplete}
        onClick={async () => await onSubmit()}
        className="w-full"
      >
        Done
      </Button>
    </BottomNav>
  );
}
