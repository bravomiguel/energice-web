'use client';

import Link from 'next/link';
import { IoChevronForward } from 'react-icons/io5';

export default function ProfileSettings() {
  return (
    <>
      <SettingsItem label="Help and support" href={'https://koldup.com/'} />
      <SettingsItem label="Terms and conditions" href={'https://koldup.com/'} />
      <SettingsItem label="Privacy policy" href={'https://koldup.com/'} />
      <SettingsItem label="Retake your Health Quiz" href={'/health-quiz'} />
      <SettingsItem label="Download your data" href={'https://koldup.com/'} />
      <SettingsItem label="Download your waiver" href={'https://koldup.com/'} />
    </>
  );
}

function SettingsItem({ label, href }: { label: string; href?: any }) {
  return (
    <Link
      className="flex items-center justify-between text-zinc-600 border-b border-zinc-200 py-4"
      href={href ?? ''}
    >
      <p>{label}</p>
      <IoChevronForward className="w-5 h-5" />
    </Link>
  );
}
