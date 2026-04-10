import type { Expense } from '../types/expense';
import { categoryColor } from '../utils/categoryColor';

interface SummarySectionProps {
  expenses: Expense[];
}

export function SummarySection({ expenses }: SummarySectionProps) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount);
    return acc;
  }, {});

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Summary</h2>

      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</span>
        <span className="text-sm text-gray-400">total</span>
      </div>

      {sorted.length > 0 ? (
        <div className="space-y-2.5">
          {sorted.map(([cat, amt]) => {
            const pct = total > 0 ? (amt / total) * 100 : 0;
            const { bg, text } = categoryColor(cat);
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bg} ${text}`}>{cat}</span>
                  <span className="text-xs font-semibold text-gray-700">${amt.toFixed(2)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No data yet.</p>
      )}
    </div>
  );
}
