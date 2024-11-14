'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import BottomNav from '../bottom-nav';
import { Dispatch, SetStateAction } from 'react';
import { TPhoneConfirmForm } from '@/lib/types';
import { sleep } from '@/lib/utils';
import { phoneConfirmSchema } from '@/lib/validations';
import { sendPhoneOtp } from '@/actions/actions';

export default function PhoneForm({
  setShowOtpForm,
}: {
  setShowOtpForm: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<TPhoneConfirmForm>({
    resolver: zodResolver(phoneConfirmSchema),
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (data) => {
    await sleep(300);
    setShowOtpForm(true);
    // const response = await sendPhoneOtp(data);
    // if (response?.error) {
    //   console.error({ error: response.error });
    //   toast.warning(response.error);
    //   return;
    // }
    // setShowOtpForm(true);
  });

  return (
    <form className="flex-1 flex flex-col" onSubmit={onSubmit}>
      <Controller
        name="phone"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div className="flex-1 flex flex-col">
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={value}
                onChange={(e) => {
                  // Remove all non-numeric characters
                  const rawValue = e.target.value.replace(/\D/g, '');

                  // console.log({ formValue: e.target.value });
                  // console.log({ rawValue });

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
              {error && <p className="text-red-500 text-sm">{error.message}</p>}
            </div>
          </div>
        )}
      />

      <BottomNav>
        <Button
          type="submit"
          disabled={
            !isValid || isSubmitting || (isSubmitSuccessful && !!errors)
          }
          isLoading={isSubmitting || (isSubmitSuccessful && !!errors)}
        >
          Continue
        </Button>
      </BottomNav>
    </form>
  );
}
