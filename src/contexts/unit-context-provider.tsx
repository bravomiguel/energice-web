'use client';

import { createContext, useContext, useState } from 'react';

// import { addPet, checkoutPet, editPet } from '@/actions/actions';
// import { toast } from 'sonner';
import { Unit } from '@prisma/client';
// import { UnitEssentials } from '@/lib/types';

type UnitContextProviderProps = {
  data: Unit[];
  children: React.ReactNode;
};

type TUnitContext = {
  units: Unit[];
  selectedUnitId: Unit['id'] | null;
  selectedUnit: Unit | undefined;
  handleChangeSelectedUnitId: (id: Unit['id']) => void;
};

export const UnitContext = createContext<TUnitContext | null>(null);

export default function UnitContextProvider({
  data: units,
  children,
}: UnitContextProviderProps) {
  // const [units, setUnits] = useState(data);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const selectedUnit = units.find((unit) => unit.id === selectedUnitId);

  const handleChangeSelectedUnitId = (id: Unit['id']) => {
    setSelectedUnitId(id);
  };

  return (
    <UnitContext.Provider
      value={{
        units,
        selectedUnitId,
        selectedUnit,
        handleChangeSelectedUnitId,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
}

export function useUnitContext() {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error('useUnitContext must be used within a UnitContextProvider');
  }

  return context;
}

