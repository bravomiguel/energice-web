'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FiSend } from 'react-icons/fi';

import { Button } from '../ui/button';
import BottomNav from '../bottom-nav';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { TPhoneOtpForm } from '@/lib/types';
import { phoneOtpSchema } from '@/lib/validations';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export default function PhoneOtpForm() {
  const form = useForm<TPhoneOtpForm>({
    resolver: zodResolver(phoneOtpSchema),
    mode: 'onChange',
  });

  // const {
  //   formState: { isValid, isSubmitting, isSubmitSuccessful, errors },
  // } = form;

  const token = form.watch('token', '');
  // console.log({ token });

  useEffect(() => {
    handleGetCode();
  }, []);

  useEffect(() => {
    if (token.length == 6) {
      form.trigger('token').then((isValid) => {
        if (isValid) {
          form.handleSubmit(onSubmit)(); // Call handleSubmit programmatically
        }
      });
    }
  }, [token, form]);

  const [isPending, startTransition] = useTransition();

  const handleGetCode = useCallback(
    async (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) e.preventDefault();
      form.setValue('token', '');
      console.log('code requested');
      // startTransition(async () => {
      //   const response = await sendConfirmEmail();
      //   if (response?.error) {
      //     console.error({ error: response.error });
      //     toast.warning(response.error);
      //     return;
      //   } else {
      //     toast.success('Code sent successfully');
      //   }
      // });
    },
    [form],
  );

  const onSubmit: (data: TPhoneOtpForm) => Promise<void> = async (
    data: TPhoneOtpForm,
  ) => {
    console.log('Code submitted');
    // const response = await checkEmailConfirmCode(data);
    // if (response?.error) {
    //   console.error({ error: response.error });
    //   toast.warning(response.error);
    //   return;
    // }
    // toast.success('Phone confirmed!');
  };

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col flex-1 w-full"
      >
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="flex-1 w-full flex flex-col items-center">
              {/* <FormLabel>One-Time Password</FormLabel> */}
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
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
              {/* <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription> */}
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />

        <BottomNav>
          {/* <Button
            type="submit"
            disabled={
              !isValid || isSubmitting || (isSubmitSuccessful && !!errors)
            }
            isLoading={isSubmitting || (isSubmitSuccessful && !!errors)}
          >
            Confirm phone
          </Button> */}
          <Button
            type="submit"
            variant="outline"
            onClick={async (e) => await handleGetCode(e)}
          >
            Resend code
          </Button>
        </BottomNav>
      </form>
    </Form>
  );
}
