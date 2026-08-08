export type UserRole =
  | 'Founder'
  | 'Co-Founder'
  | 'Finance Manager'
  | 'Operations Manager'
  | 'HR'
  | 'Investor (Read Only)'
  | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  valuation: number;
  cashBalance: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  burnRate: number;
  runwayMonths: number;
  healthScore: number;
  activeCustomersCount: number;
  mrrGrowthRate: number;
  customerChurnRate: number;
  teamCount: number;
  currency: string;
}

export interface RevenueRecord {
  id: string;
  amount: number;
  category: 'Subscriptions' | 'Enterprise Deals' | 'Consulting' | 'Ad Tech' | 'Other';
  source: string;
  date: string;
  customerName: string;
  isRecurring: boolean;
  notes?: string;
}

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: 'Cloud & Infrastructure' | 'Payroll' | 'Marketing & Growth' | 'Software Subscriptions' | 'Office & Admin' | 'Legal & Tax' | 'Other';
  vendor: string;
  date: string;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Scheduled';
  notes?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  salaryMonthly: number;
  taxDeduction: number;
  netPay: number;
  paymentDate: string;
  status: 'Processed' | 'Pending';
}

export interface FundingRound {
  id: string;
  roundName: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Grant' | 'Debt';
  amount: number;
  investorName: string;
  date: string;
  postMoneyValuation: number;
  status: 'Closed' | 'In Discussion' | 'Term Sheet';
  leadInvestor: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  leadSource: 'Organic Search' | 'Outbound Sales' | 'Referral' | 'Social Media' | 'Event' | 'Paid Ads';
  dealValue: number;
  leadStatus: 'Lead' | 'Contacted' | 'Demo / Proposal' | 'Closed Won' | 'Closed Lost';
  lifetimeValue: number;
  isChurned: boolean;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: 'Engineering' | 'Product' | 'Sales' | 'Marketing' | 'Operations' | 'Finance' | 'HR';
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  productivityScore: number; // 0 - 100
  tasksCompleted: number;
  tasksPending: number;
  avatar: string;
  joinDate: string;
}

export interface KeyResult {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
}

export interface OKRGoal {
  id: string;
  title: string;
  objective: string;
  department: string;
  owner: string;
  quarter: string;
  keyResults: KeyResult[];
  progress: number; // 0-100
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed';
  targetDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  dueDate: string;
  progress: number;
  commentsCount: number;
  isOverdue?: boolean;
}

export interface OperationalRisk {
  id: string;
  title: string;
  category: 'Financial' | 'Customer Churn' | 'Team & Hiring' | 'Operational' | 'Investor Rel';
  riskLevel: 'Critical' | 'Medium' | 'Low';
  metricImpact: string;
  aiRecommendation: string;
  status: 'Active' | 'Mitigated' | 'Dismissed';
  detectedAt: string;
}

export interface InvestorMetric {
  mrr: number;
  arr: number;
  cac: number;
  ltv: number;
  growthRatePct: number;
  burnRate: number;
  runwayMonths: number;
  ebitda: number;
  mau: number;
  npsScore: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'finance' | 'task' | 'risk' | 'investor';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ScenarioInput {
  name: string;
  hireEmployeesCount: number;
  avgHireSalary: number;
  marketingSpendIncrease: number;
  priceChangePct: number;
  churnChangePct: number;
}

export interface ScenarioResult {
  scenarioName: string;
  currentRunway: number;
  projectedRunway: number;
  currentMonthlyRevenue: number;
  projectedMonthlyRevenue: number;
  currentMonthlyExpenses: number;
  projectedMonthlyExpenses: number;
  currentNetCashFlow: number;
  projectedNetCashFlow: number;
  growthDeltaPct: number;
  aiSummary: string;
}

export interface AIAdvisorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedMetrics?: Record<string, any>;
  suggestions?: string[];
}

export interface DatabaseState {
  users: User[];
  companies: Company[];
  revenue: RevenueRecord[];
  expenses: ExpenseRecord[];
  payroll: PayrollRecord[];
  funding: FundingRound[];
  customers: Customer[];
  employees: Employee[];
  goals: OKRGoal[];
  tasks: Task[];
  risks: OperationalRisk[];
  notifications: NotificationItem[];
  settings: {
    darkMode: boolean;
    currency: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
    geminiApiKeyActive: boolean;
    autoEmailAlerts: boolean;
  };
}
