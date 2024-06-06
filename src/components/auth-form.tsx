'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BiSolidHide, BiSolidShow } from 'react-icons/bi';

import { TAuthForm, authFormSchema } from '@/lib/validations';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { signInAction, signUp } from '@/actions/actions';
import { useState } from 'react';
import ShowPasswordToggle from './show-password-toggle';

type AuthFormProps = {
  type: 'signUp' | 'signIn';
};

export default function PetForm({ type }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TAuthForm>({
    resolver: zodResolver(authFormSchema),
    mode: 'all',
  });

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [authErrors, setAuthErrors] = useState<{
    signIn: string | null;
    signUp: string | null;
  }>({ signIn: null, signUp: null });

  const onSubmit = handleSubmit(async (data) => {
    // console.log({ data });
    if (type === 'signIn') {
      try {
        const response = await signInAction(data);
        if (response?.errorCode) {
          console.error({error: response});
        }
      } catch (e) {
        console.error(e);
        setAuthErrors((prev) => {
          return { ...prev, signIn: 'Invalid credentials' };
        });
      }
    } else {
      const response = await signUp(data);
      if (response?.errorCode) {
        console.error({error: response});
        setAuthErrors((prev) => {
          return {
            ...prev,
            signIn: response.errorMessage,
          };
        });
      }
    }
  });

  return (
    <form className="flex flex-col gap-10 px-6" onSubmit={onSubmit}>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className="focus-visible:ring-2 focus-visible:indigo focus-visible:text-zinc-900 focus-visible:bg-zinc-100/60 text-zinc-50"
          />
          {errors.email && (
            <p className="text-red-900 font-normal">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={passwordShow ? 'text' : 'password'}
              {...register('password')}
              className="focus-visible:ring-2 focus-visible:indigo focus-visible:text-zinc-900 focus-visible:bg-zinc-100/60 text-zinc-50"
            />
            <ShowPasswordToggle
              passwordShow={passwordShow}
              setPasswordShow={setPasswordShow}
              className="absolute h-6 w-6 mr-4 right-0 top-1/2 -translate-y-3"
            />
          </div>
          {errors.password && (
            <p className="text-red-900 font-normal">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full"
        >
          {type === 'signUp' ? 'Sign up' : 'Sign in'}
        </Button>
        {authErrors.signIn && (
          <p className="text-red-900 font-normal">{authErrors.signIn}</p>
        )}
        {authErrors.signUp && (
          <p className="text-red-900 font-normal">{authErrors.signUp}</p>
        )}
      </div>
    </form>
  );
}
