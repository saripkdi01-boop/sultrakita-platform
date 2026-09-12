'use client';
import type { MenuItemConfig } from '@/config/navigation';
import type { MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
export function MenuItem({item,onClick,label}:{item:MenuItemConfig;onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;label?: string}){ const pathname=usePathname(); const Icon=item.icon; const route=item.route.split('#')[0]; const active=Boolean(item.active || (route && route !== '/' && pathname.startsWith(route))); return <a className={'menu-item ' + (active ? 'active ' : '') + (item.interactive === 'campaign' ? 'menu-item-campaign' : '')} href={item.route} onClick={onClick} aria-current={active ? 'page' : undefined}><span className="menu-item-icon"><Icon size={18}/>{item.interactive === 'campaign' && <i aria-hidden="true" />}</span><span>{label || item.label}</span>{item.badge&&<b>{item.badge}</b>}</a> }
