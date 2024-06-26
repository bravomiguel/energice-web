'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from './ui/input';
import { DURATION_MINS_OPTIONS, DURATION_SECS_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function DurationDropdown({
  type,
  value,
  setValue,
  className,
}: {
  type: 'mins' | 'secs';
  value: { mins: string; secs: string };
  setValue: Dispatch<SetStateAction<{ mins: string; secs: string }>>;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectOption = (e: React.MouseEvent<HTMLDivElement>) => {
    if (type === 'mins') {
      if (e.currentTarget.innerText === '06') {
        setValue({ mins: e.currentTarget.innerText, secs: '00' });
      } else {
        setValue({ ...value, mins: e.currentTarget.innerText });
      }
    } else {
      setValue({ ...value, secs: e.currentTarget.innerText });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div onClick={() => setIsOpen(true)}>
          <Input
            id={type === 'mins' ? 'minutes' : 'seconds'}
            type="number"
            // disabled
            value={type === 'mins' ? value.mins : value.secs}
            className={cn('w-12 text-center h-fit', className)}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-12 text-center bg-zinc-100">
        {type === 'mins' &&
          DURATION_MINS_OPTIONS.map((option, index) => (
            <>
              {index !== 0 && <DropdownMenuSeparator className="bg-zinc-200" />}
              <DropdownMenuItem
                className="hover:bg-indigo-300 focus:bg-indigo-300"
                onClick={handleSelectOption}
              >
                {option}
              </DropdownMenuItem>
            </>
          ))}
        {type === 'secs' && value.mins !== '06' ? (
          DURATION_SECS_OPTIONS.map((option, index) => (
            <>
              {index !== 0 && <DropdownMenuSeparator className="bg-zinc-200" />}
              <DropdownMenuItem
                className="hover:bg-indigo-300 focus:bg-indigo-300"
                onClick={handleSelectOption}
              >
                {option}
              </DropdownMenuItem>
            </>
          ))
        ) : type === 'secs' ? (
          <DropdownMenuItem
            className="hover:bg-indigo-300 focus:bg-indigo-300"
            onClick={handleSelectOption}
          >
            00
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
