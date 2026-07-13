export interface HealthComponentOutput {
  score: number;
  status: 'Critical' | 'Fair' | 'Good' | 'Excellent';
  factors: string[];
  opportunities: string[];
}

export interface HealthScoreOutput {
  overallScore: number;
  status: 'Critical' | 'Fair' | 'Good' | 'Excellent';
  components: {
    savings: HealthComponentOutput;
    emergency: HealthComponentOutput;
    debt: HealthComponentOutput;
    investment: HealthComponentOutput;
    goals: HealthComponentOutput;
  };
  positiveFactors: string[];
  improvementAreas: string[];
}

export interface GoalTelemetry {
  id: string;
  name: string;
  progressPercent: number;
  fundingGap: number;
  monthsRemaining: number;
  requiredMonthlyContribution: number;
  isOnTrack: boolean;
}

export interface SimulationResult {
  month: string;
  Baseline: number;
  Simulated: number;
}
