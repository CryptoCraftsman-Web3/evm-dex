ALTER TABLE `token_transfers` ADD `amount` float NOT NULL;--> statement-breakpoint
ALTER TABLE `token_transfers` DROP COLUMN `value`;