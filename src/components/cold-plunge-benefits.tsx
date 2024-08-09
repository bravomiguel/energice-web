import { PLUNGE_BENEFITS_ARRAY } from '@/lib/constants';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';
import H2 from './h2';

export default function ColdPlungeBenefits({
  onboarding,
}: {
  onboarding: boolean;
}) {
  return (
    <>
      <section className="space-y-4">
        <p>{onboarding ? `You're one step closer to feeling incredible! 🚀` : null}</p>
        <div className="w-full h-[220px] rounded-lg overflow-hidden flex justify-center items-center bg-gray-200 shadow-md">
          <Image
            src={'/koldup-welcome-image.jpg'}
            alt="KoldUp welcome image"
            width={500}
            height={220}
            className="w-full h-full"
          />
        </div>
      </section>
      <section className="space-y-6">
        <H2 className="text-lg -mb-2">
          {onboarding ? 'Cold Plunge Benefits' : 'Benefits'}
        </H2>
        <ul className="space-y-5 pl-1">
          {PLUNGE_BENEFITS_ARRAY.map((benefit, index) => (
            <li className="flex gap-2" key={index}>
              <FaCheckCircle className="h-6 w-6 text-green-koldup" />
              <p>{benefit}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-1">
        <p className="font-medium mt-1">{`Take the plunge into a happier you!`}</p>
      </section>
    </>
  );
}
