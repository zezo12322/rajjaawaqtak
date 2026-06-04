import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

/**
 * عميل Supabase — يستخدم المفتاح العام (publishable) الآمن للنشر في المتصفح.
 * الصلاحيات محمية عبر Row Level Security على مستوى قاعدة البيانات.
 */
export const supabase = createClient(url, key)

export type Advice = {
  id: string
  name: string
  advice: string
  created_at: string
}

export type VolunteerInput = {
  name: string
  phone: string
  city?: string
  interest?: string
  message?: string
}
