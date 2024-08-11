'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { memberDetailsSchema } from '@/lib/validations';
import { TMemberDetailsForm } from '@/lib/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { addMemberDetails } from '@/actions/actions';
import BottomNav from './bottom-nav';
import { toast } from 'sonner';

export default function MemberDetailsForm() {
  const {
    register,
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
      // return;
    }
  });

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

        <div className="space-y-1">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" {...register('dob')} className="text-left" />
          <p className="text-zinc-400 text-xs">We collect this for liability reasons. See terms of service for more details.</p>
          {errors.dob && (
            <p className="text-red-500 text-sm">{errors.dob.message}</p>
          )}
        </div>
      </div>

      <BottomNav>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting || (isSubmitSuccessful && !!errors)}
          isLoading={isSubmitting || (isSubmitSuccessful && !!errors)}
        >
          Submit
        </Button>
      </BottomNav>
    </form>
  );
}
