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
import H1 from './h1';
import Subtitle from './subtitle';

export default function EmailConfirmForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<EmailConfirmCode>({
    resolver: zodResolver(emailConfirmCodeSchema),
    mode: 'onChange',
  });

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGetCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
  };

  const onSubmit = handleSubmit(async (data) => {
    const response = await checkEmailConfirmCode(data);
    if (response?.error) {
      console.error({ error: response.error });
      toast.warning(response.error);
      return;
    }
    toast.success('Email confirmed!');
  });

  return (
    <>
      <H1>Confirm your email</H1>
      <form className="flex-1 flex flex-col" onSubmit={onSubmit}>
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Subtitle>
              {isCodeSent
                ? 'Check your email for the code we sent, and enter it below to continue'
                : 'Get a confirmation code sent to your email, by hitting get code below'}
            </Subtitle>
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
                className={cn({
                  'bg-zinc-300': !isCodeSent,
                })}
              />
              {errors.eConfCode && (
                <p className="text-red-500 text-sm">
                  {errors.eConfCode.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <BottomNav>
          {isCodeSent ? (
            <Button
              type="submit"
              disabled={!isValid || isSubmitting || isSubmitSuccessful}
              className="w-full"
            >
              Confirm email
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={async (e) => await handleGetCode(e)}
              disabled={isPending}
            >
              Get code
            </Button>
          )}
        </BottomNav>
      </form>
    </>
  );
}
