import type { MenuItemConfig } from '@/config/navigation';
import type { MouseEvent } from 'react';
export function MenuItem({item,onClick,label}:{item:MenuItemConfig;onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;label?: string}){ const Icon=item.icon; return <a className={'menu-item ' + (item.active ? 'active' : '')} href={item.route} onClick={onClick}><Icon size={18}/><span>{label || item.label}</span>{item.badge&&<b>{item.badge}</b>}</a> }
