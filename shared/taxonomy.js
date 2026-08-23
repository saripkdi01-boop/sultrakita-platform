const CATEGORIES = [
  { id: 1, slug: 'kendaraan', name: 'Kendaraan', icon: '🚗' },
  { id: 2, slug: 'properti', name: 'Properti & Sewa', icon: '🏠' },
  { id: 3, slug: 'elektronik', name: 'Elektronik', icon: '📱' },
  { id: 4, slug: 'hobi', name: 'Hobi & Olahraga', icon: '🎣' },
  { id: 5, slug: 'rumah-tangga', name: 'Perabot Rumah', icon: '🛋️' },
  { id: 6, slug: 'fashion', name: 'Fashion & Aksesori', icon: '👗' },
  { id: 7, slug: 'kuliner', name: 'Kuliner & Bahan Pangan', icon: '🍲' },
  { id: 8, slug: 'hasil-laut', name: 'Hasil Laut & Perikanan', icon: '🐟' },
  { id: 9, slug: 'pertanian', name: 'Pertanian & Perkebunan', icon: '🌾' },
  { id: 10, slug: 'jasa', name: 'Jasa & Tukang', icon: '🛠️' },
  { id: 11, slug: 'lowongan', name: 'Lowongan Kerja', icon: '💼' },
  { id: 12, slug: 'gratis', name: 'Gratis / Berbagi', icon: '🎁' },
];

const REGIONS = [
  { slug: 'kendari', name: 'Kota Kendari', districts: ['Mandonga', 'Baruga', 'Puuwatu', 'Kadia', 'Wua-Wua', 'Poasia', 'Abeli', 'Kambu', 'Kendari Barat', 'Kendari', 'Nambo'] },
  { slug: 'baubau', name: 'Kota Baubau', districts: ['Betoambari', 'Murhum', 'Wolio', 'Kokalukuna', 'Sorawolio', 'Bungi', 'Lea-Lea', 'Batupoaro'] },
  { slug: 'konawe', name: 'Konawe', districts: ['Unaaha', 'Wawotobi', 'Pondidaha', 'Sampara', 'Abuki'] },
  { slug: 'konawe-selatan', name: 'Konawe Selatan', districts: ['Andoolo', 'Ranomeeto', 'Konda', 'Tinanggea', 'Palangga'] },
  { slug: 'konawe-utara', name: 'Konawe Utara', districts: ['Asera', 'Wiwirano', 'Langgikima', 'Lasolo'] },
  { slug: 'konawe-kepulauan', name: 'Konawe Kepulauan', districts: ['Langara', 'Wawonii Barat', 'Wawonii Timur'] },
  { slug: 'kolaka', name: 'Kolaka', districts: ['Kolaka', 'Wundulako', 'Latambaga', 'Pomalaa', 'Samaturu'] },
  { slug: 'kolaka-utara', name: 'Kolaka Utara', districts: ['Lasusua', 'Pakue', 'Batu Putih', 'Ngapa'] },
  { slug: 'kolaka-timur', name: 'Kolaka Timur', districts: ['Tirawuta', 'Ladongi', 'Lambandia', 'Loea'] },
  { slug: 'bombana', name: 'Bombana', districts: ['Rumbia', 'Kabaena', 'Poleang', 'Rarowatu'] },
  { slug: 'muna', name: 'Muna', districts: ['Raha', 'Katobu', 'Napabalano', 'Tongkuno'] },
  { slug: 'muna-barat', name: 'Muna Barat', districts: ['Sawerigadi', 'Tiworo Tengah', 'Lawa'] },
  { slug: 'buton', name: 'Buton', districts: ['Pasarwajo', 'Kapontori', 'Wolowa', 'Lasalimu'] },
  { slug: 'buton-utara', name: 'Buton Utara', districts: ['Buranga', 'Kulisusu', 'Bonegunu'] },
  { slug: 'buton-selatan', name: 'Buton Selatan', districts: ['Batauga', 'Sampolawa', 'Lapandewa'] },
  { slug: 'buton-tengah', name: 'Buton Tengah', districts: ['Labungkari', 'Mawasangka', 'Gu', 'Lakudo'] },
  { slug: 'wakatobi', name: 'Wakatobi', districts: ['Wangi-Wangi', 'Kaledupa', 'Tomia', 'Binongko'] },
];

const ALL_DISTRICTS = [...new Set(REGIONS.flatMap(region => region.districts))];
module.exports = { CATEGORIES, REGIONS, ALL_DISTRICTS };
