'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { PartnerMemberSchema } from '@/lib/validations';
import { TPartnerMemberForm } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import BottomNav from '../bottom-nav';
import { Unit } from '@prisma/client';
import { confirmPartnerMembership } from '@/lib/actions/profile-actions';
import { useState } from 'react';

export default function PartnerMemberForm({
  unitId,
  navToUnit,
}: {
  unitId: Unit['id'];
  navToUnit: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<TPartnerMemberForm>({
    resolver: zodResolver(PartnerMemberSchema),
    mode: 'onBlur',
  });

  const [noEmailFoundError, setNoEmailFoundError] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setNoEmailFoundError(false);
    const response = await confirmPartnerMembership({
      ...data,
      navToUnit,
      unitId,
    });
    if (response?.error) {
      setNoEmailFoundError(true);
      console.error({ error: response.error });
      toast.error(response.error);
      return;
    }
    toast.success('SWEAT440 membership confirmed!');
  });

  return (
    <form className="flex-1 flex flex-col" onSubmit={onSubmit}>
      <div className="flex-1 flex flex-col gap-5">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            {...register('email')}
            onChange={() => setNoEmailFoundError(false)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {noEmailFoundError && (
          <p className="text-red-500 text-sm">{`This may be because we haven't updated our records since you became a member. Please try again tomorrow.`}</p>
        )}
      </div>

      <BottomNav>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </BottomNav>
    </form>
  );
}
