CREATE POLICY "All users can view all productions." ON "public"."productions" AS PERMISSIVE FOR
SELECT
  TO public USING (true);

CREATE POLICY "All users can view all theaters." ON "public"."theaters" AS PERMISSIVE FOR
SELECT
  TO public USING (true);

CREATE POLICY "All users can view all stages." ON "public"."stages" AS PERMISSIVE FOR
SELECT
  TO public USING (true);

CREATE POLICY "All users can view all addresses." ON "public"."addresses" AS PERMISSIVE FOR
SELECT
  TO public USING (true);

CREATE POLICY "All users can view all profiles." ON "public"."profiles" AS PERMISSIVE FOR
SELECT
  TO public USING (true);

ALTER TABLE "public"."theater_managers" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view all theater managers." ON "public"."theater_managers" AS PERMISSIVE FOR
SELECT
  TO public USING (true);
