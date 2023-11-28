CREATE TABLE `nft_contract_cached_log` (
	`nft_contract_address` varchar(42) NOT NULL,
	`nft_contract_name` varchar(1000) NOT NULL,
	`nft_contract_symbol` varchar(20) NOT NULL,
	`last_cached` datetime NOT NULL
);
