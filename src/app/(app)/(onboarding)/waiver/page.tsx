import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import WaiverTerms from '@/components/waiver-terms';
// import { checkAuth, getUserById } from '@/lib/server-utils';
import ESigBlock from '@/components/e-sig-block';
import { checkAuth } from '@/lib/server-utils';
import prisma from '@/lib/db';

export default async function Page() {
  const user = await checkAuth();

return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H1>Cold Plunge Waiver and Release of Liability</H1>
        <Subtitle>
          You must sign this waiver in order to use the cold plunge
        </Subtitle>
      </div>
      <WaiverTerms name={user?.user_metadata?.name} />
      {/* <ESigAgreementCheckBox /> */}
      <ESigBlock name={user?.user_metadata?.name} />
    </main>
  );
}
