-- Create email_connections table
CREATE TABLE IF NOT EXISTS email_connections (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL CHECK (provider IN ('google', 'azure', 'imap')),
  access_token text NOT NULL,
  refresh_token text,
  connected_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_scan_at timestamp with time zone,
  is_active boolean DEFAULT true NOT NULL,
  imap_settings jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE email_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email connections"
  ON email_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email connections"
  ON email_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email connections"
  ON email_connections FOR UPDATE
  USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX email_connections_user_id_idx ON email_connections (user_id);
CREATE INDEX email_connections_provider_idx ON email_connections (provider);

-- Add onboarding_completed column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
