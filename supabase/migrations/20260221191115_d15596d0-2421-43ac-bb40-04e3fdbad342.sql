
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can read own assignments" ON public.course_assignments;
DROP POLICY IF EXISTS "Admins can manage assignments" ON public.course_assignments;

CREATE POLICY "Users can read own assignments"
ON public.course_assignments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage assignments"
ON public.course_assignments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix newsletter policies
DROP POLICY IF EXISTS "Admins can read newsletter emails" ON public.newsletter_emails;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_emails;

CREATE POLICY "Admins can read newsletter emails"
ON public.newsletter_emails
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_emails
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Fix user_roles policies
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;

CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
