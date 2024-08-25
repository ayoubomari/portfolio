CREATE TABLE `blog_post_technology` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blog_post_id` int NOT NULL,
	`technology_id` int NOT NULL,
	CONSTRAINT `blog_post_technology_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_technology` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`technology_id` int NOT NULL,
	CONSTRAINT `project_technology_id` PRIMARY KEY(`id`)
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
DROP TABLE `blog_post_technologie`;--> statement-breakpoint
DROP TABLE `project_technologie`;--> statement-breakpoint
DROP TABLE `technologie`;--> statement-breakpoint
ALTER TABLE `blog_post_image` DROP FOREIGN KEY `blog_post_image_blog_post_id_blog_post_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_image` DROP FOREIGN KEY `project_image_project_id_project_id_fk`;
--> statement-breakpoint
ALTER TABLE `admin` ADD `first_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `admin` ADD `last_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `admin` ADD `phone_number` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_post` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_post` ADD `updated_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_post_image` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_post_image` ADD `updated_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `contact_form_entries` ADD `is_featured` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `contact_form_entries` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `contact_form_entries` ADD `updated_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `news_letter_form_entries` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `news_letter_form_entries` ADD `updated_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `project` ADD `start_date` date;--> statement-breakpoint
ALTER TABLE `project` ADD `end_date` date;--> statement-breakpoint
ALTER TABLE `project` ADD `github_link` varchar(255);--> statement-breakpoint
ALTER TABLE `project` ADD `website_link` varchar(255);--> statement-breakpoint
ALTER TABLE `project` ADD `is_featured` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `project` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `project` ADD `updated_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `project_image` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `project_image` ADD `updated_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_post_technology` ADD CONSTRAINT `blog_post_technology_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_technology` ADD CONSTRAINT `blog_post_technology_technology_id_technology_id_fk` FOREIGN KEY (`technology_id`) REFERENCES `technology`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_technology` ADD CONSTRAINT `project_technology_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_technology` ADD CONSTRAINT `project_technology_technology_id_technology_id_fk` FOREIGN KEY (`technology_id`) REFERENCES `technology`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_image` ADD CONSTRAINT `blog_post_image_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_image` ADD CONSTRAINT `project_image_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin` DROP COLUMN `firstName`;--> statement-breakpoint
ALTER TABLE `admin` DROP COLUMN `lastName`;--> statement-breakpoint
ALTER TABLE `admin` DROP COLUMN `phoneNumber`;--> statement-breakpoint
ALTER TABLE `blog_post` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `blog_post_image` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `contact_form_entries` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `news_letter_form_entries` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `project` DROP COLUMN `startDate`;--> statement-breakpoint
ALTER TABLE `project` DROP COLUMN `endDate`;--> statement-breakpoint
ALTER TABLE `project` DROP COLUMN `githubLink`;--> statement-breakpoint
ALTER TABLE `project` DROP COLUMN `websiteLink`;--> statement-breakpoint
ALTER TABLE `project` DROP COLUMN `isFeatured`;--> statement-breakpoint
ALTER TABLE `project` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `project_image` DROP COLUMN `createdAt`;