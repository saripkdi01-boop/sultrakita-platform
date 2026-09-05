'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'buyer' | 'seller' | 'creator' | 'community' | 'admin';
export type Visibility = 'public' | 'followers' | 'private';
export type SettingTab = 'account' | 'privacy' | 'notifications' | 'security' | 'activity' | 'blocked' | 'appearance' | 'seller' | 'help';

export type UserProfile = {
  full_name: string; username: string; avatar_url: string; email: string; phone: string; bio: string; city: string; district: string; role: UserRole; language: string; interests: string[]; profile_visibility: Visibility; online_status_visible: boolean; autoplay: 'always' | 'wifi' | 'never'; reduce_motion: boolean; dark_mode: boolean; email_notifications: boolean; push_notifications: boolean;
};

export const defaultProfile: UserProfile = {
  full_name: 'Pengguna SultraKita', username: 'warga_sultra', avatar_url: '', email: '', phone: '', bio: '', city: 'Kendari', district: 'Kendari', role: 'buyer', language: 'Bahasa Indonesia', interests: ['Marketplace'], profile_visibility: 'public', online_status_visible: true, autoplay: 'wifi', reduce_motion: false, dark_mode: false, email_notifications: true, push_notifications: true,
};

type ProfileState = { profile: UserProfile; menuOpen: boolean; setupOpen: boolean; settingsOpen: boolean; activeTab: SettingTab; setProfile: (profile: Partial<UserProfile>) => void; toggleMenu: () => void; openSetup: () => void; openSettings: (tab?: SettingTab) => void; closeOverlays: () => void; setActiveTab: (tab: SettingTab) => void };
export const useProfileStore = create<ProfileState>()(persist((set) => ({ profile: defaultProfile, menuOpen: false, setupOpen: false, settingsOpen: false, activeTab: 'account', setProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })), toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })), openSetup: () => set({ menuOpen: false, setupOpen: true }), openSettings: (tab = 'account') => set({ menuOpen: false, settingsOpen: true, activeTab: tab }), closeOverlays: () => set({ menuOpen: false, setupOpen: false, settingsOpen: false }), setActiveTab: (activeTab) => set({ activeTab }) }), { name: 'sultrakita-profile-storage', partialize: (state) => ({ profile: state.profile }) }));
