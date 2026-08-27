/* Optional Supabase browser client. The server remains the source of truth when public config is unavailable. */
(function attachSupabaseClient(global) {
  let configPromise;
  let clientPromise;

  async function readConfig() {
    const inline = global.SULTRA_SUPABASE_CONFIG || {};
    if (inline.url && inline.anonKey) return { url: inline.url, anonKey: inline.anonKey };
    try {
      const response = await fetch('/api/public-config', { headers: { accept: 'application/json' } });
      const body = await response.json().catch(() => ({}));
      const data = body.data || {};
      return data.supabase_url && data.supabase_anon_key
        ? { url: data.supabase_url, anonKey: data.supabase_anon_key }
        : null;
    } catch (error) {
      console.warn('[supabase-config]', error.message);
      return null;
    }
  }

  function getConfig() {
    if (!configPromise) configPromise = readConfig();
    return configPromise;
  }

  async function getClient() {
    if (!clientPromise) {
      clientPromise = getConfig().then(config => {
        const factory = global.supabase?.createClient;
        if (!config || typeof factory !== 'function') return null;
        return factory(config.url, config.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
      });
    }
    return clientPromise;
  }

  async function subscribeNewListings(callback) {
    const client = await getClient();
    if (!client || typeof callback !== 'function') return null;
    const channel = client.channel('new-listings').on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'listings', filter: 'status=eq.active' },
      payload => callback(payload.new)
    );
    channel.subscribe(status => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') console.warn('[supabase-realtime]', status);
    });
    return { unsubscribe: () => client.removeChannel(channel) };
  }

  global.SultraSupabase = { getConfig, getClient, subscribeNewListings };
}(window));
