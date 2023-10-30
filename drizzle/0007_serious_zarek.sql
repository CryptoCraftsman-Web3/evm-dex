CREATE TABLE `token_transfers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chain_id` int NOT NULL,
	`from` varchar(42) NOT NULL,
	`direction` enum('in','out') NOT NULL,
	`value` bigint NOT NULL,
	`token_contract_address` varchar(42) NOT NULL,
	`token_decimals` int NOT NULL,
	`token_name` varchar(255) NOT NULL,
	`token_symbol` varchar(25) NOT NULL,
	`transaction_index` int NOT NULL,
	CONSTRAINT `token_transfers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`address` varchar(42) NOT NULL,
	`last_token_transfer_tx_hash` varchar(66),
	CONSTRAINT `user_address` PRIMARY KEY(`address`)
);
