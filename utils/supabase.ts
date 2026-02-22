import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Glassware = "mug" | "rocks" | "tall-iced";
export type Temperature = "Hot" | "Iced" | "Both";

export interface Drink {
  id: number;
  name: string;
  description: string;
  caffeine_level: number;
  sweetness_level: number;
  acidity_level: number;
  body_level: number;
  bitterness_level: number;
  aroma_profile: string;
  how_to_order: string;
  glassware: Glassware;
  temperature: Temperature;
}
