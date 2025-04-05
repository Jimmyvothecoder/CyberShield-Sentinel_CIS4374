-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('phishing_threat', 'malware_detected', 'network_alert')),
  title text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX notifications_user_id_idx ON notifications (user_id);
CREATE INDEX notifications_type_idx ON notifications (type);
CREATE INDEX notifications_status_idx ON notifications (status);
CREATE INDEX notifications_created_at_idx ON notifications (created_at);

-- Create trigger for notifications
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
