'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

import { authFormSchema } from '@/lib/validations';
import { TAuthForm } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { signInAction, signUp } from '@/actions/actions';
import { useState } from 'react';
import ShowPasswordToggle from './show-password-toggle';
import { useSearchParams } from 'next/navigation';

type AuthFormProps = {
  type: 'signUp' | 'signIn';
};

export default function AuthForm({ type }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TAuthForm>({
    resolver: zodResolver(authFormSchema),
    mode: 'all',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const {data: session} = useSession();

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [authErrors, setAuthErrors] = useState<{
    signIn: string | null;
    signUp: string | null;
  }>({ signIn: null, signUp: null });

  const onSubmit = handleSubmit(async (data) => {
    // console.log({ data });
    if (type === 'signIn') {
      const response = await signInAction({ ...data, callbackUrl });
      if (response?.error) {
        console.error({ error: response.error });
        setAuthErrors((prev) => {
          return { ...prev, signIn: response.error };
        });
      }
    } else {
      const response = await signUp({ ...data, callbackUrl });
      if (response?.error) {
        console.error({ error: response.error });
        setAuthErrors((prev) => {
          return {
            ...prev,
            signUp: response.error,
          };
        });
      }
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
      </div>

      <div className="space-y-1">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting || !!session?.user}
          className="w-full"
        >
          {type === 'signUp' ? 'Sign up' : 'Sign in'}
        </Button>
        {authErrors.signIn && (
          <p className="text-red-900 text-sm">{authErrors.signIn}</p>
        )}
        {authErrors.signUp && (
          <p className="text-red-900 text-sm">{authErrors.signUp}</p>
        )}
      </div>
    </form>
  );
}
