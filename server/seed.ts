import { DatabaseState, User, Company, RevenueRecord, ExpenseRecord, Customer, Employee, Task, OKRGoal, OperationalRisk, NotificationItem, FundingRound, PayrollRecord } from '../src/types';

export function generateInitialSeedData(): DatabaseState {
  const companyId = 'comp-101';
  
  // 1. Users
  const users: User[] = [
    {
      id: 'usr-1',
      email: 'alex@founder.ai',
      name: 'Alex Morgan',
      role: 'Founder',
      companyId,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-2',
      email: 'david@founder.ai',
      name: 'David Chen',
      role: 'Co-Founder',
      companyId,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-3',
      email: 'sarah@founder.ai',
      name: 'Sarah Jenkins',
      role: 'Finance Manager',
      companyId,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-4',
      email: 'marcus@founder.ai',
      name: 'Marcus Vance',
      role: 'Operations Manager',
      companyId,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-5',
      email: 'elena@founder.ai',
      name: 'Elena Rostova',
      role: 'HR',
      companyId,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-6',
      email: 'investor@sequoia.vc',
      name: 'Rachel Sterling',
      role: 'Investor (Read Only)',
      companyId,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
  ];

  // 2. Company Profile
  const company: Company = {
    id: companyId,
    name: 'Nexora',
    tagline: 'Nexora — Know What’s Next',
    valuation: 18500000,
    cashBalance: 1620000,
    monthlyRevenue: 142500,
    monthlyExpenses: 89000,
    burnRate: 89000 - 142500 > 0 ? 89000 - 142500 : 0, // Cash flow positive, net burn is 0, net profit $53.5k
    runwayMonths: 18.2,
    healthScore: 88,
    activeCustomersCount: 512,
    mrrGrowthRate: 14.8,
    customerChurnRate: 1.9,
    teamCount: 50,
    currency: '$',
  };

  // 3. 24 Months Revenue & Expenses
  const revenue: RevenueRecord[] = [];
  const expenses: ExpenseRecord[] = [];
  const now = new Date();

  // Categories
  const revCats: ('Subscriptions' | 'Enterprise Deals' | 'Consulting' | 'Ad Tech')[] = [
    'Subscriptions',
    'Enterprise Deals',
    'Consulting',
    'Ad Tech',
  ];
  const expCats: ('Cloud & Infrastructure' | 'Payroll' | 'Marketing & Growth' | 'Software Subscriptions' | 'Office & Admin' | 'Legal & Tax')[] = [
    'Cloud & Infrastructure',
    'Payroll',
    'Marketing & Growth',
    'Software Subscriptions',
    'Office & Admin',
    'Legal & Tax',
  ];

  // Vendors
  const vendors = ['AWS Cloud', 'Google Cloud', 'OpenAI API', 'Stripe Billing', 'Hubspot Enterprise', 'WeWork HQ', 'Cooley LLP', 'LinkedIn Ads', 'Meta Growth', 'Slack & Notion'];
  const customerList = ['Acme Corp', 'Stripe Inc', 'Vercel Inc', 'Linear Tech', 'Figma Design', 'Datadog HQ', 'Snowflake', 'Notion Labs', 'Retool Inc', 'Supabase Systems'];

  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 15);
    const dateStr = d.toISOString().split('T')[0];
    
    // Growth factor over 24 months
    const monthIndex = 23 - i; // 0 to 23
    const baseRev = 25000 + monthIndex * 5200 + Math.floor(Math.random() * 3000);
    const baseExp = 35000 + monthIndex * 2400 + Math.floor(Math.random() * 2000);

    // 3-4 revenue records per month
    revCats.forEach((cat, idx) => {
      const share = idx === 0 ? 0.6 : idx === 1 ? 0.25 : 0.1;
      revenue.push({
        id: `rev-${monthIndex}-${idx}`,
        amount: Math.round(baseRev * share),
        category: cat,
        source: cat === 'Subscriptions' ? 'Stripe Monthly' : cat === 'Enterprise Deals' ? 'Annual Contract' : 'Services',
        date: dateStr,
        customerName: customerList[(monthIndex + idx) % customerList.length],
        isRecurring: cat === 'Subscriptions' || cat === 'Enterprise Deals',
        notes: `Automated invoice billing #${1000 + monthIndex * 4 + idx}`,
      });
    });

    // 4 expense records per month
    expCats.forEach((cat, idx) => {
      const share = idx === 1 ? 0.5 : idx === 0 ? 0.18 : 0.08;
      expenses.push({
        id: `exp-${monthIndex}-${idx}`,
        amount: Math.round(baseExp * share),
        category: cat,
        vendor: vendors[(monthIndex + idx) % vendors.length],
        date: dateStr,
        paymentMethod: idx % 2 === 0 ? 'Corporate Amex' : 'ACH Wire',
        status: 'Paid',
        notes: `Monthly operational vendor expense for ${cat}`,
      });
    });
  }

  // 4. Employees (50 total)
  const departments: ('Engineering' | 'Product' | 'Sales' | 'Marketing' | 'Operations' | 'Finance' | 'HR')[] = [
    'Engineering',
    'Product',
    'Sales',
    'Marketing',
    'Operations',
    'Finance',
    'HR',
  ];
  const employeeNames = [
    'Liam Wright', 'Emma Watson', 'Noah Miller', 'Olivia Davis', 'William Garcia',
    'Sophia Martinez', 'James Rodriguez', 'Ava Hernandez', 'Benjamin Lopez', 'Isabella Gonzalez',
    'Lucas Wilson', 'Mia Anderson', 'Henry Thomas', 'Evelyn Taylor', 'Alexander Moore',
    'Harper Jackson', 'Sebastian Martin', 'Camila Lee', 'Jack Perez', 'Gianna Thompson',
    'Owen White', 'Abigail Harris', 'Ethan Sanchez', 'Ella Clark', 'Jacob Ramirez',
    'Elizabeth Lewis', 'Levi Robinson', 'Sofia Walker', 'Michael Young', 'Avery Allen',
    'Daniel King', 'Scarlett Wright', 'Logan Scott', 'Victoria Torres', 'Jackson Nguyen',
    'Madison Hill', 'Sebastian Flores', 'Luna Green', 'Jack Adams', 'Grace Nelson',
    'Wyatt Baker', 'Chloe Hall', 'Jayden Rivera', 'Penelope Campbell', 'Julian Mitchell',
    'Layla Carter', 'Mateo Roberts', 'Riley Gomez', 'David Phillips', 'Zoey Evans'
  ];

  const employees: Employee[] = employeeNames.map((name, index) => {
    const dept = departments[index % departments.length];
    const baseSal = dept === 'Engineering' ? 120000 : dept === 'Sales' ? 95000 : 85000;
    return {
      id: `emp-${index + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@apexos.ai`,
      role: index === 0 ? 'VP Engineering' : index === 1 ? 'Head of Product' : `${dept} Specialist`,
      department: dept,
      salary: baseSal + (index % 5) * 6000,
      status: index === 48 ? 'On Leave' : 'Active',
      productivityScore: Math.floor(75 + Math.random() * 23),
      tasksCompleted: 15 + (index % 12) * 5,
      tasksPending: 3 + (index % 4),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (index * 137000) % 100000000}?w=150&auto=format&fit=crop&q=80`,
      joinDate: '2025-01-15',
    };
  });

  // 5. Tasks (1000 completed, 300 pending)
  const tasks: Task[] = [];
  const taskTitlesPending = [
    'Upgrade Supabase PostgreSQL indexing for speed',
    'Implement AI Advisor streaming response route',
    'Prepare Q3 Investor Metrics Deck PDF',
    'Conduct annual security SOC2 audit check',
    'Deploy new customer onboarding flow',
    'Optimize cloud costs on AWS ECS cluster',
    'Finalize Series B pitch deck financial projections',
    'Fix customer CRM table sorting by LTV',
    'Add Razorpay & Stripe integration webhooks',
    'Review HR payroll tax compliance quarterly',
  ];

  // 300 Pending / In Progress Tasks
  for (let i = 0; i < 300; i++) {
    const emp = employees[i % employees.length];
    const prio: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
    const statusArr: ('To Do' | 'In Progress' | 'In Review' | 'Done')[] = ['To Do', 'In Progress', 'In Review'];
    const titleBase = taskTitlesPending[i % taskTitlesPending.length];
    
    tasks.push({
      id: `task-p-${i + 1}`,
      title: `${titleBase} #${i + 101}`,
      description: `Action item assigned to ${emp.name} in ${emp.department} team. Requires validation and code review.`,
      assigneeId: emp.id,
      assigneeName: emp.name,
      department: emp.department,
      priority: prio[i % prio.length],
      status: statusArr[i % statusArr.length],
      dueDate: new Date(Date.now() + (i % 15 - 3) * 86400000).toISOString().split('T')[0],
      progress: (i * 7) % 90,
      commentsCount: i % 6,
      isOverdue: (i % 15 - 3) < 0,
    });
  }

  // 1000 Completed Tasks
  for (let i = 0; i < 1000; i++) {
    const emp = employees[i % employees.length];
    tasks.push({
      id: `task-c-${i + 1}`,
      title: `Completed Milestone Goal #${i + 1}`,
      description: `Successfully delivered goal by ${emp.name}`,
      assigneeId: emp.id,
      assigneeName: emp.name,
      department: emp.department,
      priority: 'Medium',
      status: 'Done',
      dueDate: '2026-06-30',
      progress: 100,
      commentsCount: 2,
    });
  }

  // 6. 500 Customers
  const customers: Customer[] = [];
  const industries = ['Fintech', 'AI / ML', 'Healthcare', 'E-Commerce', 'SaaS', 'EdTech', 'Cybersecurity', 'Logistics'];
  const leadSources: ('Organic Search' | 'Outbound Sales' | 'Referral' | 'Social Media' | 'Event' | 'Paid Ads')[] = [
    'Organic Search',
    'Outbound Sales',
    'Referral',
    'Social Media',
    'Event',
    'Paid Ads',
  ];
  const statuses: ('Lead' | 'Contacted' | 'Demo / Proposal' | 'Closed Won' | 'Closed Lost')[] = [
    'Lead',
    'Contacted',
    'Demo / Proposal',
    'Closed Won',
    'Closed Lost',
  ];

  for (let i = 0; i < 500; i++) {
    const isWon = i < 420; // 420 closed won active/historical
    const isChurned = i > 480; // ~20 churned
    customers.push({
      id: `cust-${i + 1}`,
      name: `Executive ${i + 1}`,
      email: `contact${i + 1}@clientcorp${i + 1}.com`,
      phone: `+1 (555) ${100 + (i % 899)}-${1000 + (i % 8999)}`,
      company: `Enterprise ${i + 1} Corp`,
      industry: industries[i % industries.length],
      leadSource: leadSources[i % leadSources.length],
      dealValue: Math.round(1200 + (i * 350) % 45000),
      leadStatus: isWon ? 'Closed Won' : statuses[i % statuses.length],
      lifetimeValue: Math.round(3500 + (i * 850) % 95000),
      isChurned,
      createdAt: new Date(Date.now() - (i * 86400000 * 1.5)).toISOString().split('T')[0],
    });
  }

  // 7. OKRs and Goals
  const goals: OKRGoal[] = [
    {
      id: 'okr-1',
      title: 'Accelerate ARR to $2.5M by Q4',
      objective: 'Scale outbound enterprise sales pipeline and increase tier 1 conversions',
      department: 'Sales',
      owner: 'Alex Morgan',
      quarter: 'Q3 2026',
      progress: 78,
      status: 'On Track',
      targetDate: '2026-09-30',
      keyResults: [
        { id: 'kr-1', title: 'Close 15 Enterprise accounts ($50k+ ACV)', current: 12, target: 15, unit: 'deals' },
        { id: 'kr-2', title: 'Maintain Net Revenue Retention (NRR) above 120%', current: 124, target: 120, unit: '%' },
        { id: 'kr-3', title: 'Reduce Sales Cycle duration to <28 days', current: 31, target: 28, unit: 'days' },
      ],
    },
    {
      id: 'okr-2',
      title: 'Deploy AI Autonomous Decision Advisor v2.0',
      objective: 'Integrate deep database analytics and real-time scenario simulation engine',
      department: 'Engineering',
      owner: 'Liam Wright',
      quarter: 'Q3 2026',
      progress: 85,
      status: 'On Track',
      targetDate: '2026-08-31',
      keyResults: [
        { id: 'kr-4', title: 'Reduce query latency below 200ms for 10k records', current: 180, target: 200, unit: 'ms' },
        { id: 'kr-5', title: 'Achieve 99.9% prediction accuracy on cash burn forecast', current: 98, target: 99.9, unit: '%' },
      ],
    },
    {
      id: 'okr-3',
      title: 'Lower Customer Churn Rate to <1.5%',
      objective: 'Proactively identify at-risk customers and expand customer success onboarding',
      department: 'Product',
      owner: 'Emma Watson',
      quarter: 'Q3 2026',
      progress: 62,
      status: 'At Risk',
      targetDate: '2026-09-30',
      keyResults: [
        { id: 'kr-6', title: 'Conduct quarterly executive reviews with top 50 accounts', current: 31, target: 50, unit: 'reviews' },
        { id: 'kr-7', title: 'Improve product NPS score from 68 to 78', current: 72, target: 78, unit: 'NPS' },
      ],
    },
  ];

  // 8. Operational Risks
  const risks: OperationalRisk[] = [
    {
      id: 'risk-1',
      title: 'Infrastructure Overhead Growth',
      category: 'Financial',
      riskLevel: 'Medium',
      metricImpact: 'Cloud expenses increased 14% month-over-month.',
      aiRecommendation: 'Reserve AWS compute instances for 1-year term to reduce cloud cost by ~28%.',
      status: 'Active',
      detectedAt: new Date().toISOString(),
    },
    {
      id: 'risk-2',
      title: 'Engineering Overdue Task Backlog',
      category: 'Operational',
      riskLevel: 'Critical',
      metricImpact: '18 high-priority engineering tasks overdue past target deadline.',
      aiRecommendation: 'Reallocate 2 product designers to tech-debt sprint and extend release deadline by 4 days.',
      status: 'Active',
      detectedAt: new Date().toISOString(),
    },
    {
      id: 'risk-3',
      title: 'Mid-Market Customer Churn Flare-up',
      category: 'Customer Churn',
      riskLevel: 'Medium',
      metricImpact: '3 accounts in Fintech tier requested contract cancellation review.',
      aiRecommendation: 'Schedule immediate executive sponsor check-in and offer 15% annual renewal discount.',
      status: 'Active',
      detectedAt: new Date().toISOString(),
    },
  ];

  // 9. Funding Rounds
  const funding: FundingRound[] = [
    {
      id: 'fund-1',
      roundName: 'Pre-Seed',
      amount: 500000,
      investorName: 'Y Combinator & Angel Syndicate',
      date: '2024-03-15',
      postMoneyValuation: 4000000,
      status: 'Closed',
      leadInvestor: 'Y Combinator',
    },
    {
      id: 'fund-2',
      roundName: 'Seed',
      amount: 2500000,
      investorName: 'Sequoia Capital & Founders Fund',
      date: '2025-06-10',
      postMoneyValuation: 14000000,
      status: 'Closed',
      leadInvestor: 'Sequoia Capital',
    },
    {
      id: 'fund-3',
      roundName: 'Series A',
      amount: 10000000,
      investorName: 'Benchmark & Accel',
      date: '2026-11-01',
      postMoneyValuation: 45000000,
      status: 'In Discussion',
      leadInvestor: 'Benchmark Capital',
    },
  ];

  // 10. Payroll Records
  const payroll: PayrollRecord[] = employees.slice(0, 15).map((emp, i) => ({
    id: `pay-${i + 1}`,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    salaryMonthly: Math.round(emp.salary / 12),
    taxDeduction: Math.round((emp.salary / 12) * 0.22),
    netPay: Math.round((emp.salary / 12) * 0.78),
    paymentDate: '2026-08-01',
    status: 'Processed',
  }));

  // 11. Notifications
  const notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'Series A Term Sheet Update',
      message: 'Benchmark Capital requested updated Q2 EBITDA and NRR reports.',
      type: 'investor',
      read: false,
      createdAt: '10 mins ago',
    },
    {
      id: 'notif-2',
      title: 'Operational Risk Alert',
      message: '18 high priority tasks in Engineering are overdue.',
      type: 'risk',
      read: false,
      createdAt: '1 hour ago',
    },
    {
      id: 'notif-3',
      title: 'Monthly Stripe Revenue Milestone',
      message: 'Monthly Recurring Revenue passed $142,500 milestone!',
      type: 'finance',
      read: true,
      createdAt: 'Yesterday',
    },
  ];

  return {
    users,
    companies: [company],
    revenue,
    expenses,
    payroll,
    funding,
    customers,
    employees,
    goals,
    tasks,
    risks,
    notifications,
    settings: {
      darkMode: false,
      currency: '$',
      supabaseUrl: '',
      supabaseAnonKey: '',
      geminiApiKeyActive: true,
      autoEmailAlerts: true,
    },
  };
}
