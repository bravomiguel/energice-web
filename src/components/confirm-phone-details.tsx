'use client';

import { useState } from 'react';
import H1 from './h1';
import PhoneOtpForm from './phone-otp-form';
import Subtitle from './subtitle';
import PhoneConfirmForm from './phone-confirm-form';

export default function ConfirmPhoneDetails() {
  const [isNumSubmitted, setIsNumSubmitted] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-1">
        <H1>Confirm your phone number</H1>
        <Subtitle>
          {isNumSubmitted
            ? `Please enter the one-time password sent to your phone.`
            : `Please enter your phone number`}
        </Subtitle>
      </div>

      <div className="flex-1 flex flex-col gap-4 transition-all mt-6">
        {isNumSubmitted ? (
          <PhoneOtpForm />
        ) : (
          <PhoneConfirmForm setIsNumSubmitted={setIsNumSubmitted} />
        )}
      </div>
    </>
  );
}
