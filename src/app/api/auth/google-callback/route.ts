import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createServerClient } from '@/lib/supabase/server';
import { createProfile } from '@/lib/actions/profile-actions';

const unitId = process.env.NEXT_PUBLIC_SWEAT440_HIGHLAND_ID;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';
  const nonmemberCheckout = searchParams.get('nonmemberCheckout') === 'true';
  const memberCheckout = searchParams.get('memberCheckout') === 'true';

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        if (memberCheckout) {
          await createProfile();
          return NextResponse.redirect(
            `${origin}/partner-membership/${unitId}?unlimitedMembership=true&founderCheckout=true`,
          );
        }

        if (nonmemberCheckout) {
          await createProfile();
          return NextResponse.redirect(
            `${origin}/profile?nonmemberCheckout=true`,
          );
        }

        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        if (memberCheckout) {
          await createProfile();
          return NextResponse.redirect(
            `https://${forwardedHost}/partner-membership/${unitId}?unlimitedMembership=true&founderCheckout=true`,
          );
        }

        if (nonmemberCheckout) {
          await createProfile();
          return NextResponse.redirect(
            `https://${forwardedHost}/profile?nonmemberCheckout=true`,
          );
        }

        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        if (memberCheckout) {
          await createProfile();
          return NextResponse.redirect(
            `${origin}/partner-membership/${unitId}?unlimitedMembership=true&founderCheckout=true`,
          );
        }

        if (nonmemberCheckout) {
          await createProfile();
          return NextResponse.redirect(
            `${origin}/profile?nonmemberCheckout=true`,
          );
        }

        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect('/signin?error=true');
}
