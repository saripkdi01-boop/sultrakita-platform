# Temuan WhatsApp OTP

Riset dilakukan 24 Agustus 2026 terhadap dokumentasi resmi Meta. Meta menjelaskan bahwa WhatsApp Business Platform mengenakan biaya berdasarkan pesan yang delivered, kategori template, dan kode negara penerima. Authentication adalah kategori khusus untuk OTP. Meta juga menyatakan bahwa pesan non-template gratis hanya di dalam customer service window, sehingga tidak dapat dijadikan mekanisme OTP login outbound yang andal.

Dokumentasi template Meta menyatakan bahwa template harus dibuat melalui WhatsApp Manager atau Message Templates API, diberi kategori authentication, menggunakan language code, menyediakan contoh variable, dan berstatus APPROVED sebelum dapat dikirim. Template dapat menggunakan positional parameter seperti `{{1}}`; nilai OTP dikirim pada komponen body saat request Cloud API.

Konsekuensi untuk SultraKita: deep-link `wa.me` adalah gratis untuk membuka chat user-to-business, tetapi tidak dapat mengirim OTP otomatis. OTP otomatis membutuhkan WhatsApp Business Platform/Cloud API atau provider resmi yang meneruskan pesan ke API Meta. Provider pihak ketiga dapat menambahkan biaya sendiri. Klaim 100% gratis untuk produksi tidak dapat dijamin; opsi paling hemat adalah direct Cloud API tanpa BSP markup, dengan biaya Meta per delivered authentication message sesuai rate card Indonesia yang berlaku.

Sumber:

1. https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
2. https://whatsappbusiness.com/products/platform-pricing/
3. https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview
4. https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/template-messages/
