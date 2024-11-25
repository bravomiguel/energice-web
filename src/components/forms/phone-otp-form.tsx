'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import BottomNav from '../bottom-nav';
import { useEffect, useRef, useTransition } from 'react';
import { TPhoneOtpForm } from '@/lib/types';
import { phoneOtpSchema } from '@/lib/validations';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/actions/profile-actions';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

export default function PhoneOtpForm({ isOtpSent }: { isOtpSent: boolean }) {
  const form = useForm<TPhoneOtpForm>({
    resolver: zodResolver(phoneOtpSchema),
    mode: 'onChange',
  });

  const {
    formState: { isValid, isSubmitting, errors },
  } = form;

  // console.log({isValid, errors: errors.token})

  const phone = form.watch('phone', '');
  const token = form.watch('token', '');
  // console.log({ phone });
  // console.log({ token });

  const [isPending, startTransition] = useTransition();
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const tokenInputRef = useRef<HTMLInputElement>(null);

  const handleSendOtp = async (data: Pick<TPhoneOtpForm, 'phone'>) => {
    const validatedData = phoneOtpSchema.pick({ phone: true }).safeParse(data);

    if (!validatedData.success) {
      toast.warning('Invalid phone format.');
      return;
    }

    const { phone } = validatedData.data;

    startTransition(async () => {
      const response = await sendPhoneOtp({ phone });
      if (response?.error) {
        console.error({ error: response.error });
        toast.warning(response.error);
        return;
      }
    });
  };

  const onSubmit: (data: TPhoneOtpForm) => Promise<void> = async (
    data: TPhoneOtpForm,
  ) => {
    const response = await verifyPhoneOtp(data);
    if (response?.error) {
      console.error({ error: response.error });
      toast.warning(response.error);
      form.setValue('token', '');
      return;
    }
    toast.success('Phone confirmed');
  };

  useEffect(() => {
    if (token.length == 6) {
      form.trigger('token').then((isValid) => {
        if (isValid) {
          if (submitBtnRef.current) submitBtnRef.current.click();
          if (tokenInputRef.current) tokenInputRef.current.blur();
        }
      });
    }
  }, [token, form]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col flex-1 w-full"
        >
          <Controller
            name="phone"
            control={form.control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div
                className={cn('flex flex-col items-center w-full', {
                  hidden: isOtpSent,
                })}
              >
                <div className="space-y-1 w-80">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    className="h-12"
                    value={value}
                    onChange={(e) => {
                      // Remove all non-numeric characters
                      const rawValue = e.target.value.replace(/\D/g, '');

                      // Format based on length of the input
                      let formattedValue = rawValue;
                      if (rawValue.length > 3 && rawValue.length <= 6) {
                        formattedValue = `(${rawValue.slice(
                          0,
                          3,
                        )})-${rawValue.slice(3)}`;
                      } else if (rawValue.length > 6) {
                        formattedValue = `(${rawValue.slice(
                          0,
                          3,
                        )})-${rawValue.slice(3, 6)}-${rawValue.slice(6, 10)}`;
                      } else if (rawValue.length > 0) {
                        formattedValue = `(${rawValue}`;
                      }

                      onChange(formattedValue);
                    }}
                  />
                  {error && (
                    <p className="text-red-500 text-sm">{error.message}</p>
                  )}
                </div>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem
                className={cn('flex-1 w-full flex flex-col items-center', {
                  hidden: !isOtpSent,
                })}
              >
                {/* <FormLabel>One-Time Password</FormLabel> */}
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    ref={tokenInputRef}
                    type="tel"
                    inputMode="numeric"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-sm font-normal -translate-x-2" />
              </FormItem>
            )}
          />

          {isOtpSent && (
            <BottomNav>
              <Button
                ref={submitBtnRef}
                type="submit"
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/confirm-phone';
                }}
              >
                Try again
              </Button>
            </BottomNav>
          )}
        </form>
      </Form>
      {!isOtpSent && (
        <BottomNav>
          <Button
            disabled={phone.length === 0 || !!errors.phone}
            isLoading={isPending}
            onClick={async () => handleSendOtp({ phone })}
          >
            Continue
          </Button>
        </BottomNav>
      )}
    </>
  );
}
