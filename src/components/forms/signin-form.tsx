'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';

import { signinSchema } from '@/lib/validations';
import { TSigninForm } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { signinWithEmail, signinWithGoogle } from '@/lib/actions';
import { Icons } from '../ui/icons';
import { FaGoogle } from 'react-icons/fa';
import { Mail } from 'lucide-react';

export default function SigninForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TSigninForm>({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
  });

  const [signupError, setSignupError] = useState<string | null>(null);
  const [googleSigninError, setGoogleSigninError] = useState<string | null>(
    null,
  );
  const [isGoogleSigninPending, startTransition] = useTransition();

  const handleGoogleSignin = async () => {
    startTransition(async () => {
      const response = await signinWithGoogle();
      if (response?.error) {
        console.error({ error: response.error });
        setGoogleSigninError(response.error);
      }
      reset();
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    const response = await signinWithEmail(data);
    if (response?.error) {
      console.error({ error: response.error });
      setSignupError(response.error);
    }
    reset();
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          {/* <Label htmlFor="email" className="text-zinc-200">
            Email
          </Label> */}
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

        <div className="space-y-2">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            // isLoading={isSubmitting}
            className="w-full normal-case"
          >
            {isSubmitting ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Continue with Email
          </Button>
          {signupError && <p className="text-red-300 text-sm">{signupError}</p>}
        </div>
      </form>

      <div className="relative mt-4 text-zinc-200 flex justify-center items-center gap-2 w-full">
        <span className="border-t flex-1" />
        <span className="bg-background text-muted-foreground text-xs uppercase">
          Or
        </span>
        <span className="border-t flex-1" />
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full mt-4 normal-case bg-zinc-100 hover:bg-zinc-200"
          onClick={async () => await handleGoogleSignin()}
          disabled={isSubmitting || isGoogleSigninPending}
        >
          {isGoogleSigninPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>
        {googleSigninError && (
          <p className="text-red-300 text-sm">{googleSigninError}</p>
        )}
      </div>
    </div>
  );
}
