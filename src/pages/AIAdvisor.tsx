import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  AlertTriangle, 
  Cpu,
  ChevronRight
} from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

interface MessagePayload {
  affordability?: string;
  cashFlow?: string;
  reserves?: string;
  risks?: string[];
  alternatives?: string[];
  metrics?: { label: string; value: string }[];
  actions?: { text: string; link?: string; runSimulation?: boolean }[];
  provenance?: {
    twinData: string[];
    calculations: string[];
    modules: string[];
  };
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  payload?: MessagePayload;
}

export const AIAdvisor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasLoadedContext = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_1',
      sender: 'ai',
      text: "Hello Arjun, I'm your WealthTwin AI Advisor. I've synced with your Financial Digital Twin balance sheet context.\n\nHere is your active state ledger:\n• **Net Worth**: ₹6,72,000\n• **Monthly Surplus**: ₹24,000\n• **Gadget Loan EMI**: ₹12,500/mo (10.5% interest)\n• **Primary Goal**: Hatchback Car (₹4L saved / ₹6L target)\n\nAsk me about affordability projections, budget optimizations, or early debt payoffs.",
      timestamp: '02:45 PM'
    }
  ]);

  const [expandedProv, setExpandedProv] = useState<Record<string, boolean>>({});

  const toggleProvenance = (msgId: string) => {
    setExpandedProv((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const quickPrompts = [
    { label: 'Can I afford a ₹15 lakh car next year?', value: 'Can I afford a ₹15 lakh car next year?' },
    { label: 'How can I improve my financial health score?', value: 'How can I improve my financial health score?' },
    { label: 'Where am I overspending?', value: 'Where am I overspending?' },
    { label: 'Am I prepared for an emergency?', value: 'Am I prepared for an emergency?' },
    { label: 'How can I reach my car goal faster?', value: 'How can I reach my car goal faster?' }
  ];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  // Scroll to bottom helper
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load simulator redirect context if present
  useEffect(() => {
    if (location.state?.simulationContext && !hasLoadedContext.current) {
      hasLoadedContext.current = true;
      const ctx = location.state.simulationContext;
      const query = `[Stress Test simulation] I am simulating the scenario "${ctx.scenarioType}" with the following inputs:
- Price: ${formatINR(ctx.carPrice || ctx.price || 0)}
- Down Payment: ${formatINR(ctx.downPayment || 0)}
- Tenure: ${ctx.tenureYears || 0} Years
- Interest Rate: ${ctx.interestRate}%
- Timeline: ${ctx.timelineMonths === 0 ? 'Immediate' : `${ctx.timelineMonths} months`}

How will this impact my digital twin?`;
      handleSend(query);
    }
  }, [location.state]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  // Trigger local demo replies based on questions
  const triggerDemoResponse = (query: string) => {
    setTimeout(() => {
      let aiText = '';
      let payload: MessagePayload | undefined = undefined;

      const normQuery = query.toLowerCase();

      if (normQuery.includes('15 lakh car') || normQuery.includes('afford') || normQuery.includes('[stress test')) {
        aiText = "Based on your financial digital twin, I have performed a stress-test of purchasing a ₹15,00,000 vehicle next year.";
        payload = {
          affordability: "⚠️ Consider Delaying / Proceed with Caution. Your current cash flow can support the down payment, but the monthly EMI commits nearly all of your unallocated surplus.",
          cashFlow: "🚨 Monthly Surplus drops from ₹24,000 to ₹1,168/month. This leaves a minimal cash flow buffer for unexpected expenses.",
          reserves: "⚠️ Emergency coverage declines to 4.7 months (assuming savings timeline accumulation). Doing this today would cause an immediate cash deficit of -₹60,000.",
          risks: [
            "Spikes your Debt-to-Income (DTI) ratio from 14.7% to 41.6%, exceeding the safe limit of 35%.",
            "Depletes monthly savings rate, limiting future investment compounding."
          ],
          alternatives: [
            "Delay purchase by 6 months to accumulate ₹1.44L additional cash float.",
            "Increase down payment to ₹6,00,000 to lower monthly EMI to ₹18,682.",
            "Choose a lower price vehicle (₹10,00,000) to keep DTI under 32%."
          ],
          metrics: [
            { label: "Loan Amount", value: "₹11,00,000" },
            { label: "Estimated EMI", value: "₹22,832/mo" },
            { label: "New DTI Ratio", value: "41.6%" },
            { label: "Post-EMI Surplus", value: "₹1,168/mo" }
          ],
          actions: [
            { text: "Run What-If Simulation", runSimulation: true },
            { text: "Inspect Goals Timeline", link: "/wealth/goals" }
          ],
          provenance: {
            twinData: [
              "Liquid cash reserves: ₹3.40L",
              "Current surplus: ₹24,000/mo",
              "Mandatory EMI obligation: ₹12,500/mo"
            ],
            calculations: [
              "Amortization EMI compound rate: 9% p.a. over 60 months on ₹11L principal",
              "Post-purchase surplus: ₹24k surplus - ₹22.8k EMI = ₹1.16k",
              "Simulated DTI: (₹12.5k + ₹22.8k) / ₹85k = 41.6%"
            ],
            modules: [
              "Spending Intelligence Agent — evaluated surplus cushion limits",
              "Risk & Resilience Agent — evaluated reserve drawdowns & DTI limits",
              "Goal Planning Agent — checked car purchase goal milestone feasibility"
            ]
          }
        };
      } else if (normQuery.includes('health') || normQuery.includes('score')) {
        aiText = "To raise your Financial Health Score from 78 to 85+ (Excellent), our specialist agents suggest focusing on debt clearance and liquid emergency reserves.";
        payload = {
          affordability: "✅ Excellent Room for Improvement. You have high surplus margins that can be repurposed to optimize sub-scores.",
          cashFlow: "Frees up ₹12,500/month by clearing outstanding gadget liabilities.",
          reserves: "Increases emergency reserves to a dedicated 6-month buffer (₹3,00,000).",
          risks: [
            "Carrying a 10.5% gadget interest rate acts as a cash drag."
          ],
          alternatives: [
            "Prepay personal gadget loan early using checking cash float.",
            "Automate ₹8,000/mo surplus sweeps to goal buckets."
          ],
          metrics: [
            { label: "Current Score", value: "78 / 100" },
            { label: "Target Score", value: "85+" },
            { label: "Gadget Loan Interest", value: "10.5%" },
            { label: "Reserves Gap", value: "₹1,45,000" }
          ],
          actions: [
            { text: "Prepay Loan in Simulator", link: "/wealth/simulator" }
          ],
          provenance: {
            twinData: [
              "DTI: 14.7%",
              "Emergency coverage: 4.1 months",
              "Savings Rate: 28.2%"
            ],
            calculations: [
              "Weight aggregation: Savings (25%), Emergency (20%), Debt (20%), Investments (20%), Goals (15%)",
              "Score delta on debt clearance: raises DTI score from 75 to 100",
              "Score delta on reserve clearance: raises Emergency score from 68 to 100"
            ],
            modules: [
              "Risk & Resilience Agent — evaluated debt amortization & emergency metrics",
              "Wealth Strategy Agent — formulated prioritized score escalation roadmap"
            ]
          }
        };
      } else if (normQuery.includes('spending') || normQuery.includes('overspending') || normQuery.includes('expense')) {
        aiText = "Our Spending Intelligence Agent has analyzed your transaction ledgers and category outlays.";
        payload = {
          affordability: "✅ Healthy Budget Structure. Needs are aligned at 48% of gross salary, but discretionary spikes are emerging.",
          cashFlow: "Dining out and entertainment outlays have grown 18% MoM, consuming ₹20,400.",
          reserves: "Checking account float stands at ₹1,85,000, which has inflated from idle balances.",
          risks: [
            "Checking cash inflation leaves capital uninvested.",
            "High interest personal loan remains active."
          ],
          alternatives: [
            "Automate surplus sweeps to clear gadget debt.",
            "Cap wants (dining out) to ₹15,000/month."
          ],
          metrics: [
            { label: "Needs Ratio", value: "48% (Target: 50%)" },
            { label: "Wants Ratio", value: "24% (Target: 30%)" },
            { label: "Dining MoM Growth", value: "+18%" }
          ],
          actions: [
            { text: "Optimize Budgets in Simulator", link: "/wealth/simulator" }
          ],
          provenance: {
            twinData: [
              "Monthly income: ₹85,000",
              "Essential outlays: ₹40,800",
              "Discretionary outlays: ₹20,400"
            ],
            calculations: [
              "50/30/20 ratio checks against current expenses",
              "Dining out category ledger comparison vs previous billing cycles"
            ],
            modules: [
              "Spending Intelligence Agent — analyzed transactions and category splits",
              "Risk & Resilience Agent — checked debt service constraints"
            ]
          }
        };
      } else if (normQuery.includes('emergency') || normQuery.includes('prepared')) {
        aiText = "Here is the Risk & Resilience assessment of your liquid reserve buffer.";
        payload = {
          affordability: "⚠️ Fair Preparation. Your dedicated savings cover 3.2 months, while your total bank balances cover 7.0 months of outlays.",
          cashFlow: "Strong surplus of ₹24,000/mo allows you to quickly build emergency reserves.",
          reserves: "Dedicated savings account holds ₹1,55,000. Safety target is ₹3,00,000 (6 months of needs).",
          risks: [
            "Mixing savings and checking float can lead to inadvertent spending."
          ],
          alternatives: [
            "Sweep ₹12,000/mo of your surplus directly into dedicated savings."
          ],
          metrics: [
            { label: "Savings Balance", value: "₹1,55,000" },
            { label: "Checking Balance", value: "₹1,85,000" },
            { label: "Emergency Coverage", value: "3.2 Mos (Dedicated)" }
          ],
          actions: [
            { text: "Launch Simulator Projections", link: "/wealth/simulator" }
          ],
          provenance: {
            twinData: [
              "Dedicated savings ledger: ₹1,55,000",
              "Monthly essential expenses: ₹48,500"
            ],
            calculations: [
              "Emergency coverage = ₹1,55,000 / ₹48,500 = 3.19 months"
            ],
            modules: [
              "Risk & Resilience Agent — evaluated reserve drawdowns and safety coverage"
            ]
          }
        };
      } else if (normQuery.includes('car goal') || normQuery.includes('faster')) {
        aiText = "Here is the Goal Planning Agent's report on your vehicle target timeline acceleration.";
        payload = {
          affordability: "✅ On Track. Your hatchback car purchase is currently 67% funded (₹4,00,000 saved of ₹6,00,000 target).",
          cashFlow: "Requires ₹11,765/month to fund the remaining ₹2,00,000 gap by December 2027.",
          reserves: "Dedicated savings can be earmarked to separate vehicle SIP buckets.",
          risks: [
            "Gadget loan payments drag available surplus cash."
          ],
          alternatives: [
            "Escalate monthly sweeps to ₹15,000/mo to hit target by September 2027.",
            "Prepay gadget loan to free up ₹12.5k/mo, accelerating goal completion to August 2027."
          ],
          metrics: [
            { label: "Goal Progress", value: "67%" },
            { label: "Remaining Gap", value: "₹2,00,000" },
            { label: "Timeline Left", value: "17 Months" }
          ],
          actions: [
            { text: "Test Sweeps in Simulator", link: "/wealth/simulator" }
          ],
          provenance: {
            twinData: [
              "Car goal target: ₹6,00,000",
              "Current saved: ₹4,00,000",
              "Target Date: 2027-12-31"
            ],
            calculations: [
              "Months remaining relative to mock baseline: 17 months",
              "Goal funding gap: ₹6,00,000 - ₹4,00,000 = ₹2,00,000",
              "Required allocation = ₹2,00,000 / 17 = ₹11,765/month"
            ],
            modules: [
              "Goal Planning Agent — calculated timelines and contribution rates",
              "Wealth Strategy Agent — structured priority list for debt paydown vs goal funding"
            ]
          }
        };
      } else {
        aiText = `I have analyzed your request: "${query}". As a simulated advisor agent, I can analyze your financial footprint. Please choose one of the predefined questions below for detailed, multi-agent ledger stress tests.`;
      }

      const aiResponse: Message = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        payload
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          context: location.state?.simulationContext || {}
        })
      });

      if (!response.ok) throw new Error('API server unavailable');

      const data = await response.json();
      
      if (data.demoMode) {
        triggerDemoResponse(textToSend);
      } else {
        const aiMessage: Message = {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }

    } catch (err) {
      // Gracefully fall back to local demo answers
      triggerDemoResponse(textToSend);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col justify-between">
      {/* Page Header */}
      <PageHeader
        title="AI Wealth Advisor"
        subtitle="Conversational interface syncing with your complete balance sheet footprint."
        showBackButton={true}
      />

      {/* Main chat window wrapper */}
      <Card className="flex-grow flex flex-col bg-slate-900 border border-slate-800 p-0 overflow-hidden min-h-[450px]">
        
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Bot className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                WealthTwin Advisory Agent
              </h4>
              <p className="text-[9px] text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
                <Cpu className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Financial Digital Twin Synced</span>
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm">Active Sync</Badge>
        </div>

        {/* Chat Bubbles Scroll Area */}
        <div className="flex-grow p-5 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/20">
          
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-3 max-w-[90%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                msg.sender === 'user' 
                  ? 'bg-slate-800 border-slate-700 text-slate-350'
                  : 'bg-blue-600/10 border-blue-500/20 text-blue-400'
              }`}>
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble Body */}
              <div className={`space-y-2 w-full ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                
                <div className={`p-4 rounded-xl text-xs leading-relaxed whitespace-pre-line shadow ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none ml-auto max-w-fit'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

                {/* Structured payload renderer for AI messages */}
                {msg.sender === 'ai' && msg.payload && (
                  <div className="space-y-4 mt-3 max-w-2xl text-xs">
                    
                    {/* Metrics Grid */}
                    {msg.payload.metrics && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {msg.payload.metrics.map((m, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-left">
                            <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-wider">{m.label}</span>
                            <span className="font-semibold text-white text-xs mt-0.5 block">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Affordability & Cash Flow & Reserves Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      {msg.payload.affordability && (
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Assessment Status</span>
                          <p className="text-slate-300 leading-normal">{msg.payload.affordability}</p>
                        </div>
                      )}

                      {msg.payload.cashFlow && (
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Cash-Flow Impact</span>
                          <p className="text-slate-300 leading-normal">{msg.payload.cashFlow}</p>
                        </div>
                      )}
                    </div>

                    {msg.payload.reserves && (
                      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 text-left space-y-1">
                        <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Reserves Cushion Impact</span>
                        <p className="text-slate-300 leading-normal">{msg.payload.reserves}</p>
                      </div>
                    )}

                    {/* Risks and Alternatives */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      {msg.payload.risks && msg.payload.risks.length > 0 && (
                        <div className="p-3.5 rounded-lg bg-red-950/10 border border-red-900/20 space-y-2">
                          <span className="text-[9px] text-red-400 font-bold block uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Core Risk Factors
                          </span>
                          <ul className="space-y-1 text-slate-350 list-disc list-inside">
                            {msg.payload.risks.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      )}

                      {msg.payload.alternatives && msg.payload.alternatives.length > 0 && (
                        <div className="p-3.5 rounded-lg bg-blue-950/10 border border-blue-900/20 space-y-2">
                          <span className="text-[9px] text-blue-400 font-bold block uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            Alternative Options
                          </span>
                          <ul className="space-y-1 text-slate-350 list-disc list-inside">
                            {msg.payload.alternatives.map((a, i) => <li key={i}>{a}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Recommended Next Actions */}
                    {msg.payload.actions && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.payload.actions.map((act, i) => (
                          <Button
                            key={i}
                            variant={act.runSimulation ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => {
                              if (act.runSimulation) navigate('/wealth/simulator');
                              else if (act.link) navigate(act.link);
                            }}
                            rightIcon={<ChevronRight className="h-3 w-3" />}
                            className="text-[11px] py-1.5 px-3"
                          >
                            {act.text}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Provenance: How this recommendation was generated */}
                    {msg.payload.provenance && (
                      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/40">
                        <button
                          onClick={() => toggleProvenance(msg.id)}
                          className="w-full px-4 py-2.5 text-left font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-between select-none cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                            <Cpu className="h-3.5 w-3.5 text-blue-400" />
                            How this recommendation was generated
                          </span>
                          <ChevronRight className={`h-4 w-4 transform transition-transform ${expandedProv[msg.id] ? 'rotate-90' : ''}`} />
                        </button>
                        
                        {expandedProv[msg.id] && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-850 bg-slate-950/40 space-y-3 text-left text-slate-400 text-[11px] leading-relaxed">
                            <div>
                              <strong className="text-white block mb-1">Financial Twin Data Considered:</strong>
                              <ul className="list-disc list-inside space-y-0.5">
                                {msg.payload.provenance.twinData.map((d, idx) => <li key={idx}>{d}</li>)}
                              </ul>
                            </div>
                            <div>
                              <strong className="text-white block mb-1">Calculations Performed:</strong>
                              <ul className="list-disc list-inside space-y-0.5">
                                {msg.payload.provenance.calculations.map((c, idx) => <li key={idx}>{c}</li>)}
                              </ul>
                            </div>
                            <div>
                              <strong className="text-white block mb-1">Specialist Modules Active:</strong>
                              <ul className="list-disc list-inside space-y-0.5 text-blue-400 font-medium">
                                {msg.payload.provenance.modules.map((m, idx) => <li key={idx}>{m}</li>)}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

                <span className="text-[9px] text-slate-500 block px-1">
                  {msg.timestamp}
                </span>

              </div>
            </div>
          ))}

          {/* Typing Loading State bubble */}
          {isTyping && (
            <div className="flex items-start gap-3 mr-auto max-w-[85%]">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border bg-blue-600/10 border-blue-500/20 text-blue-400">
                <Bot className="h-4 w-4 animate-bounce" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl rounded-tl-none flex items-center gap-1.5 shadow">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Questions Drawer */}
        {!isTyping && (
          <div className="px-5 py-3 border-t border-slate-850/80 bg-slate-900/40 space-y-1.5 text-left">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Suggested Actions</span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSend(p.value)}
                  className="text-[10px] text-blue-400 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 px-3 py-1 rounded-lg transition-all cursor-pointer select-none"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask the advisor about loan prepayment, SIP optimizations, tax hacks..."
            rows={1}
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-550 focus:outline-none focus:border-slate-700 focus:ring-0 resize-none h-10 max-h-12 leading-relaxed"
          />
          <Button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="h-10 px-4 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

      </Card>

      {/* Subtle Compliance Disclaimer */}
      <footer className="text-center text-[10px] text-slate-550 pt-2 pb-6 border-t border-slate-900/50 mt-4">
        <span>Disclaimer: WealthTwin AI provides financial guidance, scenario analysis, and educational recommendations. We do not provide regulated investment advice.</span>
      </footer>

    </div>
  );
};
