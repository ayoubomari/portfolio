CREATE TABLE `blog_post_image` (
	`id` int AUTO_INCREMENT NOT NULL,
	`src` varchar(255) NOT NULL,
	`alt` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL,
	`blog_post_id` int NOT NULL,
	CONSTRAINT `blog_post_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_image` (
	`id` int AUTO_INCREMENT NOT NULL,
	`src` varchar(255) NOT NULL,
	`alt` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL,
	`project_id` int NOT NULL,
	CONSTRAINT `project_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blog_post_image` ADD CONSTRAINT `blog_post_image_blog_post_id_blog_post_id_fk` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_post`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_image` ADD CONSTRAINT `project_image_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE no action ON UPDATE no action;