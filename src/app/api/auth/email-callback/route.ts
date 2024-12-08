import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { createProfile } from '@/lib/actions/profile-actions';

const unitId = process.env.NEXT_PUBLIC_SWEAT440_HIGHLAND_ID;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';
  const prelaunchCheckout = searchParams.get('prelaunchCheckout') === 'true';

  if (token_hash && type) {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.verifyOtp({ token_hash, type });

    console.log({ error });

    if (!error) {
      // redirect user to specified redirect URL or root of app
      if (prelaunchCheckout) {
        await createProfile();
        redirect(`/partner-membership/${unitId}?unlimitedMembership=true&founderCheckout=true`);
      }
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/signin?confirmError=true');
}
