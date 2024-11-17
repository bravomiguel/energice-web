import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import PhoneOtpForm from '@/components/forms/phone-otp-form';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ otpSent?: string }>;
}) {
  const params = await searchParams;
  const isOtpSent = params.otpSent === 'true';

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H1>Confirm your phone number</H1>
        <Subtitle>
          {isOtpSent
            ? `Please enter the one-time password sent to your phone.`
            : `Please enter your phone number`}
        </Subtitle>
      </div>

      <div className="flex-1 flex flex-col gap-4 transition-all mt-6">
        <PhoneOtpForm isOtpSent={isOtpSent} />
      </div>
    </main>
  );
}
