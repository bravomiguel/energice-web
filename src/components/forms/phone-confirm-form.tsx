'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FiSend } from 'react-icons/fi';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import BottomNav from '../bottom-nav';
import { Dispatch, SetStateAction, useState, useTransition } from 'react';
import { TPhoneConfirmForm } from '@/lib/types';
import { z } from 'zod';
import { sleep } from '@/lib/utils';
import { phoneConfirmSchema } from '@/lib/validations';

export default function PhoneConfirmForm({
  setIsNumSubmitted,
}: {
  setIsNumSubmitted: Dispatch<SetStateAction<boolean>>;
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
    setIsNumSubmitted(true);
    // const response = await checkEmailConfirmCode(data);
    // if (response?.error) {
    //   console.error({ error: response.error });
    //   toast.warning(response.error);
    //   return;
    // }
    // toast.success('Email confirmed!');
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
