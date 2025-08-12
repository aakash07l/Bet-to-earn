// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BetGame {
    address public owner;

    enum BetChoice { Heads, Tails }

    struct Bet {
        address player;
        uint256 amount;
        BetChoice choice;
        bool resolved;
        bool won;
    }

    mapping(uint256 => Bet) public bets;
    uint256 public betCount;

    event BetPlaced(uint256 indexed id, address indexed player, uint256 amount, BetChoice choice);
    event BetResolved(uint256 indexed id, address indexed player, bool won, BetChoice result);

    constructor() {
        owner = msg.sender;
    }

    // Player places a bet by calling this function and sending native token value
    function placeBet(BetChoice _choice) external payable {
        require(msg.value > 0, "Bet amount required");

        bets[betCount] = Bet({
            player: msg.sender,
            amount: msg.value,
            choice: _choice,
            resolved: false,
            won: false
        });

        emit BetPlaced(betCount, msg.sender, msg.value, _choice);
        betCount++;
    }

    // Resolve a bet using previous blockhash parity. Anyone (or owner) may call.
    // NOTE: Using blockhash for randomness is insecure and for demo/testnet only.
    function resolveBet(uint256 _betId) external {
        Bet storage bet = bets[_betId];
        require(!bet.resolved, "Already resolved");
        require(bet.amount > 0, "Bet not found");

        // use blockhash(block.number - 1) for deterministic randomness
        bytes32 bh = blockhash(block.number - 1);
        require(bh != bytes32(0), "Blockhash not available");

        uint256 random = uint256(uint8(bh[31])) % 2; // last byte parity
        BetChoice result = random == 0 ? BetChoice.Heads : BetChoice.Tails;

        bet.resolved = true;
        if (bet.choice == result) {
            bet.won = true;
            // winner gets double amount (2x)
            (bool sent, ) = bet.player.call{value: bet.amount * 2}("");
            // If transfer fails, keep funds in contract for manual withdrawal by owner
            if (!sent) {
                bet.won = true; // still mark won; owner can withdraw later if needed
            }
        } else {
            // losing amount goes to owner
            (bool sentOwner, ) = owner.call{value: bet.amount}("");
            if (!sentOwner) {
                // if fail, keep funds in contract
            }
        }

        emit BetResolved(_betId, bet.player, bet.won, result);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
    fallback() external payable {}
}
