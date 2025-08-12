# Bet to Earn — Demo

## What this repo contains
- Smart contract `contracts/BetGame.sol` — demo betting contract (payouts inside contract).
- Next.js frontend (src/) with Wagmi wallet connect and UI for placing bets from a user's wallet.
- Serverless APIs (src/pages/api/) to read on-chain bets and to trigger `resolveBet` on-chain using server's private key.

## Quick steps
1. Deploy `BetGame.sol` to Monad testnet (or other testnet). Save contract address.
2. Add environment variables (Vercel):
   - `NEXT_PUBLIC_MONAD_RPC` = your RPC
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = deployed contract address
   - `MONAD_RPC` = your RPC (used server-side)
   - `ADMIN_PRIVATE_KEY` = private key for resolution (must be funded!)
3. Push to GitHub and import to Vercel.
4. Open app, connect wallet, place a bet (this sends an on-chain tx).
5. To resolve a specific bet id, call `POST /api/placeBet` with JSON `{ "betId": <id> }` from admin (this will call contract.resolveBet and trigger payouts).

## Security notes
- Using blockhash for randomness is insecure for real money.
- KEEP `ADMIN_PRIVATE_KEY` secret. Use multisig or secure signing in production.
- For production store logs and use a DB for coordination. Consider gas & reorg protections.

