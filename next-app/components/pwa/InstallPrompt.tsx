'use client';

import { useCallback, useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'suki-pwa-install-dismissed';

/**
 * Banner "Install aplikasi" — muncul hanya saat browser mengirim
 * event beforeinstallprompt (Chrome/Edge Android & desktop),
 * belum ter-install, dan belum pernah di-dismiss.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
    if (isStandalone) return;
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      /* abaikan */
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {
      /* abaikan */
    } finally {
      setVisible(false);
      setDeferred(null);
    }
  }, [deferred]);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* abaikan */
    }
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Install SUKI Apps"
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: 480,
        margin: '0 auto',
        padding: '12px 12px 12px 14px',
        borderRadius: 16,
        background: '#0e6258',
        color: '#ffffff',
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon-192.png"
        alt=""
        width={44}
        height={44}
        style={{ borderRadius: 12, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>Install SUKI Apps</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
          Buka lebih cepat dari layar utama HP kamu.
        </div>
      </div>
      <button
        type="button"
        onClick={install}
        style={{
          flexShrink: 0,
          border: 'none',
          borderRadius: 999,
          padding: '10px 18px',
          background: '#FFD766',
          color: '#0e6258',
          fontWeight: 800,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        Install
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Tutup"
        style={{
          flexShrink: 0,
          border: 'none',
          background: 'transparent',
          color: '#ffffff',
          opacity: 0.7,
          fontSize: 18,
          cursor: 'pointer',
          padding: 4,
        }}
      >
        ×
      </button>
    </div>
  );
}
