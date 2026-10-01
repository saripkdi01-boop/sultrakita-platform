'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatEventMonth as formatEventMonthShared } from '@/lib/beranda-types';
import styles from './feed.module.css';

type RailEvent = { id: string; title: string; date: string; month: string; place: string };

// Rail kanan /beranda — HANYA data nyata. Sebelumnya file ini me-render
// properti fiktif + nomor WhatsApp palsu (P0-F2); sekarang: kegiatan komunitas
// mendatang dari tabel group_events, atau tidak me-render apa pun bila kosong.
export function RightSidebar() {
  const [events, setEvents] = useState<RailEvent[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!supabase) { if (active) setEvents([]); return; }
        const { data, error } = await supabase
          .from('group_events')
          .select('id,title,starts_at,location,groups(name)')
          .gte('starts_at', new Date().toISOString())
          .order('starts_at', { ascending: true })
          .limit(4);
        if (error || !active) { if (active) setEvents([]); return; }
        const mapped: RailEvent[] = (data || []).map((event: { id: string; title?: string; starts_at?: string; location?: string; groups?: { name?: string } | Array<{ name?: string }> | null }) => {
          const date = new Date(event.starts_at || '');
          const groupName = Array.isArray(event.groups) ? event.groups[0]?.name : event.groups?.name;
          return {
            id: String(event.id),
            title: event.title || 'Kegiatan komunitas',
            date: Number.isNaN(date.getTime()) ? '–' : String(date.getDate()).padStart(2, '0'),
            month: formatEventMonthShared(event.starts_at || ''),
            place: [groupName, event.location].filter(Boolean).join(' · ') || 'Sulawesi Tenggara',
          };
        });
        setEvents(mapped);
      } catch {
        if (active) setEvents([]);
      }
    })();
    return () => { active = false; };
  }, []);

  if (!events || events.length === 0) return null;

  return (
    <aside className={styles.railWidget} aria-labelledby="rail-events-title">
      <div className={styles.railHead}>
        <span className={styles.railIcon}><CalendarDays size={15} aria-hidden="true" /></span>
        <h2 id="rail-events-title">Kegiatan komunitas</h2>
      </div>
      <ul className={styles.railList}>
        {events.map((event) => (
          <li key={event.id} className={styles.railItem}>
            <span className={styles.railDate} aria-hidden="true"><b>{event.date}</b><small>{event.month}</small></span>
            <span className={styles.railMeta}><strong>{event.title}</strong><small>{event.place}</small></span>
          </li>
        ))}
      </ul>
      <a href="/groups" className={styles.railLink}>Jelajahi komunitas <ArrowRight size={14} aria-hidden="true" /></a>
    </aside>
  );
}
