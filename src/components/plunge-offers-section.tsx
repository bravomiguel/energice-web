'use client';

import { Profile } from '@prisma/client';
import H2 from './h2';

export default function PlungeOffersSection({
  isOnboarded,
}: {
  isOnboarded: boolean;
}) {
  if (!isOnboarded) {
    return null;
  }

  return (
    <section className="space-y-4">
      <H2 className="mb-3">Offers</H2>
    </section>
  );
}
