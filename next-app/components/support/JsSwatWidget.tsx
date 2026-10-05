'use client';

import { MessageCircle, Send, X, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type Msg = { from: 'bot' | 'user'; text: string };

// Basis pengetahuan FAQ JS SWAT (Bahasa Indonesia)
const FAQ: Array<{ keys: string[]; answer: string }> = [
  {
    keys: ['suki apps', 'apa itu', 'tentang'],
    answer: 'SUKI Apps adalah super-app lokal Sulawesi Tenggara — marketplace, properti, komunitas, lowongan kerja, dan game dalam satu platform. Semua dalam Bahasa Indonesia! 🇮🇩',
  },
  {
    keys: ['jual', 'jualan', 'pasang iklan', 'listing'],
    answer: 'Untuk jualan: buka SUKI Marketplace → tekan tombol "+ Jual" → isi foto, judul, harga, dan deskripsi → tekan Terbitkan. Listing langsung tayang otomatis! 📸',
  },
  {
    keys: ['beli', 'belanja', 'order'],
    answer: 'Untuk beli: cari barang di SUKI Marketplace, buka detailnya, lalu hubungi penjual via tombol chat atau WhatsApp yang tersedia. 💬',
  },
  {
    keys: ['properti', 'rumah', 'tanah', 'kos', 'kontrakan'],
    answer: 'Cari properti di menu SUKI Properti — ada 800+ listing rumah, tanah, dan kos di Sulawesi Tenggara dengan foto dan peta lokasi! 🏠',
  },
  {
    keys: ['game', 'jala', 'kampung', 'main'],
    answer: 'Main game di SUKI Games! Ada JALA (simulasi nelayan) dan SUKI Kampung (game berkebun). Buka menu Ekosistem → SUKI Games. 🎮',
  },
  {
    keys: ['daftar', 'register', 'akun', 'signup'],
    answer: 'Daftar gratis: tekan "Masuk" di kanan atas → pilih "Daftar" → bisa pakai Google atau email. Tanpa biaya! ✨',
  },
  {
    keys: ['masuk', 'login'],
    answer: 'Tekan tombol "Masuk" di kanan atas, lalu login dengan Google atau email yang sudah terdaftar. 🔑',
  },
  {
    keys: ['lupa password', 'reset password'],
    answer: 'Klik "Lupa password" di halaman masuk, masukkan emailmu, lalu cek inbox untuk link reset. 📧',
  },
  {
    keys: ['gratis', 'bayar', 'biaya', 'harga'],
    answer: 'SUKI Apps gratis untuk pengguna! Pasang iklan marketplace juga gratis. Layanan Web Studio (pembuatan website) berbayar mulai Rp 1,5 juta. 💰',
  },
  {
    keys: ['web studio', 'bikin web', 'website'],
    answer: 'SUKI Web Studio melayani pembuatan website: Landing Page Rp 1,5jt, Company Profile Rp 3jt, Toko Online Rp 6jt. Lihat menu SUKI Web Studio untuk detail! 🌐',
  },
  {
    keys: ['kerja', 'loker', 'lowongan', 'jobs'],
    answer: 'Cek SUKI Jobs untuk lowongan kerja di Sulawesi Tenggara. Perusahaan juga bisa pasang loker di sana! 💼',
  },
  {
    keys: ['komunitas', 'grup', 'group'],
    answer: 'Gabung komunitas di menu Komunitas — ada berbagai grup sesuai minat dan daerahmu! 👥',
  },
  {
    keys: ['kontak', 'hubungi', 'cs', 'bantuan', 'help', 'whatsapp', 'wa'],
    answer: 'Butuh bantuan manusia? Hubungi tim SUKI via WhatsApp. Kami siap membantu! 📱',
  },
  {
    keys: ['halo', 'hai', 'pagi', 'siang', 'sore', 'malam', 'assalamu'],
    answer: 'Halo! 👋 Senang bertemu denganmu. Ada yang bisa JS SWAT bantu? Tanya soal jualan, properti, game, atau apapun tentang SUKI Apps!',
  },
  {
    keys: ['terima kasih', 'makasih', 'thanks', 'thank you'],
    answer: 'Sama-sama! 😊 Senang bisa membantu. Jangan ragu tanya lagi kalau butuh apa-apa.',
  },
];

const QUICK_QUESTIONS = [
  'Apa itu SUKI Apps?',
  'Cara jualan di marketplace?',
  'Cari properti di mana?',
  'Game apa saja yang ada?',
];

function findAnswer(question: string): string {
  const q = question.toLowerCase();
  for (const item of FAQ) {
    if (item.keys.some((k) => q.includes(k))) return item.answer;
  }
  return 'Hmm, JS SWAT belum tahu jawabannya. 🤔 Coba tanya dengan kata kunci lain, atau hubungi tim SUKI via WhatsApp untuk bantuan langsung!';
}

export function JsSwatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: 'Halo! 👋 Saya **JS SWAT**, asisten support SUKI Apps. Ada yang bisa saya bantu?' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: 'user', text: clean }]);
    setInput('');
    // Simulasi jeda mengetik
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: findAnswer(clean) }]);
    }, 600);
  };

  return (
    <div className="js-swat-root" aria-label="JS SWAT Support">
      {open && (
        <div className="js-swat-panel" role="dialog" aria-label="Chat JS SWAT">
          <div className="js-swat-header">
            <span className="js-swat-avatar"><Zap size={20} /></span>
            <span className="js-swat-title">
              <strong>JS SWAT</strong>
              <small><i className="js-swat-dot" /> Online — Support SUKI Apps</small>
            </span>
            <button className="js-swat-close" onClick={() => setOpen(false)} aria-label="Tutup chat">
              <X size={18} />
            </button>
          </div>
          <div className="js-swat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`js-swat-msg js-swat-${msg.from}`}>
                <span>{msg.text}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {messages.length <= 1 && (
            <div className="js-swat-quick">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}
          <form
            className="js-swat-input"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaanmu..."
              aria-label="Tulis pertanyaan"
              maxLength={500}
            />
            <button type="submit" aria-label="Kirim pesan"><Send size={17} /></button>
          </form>
        </div>
      )}
      <button
        className={`js-swat-fab ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Tutup JS SWAT' : 'Buka JS SWAT Support'}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && <span className="js-swat-badge">1</span>}
      </button>
      <style jsx>{`
        .js-swat-root { position: fixed; right: 20px; bottom: 20px; z-index: 9999; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .js-swat-fab { position: relative; width: 58px; height: 58px; border-radius: 50%; border: 0; cursor: pointer;
          background: linear-gradient(135deg, #0e6258, #138a7d); color: #fff;
          display: grid; place-items: center; box-shadow: 0 10px 28px rgba(14,98,88,.4);
          transition: transform .2s ease; }
        .js-swat-fab:hover { transform: scale(1.07); }
        .js-swat-badge { position: absolute; top: 2px; right: 2px; min-width: 20px; height: 20px; border-radius: 10px;
          background: #e6b66d; color: #12211f; font-size: 11px; font-weight: 800;
          display: grid; place-items: center; padding: 0 5px; }
        .js-swat-panel { position: absolute; right: 0; bottom: 70px; width: 370px; max-width: calc(100vw - 40px);
          height: 520px; max-height: calc(100dvh - 120px); display: flex; flex-direction: column;
          background: #fff; border-radius: 20px; overflow: hidden;
          box-shadow: 0 24px 70px rgba(10,30,26,.28); border: 1px solid #dbe8e2;
          animation: js-swat-in .25s ease; }
        @keyframes js-swat-in { from { opacity: 0; transform: translateY(14px) scale(.98); } to { opacity: 1; transform: none; } }
        .js-swat-header { display: flex; align-items: center; gap: 10px; padding: 14px 14px;
          background: linear-gradient(135deg, #0e6258, #138a7d); color: #fff; }
        .js-swat-avatar { width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,.18);
          display: grid; place-items: center; flex: none; }
        .js-swat-title { flex: 1; line-height: 1.3; }
        .js-swat-title strong { display: block; font-size: 14px; letter-spacing: .06em; }
        .js-swat-title small { display: flex; align-items: center; gap: 5px; font-size: 10px; opacity: .85; }
        .js-swat-dot { width: 7px; height: 7px; border-radius: 50%; background: #7dff9b; display: inline-block; }
        .js-swat-close { background: rgba(255,255,255,.15); border: 0; color: #fff; width: 30px; height: 30px;
          border-radius: 9px; cursor: pointer; display: grid; place-items: center; }
        .js-swat-messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 9px;
          background: #f4faf7; }
        .js-swat-msg { max-width: 85%; font-size: 13px; line-height: 1.55; }
        .js-swat-msg span { display: inline-block; padding: 9px 13px; border-radius: 15px; white-space: pre-wrap; }
        .js-swat-bot { align-self: flex-start; }
        .js-swat-bot span { background: #fff; border: 1px solid #dbe8e2; border-bottom-left-radius: 5px; color: #12211f; }
        .js-swat-user { align-self: flex-end; }
        .js-swat-user span { background: #0e6258; color: #fff; border-bottom-right-radius: 5px; }
        .js-swat-quick { display: flex; flex-wrap: wrap; gap: 7px; padding: 10px 14px; background: #f4faf7; border-top: 1px dashed #dbe8e2; }
        .js-swat-quick button { font-size: 11px; padding: 7px 11px; border-radius: 999px; cursor: pointer;
          border: 1px solid #138a7d; background: #fff; color: #0e6258; font-weight: 700; }
        .js-swat-quick button:hover { background: #e7f3ef; }
        .js-swat-input { display: flex; gap: 8px; padding: 12px 14px; background: #fff; border-top: 1px solid #dbe8e2; }
        .js-swat-input input { flex: 1; height: 42px; border: 1px solid #dbe8e2; border-radius: 12px; padding: 0 13px;
          font-size: 13px; outline: none; font-family: inherit; }
        .js-swat-input input:focus { border-color: #138a7d; }
        .js-swat-input button { width: 42px; height: 42px; border-radius: 12px; border: 0; cursor: pointer;
          background: #0e6258; color: #fff; display: grid; place-items: center; flex: none; }
        .js-swat-input button:hover { background: #138a7d; }
        html[data-theme='dark'] .js-swat-panel { background: #102923; border-color: #294a44; }
        html[data-theme='dark'] .js-swat-messages { background: #0b201b; }
        html[data-theme='dark'] .js-swat-bot span { background: #173a35; border-color: #294a44; color: #e7f3ef; }
        html[data-theme='dark'] .js-swat-quick { background: #0b201b; border-color: #294a44; }
        html[data-theme='dark'] .js-swat-quick button { background: #173a35; color: #8ed3c4; border-color: #294a44; }
        html[data-theme='dark'] .js-swat-input { background: #102923; border-color: #294a44; }
        html[data-theme='dark'] .js-swat-input input { background: #0b201b; border-color: #294a44; color: #e7f3ef; }
        @media (max-width: 480px) {
          .js-swat-root { right: 14px; bottom: 14px; }
          .js-swat-panel { width: calc(100vw - 28px); bottom: 68px; }
        }
      `}</style>
    </div>
  );
}
