'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { DOORS } from '@/lib/homepage/content';
import type { HomeStats } from '@/lib/homepage/stats';
import { CountUp } from './CountUp';
import { DoorIcon } from './DoorIcons';

/** Tahap 2 corong — MINAT: enam pintu klikabel, masing-masing berangka hidup. */
export function DoorsSection({ stats }: { stats: HomeStats }) {
  const [replay, setReplay] = useState<Record<string, number>>({});
  const bump = (id: string) => setReplay((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  return (
    <section id="pintu" className="hm-section" aria-labelledby="hm-doors-title">
      <div className="hm-wrap">
        <header className="hm-section-head hm-reveal">
          <p className="hm-eyebrow">Enam pintu, satu akun</p>
          <h2 id="hm-doors-title" className="hm-h2">Mau ke mana hari ini?</h2>
          <p className="hm-section-lead">Setiap pintu adalah ruang yang sudah berjalan — angkanya diambil langsung dari Suki Apps.</p>
        </header>

        <ul className="hm-doors">
          {DOORS.map((door, index) => {
            const stat = stats[door.id];
            return (
              <li key={door.id} className="hm-reveal" style={{ '--i': index } as React.CSSProperties}>
                <Link
                  href={door.href}
                  className="hm-door"
                  data-track="door_click"
                  data-track-door={door.id}
                  data-track-placement="doors"
                  onMouseEnter={() => bump(door.id)}
                  onFocus={() => bump(door.id)}
                >
                  <span className="hm-door-icon"><DoorIcon id={door.id} /></span>
                  <h3 className="hm-h3">{door.name}</h3>
                  <p className="hm-door-stat">
                    {stat.value > 0 ? (
                      <>
                        <CountUp value={stat.value} replay={replay[door.id] ?? 0} /> <span>{door.unit}</span>
                      </>
                    ) : (
                      <span className="hm-count-new">Baru dibuka — jadilah yang pertama</span>
                    )}
                    {stat.source === 'contoh' && <span className="hm-sample">contoh</span>}
                  </p>
                  <p className="hm-door-benefit">{door.benefit}</p>
                  <ArrowUpRight className="hm-door-arrow" size={20} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
