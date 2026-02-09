import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-05209d75`;
export const ANON_KEY = publicAnonKey;
