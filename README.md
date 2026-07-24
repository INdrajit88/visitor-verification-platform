# Visitor Verification Platform (VVP) - Level 2 Enhanced
> A privacy-preserving zero-knowledge visitor verification platform built on the Midnight Network using Compact smart contracts.

[![Midnight Preprod](https://img.shields.io/badge/Network-Midnight_Preprod-8b5cf6?style=flat-square)](https://explorer.preprod.midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-v0.5.1-06b6d4?style=flat-square)](https://midnight.network)
[![Level 2 Enhanced](https://img.shields.io/badge/Challenge-Level_2_Passed-f59e0b?style=flat-square)](https://github.com/INdrajit88/visitor-verification-platform)
[![Node.js Version](https://img.shields.io/badge/Node.js-v22.23.1-10b981?style=flat-square)](https://nodejs.org)
[![Commits](https://img.shields.io/badge/Commits-12+_Commits-success?style=flat-square)](https://github.com/INdrajit88/visitor-verification-platform/commits/main)
[![License](https://img.shields.io/badge/License-MIT-blue.style=flat-square)](LICENSE)

---

## 📋 Submission & Passing Checklist
- [x] **Public GitHub Repository**: [https://github.com/INdrajit88/visitor-verification-platform](https://github.com/INdrajit88/visitor-verification-platform)
- [x] **Deployed Preprod Contract Address**: `0x187ab583926a5ff2e4819242a95edc8dfa8ff784`
- [x] **Verifiable On-Chain Link**: [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network)
- [x] **Strict Browser Extension Wallet Connection**: Connects strictly to user's browser Midnight Lace Wallet (`window.midnight.mnLace` / `window.midnight.lace`) with zero demo fallbacks
- [x] **Lace Wallet Connect / Disconnect Implemented**: Complete connection lifecycle with event prompts and error handling
- [x] **Circuit Called Successfully from Frontend**: Executed via `verifyVisitor()` circuit integration in `src/integration/contract.ts`
- [x] **Level 2 Multi-Witness Implementation**: Dual witness vectors (`secretPasscode()` + `visitorNonce()`) in Compact circuit
- [x] **Observable Privacy Behavior Documented**: Private witnesses proven via Zero-Knowledge circuit without on-chain disclosure
- [x] **Minimum 8+ Meaningful Commits**: Verified 12+ structured commits in main branch history
- [x] **Multi-Page Animated UI & Pattern Background**: Built home landing page with dot grid pattern

---

## Contract Address
| Network  | Contract Address | Verification / Explorer Link |
|----------|------------------|------------------------------|
| **Preprod** | `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` | [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |

> [!NOTE]
> Deployed contract `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` is live on Midnight Preprod Testnet and connected to the local ZK Proof Server running on port `6300`.

---

## 🔑 Strict Browser Wallet Integration (`window.midnight.mnLace`)
```typescript
// Connect strictly to user's browser Midnight Lace Wallet extension
public async connectWallet(): Promise<{ connected: boolean; walletAddress: string }> {
  if (typeof window === 'undefined') {
    throw new Error("Browser environment required.");
  }

  const midnightObj = (window as any).midnight;
  const laceProvider = midnightObj?.mnLace || midnightObj?.lace;

  if (!laceProvider) {
    throw new Error("Midnight Lace Wallet extension not detected in your browser. Please install/enable the Midnight Lace Wallet browser extension to sign in.");
  }

  const api = await laceProvider.enable();
  const state = await api.state();
  this.isConnected = true;
  this.connectedAddress = state.address;
  return { connected: true, walletAddress: state.address };
}
```

---

## 🛡️ Observable Privacy Behavior Claim
**What is proven without being shown:**
- The visitor proves to the smart contract that they possess a valid, authorized passcode for the active venue (`verifierId`) **without exposing their raw passcode, entropy nonce, or identity on-chain**.
- **Cryptographic Mechanism**:
  1. The visitor's raw secret passcode and entropy nonce are supplied strictly to local witness functions (`secretPasscode()`, `visitorNonce()`).
  2. Inside the ZK circuit (`contracts/counter.compact`), `persistentHash` computes a cryptographic commitment hash:
     ```compact
     const visitorCommitment = persistentHash<Vector<3, Bytes<32>>>([
       pad(32, "vvp:visitor:commitment"),
       passcode,
       nonce
     ]);
     ```
  3. Only the commitment hash and incremented visitor count are disclosed via `disclose()` and written to the public ledger (`lastVisitorCommitment`).
  4. The raw passcode and entropy nonce values never leave the visitor's local device.

---

## What This Does
The **Visitor Verification Platform (VVP)** enables visitors to verify their access authorization for physical or digital venues (e.g. corporate offices, stadium gates, VIP lounges, restricted event zones) without leaking sensitive personal credentials or unencrypted passcodes onto the public blockchain.

---

## Tech Stack
- **Network**: Midnight Testnet (Preprod)
- **Smart Contract Language**: Compact (`0.5.1`)
- **Runtime & Toolchain**: Node.js v22 (`v22.23.1`), TypeScript, Vitest
- **Zero-Knowledge Infrastructure**: Midnight Proof Server (`midnightntwrk/proof-server:8.1.0` on port 6300)

---

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/INdrajit88/visitor-verification-platform.git
   cd visitor-verification-platform
   ```

2. **Set Node version and install dependencies**:
   ```bash
   nvm use 22
   npm install
   ```

3. **Start the Midnight Proof Server container**:
   ```bash
   docker run -d -p 6300:6300 midnightntwrk/proof-server:8.1.0
   ```

4. **Compile the Compact contract**:
   ```bash
   compact compile contracts/counter.compact managed
   ```

5. **Start Local Dev Server**:
   ```bash
   npm run dev
   ```

---

## Run Tests
Run the automated test suite:
```bash
npm test
```

Expected Output:
```text
 ✓ tests/counter.test.ts (3 tests) 1ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

---

## Screenshots
![Visitor Verification Platform Screenshot](screenshot.png)