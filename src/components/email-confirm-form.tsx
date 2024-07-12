'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FiSend } from 'react-icons/fi';

import { emailConfirmCodeSchema } from '@/lib/validations';
import { EmailConfirmCode } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { checkEmailConfirmCode, sendConfirmEmail } from '@/actions/actions';
import BottomNav from './bottom-nav';
import { useState, useTransition } from 'react';
import H1 from './h1';
import Subtitle from './subtitle';

export default function EmailConfirmForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<EmailConfirmCode>({
    resolver: zodResolver(emailConfirmCodeSchema),
    mode: 'onBlur',
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
      } else {
        toast.success('Code sent successfully');
        setIsCodeSent(true);
      }
    });
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
      <div className="flex-1 flex flex-col gap-4 transition-all mt-6">
        {isCodeSent ? (
          <>
            <Subtitle>
              Check your email for the code we sent, and enter it below to
              continue
            </Subtitle>
            <form className="flex-1 flex flex-col" onSubmit={onSubmit}>
              <div className="flex-1 flex flex-col">
                <div className="space-y-1">
                  <Label htmlFor="eConfCode">Confirmation Code</Label>
                  <Input
                    id="eConfCode"
                    type="number"
                    {...register('eConfCode')}
                  />
                  {errors.eConfCode && (
                    <p className="text-red-500 text-sm">
                      {errors.eConfCode.message}
                    </p>
                  )}
                </div>
              </div>
              <BottomNav>
                <Button
                  type="submit"
                  disabled={
                    !isValid || isSubmitting || (isSubmitSuccessful && !!errors)
                  }
                  isLoading={isSubmitting || (isSubmitSuccessful && !!errors)}
                >
                  Confirm email
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  onClick={async (e) => await handleGetCode(e)}
                >
                  Resend code
                </Button>
              </BottomNav>
            </form>
          </>
        ) : (
          <>
            <Subtitle>Get a confirmation code sent to your email</Subtitle>
            <div className="flex">
              <Button
                className="w-full h-16 flex gap-3"
                variant="koldupGreen"
                onClick={async (e) => await handleGetCode(e)}
                disabled={isPending}
                isLoading={isPending}
                loadingBgColor="fill-green-koldup"
              >
                <FiSend className="w-5 h-5" />
                <p>Get code</p>
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
