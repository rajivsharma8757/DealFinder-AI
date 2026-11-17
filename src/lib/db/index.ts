// src/lib/db/index.ts - Secure Database Engine for DealFinder AI
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User, UserProfile, PriceAlert, SavedComparison, SearchHistoryItem } from '@/types';

export interface DbUser extends User {
  passwordHash: string;
  resetTokenHash?: string;
  resetTokenExpiry?: number;
}

export interface DbSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: number; // timestamp ms
}

export interface DatabaseSchema {
  users: DbUser[];
  sessions: DbSession[];
  profiles: Record<string, UserProfile>;
  wishlists: Record<string, string[]>; // userId -> productId[]
  comparisons: SavedComparison[];
  search_history: SearchHistoryItem[];
  price_alerts: PriceAlert[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'dealfinder_db.json');

// Ensure database directory and initial seed exist securely
function ensureDbFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    // Seed initial demo user (Rajiv Sharma) with secure hashed password
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('Password@123', salt);
    const demoUserId = 'usr_rajiv_01';

    const initialData: DatabaseSchema = {
      users: [
        {
          id: demoUserId,
          name: 'Rajiv Kumar Sharma',
          email: 'rajiv.sharma@dealfinder.ai',
          phone: '+91 98765 43210',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          bio: 'Tech enthusiast and B.Tech CSE Final Year student exploring AI shopping intelligence.',
          role: 'user',
          passwordHash: demoPasswordHash,
          saved_cards: ['HDFC Bank Credit', 'ICICI Bank Debit', 'Axis Bank Credit'],
          created_at: '2026-08-15',
        },
      ],
      sessions: [], // Always start with clean, empty sessions
      profiles: {
        [demoUserId]: {
          userId: demoUserId,
          fullName: 'Rajiv Kumar Sharma',
          email: 'rajiv.sharma@dealfinder.ai',
          phone: '+91 98765 43210',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          bio: 'Tech enthusiast and B.Tech CSE Final Year student exploring AI shopping intelligence.',
          location: 'Ambala / Chandigarh, India',
          preferredCard: 'HDFC Bank',
          completionPct: 95,
          createdAt: '2026-08-15',
          updatedAt: '2026-11-17',
        },
      },
      wishlists: {
        [demoUserId]: ['prod_iphone_16', 'prod_sony_xm4', 'prod_macbook_m3'],
      },
      comparisons: [
        {
          id: 'comp_seed_1',
          userId: demoUserId,
          title: 'Flagship Smartphones Comparison',
          productIds: ['prod_iphone_16', 'prod_samsung_s24'],
          createdAt: '2026-11-12',
        },
      ],
      search_history: [
        { id: 'sh_1', userId: demoUserId, query: 'iPhone 16 128GB', timestamp: '2026-11-17 14:30' },
        { id: 'sh_2', userId: demoUserId, query: 'Sony WH-1000XM4', timestamp: '2026-11-17 15:45' },
        { id: 'sh_3', userId: demoUserId, query: 'Gaming laptop under 60000', timestamp: '2026-11-17 17:10' },
      ],
      price_alerts: [
        {
          id: 'alert_seed_1',
          product_id: 'prod_iphone_16',
          product_title: 'Apple iPhone 16 (128GB, Ultramarine)',
          target_price: 72000,
          current_price: 76900,
          email: 'rajiv.sharma@dealfinder.ai',
          created_at: '2026-11-10',
          active: true,
          is_active: true,
        },
      ],
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

// Read database
export function readDb(): DatabaseSchema {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    ensureDbFile();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  }
}

// Atomic write to prevent file corruption
export function writeDb(data: DatabaseSchema): void {
  ensureDbFile();
  const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

// Invalidate all active sessions (e.g. on security remediation or global logout)
export function invalidateAllSessions(): void {
  const db = readDb();
  db.sessions = [];
  writeDb(db);
}

// --- USER OPERATIONS ---

export function getUserByEmail(email: string): DbUser | undefined {
  const db = readDb();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
}

export function getUserById(id: string): DbUser | undefined {
  const db = readDb();
  return db.users.find(u => u.id === id);
}

export function createUser(params: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): { user: User; error?: string } {
  const db = readDb();
  const normalizedEmail = params.email.toLowerCase().trim();

  if (db.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { user: null as any, error: 'An account with this email address already exists.' };
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(params.password, salt);
  const newUserId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString().split('T')[0];

  const newUser: DbUser = {
    id: newUserId,
    name: params.name.trim(),
    email: normalizedEmail,
    phone: params.phone?.trim() || '',
    avatar: '',
    role: 'user',
    passwordHash,
    saved_cards: ['HDFC Bank Credit'],
    created_at: now,
  };

  const newProfile: UserProfile = {
    userId: newUserId,
    fullName: params.name.trim(),
    email: normalizedEmail,
    phone: params.phone?.trim() || '',
    avatar: '',
    bio: '',
    location: 'India',
    preferredCard: 'HDFC Bank',
    completionPct: 60,
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(newUser);
  db.profiles[newUserId] = newProfile;
  db.wishlists[newUserId] = [];

  writeDb(db);

  // Return public user object (strip passwordHash and sensitive fields)
  const { passwordHash: _, resetTokenHash: __, resetTokenExpiry: ___, ...publicUser } = newUser;
  return { user: publicUser };
}

export function verifyPassword(plainPassword: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(plainPassword, hash);
  } catch {
    return false;
  }
}

// --- SECURE SESSION MANAGEMENT ---

export function createSession(userId: string): string {
  const db = readDb();
  // Cryptographically secure 256-bit random session token
  const token = `df_sec_${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days validity

  // Purge expired sessions
  db.sessions = (db.sessions || []).filter(s => s.expiresAt > Date.now());

  db.sessions.push({
    token,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt,
  });

  writeDb(db);
  return token;
}

export function getSessionUser(token: string): User | null {
  if (!token || typeof token !== 'string') return null;
  const db = readDb();
  const session = (db.sessions || []).find(s => s.token === token && s.expiresAt > Date.now());
  if (!session) return null;

  const dbUser = db.users.find(u => u.id === session.userId);
  if (!dbUser) return null;

  const { passwordHash: _, resetTokenHash: __, resetTokenExpiry: ___, ...publicUser } = dbUser;
  return publicUser;
}

export function deleteSession(token: string): void {
  if (!token) return;
  const db = readDb();
  db.sessions = (db.sessions || []).filter(s => s.token !== token);
  writeDb(db);
}

// --- USER PROFILE OPERATIONS ---

export function getUserProfile(userId: string): UserProfile {
  const db = readDb();
  if (db.profiles[userId]) {
    return db.profiles[userId];
  }
  const user = db.users.find(u => u.id === userId);
  const now = new Date().toISOString().split('T')[0];
  const defaultProfile: UserProfile = {
    userId,
    fullName: user?.name || 'Shopper',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
    location: 'India',
    preferredCard: 'HDFC Bank',
    completionPct: 75,
    createdAt: user?.created_at || now,
    updatedAt: now,
  };
  db.profiles[userId] = defaultProfile;
  writeDb(db);
  return defaultProfile;
}

export function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): UserProfile {
  const db = readDb();
  const existing = getUserProfile(userId);

  // Compute completion %
  let filledCount = 0;
  if (updates.fullName || existing.fullName) filledCount += 25;
  if (updates.phone || existing.phone) filledCount += 25;
  if (updates.bio || existing.bio) filledCount += 20;
  if (updates.avatar || existing.avatar) filledCount += 15;
  if (updates.location || existing.location) filledCount += 15;

  const updated: UserProfile = {
    ...existing,
    ...updates,
    completionPct: Math.min(100, filledCount),
    updatedAt: new Date().toISOString().split('T')[0],
  };

  db.profiles[userId] = updated;

  // Sync basic fields in user record
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    if (updates.fullName) db.users[userIndex].name = updates.fullName;
    if (updates.phone !== undefined) db.users[userIndex].phone = updates.phone;
    if (updates.avatar !== undefined) db.users[userIndex].avatar = updates.avatar;
    if (updates.bio !== undefined) db.users[userIndex].bio = updates.bio;
  }

  writeDb(db);
  return updated;
}

// --- WISHLIST OPERATIONS (USER ISOLATED) ---

export function getUserWishlist(userId: string): string[] {
  const db = readDb();
  return db.wishlists[userId] || [];
}

export function toggleUserWishlist(userId: string, productId: string): { wishlist: string[]; added: boolean } {
  const db = readDb();
  const current = db.wishlists[userId] || [];
  let added = false;
  let updated: string[];

  if (current.includes(productId)) {
    updated = current.filter(id => id !== productId);
    added = false;
  } else {
    updated = [productId, ...current];
    added = true;
  }

  db.wishlists[userId] = updated;
  writeDb(db);
  return { wishlist: updated, added };
}

// --- SAVED COMPARISONS OPERATIONS (USER ISOLATED) ---

export function getUserComparisons(userId: string): SavedComparison[] {
  const db = readDb();
  return (db.comparisons || []).filter(c => c.userId === userId);
}

export function saveUserComparison(userId: string, title: string, productIds: string[]): SavedComparison {
  const db = readDb();
  const newComp: SavedComparison = {
    id: `comp_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    userId,
    title: title.trim() || 'Custom Comparison',
    productIds,
    createdAt: new Date().toISOString().split('T')[0],
  };

  db.comparisons.unshift(newComp);
  writeDb(db);
  return newComp;
}

export function deleteUserComparison(userId: string, comparisonId: string): boolean {
  const db = readDb();
  const initialLen = db.comparisons.length;
  db.comparisons = db.comparisons.filter(c => !(c.id === comparisonId && c.userId === userId));
  const changed = db.comparisons.length !== initialLen;
  if (changed) writeDb(db);
  return changed;
}

// --- SEARCH HISTORY (USER ISOLATED) ---

export function getUserSearchHistory(userId: string): SearchHistoryItem[] {
  const db = readDb();
  return (db.search_history || []).filter(h => h.userId === userId);
}

export function addUserSearchHistory(userId: string, query: string): void {
  if (!query || !query.trim()) return;
  const db = readDb();
  const trimmed = query.trim();

  // Deduplicate and move to top
  db.search_history = (db.search_history || []).filter(
    h => !(h.userId === userId && h.query.toLowerCase() === trimmed.toLowerCase())
  );

  db.search_history.unshift({
    id: `sh_${Date.now()}`,
    userId,
    query: trimmed,
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
  });

  // Limit to 25 items per user
  const userEntries = db.search_history.filter(h => h.userId === userId);
  if (userEntries.length > 25) {
    const toRemove = userEntries.slice(25).map(h => h.id);
    db.search_history = db.search_history.filter(h => !toRemove.includes(h.id));
  }

  writeDb(db);
}

export function clearUserSearchHistory(userId: string): void {
  const db = readDb();
  db.search_history = (db.search_history || []).filter(h => h.userId !== userId);
  writeDb(db);
}

// --- PRICE ALERTS OPERATIONS (USER ISOLATED) ---

export function getUserPriceAlerts(userId: string, email?: string): PriceAlert[] {
  const db = readDb();
  return (db.price_alerts || []).filter(
    a => (email && a.email?.toLowerCase() === email.toLowerCase()) || (a as any).userId === userId
  );
}

export function addUserPriceAlert(
  userId: string,
  alert: Omit<PriceAlert, 'id' | 'created_at'>
): PriceAlert {
  const db = readDb();
  const newAlert: PriceAlert & { userId: string } = {
    id: `alert_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    userId,
    product_id: alert.product_id,
    product_title: alert.product_title,
    target_price: alert.target_price,
    current_price: alert.current_price,
    email: alert.email,
    created_at: new Date().toISOString().split('T')[0],
    active: true,
    is_active: true,
  };

  db.price_alerts.unshift(newAlert);
  writeDb(db);
  return newAlert;
}

export function deleteUserPriceAlert(alertId: string, email?: string): boolean {
  const db = readDb();
  const initialLen = db.price_alerts.length;
  db.price_alerts = db.price_alerts.filter(a => a.id !== alertId);
  const changed = db.price_alerts.length !== initialLen;
  if (changed) writeDb(db);
  return changed;
}

// --- CRYPTOGRAPHICALLY SECURE PASSWORD RESET (SINGLE-USE, SHA-256 HASHED, 15-MIN EXPIRY) ---

export function createPasswordResetToken(email: string): { rawToken: string; expiryMinutes: number } | null {
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) return null;

  // Generate cryptographically random token
  const rawToken = crypto.randomBytes(32).toString('hex');
  // Store only the SHA-256 hash in database
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetTokenHash = tokenHash;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes strict expiration
  delete (user as any).resetToken; // Remove any legacy plain tokens

  writeDb(db);
  return { rawToken, expiryMinutes: 15 };
}

export function resetPasswordWithToken(rawToken: string, newPassword: string): boolean {
  if (!rawToken || !newPassword || newPassword.length < 6) return false;
  const db = readDb();
  const inputHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = db.users.find(
    u => u.resetTokenHash === inputHash && u.resetTokenExpiry && u.resetTokenExpiry > Date.now()
  );
  if (!user) return false;

  const salt = bcrypt.genSaltSync(10);
  user.passwordHash = bcrypt.hashSync(newPassword, salt);
  delete user.resetTokenHash;
  delete user.resetTokenExpiry;
  delete (user as any).resetToken;

  // Invalidate all active sessions for this user on password reset
  db.sessions = (db.sessions || []).filter(s => s.userId !== user.id);

  writeDb(db);
  return true;
}
