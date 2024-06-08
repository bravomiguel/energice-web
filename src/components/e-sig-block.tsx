'use client';

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import { Homemade_Apple } from 'next/font/google';
// import { flushSync } from 'react-dom';

import { Button } from './ui/button';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import H1 from './h1';
import Subtitle from './subtitle';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { User } from '@prisma/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import BottomNav from './bottom-nav';
import { useRouter } from 'next/navigation';

const homemadeApple = Homemade_Apple({ weight: '400', subsets: ['latin'] });

export default function ESigBlock({
  firstName,
  lastName,
}: {
  firstName?: User['firstName'];
  lastName?: User['lastName'];
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fullName, setFullName] = useState(`${firstName} ${lastName}`);
  const isValid = useMemo(() => {
    const fullNameRegex = /^[a-zA-Z]{2,} [a-zA-Z]{2,}$/;
    return fullNameRegex.test(fullName);
  }, [fullName]);
  const [signature, setSignature] = useState('');
  const [isDisclosureVisible, setIsDisclosureVisible] = useState(false);
  const [isDisclosureChecked, setIsDisclosureChecked] = useState(false);

  const router = useRouter();

  return (
    <>
      <div className="flex flex-col gap-3">
        <Input
          id="signature"
          type="text"
          disabled
          value={signature}
          placeholder="Click SIGN below to add your signature"
          className={cn('disabled:opacity-100 h-16 text-center', {
            [homemadeApple.className]: signature.length !== 0,
          })}
        />
        <ESigBtn
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          setSignature={setSignature}
          setIsDisclosureVisible={setIsDisclosureVisible}
          fullName={fullName}
          setFullName={setFullName}
          isValid={isValid}
        >
          {signature.length === 0 ? 'Sign' : 'Edit signature'}
        </ESigBtn>
        {isDisclosureVisible && (
          <DisclosureCheckBox setIsDisclosureChecked={setIsDisclosureChecked} />
        )}
      </div>
      <BottomNav>
        <Button
          className="w-full"
          disabled={!isDisclosureChecked}
          onClick={() => {
            router.push('/plunge');
          }}
        >
          Continue
        </Button>
      </BottomNav>
    </>
  );
}

type ESigBtnProps = {
  isFormOpen: boolean;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
  setSignature: Dispatch<SetStateAction<string>>;
  setIsDisclosureVisible: Dispatch<SetStateAction<boolean>>;
  fullName: string;
  setFullName: Dispatch<SetStateAction<string>>;
  isValid: boolean;
};

function ESigBtn({
  isFormOpen,
  setIsFormOpen,
  children,
  setSignature,
  setIsDisclosureVisible,
  fullName,
  setFullName,
  isValid,
}: ESigBtnProps) {
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button variant={'koldupBlue'} size={'md'}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <H1>Adopt your signature</H1>
          </DialogTitle>
        </DialogHeader>
        <Subtitle className="text-center">
          Confirm your name and signature
        </Subtitle>
        <form
          className="flex flex-col gap-5"
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            setSignature(fullName);
            setIsDisclosureVisible(true);
            setIsFormOpen(false);
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setFullName(e.target.value);
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
              className={`${homemadeApple.className}`}
            />
          </div>

          <Button type="submit" disabled={!isValid} className="w-full">
            Adopt and Sign
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DisclosureCheckBox({
  setIsDisclosureChecked,
}: {
  setIsDisclosureChecked: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="disclosure" onCheckedChange={(checked) => {
        const isChecked = checked === true ?? false;
        setIsDisclosureChecked(isChecked);
      }} />
      <label
        htmlFor="disclosure"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        I agree to use{' '}
        <Link
          className="underline"
          target="_blank"
          href="https://support.docusign.com/s/document-item?language=en_US&rsc_301&bundleId=pik1583277475390&topicId=cwz1663702052434.html&_LANG=enus"
        >
          electronic records and signatures
        </Link>
      </label>
    </div>
  );
}
