/* Single source of truth for SultraKita settings navigation. */
window.SULTRAKITA_SETTINGS_FEATURES = [
  {id:'account',group:'Pengaturan & privasi',title:'Pengaturan akun',description:'Akun, preferensi, dan notifikasi',iconKey:'settings',route:'/settings.html#akun',api:'/api/settings',authRequired:true,status:'active'},
  {id:'preferences',group:'Pengaturan & privasi',title:'Preferensi',description:'Bahasa, tampilan, dan notifikasi aplikasi',iconKey:'settings',route:'/settings.html#preferensi',api:'/api/settings',authRequired:true,status:'active'},
  {id:'notifications',group:'Pengaturan & privasi',title:'Notifikasi',description:'Kanal komunikasi akun',iconKey:'bell',route:'/settings.html#notifikasi',api:'/api/settings',authRequired:true,status:'active'},
  {id:'privacy-center',group:'Privasi & keamanan',title:'Pusat Privasi',description:'Profil, interaksi, dan audience',iconKey:'privacy',route:'/settings.html#privasi',api:'/api/settings/privacy/checkup',authRequired:true,status:'active'},
  {id:'privacy-checkup',group:'Privasi & keamanan',title:'Pemeriksaan Privasi',description:'Tinjau kontrol privasi secara ringkas',iconKey:'privacy',route:'/settings.html#checkup',api:'/api/settings/privacy/checkup',authRequired:true,status:'active'},
  {id:'security',group:'Privasi & keamanan',title:'Keamanan',description:'Aktivitas keamanan dan session',iconKey:'shield',route:'/settings.html#keamanan',api:'/api/settings/devices',authRequired:true,status:'active'},
  {id:'devices',group:'Privasi & keamanan',title:'Perangkat',description:'Kelola perangkat yang terhubung',iconKey:'devices',route:'/settings.html#perangkat',api:'/api/settings/devices',authRequired:true,status:'active'},
  {id:'time-management',group:'Aktivitas',title:'Manajemen waktu',description:'Batas penggunaan harian',iconKey:'clock',route:'/settings.html#waktu',api:'/api/settings/time',authRequired:true,status:'active'},
  {id:'promotion-activity',group:'Aktivitas',title:'Aktivitas promosi',description:'Event promosi nyata dari listing',iconKey:'promotion',route:'/settings.html#promosi',api:'/api/settings/promotions',authRequired:true,status:'active'},
  {id:'link-history',group:'Aktivitas',title:'Riwayat tautan',description:'Tautan yang pernah dibuka',iconKey:'link',route:'/settings.html#tautan',api:'/api/settings/link-history',authRequired:true,status:'active'},
  {id:'account-activity',group:'Aktivitas',title:'Aktivitas akun',description:'Ringkasan aktivitas akun',iconKey:'security',route:'/settings.html#keamanan',api:'/api/settings/activity',authRequired:true,status:'coming_soon'},
  {id:'orders',group:'Transaksi',title:'Pesanan & pembayaran',description:'Riwayat transaksi existing',iconKey:'payment',route:'/settings.html#pesanan',api:'/api/settings/orders',authRequired:true,status:'active'},
  {id:'data-usage',group:'Data',title:'Penggunaan data',description:'Ringkasan konektivitas akun',iconKey:'data',route:'/settings.html#data-usage',api:'/api/settings/data-usage',authRequired:true,status:'active'},
  {id:'data-information',group:'Data',title:'Informasi & data',description:'Salinan dan kontrol data pribadi',iconKey:'data',route:'/settings.html#data',api:'/api/settings/data-export',authRequired:true,status:'active'},
  {id:'data-export',group:'Data',title:'Ekspor data',description:'Unduh JSON atau CSV',iconKey:'data',route:'/settings.html#data',api:'/api/settings/data-export',authRequired:true,status:'active'},
  {id:'theme',group:'Tampilan',title:'Mode gelap',description:'Sesuaikan tampilan aplikasi',iconKey:'moon',route:'/settings.html#preferensi',api:null,authRequired:false,status:'active'},
  {id:'language',group:'Tampilan',title:'Bahasa',description:'Bahasa antarmuka SultraKita',iconKey:'language',route:'/settings.html#preferensi',api:'/api/settings',authRequired:true,status:'active'},
  {id:'app-icon',group:'Tampilan',title:'Ikon aplikasi',description:'Pilihan ikon SultraKita',iconKey:'app',route:'/settings.html#preferensi',api:'/api/settings',authRequired:true,status:'coming_soon'},
  {id:'blocking',group:'Lainnya',title:'Pemblokiran',description:'Belum ada model block-list di backend',iconKey:'block',route:null,api:null,authRequired:true,status:'coming_soon'},
  {id:'help',group:'Lainnya',title:'Bantuan & dukungan',description:'Pusat bantuan dan kontak',iconKey:'help',route:'/privacy.html',api:null,authRequired:false,status:'active'},
  {id:'terms',group:'Lainnya',title:'Kebijakan & ketentuan',description:'Dokumen legal SultraKita',iconKey:'terms',route:'/terms.html',api:null,authRequired:false,status:'active'}
];
window.getSultraKitaSettingsFeatures = function(){ return window.SULTRAKITA_SETTINGS_FEATURES.slice(); };
