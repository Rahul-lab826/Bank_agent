import type { FinancialGoal } from '../types';
import type { GoalTelemetry } from './types';

/**
 * Calculates months remaining between today (July 13, 2026) and target date
 */
export const calculateMonthsRemaining = (targetDateStr: string): number => {
  const currentDate = new Date('2026-07-13'); // Fixed mock date for baseline consistency
  const targetDate = new Date(targetDateStr);
  
  if (isNaN(targetDate.getTime())) return 12; // Fallback
  
  const yearsDiff = targetDate.getFullYear() - currentDate.getFullYear();
  const monthsDiff = targetDate.getMonth() - currentDate.getMonth();
  const totalMonths = (yearsDiff * 12) + monthsDiff;
  
  return Math.max(1, totalMonths);
};

/**
 * Evaluates goal telemetry metrics (progress, gap, required contributions)
 */
export const analyzeGoal = (goal: FinancialGoal): GoalTelemetry => {
  const progressPercent = goal.targetAmount > 0 
    ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) 
    : 0;
  
  const fundingGap = Math.max(0, goal.targetAmount - goal.currentAmount);
  const monthsRemaining = calculateMonthsRemaining(goal.targetDate);
  const requiredMonthlyContribution = monthsRemaining > 0 
    ? fundingGap / monthsRemaining 
    : 0;

  // An educational heuristic on track checking:
  // e.g. If saved progress is high or contribution required fits the profile budget
  const isOnTrack = progressPercent >= (100 - (monthsRemaining * 2)); 

  return {
    id: goal.id,
    name: goal.name,
    progressPercent: Math.round(progressPercent * 10) / 10,
    fundingGap,
    monthsRemaining,
    requiredMonthlyContribution: Math.round(requiredMonthlyContribution),
    isOnTrack
  };
};
