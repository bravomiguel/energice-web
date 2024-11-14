'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import BottomNav from '../bottom-nav';
import { Dispatch, SetStateAction, useEffect, useTransition } from 'react';
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

export default function PhoneOtpForm({
  setShowOtpForm,
}: {
  setShowOtpForm: Dispatch<SetStateAction<boolean>>;
}) {
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
    if (token.length == 6) {
      form.trigger('token').then((isValid) => {
        if (isValid) {
          form.handleSubmit(onSubmit)(); // Call handleSubmit programmatically
        }
      });
    }
  }, [token, form]);

  const [isPending, startTransition] = useTransition();

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
            onClick={() => setShowOtpForm(false)}
          >
            Try again
          </Button>
        </BottomNav>
      </form>
    </Form>
  );
}
