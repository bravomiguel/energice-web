'use client';

import { IoMdInformationCircleOutline } from 'react-icons/io';

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

export default function PlungeTipsDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="sm"
          className="p-2 ml-auto bg-indigo-600 hover:bg-indigo-600/90"
        >
          <IoMdInformationCircleOutline className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="px-0 pb-4">
            <DrawerTitle>Plunging tips</DrawerTitle>
          </DrawerHeader>
          <div className="pt-3 pb-6 max-h-[66vh] overflow-scroll text-zinc-700 space-y-6">
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
