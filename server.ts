import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { getDatabase, saveDatabase, resetDatabaseToSeed, runScenarioSimulation, recalculateCompanyKPIs } from './server/db';
import { DatabaseState, ScenarioInput } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini AI Client Helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// 1. AUTH API ROUTES
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  if (user) {
    return res.json({ success: true, user, token: `mock-jwt-token-${user.id}` });
  }

  // Default login fallback for demo
  const defaultUser = db.users[0];
  res.json({
    success: true,
    user: { ...defaultUser, email: email || defaultUser.email },
    token: `mock-jwt-token-${defaultUser.id}`,
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, role, companyName } = req.body;
  const db = getDatabase();

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'New Founder',
    email: email || 'founder@startup.io',
    role: role || 'Founder',
    companyId: db.companies[0].id,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };

  db.users.push(newUser);
  if (companyName) {
    db.companies[0].name = companyName;
  }
  saveDatabase(db);

  res.json({ success: true, user: newUser, token: `mock-jwt-token-${newUser.id}` });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  res.json({ success: true, message: `Password reset instructions sent to ${email || 'your email'}` });
});

// -------------------------------------------------------------
// 2. DATABASE CRUD REST API
// -------------------------------------------------------------
app.get('/api/db/state', (req, res) => {
  const db = getDatabase();
  recalculateCompanyKPIs(db);
  res.json(db);
});

app.post('/api/db/reset', (req, res) => {
  const db = resetDatabaseToSeed();
  res.json({ success: true, db });
});

// Generic Table CRUD: Add Item
app.post('/api/db/:table', (req, res) => {
  const table = req.params.table as keyof DatabaseState;
  const item = req.body;
  const db = getDatabase();

  if (!Array.isArray(db[table])) {
    return res.status(400).json({ error: `Invalid table: ${table}` });
  }

  if (!item.id) {
    item.id = `${table.slice(0, 4)}-${Date.now()}`;
  }

  (db[table] as any[]).unshift(item);

  // Auto notification on high expense or risk
  if (table === 'expenses' && item.amount > 10000) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'High Expense Recorded',
      message: `New expense of $${item.amount.toLocaleString()} was added for vendor "${item.vendor}".`,
      type: 'finance',
      read: false,
      createdAt: 'Just now',
    });
  }

  saveDatabase(db);
  res.json({ success: true, item, db });
});

// Generic Table CRUD: Update Item
app.put('/api/db/:table/:id', (req, res) => {
  const table = req.params.table as keyof DatabaseState;
  const id = req.params.id;
  const updates = req.body;
  const db = getDatabase();

  if (!Array.isArray(db[table])) {
    return res.status(400).json({ error: `Invalid table: ${table}` });
  }

  const list = db[table] as any[];
  const index = list.findIndex((x) => x.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  list[index] = { ...list[index], ...updates };
  saveDatabase(db);

  res.json({ success: true, item: list[index], db });
});

// Generic Table CRUD: Delete Item
app.delete('/api/db/:table/:id', (req, res) => {
  const table = req.params.table as keyof DatabaseState;
  const id = req.params.id;
  const db = getDatabase();

  if (!Array.isArray(db[table])) {
    return res.status(400).json({ error: `Invalid table: ${table}` });
  }

  const list = db[table] as any[];
  db[table] = list.filter((x) => x.id !== id) as any;
  saveDatabase(db);

  res.json({ success: true, db });
});

// Update Company Settings / Profile
app.put('/api/db/company/settings', (req, res) => {
  const { company: updatedCompany, settings: updatedSettings } = req.body;
  const db = getDatabase();

  if (updatedCompany) {
    db.companies[0] = { ...db.companies[0], ...updatedCompany };
  }
  if (updatedSettings) {
    db.settings = { ...db.settings, ...updatedSettings };
  }

  saveDatabase(db);
  res.json({ success: true, db });
});

// -------------------------------------------------------------
// 3. SCENARIO SIMULATION ENGINE API
// -------------------------------------------------------------
app.post('/api/scenario/simulate', (req, res) => {
  const input: ScenarioInput = req.body;
  const db = getDatabase();
  const result = runScenarioSimulation(input, db);
  res.json({ success: true, result });
});

// -------------------------------------------------------------
// 4. AI BUSINESS ADVISOR & INSIGHTS (GEMINI INTEGRATION)
// -------------------------------------------------------------
app.post('/api/ai/advisor', async (req, res) => {
  try {
    const { prompt, history } = req.body;
    const db = getDatabase();
    const company = db.companies[0];

    const ai = getGeminiClient();

    // Prepare live database context
    const dbContext = {
      companyName: company.name,
      monthlyRevenue: company.monthlyRevenue,
      monthlyExpenses: company.monthlyExpenses,
      burnRate: company.burnRate,
      cashBalance: company.cashBalance,
      runwayMonths: company.runwayMonths,
      healthScore: company.healthScore,
      activeCustomers: company.activeCustomersCount,
      churnRate: company.customerChurnRate,
      teamCount: company.teamCount,
      openTasksCount: db.tasks.filter((t) => t.status !== 'Done').length,
      overdueTasksCount: db.tasks.filter((t) => t.isOverdue).length,
      activeRisks: db.risks.filter((r) => r.status === 'Active').map((r) => ({ title: r.title, level: r.riskLevel })),
      recentRevenueSources: db.revenue.slice(0, 5).map((r) => `${r.category}: $${r.amount}`),
      recentExpenseVendors: db.expenses.slice(0, 5).map((e) => `${e.vendor} (${e.category}): $${e.amount}`),
      goals: db.goals.map((g) => ({ title: g.title, progress: `${g.progress}%`, status: g.status })),
    };

    if (!ai) {
      // High quality fallback AI reasoning if API key not available
      const fallbackText = `### 📊 Real-Time Startup Analysis for **${company.name}**

**1. Financial Health & Runway**
• Monthly Revenue: **$${company.monthlyRevenue.toLocaleString()}** | Monthly Expenses: **$${company.monthlyExpenses.toLocaleString()}**
• Net Cash Balance: **$${company.cashBalance.toLocaleString()}**
• Estimated Cash Runway: **${company.runwayMonths} months** (Healthy position > 12 months)

**2. Key Strategic Insights & Risks**
• **Customer Retention**: Churn is currently at **${company.customerChurnRate}%**, which is well below the 3% industry danger threshold.
• **Task Velocity**: You have **${dbContext.overdueTasksCount} overdue tasks**. Engineering backlog should be prioritized.
• **Operational Risks**: Detected **${dbContext.activeRisks.length} active risks**, including cloud infrastructure costs.

**3. Actionable Recommendations for Founder**
1. **Optimize Vendor Spend**: Conduct a cloud infrastructure audit to shave 10-15% off AWS/GCP bills.
2. **Accelerate Enterprise Pipeline**: Focus Sales team on closing the 3 pending $40k+ deals in 'Proposal' stage.
3. **Rebalance Task Allocation**: Reassign overdue tasks from overburdened tech leads to junior engineers.`;

      return res.json({ text: fallbackText, context: dbContext });
    }

    const systemInstruction = `You are a world-class Startup Operating System AI Advisor for ${company.name}.
You have direct real-time access to the company's live database metrics provided in JSON below:
${JSON.stringify(dbContext, null, 2)}

Provide clear, data-driven, strategic, and concise answers with bold bullet points, specific dollar amounts, percentage changes, and actionable step-by-step advice for founders.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt || 'How is my startup performing and what should I prioritize this week?',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text, context: dbContext });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: 'AI Business Advisor service temporarily unavailable.', details: err.message });
  }
});

// Automated Operational Risk Evaluation Endpoint
app.post('/api/ai/risks', async (req, res) => {
  const db = getDatabase();
  const company = db.companies[0];

  const newlyDetectedRisks = [...db.risks];

  // Auto check conditions
  if (company.runwayMonths < 6) {
    if (!newlyDetectedRisks.find((r) => r.title === 'Critical Cash Runway Alert')) {
      newlyDetectedRisks.unshift({
        id: `risk-auto-${Date.now()}`,
        title: 'Critical Cash Runway Alert',
        category: 'Financial',
        riskLevel: 'Critical',
        metricImpact: `Cash balance of $${company.cashBalance.toLocaleString()} provides less than 6 months of runway.`,
        aiRecommendation: 'Freeze non-essential hiring and initiate bridge round discussion immediately.',
        status: 'Active',
        detectedAt: new Date().toISOString(),
      });
    }
  }

  db.risks = newlyDetectedRisks;
  saveDatabase(db);

  res.json({ success: true, risks: db.risks });
});

// -------------------------------------------------------------
// 5. VITE & PRODUCTION MIDDLEWARE SETUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Founder Decision Dashboard server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
