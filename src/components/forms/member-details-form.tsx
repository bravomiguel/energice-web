'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { memberDetailsSchema } from '@/lib/validations';
import { TMemberDetailsForm } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { addMemberDetails } from '@/lib/actions/profile-actions';
import BottomNav from '../bottom-nav';

export default function MemberDetailsForm({ userName }: { userName?: string }) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<TMemberDetailsForm>({
    resolver: zodResolver(memberDetailsSchema),
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async (data) => {
    const response = await addMemberDetails(data);
    if (response?.error) {
      console.error({ error: response.error });
      toast.error(response.error);
      return;
    }
    toast.success('Member details added');
  });

  useEffect(() => {
    if (userName) {
      setValue('firstName', userName.split(' ')[0], { shouldValidate: true });
      setValue('lastName', userName.split(' ')[1], { shouldValidate: true });
    }
  }, [userName, setValue]);

  return (
    <form className="flex-1 flex flex-col" onSubmit={onSubmit}>
      <div className="flex-1 flex flex-col gap-5">
        <div className="space-y-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            {...register('firstName')}
            className=""
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            {...register('lastName')}
            className=""
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <BottomNav>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting || (isSubmitSuccessful && !!errors)}
        >
          Submit
        </Button>
      </BottomNav>
    </form>
  );
}
