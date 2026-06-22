import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://neznujnrpvdqkqkbsmmk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lem51am5ycHZkcWtxa2JzbW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDM3NTAsImV4cCI6MjA5MjY3OTc1MH0.RSIW64ixh-d_mo6qbrzriXhTS4HADBrUccgnQh9UVA8";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export {
  supabase as s
};
