-- Add role and status columns to profiles
ALTER TABLE profiles
ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'sub-admin', 'admin')),
ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'suspended'));
