export interface Expense {
  id: string;
  email: string;
  amount: number;
  description: string;
  category: string;
  created_at: string;
}

export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Housing',
  'Utilities',
  'Travel',
  'Education',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
