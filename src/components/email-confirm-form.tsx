'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { emailConfirmCodeSchema } from '@/lib/validations';
import { EmailConfirmCode } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { checkEmailConfirmCode, sendConfirmEmail } from '@/actions/actions';
import BottomNav from './bottom-nav';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';

export default function EmailConfirmForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailConfirmCode>({
    resolver: zodResolver(emailConfirmCodeSchema),
    mode: 'onChange',
  });

  const [isCodeSent, setIsCodeSent] = useState(false);
  // const [isSubmitError, setIsSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit(async (data) => {
    const response = await checkEmailConfirmCode(data);
    if (response?.error) {
      console.error({ error: response.error });
      // setIsSubmitError(response.error);
      toast.warning(response.error);
      return;
    }
    toast.success('Email confirmed!');
  });

  return (
    <form className="flex-1 flex flex-col" onSubmit={onSubmit}>
      <div className="flex-1 flex flex-col gap-5">
        <div className="space-y-1">
          <Label
            htmlFor="eConfCode"
            className={cn({ 'text-zinc-400': !isCodeSent })}
          >
            Confirmation Code
          </Label>
          <Input
            id="eConfCode"
            type="number"
            {...register('eConfCode')}
            disabled={!isCodeSent}
            className={cn('placeholder:italic', { 'bg-zinc-300': !isCodeSent })}
            placeholder={
              !isCodeSent
                ? 'Hit send code below to get your code'
                : 'Enter 6 digit code here'
            }
          />
          {errors.eConfCode && (
            <p className="text-red-500 text-sm">{errors.eConfCode.message}</p>
          )}
          {/* {isSubmitError && (
            <p className="text-red-500 text-sm">{isSubmitError}</p>
          )} */}
        </div>
        <Button
          disabled={isPending || isSubmitting}
          variant="koldupBlue"
          onClick={async (e) => {
            e.preventDefault();

            startTransition(async () => {
              const response = await sendConfirmEmail();
              if (response?.error) {
                console.error({ error: response.error });
                toast.warning(response.error);
                setIsCodeSent(false);
                return;
              }
            });

            toast.success('Code sent successfully');
            setIsCodeSent(true);
          }}
        >
          {!isCodeSent ? 'Send code' : 'Resend code'}
        </Button>
      </div>

      <BottomNav>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full"
        >
          Submit
        </Button>
      </BottomNav>
    </form>
  );
}
