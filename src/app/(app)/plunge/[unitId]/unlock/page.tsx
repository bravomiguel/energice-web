import { unstable_noStore as noStore } from 'next/cache';
import { MdFlag, MdReport } from "react-icons/md";
import { VscReport } from "react-icons/vsc";


import {
  checkAuth,
  getCodesbyLockId,
  getUnitById,
  getUserById,
} from '@/lib/server-utils';
import { getLatestActiveCode } from '@/actions/actions';
import { Input } from '@/components/ui/input';
import H1 from '@/components/h1';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/bottom-nav';

export default async function Page({ params }: { params: { unitId: string } }) {
  noStore();

  // auth check
  const session = await checkAuth();

  // get unit
  const unit = await getUnitById(params.unitId);
  if (!unit) {
    // redirect('/');
    console.error('Unit not found');
    return;
  }

  // get newest active code
  const response = await getLatestActiveCode({
    lockDeviceId: unit.lockDeviceId,
  });
  console.log({ response });
  if (response.error) {
    console.error(response.error);
  }

  const activeCode = response?.data ?? null;

  return (
    <main className="relative flex-1 flex flex-col">
      {/* <Input
        disabled
        className='disabled:opacity-100 w-fit'
        // value={activeCode && activeCode.code ? activeCode.code : ''}
        value={3108}
      /> */}
      <H1>Access Code</H1>
      <div className="flex-1 flex flex-col justify-center items-center gap-10">
        <div className="flex flex-col justify-center w-4/6 gap-5">
          <div className="rounded-md border font-medium border-zinc-500 bg-transparent text-5xl text-center py-3">
            {3108}
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <Button className='w-full'>Get new code</Button>
              <Button variant="outline"><MdReport className='h-5 w-5' /></Button>
            </div>
            <Button variant="outline">Report issue</Button>
          </div>
        </div>
        <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
          {`GIF "How it works" Explanation`}
        </div>
        <p>Session starts in: ???</p>
      </div>
      <BottomNav>
        <Button className="invisible">For spacing only</Button>
      </BottomNav>
    </main>
  );
}
