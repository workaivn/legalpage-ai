import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { createCommerceDemoData, createSeedDatabase, demoPassword } from "@/lib/demo-data";
import { defaultBillingSettings, defaultCreditSettings } from "@/lib/demo-data";
import { hashPassword } from "@/lib/security";
import type { AppDatabase } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "legalpage-ai.json");

let writeQueue = Promise.resolve();

export async function readDb(): Promise<AppDatabase> {
  await ensureDb();
  const raw = await fs.readFile(dataFile, "utf8");
  const db = JSON.parse(raw) as AppDatabase;
  const migrated = migrateDb(db);
  if (migrated.changed) {
    await writeDb(migrated.db);
  }
  return migrated.db;
}

export async function writeDb(db: AppDatabase) {
  await fs.mkdir(dataDir, { recursive: true });
  writeQueue = writeQueue.then(() => fs.writeFile(dataFile, JSON.stringify(db, null, 2)));
  await writeQueue;
}

export async function updateDb<T>(updater: (db: AppDatabase) => T | Promise<T>) {
  const db = await readDb();
  const result = await updater(db);
  await writeDb(db);
  return result;
}

async function ensureDb() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    const passwordHash = hashPassword(demoPassword);
    await fs.writeFile(dataFile, JSON.stringify(createSeedDatabase(passwordHash), null, 2));
  }
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
