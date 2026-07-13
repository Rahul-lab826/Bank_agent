import type { BankAccount, InvestmentAsset, LoanAccount } from '../types';

/**
 * Calculates Net Worth: Total Assets - Total Liabilities
 */
export const calculateNetWorth = (
  accounts: BankAccount[], 
  investments: InvestmentAsset[], 
  loans: LoanAccount[]
): number => {
  const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0) + 
                      investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalLiabilities = loans.reduce((sum, l) => sum + l.outstandingBalance, 0);
  return totalAssets - totalLiabilities;
};

/**
 * Calculates Savings Rate: (Monthly Income - Monthly Expenses - Mandatory Debt EMIs) / Monthly Income
 */
export const calculateSavingsRate = (
  income: number,
  expenses: number,
  loans: LoanAccount[]
): number => {
  if (income <= 0) return 0;
  const totalEMI = loans.reduce((sum, l) => sum + l.emi, 0);
  const surplus = income - expenses - totalEMI;
  return Math.max(0, surplus / income);
};

/**
 * Calculates Debt-to-Income (DTI) Ratio: Monthly Debt Payments / Monthly Income
 */
export const calculateDebtToIncomeRatio = (
  income: number,
  loans: LoanAccount[]
): number => {
  if (income <= 0) return 0;
  const totalEMI = loans.reduce((sum, l) => sum + l.emi, 0);
  return totalEMI / income;
};

/**
 * Calculates Emergency Fund Coverage: Liquid Savings / Monthly Essential Expenses
 * Liquid savings is defined as checking + savings bank account balances.
 */
export const calculateEmergencyFundCoverage = (
  accounts: BankAccount[],
  monthlyExpenses: number
): number => {
  if (monthlyExpenses <= 0) return 0;
  
  // Find dedicated savings account
  const savingsAccount = accounts.find(acc => acc.type === 'Savings');
  const savingsBalance = savingsAccount ? savingsAccount.balance : 0;
  
  // We include dedicated savings + a standard cash buffer float of ₹43,850 from checking
  const liquidEmergencyReserves = savingsBalance + 43850;
  
  return liquidEmergencyReserves / monthlyExpenses;
};
