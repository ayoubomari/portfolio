CREATE TABLE `admin` (
	`id` varchar(255) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`avatar` varchar(255) NOT NULL,
	CONSTRAINT `admin_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_user_name_unique` UNIQUE(`user_name`)
);
--> statement-breakpoint
CREATE TABLE `blog_post` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`summary` varchar(255) NOT NULL,
	`thumbnail` varchar(255),
	`status` enum('visible','invisible') NOT NULL,
	`author` varchar(255) NOT NULL,
	`date` date NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `blog_post_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_post_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_post_image` (
	`id` int AUTO_INCREMENT NOT NULL,
	`src` varchar(255) NOT NULL,
	`alt` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`blog_post_id` int NOT NULL,
	CONSTRAINT `blog_post_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_post_tag` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blog_post_id` int NOT NULL,
	`tag_id` int NOT NULL,
	CONSTRAINT `blog_post_tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_post_technology` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blog_post_id` int NOT NULL,
	`technology_id` int NOT NULL,
	CONSTRAINT `blog_post_technology_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_form_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`is_featured` boolean NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `contact_form_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news_letter_form_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `news_letter_form_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`thumbnail` varchar(255),
	`start_date` date,
	`end_date` date,
	`summary` varchar(255) NOT NULL,
	`github_link` varchar(255),
	`website_link` varchar(255),
	`status` enum('visible','invisible') NOT NULL,
	`is_featured` boolean NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `project_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `project_image` (
	`id` int AUTO_INCREMENT NOT NULL,
	`src` varchar(255) NOT NULL,
	`alt` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`project_id` int NOT NULL,
	CONSTRAINT `project_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_tag` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`tag_id` int NOT NULL,
	CONSTRAINT `project_tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_technology` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`technology_id` int NOT NULL,
	CONSTRAINT `project_technology_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` int AUTO_INCREMENT NOT NULL,
	`value` varchar(255) NOT NULL,
	CONSTRAINT `tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `technology` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`icon` varchar(255),
	`link` varchar(255),
	CONSTRAINT `technology_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blog_post_image` ADD CONSTRAINT `blog_post_image_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_tag` ADD CONSTRAINT `blog_post_tag_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_tag` ADD CONSTRAINT `blog_post_tag_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_technology` ADD CONSTRAINT `blog_post_technology_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_technology` ADD CONSTRAINT `blog_post_technology_technology_id_technology_id_fk` FOREIGN KEY (`technology_id`) REFERENCES `technology`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_image` ADD CONSTRAINT `project_image_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_tag` ADD CONSTRAINT `project_tag_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_tag` ADD CONSTRAINT `project_tag_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_technology` ADD CONSTRAINT `project_technology_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_technology` ADD CONSTRAINT `project_technology_technology_id_technology_id_fk` FOREIGN KEY (`technology_id`) REFERENCES `technology`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_admin_id_fk` FOREIGN KEY (`user_id`) REFERENCES `admin`(`id`) ON DELETE no action ON UPDATE no action;