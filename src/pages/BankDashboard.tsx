import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Wallet, 
  CreditCard, 
  Calendar,
  AlertCircle,
  PiggyBank
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

import { PageHeader } from '../components/PageHeader';
import { MetricCard } from '../components/MetricCard';
import { Card, CardHeader, CardContent } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

import { 
  customerProfile, 
  bankAccounts, 
  financialSummaries, 
  recentTransactions, 
  spendingCategories, 
  loans, 
  financialGoals,
  investments
} from '../mock/financialData';

export const BankDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Helper to format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const totalEMI = loans.reduce((sum, l) => sum + l.emi, 0);
  const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalLoanOutstanding = loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0);
  const totalInvestmentsVal = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const monthlySurplusVal = customerProfile.monthlyIncome - customerProfile.monthlyExpenses - totalEMI;

  // Recharts Custom Tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl">
          <p className="text-xs font-semibold text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs flex items-center gap-2" style={{ color: entry.color }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}: {formatINR(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Pie chart custom label
  const renderPieLabel = ({ percent }: any) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title={`Good morning, ${customerProfile.name.split(' ')[0]}`}
        subtitle="Here is an overview of your Apex bank accounts and investments."
        action={
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>As of today, July 13, 2026</span>
          </div>
        }
      />

      {/* Meet AI Advisor Callout (Prominent, Embedded Banner) */}
      <div className="p-6 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/20 via-indigo-950/15 to-slate-900 shadow-lg shadow-blue-500/5 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-blue-400 animate-pulse" />
            <Badge variant="accent" size="sm" className="bg-blue-500/10 border-blue-500/20 text-blue-400 font-semibold">
              Agentic Wealth Advisor
            </Badge>
          </div>
          <h2 className="font-display font-semibold text-lg text-white">
            Meet Your AI Wealth Advisor
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Your personalized financial intelligence, powered by your complete financial picture. WealthTwin AI automatically scans your balances, simulates cashflows, and builds optimal wealth strategies.
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/wealth')}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="self-start md:self-auto bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20"
        >
          Open WealthTwin
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Liquidity"
          value={formatINR(totalBalance)}
          icon={<Wallet className="h-4 w-4 text-blue-400" />}
          description="Salary & Savings accounts"
          tooltipText="Total cash available across checking and savings ledgers."
        />
        <MetricCard 
          title="Investment Value"
          value={formatINR(totalInvestmentsVal)}
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
          trend={{ value: '+18.4% total returns', isPositive: true }}
          description="Mutual Funds & Stocks"
          tooltipText="Current valuation of your external and internal portfolios."
        />
        <MetricCard 
          title="Loan Outstanding"
          value={formatINR(totalLoanOutstanding)}
          icon={<CreditCard className="h-4 w-4 text-rose-450" />}
          description={`${loans[0].remainingMonths} EMI payments left`}
          tooltipText="Remaining debt to be repaid."
        />
        <MetricCard 
          title="Monthly Surplus"
          value={formatINR(monthlySurplusVal)}
          icon={<PiggyBank className="h-4 w-4 text-indigo-400" />}
          trend={{ value: `${formatINR(monthlySurplusVal)} unallocated`, isPositive: true }}
          description="Surplus this cycle"
          tooltipText="Net positive cashflow left after regular spending and EMIs."
        />
      </div>

      {/* Grid of charts & details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Accounts & Main Cashflow Chart */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Income vs Expenses Chart */}
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <div>
                <h3 className="font-display font-semibold text-base text-white">Financial Summary</h3>
                <p className="text-xs text-slate-500">Income vs. expenses over the past 12 months</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialSummaries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#161f30" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
                    <YAxis 
                      stroke="#64748b" 
                      tickLine={false} 
                      tickFormatter={(v) => `${(v/1000)}k`}
                    />
                    <RechartsTooltip content={<CustomChartTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconSize={8}
                      iconType="circle"
                      wrapperStyle={{ color: '#94a3b8' }}
                    />
                    <Bar name="Monthly Income" dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={15} />
                    <Bar name="Total Expenses" dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={15} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Accounts Breakdown Table */}
          <Card>
            <CardHeader divider={true}>
              <h3 className="font-display font-semibold text-base text-white">Your Bank Accounts</h3>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-2">
                    <th className="py-2.5">Account Name</th>
                    <th>Account Type</th>
                    <th>Routing/Number</th>
                    <th className="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-850">
                  {bankAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-900/20 transition-all">
                      <td className="py-3 font-semibold text-white">{acc.name}</td>
                      <td>
                        <Badge 
                          variant={acc.type === 'Salary' ? 'accent' : 'info'} 
                          size="sm"
                        >
                          {acc.type}
                        </Badge>
                      </td>
                      <td className="font-mono text-slate-400">{acc.accountNumber}</td>
                      <td className="text-right font-display font-bold text-white">{formatINR(acc.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader divider={true} className="flex justify-between items-center">
              <h3 className="font-display font-semibold text-base text-white">Recent Ledger Transactions</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')}>
                View Ledger
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-2">
                    <th className="py-2.5">Merchant / Desc</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-850">
                  {recentTransactions.slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-900/20 transition-all">
                      <td className="py-3">
                        <div>
                          <div className="font-semibold text-white">{tx.merchant}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{tx.description}</div>
                        </div>
                      </td>
                      <td>
                        <Badge 
                          variant={
                            tx.category === 'Salary' ? 'success' :
                            tx.category === 'EMI' ? 'error' :
                            tx.category === 'Investments' ? 'accent' : 'neutral'
                          } 
                          size="sm"
                        >
                          {tx.category}
                        </Badge>
                      </td>
                      <td className="text-slate-450">{tx.date}</td>
                      <td className={`text-right font-display font-bold ${
                        tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-300'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}{formatINR(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Goal Planner Preview & Spending Categories */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Spending Category Pie */}
          <Card>
            <CardHeader pb-2>
              <h3 className="font-display font-semibold text-base text-white">Monthly Outflows</h3>
              <p className="text-xs text-slate-500">Expenses split by category</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-44 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                      labelLine={false}
                      label={renderPieLabel}
                    >
                      {spendingCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(v: any) => formatINR(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full space-y-2 mt-4">
                {spendingCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-950/30">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-slate-350">{category.name}</span>
                    </div>
                    <span className="font-semibold text-white">{formatINR(category.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goal Planner Preview */}
          <Card>
            <CardHeader divider={true} className="flex justify-between items-center">
              <h3 className="font-display font-semibold text-base text-white">Target Financial Goals</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {financialGoals.slice(0, 2).map((goal) => {
                const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-semibold text-white">{goal.name}</h4>
                        <p className="text-[10px] text-slate-500">Target Date: {goal.targetDate}</p>
                      </div>
                      <Badge variant={goal.priority === 'High' ? 'error' : 'neutral'} size="sm">
                        {goal.priority}
                      </Badge>
                    </div>
                    <ProgressBar 
                      value={goal.currentAmount} 
                      max={goal.targetAmount}
                      color={goal.category === 'Car' ? 'indigo' : 'green'}
                      size="sm"
                      subLabel={`${percentage}% (${formatINR(goal.currentAmount)} / ${formatINR(goal.targetAmount)})`}
                    />
                  </div>
                );
              })}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => navigate('/wealth/goals')}
              >
                Go to Goal Planner
              </Button>
            </CardContent>
          </Card>

          {/* Outstanding Loan Info */}
          <Card className="border-l-4 border-l-rose-500 bg-rose-500/5">
            <CardContent className="flex items-start gap-3 p-1">
              <AlertCircle className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Debt Advisory</h4>
                <p className="text-xs text-rose-300 mt-1 leading-normal">
                  Your personal gadget loan has an outstanding balance of <strong>{formatINR(totalLoanOutstanding)}</strong> at <strong>{loans[0].interestRate}%</strong> interest rate. Your AI Advisor suggests prepayment options using your idle monthly surplus.
                </p>
                <button 
                  onClick={() => navigate('/wealth')}
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold mt-2.5"
                >
                  Analyze debt in WealthTwin
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};
