export default async function handler(req: any, res: any) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Parse body
  let body = '';
  req.on('data', (chunk: any) => {
    body += chunk;
  });

  await new Promise<void>((resolve) => {
    req.on('end', () => {
      resolve();
    });
  });

  try {
    const { message, context } = JSON.parse(body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ demoMode: true, message: "No Gemini API Key configured in vercel environment. Running in Demo Mode." }));
      return;
    }

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are the WealthTwin AI Advisor, an agentic wealth coach integrated into Arjun Mehta's banking profile.
                
Arjun's Financial Profile:
- Age: 28
- Gross Monthly Income: ₹85,000
- Essential Monthly Expenses: ₹48,500
- Active Debt EMI: ₹12,500 (Gadget loan with ₹1,48,000 outstanding balance at 10.5% interest)
- Monthly Surplus: ₹24,000
- Net Worth: ₹6,72,000 (Assets: ₹8.20L, Liabilities: ₹1.48L)
- Current Goals: Buy Hatchback Car (₹6,00,000 target by Dec 2027, ₹4,00,000 currently saved)

User's Question: "${message}"

Specific context parameters if simulated: ${JSON.stringify(context || {})}

Provide a professional, clear, structured response inside clean markdown blocks. Be encouraging but direct. Do not write generic advice. Ground your mathematical recommendations in his actual balance sheet numbers.
Include structured cards (bullet points or tables) explaining:
1. Affordability Assessment or direct query resolution.
2. Cash-flow impact (surplus changes).
3. Emergency reserves impact (cushion status).
4. Alternatives (e.g. down payment adjustments, timelines).
5. Recommended actions.

End with: "Disclaimer: This represents scenario analysis for educational guidance, not regulated investment advice."`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to synthesize a response. Let me consult my core ledger.";

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ text: replyText }));

  } catch (err: any) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Internal Server Error', demoMode: true }));
  }
}
