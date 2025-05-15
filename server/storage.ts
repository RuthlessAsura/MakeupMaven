import { 
  users, type User, type InsertUser, 
  contactSubmissions, type ContactSubmission, type InsertContact,
  siteContent, type SiteContent, type InsertSiteContent,
  portfolioItems, type PortfolioItem, type InsertPortfolioItem,
  serviceItems, type ServiceItem, type InsertServiceItem
} from "@shared/schema";
import { db } from './db';
import { eq, and, desc } from 'drizzle-orm';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAdminUsers(): Promise<User[]>;
  
  // Contact form methods
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Site content methods
  getSiteContentByKey(section: string, key: string): Promise<SiteContent | undefined>;
  getSiteContentBySection(section: string): Promise<SiteContent[]>;
  updateSiteContent(id: number, value: string): Promise<SiteContent | undefined>;
  createSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  
  // Portfolio methods
  getAllPortfolioItems(): Promise<PortfolioItem[]>;
  getActivePortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]>;
  getPortfolioItemById(id: number): Promise<PortfolioItem | undefined>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;
  
  // Service methods
  getAllServiceItems(): Promise<ServiceItem[]>;
  getActiveServiceItems(): Promise<ServiceItem[]>;
  getServiceItemById(id: number): Promise<ServiceItem | undefined>;
  createServiceItem(item: InsertServiceItem): Promise<ServiceItem>;
  updateServiceItem(id: number, item: Partial<InsertServiceItem>): Promise<ServiceItem | undefined>;
  deleteServiceItem(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Contact form methods
  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(insertContact).returning();
    return result[0];
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
  
  // Site content methods
  async getSiteContentByKey(section: string, key: string): Promise<SiteContent | undefined> {
    const result = await db.select().from(siteContent).where(
      and(
        eq(siteContent.section, section),
        eq(siteContent.key, key)
      )
    );
    return result[0];
  }
  
  async getSiteContentBySection(section: string): Promise<SiteContent[]> {
    return await db.select().from(siteContent).where(eq(siteContent.section, section));
  }
  
  async updateSiteContent(id: number, value: string): Promise<SiteContent | undefined> {
    const result = await db.update(siteContent)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteContent.id, id))
      .returning();
    return result[0];
  }
  
  async createSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const result = await db.insert(siteContent).values(content).returning();
    return result[0];
  }
  
  // Portfolio methods
  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).orderBy(portfolioItems.order);
  }
  
  async getActivePortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems)
      .where(eq(portfolioItems.active, true))
      .orderBy(portfolioItems.order);
  }
  
  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems)
      .where(
        and(
          eq(portfolioItems.active, true),
          eq(portfolioItems.category, category)
        )
      )
      .orderBy(portfolioItems.order);
  }
  
  async getPortfolioItemById(id: number): Promise<PortfolioItem | undefined> {
    const result = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return result[0];
  }
  
  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const result = await db.insert(portfolioItems).values(item).returning();
    return result[0];
  }
  
  async updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const result = await db.update(portfolioItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(portfolioItems.id, id))
      .returning();
    return result[0];
  }
  
  async deletePortfolioItem(id: number): Promise<boolean> {
    const result = await db.delete(portfolioItems).where(eq(portfolioItems.id, id)).returning();
    return result.length > 0;
  }
  
  // Service methods
  async getAllServiceItems(): Promise<ServiceItem[]> {
    return await db.select().from(serviceItems).orderBy(serviceItems.order);
  }
  
  async getActiveServiceItems(): Promise<ServiceItem[]> {
    return await db.select().from(serviceItems)
      .where(eq(serviceItems.active, true))
      .orderBy(serviceItems.order);
  }
  
  async getServiceItemById(id: number): Promise<ServiceItem | undefined> {
    const result = await db.select().from(serviceItems).where(eq(serviceItems.id, id));
    return result[0];
  }
  
  async createServiceItem(item: InsertServiceItem): Promise<ServiceItem> {
    const result = await db.insert(serviceItems).values(item).returning();
    return result[0];
  }
  
  async updateServiceItem(id: number, item: Partial<InsertServiceItem>): Promise<ServiceItem | undefined> {
    const result = await db.update(serviceItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(serviceItems.id, id))
      .returning();
    return result[0];
  }
  
  async deleteServiceItem(id: number): Promise<boolean> {
    const result = await db.delete(serviceItems).where(eq(serviceItems.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
