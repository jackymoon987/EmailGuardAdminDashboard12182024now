import type { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { approvedSenders, filterLogs, users } from "@db/schema";
import { eq } from "drizzle-orm";
import { WebSocketServer } from 'ws';

export function registerRoutes(app: Express) {
  setupAuth(app);

  const wss = new WebSocketServer({ noServer: true });
  
  app.get("/api/filters", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    const filters = await db.select().from(approvedSenders);
    res.json(filters);
  });

  app.post("/api/filters", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    const filter = await db.insert(approvedSenders).values({
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

    // First ensure jack@bulletproofinbox.com is admin
    const jackUser = allUsers.find(u => u.email === 'jack@bulletproofinbox.com');
    if (jackUser && jackUser.role !== 'admin') {
      await db.update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, jackUser.id));
      // Refresh the users list after update
      allUsers = await db.select().from(users);
      console.log('Updated jack@bulletproofinbox.com to admin role');
    }

    // Debug log for current user role
    console.log('Current user role:', req.user.role);

    // Now check admin permission
    if (req.user.role !== 'admin') {
      return res.status(403).send("Unauthorized: Admin access required");
    }
    
    res.json(allUsers);
  });
  app.post("/api/user/onboarding", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    const { firstName, lastName, referralEmail, accountType } = req.body;
    
    try {
      await db.update(users)
        .set({ 
          firstName,
          lastName,
          referralEmail: referralEmail || null,
          accountType: accountType || 'individual',
          role: req.user.role // Preserve existing role
        })
        .where(eq(users.id, req.user.id));
      
      res.json({ 
        message: "User information updated successfully",
        user: {
          ...req.user,
          firstName,
          lastName,
          phoneNumber,
          referralEmail,
          accountType
        }
      });
    } catch (error) {
      console.error('Error updating user information:', error);
      res.status(500).json({ 
        error: "Failed to update user information",
        details: error.message
      });
    }
  });

  app.post("/api/user/preferences", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    // Update user preferences
    const { surveyEmailDefault, evaluatingFolderDefault } = req.body;
    
    try {
      await db.update(users)
        .set({ 
          role: req.user.role, // Preserve existing role
          showInitialSetup: false // Mark setup as complete
        })
        .where(eq(users.id, req.user.id));
      
      res.json({ message: "Preferences updated successfully" });
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).send("Failed to update preferences");
    }
  });


  return wss;
}
