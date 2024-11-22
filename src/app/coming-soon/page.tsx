import LogoFullText from '@/components/logos/logo-full-text';
import LogoTransparent from '@/components/logos/logo-transparent';
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';

export default function ComingSoonPage() {
  return (
    <main className="flex flex-col gap-5 justify-center items-center min-h-screen w-screen bg-custom-gradient px-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center w-full">
          <LogoTransparent className="h-20 w-20" />
          <p className="text-center font-bold text-zinc-100 text-lg">
            ENERGICE
          </p>
        </div>

        <h1 className="text-3xl font-bold text-zinc-100">
          Cold Plunge Coming Soon!
        </h1>

        <div className="w-full h-[30vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
          <Image
            src={'/coming-soon.png'}
            alt="cold plunge image"
            // className="max-w-full max-h-full"
            width={300}
            height={50}
            className="w-full"
            priority={true}
          />
        </div>

        <div className="space-y-5">
          <p className="text-lg text-zinc-200">
            Get ready for the ultimate recovery experience, coming to SWEAT440 Highland on December 1st.
          </p>

          <p className="text-lg text-zinc-200">
            Enjoy the first week of plunges completely free from December 1st -
            8th. Stay tuned!
          </p>
        </div>

        <div className="flex justify-center space-x-6">
          <a
            href="https://www.instagram.com/energicelife/"
            className="text-zinc-200 hover:text-zinc-300"
            target="_blank"
          >
            <span className="sr-only">Instagram</span>
            <FaInstagram className="h-8 w-8" />
          </a>
        </div>
      </div>
    </main>
  );
}
