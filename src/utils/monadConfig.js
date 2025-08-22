import { defineChain } from 'viem';

export const monadTestnet = defineChain({
  id: 5050, // replace with real Monad testnet chainId
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: { name: 'tMON', symbol: 'tMON', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_MONAD_RPC || 'https://rpc.testnet.monad.xyz'] },
    public: { http: [process.env.NEXT_PUBLIC_MONAD_RPC || 'https://rpc.testnet.monad.xyz'] }
  },
  testnet: true
});
