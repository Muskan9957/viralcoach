import type { Category } from '../types/expense';

const rules: { keywords: string[]; category: Category }[] = [
  {
    keywords: ['food', 'lunch', 'dinner', 'breakfast', 'coffee', 'cafe', 'restaurant', 'pizza', 'burger', 'grocery', 'groceries', 'snack', 'meal', 'eat', 'drink', 'beer', 'wine'],
    category: 'Food & Dining',
  },
  {
    keywords: ['uber', 'lyft', 'taxi', 'bus', 'metro', 'train', 'gas', 'fuel', 'parking', 'subway', 'transit', 'commute', 'car', 'toll', 'flight'],
    category: 'Transport',
  },
  {
    keywords: ['amazon', 'shop', 'shopping', 'clothes', 'clothing', 'shoes', 'store', 'mall', 'buy', 'purchase', 'online'],
    category: 'Shopping',
  },
  {
    keywords: ['movie', 'cinema', 'netflix', 'spotify', 'game', 'gaming', 'concert', 'show', 'theater', 'theatre', 'entertainment', 'hulu', 'disney'],
    category: 'Entertainment',
  },
  {
    keywords: ['doctor', 'hospital', 'pharmacy', 'medicine', 'health', 'gym', 'fitness', 'dental', 'medical', 'clinic', 'prescription'],
    category: 'Health',
  },
  {
    keywords: ['rent', 'mortgage', 'housing', 'apartment', 'home', 'house', 'repair', 'maintenance', 'furniture'],
    category: 'Housing',
  },
  {
    keywords: ['electric', 'electricity', 'water', 'internet', 'phone', 'utility', 'utilities', 'bill', 'subscription'],
    category: 'Utilities',
  },
  {
    keywords: ['hotel', 'airbnb', 'travel', 'trip', 'vacation', 'holiday', 'booking', 'flight', 'airline'],
    category: 'Travel',
  },
  {
    keywords: ['book', 'course', 'class', 'school', 'tuition', 'education', 'learn', 'training', 'university'],
    category: 'Education',
  },
];

export function categorize(description: string): Category {
  const lower = description.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.category;
    }
  }
  return 'Other';
}
