import { Trash2 } from 'lucide-react';
import type { Expense } from '../types/expense';
import { categoryColor } from '../utils/categoryColor';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-gray-400 text-sm">No expenses yet. Add one above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-5 py-4 border-b border-gray-50">
        Expenses
      </h2>
      <ul className="divide-y divide-gray-50">
        {expenses.map((expense) => {
          const { bg, text } = categoryColor(expense.category);
          return (
            <li key={expense.id} className="flex items-center gap-3 px-5 py-3.5 group hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{expense.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bg} ${text}`}>
                    {expense.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(expense.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 shrink-0">
                ${Number(expense.amount).toFixed(2)}
              </span>
              <button
                onClick={() => onDelete(expense.id)}
                className="text-gray-300 hover:text-red-400 active:text-red-600 transition-colors opacity-0 group-hover:opacity-100 ml-1"
                aria-label="Delete expense"
              >
                <Trash2 size={15} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
