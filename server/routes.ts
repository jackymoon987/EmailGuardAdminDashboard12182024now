import type { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { emailFilters, filterLogs, users } from "@db/schema";
import { eq } from "drizzle-orm";
import { WebSocketServer } from 'ws';

export function registerRoutes(app: Express) {
  setupAuth(app);

  const wss = new WebSocketServer({ noServer: true });
  
  app.get("/api/filters", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    const filters = await db.select().from(emailFilters);
    res.json(filters);
  });

  app.post("/api/filters", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    const filter = await db.insert(emailFilters).values({
      ...req.body,
      createdBy: req.user.id,
    }).returning();
    
    wss.clients.forEach(client => {
      client.send(JSON.stringify({ type: 'FILTER_UPDATE' }));
    });
    
    res.json(filter);
  });

  app.get("/api/analytics", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    const logs = await db.select().from(filterLogs);
    res.json(logs);
  });

  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(401).send("Not authorized");
    }
    
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  });

  return wss;
}
