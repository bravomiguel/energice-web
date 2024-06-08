import { unstable_noStore as noStore } from 'next/cache';

import { FaCheckCircle } from 'react-icons/fa';
import { IoWarningOutline } from 'react-icons/io5';
import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import HealthQuizOutcomeBtn from '@/components/health-quiz-outcome-btn';
import { HealthQuizData } from '@/lib/types';
import { checkAuth, getUserById } from '@/lib/server-utils';

export default async function Page() {
  noStore();
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  const quizData: HealthQuizData | undefined =
    user?.healthQuiz && JSON.parse(user.healthQuiz);
  const isAnyQuestionYes = quizData
    ? quizData.some((question) => question.answer === true)
    : false;

  return (
    <>
      <QuizOutcome isAnyQuestionYes={isAnyQuestionYes} />
      <HealthQuizOutcomeBtn />
    </>
  );
}

function QuizOutcome({ isAnyQuestionYes }: { isAnyQuestionYes: boolean }) {
  return (
    <div className="flex flex-col flex-1 gap-4 justify-center items-center text-center px-10">
      {isAnyQuestionYes ? (
        <>
          <IoWarningOutline className="h-16 w-16 text-amber-600" />
          <H1>Check Complete</H1>
          <Subtitle>
            {`As you answered yes to some of the questions, we don't recommend cold plunging until you have checked with your medical doctor first.`}
          </Subtitle>
        </>
      ) : (
        <>
          <FaCheckCircle className="h-16 w-16 text-blue-koldup" />
          <H1>Check Complete</H1>
          <Subtitle>
            Based on your answers, cold plunging does not appear to be a health
            risk for you. We still recommend checking with your medical doctor
            just in case.
          </Subtitle>
        </>
      )}
    </div>
  );
}
