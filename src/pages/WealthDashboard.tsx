import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Sparkles, 
  ArrowRight,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
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
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { Tooltip } from '../components/Tooltip';

// Mock Data
import { 
  bankAccounts,
  financialSummaries, 
  loans,
  financialGoals,
  investments,
  customerProfile
} from '../mock/financialData';

// Financial Intelligence Engine
import { 
  calculateNetWorth, 
  calculateSavingsRate, 
  calculateEmergencyFundCoverage, 
  calculateDebtToIncomeRatio 
} from '../engine/financialEngine';
import { calculateFinancialHealthScore } from '../engine/healthScore';

export const WealthDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Interactive explainable score state
  const [selectedFactor, setSelectedFactor] = useState<'overall' | 'savings' | 'emergency' | 'debt' | 'investment' | 'goals'>('overall');

  // Perform deterministic engine calculations
  const totalEMI = loans.reduce((sum, l) => sum + l.emi, 0);
  const netWorthVal = calculateNetWorth(bankAccounts, investments, loans);
  const savingsRateVal = calculateSavingsRate(customerProfile.monthlyIncome, customerProfile.monthlyExpenses, loans);
  const dtiVal = calculateDebtToIncomeRatio(customerProfile.monthlyIncome, loans);
  const emergencyCoverageVal = calculateEmergencyFundCoverage(bankAccounts, customerProfile.monthlyExpenses);
  const surplusVal = customerProfile.monthlyIncome - customerProfile.monthlyExpenses - totalEMI;
  const totalAssetsVal = bankAccounts.reduce((sum, a) => sum + a.balance, 0) + investments.reduce((sum, i) => sum + i.currentValue, 0);
  const totalDebtVal = loans.reduce((sum, l) => sum + l.outstandingBalance, 0);

  const healthData = calculateFinancialHealthScore(
    customerProfile.monthlyIncome,
    customerProfile.monthlyExpenses,
    bankAccounts,
    investments,
    loans,
    financialGoals
  );

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const subScores = [
    { id: 'savings', name: 'Savings Health', score: healthData.components.savings.score, weight: '25%', color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'emergency', name: 'Emergency Readiness', score: healthData.components.emergency.score, weight: '20%', color: 'text-amber-450 bg-amber-500/10' },
    { id: 'debt', name: 'Debt Management', score: healthData.components.debt.score, weight: '20%', color: 'text-blue-400 bg-blue-500/10' },
    { id: 'investment', name: 'Investment Health', score: healthData.components.investment.score, weight: '20%', color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'goals', name: 'Goal Readiness', score: healthData.components.goals.score, weight: '15%', color: 'text-indigo-400 bg-indigo-500/10' },
  ];

  const factorExplanation = {
    overall: {
      title: `Overall Score: ${healthData.overallScore}/100 (${healthData.status})`,
      formula: "Weighted Blend: Savings (25%) + Emergency (20%) + Debt (20%) + Investments (20%) + Goals (15%)",
      desc: "Your financial health is strong, driven by solid investment discipline and a healthy savings rate. To unlock an 'Excellent' rating (85+), prioritize increasing emergency readiness reserves and prepaying high-interest gadget liabilities."
    },
    savings: {
      title: `Savings Health: ${healthData.components.savings.score}/100 (${healthData.components.savings.status})`,
      formula: "Target: 20%+ Savings Rate. Current: (Income - Expenses - EMIs) / Income",
      desc: healthData.components.savings.factors[0] + " " + (healthData.components.savings.opportunities[0] || "")
    },
    emergency: {
      title: `Emergency Readiness: ${healthData.components.emergency.score}/100 (${healthData.components.emergency.status})`,
      formula: "Target: 6.0 Months. Current: Liquid safety cash / monthly expenses",
      desc: healthData.components.emergency.factors[0] + " " + (healthData.components.emergency.opportunities[0] || "")
    },
    debt: {
      title: `Debt Management: ${healthData.components.debt.score}/100 (${healthData.components.debt.status})`,
      formula: "Target: Debt Service Ratio < 10%. Current: Monthly EMIs / income",
      desc: healthData.components.debt.factors[0] + " " + (healthData.components.debt.opportunities[0] || "")
    },
    investment: {
      title: `Investment Health: ${healthData.components.investment.score}/100 (${healthData.components.investment.status})`,
      formula: "Target: 70%+ wealth allocation into index portfolios.",
      desc: healthData.components.investment.factors[0] + " " + (healthData.components.investment.opportunities[0] || "")
    },
    goals: {
      title: `Goal Readiness: ${healthData.components.goals.score}/100 (${healthData.components.goals.status})`,
      formula: "Target: Priority targets funded by target date.",
      desc: healthData.components.goals.factors.join(" ") + " " + (healthData.components.goals.opportunities[0] || "")
    }
  };

  const assetAllocationData = [
    { name: 'Liquid Savings', value: bankAccounts.reduce((sum, a) => sum + a.balance, 0), color: '#3b82f6' }, 
    { name: 'Index Mutual Funds', value: investments.filter(i => i.category === 'Mutual Funds').reduce((sum, i) => sum + i.currentValue, 0), color: '#10b981' }, 
    { name: 'Direct Equities', value: investments.filter(i => i.category === 'Direct Stocks').reduce((sum, i) => sum + i.currentValue, 0), color: '#6366f1' }, 
    { name: 'PPF Reserves', value: investments.filter(i => i.category === 'PPF').reduce((sum, i) => sum + i.currentValue, 0), color: '#f59e0b' } 
  ];

  const budgetAllocationData = [
    { name: 'Needs (Rent, Bills)', value: 40800, color: '#3b82f6' }, // 48%
    { name: 'Wants (Dining, Shopping)', value: 20400, color: '#6366f1' }, // 24%
    { name: 'Savings & Investments', value: 23800, color: '#10b981' } // 28%
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="Financial Intelligence Dashboard"
        subtitle="Holistic simulation analytics and explainable health score parameters."
        action={
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-slate-400">Advisor Status: <strong>Educational Guidance</strong></span>
          </div>
        }
      />

      {/* Main Grid: Health Score explainability vs Snapshot metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Health score parameters card (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-base text-white">Financial Health Score</h3>
                  <p className="text-xs text-slate-500">Select any metric below for detailed scoring logic</p>
                </div>
                <Badge variant="success" size="sm">Deterministic</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col md:flex-row lg:flex-col xl:flex-row items-center gap-6 py-4">
              
              {/* Score circular graphic */}
              <Tooltip text="Click center to inspect overall health algorithm formula.">
                <div 
                  onClick={() => setSelectedFactor('overall')}
                  className="relative flex items-center justify-center h-32 w-32 flex-shrink-0 cursor-pointer group active:scale-95 transition-all"
                >
                  <svg className="absolute h-full w-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#161f30" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="56" 
                      stroke="#10b981" 
                      strokeWidth="8" 
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - healthData.overallScore / 100)}
                      strokeLinecap="round"
                      fill="transparent" 
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="text-center group-hover:scale-105 transition-transform">
                    <span className="font-display text-3xl font-extrabold text-white">{healthData.overallScore}</span>
                    <span className="text-[10px] text-emerald-400 block font-semibold uppercase tracking-wider">{healthData.status}</span>
                  </div>
                </div>
              </Tooltip>

              {/* Interactive sub-scores grid */}
              <div className="flex-1 space-y-2 w-full text-xs">
                {subScores.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedFactor(item.id as any)}
                    className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      selectedFactor === item.id 
                        ? 'bg-blue-600/10 border-blue-500/30 text-white font-semibold' 
                        : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">W: {item.weight}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.score >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
                        item.score >= 70 ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-450'
                      }`}>
                        {item.score}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>

            {/* Explainable detail block */}
            <div className="p-4 bg-slate-950/50 border-t border-slate-800/80 rounded-b-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Info className="h-3.5 w-3.5 text-blue-400" />
                <span>{factorExplanation[selectedFactor].title}</span>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                {factorExplanation[selectedFactor].formula}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {factorExplanation[selectedFactor].desc}
              </p>
            </div>
          </Card>

          {/* Explainable Diagnostics: Why your score is 78 */}
          <Card>
            <CardHeader divider={true}>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                Why your score is {healthData.overallScore}
              </h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              
              {/* Positive Factors */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                  Positive Drivers (+)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-350">
                  {healthData.positiveFactors.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Areas */}
              <div className="space-y-2 pt-2 border-t border-dashed border-slate-800 md:border-t-0 lg:border-t lg:pt-2">
                <span className="text-[10px] font-bold text-amber-450 uppercase tracking-widest block">
                  Improvement Areas (-)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-350">
                  {healthData.improvementAreas.map((ia, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-450 mt-0.5 flex-shrink-0" />
                      <span>{ia}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Right: Snapshot grid and personalized insights (7 cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          {/* Financial Snapshot */}
          <Card>
            <CardHeader divider={true}>
              <h3 className="font-display font-semibold text-base text-white">Financial Snapshot</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Monthly Income</span>
                  <span className="font-display font-bold text-base text-white">{formatINR(customerProfile.monthlyIncome)}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Monthly Expenses</span>
                  <span className="font-display font-bold text-base text-white">{formatINR(customerProfile.monthlyExpenses)}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 relative group">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Monthly EMI</span>
                    <Tooltip text={`Total mandatory monthly loan EMI payments. Debt-to-income (DTI) ratio is ${(dtiVal * 100).toFixed(1)}%.`}>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <span className="font-display font-bold text-base text-white">{formatINR(totalEMI)}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 relative group">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Monthly Surplus</span>
                    <Tooltip text="Income minus expenses and loan EMIs. Available for investments.">
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <span className="font-display font-bold text-base text-blue-400">{formatINR(surplusVal)}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 relative group">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Savings Rate</span>
                    <Tooltip text="Surplus divided by Monthly Income. Standard healthy benchmark is 20%+.">
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <span className="font-display font-bold text-base text-emerald-400">{(savingsRateVal * 100).toFixed(1)}%</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 relative group">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Emergency Cover</span>
                    <Tooltip text="Emergency savings divided by regular expenses. Target target is 6.0 months.">
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <span className="font-display font-bold text-base text-amber-400">{emergencyCoverageVal.toFixed(1)} Mos</span>
                </div>

              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-blue-950/10 border border-blue-500/20 flex justify-between items-center text-xs">
                <div className="relative group">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 block font-medium">Net Position Valuation</span>
                    <Tooltip text="Total assets minus outstanding liabilities. Calculated deterministically.">
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <span className="text-white font-bold text-base font-display mt-0.5">{formatINR(netWorthVal)} Net Worth</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Total Liquid Assets</span>
                  <span className="font-semibold text-slate-350 text-xs">
                    {formatINR(totalAssetsVal)} Assets &bull; {formatINR(totalDebtVal)} Debts
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actionable financial advice panels */}
          <Card className="flex-1 flex flex-col justify-between">
            <CardHeader divider={true}>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4.5 w-4.5 text-blue-400" />
                <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                  Personalized Guidance Insights
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Insight 1: Debt */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white leading-none">Gadget Debt Prepayment</span>
                    <Badge variant="error" size="sm">Debt Burden</Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal mt-1">
                    Prepaying your {formatINR(totalDebtVal)} gadget loan yields a risk-free 10.5% educational savings return. This extinguishes your ₹12,500 EMI obligation, unlocking cash flow.
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/wealth/advisor')} 
                  className="p-0 text-blue-400 hover:text-blue-300 flex-shrink-0"
                >
                  Analyze &rarr;
                </Button>
              </div>

              {/* Insight 2: Emergency Fund */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white leading-none">Emergency Sweeps Strategy</span>
                    <Badge variant="info" size="sm">Liquidity</Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal mt-1">
                    Sweep ₹12,000 of your ₹24,000 surplus to dedicated savings accounts. This raises emergency coverage from {emergencyCoverageVal.toFixed(1)} to 6.0 months in 12 cycles.
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/wealth/twin')} 
                  className="p-0 text-blue-400 hover:text-blue-300 flex-shrink-0"
                >
                  Twin Map &rarr;
                </Button>
              </div>

            </CardContent>
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/wealth/twin')}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full justify-center"
              >
                Launch Financial Digital Twin
              </Button>
            </div>
          </Card>

        </div>

      </div>

      {/* Graphs Grid: Cashflow and Allocation splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 12-Month Cashflow Trend */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader pb-2>
              <h3 className="font-display font-semibold text-base text-white">Cash Flow Dynamics</h3>
              <p className="text-xs text-slate-500">12-month summary of income inflows vs expenses outflows</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialSummaries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#161f30" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} tickFormatter={(v) => `${(v/1000)}k`} />
                    <RechartsTooltip />
                    <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" />
                    <Area name="Monthly Income" type="monotone" dataKey="income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                    <Area name="Total Outflow" type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allocations splits: Assets & Budgets */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Spending Allocation */}
          <Card className="flex flex-col justify-between">
            <CardHeader pb-1>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">Spending Split</h3>
              <p className="text-[10px] text-slate-500">Needs vs Wants vs Savings</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-32 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {budgetAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(v: any) => formatINR(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-1.5 mt-2 text-xs">
                {budgetAllocationData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-1 rounded bg-slate-950/20">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-semibold text-white">{formatINR(item.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Asset Allocation */}
          <Card className="flex flex-col justify-between">
            <CardHeader pb-1>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">Asset Classes</h3>
              <p className="text-[10px] text-slate-500">Distribution of holdings</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-32 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(v: any) => formatINR(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-1.5 mt-2 text-xs">
                {assetAllocationData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-1 rounded bg-slate-950/20">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-semibold text-white">{formatINR(item.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Goal Readiness Grid */}
      <Card>
        <CardHeader divider={true}>
          <div className="flex items-center gap-1.5">
            <Target className="h-4.5 w-4.5 text-blue-450" />
            <h3 className="font-display font-semibold text-base text-white">Target Milestones Progress</h3>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Goal 1: Car */}
          {financialGoals.slice(0, 2).map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-slate-200">{goal.name}</h5>
                    <p className="text-[10px] text-slate-500">Target: {formatINR(goal.targetAmount)} &bull; {goal.targetDate}</p>
                  </div>
                  <Badge variant={goal.category === 'Car' ? 'accent' : 'info'} size="sm">
                    {progress.toFixed(0)}% Funded
                  </Badge>
                </div>
                <ProgressBar 
                  value={goal.currentAmount} 
                  max={goal.targetAmount} 
                  color={goal.category === 'Car' ? 'indigo' : 'green'} 
                  size="sm" 
                  subLabel={`${formatINR(goal.currentAmount)} saved / ${formatINR(goal.targetAmount)} target`} 
                />
              </div>
            );
          })}

        </CardContent>
      </Card>

      {/* Disclaimer */}
      <footer className="text-center text-[10px] text-slate-550 pt-2 pb-6 border-t border-slate-900/50">
        <span>Disclaimer: WealthTwin AI provides financial guidance, scenario analysis, and educational recommendations. We do not provide regulated investment advice.</span>
      </footer>

    </div>
  );
};
