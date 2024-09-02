ALTER TABLE `blog_post_tag` DROP FOREIGN KEY `blog_post_tag_blog_post_id_blog_post_id_fk`;
--> statement-breakpoint
ALTER TABLE `blog_post_technology` DROP FOREIGN KEY `blog_post_technology_blog_post_id_blog_post_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_tag` DROP FOREIGN KEY `project_tag_project_id_project_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_technology` DROP FOREIGN KEY `project_technology_project_id_project_id_fk`;
--> statement-breakpoint
ALTER TABLE `blog_post_tag` ADD CONSTRAINT `blog_post_tag_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_technology` ADD CONSTRAINT `blog_post_technology_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_tag` ADD CONSTRAINT `project_tag_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_technology` ADD CONSTRAINT `project_technology_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE cascade ON UPDATE no action;