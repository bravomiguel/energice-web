'use client';

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Homemade_Apple } from 'next/font/google';
import { Label } from '@radix-ui/react-label';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Profile } from '@prisma/client';
import Link from 'next/link';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import Subtitle from './subtitle';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';
import BottomNav from './bottom-nav';
import { signWaiver } from '@/lib/actions/profile-actions';
import { toast } from 'sonner';
import { waiverDataSchema } from '@/lib/validations';

const homemadeApple = Homemade_Apple({ weight: '400', subsets: ['latin'] });

export default function ESigBlock({ name }: { name?: Profile['name'] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fullName, setFullName] = useState(`${name}`);
  const isValid = useMemo(() => {
    const validatedData = waiverDataSchema.safeParse({
      waiverSigName: fullName,
    });
    return validatedData.success;
  }, [fullName]);
  const [signature, setSignature] = useState('');
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hasInputFocused, setHasInputFocused] = useState(false);

  const checkboxRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isCheckboxVisible) {
      checkboxRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isCheckboxVisible]);

  useEffect(() => {
    if (!isFormOpen) {
      setHasInputFocused(false);
    }
  }, [isFormOpen]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <div
              onClick={() => setIsFormOpen(true)}
              className="space-y-1 cursor-pointer"
            >
              <span>Participant signature:</span>
              <Input
                id="signature"
                type="text"
                // disabled
                value={signature}
                placeholder="Enter your signature here"
                className={cn('disabled:opacity-100 h-16 text-center', {
                  'border-2 border-blue-koldup': signature.length === 0,
                  [homemadeApple.className]: signature.length !== 0,
                  'pl-6 text-left': signature.length !== 0,
                })}
              />
            </div>
          </DialogTrigger>
          <DialogContent className="gap-5">
            <div className="flex flex-col gap-1">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Adopt your signature
                </DialogTitle>
              </DialogHeader>
              <Subtitle className="text-center">
                Confirm your name and signature
              </Subtitle>
            </div>
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSignature(fullName);
                setIsCheckboxVisible(true);
                setIsFormOpen(false);
              }}
            >
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                  onFocus={(event) => {
                    if (!hasInputFocused) {
                      event.target.blur();
                      setHasInputFocused(true);
                    }
                  }}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="signaturePreview">Signature Preview</Label>
                <Input
                  id="signaturePreview"
                  type="text"
                  value={fullName}
                  disabled
                  className={`${homemadeApple.className} text-left pl-4 h-16`}
                />
              </div>

              <Button
                type="submit"
                variant="koldupBlue"
                disabled={!isValid}
                className="w-full"
              >
                Adopt and Sign
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        {isCheckboxVisible && (
          <DisclosureCheckBox
            setIsChecked={setIsChecked}
            checkboxRef={checkboxRef}
          />
        )}
        <div className="mt-4 grid grid-cols-[auto_auto] grid-rows-2 gap-y-3 gap-x-4 justify-start">
          <span className="col-start-1 row-start-1">Participant Name:</span>
          <span className="col-start-2 row-start-1 border-b border-zinc-700 px-2 font-medium">
            {name}
          </span>
          <span className="col-start-1 row-start-2">Date signed:</span>
          <span className="col-start-2 row-start-2 border-b border-zinc-700 px-2 font-medium">
            {new Date().toLocaleDateString('en-US')}
          </span>
        </div>
      </div>
      <BottomNav>
        <Button
          disabled={!isChecked || isPending}
          isLoading={isPending}
          onClick={async () => {
            // router.push('/unit');
            startTransition(async () => {
              const response = await signWaiver({ waiverSigName: fullName });
              if (response?.error) {
                console.error({ error: response.error });
                toast.error(response.error);
              }
            });
          }}
        >
          Continue
        </Button>
      </BottomNav>
    </>
  );
}

function DisclosureCheckBox({
  setIsChecked,
  checkboxRef,
}: {
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  checkboxRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="flex items-center space-x-2" ref={checkboxRef}>
      <Checkbox
        id="disclosure"
        onCheckedChange={(checked) => {
          const isChecked = checked === true;
          setIsChecked(isChecked);
        }}
      />
      <label
        htmlFor="disclosure"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        I agree to use{' '}
        <Link
          className="underline"
          target="_blank"
          href="https://energicelife.com/#electronic-signatures-disclosure"
        >
          electronic records and signatures
        </Link>
      </label>
    </div>
  );
}
