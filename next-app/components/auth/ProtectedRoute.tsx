'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
export function ProtectedRoute({ children, requiredRole }: { children: ReactNode; requiredRole?: string }) { const router=useRouter(); const [allowed,setAllowed]=useState(false); useEffect(()=>{let active=true; async function check(){if(!supabase){router.replace('/login');return;} const {data:{user}}=await supabase.auth.getUser(); if(!user){router.replace('/login');return;} if(requiredRole){const {data:profile}=await supabase.from('profiles').select('role').eq('id',user.id).maybeSingle();if(profile?.role!==requiredRole&&profile?.role!=='admin'){router.replace('/dashboard');return;}} if(active)setAllowed(true)}void check();return()=>{active=false}},[requiredRole,router]); if(!allowed)return <div className="grid min-h-screen place-items-center bg-[#f7fbf8]"><div className="h-9 w-9 animate-spin rounded-full border-2 border-[#1b8f7d] border-t-transparent"/></div>; return <>{children}</>; }
export default ProtectedRoute;
