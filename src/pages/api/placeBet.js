// src/pages/api/placeBet.js
import { ethers } from 'ethers';
import { BetGameABI } from '../../../utils/contractABI';

const RPC = process.env.MONAD_RPC || process.env.NEXT_PUBLIC_MONAD_RPC;
const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!RPC || !CONTRACT || !ADMIN_PRIVATE_KEY) {
    return res.status(500).json({ error: 'RPC, CONTRACT or ADMIN_PRIVATE_KEY missing in env' });
  }
  try {
    const { betId } = req.body;
    if (betId === undefined) return res.status(400).json({ error: 'missing betId' });

    const provider = new ethers.JsonRpcProvider(RPC);
    const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT, BetGameABI, wallet);

    const tx = await contract.resolveBet(betId);
    const receipt = await tx.wait();
    res.status(200).json({ txHash: tx.hash, receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed', details: String(err) });
  }
}
