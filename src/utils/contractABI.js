export const BetGameABI = [
  // placeBet (payable)
  {
    "inputs": [
      { "internalType": "enum BetGame.BetChoice", "name": "_choice", "type": "uint8" }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },

  // resolveBet
  {
    "inputs": [{ "internalType": "uint256", "name": "_betId", "type": "uint256" }],
    "name": "resolveBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // betCount
  {
    "inputs": [],
    "name": "betCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },

  // bets getter (struct)
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "bets",
    "outputs": [
      { "internalType": "address", "name": "player", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint8", "name": "choice", "type": "uint8" },
      { "internalType": "bool", "name": "resolved", "type": "bool" },
      { "internalType": "bool", "name": "won", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
