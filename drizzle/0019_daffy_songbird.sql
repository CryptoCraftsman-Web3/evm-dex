ALTER TABLE `nft_cache_record` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `nft_cache_record` ADD PRIMARY KEY(`nft_contract_address`,`token_id`);