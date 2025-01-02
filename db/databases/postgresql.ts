import {
    pgTable,
    integer,
    varchar,
    text,
    timestamp,
    pgEnum,
    date,
    boolean,
  } from "drizzle-orm/pg-core";
  import { relations, sql } from "drizzle-orm";
  
  export const admin = pgTable("admin", {
    id: varchar("id", {
      length: 255,
    }).primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(), 
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    username: varchar("user_name", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    avatar: varchar("avatar", { length: 255 }),
  });
  
  export const sessionTable = pgTable("session", {
    id: varchar("id", {
      length: 255,
    }).primaryKey(),
    userId: varchar("user_id", {
      length: 255,
    })
      .notNull()
      .references(() => admin.id),
    expiresAt: timestamp("expires_at").notNull(),
  });
  
  export const newsLetterFormEntries = pgTable("news_letter_form_entries", {
    id: integer("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull() 
      .default(sql`CURRENT_TIMESTAMP`),
  });
  
  export const contactFormEntries = pgTable("contact_form_entries", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  });
  
  export const statusEnum = pgEnum("status", ["visible", "invisible"]);
  
  export const blogPost = pgTable("blog_post", {
    id: integer("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    summary: varchar("summary", { length: 255 }).notNull(),
    thumbnail: varchar("thumbnail", { length: 255 }),
    status: statusEnum("status").notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  });
  
  export const blogPostImage = pgTable("blog_post_image", {
    id: integer("id").primaryKey(),
    src: varchar("src", { length: 255 }).notNull(),
    alt: varchar("alt", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    blogPostId: integer("blog_post_id")
      .notNull()
      .references(() => blogPost.id, { onDelete: "cascade" }),
  });
  
  export const tag = pgTable("tag", {
    id: integer("id").primaryKey(),
    value: varchar("value", { length: 255 }).notNull(),
  });
  
  export const blogPostTag = pgTable("blog_post_tag", {
    id: integer("id").primaryKey(),
    blogPostId: integer("blog_post_id")
      .notNull()
      .references(() => blogPost.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  });
  
  export const technology = pgTable("technology", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    icon: varchar("icon", { length: 255 }),
    link: varchar("link", { length: 255 }),
  });
  
  export const blogPostTechnology = pgTable("blog_post_technology", {
    id: integer("id").primaryKey(),
    blogPostId: integer("blog_post_id")
      .notNull()
      .references(() => blogPost.id, { onDelete: "cascade" }),
    technologyId: integer("technology_id")
      .notNull()
      .references(() => technology.id, { onDelete: "cascade" }),
  });
  
  export const project = pgTable("project", {
    id: integer("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    thumbnail: varchar("thumbnail", { length: 255 }),
    startDate: date("start_date"),
    endDate: date("end_date"),
    summary: varchar("summary", { length: 255 }).notNull(),
    githubLink: varchar("github_link", { length: 255 }),
    websiteLink: varchar("website_link", { length: 255 }),
    status: statusEnum("status").notNull(),
    isFeatured: boolean("is_featured").notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  });
  
  export const projectImage = pgTable("project_image", {
    id: integer("id").primaryKey(),
    src: varchar("src", { length: 255 }).notNull(),
    alt: varchar("alt", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    projectId: integer("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
  });
  
  export const projectTag = pgTable("project_tag", {
    id: integer("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  });
  
  export const projectTechnology = pgTable("project_technology", {
    id: integer("id").primaryKey(),
    projectId: integer("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    technologyId: integer("technology_id")
      .notNull()
      .references(() => technology.id, { onDelete: "cascade" }),
  });
  
  // Relations remain the same
  export const blogPostRelations = relations(blogPost, ({ many }) => ({
    tags: many(blogPostTag),
    technologies: many(blogPostTechnology),
    images: many(blogPostImage),
  }));
  
  export const blogPostImageRelations = relations(blogPostImage, ({ one }) => ({
    blogPost: one(blogPost, {
      fields: [blogPostImage.blogPostId],
      references: [blogPost.id],
    }),
  }));
  
  export const tagRelations = relations(tag, ({ many }) => ({
    blogPosts: many(blogPostTag),
    projects: many(projectTag),
  }));
  
  export const technologyRelations = relations(technology, ({ many }) => ({
    blogPosts: many(blogPostTechnology),
    projects: many(projectTechnology),
  }));
  
  export const projectRelations = relations(project, ({ many }) => ({
    tags: many(projectTag),
    technologies: many(projectTechnology),
    images: many(projectImage),
  }));
  
  export const projectImageRelations = relations(projectImage, ({ one }) => ({
    project: one(project, {
      fields: [projectImage.projectId],
      references: [project.id],
    }),
  }));
  
  export const blogPostTagRelations = relations(blogPostTag, ({ one }) => ({
    blogPost: one(blogPost, {
      fields: [blogPostTag.blogPostId],
      references: [blogPost.id],
    }),
    tag: one(tag, {
      fields: [blogPostTag.tagId],
      references: [tag.id],
    }),
  }));
  
  export const blogPostTechnologyRelations = relations(
    blogPostTechnology,
    ({ one }) => ({
      blogPost: one(blogPost, {
        fields: [blogPostTechnology.blogPostId],
        references: [blogPost.id],
      }),
      technology: one(technology, {
        fields: [blogPostTechnology.technologyId],
        references: [technology.id],
      }),
    }),
  );
  
  export const projectTagRelations = relations(projectTag, ({ one }) => ({
    project: one(project, {
      fields: [projectTag.projectId],
      references: [project.id],
    }),
    tag: one(tag, {
      fields: [projectTag.tagId],
      references: [tag.id],
    }),
  }));
  
  export const projectTechnologyRelations = relations(
    projectTechnology,
    ({ one }) => ({
      project: one(project, {
        fields: [projectTechnology.projectId],
        references: [project.id],
      }),
      technology: one(technology, {
        fields: [projectTechnology.technologyId],
        references: [technology.id],
      }),
    }),
  );