import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

import { PLUNGE_TIPS_ARRAY } from '@/lib/constants';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { cn } from '@/lib/utils';

export default function PlungeTipsCarousel() {
  return (
    <Carousel className="w-full mx-auto">
      <CarouselContent>
        {Array.from({ length: PLUNGE_TIPS_ARRAY.length }).map((_, index) => (
          <CarouselItem key={index} className="space-y-5 relative">
            <div className="flex w-9/12 mx-auto gap-2">
              <span className="w-5 h-5 bg-gray-200 rounded-full text-xs flex items-center justify-center text-gray-600 font-extrabold p-2 translate-y-0.5">
                {index + 1}
              </span>
              <p className="text-zinc-600 text-left text-sm">
                {PLUNGE_TIPS_ARRAY[index].message}
              </p>
            </div>
            <div className="flex justify-center items-center w-9/12 aspect-square mx-auto overflow-hidden rounded-lg bg-zinc-200">
              <ReactPlayer
                url={PLUNGE_TIPS_ARRAY[index].url}
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
              {Array.from({ length: PLUNGE_TIPS_ARRAY.length }).map(
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
        ))}
      </CarouselContent>
      <CarouselNext className="-translate-x-[170%]" />
      <CarouselPrevious className="translate-x-[170%]" />
    </Carousel>
  );
}
