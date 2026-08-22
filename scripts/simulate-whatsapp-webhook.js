#!/usr/bin/env node
const baseUrl=process.env.SULTRAKITA_URL||'http://localhost:3000';
const payload={event:'messages.upserted',timestamp:new Date().toISOString(),buyer:{name:'Budi Kendari',phone:'081234567891'},seller:{name:'UMKM Kendari',phone:'081234567890'},listing:{id:1,title:'iPhone 13 Kondisi Mulus'},message:{id:'simulated-message-001',body:'Apakah barang masih tersedia dan bisa bertemu di Kadia?',direction:'buyer_to_seller'}};
console.log(JSON.stringify({simulation:true,description:'Payload notifikasi WhatsApp — tidak dikirim ke Meta',payload},null,2));
if(process.env.SIMULATE_HTTP==='true'){
  fetch(`${baseUrl}/api/dev/whatsapp-webhook`,{method:'POST',headers:{'content-type':'application/json','x-simulation-token':process.env.SIMULATION_TOKEN||'local-only'},body:JSON.stringify(payload)}).then(async r=>{console.log(`HTTP ${r.status}`);console.log(await r.text())}).catch(error=>{console.error(error.message);process.exitCode=1});
}
