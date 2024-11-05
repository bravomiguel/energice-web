'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { signupSchema } from '@/lib/validations';
import { TSignupForm } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<TSignupForm>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const [signupError, setSignupError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    // const response = await signUp({ ...data, callbackUrl });
    // if (response?.error) {
    //   console.error({ error: response.error });
    //   setSignupError(response.error);
    // }
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div className="space-y-1">
        <Label htmlFor="email" className="text-zinc-200">Email</Label>
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
            (isSubmitSuccessful && signupError === null)
          }
          isLoading={
            isSubmitting || (isSubmitSuccessful && signupError === null)
          }
          className="w-full"
        >
          Sign up
        </Button>
        {signupError && <p className="text-red-300 text-sm">{signupError}</p>}
      </div>
    </form>
  );
}
