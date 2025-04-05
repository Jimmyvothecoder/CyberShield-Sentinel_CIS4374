-- Create email_scans table
CREATE TABLE IF NOT EXISTS email_scans (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connection_id uuid REFERENCES email_connections(id) ON DELETE CASCADE NOT NULL,
  message_id text NOT NULL,
  subject text,
  sender text NOT NULL,
  received_at timestamp with time zone NOT NULL,
  scan_status text NOT NULL CHECK (scan_status IN ('pending', 'scanning', 'completed', 'failed')),
  is_phishing boolean,
  threat_score numeric CHECK (threat_score >= 0 AND threat_score <= 1),
  threat_indicators jsonb,
  scan_completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE email_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email scans"
  ON email_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email scans"
  ON email_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email scans"
  ON email_scans FOR UPDATE
  USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX email_scans_user_id_idx ON email_scans (user_id);
CREATE INDEX email_scans_connection_id_idx ON email_scans (connection_id);
CREATE INDEX email_scans_message_id_idx ON email_scans (message_id);
CREATE INDEX email_scans_received_at_idx ON email_scans (received_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for email_scans
CREATE TRIGGER update_email_scans_updated_at
  BEFORE UPDATE ON email_scans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for email_connections
CREATE TRIGGER update_email_connections_updated_at
  BEFORE UPDATE ON email_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
