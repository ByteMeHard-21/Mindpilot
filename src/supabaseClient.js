import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dybtgxzmusbcsvfmxthl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YnRneHptdXNiY3N2Zm14dGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjM1NTgsImV4cCI6MjA2NTc5OTU1OH0.B4N-efutn5GRU9c6X3fsNwQjLMQY23YW_voHUVRRroY';

export const supabase = createClient(supabaseUrl, supabaseKey) ;