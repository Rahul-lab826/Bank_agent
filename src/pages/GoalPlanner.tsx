import React, { useState } from 'react';
import { Target, Plus, Calendar, Sparkles, TrendingUp, Info } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardContent } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { financialGoals as initialGoals } from '../mock/financialData';
import type { FinancialGoal } from '../types';

// Financial Engine
import { analyzeGoal } from '../engine/goalEngine';

export const GoalPlanner: React.FC = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>(initialGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const onTrackCount = goals.map(analyzeGoal).filter(r => r.isOnTrack).length;
  
  // Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState<'Car' | 'Emergency' | 'Retirement' | 'House' | 'Travel'>('Car');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate) return;

    const newGoal: FinancialGoal = {
      id: `goal_sim_${Date.now()}`,
      name,
      targetAmount: Number(targetAmount),
      currentAmount: 0, // Starts at 0 saved
      targetDate,
      category,
      priority
    };

    setGoals((prev) => [...prev, newGoal]);
    
    // Clear form
    setName('');
    setTargetAmount('');
    setTargetDate('');
    setCategory('Car');
    setPriority('Medium');
    setIsModalOpen(false);
  };

  // Recommendations for goals
  const goalRecommendations = [
    {
      goalId: 'goal_1',
      text: 'To guarantee your hatchback car purchase by Dec 2027, increase your dedicated SIP savings by ₹5,000/mo. This covers the remaining ₹4,50,000 deficit comfortably under moderate returns (12% CAGR).'
    },
    {
      goalId: 'goal_2',
      text: 'You are ₹55,000 short of a full 6-Month Emergency Buffer. We advise allocating ₹12,000/mo of your current ₹24,000 surplus to reach this buffer by October 2026.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Goal Planner"
        subtitle="Manage and simulate long-term targets, tracking optimal AI saving plans for each."
        showBackButton={true}
        action={
          <Button 
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="shadow-sm shadow-blue-500/10"
          >
            Create Simulated Goal
          </Button>
        }
      />

      {/* Goal Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Active Goals</span>
            <h4 className="font-display font-semibold text-lg text-white mt-0.5">{goals.length} Goals</h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Saved for Goals</span>
            <h4 className="font-display font-semibold text-lg text-white mt-0.5">
              {formatINR(goals.reduce((sum, g) => sum + g.currentAmount, 0))}
            </h4>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 rounded-lg bg-blue-950/20 text-blue-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AI Goal Health</span>
            <h4 className="font-display font-semibold text-sm text-slate-200 mt-1">
              {onTrackCount} / {goals.length} Goals On Track
            </h4>
          </div>
        </Card>
      </div>

      {/* Goals List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Goals Progress cards */}
        <div className="lg:col-span-8 space-y-4">
          {goals.map((goal) => {
            const report = analyzeGoal(goal);
            const recommendation = goalRecommendations.find((r) => r.goalId === goal.id);
            return (
              <Card key={goal.id} className="hover:border-slate-800 transition-all">
                <CardContent className="space-y-4">
                  {/* Top line header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-semibold text-base text-white">{goal.name}</h4>
                        {goal.id.startsWith('goal_sim_') && (
                          <Badge variant="accent" size="sm">Simulated</Badge>
                        )}
                        <Badge variant={report.isOnTrack ? 'success' : 'warning'} size="sm">
                          {report.isOnTrack ? 'On Track' : 'Review'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="capitalize">Category: {goal.category}</span>
                        <span>&bull;</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-600" />
                          <span>Deadline: {goal.targetDate} ({report.monthsRemaining} mos left)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant={goal.priority === 'High' ? 'error' : goal.priority === 'Medium' ? 'info' : 'neutral'} size="sm">
                        {goal.priority} Priority
                      </Badge>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <ProgressBar 
                      value={goal.currentAmount} 
                      max={goal.targetAmount}
                      color={goal.category === 'Car' ? 'indigo' : goal.category === 'Emergency' ? 'green' : 'blue'}
                      size="md"
                      label={`Current Completion: ${report.progressPercent}%`}
                      subLabel={`${formatINR(goal.currentAmount)} saved / ${formatINR(goal.targetAmount)} target (Gap: ${formatINR(report.fundingGap)})`}
                    />
                  </div>

                  {/* Required Monthly Contribution */}
                  <div className="flex justify-between text-xs text-slate-400 pt-1 border-t border-slate-900/40">
                    <span>Required Monthly Allocation (Scenario Analysis):</span>
                    <span className="font-semibold text-white">{formatINR(report.requiredMonthlyContribution)}/mo</span>
                  </div>

                  {/* Recommendation sub-banner if available */}
                  {recommendation && (
                    <div className="p-3 rounded-lg bg-blue-950/15 border border-blue-550/20 text-xs flex gap-2.5">
                      <Sparkles className="h-4.5 w-4.5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-350 leading-relaxed">
                        <strong>Advisor recommendation:</strong> {recommendation.text}
                      </p>
                    </div>
                  )}

                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Goal Advisory insights */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader divider={true}>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
                Goal Funding Strategy
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-start gap-3">
                <Info className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-400 leading-normal">
                  Your goals are funded by a combinations of checking accounts sweeps and external mutual funds portfolios.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Active Allocations</h4>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                  <span className="text-slate-350">Hatchback Car SIP</span>
                  <span className="font-semibold text-white">₹8,000/mo suggested</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                  <span className="text-slate-350">Emergency Reserve sweep</span>
                  <span className="font-semibold text-white">₹12,000/mo suggested</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-350">Retirement Compound SIP</span>
                  <span className="font-semibold text-white">₹15,000/mo active</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-850">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Simulated Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Create Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Simulated Goal"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateGoal}>
              Create Goal
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleCreateGoal}>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Goal Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Europe Vacation or House Downpayment"
              className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-700 focus:ring-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Amount (INR)
              </label>
              <input
                type="number"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 300000"
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-700 focus:ring-0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Date
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-700 focus:ring-0 text-slate-350"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-350 focus:outline-none focus:border-slate-700 focus:ring-0"
              >
                <option value="Car">Car</option>
                <option value="Emergency">Emergency Fund</option>
                <option value="Retirement">Retirement</option>
                <option value="House">House</option>
                <option value="Travel">Travel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-350 focus:outline-none focus:border-slate-700 focus:ring-0"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

    </div>
  );
};
