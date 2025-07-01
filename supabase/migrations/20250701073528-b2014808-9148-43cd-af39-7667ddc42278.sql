
-- Create profiles table for user information (only if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  work_group_id UUID REFERENCES work_groups(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enum for user roles (only if not exists)
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'work_group_leader', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table (only if not exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  work_group_id UUID REFERENCES work_groups(id), -- For work_group_leader role
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role, work_group_id)
);

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role, _work_group_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (work_group_id = _work_group_id OR _work_group_id IS NULL OR work_group_id IS NULL)
  )
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update datasets table to include approval workflow
ALTER TABLE public.datasets 
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS submission_notes TEXT,
ADD COLUMN IF NOT EXISTS approval_notes TEXT;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Anyone can view published datasets" ON public.datasets;
DROP POLICY IF EXISTS "Work group leaders can view their group's datasets" ON public.datasets;
DROP POLICY IF EXISTS "Users can view their own submitted datasets" ON public.datasets;
DROP POLICY IF EXISTS "Work group leaders can create datasets" ON public.datasets;
DROP POLICY IF EXISTS "Work group leaders can update their group's datasets" ON public.datasets;
DROP POLICY IF EXISTS "Admins can approve/reject datasets" ON public.datasets;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- New dataset policies
CREATE POLICY "Anyone can view published datasets"
  ON public.datasets FOR SELECT
  USING (status = 'published' OR status = 'approved');

CREATE POLICY "Work group leaders can view their group's datasets"
  ON public.datasets FOR SELECT
  USING (
    public.has_role(auth.uid(), 'work_group_leader', work_group_id) OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can view their own submitted datasets"
  ON public.datasets FOR SELECT
  USING (auth.uid() = submitted_by);

CREATE POLICY "Work group leaders can create datasets"
  ON public.datasets FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'work_group_leader', work_group_id) OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Work group leaders can update their group's datasets"
  ON public.datasets FOR UPDATE
  USING (
    (public.has_role(auth.uid(), 'work_group_leader', work_group_id) AND status IN ('draft', 'rejected')) OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can approve/reject datasets"
  ON public.datasets FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
