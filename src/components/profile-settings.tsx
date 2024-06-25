'use client';

import Link from 'next/link';
import { IoChevronForward } from 'react-icons/io5';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Button } from './ui/button';
import WaiverTerms from './waiver-terms';
import { User } from '@prisma/client';

export default function ProfileSettings({
  firstName,
  lastName,
}: Pick<User, 'firstName' | 'lastName'>) {
  return (
    <>
      <SettingsItem label="Help and support" href={'https://koldup.com/'} />
      <SettingsItem label="Terms of service" href={'https://koldup.com/'} />
      <SettingsItem label="Privacy policy" href={'https://koldup.com/'} />
      <SettingsItem label="Retake your Health Quiz" href={'/health-quiz'} />
      <SettingsItem label="Download your data" href={'https://koldup.com/'} />
      {/* <SettingsItem label="View your waiver" href={'https://koldup.com/'} /> */}
      <ViewWaiverDrawer firstName={firstName} lastName={lastName} />
    </>
  );
}

function SettingsItem({ label, href }: { label: string; href?: any }) {
  return (
    <Link
      className="flex items-center justify-between text-zinc-600 border-b border-zinc-200 py-4"
      href={href ?? ''}
    >
      <p>{label}</p>
      <IoChevronForward className="w-5 h-5" />
    </Link>
  );
}

function ViewWaiverDrawer({
  firstName,
  lastName,
}: Pick<User, 'firstName' | 'lastName'>) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {/* <Button variant="outline">Open Drawer</Button> */}
        <div className="flex items-center justify-between text-zinc-600 border-b border-zinc-200 py-4">
          <p>View your waiver</p>
          <IoChevronForward className="w-5 h-5" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="px-0">
            <DrawerTitle>
              Cold Plunge Waiver and Release of Liability
            </DrawerTitle>
            {/* <DrawerDescription>
              You must sign this waiver in order to use the cold plunge
            </DrawerDescription> */}
          </DrawerHeader>
          <div className="pb-6 max-h-[66vh] overflow-scroll">
            <WaiverTerms
              firstName={firstName}
              lastName={lastName}
              isSigned={true}
            />
          </div>
          <DrawerFooter className="px-0">
            <DrawerClose asChild>
              <Button variant="outline">Back</Button>
            </DrawerClose>
            {/* <Link href="https://koldup.com">
              <Button className="w-full" variant="outline">
                Download waiver
              </Button>
            </Link> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
