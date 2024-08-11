import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import { IoWarningOutline } from 'react-icons/io5';
import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import { checkAuth, getUserById } from '@/lib/server-utils';
import NextNavBtn from '@/components/next-nav-btn';
import { FaCheckCircle } from 'react-icons/fa';

export default async function Page() {
  noStore();

  // auth check
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  return (
    <>
      <GuardianWaiverStatus isGWaiverSigned={user?.isGWaiverSigned} />
      <NextNavBtn toPath="/health-quiz" btnLabel="continue" isDisabled={!user?.isGWaiverSigned} />
    </>
  );
}

function GuardianWaiverStatus({
  isGWaiverSigned,
}: {
  isGWaiverSigned?: boolean;
}) {
  return (
    <div className="flex flex-col flex-1 gap-4 justify-center items-center text-center px-10">
      {isGWaiverSigned ? (
        <>
          <FaCheckCircle className="h-16 w-16 text-blue-koldup" />
          <H1>Guardian waiver received</H1>
          <Subtitle>
            {`We've safely received your guardian's signed waiver, and you're now ready to take your first plunge!`}
          </Subtitle>
        </>
      ) : (
        <>
          <IoWarningOutline className="h-16 w-16 text-amber-600" />
          <H1>Guardian waiver required</H1>
          <Subtitle>
            {`Since you're under 18, your parent / legal guardian must sign the liability waiver before you can plunge. You can get a copy of the waiver at the gym front-desk.`}
          </Subtitle>
        </>
      )}
    </div>
  );
}
