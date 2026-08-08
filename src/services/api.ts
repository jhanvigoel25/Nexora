import { DatabaseState, ScenarioInput, ScenarioResult, User } from '../types';

export async function fetchDatabaseState(): Promise<DatabaseState> {
  const res = await fetch('/api/db/state');
  if (!res.ok) throw new Error('Failed to fetch database state');
  return res.json();
}

export async function addDatabaseRecord(table: keyof DatabaseState, record: any): Promise<{ success: boolean; item: any; db: DatabaseState }> {
  const res = await fetch(`/api/db/${table}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error(`Failed to create item in ${table}`);
  return res.json();
}

export async function updateDatabaseRecord(table: keyof DatabaseState, id: string, updates: any): Promise<{ success: boolean; item: any; db: DatabaseState }> {
  const res = await fetch(`/api/db/${table}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`Failed to update item in ${table}`);
  return res.json();
}

export async function deleteDatabaseRecord(table: keyof DatabaseState, id: string): Promise<{ success: boolean; db: DatabaseState }> {
  const res = await fetch(`/api/db/${table}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete item in ${table}`);
  return res.json();
}

export async function resetDatabase(): Promise<{ success: boolean; db: DatabaseState }> {
  const res = await fetch('/api/db/reset', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset database');
  return res.json();
}

export async function updateCompanySettings(companyUpdates: any, settingsUpdates: any): Promise<{ success: boolean; db: DatabaseState }> {
  const res = await fetch('/api/db/company/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company: companyUpdates, settings: settingsUpdates }),
  });
  if (!res.ok) throw new Error('Failed to update company settings');
  return res.json();
}

export async function simulateScenario(input: ScenarioInput): Promise<ScenarioResult> {
  const res = await fetch('/api/scenario/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to simulate scenario');
  const data = await res.json();
  return data.result;
}

export async function askAIAdvisor(prompt: string, history?: any[]): Promise<{ text: string; context: any }> {
  const res = await fetch('/api/ai/advisor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, history }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'AI Advisor failed to respond');
  }
  return res.json();
}

export async function loginUser(email: string, password?: string): Promise<{ user: User; token: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function signupUser(payload: { name: string; email: string; role: string; companyName?: string }): Promise<{ user: User; token: string }> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Signup failed');
  return res.json();
}
