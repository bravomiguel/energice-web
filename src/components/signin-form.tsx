'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signinSchema } from '@/lib/validations';
import { TSigninForm } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

export default function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<TSigninForm>({
    resolver: zodResolver(signinSchema),
    mode: 'onBlur',
  });
  const [signinError, setSigninError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    // const response = await signInAction({ ...data, callbackUrl });
    // if (response?.error) {
    //   console.error({ error: response.error });
    //   setSigninError(response.error);
    // }
  });

  return (
  <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div className="space-y-1">
        <Label htmlFor="email" className="text-zinc-200">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className="border-zinc-200 focus-visible:text-zinc-900 focus-visible:bg-zinc-100/60 text-zinc-50"
        />
        {errors.email && (
          <p className="text-red-300 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Button
          type="submit"
          disabled={
            !isValid ||
            isSubmitting ||
            (isSubmitSuccessful && signinError === null)
          }
          isLoading={
            isSubmitting || (isSubmitSuccessful && signinError === null)
          }
          className="w-full"
        >
          Sign in
        </Button>
        {signinError && <p className="text-red-300 text-sm">{signinError}</p>}
      </div>
    </form>
  );
}
