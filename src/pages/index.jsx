import React from 'react';
import Head from 'next/head';
import WalletConnect from '../components/WalletConnect';
import BetUI from '../components/BetUI';
import ResultModal from '../components/ResultModal';
import useBetting from '../hooks/useBetting';
import { createConfig, WagmiConfig, configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { monadTestnet } from '../utils/monadConfig';
import { createPublicClient, http } from 'viem';
import { useState } from 'react';

const chainsConfig = configureChains(
  [monadTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: process.env.NEXT_PUBLIC_MONAD_RPC })
    }),
    publicProvider()
  ]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({ chain: monadTestnet, transport: http(process.env.NEXT_PUBLIC_MONAD_RPC) })
});

export default function HomePage() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
  const { bets, fetchBets, loading } = useBetting();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  return (
    <WagmiConfig config={wagmiConfig}>
      <Head>
        <title>Bet to Earn — Demo</title>
      </Head>
      <div className="container">
        <div className="header">
          <img className="logo" src="/logo.png" alt="logo" />
          <div>
            <h1 style={{ margin: 0 }}>Bet to Earn</h1>
            <div className="muted">Heads/Tails betting (demo) — contract payouts</div>
            <div style={{ marginTop: 8 }}>
              <WalletConnect />
            </div>
          </div>
        </div>

        <div style={{ height: 16 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <BetUI contractAddress={contractAddress} refreshBets={fetchBets} />
          <div className="card">
            <h3>On-chain Bets</h3>
            <div className="small muted">Contract: {contractAddress || 'Not configured'}</div>
            <div style={{ marginTop: 12 }}>
              {loading ? <div className="small">Loading bets...</div> : (
                <>
                  <table className="table">
                    <thead>
                      <tr><th>ID</th><th>Player</th><th>Amt</th><th>Choice</th><th>Resolved</th><th>Won</th></tr>
                    </thead>
                    <tbody>
                      {bets.length === 0 && <tr><td colSpan="6" className="small muted">No bets found</td></tr>}
                      {bets.map((b) => (
                        <tr key={b.id}>
                          <td>{b.id}</td>
                          <td style={{ fontSize: 13 }}>{b.player}</td>
                          <td>{b.amount}</td>
                          <td>{b.choice === 0 ? 'Heads' : 'Tails'}</td>
                          <td>{String(b.resolved)}</td>
                          <td>{b.won ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>

        <ResultModal open={modalOpen} data={modalData} onClose={() => setModalOpen(false)} />
      </div>
    </WagmiConfig>
  );
}
