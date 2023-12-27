CREATE TABLE `erc20_token` (
	`contract_address` varchar(42) NOT NULL,
	`name` varchar(255) NOT NULL,
	`symbol` varchar(255) NOT NULL,
	`decimals` int NOT NULL,
	CONSTRAINT `erc20_token_contract_address` PRIMARY KEY(`contract_address`)
);
