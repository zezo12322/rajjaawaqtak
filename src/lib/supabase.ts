import { createClient } from '@supabase/supabase-js'

// المفاتيح العامة (publishable) آمنة للنشر — محميّة بـ Row Level Security.
// بتفضّل قيم الـ Environment Variables، ومعاها fallback عشان الـ build يشتغل
// على أي استضافة (Vercel/Netlify) من غير إعداد إضافي.
const url =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://geunbmopkuhkqqacnjjz.supabase.co"
const key =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "sb_publishable_r8-IFAgibtCvReSCjUn7Dg_oYSZWF3K"

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
