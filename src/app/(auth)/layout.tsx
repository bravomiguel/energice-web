import H1 from '@/components/h1';
import LogoTransparent from '@/components/logo-transparent';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen w-screen bg-custom-gradient px-6">
      <div className="flex flex-col items-center">
        <LogoTransparent className="h-20 w-20" />
        <H1 className="text-center font-bold text-zinc-100 text-2xl mb-5">
          Energice
        </H1>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
