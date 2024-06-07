import { unstable_noStore as noStore } from 'next/cache';
import { useRouter } from 'next/navigation';

import { getUser } from '@/actions/actions';
import { FaCheckCircle } from 'react-icons/fa';
import { IoWarningOutline } from 'react-icons/io5';
import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import BottomNav from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';

export default async function Page() {
  noStore();
  const user = await getUser();
  // const quizData = JSON.parse(user.quizData);
  // const isAnyQuestionYes = quizData.some(
  //   (question) => question.answer === true,
  // );
  const isAnyQuestionYes = true;

  return (
    <>
      <QuizOutcome isAnyQuestionYes={isAnyQuestionYes} />
      <ContinueBtn />
    </>
  );
}

function QuizOutcome({ isAnyQuestionYes }: { isAnyQuestionYes: boolean }) {
  return (
    <div className="flex flex-col flex-1 gap-4 justify-center items-center text-center px-10">
      {isAnyQuestionYes ? (
        <>
          <IoWarningOutline className="h-20 w-20 text-amber-600" />
          <H1>Check Complete</H1>
          <Subtitle>
            {`As you answered yes to some of the quizData, we don't recommend cold plunging until you have checked with your medical doctor first.`}
          </Subtitle>
        </>
      ) : (
        <>
          <FaCheckCircle className="h-20 w-20 text-blue-koldup" />
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

('use client');

function ContinueBtn() {
  const router = useRouter();
  return (
    <BottomNav className="flex w-full gap-3 justify-center items-center">
      <Button className="w-full" onClick={() => router.push('/app/waiver')}>
        Continue
      </Button>
    </BottomNav>
  );
}
