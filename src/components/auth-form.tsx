'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TAuthForm, authFormSchema } from '@/lib/validations';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { signInAction, signUp } from '@/actions/actions';

type AuthFormProps = {
  type: 'signUp' | 'signIn';
};

export default function PetForm({ type }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isValidating },
  } = useForm<TAuthForm>({
    resolver: zodResolver(authFormSchema),
    mode: 'all',
  });

  const onSubmit = handleSubmit(async (data) => {
    // console.log({ data });
    if (type === 'signIn') {
      await signInAction(data);
    } else {
      await signUp(data);
    }
  });

  return (
    <form className="flex flex-col gap-10 px-6" onSubmit={onSubmit}>
      <div className='space-y-3'>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} className='focus-visible:ring-2 focus-visible:indigo focus-visible:text-zinc-900 focus-visible:bg-zinc-100/60 text-zinc-50' />
          {errors.email && <p className="text-red-200 font-extralight">{errors.email.message}</p>}
        </div>
  
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type='password' {...register('password')} className='focus-visible:ring-2 focus-visible:indigo focus-visible:text-zinc-900 focus-visible:bg-zinc-100/60 text-zinc-50' />
          {errors.password && (
            <p className="text-red-200 font-extralight">{errors.password.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={!isValid}>{type === "signUp" ? "Sign up" : "Sign in"}</Button>
    </form>
  );
}
