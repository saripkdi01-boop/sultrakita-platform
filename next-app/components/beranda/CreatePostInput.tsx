'use client';
import { ImagePlus, MapPin, Video } from 'lucide-react';
export function CreatePostInput({ onCreate }: { onCreate?: () => void }) { return <section className="beranda-create-post"><div className="beranda-create-row"><span className="beranda-avatar">SH</span><button onClick={onCreate}>Apa yang Anda pikirkan, Syarief?</button></div><div className="beranda-create-actions"><button onClick={onCreate}><ImagePlus size={17}/> Foto</button><button onClick={onCreate}><Video size={17}/> Reels</button><button onClick={onCreate}><MapPin size={17}/> Lokasi</button></div></section>; }
