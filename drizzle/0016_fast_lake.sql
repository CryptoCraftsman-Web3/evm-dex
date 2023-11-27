CREATE TABLE `nft_cache_record` (
	`nft_contract_address` varchar(42) NOT NULL,
	`token_id` int NOT NULL,
	`owner_address` varchar(42) NOT NULL,
	`token_uri` varchar(1024) NOT NULL,
	`last_updated` datetime NOT NULL,
	CONSTRAINT `nft_cache_record_nft_contract_address_token_id_owner_address_pk` PRIMARY KEY(`nft_contract_address`,`token_id`,`owner_address`)
);
