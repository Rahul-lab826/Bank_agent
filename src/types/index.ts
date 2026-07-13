export interface CustomerProfile {
  name: string;
  age: number;
  monthlyIncome: number;
  accountBalance: number;
  totalInvestments: number;
  monthlyExpenses: number;
  monthlyEMI: number;
  monthlySurplus: number;
  netWorth: number;
  financialHealthScore: number;
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  primaryGoal: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  name: string;
  type: 'Savings' | 'Current' | 'Salary';
  balance: number;
  bankName: string;
}

export interface FinancialSummary {
  month: string;
  income: number;
  expenses: number;
  investments: number;
  savings: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'Housing' | 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Health' | 'Salary' | 'EMI' | 'Investments' | 'Shopping';
  amount: number;
  type: 'credit' | 'debit';
  merchant: string;
}

export interface SpendingCategory {
  name: string;
  value: number;
  color: string;
}

export interface InvestmentAsset {
  id: string;
  name: string;
  category: 'Mutual Funds' | 'Direct Stocks' | 'PPF' | 'EPF' | 'Fixed Deposit';
  currentValue: number;
  investedValue: number;
  returns: number; // percentage
  returnsAmount: number;
}

export interface LoanAccount {
  id: string;
  name: string;
  lender: string;
  totalAmount: number;
  outstandingBalance: number;
  emi: number;
  interestRate: number;
  tenureMonths: number;
  remainingMonths: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'Car' | 'Emergency' | 'Retirement' | 'House' | 'Travel';
  priority: 'High' | 'Medium' | 'Low';
}
