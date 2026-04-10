import { useState, useEffect, useCallback } from 'react';
import { LogOut, DollarSign } from 'lucide-react';
import { supabase } from './lib/supabase';
import { LoginScreen } from './components/LoginScreen';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SummarySection } from './components/SummarySection';
import type { Expense } from './types/expense';

const SESSION_KEY = 'expense_tracker_email';

function App() {
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  const fetchExpenses = useCallback(async (userEmail: string) => {
    setLoadingExpenses(true);
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('email', userEmail)
      .order('created_at', { ascending: false });
    setExpenses((data as Expense[]) ?? []);
    setLoadingExpenses(false);
  }, []);

  useEffect(() => {
    if (email) fetchExpenses(email);
  }, [email, fetchExpenses]);

  function handleLogin(userEmail: string) {
    localStorage.setItem(SESSION_KEY, userEmail);
    setEmail(userEmail);
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setEmail(null);
    setExpenses([]);
  }

  async function handleAddExpense(amount: number, description: string, category: string) {
    if (!email) return;
    const { data } = await supabase
      .from('expenses')
      .insert({ email, amount, description, category })
      .select()
      .single();
    if (data) {
      setExpenses((prev) => [data as Expense, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from('expenses').delete().eq('id', id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  if (!email) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-xl p-1.5">
              <DollarSign size={16} />
            </div>
            <span className="font-semibold text-gray-900 text-sm">Expense Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">{email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <ExpenseForm onSubmit={handleAddExpense} />
        <SummarySection expenses={expenses} />
        {loadingExpenses ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-sm text-gray-400">Loading expenses...</p>
          </div>
        ) : (
          <ExpenseList expenses={expenses} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}

export default App;
