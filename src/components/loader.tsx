'use client';

import { PuffLoader, PulseLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div className="h-[70vh] flex flex-col justify-center items-center">
      <PulseLoader
        size={100}
        // color="#4285f4ff"
        color="#4338ca"
      />
    </div>
  );
}
