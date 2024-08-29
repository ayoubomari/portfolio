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
import { relations, sql } from "drizzle-orm";

export const admin = mysqlTable("admin", {
  id: varchar("id", {
		length: 255
	}).primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  username: varchar("user_name", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }).notNull(),
});

export const sessionTable = mysqlTable("session", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 255
	})
		.notNull()
		.references(() => admin.id),
	expiresAt: datetime("expires_at").notNull()
});



export const newsLetterFormEntries = mysqlTable("news_letter_form_entries", {
  id: int("id").primaryKey().autoincrement().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contactFormEntries = mysqlTable("contact_form_entries", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
  createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const blogPostImage = mysqlTable("blog_post_image", {
  id: int("id").primaryKey().autoincrement().notNull(),
  src: varchar("src", { length: 255 }).notNull(),
  alt: varchar("alt", { length: 255 }).notNull(),
  createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  blogPostId: int("blog_post_id")
    .notNull()
    .references(() => blogPost.id, { onDelete: "cascade" }),
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

export const technology = mysqlTable("technology", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }),
  link: varchar("link", { length: 255 }),
});

export const blogPostTechnology = mysqlTable("blog_post_technology", {
  id: int("id").primaryKey().autoincrement().notNull(),
  blogPostId: int("blog_post_id")
    .notNull()
    .references(() => blogPost.id),
  technologyId: int("technology_id")
    .notNull()
    .references(() => technology.id),
});

export const project = mysqlTable("project", {
  id: int("id").primaryKey().autoincrement().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  thumbnail: varchar("thumbnail", { length: 255 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  summary: varchar("summary", { length: 255 }).notNull(),
  githubLink: varchar("github_link", { length: 255 }),
  websiteLink: varchar("website_link", { length: 255 }),
  status: mysqlEnum("status", ["visible", "invisible"]).notNull(),
  isFeatured: boolean("is_featured").notNull(),
  createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const projectImage = mysqlTable("project_image", {
  id: int("id").primaryKey().autoincrement().notNull(),
  src: varchar("src", { length: 255 }).notNull(),
  alt: varchar("alt", { length: 255 }).notNull(),
  createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  projectId: int("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
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

export const projectTechnology = mysqlTable("project_technology", {
  id: int("id").primaryKey().autoincrement().notNull(),
  projectId: int("project_id")
    .notNull()
    .references(() => project.id),
  technologyId: int("technology_id")
    .notNull()
    .references(() => technology.id),
});

// Relations
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
