import type { SimulationResult } from './types';

/**
 * Runs a deterministic 12-month wealth projection
 * @param startNetWorth Current Net Worth starting balance
 * @param baseSip Baseline monthly SIP contribution
 * @param simSip Simulated monthly SIP contribution
 * @param baseExpenses Baseline monthly expense outlays
 * @param expenseCutPercent Simulated percentage reduction in monthly expenses
 * @returns 12-month baseline vs simulated projection datasets
 */
export const runWealthSimulation = (
  startNetWorth: number,
  baseSip: number,
  simSip: number,
  baseExpenses: number,
  expenseCutPercent: number
): SimulationResult[] => {
  const results: SimulationResult[] = [];
  let baseAccumulator = startNetWorth;
  let simAccumulator = startNetWorth;

  const monthlyGrowthRate = 0.01; // 12% p.a. divided by 12 months = 1.0% monthly returns
  
  // Calculate savings freed up by budget reductions
  const expenseSavings = baseExpenses * (expenseCutPercent / 100);
  const totalSimulatedMonthlySIP = simSip + expenseSavings;

  const months = [
    'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26', 
    'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'May 27', 'Jun 27'
  ];

  for (let i = 0; i < 12; i++) {
    // Baseline compounding: NetWorth * (1 + rate) + regular SIP
    baseAccumulator = (baseAccumulator * (1 + monthlyGrowthRate)) + baseSip;
    
    // Simulated compounding: NetWorth * (1 + rate) + simulated SIP
    simAccumulator = (simAccumulator * (1 + monthlyGrowthRate)) + totalSimulatedMonthlySIP;

    results.push({
      month: months[i],
      Baseline: Math.round(baseAccumulator),
      Simulated: Math.round(simAccumulator)
    });
  }

  return results;
};
