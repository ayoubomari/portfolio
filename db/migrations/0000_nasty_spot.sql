CREATE TABLE `admin` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`avatar` varchar(255) NOT NULL,
	CONSTRAINT `admin_id` PRIMARY KEY(`id`)
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
	`createdAt` datetime NOT NULL,
	CONSTRAINT `blog_post_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_post_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_post_tag` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blog_post_id` int NOT NULL,
	`tag_id` int NOT NULL,
	CONSTRAINT `blog_post_tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_post_technologie` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blog_post_id` int NOT NULL,
	`technologie_id` int NOT NULL,
	CONSTRAINT `blog_post_technologie_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_form_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `contact_form_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news_letter_form_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `news_letter_form_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`thumbnail` varchar(255),
	`startDate` date,
	`endDate` date,
	`summary` varchar(255) NOT NULL,
	`githubLink` varchar(255),
	`websiteLink` varchar(255),
	`status` enum('visible','invisible') NOT NULL,
	`isFeatured` boolean NOT NULL,
	`createdAt` datetime NOT NULL,
	CONSTRAINT `project_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `project_tag` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`tag_id` int NOT NULL,
	CONSTRAINT `project_tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_technologie` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`technologie_id` int NOT NULL,
	CONSTRAINT `project_technologie_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` int AUTO_INCREMENT NOT NULL,
	`value` varchar(255) NOT NULL,
	CONSTRAINT `tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `technologie` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`icon` varchar(255),
	`link` varchar(255),
	CONSTRAINT `technologie_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blog_post_tag` ADD CONSTRAINT `blog_post_tag_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_tag` ADD CONSTRAINT `blog_post_tag_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_technologie` ADD CONSTRAINT `blog_post_technologie_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blog_post_technologie` ADD CONSTRAINT `blog_post_technologie_technologie_id_technologie_id_fk` FOREIGN KEY (`technologie_id`) REFERENCES `technologie`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_tag` ADD CONSTRAINT `project_tag_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_tag` ADD CONSTRAINT `project_tag_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_technologie` ADD CONSTRAINT `project_technologie_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_technologie` ADD CONSTRAINT `project_technologie_technologie_id_technologie_id_fk` FOREIGN KEY (`technologie_id`) REFERENCES `technologie`(`id`) ON DELETE no action ON UPDATE no action;