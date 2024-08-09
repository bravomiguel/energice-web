import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import { checkAuth, getUserById } from '@/lib/server-utils';
import H2 from '@/components/h2';
import BottomNav from '@/components/bottom-nav';
import WelcomeContinueBtn from '@/components/welcome-continue-btn';
import ColdPlungeBenefits from '@/components/cold-plunge-benefits';

export default async function Page() {
  noStore();

  // auth check
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  // onboarding check
  if (user?.isEmailConfirmed) redirect('/');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H1>Welcome to KoldUp! 🎉</H1>
        <Subtitle>The ultimate workout recovery</Subtitle>
      </div>
      <ColdPlungeBenefits onboarding={true} />
      <BottomNav>
        <WelcomeContinueBtn>Continue</WelcomeContinueBtn>
      </BottomNav>
    </main>
  );
}
