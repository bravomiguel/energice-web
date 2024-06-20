import Loader from '@/components/loader';
import LoadingSpinner from '@/components/loading-spinner';

export default function Loading() {
  return (
    <LoadingSpinner
      className="absolute right-0 top-0 flex flex-col gap-4 h-screen w-screen justify-center items-center"
      size={35}
      color="text-indigo-700"
    />
  );
}
