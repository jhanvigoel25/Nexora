import fs from 'fs';
import path from 'path';
import { DatabaseState, Company, ScenarioInput, ScenarioResult } from '../src/types';
import { generateInitialSeedData } from './seed';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let dbState: DatabaseState | null = null;

export function getDatabase(): DatabaseState {
  if (dbState) return dbState;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf-8');
      dbState = JSON.parse(fileData);
      if (dbState?.companies?.[0]) {
        dbState.companies[0].name = 'FounderOS';
        dbState.companies[0].tagline = 'The Decision Engine & Operating System for Founders';
      }
      console.log('Loaded database from .data/db.json');
    } else {
      console.log('No existing database found. Generating auto-seeded startup dataset...');
      dbState = generateInitialSeedData();
      saveDatabase(dbState);
    }
  } catch (err) {
    console.error('Error loading database, resetting to seed data:', err);
    dbState = generateInitialSeedData();
    saveDatabase(dbState);
  }

  recalculateCompanyKPIs(dbState!);
  return dbState!;
}

export function saveDatabase(data: DatabaseState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    recalculateCompanyKPIs(data);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    dbState = data;
  } catch (err) {
    console.error('Failed to save database:', err);
  }
}

export function resetDatabaseToSeed(): DatabaseState {
  dbState = generateInitialSeedData();
  saveDatabase(dbState);
  return dbState;
}

export function recalculateCompanyKPIs(db: DatabaseState): Company {
  if (!db.companies || db.companies.length === 0) return {} as Company;
  const company = db.companies[0];

  // Calculate current month revenue
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Total current month revenue
  const recentRev = db.revenue
    .filter((r) => r.date.startsWith(currentMonthStr))
    .reduce((sum, r) => sum + r.amount, 0);

  // Fallback to recent 30 days if current month empty
  const last30DaysRev = db.revenue.slice(-8).reduce((sum, r) => sum + r.amount, 0) / 2;
  const mrr = recentRev > 0 ? recentRev : last30DaysRev;

  // Total current month expenses
  const recentExp = db.expenses
    .filter((e) => e.date.startsWith(currentMonthStr))
    .reduce((sum, e) => sum + e.amount, 0);
  const last30DaysExp = db.expenses.slice(-8).reduce((sum, e) => sum + e.amount, 0) / 2;
  const monthlyExpenses = recentExp > 0 ? recentExp : last30DaysExp;

  const netBurn = monthlyExpenses > mrr ? monthlyExpenses - mrr : 0;
  const runwayMonths = netBurn > 0 ? Number((company.cashBalance / netBurn).toFixed(1)) : 24.0;

  // Active customers & churn
  const activeCust = db.customers.filter((c) => c.leadStatus === 'Closed Won' && !c.isChurned).length;
  const churnedCust = db.customers.filter((c) => c.isChurned).length;
  const totalCust = db.customers.length;
  const churnRate = totalCust > 0 ? Number(((churnedCust / totalCust) * 100).toFixed(1)) : 1.9;

  // Task completion rate
  const completedTasks = db.tasks.filter((t) => t.status === 'Done').length;
  const totalTasks = db.tasks.length;
  const taskCompletionRate = totalTasks > 0 ? completedTasks / totalTasks : 0.8;

  // Health score calculation (0 - 100)
  // Factors: Runway (30%), Churn (20%), MRR Positive (20%), Task Completion (15%), Team Productivity (15%)
  let runwayScore = Math.min(100, (runwayMonths / 18) * 100);
  let churnScore = Math.max(0, 100 - churnRate * 15);
  let revenueScore = mrr >= monthlyExpenses ? 100 : Math.max(20, (mrr / monthlyExpenses) * 100);
  let taskScore = taskCompletionRate * 100;
  let teamScore = db.employees.reduce((s, e) => s + e.productivityScore, 0) / (db.employees.length || 1);

  const healthScore = Math.round(
    runwayScore * 0.3 + churnScore * 0.2 + revenueScore * 0.2 + taskScore * 0.15 + teamScore * 0.15
  );

  company.monthlyRevenue = Math.round(mrr);
  company.monthlyExpenses = Math.round(monthlyExpenses);
  company.burnRate = Math.round(netBurn);
  company.runwayMonths = Math.min(36, runwayMonths);
  company.activeCustomersCount = activeCust;
  company.customerChurnRate = churnRate;
  company.healthScore = healthScore;
  company.teamCount = db.employees.length;

  return company;
}

// Scenario Simulation Calculation Engine
export function runScenarioSimulation(input: ScenarioInput, db: DatabaseState): ScenarioResult {
  const company = db.companies[0];
  const currentRevenue = company.monthlyRevenue;
  const currentExpenses = company.monthlyExpenses;
  const currentRunway = company.runwayMonths;

  // Employee cost change
  const addedSalaryMonthly = (input.hireEmployeesCount * input.avgHireSalary) / 12;

  // Marketing spend change
  const addedMarketingMonthly = input.marketingSpendIncrease;

  const projectedExpenses = Math.round(currentExpenses + addedSalaryMonthly + addedMarketingMonthly);

  // Revenue change from price change + churn change
  const priceMultiplier = 1 + input.priceChangePct / 100;
  const churnMultiplier = 1 - input.churnChangePct / 100;

  // Marketing impact estimate: $10,000 marketing yields ~ $3,500 new monthly revenue
  const marketingRevenueBoost = input.marketingSpendIncrease * 0.35;

  const projectedRevenue = Math.round(
    currentRevenue * priceMultiplier * churnMultiplier + marketingRevenueBoost
  );

  const currentNetCashFlow = currentRevenue - currentExpenses;
  const projectedNetCashFlow = projectedRevenue - projectedExpenses;

  const projectedNetBurn = projectedNetCashFlow < 0 ? Math.abs(projectedNetCashFlow) : 0;
  const projectedRunway =
    projectedNetBurn > 0 ? Number((company.cashBalance / projectedNetBurn).toFixed(1)) : 36;

  const growthDeltaPct = Number((((projectedRevenue - currentRevenue) / (currentRevenue || 1)) * 100).toFixed(1));

  let summary = `Scenario "${input.name}": `;
  if (projectedNetCashFlow > currentNetCashFlow) {
    summary += `Improves net cash flow by $${(projectedNetCashFlow - currentNetCashFlow).toLocaleString()}/mo. Revenue increases by ${growthDeltaPct}%.`;
  } else {
    summary += `Increases monthly burn by $${Math.abs(projectedNetCashFlow - currentNetCashFlow).toLocaleString()}/mo. Runway changes from ${currentRunway} months to ${projectedRunway} months.`;
  }

  return {
    scenarioName: input.name,
    currentRunway,
    projectedRunway,
    currentMonthlyRevenue: currentRevenue,
    projectedMonthlyRevenue: projectedRevenue,
    currentMonthlyExpenses: currentExpenses,
    projectedMonthlyExpenses: projectedExpenses,
    currentNetCashFlow,
    projectedNetCashFlow,
    growthDeltaPct,
    aiSummary: summary,
  };
}
