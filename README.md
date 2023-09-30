# SerpentSwap: XRPL EVM Sidechain DEX

Welcome to the SerpentSwap GitHub repository! SerpentSwap is a decentralized exchange (DEX) operating on the XRPL EVM Sidechain, employing the robust functionality of Uniswap V3. This repo contains the full source code for the SerpentSwap DEX application, with references to smart contracts and other components of the SerpentSwap ecosystem.

## Overview
SerpentSwap facilitates secure, fast, and seamless cryptocurrency trading without the necessity for intermediaries or centralized control. The project emphasizes optimal performance and security in the DEX environment.

## Prerequisites
1. Node.js 16 or higher
2. Yarn 1.22 or higher

## Getting Started
1. Install dependencies: `yarn install`
2. Copy `.env.example` to `.env` and fill in the values
3. Run the app: `yarn dev`

## Deployed Smart Contracts
We have already deployed the smart contracts to the XRPL Devnet EVM Sidechain as well as to Sepolia Testnet. For reference, the deployed addreses are in this [notion page](https://fringe-mitten-485.notion.site/27badfb1b80242379ca0c8ba27c7176c?v=5f122de935e540069ac5e2cb0678be54&pvs=4).

## Project Structure
- This web application is built using Next.js 13 using the app router pattern, where the routes are defined in the `app` folder.
- This also follows common Next.js folder structure such as `components`, `lib`, and `types`.
- Currently there are two working top-level routes
  - `/swap` - This page is where users can swap tokens. Home page redirects to this page.
  - `/pools` - This page is where users can add/remove liquidity to/from a pool.
- Interacting with smart contracts
  - Connecting to wallets is done using ConnectKit
  - Interacting with smart contracts is primarily done using [wagmi.sh](https://wagmi.sh)
  - `callstatic` calls are not supported by wagmi/Viem, so we do have to use [ethers.js](https://docs.ethers.io/v5/) for those calls

## Smart Contract Repositories
The smart contracts used in SerpentSwap are located in the following repositories. The contracts are written in Solidity, deployed and maintained using Hardhat.
1. [Custom Smart Contracts by SerpentSwap](https://github.com/Serpent-Swap/solidity-smart-contracts)
2. [Forked Uniswap V3 Core](https://github.com/Serpent-Swap/uniswap-v3-core)
3. [Forked Uniswap V3 Periphery](https://github.com/Serpent-Swap/uniswap-v3-periphery)
4. [Forked Universal Router](https://github.com/Serpent-Swap/universal-router)

## Notes

### **Slot 0 in Pool Contract**
Uniswap V3 introduced a lot of new concepts and features, one of which is the way it handles liquidity. In V3, liquidity is not provided across the entire price range but rather within specific price ranges. This allows liquidity providers (LPs) to specify a price range for their liquidity, which can result in more efficient capital usage.
The way Uniswap V3 manages this is through a data structure called a "doubly-linked list" of "ticks." Each tick represents a specific price level. Ticks are points in price space where the relative weights of assets in the pool cross an integer value, which implies a potential fee-earning event for liquidity that is active across that price.
To efficiently manage and update the liquidity between these specific price points, Uniswap V3 uses "slots."
Now, slot0 in the Uniswap V3 pool contract is particularly important. It's a struct that contains key data that can change frequently:
sqrtPriceX96: This is the current price of the pool, but it's stored as the square root and has been multiplied by a large constant (2^96) to allow for fixed-point arithmetic. The square root storage allows for some gas optimization.
tick: This is the current tick of the pool. It represents the closest, previously initialized tick below the current price.
observationIndex: This is an index that points to the most recent observation (used for TWAPs - Time-Weighted Average Prices) in the circular buffer.
And a few other variables related to the management of observations and protocol fees.
slot0 is essentially a quick way to get the most up-to-date and frequently-accessed information about the state of the pool, without having to iterate over or look up many storage slots.
To summarize, slot0 is a central storage location in Uniswap V3's smart contract that holds the current state of the pool, including the current price, tick, and other key parameters.

### **Uniswap V3 Math Primer**
https://blog.uniswap.org/uniswap-v3-math-primer