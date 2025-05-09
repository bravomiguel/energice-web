import Loader from '@/components/loaders/loader';
import LoadingSpinner from '@/components/loaders/loading-spinner';

export default function Loading() {
  return (
    <LoadingSpinner
      className="absolute right-0 top-0 flex flex-col gap-4 h-screen w-screen justify-center items-center"
      size={30}
      color="text-indigo-700"
    />
  );
}
