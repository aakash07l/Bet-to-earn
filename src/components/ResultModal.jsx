import React from 'react';

export default function ResultModal({ open, data, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)'
    }}>
      <div style={{ background:'#041826', padding:20, borderRadius:12, minWidth:320 }}>
        <h3>Result</h3>
        <pre style={{ whiteSpace:'pre-wrap', color:'#bfe9d7' }}>{JSON.stringify(data, null, 2)}</pre>
        <div style={{ marginTop:10, textAlign:'right' }}>
          <button className="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
