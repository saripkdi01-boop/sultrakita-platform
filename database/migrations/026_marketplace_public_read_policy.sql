-- Public marketplace reads are intentionally limited to publishable listings.
-- Seller/admin mutations remain server-authorized and are not opened by this policy.

DROP POLICY IF EXISTS listings_public_read ON public.listings;
CREATE POLICY listings_public_read
  ON public.listings
  FOR SELECT
  TO anon, authenticated
  USING (status IN ('active', 'published'));
