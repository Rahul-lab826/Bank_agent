import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  Target, 
  Activity, 
  DollarSign, 
  ChevronRight,
  Info,
  HelpCircle
} from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Tooltip } from '../components/Tooltip';

// Mock Data
import { customerProfile, bankAccounts, investments, loans, financialGoals } from '../mock/financialData';

// Financial Engine
import { calculateNetWorth, calculateSavingsRate, calculateEmergencyFundCoverage } from '../engine/financialEngine';
import { analyzeGoal } from '../engine/goalEngine';
import { calculateFinancialHealthScore } from '../engine/healthScore';

export const DigitalTwin: React.FC = () => {
  const navigate = useNavigate();
  // Available nodes for selection
  type NodeType = 'twin' | 'income' | 'cashflow' | 'savings' | 'investments' | 'liabilities' | 'goals';
  const [selectedNode, setSelectedNode] = useState<NodeType>('twin');

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Perform deterministic engine calculations
  const totalEMI = loans.reduce((sum, l) => sum + l.emi, 0);
  const netWorthVal = calculateNetWorth(bankAccounts, investments, loans);
  const savingsRateVal = calculateSavingsRate(customerProfile.monthlyIncome, customerProfile.monthlyExpenses, loans);
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

  const carGoal = financialGoals.find(g => g.category === 'Car');
  const carGoalReport = carGoal ? analyzeGoal(carGoal) : { progressPercent: 67, requiredMonthlyContribution: 11765 };




  // Node telemetry details
  const nodeDetails = {
    twin: {
      name: "Arjun's Financial Twin",
      subtitle: "Unified System State",
      metrics: [
        { label: "Total Assets", value: formatINR(totalAssetsVal), color: "text-emerald-400" },
        { label: "Total Liabilities", value: formatINR(totalDebtVal), color: "text-rose-455" },
        { label: "Net Worth Position", value: formatINR(netWorthVal), color: "text-blue-400" }
      ],
      desc: `This Digital Twin is an active contextual simulation of your complete financial footprint. It maps checking ledgers, investment portfolios, active debts, and budget structures to evaluate your overall health score (${healthData.overallScore}/100).`
    },
    income: {
      name: "Income Flow Node",
      subtitle: "Inflow Channel",
      metrics: [
        { label: "Monthly Gross salary", value: formatINR(customerProfile.monthlyIncome), color: "text-white" },
        { label: "Annualized Run-Rate", value: formatINR(customerProfile.monthlyIncome * 12), color: "text-slate-400" },
        { label: "Credit Stability", value: "High (Corporate)", color: "text-emerald-400" }
      ],
      desc: "Your primary income is credited on the 12th of each month from TechCorp Solutions. The inflow is highly predictable, providing strong borrow and invest capacity."
    },
    cashflow: {
      name: "Cash Flow Allocation Node",
      subtitle: "Outflow Distribution",
      metrics: [
        { label: "Essential Needs (48%)", value: formatINR(40800), color: "text-blue-400" },
        { label: "Discretionary Wants (24%)", value: formatINR(20400), color: "text-indigo-400" },
        { label: "Savings & Investments (28%)", value: formatINR(surplusVal), color: "text-emerald-400" }
      ],
      desc: `Your budget aligns closely with the recommended 50-30-20 rule. Needs take up 48% (rent, utilities), Wants consume 24% (dining out, lifestyle), leaving ${(savingsRateVal * 100).toFixed(1)}% of income to fund savings and SIP portfolios.`
    },
    savings: {
      name: "Savings & Liquid Reserves Node",
      subtitle: "Buffer Ledgers",
      metrics: [
        { label: "Primary Checking Cash", value: formatINR(bankAccounts.find(a => a.type === 'Salary')?.balance || 0), color: "text-white" },
        { label: "Emergency Reserves", value: formatINR(bankAccounts.find(a => a.type === 'Savings')?.balance || 0), color: "text-emerald-400" },
        { label: "Emergency Coverage", value: `${emergencyCoverageVal.toFixed(1)} Months`, color: "text-amber-450" }
      ],
      desc: `Your liquid cash holds ${formatINR(bankAccounts.reduce((sum, a) => sum + a.balance, 0))} total, split between checking and emergency accounts. The emergency buffer covers ${emergencyCoverageVal.toFixed(1)} months of needs. We recommend pushing this to 6 months.`
    },
    investments: {
      name: "Investments Portfolio Node",
      subtitle: "Wealth Accumulation Class",
      metrics: [
        { label: "Holdings Value", value: formatINR(investments.reduce((sum, i) => sum + i.currentValue, 0)), color: "text-white" },
        { label: "Invested Capital", value: formatINR(investments.reduce((sum, i) => sum + i.investedValue, 0)), color: "text-slate-400" },
        { label: "All-Time Returns", value: `+${formatINR(investments.reduce((sum, i) => sum + i.returnsAmount, 0))} (+18.4%)`, color: "text-emerald-400" }
      ],
      desc: "Your portfolio is primary mutual funds (large-cap index core) with small direct stock holdings. Consistent monthly compounding of ₹15,000 SIP supports long-term appreciation."
    },
    liabilities: {
      name: "Liabilities & Debts Node",
      subtitle: "Debt Commitments",
      metrics: [
        { label: "Outstanding Loan Bal", value: formatINR(totalDebtVal), color: "text-rose-455" },
        { label: "Monthly EMI Burden", value: formatINR(totalEMI), color: "text-slate-400" },
        { label: "Lending Interest Rate", value: "10.5% p.a.", color: "text-amber-450" }
      ],
      desc: `You have one active Personal Gadget/Upgrade loan outstanding. Paying 10.5% interest on ${formatINR(totalDebtVal)} is a drag on your surplus. Prepaying this loan using your idle cash is highly advised.`
    },
    goals: {
      name: "Financial Goals Node",
      subtitle: "Future Milestones",
      metrics: [
        { label: "Hatchback Car Target", value: formatINR(carGoal?.targetAmount || 600000), color: "text-white" },
        { label: "Current Saved Progress", value: formatINR(carGoal?.currentAmount || 400000), color: "text-blue-400" },
        { label: "Funding Percentage", value: `${carGoalReport.progressPercent}% Funded`, color: "text-emerald-400" }
      ],
      desc: `Your primary goal of buying a hatchback car is on track for Dec 2027. Redirecting ₹8,000 of your surplus will require ${formatINR(carGoalReport.requiredMonthlyContribution)}/mo to hit the target date.`
    }
  };

  const liveTwinSignals = [
    { text: "Dining spending increased 18% this month", type: "alert" },
    { text: "Emergency fund coverage improved by 0.3 months", type: "success" },
    { text: "Car goal is currently 67% funded", type: "info" },
    { text: "Investment contributions remain consistent", type: "success" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="Financial Digital Twin"
        subtitle="Interactive telemetry mapping assets, liabilities, cash splits, and goal systems."
        showBackButton={true}
        action={
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Twin Signals: <strong>Synchronized</strong></span>
          </div>
        }
      />

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Interactive visual network (7 cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-center min-h-[460px] relative overflow-hidden bg-slate-950/20 border-slate-850">
          
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="accent" size="sm" className="bg-blue-600/10 border-blue-500/20 text-blue-400">
              Interactive Map
            </Badge>
            <span className="text-[10px] text-slate-500 ml-2">Click any node to query details</span>
          </div>

          {/* SVG Connector Lines Behind Nodes */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Connecting paths from center to nodes */}
              {/* Income Line */}
              <line x1="50" y1="42" x2="20" y2="20" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              {/* Cashflow Line */}
              <line x1="50" y1="42" x2="80" y2="20" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              {/* Liabilities Line */}
              <line x1="50" y1="42" x2="15" y2="45" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              {/* Goals Line */}
              <line x1="50" y1="42" x2="85" y2="45" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              {/* Savings Line */}
              <line x1="50" y1="42" x2="22" y2="75" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              {/* Investments Line */}
              <line x1="50" y1="42" x2="78" y2="75" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />

              {/* Pulsing visual orbits */}
              <circle cx="50" cy="42" r="30" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="1" fill="none" className="animate-pulse" />
              <circle cx="50" cy="42" r="42" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* Interactive Absolute Node Layout */}
          <div className="relative w-full h-[400px] z-10">
            
            {/* Center Core: Arjun's Financial Twin */}
            <div 
              onClick={() => setSelectedNode('twin')}
              className={`absolute top-[42%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group`}
            >
              <div className={`h-28 w-28 rounded-full border-2 flex flex-col items-center justify-center text-center p-3 shadow-xl transition-all duration-300 ${
                selectedNode === 'twin'
                  ? 'bg-blue-600/10 border-blue-500 shadow-blue-500/10 glow-blue scale-105'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-600'
              }`}>
                <Cpu className={`h-5 w-5 mb-1 transition-transform group-hover:rotate-12 ${
                  selectedNode === 'twin' ? 'text-blue-400' : 'text-slate-400'
                }`} />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider block truncate max-w-full">Arjun's Twin</span>
                <span className="text-[11px] font-display font-semibold text-slate-350 block mt-0.5">₹6.72L NW</span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded mt-1">Health: 78</span>
              </div>
            </div>

            {/* Orbit Node 1: Income (Top Left) */}
            <div 
              onClick={() => setSelectedNode('income')}
              className="absolute top-[10%] left-[10%] cursor-pointer group"
            >
              <div className={`h-16 w-16 rounded-xl border flex flex-col items-center justify-center text-center p-1.5 shadow transition-all duration-300 ${
                selectedNode === 'income'
                  ? 'bg-blue-600/10 border-blue-500 glow-blue scale-105'
                  : 'bg-slate-900 border-slate-850 hover:border-slate-700'
              }`}>
                <DollarSign className={`h-4 w-4 mb-0.5 ${selectedNode === 'income' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="text-[9px] font-bold text-white uppercase tracking-wide">Income</span>
                <span className="text-[10px] text-slate-400 mt-0.5">₹85K</span>
              </div>
            </div>

            {/* Orbit Node 2: Cash Flow (Top Right) */}
            <div 
              onClick={() => setSelectedNode('cashflow')}
              className="absolute top-[10%] left-[75%] cursor-pointer group"
            >
              <div className={`h-16 w-16 rounded-xl border flex flex-col items-center justify-center text-center p-1.5 shadow transition-all duration-300 ${
                selectedNode === 'cashflow'
                  ? 'bg-indigo-600/10 border-indigo-500 glow-blue scale-105'
                  : 'bg-slate-900 border-slate-850 hover:border-slate-700'
              }`}>
                <Activity className={`h-4 w-4 mb-0.5 ${selectedNode === 'cashflow' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="text-[9px] font-bold text-white uppercase tracking-wide">Cash Flow</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Split: 28%</span>
              </div>
            </div>

            {/* Orbit Node 3: Liabilities (Left) */}
            <div 
              onClick={() => setSelectedNode('liabilities')}
              className="absolute top-[40%] left-[5%] cursor-pointer group"
            >
              <div className={`h-16 w-16 rounded-xl border flex flex-col items-center justify-center text-center p-1.5 shadow transition-all duration-300 ${
                selectedNode === 'liabilities'
                  ? 'bg-rose-500/10 border-rose-500 glow-rose scale-105'
                  : 'bg-slate-900 border-slate-850 hover:border-slate-700'
              }`}>
                <CreditCard className={`h-4 w-4 mb-0.5 ${selectedNode === 'liabilities' ? 'text-rose-455' : 'text-slate-500'}`} />
                <span className="text-[9px] font-bold text-white uppercase tracking-wide">Liabilities</span>
                <span className="text-[10px] text-rose-400 mt-0.5">₹1.48L</span>
              </div>
            </div>

            {/* Orbit Node 4: Goals (Right) */}
            <div 
              onClick={() => setSelectedNode('goals')}
              className="absolute top-[40%] left-[80%] cursor-pointer group"
            >
              <div className={`h-16 w-16 rounded-xl border flex flex-col items-center justify-center text-center p-1.5 shadow transition-all duration-300 ${
                selectedNode === 'goals'
                  ? 'bg-blue-600/10 border-blue-500 glow-blue scale-105'
                  : 'bg-slate-900 border-slate-850 hover:border-slate-700'
              }`}>
                <Target className={`h-4 w-4 mb-0.5 ${selectedNode === 'goals' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="text-[9px] font-bold text-white uppercase tracking-wide">Goals</span>
                <span className="text-[10px] text-slate-400 mt-0.5">67% Done</span>
              </div>
            </div>

            {/* Orbit Node 5: Savings (Bottom Left) */}
            <div 
              onClick={() => setSelectedNode('savings')}
              className="absolute top-[70%] left-[12%] cursor-pointer group"
            >
              <div className={`h-16 w-16 rounded-xl border flex flex-col items-center justify-center text-center p-1.5 shadow transition-all duration-300 ${
                selectedNode === 'savings'
                  ? 'bg-emerald-500/10 border-emerald-500 glow-emerald scale-105'
                  : 'bg-slate-900 border-slate-850 hover:border-slate-700'
              }`}>
                <Wallet className={`h-4 w-4 mb-0.5 ${selectedNode === 'savings' ? 'text-emerald-450' : 'text-slate-500'}`} />
                <span className="text-[9px] font-bold text-white uppercase tracking-wide">Savings</span>
                <span className="text-[10px] text-slate-400 mt-0.5">₹3.40L</span>
              </div>
            </div>

            {/* Orbit Node 6: Investments (Bottom Right) */}
            <div 
              onClick={() => setSelectedNode('investments')}
              className="absolute top-[70%] left-[72%] cursor-pointer group"
            >
              <div className={`h-16 w-16 rounded-xl border flex flex-col items-center justify-center text-center p-1.5 shadow transition-all duration-300 ${
                selectedNode === 'investments'
                  ? 'bg-emerald-500/10 border-emerald-500 glow-emerald scale-105'
                  : 'bg-slate-900 border-slate-850 hover:border-slate-700'
              }`}>
                <TrendingUp className={`h-4 w-4 mb-0.5 ${selectedNode === 'investments' ? 'text-emerald-450' : 'text-slate-500'}`} />
                <span className="text-[9px] font-bold text-white uppercase tracking-wide">Investments</span>
                <span className="text-[10px] text-slate-400 mt-0.5">₹4.80L</span>
              </div>
            </div>

          </div>

        </Card>

        {/* Right Column: Active Telemetry Side Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Node Context Details panel */}
          <Card className="flex-1 flex flex-col justify-between border-blue-500/10 shadow-lg relative min-h-[300px]">
            {/* Context title */}
            <div>
              <CardHeader divider={true} className="pb-3 bg-slate-900/40 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4.5 w-4.5 text-blue-400 animate-pulse" />
                  <div>
                    <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                      {nodeDetails[selectedNode].name}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Telemetry Class: {nodeDetails[selectedNode].subtitle}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              {/* Context metrics content */}
              <CardContent className="py-4 space-y-5">
                {/* Dynamically mapped key stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
                  {nodeDetails[selectedNode].metrics.map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-left">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide">
                        {m.label}
                      </span>
                      <span className={`font-display font-bold text-sm block mt-0.5 ${m.color}`}>
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-lg space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase block">
                    Context Diagnostics
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {nodeDetails[selectedNode].desc}
                  </p>
                </div>
              </CardContent>
            </div>

            {/* Quick action button inside panel */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/wealth')}
                className="w-full justify-between"
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                Query full Financial Intelligence report
              </Button>
            </div>
          </Card>

          {/* Live Twin Signals */}
          <Card>
            <CardHeader divider={true}>
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-400" />
                <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                  Live Twin Signals
                </h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {liveTwinSignals.map((sig, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-slate-350 p-2 bg-slate-950 border border-slate-900 rounded-lg hover:border-slate-850 transition-all">
                    <span className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 animate-pulse ${
                      sig.type === 'alert' ? 'bg-rose-500' :
                      sig.type === 'info' ? 'bg-blue-400' : 'bg-emerald-400'
                    }`} />
                    <span className="leading-relaxed">{sig.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Aggregate Financial Metrics panel */}
      <Card>
        <CardHeader divider={true}>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Info className="h-4 w-4 text-blue-400" />
            <span>Aggregate Balance Sheet Ledger Summary</span>
            <Tooltip text="Deterministic calculation of your total bank balances and index portfolios minus outstanding loans.">
              <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-450 cursor-help" />
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wide">Assets Ledger</span>
              <span className="font-display font-bold text-lg text-white block mt-0.5">{formatINR(totalAssetsVal)}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wide">Liabilities Ledger</span>
              <span className="font-display font-bold text-lg text-rose-455 block mt-0.5">{formatINR(totalDebtVal)}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wide">Monthly Cash Flow Inflow</span>
              <span className="font-display font-bold text-lg text-white block mt-0.5">{formatINR(customerProfile.monthlyIncome)}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wide">Monthly Savings Surplus</span>
              <span className="font-display font-bold text-lg text-emerald-400 block mt-0.5">{formatINR(surplusVal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <footer className="text-center text-[10px] text-slate-550 pt-2 pb-6 border-t border-slate-900/50">
        <span>Disclaimer: WealthTwin AI provides financial guidance, scenario analysis, and educational recommendations. We do not provide regulated investment advice.</span>
      </footer>

    </div>
  );
};
