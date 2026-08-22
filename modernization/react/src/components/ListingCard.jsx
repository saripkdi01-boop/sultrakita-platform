import PropTypes from 'prop-types';

const formatRupiah = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(value);

export function ListingCard({ listing, onOpen, onToggleFavorite, isFavorite = false }) {
  const video = listing.videos?.[0];
  const image = video?.thumbnail_url || listing.thumbnail_url;

  return (
    <article className="group flex min-h-[320px] flex-col overflow-hidden bg-[#F5F5DC] text-stone-900 transition-transform duration-200 hover:-translate-y-1 dark:bg-stone-900 dark:text-stone-100">
      <button
        type="button"
        onClick={() => onOpen(listing.id)}
        className="relative block h-[190px] w-full overflow-hidden bg-stone-200 text-left dark:bg-stone-800"
        aria-label={`Buka listing ${listing.title}`}
      >
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-[190px] w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-[190px] items-center justify-center text-sm text-stone-500 dark:text-stone-400">
            Belum ada foto
          </div>
        )}
        {video && (
          <span className="absolute left-3 top-3 bg-black/75 px-2 py-1 text-xs font-medium text-white">
            Video pendek
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#96751f] dark:text-[#E2C35A]">
              {listing.category_name || 'Marketplace'}
            </p>
            <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug">
              {listing.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onToggleFavorite(listing.id)}
            className="shrink-0 p-1 text-xl text-[#96751f] transition-transform duration-150 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] dark:text-[#E2C35A]"
            aria-label={isFavorite ? `Hapus ${listing.title} dari favorit` : `Simpan ${listing.title} ke favorit`}
            aria-pressed={isFavorite}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>

        <p className="text-lg font-bold text-[#80651d] dark:text-[#E2C35A]">
          {formatRupiah(listing.price)}
        </p>
        <p className="mt-auto text-sm text-stone-600 dark:text-stone-400">
          {listing.district || 'Kendari'} · {listing.seller_name || 'Penjual lokal'}
        </p>
      </div>
    </article>
  );
}

ListingCard.propTypes = {
  listing: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category_name: PropTypes.string,
    district: PropTypes.string,
    seller_name: PropTypes.string,
    thumbnail_url: PropTypes.string,
    videos: PropTypes.arrayOf(PropTypes.shape({ thumbnail_url: PropTypes.string })),
  }).isRequired,
  onOpen: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool,
};
