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
import Link from 'next/link';

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

  const onSubmit = handleSubmit(async (data) => {
    const response = await confirmPartnerMembership({
      ...data,
      navToUnit,
      unitId,
    });
    if (response?.error) {
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
          <Input id="email" type="text" {...register('email')} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <p className="text-zinc-500 text-sm">{`Note for new members: Our system can take up to 48 hours to update. If your membership is not coming up, please contact us below and we'll get this resolved ASAP.`}</p>
      </div>

      <BottomNav>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        >
          Submit
        </Button>
        <Link
          href="https://energicelife.com/#help-and-support"
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            Contact us
          </Button>
        </Link>
      </BottomNav>
    </form>
  );
}
