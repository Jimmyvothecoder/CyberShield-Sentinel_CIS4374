-- Add email provider columns to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN outlook_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN outlook_token JSONB,
ADD COLUMN gmail_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN gmail_token JSONB;

-- Create email_scans table
CREATE TABLE public.email_scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    email_id VARCHAR(255) NOT NULL,
    subject TEXT,
    sender VARCHAR(255),
    received_at TIMESTAMPTZ,
    threat_level VARCHAR(20),
    threat_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider, email_id)
);

-- Add RLS policies for email_scans
ALTER TABLE public.email_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email scans"
    ON public.email_scans
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email scans"
    ON public.email_scans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create email_scan_results table for detailed analysis
CREATE TABLE public.email_scan_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scan_id UUID REFERENCES public.email_scans(id) ON DELETE CASCADE,
    check_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for email_scan_results
ALTER TABLE public.email_scan_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email scan results"
    ON public.email_scan_results
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.email_scans
        WHERE email_scans.id = email_scan_results.scan_id
        AND email_scans.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own email scan results"
    ON public.email_scan_results
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.email_scans
        WHERE email_scans.id = email_scan_results.scan_id
        AND email_scans.user_id = auth.uid()
    ));
