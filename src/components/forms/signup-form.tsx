'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { signupSchema } from '@/lib/validations';
import { TSignupForm } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { signUpAction } from '@/actions/actions';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TSignupForm>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const [signupError, setSignupError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    const response = await signUpAction(data);
    if (response?.error) {
      console.error({ error: response.error });
      setSignupError(response.error);
    }
    reset();
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
          className="border-zinc-200 font-normal focus-visible:text-zinc-900 focus-visible:ring-indigo-950 focus-visible:bg-zinc-100/70 text-zinc-50"
        />
        {errors.email && (
          <p className="text-red-300 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
          className="w-full"
        >
          Sign up
        </Button>
        {signupError && <p className="text-red-300 text-sm">{signupError}</p>}
      </div>
    </form>
  );
}
