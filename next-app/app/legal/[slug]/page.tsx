'use client';

import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LegalDocumentViewer } from '@/components/support/SupportComponents';
import { supabase } from '@/lib/supabase/client';
export default function LegalPage(){const [doc,setDoc]=useState<any>(null);const [agree,setAgree]=useState(false);const slug=typeof window!=='undefined'?window.location.pathname.split('/').pop()||'terms':'terms';useEffect(()=>{async function load(){if(!supabase)return;const {data}=await supabase.from('legal_documents').select('title,content,version').eq('slug',slug).eq('is_active',true).maybeSingle();setDoc(data||{title:slug==='privacy'?'Kebijakan Privasi':'Syarat & Ketentuan',version:'1.0.0',content:'Dokumen kebijakan sedang dipersiapkan oleh tim SultraKita.'})}void load()},[slug]);return <AppLayout><main className="platform-shell mx-auto max-w-3xl"><Link href="/help-center" className="mb-5 inline-flex items-center gap-2 text-sm text-sultra-teal"><ArrowLeft size={16}/> Pusat Bantuan</Link>{doc&&<><LegalDocumentViewer {...doc}/><label className="mt-5 flex items-center gap-3 rounded-2xl border border-sultra-mint bg-white p-4 text-sm dark:bg-sultra-dark"><input type="checkbox" checked={agree} onChange={event=>setAgree(event.target.checked)}/><span>Saya telah membaca dan menyetujui dokumen ini.</span></label>{agree&&<button className="mt-3 flex items-center gap-2 rounded-xl bg-sultra-teal px-4 py-2 text-sm font-semibold text-white"><Check size={16}/> Terima</button>}</>}</main></AppLayout>}
