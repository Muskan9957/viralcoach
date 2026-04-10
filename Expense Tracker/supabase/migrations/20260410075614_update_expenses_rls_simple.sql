
/*
  # Simplify expenses RLS policies

  Drop the session-variable based policies and replace with
  open anon access (email filtering handled at query level).
  This is appropriate for a simple demo tracker without full auth.
*/

DROP POLICY IF EXISTS "Users can read own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;

CREATE POLICY "Allow anon select"
  ON expenses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert"
  ON expenses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon delete"
  ON expenses FOR DELETE
  TO anon
  USING (true);
