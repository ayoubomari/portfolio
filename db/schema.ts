import {
  mysqlTable,
  int,
  varchar,
  text,
  datetime,
  mysqlEnum,
  date,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const admin = mysqlTable("admin", {
  id: int("id").primaryKey().autoincrement().notNull(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }).notNull(),
});

export const newsLetterFormEntries = mysqlTable("news_letter_form_entries", {
  id: int("id").primaryKey().autoincrement().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: datetime("createdAt").notNull(),
});

export const contactFormEntries = mysqlTable("contact_form_entries", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: datetime("createdAt").notNull(),
});

export const blogPost = mysqlTable("blog_post", {
  id: int("id").primaryKey().autoincrement().notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: varchar("summary", { length: 255 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 255 }),
  status: mysqlEnum("status", ["visible", "invisible"]).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  date: date("date").notNull(),
  createdAt: datetime("createdAt").notNull(),
});

export const tag = mysqlTable("tag", {
  id: int("id").primaryKey().autoincrement().notNull(),
  value: varchar("value", { length: 255 }).notNull(),
});

export const blogPostTag = mysqlTable("blog_post_tag", {
  id: int("id").primaryKey().autoincrement().notNull(),
  blogPostId: int("blog_post_id")
    .notNull()
    .references(() => blogPost.id),
  tagId: int("tag_id")
    .notNull()
    .references(() => tag.id),
});

export const technologie = mysqlTable("technologie", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }),
  link: varchar("link", { length: 255 }),
});

export const blogPostTechnologie = mysqlTable("blog_post_technologie", {
  id: int("id").primaryKey().autoincrement().notNull(),
  blogPostId: int("blog_post_id")
    .notNull()
    .references(() => blogPost.id),
  technologieId: int("technologie_id")
    .notNull()
    .references(() => technologie.id),
});

export const project = mysqlTable("project", {
  id: int("id").primaryKey().autoincrement().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  thumbnail: varchar("thumbnail", { length: 255 }),
  startDate: date("startDate"),
  endDate: date("endDate"),
  summary: varchar("summary", { length: 255 }).notNull(),
  githubLink: varchar("githubLink", { length: 255 }),
  websiteLink: varchar("websiteLink", { length: 255 }),
  status: mysqlEnum("status", ["visible", "invisible"]).notNull(),
  isFeatured: boolean("isFeatured").notNull(),
  createdAt: datetime("createdAt").notNull(),
});

export const projectTag = mysqlTable("project_tag", {
  id: int("id").primaryKey().autoincrement().notNull(),
  projectId: int("project_id")
    .notNull()
    .references(() => project.id),
  tagId: int("tag_id")
    .notNull()
    .references(() => tag.id),
});

export const projectTechnologie = mysqlTable("project_technologie", {
  id: int("id").primaryKey().autoincrement().notNull(),
  projectId: int("project_id")
    .notNull()
    .references(() => project.id),
  technologieId: int("technologie_id")
    .notNull()
    .references(() => technologie.id),
});

// Relations
export const blogPostRelations = relations(blogPost, ({ many }) => ({
  tags: many(blogPostTag),
  technologies: many(blogPostTechnologie),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  blogPosts: many(blogPostTag),
  projects: many(projectTag),
}));

export const technologieRelations = relations(technologie, ({ many }) => ({
  blogPosts: many(blogPostTechnologie),
  projects: many(projectTechnologie),
}));

export const projectRelations = relations(project, ({ many }) => ({
  tags: many(projectTag),
  technologies: many(projectTechnologie),
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

export const blogPostTechnologieRelations = relations(
  blogPostTechnologie,
  ({ one }) => ({
    blogPost: one(blogPost, {
      fields: [blogPostTechnologie.blogPostId],
      references: [blogPost.id],
    }),
    technologie: one(technologie, {
      fields: [blogPostTechnologie.technologieId],
      references: [technologie.id],
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

export const projectTechnologieRelations = relations(
  projectTechnologie,
  ({ one }) => ({
    project: one(project, {
      fields: [projectTechnologie.projectId],
      references: [project.id],
    }),
    technologie: one(technologie, {
      fields: [projectTechnologie.technologieId],
      references: [technologie.id],
    }),
  }),
);
