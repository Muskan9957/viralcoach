const colorMap: Record<string, { bg: string; text: string }> = {
  'Food & Dining': { bg: 'bg-orange-50', text: 'text-orange-600' },
  'Transport': { bg: 'bg-sky-50', text: 'text-sky-600' },
  'Shopping': { bg: 'bg-pink-50', text: 'text-pink-600' },
  'Entertainment': { bg: 'bg-violet-50', text: 'text-violet-600' },
  'Health': { bg: 'bg-green-50', text: 'text-green-600' },
  'Housing': { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  'Utilities': { bg: 'bg-teal-50', text: 'text-teal-600' },
  'Travel': { bg: 'bg-blue-50', text: 'text-blue-600' },
  'Education': { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  'Other': { bg: 'bg-gray-100', text: 'text-gray-500' },
};

export function categoryColor(category: string): { bg: string; text: string } {
  return colorMap[category] ?? colorMap['Other'];
}
