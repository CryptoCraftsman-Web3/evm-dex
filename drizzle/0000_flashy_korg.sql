CREATE TABLE `transactions` (
	`hash` varchar(66) NOT NULL,
	`block_hash` varchar(66) NOT NULL,
	`block_number` bigint NOT NULL,
	`chain_id` int NOT NULL,
	`from` varchar(42) NOT NULL,
	`to` varchar(42) NOT NULL,
	`gas` bigint NOT NULL,
	`gas_price` bigint NOT NULL,
	`max_fee_per_gas` bigint NOT NULL,
	`max_priority_fee_per_gas` bigint NOT NULL,
	`nonce` int NOT NULL,
	`type` varchar(12) NOT NULL,
	`tx_type` enum('swap','mint_liquidity_pool','approve') NOT NULL,
	`value` bigint NOT NULL,
	CONSTRAINT `transactions_hash` PRIMARY KEY(`hash`)
);
