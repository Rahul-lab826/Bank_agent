import type { 
  CustomerProfile, 
  BankAccount, 
  FinancialSummary, 
  Transaction, 
  SpendingCategory, 
  InvestmentAsset, 
  LoanAccount, 
  FinancialGoal 
} from '../types';

export const customerProfile: CustomerProfile = {
  name: 'Arjun Mehta',
  age: 28,
  monthlyIncome: 85000,
  accountBalance: 340000,
  totalInvestments: 480000,
  monthlyExpenses: 48500,
  monthlyEMI: 12500,
  monthlySurplus: 24000,
  netWorth: 672000,
  financialHealthScore: 78,
  riskProfile: 'Moderate',
  primaryGoal: 'Buy a car'
};

export const bankAccounts: BankAccount[] = [
  {
    id: 'acc_1',
    accountNumber: '•••• •••• 4821',
    name: 'Primary Salary Account',
    type: 'Salary',
    balance: 185000,
    bankName: 'Apex Digital Bank'
  },
  {
    id: 'acc_2',
    accountNumber: '•••• •••• 9205',
    name: 'Emergency Savings Account',
    type: 'Savings',
    balance: 155000,
    bankName: 'Apex Digital Bank'
  }
];

export const financialSummaries: FinancialSummary[] = [
  { month: 'Jul 25', income: 80000, expenses: 45000, investments: 20000, savings: 15000 },
  { month: 'Aug 25', income: 80000, expenses: 47000, investments: 20000, savings: 13000 },
  { month: 'Sep 25', income: 82000, expenses: 46000, investments: 22000, savings: 14000 },
  { month: 'Oct 25', income: 82000, expenses: 48000, investments: 22000, savings: 12000 },
  { month: 'Nov 25', income: 82000, expenses: 52000, investments: 20000, savings: 10000 },
  { month: 'Dec 25', income: 95000, expenses: 60000, investments: 25000, savings: 10000 }, // Bonus month
  { month: 'Jan 26', income: 85000, expenses: 48000, investments: 24000, savings: 13000 },
  { month: 'Feb 26', income: 85000, expenses: 47500, investments: 25000, savings: 12500 },
  { month: 'Mar 26', income: 85000, expenses: 49000, investments: 24000, savings: 12000 },
  { month: 'Apr 26', income: 85000, expenses: 48500, investments: 24000, savings: 12500 },
  { month: 'May 26', income: 85000, expenses: 48000, investments: 24000, savings: 13000 },
  { month: 'Jun 26', income: 85000, expenses: 48500, investments: 24000, savings: 12500 }
];

export const recentTransactions: Transaction[] = [
  {
    id: 'tx_1',
    date: '2026-07-12',
    description: 'Salary Credit - TechCorp Solutions',
    category: 'Salary',
    amount: 85000,
    type: 'credit',
    merchant: 'TechCorp Solutions Inc'
  },
  {
    id: 'tx_2',
    date: '2026-07-10',
    description: 'Monthly EMI Auto-Debit',
    category: 'EMI',
    amount: 12500,
    type: 'debit',
    merchant: 'Apex Credit Services'
  },
  {
    id: 'tx_3',
    date: '2026-07-08',
    description: 'Systematic Investment Plan (SIP) Debit',
    category: 'Investments',
    amount: 15000,
    type: 'debit',
    merchant: 'Groww Mutual Fund'
  },
  {
    id: 'tx_4',
    date: '2026-07-06',
    description: 'Electricity & Wi-Fi Bill',
    category: 'Utilities',
    amount: 4500,
    type: 'debit',
    merchant: 'State Power Board & Jio'
  },
  {
    id: 'tx_5',
    date: '2026-07-05',
    description: 'Dine-Out with Friends',
    category: 'Food',
    amount: 3200,
    type: 'debit',
    merchant: 'The Olive Bistro'
  },
  {
    id: 'tx_6',
    date: '2026-07-03',
    description: 'Supermarket Groceries',
    category: 'Food',
    amount: 5800,
    type: 'debit',
    merchant: 'DMart Superstore'
  },
  {
    id: 'tx_7',
    date: '2026-07-02',
    description: 'Uber Ride to Office',
    category: 'Transport',
    amount: 650,
    type: 'debit',
    merchant: 'Uber India'
  },
  {
    id: 'tx_8',
    date: '2026-06-29',
    description: 'Quarterly Insurance Premium',
    category: 'Utilities',
    amount: 6000,
    type: 'debit',
    merchant: 'HDFC Ergo Life'
  },
  {
    id: 'tx_9',
    date: '2026-06-28',
    description: 'House Rent Transfer',
    category: 'Housing',
    amount: 22000,
    type: 'debit',
    merchant: 'Landlord Rent Account'
  },
  {
    id: 'tx_10',
    date: '2026-06-25',
    description: 'Movie and Dinner',
    category: 'Entertainment',
    amount: 2500,
    type: 'debit',
    merchant: 'PVR Cinemas'
  }
];

export const spendingCategories: SpendingCategory[] = [
  { name: 'Housing & Rent', value: 22000, color: '#3b82f6' }, // Trustworthy blue
  { name: 'Groceries & Dining', value: 9000, color: '#10b981' }, // Green
  { name: 'Bills & Utilities', value: 10500, color: '#6366f1' }, // Indigo
  { name: 'Transport & Fuel', value: 3500, color: '#f59e0b' }, // Amber
  { name: 'Entertainment & Shopping', value: 3500, color: '#ec4899' } // Pink
];

export const investments: InvestmentAsset[] = [
  {
    id: 'inv_1',
    name: 'Nifty 50 Index Mutual Fund',
    category: 'Mutual Funds',
    currentValue: 195000,
    investedValue: 160000,
    returns: 21.87,
    returnsAmount: 35000
  },
  {
    id: 'inv_2',
    name: 'Parag Parikh Flexi Cap Fund',
    category: 'Mutual Funds',
    currentValue: 145000,
    investedValue: 120000,
    returns: 20.83,
    returnsAmount: 25000
  },
  {
    id: 'inv_3',
    name: 'Direct Equities (Bluechip Portfolio)',
    category: 'Direct Stocks',
    currentValue: 80000,
    investedValue: 72000,
    returns: 11.11,
    returnsAmount: 8000
  },
  {
    id: 'inv_4',
    name: 'Public Provident Fund (PPF)',
    category: 'PPF',
    currentValue: 60000,
    investedValue: 55000,
    returns: 9.09,
    returnsAmount: 5000
  }
];

export const loans: LoanAccount[] = [
  {
    id: 'loan_1',
    name: 'Personal Gadget/Upgrade Loan',
    lender: 'Apex Credit Services',
    totalAmount: 250000,
    outstandingBalance: 148000,
    emi: 12500,
    interestRate: 10.5,
    tenureMonths: 20,
    remainingMonths: 12
  }
];

export const financialGoals: FinancialGoal[] = [
  {
    id: 'goal_1',
    name: 'Buy a Hatchback Car',
    targetAmount: 600000,
    currentAmount: 400000, // 67% funded
    targetDate: '2027-12-31',
    category: 'Car',
    priority: 'High'
  },
  {
    id: 'goal_2',
    name: '6-Month Emergency Buffer',
    targetAmount: 300000,
    currentAmount: 245000,
    targetDate: '2026-12-31',
    category: 'Emergency',
    priority: 'High'
  },
  {
    id: 'goal_3',
    name: 'Early Retirement Fund (5 Cr)',
    targetAmount: 50000000,
    currentAmount: 480000,
    targetDate: '2056-08-15',
    category: 'Retirement',
    priority: 'Medium'
  }
];
