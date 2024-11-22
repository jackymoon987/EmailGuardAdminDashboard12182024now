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
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    if (req.user.role !== 'admin') {
      return res.status(403).send("Unauthorized: Admin access required");
    }
    
    let allUsers = await db.select().from(users);
    
    // If no users exist, create sample users
    if (allUsers.length === 0) {
      const { hash } = await import('./auth');
      const defaultPassword = await hash('password123');
      
      const sampleUsers = [
        {
          firstName: "Admin",
          lastName: "User",
          email: "admin@bulletproofinbox.com",
          password: defaultPassword,
          role: "admin",
          createdAt: new Date("2024-01-01")
        },
        {
          firstName: "John",
          lastName: "Smith",
          email: "john@company.com",
          password: defaultPassword,
          role: "user",
          createdAt: new Date("2024-02-15")
        },
        {
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah@company.com",
          password: defaultPassword,
          role: "editor",
          createdAt: new Date("2024-03-01")
        }
      ];
      
      await db.insert(users).values(sampleUsers);
      allUsers = await db.select().from(users);
    }

    // Ensure jack@bulletproofinbox.com is admin
    const jackUser = allUsers.find(u => u.email === 'jack@bulletproofinbox.com');
    if (jackUser && jackUser.role !== 'admin') {
      await db.update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, jackUser.id));
      allUsers = await db.select().from(users);
    }
    
    res.json(allUsers);
  });

  return wss;
}
