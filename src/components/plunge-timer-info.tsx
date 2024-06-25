'use client';

import Image from 'next/image';
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
          className="p-2 ml-auto bg-indigo-600 hover:bg-indigo-600/90"
        >
          <IoMdInformationCircleOutline className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="px-0 pb-4">
            <DrawerTitle>Plunge timer</DrawerTitle>
          </DrawerHeader>
          <div className="pb-6 max-h-[73vh] overflow-scroll text-zinc-700 space-y-6">
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
    <Carousel className="w-full mx-auto">
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index} className="space-y-5">
            <p className="text-zinc-700 text-left">
              {PLUNGE_TIME_INFO_ARRAY[index].message}
            </p>
            <div className="flex justify-center items-center w-9/12 mx-auto overflow-hidden rounded-lg bg-zinc-200">
              <Image
                src={PLUNGE_TIME_INFO_ARRAY[index].gifUrl}
                alt="explainer gif"
                width={250}
                height={250}
              />
            </div>
            <div className="flex gap-2 items-center justify-center">
              <div
                className={cn('w-2 aspect-square rounded-full bg-zinc-300', {
                  'bg-indigo-700': index === 0,
                })}
              />
              <div
                className={cn('w-2 aspect-square rounded-full bg-zinc-300', {
                  'bg-indigo-700': index === 1,
                })}
              />
              <div
                className={cn('w-2 aspect-square rounded-full bg-zinc-300', {
                  'bg-indigo-700': index === 2,
                })}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="-translate-x-[150%]" />
      <CarouselPrevious className="translate-x-[150%]" />
    </Carousel>
  );
}

function PlungeTimeGuide() {
  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <Subtitle className="text-zinc-900 font-semibold text-lg">
          Plunge time guidelines
        </Subtitle>
        <p className="text-zinc-700">Based on experience level</p>
      </div>
      <div className="grid grid-cols-1 grid-rows-4 gap-2 items-end text-zinc-700">
        <div className="w-full row-start-1 row-span-1 grid grid-cols-3 grid-rows-1 gap-1 font-semibold text-zinc-900">
          <p>{`Level`}</p>
          <p>{`Experience`}</p>
          <p>{`Max time`}</p>
        </div>

        <div className="row-start-2 row-span-1 grid grid-cols-3 grid-rows-1 gap-1 border-b py-3">
          <p>{`Beginner`}</p>
          <p>{`30 plunges`}</p>
          <p>{`2 mins`}</p>
        </div>

        <div className="row-start-3 row-span-1 grid grid-cols-3 grid-rows-1 gap-1 border-b py-3">
          <p>{`Intermediate`}</p>
          <p>{`30-90 plunges`}</p>
          <p>{`4 mins`}</p>
        </div>

        <div className="row-start-4 row-span-1 grid grid-cols-3 grid-rows-1 gap-1 py-3">
          <p>{`Advanced`}</p>
          <p>{`>90 plunges`}</p>
          <p>{`6 mins`}</p>
        </div>
      </div>
    </div>
  );
}
