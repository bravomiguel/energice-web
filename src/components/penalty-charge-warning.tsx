import { IoWarningOutline } from 'react-icons/io5';

export default function PenaltyChargeWarning() {
  return (
    <div className="flex gap-3 items-center pt-2">
      <IoWarningOutline className="ml-1 h-8 w-8 text-red-500 self-start" />
      <p className="text-600 text-red-500 font-semibold w-fit pr-2 text-xs">
        {`Make sure to close the lid when you're done to avoid an extra
    session charge`}
      </p>
    </div>
  );
}
