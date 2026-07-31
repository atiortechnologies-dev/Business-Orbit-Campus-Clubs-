import { useContext } from 'react';
import { IncubationContext } from '../context/IncubationContext';

export const useIncubation = () => {
  const context = useContext(IncubationContext);
  if (!context) {
    throw new Error('useIncubation must be used within an IncubationProvider');
  }
  return context;
};
