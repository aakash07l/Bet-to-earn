import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {isConnected ? (
        <>
          <div className="small">Connected: {address}</div>
          <button className="button" onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <button className="button" onClick={() => connect()}>Connect Wallet</button>
      )}
    </div>
  );
}
