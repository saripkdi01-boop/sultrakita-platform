'use client';
import type { MenuItemConfig } from '@/config/navigation';
import type { MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
export function MenuItem({item,onClick,label}:{item:MenuItemConfig;onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;label?: string}){ const pathname=usePathname(); const Icon=item.icon; const route=item.route.split('#')[0]; const active=Boolean(item.active || (route && route !== '/' && pathname.startsWith(route))); return <a className={'menu-item ' + (active ? 'active' : '')} href={item.route} onClick={onClick} aria-current={active ? 'page' : undefined}><Icon size={18}/><span>{label || item.label}</span>{item.badge&&<b>{item.badge}</b>}</a> }
