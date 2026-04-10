
/*
  # Create expenses table

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key)
      - `email` (text) - user identifier
      - `amount` (numeric) - expense amount
      - `description` (text) - what the expense was for
      - `category` (text) - auto-categorized label
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `expenses` table
    - Policy: users can read their own expenses by email
    - Policy: users can insert their own expenses
    - Policy: users can delete their own expenses
*/

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Other',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own expenses"
  ON expenses FOR SELECT
  USING (email = current_setting('app.current_user_email', true));

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (email = current_setting('app.current_user_email', true));

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (email = current_setting('app.current_user_email', true));
