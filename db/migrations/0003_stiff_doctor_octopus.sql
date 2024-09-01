ALTER TABLE `blog_post_tag` DROP FOREIGN KEY `blog_post_tag_tag_id_tag_id_fk`;
--> statement-breakpoint
ALTER TABLE `blog_post_technology` DROP FOREIGN KEY `blog_post_technology_technology_id_technology_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_tag` DROP FOREIGN KEY `project_tag_tag_id_tag_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_technology` DROP FOREIGN KEY `project_technology_technology_id_technology_id_fk`;
--> statement-breakpoint
ALTER TABLE `contact_form_entries` MODIFY COLUMN `phone_number` varchar(20);--> statement-breakpoint
ALTER TABLE `blog_post_tag` ADD CONSTRAINT `blog_post_tag_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_technology` ADD CONSTRAINT `blog_post_technology_technology_id_technology_id_fk` FOREIGN KEY (`technology_id`) REFERENCES `technology`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_tag` ADD CONSTRAINT `project_tag_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_technology` ADD CONSTRAINT `project_technology_technology_id_technology_id_fk` FOREIGN KEY (`technology_id`) REFERENCES `technology`(`id`) ON DELETE cascade ON UPDATE no action;