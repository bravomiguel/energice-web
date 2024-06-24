'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { signupSchemaPwConfirm } from '@/lib/validations';
import { TSignupForm } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { signUp } from '@/actions/actions';
import ShowPasswordToggle from './show-password-toggle';
import { Checkbox } from './ui/checkbox';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<TSignupForm>({
    resolver: zodResolver(signupSchemaPwConfirm),
    mode: 'all',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [passwordConfirmShow, setPasswordConfirmShow] =
    useState<boolean>(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const [isChecked, setIsChecked] = useState(false);
  const checkboxRef = useRef<HTMLDivElement>(null);

  const onSubmit = handleSubmit(async (data) => {
    const response = await signUp({ ...data, callbackUrl });
    if (response?.error) {
      console.error({ error: response.error });
      setSignupError(response.error);
    }
  });

  return (
    <form className="flex flex-col gap-10" onSubmit={onSubmit}>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className="border-zinc-200 focus-visible:text-zinc-900 focus-visible:bg-zinc-100/60 text-zinc-50"
          />
          {errors.email && (
            <p className="text-red-900 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={passwordShow ? 'text' : 'password'}
              {...register('password')}
              className="border-zinc-200 focus-visible:indigo focus-visible:text-zinc-900 focus-visible:bg-zinc-100/60 text-zinc-50"
            />
            <ShowPasswordToggle
              passwordShow={passwordShow}
              setPasswordShow={setPasswordShow}
              className="absolute h-6 w-6 mr-4 right-0 top-1/2 -translate-y-3"
            />
          </div>
          {errors.password && (
            <p className="text-red-900 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="passwordConfirm">Confirm password</Label>
          <div className="relative">
            <Input
              id="passwordConfirm"
              type={passwordConfirmShow ? 'text' : 'password'}
              {...register('passwordConfirm')}
              className="border-zinc-200 focus-visible:indigo focus-visible:text-zinc-900 focus-visible:bg-zinc-100/60 text-zinc-50"
            />
            <ShowPasswordToggle
              passwordShow={passwordConfirmShow}
              setPasswordShow={setPasswordConfirmShow}
              className="absolute h-6 w-6 mr-4 right-0 top-1/2 -translate-y-3"
            />
          </div>
          {errors.passwordConfirm && (
            <p className="text-red-900 text-sm">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>
      </div>

      <TOSCheckBox checkboxRef={checkboxRef} setIsChecked={setIsChecked} />

      <div className="flex flex-col gap-1">
        <Button
          type="submit"
          disabled={
            !isValid ||
            !isChecked ||
            isSubmitting ||
            (isSubmitSuccessful && signupError === null)
          }
          isLoading={
            isSubmitting || (isSubmitSuccessful && signupError === null)
          }
          className="w-full"
        >
          Sign up
        </Button>
        {signupError && <p className="text-red-900 text-sm">{signupError}</p>}
      </div>
    </form>
  );
}

function TOSCheckBox({
  setIsChecked,
  checkboxRef,
}: {
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  checkboxRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="flex items-start space-x-2 text-zinc-200" ref={checkboxRef}>
      <Checkbox
        className="border-zinc-200"
        id="tos"
        onCheckedChange={(checked) => {
          const isChecked = checked === true ?? false;
          setIsChecked(isChecked);
        }}
      />
      <Label
        htmlFor="tos"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {`I agree to KoldUp's `}
        <Link className="underline" target="_blank" href="https://koldup.com">
          Terms of Service
        </Link>
        {` and `}
        <Link className="underline" target="_blank" href="https://koldup.com">
          Privacy Policy
        </Link>
        {/* {` *`} */}
      </Label>
    </div>
  );
}
