import { pgTable, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  showInitialSetup: boolean("show_initial_setup").default(true),
  status: text("status").notNull().default("disconnected"),
});

export const approvedSenders = pgTable("approved_senders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  domain: text("domain").notNull(),
  active: boolean("active").default(true),
  dateAdded: timestamp("date_added").defaultNow(),
  emailsReceived: integer("emails_received").default(0),
  createdBy: integer("created_by").references(() => users.id),
});

export const filterLogs = pgTable("filter_logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  filterId: integer("filter_id").references(() => approvedSenders.id),
  action: text("action").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertApprovedSenderSchema = createInsertSchema(approvedSenders);
export const selectApprovedSenderSchema = createSelectSchema(approvedSenders);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type ApprovedSender = z.infer<typeof selectApprovedSenderSchema>;
