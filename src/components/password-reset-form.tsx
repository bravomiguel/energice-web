'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { pwResetCodeSchema } from '@/lib/validations';
import { TPasswordResetForm } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  checkPwResetCode,
  sendPwResetEmail,
  signOutAction,
  updatePassword,
} from '@/actions/actions';
import BottomNav from './bottom-nav';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import Subtitle from './subtitle';
import { FaCheckCircle } from 'react-icons/fa';
import H1 from './h1';

export default function PasswordResetForm() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<TPasswordResetForm>({
    resolver: zodResolver(pwResetCodeSchema),
    mode: 'all',
  });

  const email = watch('email');
  const pwResetCode = watch('pwResetCode');
  // const newPassword = watch('newPassword');
  // const newPasswordConfirm = watch('newPasswordConfirm');
  // console.log({ email, pwResetCode, newPassword, newPasswordConfirm });

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [isPending, startTransition] = useTransition();

  // console.log({isCodeSent, isCodeConfirmed});

  const handleGetCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const response = await sendPwResetEmail({ email });
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

  const handleConfirmCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const response = await checkPwResetCode({ email, pwResetCode });
      if (response?.error) {
        console.error({ error: response.error });
        toast.warning(response.error);
        setIsCodeSent(false);
        return;
      }
    });

    toast.success('Password reset code confirmed!');
    setIsCodeConfirmed(true);
  };

  const onSubmit = handleSubmit(async (data) => {
    const updatePwResponse = await updatePassword(data);
    if (updatePwResponse?.error) {
      console.error({ error: updatePwResponse.error });
      toast.warning(updatePwResponse.error);
      return;
    }

    toast.success('Password changed!');

    // await signOutAction();
  });

  if (isSubmitSuccessful) {
    return (
      <>
        <div className="flex flex-col flex-1 gap-4 justify-center items-center text-center px-10">
          <FaCheckCircle className="h-16 w-16 text-green-koldup" />
          <H1>Password changed successfully</H1>
          <Subtitle>
            You can now sign in with your new credentials.
          </Subtitle>
        </div>
        <BottomNav>
          <Button
            className="w-full"
            onClick={async () => await signOutAction()}
          >
            Return to signin
          </Button>
        </BottomNav>
      </>
    );
  }

  return (
    <>
      <H1>Reset Password</H1>
      <form className="flex-1 flex flex-col transition-all" onSubmit={onSubmit}>
        <div className="flex-1 flex flex-col gap-5">
          <div className={cn('flex flex-col gap-5', { hidden: isCodeSent })}>
            <Subtitle>
              Need a new password? Enter your email below to get a reset code.
            </Subtitle>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="text" {...register('email')} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div
            className={cn('flex flex-col gap-5', {
              hidden: !isCodeSent || (isCodeSent && isCodeConfirmed),
            })}
          >
            <Subtitle>
              Check your email for the code we sent, and enter it below to
              continue
            </Subtitle>

            <div className="space-y-1">
              <Label htmlFor="newPassword">Reset password code</Label>
              <Input
                id="pwResetCode"
                type="number"
                {...register('pwResetCode')}
              />
              {errors.pwResetCode && (
                <p className="text-red-500 text-sm">
                  {errors.pwResetCode.message}
                </p>
              )}
            </div>
          </div>

          <div
            className={cn('flex flex-col gap-5', {
              hidden: !isCodeConfirmed,
            })}
          >
            <Subtitle>Set your new password</Subtitle>

            <div className="space-y-1">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="newPasswordConfirm">Confirm new password</Label>
              <Input
                id="newPasswordConfirm"
                type="password"
                {...register('newPasswordConfirm')}
              />
              {errors.newPasswordConfirm && (
                <p className="text-red-500 text-sm">
                  {errors.newPasswordConfirm.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <BottomNav>
          {isCodeSent && isCodeConfirmed ? (
            <Button
              type="submit"
              disabled={!isValid || isSubmitting || isSubmitSuccessful}
              className="w-full"
            >
              Submit
            </Button>
          ) : isCodeSent ? (
            <Button
              disabled={
                isPending ||
                pwResetCode === undefined ||
                pwResetCode === '' ||
                !!errors.pwResetCode
              }
              className="w-full"
              onClick={async (e) => await handleConfirmCode(e)}
            >
              Confirm code
            </Button>
          ) : (
            <Button
              disabled={
                isPending ||
                email === undefined ||
                email === '' ||
                !!errors.email
              }
              className="w-full"
              onClick={async (e) => await handleGetCode(e)}
            >
              Get code
            </Button>
          )}
        </BottomNav>
      </form>
    </>
  );
}
