import { pgTable, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emailFilters = pgTable("email_filters", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sender: text("sender").notNull(),
  type: text("type").notNull(), // whitelist/blacklist
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  active: boolean("active").default(true),
});

export const filterLogs = pgTable("filter_logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  filterId: integer("filter_id").references(() => emailFilters.id),
  action: text("action").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertFilterSchema = createInsertSchema(emailFilters);
export const selectFilterSchema = createSelectSchema(emailFilters);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type EmailFilter = z.infer<typeof selectFilterSchema>;
