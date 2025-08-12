// src/pages/api/getResult.js
import { ethers } from 'ethers';

const RPC = process.env.NEXT_PUBLIC_MONAD_RPC || process.env.MONAD_RPC;
const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default async function handler(req, res) {
  if (!RPC || !CONTRACT) {
    return res.status(500).json({ error: 'MONAD RPC or CONTRACT not set in env' });
  }
  try {
    const provider = new ethers.JsonRpcProvider(RPC);
    const contract = new ethers.Contract(CONTRACT, BetGameABI, provider);

    const countBN = await contract.betCount();
    const count = Number(countBN);
    const out = [];

    // Limit reading to last 200 bets to avoid heavy loops
    const start = Math.max(0, count - 200);
    for (let i = start; i < count; i++) {
      try {
        const b = await contract.bets(i);
        out.push({
          id: i,
          player: b.player,
          amount: ethers.formatUnits(b.amount, 18),
          choice: Number(b.choice),
          resolved: b.resolved,
          won: b.won
        });
      } catch (e) {
        console.warn('read bet error', i, e?.message || e);
      }
    }
    res.status(200).json(out.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed', details: String(err) });
  }
}
