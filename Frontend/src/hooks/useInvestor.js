import { useContext } from 'react';
import { InvestorContext } from '../context/InvestorContext';

export const useInvestor = () => {
  const context = useContext(InvestorContext);
  if (!context) {
    throw new Error('useInvestor must be used within an InvestorProvider');
  }
  return context;
};
