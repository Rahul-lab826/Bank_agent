import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardContent } from '../components/Card';
import { MetricCard } from '../components/MetricCard';
import { Badge } from '../components/Badge';
import { Wallet, TrendingUp, Cpu } from 'lucide-react';
import { bankAccounts, recentTransactions, investments } from '../mock/financialData';

const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export const AccountsPlaceholder: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Accounts Summary" subtitle="Manage checking, savings, and salary accounts in real-time." showBackButton={true} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bankAccounts.map((acc) => (
          <MetricCard 
            key={acc.id} 
            title={`${acc.bankName} — ${acc.type}`}
            value={formatINR(acc.balance)} 
            icon={<Wallet className="h-4 w-4 text-blue-400" />} 
            description={acc.accountNumber} 
          />
        ))}
      </div>
      <Card>
        <CardHeader divider={true}>
          <h3 className="font-display font-semibold text-sm text-white">Accounts Settings & Details</h3>
        </CardHeader>
        <CardContent className="text-xs text-slate-500 py-4 text-center">
          Core checking account statements and direct debit setups can be managed here. Connect WealthTwin to link external bank portals.
        </CardContent>
      </Card>
    </div>
  );
};

export const TransactionsPlaceholder: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Ledger Transactions" subtitle="Complete statement of core checking accounts." showBackButton={true} />
      <Card>
        <CardHeader divider={true}>
          <h3 className="font-display font-semibold text-sm text-white">Statement Logs</h3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-2">
                <th className="py-2.5">Merchant</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-850">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/20 transition-all">
                  <td className="py-3">
                    <div>
                      <div className="font-semibold text-white">{tx.merchant}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{tx.description}</div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={tx.type === 'credit' ? 'success' : 'neutral'} size="sm">
                      {tx.category}
                    </Badge>
                  </td>
                  <td className="text-slate-450">{tx.date}</td>
                  <td className={`text-right font-display font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-350'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatINR(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export const InvestmentsPlaceholder: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Investments Portal" subtitle="Portfolio balances synced from external brokerage ledgers." showBackButton={true} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Holdings" 
          value={formatINR(480000)} 
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />} 
          trend={{ value: '18.4% return', isPositive: true }}
          description="Across 4 mutual funds & stocks" 
        />
        <MetricCard 
          title="Invested Capital" 
          value={formatINR(407000)} 
          icon={<Wallet className="h-4 w-4 text-blue-400" />} 
          description="Net capital outflows" 
        />
        <MetricCard 
          title="Total Returns Value" 
          value={formatINR(73000)} 
          icon={<Cpu className="h-4 w-4 text-indigo-400" />} 
          description="Net profit accumulation" 
        />
      </div>
      <Card>
        <CardHeader divider={true}>
          <h3 className="font-display font-semibold text-sm text-white">Investment Asset Breakdown</h3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-2">
                <th className="py-2.5">Asset Name</th>
                <th>Category</th>
                <th className="text-right">Invested</th>
                <th className="text-right">Valuation</th>
                <th className="text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-850">
              {investments.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/20 transition-all">
                  <td className="py-3 font-semibold text-white">{inv.name}</td>
                  <td>
                    <Badge variant="info" size="sm">{inv.category}</Badge>
                  </td>
                  <td className="text-right font-display text-slate-350">{formatINR(inv.investedValue)}</td>
                  <td className="text-right font-display font-semibold text-white">{formatINR(inv.currentValue)}</td>
                  <td className="text-right font-display font-bold text-emerald-400">+{formatINR(inv.returnsAmount)} (+{inv.returns}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
