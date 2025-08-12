import React, { useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { BetGameABI } from '../utils/contractABI';

export default function BetUI({ contractAddress, refreshBets }) {
  const { data: signer } = useSigner();
  const [choice, setChoice] = useState('0'); // 0 = Heads, 1 = Tails
  const [amount, setAmount] = useState('0.001');
  const [status, setStatus] = useState('');

  useEffect(() => {}, []);

  const placeBetOnChain = async () => {
    if (!signer) return setStatus('Connect wallet');
    try {
      setStatus('Sending transaction — please confirm in wallet...');
      const contract = new ethers.Contract(contractAddress, BetGameABI, signer);
      // send tx: placeBet(uint8 choice), payable
      const tx = await contract.placeBet(choice, { value: ethers.parseUnits(amount, 18) });
      setStatus('Tx sent. Waiting for confirmation...');
      await tx.wait();
      setStatus('Bet placed — tx: ' + tx.hash);
      if (typeof refreshBets === 'function') refreshBets();
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + (err?.message || err));
    }
  };

  return (
    <div className="card">
      <h3>Place a Bet</h3>
      <div className="small muted">Heads = even last byte, Tails = odd last byte (demo)</div>

      <div style={{ marginTop: 12 }}>
        <label className="small">Amount (tMON)</label><br />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: 140, padding: 8, marginTop: 6 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label className="small">Choice</label><br />
        <select value={choice} onChange={(e) => setChoice(e.target.value)} style={{ padding: 8, marginTop: 6 }}>
          <option value="0">Heads</option>
          <option value="1">Tails</option>
        </select>
      </div>

      <div style={{ marginTop: 14 }}>
        <button className="button" onClick={placeBetOnChain}>Place Bet (on-chain)</button>
      </div>

      <div style={{ marginTop: 10 }} className="small">Status: {status}</div>
    </div>
  );
}
