const app = require('../server');
const server = app.listen(0, async () => {
  try {
    const endpoint = `http://127.0.0.1:${server.address().port}`;
    const listingResponse = await fetch(`${endpoint}/api/listings`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Foto Uji Listing Kendari', description: 'Listing untuk menguji upload foto marketplace.', price: 100000, category_id: 1, district: 'Kendari' }) });
    const listing = await listingResponse.json();
    const form = new FormData(); form.append('images', new Blob(['fake-image-data'], { type: 'image/jpeg' }), 'demo.jpg');
    const uploadResponse = await fetch(`${endpoint}/api/listings/${listing.data.id}/images`, { method: 'POST', body: form });
    const uploaded = await uploadResponse.json();
    if (!uploaded.success || uploaded.data.length !== 1) throw new Error('Upload foto gagal');
    console.log(JSON.stringify({ listing_created: listingResponse.status, upload_status: uploadResponse.status, image_count: uploaded.data.length }));
  } finally { server.close(); }
});
