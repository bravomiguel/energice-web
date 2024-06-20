'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signupSchemaPwConfirm } from '@/lib/validations';
import { TSignupForm } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { signUp } from '@/actions/actions';
import { useState } from 'react';
import ShowPasswordToggle from './show-password-toggle';
import { useSearchParams } from 'next/navigation';

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

      <div className="flex flex-col gap-1">
        <Button
          type="submit"
          disabled={
            !isValid ||
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
