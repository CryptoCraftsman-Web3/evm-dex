ALTER TABLE `transactions` MODIFY COLUMN `block_hash` varchar(66);--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `block_number` bigint;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `status` enum('pending','success','reverted','other') NOT NULL;