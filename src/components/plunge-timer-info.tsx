'use client';

import ReactPlayer from 'react-player/lazy';
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { PLUNGE_TIME_INFO_ARRAY } from '@/lib/constants';
import { Button } from './ui/button';
import Subtitle from './subtitle';
import { cn } from '@/lib/utils';

export default function PlungeTimerInfo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="sm"
          className="p-2 mb-auto bg-indigo-600 hover:bg-indigo-600/90"
        >
          <IoMdInformationCircleOutline className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="px-0 pb-4">
            <DrawerTitle>Plunge timer</DrawerTitle>
          </DrawerHeader>
          <div className="pt-3 pb-6 max-h-[66vh] overflow-scroll text-zinc-600 space-y-6">
            <WhatIsItCarousel />
            <div className="w-full border-b border-zinc-200" />
            <PlungeTimeGuide />
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

function WhatIsItCarousel() {
  return (
    <Carousel className="w-full mx-auto text-sm">
      <CarouselContent>
        {Array.from({ length: PLUNGE_TIME_INFO_ARRAY.length }).map(
          (_, index) => (
            <CarouselItem key={index} className="space-y-5">
              <p className="text-zinc-600 text-center">
                {PLUNGE_TIME_INFO_ARRAY[index].message}
              </p>
              <div className="flex justify-center items-center w-9/12 aspect-square mx-auto overflow-hidden rounded-lg bg-zinc-200">
                <ReactPlayer
                  url={PLUNGE_TIME_INFO_ARRAY[index].url}
                  playing
                  playsinline
                  controls
                  loop
                  muted
                  width={"100%"}
                  height={"100%"}
                />
              </div>
              <div className="flex gap-2 items-center justify-center">
                {Array.from({ length: PLUNGE_TIME_INFO_ARRAY.length }).map(
                  (_, dotIndex) => (
                    <div
                      key={dotIndex}
                      className={cn(
                        'w-2 aspect-square rounded-full bg-zinc-300',
                        {
                          'bg-indigo-700': dotIndex === index,
                        },
                      )}
                    />
                  ),
                )}
              </div>
            </CarouselItem>
          ),
        )}
      </CarouselContent>
      <CarouselNext className="-translate-x-[170%]" />
      <CarouselPrevious className="translate-x-[170%]" />
    </Carousel>
  );
}

function PlungeTimeGuide() {
  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <Subtitle className="text-zinc-900 font-semibold text-lg">
          Plunge time guide
        </Subtitle>
        <p className="text-zinc-600 text-sm">
          Suggested plunge times based on experience level. <br />
          To help you stay safe and in control.
        </p>
      </div>
      <div className="grid grid-cols-1 grid-rows-4 text-zinc-700 w-fit items-center mx-auto text-sm">
        <div className="w-full row-start-1 row-span-1 grid grid-cols-[100px_1fr_80px] grid-rows-1 gap-7 font-semibold text-zinc-900 self-end">
          <p>{`Level`}</p>
          <p>{`Experience`}</p>
          <p>{`Max time`}</p>
        </div>

        <div className="row-start-2 row-span-1 grid grid-cols-[100px_1fr_80px] grid-rows-1 gap-7 border-b py-3">
          <p>{`Beginner`}</p>
          <p>{`<30 plunges`}</p>
          <p>{`2 mins`}</p>
        </div>

        <div className="row-start-3 row-span-1 grid grid-cols-[100px_1fr_80px] grid-rows-1 gap-7 border-b py-3">
          <p>{`Intermediate`}</p>
          <p>{`30-90 plunges`}</p>
          <p>{`4 mins`}</p>
        </div>

        <div className="row-start-4 row-span-1 grid grid-cols-[100px_1fr_80px] grid-rows-1 gap-7 py-3">
          <p>{`Advanced`}</p>
          <p>{`>90 plunges`}</p>
          <p>{`6 mins`}</p>
        </div>
      </div>
    </div>
  );
}
