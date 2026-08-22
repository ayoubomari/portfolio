## Project Overview

Ruxaby is a decentralized marketplace built on the Algorand blockchain, designed to enable borderless, trustless, and low-fee e-commerce secured by on-chain escrow. Instead of relying on a bank, a payment processor, or a custodial account, buyers and sellers transact directly with each other while a smart contract holds the funds until the deal is honestly completed.

🌐 [Visit Ruxaby](https://ruxaby.com/) · 📚 [Documentation](https://github.com/ayoubomari/ruxaby-documentation)

## Why Algorand

The choice of blockchain was deliberate. Algorand gives the platform three properties that translate directly into a better buying/selling experience:

- **Instant finality** — transactions settle in under ~3 seconds, with no forks or re-organizations to worry about.
- **Negligible fees** — network fees cost a fraction of a cent, so they don't eat into small transactions the way card/bank fees do.
- **100% uptime track record** — the kind of reliability a marketplace needs to stay open for global commerce around the clock.

Payments are accepted in ALGO or USDC, with real-time conversion handled through Tinyman liquidity pools.

## Two Escrow Models

Not every product carries the same risk, so Ruxaby offers sellers a choice between two escrow flows:

### Trustful model

The classic escrow flow for physical, verifiable goods: the buyer pays into escrow, the seller ships and submits tracking, the buyer confirms receipt (or the contract auto-confirms after a buffer period), and funds release to the seller. If something goes wrong, either side can report the order and Ruxaby moderators review the evidence to resolve the dispute.

### P2P model with mutual collateral

Built for the hard-to-verify cases — gift cards, software licenses, event tickets, social media accounts, freelance/digital services — where a third party can't easily confirm authenticity after the fact. Both the buyer and the seller lock collateral in the smart contract before the sale ships. If either party tries to cheat, their own deposit stays frozen until a resolution is reached, so both sides have real skin in the game. There's no arbitrator to convince — just economic incentive to settle fairly.

## Core Product Features

- **Listings** with price (ALGO/USDC), description, delivery estimate, stock, shipping terms, and configurable collateral requirements
- **Non-custodial, signature-based login** — no passwords, no stored payment credentials, the user's wallet is their identity
- **On-chain, pseudonymous reviews** — a reviewer's wallet history provides context without exposing personal data
- **Order lifecycle tracking** through Pending → Processing → Delivered (or Reported, if disputed)
- **Testnet environment** at testnet.ruxaby.com for risk-free exploration before trading with real funds

## Technical Stack

- **Smart contracts**: Algorand (PyTeal/Beaker), including Tinyman integration for ALGO/USDC price conversion
- **Backend**: Golang with Fiber, Redis for caching/session state
- **Frontend**: Next.js, TypeScript, MUI
- **SDKs**: Algorand SDK for on-chain interactions

## My Role

I designed and built the platform end-to-end — from the escrow smart contracts and their dual Trustful/P2P lifecycles, to the Golang backend services, to the Next.js frontend and the accompanying documentation site.

## Conclusion

Ruxaby is an exploration of what e-commerce looks like when trust is enforced by code and economic incentives instead of a centralized intermediary — while still staying practical enough for everyday buyers and sellers to use.
