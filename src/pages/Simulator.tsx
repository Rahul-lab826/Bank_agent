import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, 
  ArrowUpRight, 
  Car, 
  Home, 
  LineChart, 
  ArrowUp,
  ArrowDown,
  Coins,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';

import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

// Mock Data
import { customerProfile, bankAccounts, investments, loans, financialGoals } from '../mock/financialData';

// Financial Engine
import { calculateNetWorth, calculateEmergencyFundCoverage, calculateDebtToIncomeRatio } from '../engine/financialEngine';
import { calculateFinancialHealthScore } from '../engine/healthScore';

type ScenarioType = 'car' | 'house' | 'investment' | 'prepay' | 'expense';

export const Simulator: React.FC = () => {
  const navigate = useNavigate();
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('car');

  // Baseline figures
  const totalEMI = loans.reduce((sum, l) => sum + l.emi, 0);
  const baseNetWorth = useMemo(() => calculateNetWorth(bankAccounts, investments, loans), []);
  const baseSurplus = customerProfile.monthlyIncome - customerProfile.monthlyExpenses - totalEMI;
  const baseDTI = calculateDebtToIncomeRatio(customerProfile.monthlyIncome, loans);
  const baseCoverage = calculateEmergencyFundCoverage(bankAccounts, customerProfile.monthlyExpenses);
  const baseHealthData = calculateFinancialHealthScore(
    customerProfile.monthlyIncome,
    customerProfile.monthlyExpenses,
    bankAccounts,
    investments,
    loans,
    financialGoals
  );

  // 1. CAR DEMO STATE
  const [carPrice, setCarPrice] = useState(1500000);
  const [carDownPayment, setCarDownPayment] = useState(400000);
  const [carTenure, setCarTenure] = useState(5); // 5 years
  const [carRate, setCarRate] = useState(9); // 9%
  const [carTimeline, setCarTimeline] = useState(12); // 12 months

  // 2. HOUSE DEMO STATE
  const [housePrice, setHousePrice] = useState(7500000);
  const [houseDownPayment, setHouseDownPayment] = useState(1500000);
  const [houseTenure, setHouseTenure] = useState(20); // 20 years
  const [houseRate, setHouseRate] = useState(8.5); // 8.5%
  const [houseTimeline, setHouseTimeline] = useState(12); // 12 months

  // 3. INVESTMENT STATE
  const [sipIncrease, setSipIncrease] = useState(10000);

  // 4. PREPAYMENT STATE
  const [prepayAmount, setPrepayAmount] = useState(50000);

  // 5. ONE-TIME EXPENSE STATE
  const [expenseAmount, setExpenseAmount] = useState(200000);
  const [expenseTimeline, setExpenseTimeline] = useState(3);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Standard EMI Formula helper
  const calculateEMI = (principal: number, annualRate: number, tenureYears: number): number => {
    if (principal <= 0) return 0;
    const monthlyRate = (annualRate / 12) / 100;
    const totalPayments = tenureYears * 12;
    if (monthlyRate === 0) return principal / totalPayments;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  };

  // Deterministic computations depending on active scenario
  const simulationResults = useMemo(() => {
    let emi = 0;
    let loanAmount = 0;
    let cashDepletion = 0;
    let newSurplus = baseSurplus;
    let newDTI = baseDTI;
    let newCoverage = baseCoverage;
    let simulatedScore = baseHealthData.overallScore;
    let simulatedGoalReadiness = baseHealthData.components.goals.score;
    let timelineMonths = 0;

    if (activeScenario === 'car') {
      loanAmount = Math.max(0, carPrice - carDownPayment);
      emi = Math.round(calculateEMI(loanAmount, carRate, carTenure));
      cashDepletion = carDownPayment;
      timelineMonths = carTimeline;
      
      newSurplus = Math.max(0, baseSurplus - emi);
      newDTI = (totalEMI + emi) / customerProfile.monthlyIncome;
      
      const cashAccumulated = timelineMonths * baseSurplus;
      const netCashChange = cashAccumulated - carDownPayment;
      const simSavingsBalance = Math.max(0, 155000 + netCashChange);
      newCoverage = (simSavingsBalance + 43850) / customerProfile.monthlyExpenses;

      // Simulated health score mapping
      const savingsScore = Math.max(0, Math.min(100, Math.round((newSurplus / customerProfile.monthlyIncome / 0.344) * 100)));
      const emergencyScore = Math.max(0, Math.min(100, Math.round((newCoverage / 6.0) * 100)));
      const debtScore = Math.max(0, Math.min(100, Math.round((100 - (newDTI / 0.588) * 100))));
      const carProgress = 100; // car goal achieved
      const emergencyProgress = (simSavingsBalance / 300000) * 100;
      simulatedGoalReadiness = Math.max(0, Math.min(100, Math.round(0.65 * carProgress + 0.35 * emergencyProgress)));
      
      const weightedSum = (savingsScore * 0.25) + (emergencyScore * 0.20) + (debtScore * 0.20) + (84 * 0.20) + (simulatedGoalReadiness * 0.15);
      simulatedScore = Math.max(0, Math.min(100, Math.round(weightedSum + 1.3)));

    } else if (activeScenario === 'house') {
      loanAmount = Math.max(0, housePrice - houseDownPayment);
      emi = Math.round(calculateEMI(loanAmount, houseRate, houseTenure));
      cashDepletion = houseDownPayment;
      timelineMonths = houseTimeline;

      newSurplus = Math.max(0, baseSurplus - emi);
      newDTI = (totalEMI + emi) / customerProfile.monthlyIncome;

      const cashAccumulated = timelineMonths * baseSurplus;
      const netCashChange = cashAccumulated - houseDownPayment;
      const simSavingsBalance = Math.max(0, 155000 + netCashChange);
      newCoverage = (simSavingsBalance + 43850) / customerProfile.monthlyExpenses;

      const savingsScore = Math.max(0, Math.min(100, Math.round((newSurplus / customerProfile.monthlyIncome / 0.344) * 100)));
      const emergencyScore = Math.max(0, Math.min(100, Math.round((newCoverage / 6.0) * 100)));
      const debtScore = Math.max(0, Math.min(100, Math.round((100 - (newDTI / 0.588) * 100))));
      simulatedGoalReadiness = Math.max(0, Math.min(100, Math.round(0.65 * 100 + 0.35 * (simSavingsBalance / 300000 * 100))));

      const weightedSum = (savingsScore * 0.25) + (emergencyScore * 0.20) + (debtScore * 0.20) + (84 * 0.20) + (simulatedGoalReadiness * 0.15);
      simulatedScore = Math.max(0, Math.min(100, Math.round(weightedSum + 1.3)));

    } else if (activeScenario === 'investment') {
      newSurplus = Math.max(0, baseSurplus - sipIncrease);
      newDTI = baseDTI;
      newCoverage = baseCoverage;

      // Savings Score evaluates positively because total wealth SIP allocation grows
      const savingsScore = Math.max(0, Math.min(100, Math.round((newSurplus / customerProfile.monthlyIncome / 0.344) * 100) + 10));
      const investmentScore = 95; // increased portfolio allocations

      const weightedSum = (savingsScore * 0.25) + (68 * 0.20) + (75 * 0.20) + (investmentScore * 0.20) + (72 * 0.15);
      simulatedScore = Math.max(0, Math.min(100, Math.round(weightedSum + 1.3)));

    } else if (activeScenario === 'prepay') {
      cashDepletion = prepayAmount;
      newSurplus = baseSurplus;
      
      const newDebtVal = Math.max(0, 148000 - prepayAmount);
      newDTI = (newDebtVal > 0 ? totalEMI : 0) / customerProfile.monthlyIncome;
      
      const simSavingsBalance = Math.max(0, 155000 - prepayAmount);
      newCoverage = (simSavingsBalance + 43850) / customerProfile.monthlyExpenses;

      const debtScore = Math.max(0, Math.min(100, Math.round((100 - (newDTI / 0.588) * 100))));
      const emergencyScore = Math.max(0, Math.min(100, Math.round((newCoverage / 6.0) * 100)));

      const weightedSum = (82 * 0.25) + (emergencyScore * 0.20) + (debtScore * 0.20) + (84 * 0.20) + (72 * 0.15);
      simulatedScore = Math.max(0, Math.min(100, Math.round(weightedSum + 1.3)));

    } else if (activeScenario === 'expense') {
      cashDepletion = expenseAmount;
      timelineMonths = expenseTimeline;

      const cashAccumulated = timelineMonths * baseSurplus;
      const netCashChange = cashAccumulated - expenseAmount;
      const simSavingsBalance = Math.max(0, 155000 + netCashChange);
      newCoverage = (simSavingsBalance + 43850) / customerProfile.monthlyExpenses;

      const emergencyScore = Math.max(0, Math.min(100, Math.round((newCoverage / 6.0) * 100)));
      const weightedSum = (82 * 0.25) + (emergencyScore * 0.20) + (75 * 0.20) + (84 * 0.20) + (72 * 0.15);
      simulatedScore = Math.max(0, Math.min(100, Math.round(weightedSum + 1.3)));
    }

    // Recommendation logic
    let decision: 'Proceed' | 'Proceed with Caution' | 'Consider Delaying' | 'Financially High-Risk' = 'Proceed';
    let why = '';
    
    // Evaluate down payment affordability
    const liquidCashAtPurchase = 340000 + (timelineMonths * baseSurplus);
    const cashUnderfunded = cashDepletion > liquidCashAtPurchase;

    if (newDTI > 0.40 || cashUnderfunded) {
      decision = 'Financially High-Risk';
      why = cashUnderfunded 
        ? `The required down payment of ${formatINR(cashDepletion)} exceeds your projected cash reserves of ${formatINR(liquidCashAtPurchase)} at purchase time, forcing immediate liquidation of investment portfolios.`
        : `Adding this obligation pushes your Debt-to-Income (DTI) ratio to ${(newDTI * 100).toFixed(1)}%, heavily exceeding standard safety thresholds. This will squeeze your monthly flexibility.`;
    } else if (newDTI > 0.35 || newSurplus < 5000 || newCoverage < 2.0) {
      decision = 'Consider Delaying';
      why = newSurplus < 5000 
        ? `The monthly EMI limits your cash surplus to just ${formatINR(newSurplus)}/month, leaving you highly vulnerable to future inflationary spikes or minor income drops.`
        : `Your liquid emergency fund drops to only ${newCoverage.toFixed(1)} months of expenses, offering a minimal safety buffer.`;
    } else if (newCoverage < 4.0 || newDTI > 0.25) {
      decision = 'Proceed with Caution';
      why = `The purchase is mathematically feasible, but it lowers your emergency readiness coverage to ${newCoverage.toFixed(1)} months and increases debt commitments.`;
    } else {
      decision = 'Proceed';
      why = `All simulated parameters are healthy. Your surplus remains above ${formatINR(10000)}/mo, emergency coverage remains high, and debt leverage is safely under control.`;
    }

    return {
      emi,
      loanAmount,
      cashDepletion,
      newSurplus,
      newDTI,
      newCoverage,
      simulatedScore,
      simulatedGoalReadiness,
      decision,
      why
    };
  }, [activeScenario, carPrice, carDownPayment, carTenure, carRate, carTimeline, housePrice, houseDownPayment, houseTenure, houseRate, houseTimeline, sipIncrease, prepayAmount, expenseAmount, expenseTimeline]);

  // Handle resets
  const handleReset = () => {
    setCarPrice(1500000);
    setCarDownPayment(400000);
    setCarTenure(5);
    setCarRate(9);
    setCarTimeline(12);

    setHousePrice(7500000);
    setHouseDownPayment(1500000);
    setHouseTenure(20);
    setHouseRate(8.5);
    setHouseTimeline(12);

    setSipIncrease(10000);
    setPrepayAmount(50000);
    setExpenseAmount(200000);
    setExpenseTimeline(3);
  };

  // Navigates to advisor carrying simulation context
  const handleAskAdvisor = () => {
    navigate('/wealth/advisor', {
      state: {
        simulationContext: {
          scenarioType: activeScenario === 'car' ? 'Buy a Car' : activeScenario === 'house' ? 'Buy a House' : activeScenario === 'investment' ? 'Increase SIP' : activeScenario === 'prepay' ? 'Prepay Loan' : 'One-Time Expense',
          carPrice: activeScenario === 'car' ? carPrice : activeScenario === 'house' ? housePrice : 0,
          downPayment: activeScenario === 'car' ? carDownPayment : activeScenario === 'house' ? houseDownPayment : 0,
          tenureYears: activeScenario === 'car' ? carTenure : activeScenario === 'house' ? houseTenure : 0,
          interestRate: activeScenario === 'car' ? carRate : activeScenario === 'house' ? houseRate : 0,
          timelineMonths: activeScenario === 'car' ? carTimeline : activeScenario === 'house' ? houseTimeline : expenseTimeline,
          emi: simulationResults.emi,
          newSurplus: simulationResults.newSurplus,
          newDTI: simulationResults.newDTI,
          newCoverage: simulationResults.newCoverage,
          simulatedScore: simulationResults.simulatedScore,
          statusText: simulationResults.decision
        }
      }
    });
  };

  // 12-Month Accumulation chart projection data
  const chartData = useMemo(() => {
    const data = [];
    let baseAccumulator = baseNetWorth;
    let simAccumulator = baseNetWorth;
    const monthlyGrowthRate = 0.01; // 12% p.a. / 12 = 1% compounding

    const months = [
      'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26', 
      'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'May 27', 'Jun 27'
    ];

    for (let i = 0; i < 12; i++) {
      // Baseline track: standard compound returns + base SIP (₹15,000)
      baseAccumulator = (baseAccumulator * (1 + monthlyGrowthRate)) + 15000;

      // Simulated track logic
      let simulatedMonthlySavings = 15000;
      let immediateCashImpact = 0;

      if (activeScenario === 'car') {
        // Purchases at month `carTimeline`
        if (i === carTimeline) {
          immediateCashImpact = -carDownPayment;
        }
        // EMI starts after purchase
        const emiActive = i >= carTimeline;
        simulatedMonthlySavings = 15000 + (emiActive ? -simulationResults.emi : 0);
      } else if (activeScenario === 'house') {
        if (i === houseTimeline) {
          immediateCashImpact = -houseDownPayment;
        }
        const emiActive = i >= houseTimeline;
        simulatedMonthlySavings = 15000 + (emiActive ? -simulationResults.emi : 0);
      } else if (activeScenario === 'investment') {
        simulatedMonthlySavings = 15000 + sipIncrease;
      } else if (activeScenario === 'prepay') {
        // Prepay in first month
        if (i === 0) {
          immediateCashImpact = -prepayAmount;
        }
        // Freed EMI (assume paying gadget loan off reduces overall EMI by ₹12.5k)
        const prepaidFull = prepayAmount >= 148000;
        simulatedMonthlySavings = 15000 + (prepaidFull ? 12500 : 0);
      } else if (activeScenario === 'expense') {
        if (i === expenseTimeline) {
          immediateCashImpact = -expenseAmount;
        }
      }

      simAccumulator = (simAccumulator * (1 + monthlyGrowthRate)) + simulatedMonthlySavings + immediateCashImpact;

      data.push({
        month: months[i],
        Baseline: Math.round(baseAccumulator),
        Simulated: Math.round(simAccumulator)
      });
    }
    return data;
  }, [activeScenario, baseNetWorth, carDownPayment, carTimeline, houseDownPayment, houseTimeline, sipIncrease, prepayAmount, expenseAmount, expenseTimeline, simulationResults.emi]);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <PageHeader 
        title="Interactive What-If Scenario Simulator"
        subtitle="Test major spending, loan prepayments, or portfolio boosts instantly against your digital twin parameters."
        showBackButton={true}
        action={
          <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Reset Variables
          </Button>
        }
      />

      {/* Scenario Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { id: 'car', label: 'Buy a Car', icon: <Car className="h-4 w-4" /> },
          { id: 'house', label: 'Buy a House', icon: <Home className="h-4 w-4" /> },
          { id: 'investment', label: 'Boost SIP', icon: <LineChart className="h-4 w-4" /> },
          { id: 'prepay', label: 'Debt Prepay', icon: <Coins className="h-4 w-4" /> },
          { id: 'expense', label: 'Major Expense', icon: <ShieldAlert className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveScenario(tab.id as ScenarioType)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeScenario === tab.id
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Controls vs Visual Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Variables & Alternate Options */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader divider={true}>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                Scenario Parameters
              </h3>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Scenario 1: Buy a Car */}
              {activeScenario === 'car' && (
                <>
                  {/* Car Price */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Car Purchase Price</span>
                      <span className="font-bold text-white">{formatINR(carPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min="500000"
                      max="3000000"
                      step="50000"
                      value={carPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCarPrice(val);
                        if (carDownPayment > val) setCarDownPayment(val);
                      }}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>₹5.00L</span>
                      <span>₹30.00L</span>
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Down Payment Amount</span>
                      <span className="font-bold text-white">{formatINR(carDownPayment)}</span>
                    </div>
                    <input
                      type="range"
                      min="100000"
                      max={carPrice}
                      step="25000"
                      value={carDownPayment}
                      onChange={(e) => setCarDownPayment(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>₹1.00L</span>
                      <span>Max: Price ({formatINR(carPrice)})</span>
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Loan Tenure</span>
                      <span className="font-bold text-white">{carTenure} Years</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      step="1"
                      value={carTenure}
                      onChange={(e) => setCarTenure(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>1 Year</span>
                      <span>7 Years</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Interest Rate</span>
                      <span className="font-bold text-white">{carRate}% p.a.</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="15"
                      step="0.5"
                      value={carRate}
                      onChange={(e) => setCarRate(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>5.0%</span>
                      <span>15.0%</span>
                    </div>
                  </div>

                  {/* Purchase Timeline */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Purchase Timeline</span>
                      <span className="font-bold text-white">
                        {carTimeline === 0 ? 'Immediately' : `In ${carTimeline} Months`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      value={carTimeline}
                      onChange={(e) => setCarTimeline(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>Today</span>
                      <span>24 Months</span>
                    </div>
                  </div>
                </>
              )}

              {/* Scenario 2: Buy a House */}
              {activeScenario === 'house' && (
                <>
                  {/* House Price */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Property Purchase Price</span>
                      <span className="font-bold text-white">{formatINR(housePrice)}</span>
                    </div>
                    <input
                      type="range"
                      min="3000000"
                      max="15000000"
                      step="100000"
                      value={housePrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setHousePrice(val);
                        if (houseDownPayment > val) setHouseDownPayment(val);
                      }}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>₹30.00L</span>
                      <span>₹1.50Cr</span>
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Down Payment Amount</span>
                      <span className="font-bold text-white">{formatINR(houseDownPayment)}</span>
                    </div>
                    <input
                      type="range"
                      min="500000"
                      max={housePrice}
                      step="50000"
                      value={houseDownPayment}
                      onChange={(e) => setHouseDownPayment(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>₹5.00L</span>
                      <span>Max: Price ({formatINR(housePrice)})</span>
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Loan Tenure</span>
                      <span className="font-bold text-white">{houseTenure} Years</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="5"
                      value={houseTenure}
                      onChange={(e) => setHouseTenure(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>5 Years</span>
                      <span>30 Years</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Interest Rate</span>
                      <span className="font-bold text-white">{houseRate}% p.a.</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="12"
                      step="0.5"
                      value={houseRate}
                      onChange={(e) => setHouseRate(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>6.0%</span>
                      <span>12.0%</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Purchase Timeline</span>
                      <span className="font-bold text-white">
                        {houseTimeline === 0 ? 'Immediately' : `In ${houseTimeline} Months`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="36"
                      step="3"
                      value={houseTimeline}
                      onChange={(e) => setHouseTimeline(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>Today</span>
                      <span>36 Months</span>
                    </div>
                  </div>
                </>
              )}

              {/* Scenario 3: Boost SIP */}
              {activeScenario === 'investment' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Increase Monthly SIP by</span>
                    <span className="font-bold text-emerald-400">+{formatINR(sipIncrease)}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="40000"
                    step="1000"
                    value={sipIncrease}
                    onChange={(e) => setSipIncrease(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-550">
                    <span>+₹1k</span>
                    <span>Baseline Surplus: {formatINR(baseSurplus)}/mo</span>
                    <span>+₹40k</span>
                  </div>
                </div>
              )}

              {/* Scenario 4: Debt Prepay */}
              {activeScenario === 'prepay' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">One-Time Prepay Amount</span>
                    <span className="font-bold text-indigo-400">{formatINR(prepayAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="148000"
                    step="5000"
                    value={prepayAmount}
                    onChange={(e) => setPrepayAmount(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-550">
                    <span>₹10k</span>
                    <span>Outstanding Gadget Loan: {formatINR(148000)}</span>
                  </div>
                </div>
              )}

              {/* Scenario 5: Major Expense */}
              {activeScenario === 'expense' && (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">One-Time Outlay Cost</span>
                      <span className="font-bold text-white">{formatINR(expenseAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="500000"
                      step="10000"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>₹50k</span>
                      <span>₹5.00L</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Outlay Timeline</span>
                      <span className="font-bold text-white">In {expenseTimeline} Months</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="1"
                      value={expenseTimeline}
                      onChange={(e) => setExpenseTimeline(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>Immediately</span>
                      <span>12 Months</span>
                    </div>
                  </div>
                </>
              )}

            </CardContent>
          </Card>

          {/* Alternative Suggestion Shortcuts */}
          {activeScenario === 'car' && (
            <Card>
              <CardHeader divider={true}>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Alternative Optimization Suggestions
                </h4>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2 text-xs">
                <button 
                  onClick={() => setCarTimeline(18)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-blue-500/20 text-slate-350 hover:text-white transition-all cursor-pointer"
                >
                  ⏳ <strong>Delay Purchase by 6 months:</strong> Extends timeline to 18 months, raising savings and cushioning reserves.
                </button>
                <button 
                  onClick={() => setCarDownPayment(Math.min(600000, carPrice))}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-blue-500/20 text-slate-350 hover:text-white transition-all cursor-pointer"
                >
                  💰 <strong>Increase Down Payment to ₹6,0,000:</strong> Reduces total principal to cut EMI and keep surplus healthy.
                </button>
                <button 
                  onClick={() => {
                    setCarPrice(1000000);
                    setCarDownPayment(300000);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-blue-500/20 text-slate-350 hover:text-white transition-all cursor-pointer"
                >
                  🚗 <strong>Choose Lower Price (₹10,00,000):</strong> Targets a smaller loan liability and leaves DTI under 30%.
                </button>
              </CardContent>
            </Card>
          )}

          {activeScenario === 'house' && (
            <Card>
              <CardHeader divider={true}>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Alternative Optimization Suggestions
                </h4>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2 text-xs">
                <button 
                  onClick={() => setHouseTimeline(24)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-blue-500/20 text-slate-350 hover:text-white transition-all cursor-pointer"
                >
                  ⏳ <strong>Delay by 12 months:</strong> Increases savings runway before making down payments.
                </button>
                <button 
                  onClick={() => setHouseDownPayment(Math.min(2500000, housePrice))}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-blue-500/20 text-slate-350 hover:text-white transition-all cursor-pointer"
                >
                  💰 <strong>Raise Down Payment to ₹25.00L:</strong> Decreases total home loan liability.
                </button>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right: reactive Twin Visualizer, Before vs After, Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Reactive Twin Panel */}
          <Card>
            <CardHeader divider={true}>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                Impact on Your Financial Twin
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6 justify-around p-2">
                
                {/* Visual Twin Reactor Graph */}
                <div className="relative h-32 w-32 flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-dashed border-slate-800 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="absolute h-24 w-24 border-2 border-slate-800 rounded-full" />
                  
                  {/* Center Score Core */}
                  <div className={`z-10 h-16 w-16 rounded-full flex flex-col items-center justify-center border-2 transition-all ${
                    simulationResults.decision === 'Proceed' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' :
                    simulationResults.decision === 'Proceed with Caution' ? 'bg-blue-500/10 border-blue-550 text-blue-450' :
                    simulationResults.decision === 'Consider Delaying' ? 'bg-amber-500/10 border-amber-500 text-amber-450' :
                    'bg-rose-500/10 border-rose-500 text-rose-455 font-bold'
                  }`}>
                    <span className="text-lg font-extrabold">{simulationResults.simulatedScore}</span>
                    <span className="text-[7px] uppercase tracking-wide block">Health</span>
                  </div>

                  {/* Reactive nodes orbiting */}
                  {/* Top Node: Liabilities */}
                  <div className={`absolute -top-1.5 h-6 px-1.5 rounded-md border flex items-center gap-1 text-[9px] font-bold ${
                    simulationResults.newDTI > 0.35 ? 'bg-rose-500/10 border-rose-500 text-rose-455' : 'bg-slate-900 border-slate-800 text-white'
                  }`}>
                    <span>Debts:</span>
                    <span>{(simulationResults.newDTI * 100).toFixed(0)}% DTI</span>
                  </div>

                  {/* Left Node: Surplus */}
                  <div className={`absolute -left-4 h-6 px-1.5 rounded-md border flex items-center gap-1 text-[9px] font-bold ${
                    simulationResults.newSurplus < 5000 ? 'bg-rose-500/10 border-rose-500 text-rose-455' : 'bg-slate-900 border-slate-800 text-white'
                  }`}>
                    <span>Surplus:</span>
                    <span>{formatINR(simulationResults.newSurplus)}</span>
                  </div>

                  {/* Right Node: Emergency coverage */}
                  <div className={`absolute -right-4 h-6 px-1.5 rounded-md border flex items-center gap-1 text-[9px] font-bold ${
                    simulationResults.newCoverage < 3.0 ? 'bg-amber-500/10 border-amber-500 text-amber-455' : 'bg-slate-900 border-slate-800 text-white'
                  }`}>
                    <span>Cover:</span>
                    <span>{simulationResults.newCoverage.toFixed(1)}m</span>
                  </div>
                </div>

                {/* Status Telemetry text */}
                <div className="flex-1 space-y-2 text-xs w-full text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-slate-400 block font-medium">Digital Twin Feasibility:</span>
                    <Badge variant={
                      simulationResults.decision === 'Proceed' ? 'success' :
                      simulationResults.decision === 'Proceed with Caution' ? 'info' :
                      simulationResults.decision === 'Consider Delaying' ? 'warning' : 'error'
                    } size="sm">
                      {simulationResults.decision}
                    </Badge>
                  </div>
                  <p className="text-slate-400 leading-normal text-[11px]">
                    {simulationResults.why}
                  </p>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Before vs After comparison Table */}
          <Card>
            <CardHeader divider={true}>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                Before vs After Metrics Comparison
              </h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-850 text-xs">
                
                {/* Row 1: Health Score */}
                <div className="p-3 grid grid-cols-12 items-center gap-4">
                  <span className="col-span-4 text-slate-400 font-semibold">Health Score</span>
                  <span className="col-span-3 font-semibold text-slate-200">{baseHealthData.overallScore}/100</span>
                  <span className="col-span-1 text-slate-500">&rarr;</span>
                  <div className="col-span-4 flex items-center gap-1.5">
                    <span className={`font-bold ${
                      simulationResults.simulatedScore > baseHealthData.overallScore ? 'text-emerald-400' :
                      simulationResults.simulatedScore < baseHealthData.overallScore ? 'text-rose-455' : 'text-slate-400'
                    }`}>
                      {simulationResults.simulatedScore}/100
                    </span>
                    {simulationResults.simulatedScore !== baseHealthData.overallScore && (
                      <span className={`flex items-center text-[10px] ${
                        simulationResults.simulatedScore > baseHealthData.overallScore ? 'text-emerald-400' : 'text-rose-455'
                      }`}>
                        {simulationResults.simulatedScore > baseHealthData.overallScore ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(simulationResults.simulatedScore - baseHealthData.overallScore)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Monthly Surplus */}
                <div className="p-3 grid grid-cols-12 items-center gap-4">
                  <span className="col-span-4 text-slate-400 font-semibold">Monthly Surplus</span>
                  <span className="col-span-3 font-semibold text-slate-200">{formatINR(baseSurplus)}</span>
                  <span className="col-span-1 text-slate-500">&rarr;</span>
                  <div className="col-span-4 flex items-center gap-1.5">
                    <span className={`font-bold ${
                      simulationResults.newSurplus > baseSurplus ? 'text-emerald-400' :
                      simulationResults.newSurplus < baseSurplus ? 'text-rose-455' : 'text-slate-400'
                    }`}>
                      {formatINR(simulationResults.newSurplus)}
                    </span>
                    {simulationResults.newSurplus !== baseSurplus && (
                      <span className={`flex items-center text-[10px] ${
                        simulationResults.newSurplus > baseSurplus ? 'text-emerald-400' : 'text-rose-455'
                      }`}>
                        {simulationResults.newSurplus > baseSurplus ? '+' : '-'}
                        {formatINR(Math.abs(simulationResults.newSurplus - baseSurplus))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 3: Emergency Coverage */}
                <div className="p-3 grid grid-cols-12 items-center gap-4">
                  <span className="col-span-4 text-slate-400 font-semibold">Emergency Fund</span>
                  <span className="col-span-3 font-semibold text-slate-200">{baseCoverage.toFixed(1)} Months</span>
                  <span className="col-span-1 text-slate-500">&rarr;</span>
                  <div className="col-span-4 flex items-center gap-1.5">
                    <span className={`font-bold ${
                      simulationResults.newCoverage > baseCoverage ? 'text-emerald-400' :
                      simulationResults.newCoverage < baseCoverage ? 'text-rose-455' : 'text-slate-400'
                    }`}>
                      {simulationResults.newCoverage.toFixed(1)} Months
                    </span>
                    {simulationResults.newCoverage !== baseCoverage && (
                      <span className={`flex items-center text-[10px] ${
                        simulationResults.newCoverage > baseCoverage ? 'text-emerald-400' : 'text-rose-455'
                      }`}>
                        {simulationResults.newCoverage > baseCoverage ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(simulationResults.newCoverage - baseCoverage).toFixed(1)}m
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 4: Debt-to-Income */}
                <div className="p-3 grid grid-cols-12 items-center gap-4">
                  <span className="col-span-4 text-slate-400 font-semibold">DTI Debt Ratio</span>
                  <span className="col-span-3 font-semibold text-slate-200">{(baseDTI * 100).toFixed(1)}%</span>
                  <span className="col-span-1 text-slate-500">&rarr;</span>
                  <div className="col-span-4 flex items-center gap-1.5">
                    <span className={`font-bold ${
                      simulationResults.newDTI > baseDTI ? 'text-rose-455' :
                      simulationResults.newDTI < baseDTI ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {(simulationResults.newDTI * 100).toFixed(1)}%
                    </span>
                    {simulationResults.newDTI !== baseDTI && (
                      <span className={`flex items-center text-[10px] ${
                        simulationResults.newDTI > baseDTI ? 'text-rose-455' : 'text-emerald-400'
                      }`}>
                        {simulationResults.newDTI > baseDTI ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs((simulationResults.newDTI - baseDTI) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 5: Goal Readiness */}
                <div className="p-3 grid grid-cols-12 items-center gap-4">
                  <span className="col-span-4 text-slate-400 font-semibold">Goal Readiness</span>
                  <span className="col-span-3 font-semibold text-slate-200">{baseHealthData.components.goals.score}%</span>
                  <span className="col-span-1 text-slate-500">&rarr;</span>
                  <div className="col-span-4 flex items-center gap-1.5">
                    <span className={`font-bold ${
                      simulationResults.simulatedGoalReadiness > baseHealthData.components.goals.score ? 'text-emerald-400' :
                      simulationResults.simulatedGoalReadiness < baseHealthData.components.goals.score ? 'text-rose-455' : 'text-slate-400'
                    }`}>
                      {simulationResults.simulatedGoalReadiness}%
                    </span>
                    {simulationResults.simulatedGoalReadiness !== baseHealthData.components.goals.score && (
                      <span className={`flex items-center text-[10px] ${
                        simulationResults.simulatedGoalReadiness > baseHealthData.components.goals.score ? 'text-emerald-400' : 'text-rose-455'
                      }`}>
                        {simulationResults.simulatedGoalReadiness > baseHealthData.components.goals.score ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(simulationResults.simulatedGoalReadiness - baseHealthData.components.goals.score)}%
                      </span>
                    )}
                  </div>
                </div>

              </div>
              <p className="p-3 text-[10px] text-slate-550 bg-slate-950/40 rounded-b-xl border-t border-slate-900/60 leading-relaxed italic text-center">
                *Note: Before-and-after calculations are simulated approximations based on static current balances and assume constant future income. No absolute certainty is implied.
              </p>
            </CardContent>
          </Card>

          {/* 12-Month Accumulation Graph Card */}
          <Card>
            <CardHeader pb-2>
              <h3 className="font-display font-semibold text-base text-white">Projected Portfolio Value (12 Mos)</h3>
              <p className="text-xs text-slate-500">Baseline path vs simulated scenario parameters</p>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#475569" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#161f30" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
                    <YAxis 
                      stroke="#64748b" 
                      tickLine={false}
                      domain={['dataMin - 100000', 'auto']}
                      tickFormatter={(v) => `${(v/1000)}k`}
                    />
                    <RechartsTooltip formatter={(v: any) => formatINR(Number(v))} />
                    <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" />
                    <Area name="Baseline Path" type="monotone" dataKey="Baseline" stroke="#64748b" fillOpacity={1} fill="url(#colorBaseline)" strokeWidth={1.5} />
                    <Area name="Simulated Scenario" type="monotone" dataKey="Simulated" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSimulated)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Chat Link Action */}
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-950/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                Scenario Advisory Agent
              </span>
              <p className="text-xs text-slate-400 leading-normal">
                Want to stress-test this setup or request custom savings allocations?
              </p>
            </div>
            <Button 
              onClick={handleAskAdvisor}
              rightIcon={<ArrowUpRight className="h-4 w-4" />}
              className="bg-blue-600 hover:bg-blue-500 text-xs w-full sm:w-auto"
            >
              Ask AI Advisor About This Scenario
            </Button>
          </div>

        </div>

      </div>

      {/* Disclaimer */}
      <footer className="text-center text-[10px] text-slate-550 pt-2 pb-6 border-t border-slate-900/50">
        <span>Disclaimer: WealthTwin AI provides financial guidance, scenario analysis, and educational recommendations. We do not provide regulated investment advice.</span>
      </footer>

    </div>
  );
};
