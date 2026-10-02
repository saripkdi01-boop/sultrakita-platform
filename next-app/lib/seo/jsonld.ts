/**
 * Builder JSON-LD murni (tanpa akses DB) untuk SEO SukiApps.
 *
 * ATURAN INTEGRITAS: setiap builder hanya memakai data nyata yang dioper
 * pemanggil. Field opsional yang datanya tidak ada HARUS dihilangkan dari
 * output (bukan diisi tebakan). Jangan pernah mengarang harga, rating,
 * ketersediaan, alamat, atau tanggal — klaim palsu di structured data
 * melanggar pedoman Google dan merusak kepercayaan.
 *
 * Pemakaian: render hasilnya di <script type="application/ld+json"> pada
 * halaman detail yang datanya sudah terverifikasi dari database.
 */

export const JSONLD_CONTEXT = 'https://schema.org' as const;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface ImageInput {
  url: string;
  width?: number;
  height?: number;
}

function toImageObject(image: string | ImageInput): JsonValue {
  if (typeof image === 'string') return image;
  const obj: Record<string, JsonValue> = { '@type': 'ImageObject', url: image.url };
  if (image.width) obj.width = image.width;
  if (image.height) obj.height = image.height;
  return obj;
}

export interface PostalAddressInput {
  streetAddress?: string;
  addressLocality?: string; // kota/kabupaten, mis. "Kendari"
  addressRegion?: string; // provinsi, mis. "Sulawesi Tenggara"
  postalCode?: string;
  addressCountry?: string; // kode ISO, mis. "ID"
}

export function postalAddressJsonLd(input: PostalAddressInput): Record<string, JsonValue> {
  const address: Record<string, JsonValue> = { '@type': 'PostalAddress' };
  if (input.streetAddress) address.streetAddress = input.streetAddress;
  if (input.addressLocality) address.addressLocality = input.addressLocality;
  if (input.addressRegion) address.addressRegion = input.addressRegion;
  if (input.postalCode) address.postalCode = input.postalCode;
  if (input.addressCountry) address.addressCountry = input.addressCountry;
  return address;
}

/** Hapus key bernilai undefined/null dari objek satu level. */
function compact<T extends Record<string, JsonValue | undefined>>(obj: T): Record<string, JsonValue> {
  const out: Record<string, JsonValue> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null) out[k] = v as JsonValue;
  }
  return out;
}

export interface ProductJsonLdInput {
  name: string;
  price: number;
  currency?: string; // default "IDR"
  url: string;
  image?: string | ImageInput | Array<string | ImageInput>;
  description?: string;
  brand?: string;
  sku?: string;
  /** Kondisi barang; hanya isi bila diketahui pasti. */
  itemCondition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  /** Ketersediaan; hanya isi bila diketahui pasti dari stok. */
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

/** schema.org/Product — untuk listing marketplace. */
export function productJsonLd(input: ProductJsonLdInput): Record<string, JsonValue> {
  const images = input.image === undefined ? undefined : (Array.isArray(input.image) ? input.image : [input.image]).map(toImageObject);
  const offers: Record<string, JsonValue> = {
    '@type': 'Offer',
    price: input.price,
    priceCurrency: input.currency ?? 'IDR',
    url: input.url,
  };
  if (input.availability) offers.availability = `https://schema.org/${input.availability}`;
  if (input.itemCondition) offers.itemCondition = `https://schema.org/${input.itemCondition}`;

  return compact({
    '@context': JSONLD_CONTEXT,
    '@type': 'Product',
    name: input.name,
    image: images,
    description: input.description,
    sku: input.sku,
    brand: input.brand ? { '@type': 'Brand', name: input.brand } : undefined,
    offers,
  });
}

export interface JobPostingJsonLdInput {
  title: string;
  description: string;
  url: string;
  hiringOrganization: { name: string; url?: string; logo?: string };
  /** Tanggal posting ISO 8601, dari data nyata. */
  datePosted: string;
  /** Batas lamaran ISO 8601; hanya bila ada. */
  validThrough?: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN' | 'VOLUNTEER' | 'OTHER';
  jobLocation?: {
    city?: string;
    region?: string;
    country?: string;
    /** "REMOTE" bila kerja remote; selain itu hilangkan field ini. */
    remote?: boolean;
  };
  baseSalary?: { value: number; currency?: string; unitText?: 'MONTH' | 'YEAR' | 'HOUR' };
}

/** schema.org/JobPosting — untuk lowongan kerja. */
export function jobPostingJsonLd(input: JobPostingJsonLdInput): Record<string, JsonValue> {
  const org: Record<string, JsonValue> = { '@type': 'Organization', name: input.hiringOrganization.name };
  if (input.hiringOrganization.url) org.sameAs = input.hiringOrganization.url;
  if (input.hiringOrganization.logo) org.logo = input.hiringOrganization.logo;

  let jobLocationType: string | undefined;
  let address: Record<string, JsonValue> | undefined;
  if (input.jobLocation) {
    if (input.jobLocation.remote) {
      jobLocationType = 'TELECOMMUTE';
    } else {
      address = postalAddressJsonLd({
        addressLocality: input.jobLocation.city,
        addressRegion: input.jobLocation.region,
        addressCountry: input.jobLocation.country ?? 'ID',
      });
    }
  }

  return compact({
    '@context': JSONLD_CONTEXT,
    '@type': 'JobPosting',
    title: input.title,
    description: input.description,
    url: input.url,
    datePosted: input.datePosted,
    validThrough: input.validThrough,
    employmentType: input.employmentType,
    hiringOrganization: org,
    jobLocationType,
    jobLocation: address ? { '@type': 'Place', address } : undefined,
    baseSalary: input.baseSalary
      ? {
          '@type': 'MonetaryAmount',
          currency: input.baseSalary.currency ?? 'IDR',
          value: {
            '@type': 'QuantitativeValue',
            value: input.baseSalary.value,
            unitText: input.baseSalary.unitText ?? 'MONTH',
          },
        }
      : undefined,
  });
}

export interface RealEstateJsonLdInput {
  name: string;
  description: string;
  url: string;
  image?: string | ImageInput | Array<string | ImageInput>;
  address?: PostalAddressInput;
  /** Harga dari data nyata; kosongkan bila harga "hubungi penjual". */
  price?: number;
  currency?: string;
  /** Jumlah kamar tidur / kamar mandi / luas (m²) — hanya bila diketahui. */
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  floorSize?: number;
}

/** schema.org/RealEstateListing — untuk listing properti. */
export function realEstateJsonLd(input: RealEstateJsonLdInput): Record<string, JsonValue> {
  const images = input.image === undefined ? undefined : (Array.isArray(input.image) ? input.image : [input.image]).map(toImageObject);

  return compact({
    '@context': JSONLD_CONTEXT,
    '@type': 'RealEstateListing',
    name: input.name,
    description: input.description,
    url: input.url,
    image: images,
    address: input.address ? postalAddressJsonLd(input.address) : undefined,
    numberOfRooms: input.numberOfRooms,
    numberOfBathroomsTotal: input.numberOfBathrooms,
    floorSize:
      input.floorSize !== undefined
        ? { '@type': 'QuantitativeValue', value: input.floorSize, unitCode: 'MTK' }
        : undefined,
    offers:
      input.price !== undefined
        ? {
            '@type': 'Offer',
            price: input.price,
            priceCurrency: input.currency ?? 'IDR',
            url: input.url,
          }
        : undefined,
  });
}

export interface LocalBusinessJsonLdInput {
  name: string;
  url: string;
  description?: string;
  image?: string | ImageInput;
  telephone?: string;
  address?: PostalAddressInput;
  /** Jam operasional schema.org, mis. ["Mo-Fr 09:00-17:00"]. Hanya bila terverifikasi. */
  openingHours?: string[];
  priceRange?: string;
}

/** schema.org/LocalBusiness — untuk profil merchant/UMKM terverifikasi. */
export function localBusinessJsonLd(input: LocalBusinessJsonLdInput): Record<string, JsonValue> {
  return compact({
    '@context': JSONLD_CONTEXT,
    '@type': 'LocalBusiness',
    name: input.name,
    url: input.url,
    description: input.description,
    image: input.image === undefined ? undefined : toImageObject(input.image),
    telephone: input.telephone,
    address: input.address ? postalAddressJsonLd(input.address) : undefined,
    openingHours: input.openingHours,
    priceRange: input.priceRange,
  });
}

export interface BreadcrumbItemInput {
  name: string;
  /** URL absolut; item terakhir (halaman aktif) boleh tanpa url. */
  url?: string;
}

/** schema.org/BreadcrumbList — dipakai juga oleh <Breadcrumbs/>. */
export function breadcrumbJsonLd(items: BreadcrumbItemInput[]): Record<string, JsonValue> {
  return {
    '@context': JSONLD_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => {
      const el: Record<string, JsonValue> = {
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
      };
      if (item.url) el.item = item.url;
      return el;
    }),
  };
}

/** Serialisasi aman untuk <script type="application/ld+json">. */
export function serializeJsonLd(data: Record<string, JsonValue>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export interface OrganizationJsonLdInput {
  name: string;
  url: string;
  logo?: string | ImageInput;
  description?: string;
  /** Tautan profil resmi (website/media sosial), hanya yang terverifikasi. */
  sameAs?: string[];
  email?: string;
  address?: PostalAddressInput;
}

/** schema.org/Organization — identitas organisasi/brand SUKI Apps. */
export function organizationJsonLd(input: OrganizationJsonLdInput): Record<string, JsonValue> {
  return compact({
    '@context': JSONLD_CONTEXT,
    '@type': 'Organization',
    name: input.name,
    url: input.url,
    logo: input.logo === undefined ? undefined : toImageObject(input.logo),
    description: input.description,
    sameAs: input.sameAs,
    email: input.email,
    address: input.address ? postalAddressJsonLd(input.address) : undefined,
  });
}

export interface WebSiteJsonLdInput {
  name: string;
  url: string;
  alternateName?: string;
  /** Kode bahasa, default "id-ID". */
  inLanguage?: string;
  /** Nama organisasi penerbit situs. */
  publisher?: string;
}

/** schema.org/WebSite — situs web SUKI Apps. */
export function webSiteJsonLd(input: WebSiteJsonLdInput): Record<string, JsonValue> {
  return compact({
    '@context': JSONLD_CONTEXT,
    '@type': 'WebSite',
    name: input.name,
    alternateName: input.alternateName,
    url: input.url,
    inLanguage: input.inLanguage ?? 'id-ID',
    publisher: input.publisher ? { '@type': 'Organization', name: input.publisher } : undefined,
  });
}
