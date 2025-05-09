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
import { Profile } from '@prisma/client';
import ColdPlungeBenefits from './cold-plunge-benefits';
import PlungeTipsCarousel from './plunge-tips-carousel';
import { cn } from '@/lib/utils';

export default function ProfileSettings({
  name,
  waiverSignedAt,
  waiverSigName,
  isOnboarded,
}: Pick<Profile, 'name' | 'waiverSignedAt' | 'waiverSigName'> & {
  isOnboarded: boolean;
}) {
  return (
    <>
      <ViewPlungeDrawer type="benefits" />
      <ViewPlungeDrawer type="tips" />
      <SettingsItem
        label="Help and support"
        href={'https://energicelife.com/#help-and-support'}
      />
      <SettingsItem
        label="Terms of service"
        href={'https://energicelife.com/#terms-of-service'}
      />
      <SettingsItem
        label="Privacy policy"
        href={'https://energicelife.com/#privacy-policy'}
      />
      <SettingsItem
        label="Download your data"
        href={'https://energicelife.com/#download-your-data'}
      />
      {isOnboarded && waiverSignedAt ? (
        <ViewWaiverDrawer
          name={name}
          waiverSignedAt={waiverSignedAt}
          waiverSigName={waiverSigName}
        />
      ) : null}
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

function ViewPlungeDrawer({ type }: { type: 'benefits' | 'tips' }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex items-center justify-between text-zinc-600 border-b border-zinc-200 py-4">
          <p>
            {type === 'benefits' ? 'Cold plunge benefits' : 'Plunging tips'}
          </p>
          <IoChevronForward className="w-5 h-5" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="px-0">
            <DrawerTitle>
              {type === 'benefits' ? 'Cold Plunge Benefits' : 'Plunging Tips'}
            </DrawerTitle>
          </DrawerHeader>
          <div
            className={cn('pb-6 max-h-[66vh] overflow-scroll', {
              'space-y-8': type === 'benefits',
            })}
          >
            {type === 'benefits' ? (
              <ColdPlungeBenefits onboarding={false} />
            ) : (
              <PlungeTipsCarousel />
            )}
          </div>
          <DrawerFooter className="px-0">
            <DrawerClose asChild>
              <Button variant="outline">Back</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ViewWaiverDrawer({
  name,
  waiverSignedAt,
  waiverSigName,
}: Pick<Profile, 'name' | 'waiverSignedAt' | 'waiverSigName'>) {
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
          <div className="pb-6 max-h-[66vh] overflow-scroll text-sm">
            <WaiverTerms
              name={name}
              waiverSignedAt={waiverSignedAt}
              waiverSigName={waiverSigName}
            />
          </div>
          <DrawerFooter className="px-0">
            <DrawerClose asChild>
              <Button variant="outline">Back</Button>
            </DrawerClose>
            {/* <Link href="https://energicelife.com">
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
