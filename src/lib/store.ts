import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { createCommerceDemoData, createSeedDatabase, demoPassword, defaultBillingSettings, defaultCreditSettings } from "@/lib/demo-data";
import { hashPassword } from "@/lib/security";
import type { AppDatabase } from "@/lib/types";

export interface StorageProvider {
  read(): Promise<AppDatabase>;
  write(db: AppDatabase): Promise<void>;
}

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "legalpage-ai.json");

let writeQueue = Promise.resolve();
let memoryDatabase: AppDatabase | null = null;

export class FileStorageProvider implements StorageProvider {
  async read() {
    await this.ensureDb();
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as AppDatabase;
  }

  async write(db: AppDatabase) {
    await fs.mkdir(dataDir, { recursive: true });
    writeQueue = writeQueue.then(() => fs.writeFile(dataFile, JSON.stringify(db, null, 2)));
    await writeQueue;
  }

  private async ensureDb() {
    try {
      await fs.access(dataFile);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(dataFile, JSON.stringify(createFreshDatabase(), null, 2));
    }
  }
}

export class MemoryStorageProvider implements StorageProvider {
  async read() {
    if (!memoryDatabase) {
      memoryDatabase = createFreshDatabase();
    }

    return memoryDatabase;
  }

  async write(db: AppDatabase) {
    memoryDatabase = db;
  }
}

export function isVercelDemoMode() {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
}

export function getStorageProvider(): StorageProvider {
  return isVercelDemoMode() ? new MemoryStorageProvider() : new FileStorageProvider();
}

export async function readDb(): Promise<AppDatabase> {
  const provider = getStorageProvider();
  const db = await provider.read();
  const migrated = migrateDb(db);

  if (migrated.changed) {
    await provider.write(migrated.db);
  }

  return migrated.db;
}

export async function writeDb(db: AppDatabase) {
  await getStorageProvider().write(db);
}

export async function updateDb<T>(updater: (db: AppDatabase) => T | Promise<T>) {
  const provider = getStorageProvider();
  const db = await readDb();
  const result = await updater(db);
  await provider.write(db);
  return result;
}

function createFreshDatabase() {
  return createSeedDatabase(hashPassword(demoPassword));
}

function migrateDb(db: AppDatabase): { db: AppDatabase; changed: boolean } {
  let changed = false;
  const assign = <K extends keyof AppDatabase>(key: K, value: AppDatabase[K]) => {
    if (db[key] === undefined) {
      db[key] = value;
      changed = true;
    }
  };

  assign("subscriptions", []);
  assign("invoices", []);
  assign("creditTransactions", []);
  assign("teams", []);
  assign("teamMembers", []);
  assign("coupons", []);
  assign("referrals", []);
  assign("affiliatePayouts", []);
  assign("whiteLabels", []);
  assign("onboardingProfiles", []);
  assign("billingSettings", defaultBillingSettings);
  assign("creditSettings", defaultCreditSettings);
  assign("emailLogs", []);
  assign("auditLogs", []);

  for (const user of db.users) {
    if (!user.referralCode) {
      user.referralCode = user.id.replace("usr_", "ref_");
      changed = true;
    }
  }

  if (db.subscriptions.length === 0 && db.invoices.length === 0 && db.users.some((user) => user.id === "usr_demo")) {
    const commerce = createCommerceDemoData();
    db.subscriptions = commerce.subscriptions;
    db.invoices = commerce.invoices;
    db.creditTransactions = commerce.creditTransactions;
    db.teams = commerce.teams;
    db.teamMembers = commerce.teamMembers;
    db.coupons = commerce.coupons;
    db.referrals = commerce.referrals;
    db.affiliatePayouts = commerce.affiliatePayouts;
    db.whiteLabels = commerce.whiteLabels;
    db.onboardingProfiles = commerce.onboardingProfiles;
    db.emailLogs = commerce.emailLogs;
    db.auditLogs = [...commerce.auditLogs, ...db.auditLogs];
    changed = true;
  }

  return { db, changed };
}
