import { pgTable, text, serial, integer, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  service: true,
  message: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Website content tables for easy customization
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  section: varchar("section", { length: 100 }).notNull(),
  key: varchar("key", { length: 100 }).notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).pick({
  section: true, 
  key: true,
  value: true,
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  order: integer("order").default(0),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).pick({
  title: true,
  description: true,
  imageUrl: true,
  category: true,
  order: true,
  active: true,
});

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export const serviceItems = pgTable("service_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: varchar("price", { length: 100 }).notNull(),
  order: integer("order").default(0),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertServiceItemSchema = createInsertSchema(serviceItems).pick({
  title: true,
  description: true,
  imageUrl: true,
  price: true,
  order: true,
  active: true,
});

export type InsertServiceItem = z.infer<typeof insertServiceItemSchema>;
export type ServiceItem = typeof serviceItems.$inferSelect;
