const fs = require('node:fs');
const path = require('node:path');
const initSqlJs = require('sql.js/dist/sql-asm.js').default;

const dataDir = process.env.VERCEL ? path.join('/tmp', 'sultrakita-data') : path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'sultrakita.sqlite');

let databasePromise;

const schema = `
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'tag',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK(role IN ('buyer','seller','admin')),
    district TEXT NOT NULL DEFAULT 'Kendari',
    is_verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK(price >= 0),
    condition TEXT NOT NULL DEFAULT 'new' CHECK(condition IN ('new','second')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','sold','archived')),
    district TEXT NOT NULL DEFAULT 'Kendari',
    city TEXT NOT NULL DEFAULT 'Kendari',
    province TEXT NOT NULL DEFAULT 'Sulawesi Tenggara',
    image_url TEXT,
    views INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_listings_search ON listings(status, category_id, district, price);
  CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(created_at DESC);
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER,
    user_id INTEGER,
    author_name TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'visible' CHECK(status IN ('visible','pending','hidden')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );
  CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    email TEXT,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','planned','done','dismissed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );
  CREATE TABLE IF NOT EXISTS donation_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    target_amount INTEGER NOT NULL CHECK(target_amount > 0),
    current_amount INTEGER NOT NULL DEFAULT 0 CHECK(current_amount >= 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','paused')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER,
    name TEXT NOT NULL,
    email TEXT,
    amount INTEGER NOT NULL CHECK(amount > 0),
    message TEXT,
    transaction_id TEXT UNIQUE,
    payment_method TEXT,
    payment_provider TEXT,
    provider_reference TEXT,
    refunded_amount INTEGER NOT NULL DEFAULT 0 CHECK(refunded_amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending','success','failed','expired')),
    status TEXT NOT NULL DEFAULT 'pledged' CHECK(status IN ('pledged','confirmed','cancelled')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(campaign_id) REFERENCES donation_campaigns(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS idx_donations_campaign_status ON donations(campaign_id, payment_status);
  CREATE TABLE IF NOT EXISTS donation_refunds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL CHECK(amount > 0),
    reason TEXT,
    provider TEXT NOT NULL,
    provider_reference TEXT,
    status TEXT NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','success','failed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS webhook_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    transaction_id TEXT,
    event_status TEXT,
    http_status INTEGER NOT NULL,
    signature_valid INTEGER NOT NULL DEFAULT 0,
    payload TEXT NOT NULL,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON webhook_logs(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_webhook_logs_transaction ON webhook_logs(transaction_id, created_at DESC);
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER,
    reporter_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','reviewing','resolved','rejected')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_comments_listing ON comments(listing_id, status, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status, created_at DESC);
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user_expiry ON sessions(user_id, expires_at);
  CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
  CREATE TABLE IF NOT EXISTS otp_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER NOT NULL,
    consumed_at INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS seller_verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    document_type TEXT NOT NULL CHECK(document_type IN ('ktp','nib','other')),
    document_reference TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    note TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL CHECK(event_name IN ('page_view','listing_view','search','listing_contact')),
    path TEXT,
    listing_id INTEGER,
    category_slug TEXT,
    district TEXT,
    referrer TEXT,
    user_agent TEXT,
    country_code TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE SET NULL
  );
  CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON analytics_events(event_name, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_analytics_listing ON analytics_events(listing_id, event_name, created_at DESC);
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER,
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(listing_id, buyer_id, seller_id),
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE SET NULL,
    FOREIGN KEY(buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    read_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at ASC);
  CREATE INDEX IF NOT EXISTS idx_verifications_status ON seller_verifications(status, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at DESC);
  CREATE TABLE IF NOT EXISTS listing_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES listings(id) ON DELETE CASCADE
  );
`;

const categories = [
  ['Properti', 'properti', 'home'], ['Elektronik', 'elektronik', 'smartphone'],
  ['Kendaraan', 'kendaraan', 'car'], ['Fashion', 'fashion', 'shirt'],
  ['Perabotan', 'perabotan', 'sofa'], ['Jasa', 'jasa', 'briefcase'],
  ['Kuliner', 'kuliner', 'utensils'], ['Hobi & Koleksi', 'hobi-koleksi', 'camera'],
  ['Lowongan Kerja', 'lowongan-kerja', 'job'], ['Lainnya', 'lainnya', 'tag']
];

async function getDb() {
  if (!databasePromise) {
    databasePromise = initSqlJs().then(SQL => {
      fs.mkdirSync(dataDir, { recursive: true });
      const database = fs.existsSync(dbFile)
        ? new SQL.Database(fs.readFileSync(dbFile))
        : new SQL.Database();
      database.run(schema);
      const donationColumns = database.exec('PRAGMA table_info(donations)')[0]?.values.map(row => row[1]) || [];
      if (!donationColumns.includes('campaign_id')) database.run('ALTER TABLE donations ADD COLUMN campaign_id INTEGER');
      if (!donationColumns.includes('transaction_id')) database.run('ALTER TABLE donations ADD COLUMN transaction_id TEXT');
      if (!donationColumns.includes('payment_method')) database.run('ALTER TABLE donations ADD COLUMN payment_method TEXT');
      if (!donationColumns.includes('payment_status')) database.run("ALTER TABLE donations ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending'");
      if (!donationColumns.includes('payment_provider')) database.run('ALTER TABLE donations ADD COLUMN payment_provider TEXT');
      if (!donationColumns.includes('provider_reference')) database.run('ALTER TABLE donations ADD COLUMN provider_reference TEXT');
      if (!donationColumns.includes('refunded_amount')) database.run('ALTER TABLE donations ADD COLUMN refunded_amount INTEGER NOT NULL DEFAULT 0');
      database.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_donations_transaction_id ON donations(transaction_id) WHERE transaction_id IS NOT NULL');
      database.run('CREATE INDEX IF NOT EXISTS idx_donations_campaign_status ON donations(campaign_id, payment_status)');
      database.run('CREATE INDEX IF NOT EXISTS idx_sessions_user_expiry ON sessions(user_id, expires_at)');
      database.run('CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at)');
      database.run('CREATE INDEX IF NOT EXISTS idx_webhook_logs_created ON webhook_logs(created_at DESC)');
      database.run('CREATE INDEX IF NOT EXISTS idx_webhook_logs_transaction ON webhook_logs(transaction_id, created_at DESC)');
      const campaignCount = database.exec('SELECT COUNT(*) AS count FROM donation_campaigns')[0]?.values[0][0] || 0;
      if (campaignCount === 0) database.run('INSERT INTO donation_campaigns (title, description, target_amount) VALUES (?, ?, ?)', ['Dukung SultraKita', 'Bantu biaya operasional dan pengembangan marketplace lokal Sulawesi Tenggara.', 50000000]);
      const userColumns = database.exec('PRAGMA table_info(users)')[0]?.values.map(row => row[1]) || [];
      if (!userColumns.includes('phone_verified')) database.run("ALTER TABLE users ADD COLUMN phone_verified INTEGER NOT NULL DEFAULT 0");
      if (!userColumns.includes('verification_status')) database.run("ALTER TABLE users ADD COLUMN verification_status TEXT NOT NULL DEFAULT 'unverified'");
      if (!userColumns.includes('verification_note')) database.run('ALTER TABLE users ADD COLUMN verification_note TEXT');
      const count = database.exec('SELECT COUNT(*) AS count FROM categories')[0]?.values[0][0] || 0;
      if (count === 0) {
        const statement = database.prepare('INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)');
        categories.forEach(category => statement.run(category));
        statement.free();
      }
      persist(database);
      return database;
    });
  }
  return databasePromise;
}

function persist(database) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dbFile, Buffer.from(database.export()));
}

async function query(sql, params = []) {
  const database = await getDb();
  const statement = database.prepare(sql);
  statement.bind(params);
  const rows = [];
  while (statement.step()) rows.push(statement.getAsObject());
  statement.free();
  return rows;
}

async function run(sql, params = []) {
  const database = await getDb();
  database.run(sql, params);
  const result = database.exec('SELECT last_insert_rowid() AS id');
  persist(database);
  return { id: result[0]?.values[0][0] || null };
}

module.exports = { getDb, query, run, persist };
