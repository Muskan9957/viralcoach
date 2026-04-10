import { useState } from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';
import { categorize } from '../utils/categorize';
import { CATEGORIES } from '../types/expense';
import type { Category } from '../types/expense';

interface ExpenseFormProps {
  onSubmit: (amount: number, description: string, category: string) => Promise<void>;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; description?: string }>({});

  function handleCategorize() {
    if (description.trim()) {
      setCategory(categorize(description));
    }
  }

  function validate() {
    const errs: { amount?: string; description?: string } = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      errs.amount = 'Enter a valid amount.';
    }
    if (!description.trim()) {
      errs.description = 'Description is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await onSubmit(Number(amount), description.trim(), category);
    setAmount('');
    setDescription('');
    setCategory('Other');
    setErrors({});
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">New Expense</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Amount ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: undefined })); }}
            placeholder="0.00"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
          />
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: undefined })); }}
          placeholder="What did you spend on?"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleCategorize}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-xl transition-colors"
        >
          <Sparkles size={14} />
          Auto Categorize
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors disabled:opacity-60 ml-auto"
        >
          <PlusCircle size={14} />
          {loading ? 'Adding...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
