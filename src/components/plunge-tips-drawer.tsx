'use client';

import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { RiLightbulbFlashLine } from 'react-icons/ri';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Button } from './ui/button';
import PlungeTipsCarousel from './plunge-tips-carousel';
import { cn } from '@/lib/utils';

export default function PlungeTipsDrawer({
  className,
}: {
  className?: string;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="sm"
          className={cn(
            'p-2 ml-auto bg-indigo-600 hover:bg-indigo-600/90',
            className,
          )}
        >
          <RiLightbulbFlashLine className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="px-0 pb-4">
            <DrawerTitle>Plunge tips</DrawerTitle>
          </DrawerHeader>
          <div className="pt-3 pb-6 max-h-[66vh] overflow-scroll text-zinc-600 space-y-6">
            <PlungeTipsCarousel />
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
